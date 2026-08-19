// ==UserScript==
// @name         Noob Controller
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  7777
// @author       7777
// @match        *://arras.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arras.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @grant        none
// ==/UserScript==



let menu = document.createElement("div");
menu.id = "scriptMenu";

menu.style.position = "fixed";
menu.style.top = "50%";
menu.style.left = "50%";
menu.style.transform = "translate(-50%, -50%)";
menu.style.width = "500px";
menu.style.height = "400px";

menu.style.background = "rgba(0,0,0,0.7)";
menu.style.color = "white";

menu.style.font = "17px Ubuntu";
menu.style.zIndex = 7777;
menu.style.borderRadius = "10px";
menu.style.fontSize = "20px";
menu.style.padding = "10px";

menu.style.display = "block";
menu.style.gap = "10px";


// MENU HTML
menu.innerHTML = `
<p>
    <b>Server:</b> <span id="serverStatus">❌ Connecting...</span>
</p>
<p>
    <button id="reconnectServer">Reconnect to server</button>
</p>
<p>
    Tank <select id="tankSelect"></select>
</p>
<p>
    Server hash <input id="serverHash"></input>
</p>
<p>
    Following mouse <input id="mbs" type="checkbox" checked></input>
</p>
<p>
    Feed <input id="feeding" type="checkbox"></input>
</p>
<p>
    <button id="connectNoob">Connect a Bot</button>
</p>
<p>
    <button id="deleteNoobs">Kill All Bots</button>
</p>
`;

document.body.appendChild(menu);

const getEl = id => document.getElementById(id);
const HTML = {
    serverStatus: getEl("serverStatus"),
    reconnectServer: getEl("reconnectServer"),

    tankSelect: getEl("tankSelect"),
    serverHash: getEl("serverHash"),
    mbs: getEl("mbs"),
    feeding: getEl("feeding"),

    connectNoob: getEl("connectNoob"),
    deleteNoobs: getEl("deleteNoobs")
};


// TANK SELECT
const tanks = {
    basic: {
        name: "Basic"
    },
     gale: {
        name: "Gale"
    },
    auto6: {
        name: "Auto-4/6"
    },
    mega3: {
        name: "Mega-3"
    },
    rocket: {
        name: "Rocket (ram)"
    },
    anni: {
        name: "Annihilator"
    },
    shotgun: {
        name: "Shotgun"
    },
    pursuer: {
        name: "Pursuer"
    },

    engineer: {
        name: "Engineer"
    },
    assembler: {
        name: "Assembler"
    },
    architect: {
        name: "Architect"
    },

    firework: {
        name: "Firework"
    },
    coli: {
        name: "Collision"
    },
    levi: {
        name: "Leviathan"
    },
    spike: {
        name: "Spike"
    },
    thorn: {
        name: "Thorn"
    },
    slammer: {
        name: "Slammer"
    },
    basher: {
        name: "Basher"
    },
    phys: {
        name: "Physician"
    },

    triangle: {
        name: "Tri-Angle",
        tanks: ["fighter", "autotriangle", "surfer", "eagle", "bomber", "vulture", "phoenix"]
    },
    triangle_ar: {
        name: "Tri-Angle (Arms race)",
        tanks: ["browser", "strider", "autobomber", "tripleautotriangle", "surferdrive", "electrocutor", "kicker", "megaautotriangle", "roller", "autoeagle"]
    },
    launchers: {
        name: "Launchers",
        tanks: ["skimmer", "twister", "swarmer", "sidewinder", "fieldgun"]
    },
    launchers_ar: {
        name: "Launchers (Arms race)",
        tanks: ["hyperskimmer", "skidder", "gyro", "hypercluster", "coli", "molotov", "hypertwister", "ream"]
    },
    annies: {
        name: "Annihilators (Arms race)",
        tanks: ["obliterator", "compound", "wiper", "stomper", "autoanni", "shaver", "eradicator"]
    },
    drones: {
        name: "Drones",
        tanks: ["overczar", "tyrant", "autooverlord", "megaautooverseer", "tripleautooverseer", "autooverdrive", "headman", "overcheese", "overstorm"]
    },
    necro: {
        name: "Underseer (Arms race)",
        tanks: ["diviner", "autonecro", "necrodrive", "megaautounderdrive", "tripleautounderdrive", "pentamancer", "pentadrive", "warlock", "autopentaseer"]
    },
    carriers: {
        name: "Carriers (Arms race)",
        tanks: ["warship", "battlerdrive", "bismarck", "proddrive", "manufacture", "dirigible", "autobattleship", "autoprod", "autocruiserdrive"]
    },
    auto3: {
        name: "Auto-3",
        tanks: ["auto5", "mega3", "auto6"]
    },
    auto3_ar: {
        name: "Auto-3 (Arms race)",
        tanks: ["auto6", "auto7", "mega5", "batter4", "hurler3", "autoauto4"]
    },
    dps: {
        name: "DPS",
        tanks: ["penta", "spread", "octo", "autogunner", "triplet", "predator", "triplex", "quadruplex", "machinegunner"]
    },
    dps_ar: {
        name: "DPS (Arms race)",
        tanks: ["toppler", "coli", "crack", "autooperator", "manufacture", "lorry"]
    },
    smashers: {
        name: "Smashers",
        tanks: ["megasmasher", "spike", "autosmasher", "landmine"]
    },
    spikes_ar: {
        name: "Spikes (Arms race)",
        tanks: ["thorn", "megaspike", "claymore", "spear", "prick"]
    },
    crash: {
        name: "Crash (Arms race)",
        tanks: ["whirlwind", "tempest", "septamech", "doubleequalizer", "rigger", "lorry", "manufacture", "doublespread", "palisade"]
    }
};

