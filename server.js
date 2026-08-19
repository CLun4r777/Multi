(async () => {
    const { Worker } = await import("worker_threads");
    const { WebSocketServer } = await import("ws");
    const { pack, unpack } = await import("msgpackr");
    const http = await import("http");
    const fetch = globalThis.fetch ?? (await import("node-fetch")).default;
    const { normalizeMainTickMs, getSpawnDelayMs, getSwarmBatchId, parseSpawnPacket } = await import("./resource-utils.js");

    const prod = false;

    const PROXIES = ["http:Lnoproxyforyall1-ttl-0:izsKF3kW63QYVhF-ww.lightningproxies.net:1338"];
    const MAX_BOTS = 256;
    const SHARED_STATE_SIZE = 16 + MAX_BOTS * 2;

    console.log("Master: Loading local WASM and Game Script...");

    const fs = require("fs");
    const path = require("path");

    // Load local app.wasm (no internet needed for startup)
    const wasmPath = path.join(__dirname, "app.wasm");
    console.log("Master: Loading WASM from", wasmPath);
    const wasmBuffer = fs.readFileSync(wasmPath);

    // Load local index.html and extract the game script
    const htmlPath = path.join(__dirname, "index.html");
    console.log("Master: Loading game script from", htmlPath);
    const html = fs.readFileSync(htmlPath, "utf8");
    
    // Extract script from HTML
    const scriptTagStart = html.indexOf('<script>');
    const scriptStart = scriptTagStart + 8;
    const scriptTagEnd = html.indexOf('</script>', scriptStart);
    const gameScript = html.slice(scriptStart, scriptTagEnd);

    const sharedWasm = await WebAssembly.compile(wasmBuffer);
    console.log("Master: WASM fully compiled and ready to share.");

    // HTTP SERVER
    const server = http.createServer((req, res) => {
        res.writeHead(426, { "Content-Type": "text/plain" });
        res.end("rexxy on top");
    });

    // WS SERVER
    function randint(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    const sessions = new Map();
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const addr = req.socket.remoteAddress;
        console.log(addr, "connected");

        // Initialize or retrieve session for this IP
        if (!sessions.has(addr)) {
            const sharedState = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * SHARED_STATE_SIZE);
            const sharedStateArray = new Float32Array(sharedState);
            // Initialize default common state values
            sharedStateArray[11] = 0;
            sharedStateArray[15] = 0;
            sessions.set(addr, {
                workers: [],
                batches: {
                    swarm1: {
                        workers: [],
                        tank: "auto6",
                        tanks: [],
                        tankIdx: 0,
                        proxyIdx: 0,
                    },
                    swarm2: {
                        workers: [],
                        tank: "auto6",
                        tanks: [],
                        tankIdx: 0,
                        proxyIdx: 0,
                    }
                },
                tank: "auto6",
                tanks: [],
                tankIdx: 0,
                proxyIdx: 0,
                sharedState,
                sharedStateArray
            });
        }
        const session = sessions.get(addr);

        function getBatchState(batchId = "swarm1") {
            const key = getSwarmBatchId(batchId);
            if (!session.batches[key]) {
                session.batches[key] = {
                    workers: [],
                    tank: "auto6",
                    tanks: [],
                    tankIdx: 0,
                    proxyIdx: 0,
                };
            }
            return session.batches[key];
        }

        function getAllWorkersForSession() {
            return Object.values(session.batches).flatMap(batch => batch.workers || []);
        }

        let challenge;
        let verified = false;

        function packet(...args) {
            ws.send(pack(args));
        }

        function close() {
            ws.close();
        }

        ws.on("message", (msg) => {
            try {
                const data = unpack(msg);
                const type = data.shift();

                switch (type) {
                    case "M":
                        if (challenge || data[0] != 72011) {
                            close();
                        }
                        challenge = randint(0b1000000000, 0b1111111111);
                        packet("M", challenge);
                        break;

                    case "C":
                        if (data[0] == (challenge ^ 845)) {
                            verified = true;
                            console.log(addr, "verified");
                        } else {
                            close();
                            console.log(addr, "true noob")
                        }
                        break;

                    case "Z":
                        {
                            const batchId = getSwarmBatchId(data[1] || "swarm1");
                            const batch = getBatchState(batchId);
                            batch.tank = data[0];
                            if (batch.tank instanceof Array) {
                                batch.tanks = batch.tank;
                                batch.tankIdx = 0;

                                for (const worker of batch.workers) {
                                    const t = batch.tanks[batch.tankIdx];
                                    worker.postMessage({ type: "tankselect", tank: t });

                                    batch.tankIdx++;
                                    if (batch.tankIdx >= batch.tanks.length) {
                                        batch.tankIdx = 0;
                                    }
                                }
                            } else {
                                batch.tanks = [];
                                for (const worker of batch.workers) {
                                    worker.postMessage({ type: "tankselect", tank: batch.tank });
                                }
                            }
                        }
                        break;

                    case "F":
                        if (verified) {
                            const configPacket = parseSpawnPacket(data);
                            const { hash, count, customName, spawnDelay, mainTickMs, autoRespawn, batchId, tank, autofire, autospin } = configPacket;
                            const circlePoints = Array.isArray(data[10]) ? data[10] : (Array.isArray(data[11]) ? data[11] : null);
                            const batch = getBatchState(batchId);

                            console.log(`Starting spawn sequence for ${count} bots named "${customName}" in ${batchId} (Hash: ${hash}, delay: ${spawnDelay}ms, tick: ${mainTickMs}ms, autoRespawn: ${autoRespawn}, tank: ${tank || batch.tank})`);

                            (async () => {
                                for (let i = 0; i < count; i++) {
                                    if (batch.proxyIdx >= PROXIES.length) {
                                        batch.proxyIdx = 0;
                                    }

                                    const globalBotIndex = getAllWorkersForSession().length;
                                    const worker = new Worker("./index.js", {
                                        workerData: { sharedState: session.sharedState }
                                    });
                                    worker.botIndex = globalBotIndex;
                                    batch.workers.push(worker);
                                    if (worker.unref) {
                                        worker.unref();
                                    }

                                    worker.on("error", (err) => {
                                        console.error(`Worker ${batchId} ${i} error:`, err);
                                    });
                                    worker.on("exit", (code) => {
                                        if (code !== 0) {
                                            console.error(`Worker ${batchId} ${i} exited with code ${code}`);
                                        } else {
                                            console.log(`Worker ${batchId} ${i} exited cleanly.`);
                                        }
                                    });

                                    const selectedTank = batch.tanks.length
                                        ? batch.tanks[batch.tankIdx]
                                        : (tank || batch.tank);

                                    if (batch.tanks.length) {
                                        worker.postMessage({ type: "tankselect", tank: selectedTank });
                                        batch.tankIdx++;
                                        if (batch.tankIdx >= batch.tanks.length) {
                                            batch.tankIdx = 0;
                                        }
                                    } else {
                                        worker.postMessage({ type: "tankselect", tank: selectedTank });
                                    }

                                    worker.postMessage({
                                        type: "start",
                                        sharedWasm: sharedWasm,
                                        gameScript: gameScript,
                                        config: {
                                            id: globalBotIndex,
                                            proxy: {
                                                type: "http",
                                                url: PROXIES[batch.proxyIdx]
                                            },
                                            hash: "#" + hash,
                                            name: customName,
                                            stats: [0, 0, 0, 0, 0, 0, 0, 9],
                                            type: "follow",
                                            token: "follow-8fe6ca",
                                            autoFire: autofire,
                                            autoRespawn: autoRespawn,
                                            keys: [],
                                            keysHold: [],
                                            tank: selectedTank,
                                            chatSpam: "",
                                            mainTickMs: mainTickMs,
                                            squadId: `${hash}-${batchId}`,
                                            batchId,
                                            reconnectAttempts: 3,
                                            reconnectDelay: 15000,
                                            circlePoints: circlePoints && circlePoints.length ? circlePoints.slice() : null,
                                        }
                                    });

                                    batch.proxyIdx++;
                                    if ((i + 1) % 10 === 0 || i + 1 === count) {
                                        console.log(`Spawned bot ${i + 1}/${count} into ${batchId}`);
                                    }

                                    if (i + 1 < count) {
                                        const safeSpawnDelay = getSpawnDelayMs(spawnDelay);
                                        await new Promise(resolve => setTimeout(resolve, safeSpawnDelay));
                                    }
                                }
                                console.log(`All bots for ${batchId} successfully spawned!`);
                            })();
                        }
                        break;

                    case "B":
                        if (verified) {
                            const batchId = getSwarmBatchId(data[0] || "swarm1");
                            const batch = getBatchState(batchId);
                            for (const worker of batch.workers) {
                                worker.postMessage({ type: "destroy" });
                            }
                            batch.workers = [];
                        }
                        break;

                    case "A":
                        if (verified) {
                            const swarm2Coords = Array.isArray(data[16]) ? data[16] : null;
                            const s = session.sharedStateArray;
                            if (s) {
                                const rawX = data[0];
                                const rawY = data[1];
                                const hasCoords = rawX !== null && rawX !== undefined && rawY !== null && rawY !== undefined
                                    && Number.isFinite(Number(rawX)) && Number.isFinite(Number(rawY));
                                const swarm1Mask = Number(data[14]) || 0;
                                const swarm2Mask = Number(data[15]) || 0;
                                s[0] = hasCoords ? Number(rawX) : NaN;
                                s[1] = hasCoords ? Number(rawY) : NaN;
                                s[2] = data[2] || 0;
                                s[3] = data[3] || 0;
                                s[4] = data[4] ? 1 : 0;
                                s[5] = data[5] ? 1 : 0;
                                s[6] = data[6] ? 1 : 0;
                                s[7] = data[7] ? 1 : 0;
                                s[8] = data[8] ? 1 : 0;
                                s[9] = data[9] ? 1 : 0;
                                s[10] = data[10] ? 1 : 0;
                                s[11] = data[11] ? 1 : 0;
                                s[12] = data[12] || 0;
                                s[13] = data[13] || 0;
                                s[14] = swarm1Mask;
                                s[15] = swarm2Mask;

                                const allWorkers = getAllWorkersForSession();
                                const pairsCount = Math.min(allWorkers.length, MAX_BOTS);
                                for (let i = 0; i < pairsCount; i++) {
                                    const idx = i * 2;
                                    s[16 + idx] = NaN;
                                    s[16 + idx + 1] = NaN;
                                }

                                const swarm2Workers = (session.batches.swarm2 && session.batches.swarm2.workers) || [];
                                for (let i = 0; i < swarm2Workers.length; i++) {
                                    const worker = swarm2Workers[i];
                                    const workerIndex = Number(worker?.botIndex ?? i);
                                    const targetIndex = workerIndex * 2;
                                    const x = swarm2Coords && swarm2Coords.length >= targetIndex + 2 ? swarm2Coords[targetIndex] : NaN;
                                    const y = swarm2Coords && swarm2Coords.length >= targetIndex + 2 ? swarm2Coords[targetIndex + 1] : NaN;
                                    if (Number.isFinite(x) && Number.isFinite(y)) {
                                        s[16 + targetIndex] = Number(x);
                                        s[16 + targetIndex + 1] = Number(y);
                                    }
                                }
                            }
                        }
                        break;

                    case "T":
                        if (verified) {
                            for (const worker of getAllWorkersForSession()) {
                                worker.postMessage({
                                    type: "chat",
                                    message: data[0],
                                    spam: data[1]
                                });
                            }
                        }
                        break;

                    default:
                        close();
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        });

        ws.on("close", () => {
            console.log(addr, "disconnected (session retained)");
        });
    });

    const port = prod ? process.env.PORT : 8082;
    server.listen(port, () => {
        console.log("Server listening on port", port);
    });
})();