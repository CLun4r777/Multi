(async () => {
    const { fork } = await import("child_process");
    const { WebSocketServer } = await import("ws");
    const { pack, unpack } = await import("msgpackr");
    const http = await import("http");
    const fs = await import("fs");
    const path = await import("path");


    const fallbackProxies = ["http:Lnoproxyforyall1-ttl-0:izsKF3kW63QYVhF-ww.lightningproxies.net:1338"];
    const useProxyList = false;
    const proxyPoolPath = path.join(process.cwd(), "proxies.txt");

    function toProxyUrl(line) {
        const parts = line.trim().split(":");
        if (parts.length < 2) return null;

        const [host, port, username, password] = parts;
        if (!host || !port) return null;

        if (username && password) {
            return `http://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
        }

        return `http://${host}:${port}`;
    }

    let proxyPool = [];
    if (useProxyList) {
        try {
            const rawPool = fs.readFileSync(proxyPoolPath, "utf8");
            proxyPool = rawPool
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line && !line.startsWith("#"))
                .map(toProxyUrl)
                .filter(Boolean);
        } catch (err) {
            console.warn("Failed to load proxies.txt, continuing with fallback proxies only.");
        }
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Default behavior is to use external rotating proxies (fallbackProxies).
    // Enable useProxyList if you explicitly want to include proxies.txt in rotation.
    const PROXIES = shuffle([...(useProxyList ? proxyPool : []), ...fallbackProxies]);
    const prod = false;

    // HTTP SERVER
    const server = http.createServer((req, res) => {
        res.writeHead(426, {"Content-Type": "text/plain"});
        res.end("lll elk ez big fat noob");
    });


    // WS SERVER
    function randint(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const addr = req.socket.remoteAddress
        console.log(addr, "connected");

        let workers = [];
        let challenge;
        let verified = false;

        let tank = "Auto-6";
        let tanks = [];
        let tankIdx = 0;

        let proxyIdx = randint(0, Math.max(0, PROXIES.length - 1));


        function packet(...args) {
            ws.send(pack(args));
        }

        function close() {
            ws.close();
            for (const worker of workers) {
                worker.send({ type: "destroy" });
            }
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
                        tank = data[0];
                        if (tank instanceof Array) {
                            tanks = tank;
                            tankIdx = 0;

                            for (const worker of workers) {
                                tank = tanks[tankIdx];
                                worker.send({ type: "tankselect", tank });

                                tankIdx++;
                                if (tankIdx >= tanks.length) {
                                    tankIdx = 0;
                                }
                            }
                        } else {
                            tanks = [];
                            for (const worker of workers) {
                                worker.send({ type: "tankselect", tank })
                            }
                        }

                        break;

                    case "F":
                        if (verified) {
                            if (!PROXIES.length) {
                                console.error("No proxies configured. Connection request skipped.");
                                break;
                            }

                            if (proxyIdx >= PROXIES.length) {
                                proxyIdx = 0;
                            }
                            console.log("connecting with proxy", PROXIES[proxyIdx])

                            const worker = fork("index.js", []);
                            workers.push(worker);

                            if (tanks.length) {
                                worker.send({ type: "tankselect", tank: tanks[tankIdx] });
                                tankIdx++;
                                if (tankIdx >= tanks.length) {
                                    tankIdx = 0;
                                }
                            } else {
                                worker.send({ type: "tankselect", tank });
                            }

                            worker.send({ type: "start", config: {
                                id: 0,
                                proxy: {
                                    type: "http",
                                    url: PROXIES[proxyIdx]
                                },
                                hash: "#" + data[0],
                                name: "DaNs bots",
                                stats: [2,2,4,9,3,9,9,0,0,0],
                                type: "follow",
                                token: "follow-8fe6ca",
                                autoFire: false,
                                autoRespawn: true,
                                keys: [],
                                keysHold: [],
                                tank: "Auto4",
                                chatSpam: "",
                                squadId: data[0],
                                reconnectAttempts: 3,
                                reconnectDelay: 15000,
                            }});

                            proxyIdx++;
                        }

                        break;

                    case "B":
                        if (verified) {
                            for (const worker of workers) {
                                worker.send({ type: "destroy" });
                            }
                            workers = [];
                        }

                        break;

                    case "A":
                        if (verified) {
                            for (const worker of workers) {
                                worker.send({
                                    type: "position",
                                    x: data[0],
                                    y: data[1],
                                    mouseX: data[2],
                                    mouseY: data[3],
                                    mouseDown: data[4],
                                    rMouseDown: data[5],
                                    mouse: data[6],
                                    feeding: data[7],
                                    shift: data[8]
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
            for (const worker of workers) {
                worker.send({ type: "destroy" });
            }

            console.log(addr, "disconnected");
        });
    });


    const port = prod ? process.env.PORT : 8082;
    server.listen(port, () => {
        console.log("Server listening on port", port);
    });
})();