for (const tank in tanks) {
    if (!Object.hasOwn(tanks, tank)) continue;

    if (tank == "triangle") {
        HTML.tankSelect.innerHTML += "<option disabled></option>";
        HTML.tankSelect.innerHTML += "<option disabled>Branches</option>";
    }

    HTML.tankSelect.innerHTML += `<option value="${tank}">${tanks[tank].name}</option>`;
}


function selectTank() {
    const val = HTML.tankSelect.value;
    packet("Z", tanks[val].tanks || val);
}

HTML.tankSelect.addEventListener("change", () => {
    selectTank();
});


// OUR KEYS
let keys = {};

window.addEventListener("keydown", e => {
    if (keys[e.code]) {
        return;
    }

    keys[e.code] = true;
    if (e.code == "Escape") {
        menu.style.display = menu.style.display == "none" ? "block" : "none";
    }
});

window.addEventListener("keyup", e => {
    keys[e.code] = false;
});


// OUR MOUSE
let mouseX, mouseY, mouseDown, rMouseDown;

HTMLDivElement.prototype.nListener = HTMLDivElement.prototype.addEventListener;
HTMLDivElement.prototype.addEventListener = function(...args) {
    if (args[0] == "mousemove" && args[1].toString() == "e=>{e.isTrusted&&(n.push(2,e.clientX,e.clientY),t())}") {
        this.addEventListener("mousedown", e => {
            if (e.button == 0) {
                mouseDown = true;
            } else if (e.button == 2) {
                rMouseDown = true;
            }
        });
        this.addEventListener("mouseup", e => {
            if (e.button == 0) {
                mouseDown = false;
            } else if (e.button == 2) {
                rMouseDown = false;
            }
        });
        this.addEventListener("mousemove", e => {
            mouseX = e.clientX - (innerWidth / 2);
            mouseY = e.clientY - (innerHeight / 2);
        });
    }


    this.nListener.apply(this, args);
}


// VARS
const local = true;
let ws;
let tank = "Auto6";


// MAIN
function packet(...args) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(msgpack.encode(args));
    }
}


function connect() {
    ws = new WebSocket(local ? "ws://localhost:8082" : "wss://22cb6dab-35eb-4dee-b8fb-6bf16190293e-00-25r1nww0aylsx.worf.replit.dev:3000");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
        HTML.serverStatus.innerHTML = "✅ Connected";
        packet("M", 72011);
    }

    ws.onmessage = m => {
        const data = msgpack.decode(new Uint8Array(m.data));
        const type = data.shift();

        if (type == "M") {
            packet("C", data[0] ^ 845);
            HTML.serverStatus.innerHTML = "✅ Ready";
            selectTank();
        }
    }

    ws.onclose = () => {
        HTML.serverStatus.innerHTML = "❌ Disconnected";
        ws = undefined;
    }
}


connect();

HTML.reconnectServer.addEventListener("click", () => {
    ws && ws.close();
    HTML.serverStatus.innerHTML = "❌ Connecting...";
    connect();
});

HTML.connectNoob.addEventListener("click", () => {
    packet("F", HTML.serverHash.value?.replace("#", "") || location.hash.slice(1));
});

HTML.deleteNoobs.addEventListener("click", () => {
    packet("B");
});


// COMMUNICATION
let connecting, x, y;

const nListener = CanvasRenderingContext2D.prototype.strokeText;
CanvasRenderingContext2D.prototype.strokeText = function(...args) {
    if (args[0].includes("Coordinates: (")) { // intercepting tank's coordinates
        const coordText = args[0].match(/Coordinates: \(([^)]+)\)/)[1];
        const parts = coordText.split(", ");

        x = parseFloat(parts[0]);
        y = parseFloat(parts[1]);
    }

    nListener.apply(this, args);
}



setInterval(() => {
    packet("A",
        x, y,
        mouseX / 15,
        mouseY / 15,
        mouseDown, rMouseDown,
        HTML.mbs.checked,
        HTML.feeding.checked,
        keys["ShiftLeft"]
    );
}, 80);
