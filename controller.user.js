// ==UserScript==
// @name         test v3
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  yara yara yara
// @author       rexxy
// @match        *://arras.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arras.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @grant        none
// ==/UserScript==

/* global msgpack */

(function () {
    'use strict';

    // Shadow Monarch ClickGUI Stylesheet (Multi-Theme Edition)
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght=500;700;800&family=Outfit:wght=800;900&display=swap');

        /* --- THEME DEFINITIONS --- */
        #scriptMenu.theme-monarch {
            --bg-panel: rgba(5, 4, 8, 0.97);
            --bg-module: #100a1c;
            --bg-module-hover: #180f2b;
            --accent-color: #d647ff;
            --accent-dim: #991aff;
            --text-white: #ffffff;
            --text-dim: #f0ebff;
            --text-dark: #6e6485;
            --border-accent: rgba(214, 71, 255, 0.38);
            --glow-accent: rgba(214, 71, 255, 0.3);
        }

        #scriptMenu.theme-abyssal {
            --bg-panel: rgba(8, 6, 3, 0.97);
            --bg-module: #1c140a;
            --bg-module-hover: #291d0e;
            --accent-color: #ffb700;
            --accent-dim: #c48c00;
            --text-white: #ffffff;
            --text-dim: #ffeec4;
            --text-dark: #807050;
            --border-accent: rgba(255, 183, 0, 0.4);
            --glow-accent: rgba(255, 183, 0, 0.25);
        }

        #scriptMenu.theme-vanilla {
            --bg-panel: #2c3038;
            --bg-module: #1e222b;
            --bg-module-hover: #353b45;
            --accent-color: #52a474; /* Matte Green */
            --accent-dim: #3b7a54;
            --text-white: #ffffff;
            --text-dim: #abb2bf;
            --text-dark: #5c6370;
            --border-accent: #3e4451;
            --glow-accent: rgba(0, 0, 0, 0); /* Zero glow bloom */
        }

        #scriptMenu {
            position: fixed;
            width: 1120px;
            height: 590px;
            background: var(--bg-panel);
            border: 1px solid var(--border-accent);
            color: var(--text-white);
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 80px rgba(0,0,0,0.98), 0 0 40px var(--glow-accent);
            user-select: none;
            resize: both;
            overflow: hidden;
            min-width: 800px;
            min-height: 450px;
            transition: background 0.2s, border 0.2s, box-shadow 0.2s;
        }

        /* Fixed Canvas Transparency Target Guard */
        #systemEnvironmentEffect {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* Vanilla Theme Component Specific Tweaks */
        #scriptMenu.theme-vanilla #deleteNoobs,
        #scriptMenu.theme-vanilla #dismissBots {
            color: #e06c75 !important;
            border-color: rgba(224, 108, 117, 0.3) !important;
        }
        #scriptMenu.theme-vanilla #summon {
            background: rgba(82, 164, 116, 0.12) !important;
            border-color: var(--accent-color) !important;
            color: var(--accent-color) !important;
            text-shadow: none !important;
        }
        #scriptMenu.theme-vanilla #summon:hover {
            background: var(--accent-color) !important;
            color: #1e222b !important;
            box-shadow: none !important;
        }

        .client-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 26px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid var(--border-accent);
            position: relative;
            cursor: move;
        }
        .client-header::after {
            content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent-color), transparent); opacity: 0.85;
        }

        .client-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 18px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: var(--text-white);
            text-shadow: 0 0 12px var(--glow-accent);
        }
        .client-title span { color: var(--accent-color); text-shadow: 0 0 10px var(--accent-color); }

        .status-tag {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-dark);
            text-transform: uppercase;
            padding: 6px 14px;
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--border-accent);
            letter-spacing: 1px;
        }

        .codespace-url-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
        }

        .codespace-url-row input.codespaceUrlInput {
            flex: 1;
            min-width: 0;
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: #fff;
        }

        .codespace-url-row button.removeCodespaceUrl {
            min-width: 28px;
            width: 28px;
            height: 28px;
            padding: 0;
            font-size: 14px;
            line-height: 1;
            border-radius: 6px;
            color: var(--text-white);
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
        }

        .codespace-url-row button.removeCodespaceUrl:hover {
            background: rgba(255,74,74,0.18);
            border-color: rgba(255,74,74,0.3);
        }

        .codespace-url-row .codespace-row-status {
            flex-shrink: 0;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .gui-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            padding: 22px;
            background: rgba(0, 0, 0, 0.15);
            flex-grow: 1;
            overflow-y: auto;
        }

        .gui-column {
            display: flex;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid var(--border-accent);
            padding: 12px;
            height: max-content;
            box-shadow: 0 4px 25px rgba(0,0,0,0.6);
        }

        .column-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 14px;
            background: var(--bg-module);
            border-bottom: 2px solid var(--accent-color);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            box-shadow: 0 0 10px var(--glow-accent);
        }
        .column-header svg { width: 15px; height: 15px; color: var(--accent-color); filter: drop-shadow(0 0 5px var(--accent-color)); }

        .module-item {
            position: relative;
            margin-bottom: 6px;
            cursor: pointer;
            display: block;
        }
        .module-item input { display: none; }

        .module-box {
            background: var(--bg-module);
            padding: 12px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.15s ease;
            border: 1px solid transparent;
        }
        .module-item:hover .module-box {
            background: var(--bg-module-hover);
            border-color: var(--accent-color);
        }

        .module-name { color: var(--text-dim); font-weight: 700; }
        .module-status-dot { width: 6px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 1px; }

        .module-item input:checked + .module-box .module-name {
            color: #ffffff;
            text-shadow: 0 0 10px var(--glow-accent);
        }
        .module-item input:checked + .module-box {
            background: rgba(255,255,255,0.03);
            border-color: var(--accent-color);
        }
        .module-item input:checked + .module-box .module-status-dot {
            background: var(--accent-color);
            box-shadow: 0 0 12px var(--accent-color);
        }

        .premium-switch-box {
            background: var(--bg-module);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 11px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .switch-track {
            width: 36px; height: 16px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-accent); border-radius: 2px; position: relative;
        }
        .switch-handle {
            width: 10px; height: 10px; background: var(--text-dark); position: absolute; top: 2px; left: 2px; border-radius: 1px; transition: all 0.2s;
        }
        input:checked + .premium-switch-box .switch-track {
            background: rgba(0,0,0,0.2); border-color: var(--accent-color);
        }
        input:checked + .premium-switch-box .switch-handle {
            background: var(--accent-color); left: 22px; box-shadow: 0 0 10px var(--accent-color);
        }

        .module-settings-card {
            background: rgba(0,0,0,0.2);
            border-left: 2px solid var(--accent-color);
            padding: 12px 10px;
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .module-settings-card.sub-section {
            border-left-color: var(--text-dark);
        }

        .setting-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; display: flex; justify-content: space-between; }
        input[type="range"] {
            -webkit-appearance: none; width: 100%; height: 4px; background: var(--bg-module); outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 8px; height: 14px; background: var(--accent-color); cursor: pointer;
        }

        .select-head {
            background: var(--bg-module); border: 1px solid rgba(255,255,255,0.05); padding: 11px 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 11px; color: var(--text-dim); font-weight: 700;
        }
        .dropdown {
            position: absolute; bottom: calc(100% + 2px); left: 0; right: 0; background: var(--bg-module); border: 1px solid var(--accent-color); max-height: 180px; overflow-y: auto; z-index: 1000; display: none;
        }
        .dropdown.show { display: block; }
        .drop-item { padding: 10px 12px; color: var(--text-dim); cursor: pointer; font-size: 11px; }
        .drop-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .drop-item.selected { color: var(--accent-color); font-weight: 700; }

        input[type="text"], input[type="number"] {
            width: 100%; background: var(--bg-module); border: 1px solid rgba(255,255,255,0.05); padding: 10px 12px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; outline: none; box-sizing: border-box;
            user-select: text !important;
        }
        input:focus { border-color: var(--accent-color); }

        button {
            width: 100%; padding: 12px; background: var(--bg-module); border: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer;
        }
        button:hover { background: var(--bg-module-hover); border-color: var(--accent-color); }

        #summon { background: rgba(255,255,255,0.02); border-color: var(--accent-color); color: var(--accent-color); }
        #summon:hover { background: var(--accent-color); color: #000; box-shadow: 0 0 20px var(--accent-color); }

        .phrase-btn {
            padding: 11px 14px !important; text-align: left; font-size: 11px !important; font-weight: 500; color: var(--text-dim) !important;
            border-left: 2px solid transparent; background: var(--bg-module); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;
        }
        .phrase-btn:hover { color: #fff !important; border-color: var(--accent-color) !important; background: var(--bg-module-hover) !important; }

        .footer { text-align: center; font-size: 10px; color: var(--text-dark); padding: 14px; background: rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 2px; }
    `;
    document.head.appendChild(style);

    // Render Main UI Frame Matrix
    const menu = document.createElement('div');
    menu.id = 'scriptMenu';
    menu.className = 'theme-monarch'; // Default system startup profile
    menu.style.top = '100px';
    menu.style.left = '100px';
    menu.style.display = 'none';

    menu.innerHTML = `
        <div class="client-header" id="menuDragHeader">
            <div>
                <div class="client-title">Welcome back, The Sovereign of the Void.</div>
            </div>
            <div class="status-tag" id="statusPill">
                <span id="serverStatus">Disconnected</span>
            </div>
        </div>

        <div class="gui-grid">
            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l-2 2-3-3-2 2L2 16l2-2-3-3 2-2 3 3 2-2 2 2z"/></svg>
                    <span>Command</span>
                </div>
                <label class="module-item">
                    <input id="autofire" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Autofire</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <label class="module-item">
                    <input id="autoSpin" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Auto Spin</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <label class="module-item">
                    <input id="overrideToggle" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Override (R)</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <div class="module-settings-card">
                    <div class="setting-label">
                        <span>Aim Smoothing</span>
                        <span style="color: var(--accent-color); font-weight:800;"><span id="sensitivityValue">34</span>%</span>
                    </div>
                    <input id="aimSmoothing" type="range" min="1" max="100" step="1" value="34">
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h12v4H6V4Zm0 7h12v4H6v-4Zm0 7h12v2H6v-2Z"/></svg>
                    <span>Codespaces</span>
                </div>
                <div class="module-settings-card">
                    <div class="setting-label">
                        <span>Local WS URL</span>
                        <span class="mini-status" id="localWsStatus">Idle</span>
                    </div>
                    <input id="localWsUrl" type="text" placeholder="ws://localhost:8082" value="ws://127.0.0.1:8082">
                </div>
                <div class="module-settings-card">
                    <div class="setting-label">
                        <span>Codespace Connections</span>
                        <span class="mini-status" id="codespaceGlobalStatus">Idle</span>
                    </div>
                    <div id="codespaceUrlFields" class="codespace-list"></div>
                    <div class="codespace-action-row">
                        <button id="addCodespaceUrl" class="compact-btn">Add</button>
                        <button id="connectCodespaces" class="compact-btn">Connect</button>
                        <button id="disconnectCodespaces" class="compact-btn">Disconnect</button>
                        <button id="reconnectCodespaces" class="compact-btn">Reconnect</button>
                    </div>
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 3 14 9-14 9V3z"/></svg>
                    <span>Movement</span>
                </div>
                <label class="module-item">
                    <input id="followMouse" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Follow Mouse</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <label class="module-item">
                    <input id="autoFeed" type="checkbox" checked>
                    <div class="module-box">
                        <span class="module-name">Auto Feed</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <label class="module-item">
                    <input id="holdPosition" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Hold Position</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <label class="module-item">
                    <input id="manualCoordinates" type="checkbox">
                    <div class="module-box">
                        <span class="module-name">Manual Coordinates</span>
                        <div class="module-status-dot"></div>
                    </div>
                </label>
                <div id="manualCoordsSection" class="module-settings-card" style="margin-top: 10px; display: none;">
                    <input id="manualX" type="number" placeholder="Target X" value="0">
                    <input id="manualY" type="number" placeholder="Target Y" value="0">
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>Shadows</span>
                </div>
                <div class="module-settings-card" style="border: none; padding: 0; background: transparent; gap: 6px;">
                    <input id="serverHash" type="text" placeholder="Server Identity Hash" value="epx">
                    <input id="customBotName" type="text" placeholder="Enter Bot Name...">

                    <div style="display:flex; gap:10px; align-items:center; background: var(--bg-module); padding: 11px 14px; border: 1px solid rgba(255,255,255,0.05);">
                        <span style="font-size:11px; color:var(--text-dim); text-transform:uppercase;">Shadows:</span>
                        <input id="botDensity" type="number" value="40" min="1" max="300" style="background:transparent; border:none; padding:0; color:var(--accent-color); font-weight:800; font-size:13px;">
                    </div>

                    <div class="select-container" id="tankContainer" style="position:relative; margin-top: 4px; margin-bottom: 6px;">
                        <div class="select-head" id="tankTrigger">
                            <span id="selectedTankDisplay">DPS Path</span>
                            <input id="tankSearchInput" type="text" placeholder="Search tanks..." style="display:none; width:100%; background:transparent; border:none; color:#fff; outline:none;" />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                        <div class="dropdown" id="tankOptionsList"></div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                        <button id="summon">Arise</button>
                        <button id="reconnectServer">Resync</button>
                        <button id="dismissBots" style="color: #ff4a4a; border-color: rgba(255,74,74,0.2);">Dismiss Shadows</button>
                    </div>

                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Spawn Delay</span>
                            <span style="color: var(--accent-color); font-weight:800;">ms</span>
                        </div>
                        <input id="spawnDelay" type="number" min="0" step="10" value="0" placeholder="0">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Main Tick MS</span>
                            <span style="color: var(--accent-color); font-weight:800;">ms</span>
                        </div>
                        <input id="mainTickMs" type="number" min="50" step="10" value="140" placeholder="140">
                    </div>
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v6m0 8v6m10-10h-6M8 12H2m15 7-4.5-4.5M8 8 3.5 3.5m12.5 0L12 8m0 8 4.5 4.5"/></svg>
                    <span>Swarm 2</span>
                </div>
                <div class="module-settings-card" style="border: none; padding: 0; background: transparent; gap: 6px;">
                    <label class="module-item">
                        <input id="swarm2Autofire" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Autofire</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="swarm2AutoSpin" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Auto Spin</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="swarm2FollowMouse" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Follow Mouse</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="swarm2AutoFeed" type="checkbox" checked>
                        <div class="module-box">
                            <span class="module-name">Auto Feed</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="swarm2HoldPosition" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Hold Position</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="swarm2OverrideToggle" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Override (R)</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Tank</span>
                        </div>
                        <select id="swarm2TankSelect" style="width: 100%; background: var(--bg-module); border: 1px solid rgba(255,255,255,0.05); padding: 10px 12px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; outline: none; box-sizing: border-box;">
                        </select>
                    </div>
                    <input id="swarm2CustomBotName" type="text" placeholder="Swarm 2 bot name...">
                    <input id="swarm2ServerHash" type="text" placeholder="Swarm 2 server hash" value="epx">
                    <div style="display:flex; gap:10px; align-items:center; background: var(--bg-module); padding: 11px 14px; border: 1px solid rgba(255,255,255,0.05);">
                        <span style="font-size:11px; color:var(--text-dim); text-transform:uppercase;">Bots:</span>
                        <input id="swarm2BotCount" type="number" value="20" min="1" max="300" style="background:transparent; border:none; padding:0; color:var(--accent-color); font-weight:800; font-size:13px;">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Midpoint X</span>
                        </div>
                        <input id="swarm2MidpointX" type="number" value="0" step="10" placeholder="0">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Midpoint Y</span>
                        </div>
                        <input id="swarm2MidpointY" type="number" value="0" step="10" placeholder="0">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Radius</span>
                        </div>
                        <input id="swarm2Radius" type="number" min="0" step="10" value="0" placeholder="0">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Spawn Delay</span>
                            <span style="color: var(--accent-color); font-weight:800;">ms</span>
                        </div>
                        <input id="swarm2SpawnDelay" type="number" min="0" step="10" value="0" placeholder="0">
                    </div>
                    <div class="module-settings-card" style="padding: 10px; gap: 6px; margin-top: 2px;">
                        <div class="setting-label">
                            <span>Main Tick MS</span>
                            <span style="color: var(--accent-color); font-weight:800;">ms</span>
                        </div>
                        <input id="swarm2MainTickMs" type="number" min="50" step="10" value="140" placeholder="140">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                        <button id="swarm2Summon">Arise Swarm 2</button>
                        <button id="swarm2DismissBots" style="color: #ff4a4a; border-color: rgba(255,74,74,0.2);">Dismiss Swarm 2</button>
                    </div>
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>Shadow Roars</span>
                </div>
                <div class="module-settings-card" style="border: none; padding: 0; background: transparent; gap: 6px;">
                    <input id="chatMessage" type="text" placeholder="Message...">
                    <label class="module-item" style="margin: 8px 0 0 0;">
                        <input id="repeatChat" type="checkbox">
                        <div class="premium-switch-box">
                            <span class="module-name" style="font-size: 11px;">Continuous Spam</span>
                            <div class="switch-track"><div class="switch-handle"></div></div>
                        </div>
                    </label>
                    <button id="broadcastBtn" style="margin-top: 2px;">Send Message</button>

                    <div style="display: flex; flex-direction: column; margin-top: 4px;">
                        <button class="phrase-btn" data-phrase="Roar">» Roar</button>
                        <button class="phrase-btn" data-phrase="The frenzy has begun. The moon is red. We are out of time.">» Line 1 (Frenzy)</button>
                    </div>

                    <div class="module-settings-card sub-section">
                        <label class="module-item" style="margin: 0;">
                            <input id="toggleSnow" type="checkbox">
                            <div class="premium-switch-box">
                                <span class="module-name" style="font-size: 11px;">Snowfall Layer</span>
                                <div class="switch-track"><div class="switch-handle"></div></div>
                            </div>
                        </label>
                        <div class="setting-label" style="padding: 0 2px;">
                            <span>Snow Density</span>
                            <span style="color: var(--accent-color); font-weight:700;"><span id="snowDensityVal">115</span></span>
                        </div>
                        <input id="snowDensity" type="range" min="0" max="250" step="5" value="115">

                        <label class="module-item" style="margin: 4px 0 0 0;">
                            <input id="toggleStars" type="checkbox">
                            <div class="premium-switch-box">
                                <span class="module-name" style="font-size: 11px;">Stars Layer</span>
                                <div class="switch-track"><div class="switch-handle"></div></div>
                            </div>
                        </label>
                        <div class="setting-label" style="padding: 0 2px;">
                            <span>Star Density</span>
                            <span style="color: var(--accent-color); font-weight:700;"><span id="starDensityVal">65</span></span>
                        </div>
                        <input id="starDensity" type="range" min="10" max="200" step="5" value="65">
                    </div>
                </div>
            </div>

            <div class="gui-column">
                <div class="column-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"/></svg>
                    <span>Utility</span>
                </div>
                <div class="module-settings-card" style="border: none; padding: 0; background: transparent; gap: 6px;">
                    <label class="module-item">
                        <input id="autoRespawn" type="checkbox" checked>
                        <div class="module-box">
                            <span class="module-name">Auto Respawn</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                    <label class="module-item">
                        <input id="toggleAntiInvis" type="checkbox">
                        <div class="module-box">
                            <span class="module-name">Anti Invis</span>
                            <div class="module-status-dot"></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        <div class="footer" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 22px;">
            <div style="display: flex; gap: 6px; align-items: center;">
                <span style="font-size: 9px; color: var(--text-dark); margin-right: 4px; letter-spacing: 1px;">THEME:</span>
                <div class="theme-picker" data-theme="monarch" title="Shadow Monarch" style="width: 14px; height: 14px; background: #d647ff; border: 1.5px solid #fff; cursor: pointer; border-radius: 2px;"></div>
                <div class="theme-picker" data-theme="abyssal" title="Abyssal Gold" style="width: 14px; height: 14px; background: #ffb700; border: 1.5px solid transparent; cursor: pointer; border-radius: 2px;"></div>
                <div class="theme-picker" data-theme="vanilla" title="Vanilla Muted Slate" style="width: 14px; height: 14px; background: #52a474; border: 1.5px solid transparent; cursor: pointer; border-radius: 2px;"></div>
            </div>
            <div style="letter-spacing: 2px;">Shadow Commander</div>
        </div>
    `;

    document.body.appendChild(menu);

    menu.style.left = ((window.innerWidth - 1120) / 2) + 'px';
    menu.style.top = ((window.innerHeight - 590) / 2) + 'px';

    // Hook Up Theme Change Triggers
    const themePickers = menu.querySelectorAll('.theme-picker');
    themePickers.forEach(picker => {
        picker.addEventListener('click', () => {
            const chosen = picker.getAttribute('data-theme');
            menu.className = `theme-${chosen}`;

            themePickers.forEach(p => p.style.borderColor = 'transparent');
            picker.style.borderColor = '#ffffff';
        });
    });

    // Dropdown Logic will be initialized later with proper tank categories
    // (See section below starting at line ~1055)

    const aimSmoothing = document.getElementById('aimSmoothing');
    const sensitivityValue = document.getElementById('sensitivityValue');
    if (aimSmoothing && sensitivityValue) {
        aimSmoothing.addEventListener('input', () => {
            sensitivityValue.innerText = aimSmoothing.value;
        });
    }

    const manualCoordinates = document.getElementById('manualCoordinates');
    const manualCoordsSection = document.getElementById('manualCoordsSection');
    if (manualCoordinates && manualCoordsSection) {
        manualCoordinates.addEventListener('change', () => {
            manualCoordsSection.style.display = manualCoordinates.checked ? 'flex' : 'none';
        });
    }

    const inputFields = menu.querySelectorAll('input[type="text"], input[type="number"]');
    inputFields.forEach(field => {
        field.addEventListener('keydown', (e) => e.stopPropagation());
        field.addEventListener('keyup', (e) => e.stopPropagation());
    });

    const dragHeader = document.getElementById('menuDragHeader');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    if (dragHeader) {
        dragHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('input, button, .status-tag')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(menu.style.left, 10) || 0;
            initialTop = parseInt(menu.style.top, 10) || 0;
            document.body.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            menu.style.left = (initialLeft + (e.clientX - startX)) + 'px';
            menu.style.top = (initialTop + (e.clientY - startY)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
            }
        });
    }

    // --- ENFORCED REWRITE FOR ABSOLUTE BACKDROP TRANSPARENCY ---
    const envCanvas = document.createElement('canvas');
    envCanvas.id = 'systemEnvironmentEffect';

    envCanvas.style.position = 'fixed';
    envCanvas.style.top = '0';
    envCanvas.style.left = '0';
    envCanvas.style.width = '100vw';
    envCanvas.style.height = '100vh';
    envCanvas.style.pointerEvents = 'none';
    envCanvas.style.zIndex = '9999995';
    envCanvas.style.mixBlendMode = 'normal';
    envCanvas.style.setProperty('background', 'transparent', 'important');
    envCanvas.style.setProperty('background-color', 'transparent', 'important');

    document.body.appendChild(envCanvas);

    const ctx = envCanvas.getContext('2d');
    let width = (envCanvas.width = window.innerWidth);
    let height = (envCanvas.height = window.innerHeight);

    let flakes = [];
    let stars = [];

    const snowToggle = document.getElementById('toggleSnow');
    const snowSlider = document.getElementById('snowDensity');
    const snowDisplay = document.getElementById('snowDensityVal');
    const starsToggle = document.getElementById('toggleStars');
    const starSlider = document.getElementById('starDensity');
    const starDisplay = document.getElementById('starDensityVal');

    function syncSnowArray() {
        const sliderVal = snowSlider ? parseInt(snowSlider.value) : 115;
        const targetCount = (snowToggle && snowToggle.checked) ? sliderVal : 0;
        if (snowDisplay) snowDisplay.innerText = sliderVal.toString();

        if (flakes.length < targetCount) {
            while (flakes.length < targetCount) {
                flakes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 3.5 + 1.2,
                    speed: Math.random() * 1.5 + 0.5,
                    sway: Math.random() * 2
                });
            }
        } else if (flakes.length > targetCount) {
            flakes.length = targetCount;
        }
    }

    function generateStarMist() {
        const sliderVal = starSlider ? parseInt(starSlider.value) : 65;
        const targetCount = (starsToggle && starsToggle.checked) ? sliderVal : 0;
        if (starDisplay) starDisplay.innerText = sliderVal.toString();

        stars = [];
        for (let i = 0; i < targetCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.2 + 0.8,
                alpha: Math.random() * 0.4 + 0.6,
                pulseSpeed: Math.random() * 0.015 + 0.005,
                driftUp: Math.random() * 0.45 + 0.15
            });
        }
    }

    syncSnowArray();
    generateStarMist();

    if (snowSlider) snowSlider.addEventListener('input', syncSnowArray);
    if (snowToggle) snowToggle.addEventListener('change', syncSnowArray);
    if (starSlider) starSlider.addEventListener('input', generateStarMist);
    if (starsToggle) starsToggle.addEventListener('change', generateStarMist);

    function drawEnvironment() {
        if (!ctx) return;

        // Wipe canvas layer down to alpha 0 context variables each animation frame
        ctx.clearRect(0, 0, width, height);

        // Dynamic System Particle Theme Adaptation Hook
        let fluidParticleAlphaColor = 'rgba(214, 71, 255, '; // Default Purple
        if (menu.classList.contains('theme-abyssal')) {
            fluidParticleAlphaColor = 'rgba(255, 183, 0, '; // Gold
        } else if (menu.classList.contains('theme-vanilla')) {
            fluidParticleAlphaColor = 'rgba(82, 164, 116, '; // Grey-Slate Green Matcher
        }

        // Stars Rendering Block
        if (starsToggle && starsToggle.checked) {
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.alpha += s.pulseSpeed;
                if (s.alpha > 1.0 || s.alpha < 0.3) s.pulseSpeed = -s.pulseSpeed;

                s.y -= s.driftUp;
                if (s.y < -10) {
                    s.y = height + 10;
                    s.x = Math.random() * width;
                }

                ctx.fillStyle = `${fluidParticleAlphaColor}${Math.max(0.1, Math.min(s.alpha, 1))})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Snowfall Processing Block
        if (snowToggle && snowToggle.checked) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            for (let i = 0; i < flakes.length; i++) {
                const f = flakes[i];
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                ctx.fill();

                f.y += f.speed;
                f.x += Math.sin(f.sway) * 0.4;
                f.sway += 0.01;

                if (f.y > height) {
                    flakes[i] = { x: Math.random() * width, y: -10, r: f.r, speed: f.speed, sway: f.sway };
                }
            }
        }

    }

    function runEngineLoop() {
        drawEnvironment();
        requestAnimationFrame(runEngineLoop);
    }

    window.addEventListener('resize', () => {
        width = envCanvas.width = window.innerWidth;
        height = envCanvas.height = window.innerHeight;
        generateStarMist();
    });

    runEngineLoop();

    if (menu && !menu.isConnected) {
        const mountTarget = document.body || document.documentElement;
        if (mountTarget) {
            mountTarget.appendChild(menu);
        }
    }

    const getEl = id => document.getElementById(id);
    const HTML = {
        serverStatus: getEl("serverStatus"),
        serverStatusBadge: getEl("statusPill"),
        reconnectServer: getEl("reconnectServer"),
        tankContainer: getEl("tankContainer"),
        tankTrigger: getEl("tankTrigger"),
        selectedTankDisplay: getEl("selectedTankDisplay"),
        tankSearchInput: getEl("tankSearchInput"),
        tankOptionsList: getEl("tankOptionsList"),
        serverHash: getEl("serverHash"),
        botCount: getEl("botDensity"),
        spawnDelay: getEl("spawnDelay"),
        mainTickMs: getEl("mainTickMs"),
        swarm2Autofire: getEl("swarm2Autofire"),
        swarm2Autospin: getEl("swarm2AutoSpin"),
        swarm2OverrideToggle: getEl("swarm2OverrideToggle"),
        swarm2TankSelect: getEl("swarm2TankSelect"),
        swarm2ServerHash: getEl("swarm2ServerHash"),
        swarm2CustomBotName: getEl("swarm2CustomBotName"),
        swarm2BotCount: getEl("swarm2BotCount"),
        swarm2SpawnDelay: getEl("swarm2SpawnDelay"),
        swarm2MainTickMs: getEl("swarm2MainTickMs"),
        swarm2MidpointX: getEl("swarm2MidpointX"),
        swarm2MidpointY: getEl("swarm2MidpointY"),
        swarm2Radius: getEl("swarm2Radius"),
        swarm2Summon: getEl("swarm2Summon"),
        swarm2DismissBots: getEl("swarm2DismissBots"),
        mbs: getEl("followMouse"),
        feeding: getEl("autoFeed"),
        holdPosition: getEl("holdPosition"),
        swarm2FollowMouse: getEl("swarm2FollowMouse"),
        swarm2AutoFeed: getEl("swarm2AutoFeed"),
        swarm2HoldPosition: getEl("swarm2HoldPosition"),
        connectNoob: getEl("summon"),
        deleteNoobs: getEl("dismissBots"),
        autofire: getEl("autofire"),
        autospin: getEl("autoSpin"),
        overrideToggle: getEl("overrideToggle"),
        manualMode: getEl("manualCoordinates"),
        manualX: getEl("manualX"),
        manualY: getEl("manualY"),
        manualCoordsSection: getEl("manualCoordsSection"),
        localWsUrl: getEl("localWsUrl"),
        localWsStatus: getEl("localWsStatus"),
        codespaceUrlFields: getEl("codespaceUrlFields"),
        addCodespaceUrl: getEl("addCodespaceUrl"),
        connectCodespaces: getEl("connectCodespaces"),
        disconnectCodespaces: getEl("disconnectCodespaces"),
        reconnectCodespaces: getEl("reconnectCodespaces"),
        codespaceGlobalStatus: getEl("codespaceGlobalStatus"),
        mouseSensitivity: getEl("aimSmoothing"),
        sensitivityValue: getEl("sensitivityValue"),
        broadcastBtn: getEl("broadcastBtn"),
        chatMessage: getEl("chatMessage"),
        repeatChat: getEl("repeatChat"),
        autoRespawn: getEl("autoRespawn"),
        toggleAntiInvis: getEl("toggleAntiInvis")
    };

    // Chat Broadcast Logic
    if (HTML.broadcastBtn) {
        HTML.broadcastBtn.onclick = () => {
            const msg = (HTML.chatMessage?.value || "").trim();
            const spam = HTML.repeatChat?.checked || false;
            if (msg) {
                packet("T", msg, spam);
                if (!spam && HTML.chatMessage) HTML.chatMessage.value = "";
            } else if (!spam) {
                // If message is empty and spam is off, stop any active spam
                packet("T", "", false);
            }
        };
    }

    if (HTML.chatMessage) {
        HTML.chatMessage.onkeydown = (e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
                if (HTML.broadcastBtn) HTML.broadcastBtn.click();
            }
        };
    }

    document.querySelectorAll('.phrase-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const phrase = btn.dataset.phrase || btn.textContent;
            if (HTML.chatMessage) {
                HTML.chatMessage.value = phrase;
                HTML.chatMessage.focus();
            }
        };
    });




    // Manual Coords Visibility
    if (HTML.manualMode) {
        HTML.manualMode.onchange = () => {
            if (HTML.manualCoordsSection) {
                HTML.manualCoordsSection.style.display = HTML.manualMode.checked ? "grid" : "none";
            }
        };
    }

    function applyAntiInvisPatch() {
        if (window.__controllerAntiInvisPatched) return;

        window.antiInviActive = !!HTML.toggleAntiInvis?.checked;
        const originalDrawElements = WebGLRenderingContext.prototype.drawElements;

        WebGLRenderingContext.prototype.drawElements = function (mode, count, type, offset) {
            const isTank = window.antiInviActive && count > 50 && count < 600;
            if (isTank) this.disable(this.BLEND);
            const result = originalDrawElements.call(this, mode, count, type, offset);
            if (isTank) this.enable(this.BLEND);
            return result;
        };

        const proto = CanvasRenderingContext2D.prototype;
        const globalAlphaDesc = Object.getOwnPropertyDescriptor(proto, 'globalAlpha');
        Object.defineProperty(proto, 'globalAlpha', {
            set(val) {
                if (window.antiInviActive && val > 0.05 && val < 0.95) val = 1;
                globalAlphaDesc.set.call(this, val);
            },
            get: globalAlphaDesc.get,
            configurable: true
        });

        window.__controllerAntiInvisPatched = true;
    }

    function syncAntiInvisState() {
        window.antiInviActive = !!HTML.toggleAntiInvis?.checked;
    }

    applyAntiInvisPatch();

    const saveSettings = () => {
        const settings = {
            serverHash: HTML.serverHash?.value,
            botCount: HTML.botCount?.value,
            autofire: HTML.autofire?.checked,
            autospin: HTML.autospin?.checked,
            override: HTML.overrideToggle?.checked,
            mbs: HTML.mbs?.checked,
            feeding: HTML.feeding?.checked,
            holdPosition: HTML.holdPosition?.checked,
            manualMode: HTML.manualMode?.checked,
            manualX: HTML.manualX?.value,
            manualY: HTML.manualY?.value,
            autoRespawn: HTML.autoRespawn?.checked,
            toggleAntiInvis: HTML.toggleAntiInvis?.checked,
            localWsUrl: HTML.localWsUrl?.value,
            codespaceUrls: Array.from(document.querySelectorAll('.codespace-url-row .codespaceUrlInput')).map(el => el.value).filter(Boolean),
            mouseSensitivity: HTML.mouseSensitivity?.value,
            spawnDelay: HTML.spawnDelay?.value,
            mainTickMs: HTML.mainTickMs?.value,
            chatMessage: HTML.chatMessage?.value,
            repeatChat: HTML.repeatChat?.checked,
            currentTank: currentTank,
            swarm2Tank: HTML.swarm2TankSelect?.value,
            swarm2ServerHash: HTML.swarm2ServerHash?.value,
            swarm2CustomBotName: HTML.swarm2CustomBotName?.value,
            swarm2BotCount: HTML.swarm2BotCount?.value,
            swarm2MidpointX: HTML.swarm2MidpointX?.value,
            swarm2MidpointY: HTML.swarm2MidpointY?.value,
            swarm2Radius: HTML.swarm2Radius?.value,
            swarm2SpawnDelay: HTML.swarm2SpawnDelay?.value,
            swarm2MainTickMs: HTML.swarm2MainTickMs?.value,
            swarm2Autofire: HTML.swarm2Autofire?.checked,
            swarm2Autospin: HTML.swarm2Autospin?.checked,
            swarm2FollowMouse: HTML.swarm2FollowMouse?.checked,
            swarm2AutoFeed: HTML.swarm2AutoFeed?.checked,
            swarm2HoldPosition: HTML.swarm2HoldPosition?.checked,
            swarm2Override: HTML.swarm2OverrideToggle?.checked,
        };
        localStorage.setItem('noob_settings', JSON.stringify(settings));
    };

    const loadSettings = () => {
        try {
            const data = localStorage.getItem('noob_settings');
            if (!data) return;
            const settings = JSON.parse(data);

            if (settings.serverHash !== undefined && HTML.serverHash) HTML.serverHash.value = settings.serverHash;
            if (settings.botCount !== undefined && HTML.botCount) HTML.botCount.value = settings.botCount;
            if (settings.autofire !== undefined && HTML.autofire) HTML.autofire.checked = settings.autofire;
            if (settings.autospin !== undefined && HTML.autospin) HTML.autospin.checked = settings.autospin;
            if (settings.override !== undefined && HTML.overrideToggle) HTML.overrideToggle.checked = settings.override;
            if (settings.mbs !== undefined && HTML.mbs) HTML.mbs.checked = settings.mbs;
            if (settings.feeding !== undefined && HTML.feeding) HTML.feeding.checked = settings.feeding;
            if (settings.holdPosition !== undefined && HTML.holdPosition) HTML.holdPosition.checked = settings.holdPosition;
            if (settings.manualMode !== undefined && HTML.manualMode) HTML.manualMode.checked = settings.manualMode;
            if (settings.manualX !== undefined && HTML.manualX) HTML.manualX.value = settings.manualX;
            if (settings.manualY !== undefined && HTML.manualY) HTML.manualY.value = settings.manualY;
            if (settings.autoRespawn !== undefined && HTML.autoRespawn) HTML.autoRespawn.checked = settings.autoRespawn;
            if (settings.toggleAntiInvis !== undefined && HTML.toggleAntiInvis) HTML.toggleAntiInvis.checked = settings.toggleAntiInvis;
            if (settings.localWsUrl !== undefined && HTML.localWsUrl) HTML.localWsUrl.value = settings.localWsUrl;
            if (settings.codespaceUrls !== undefined && Array.isArray(settings.codespaceUrls) && HTML.codespaceUrlFields) {
                HTML.codespaceUrlFields.innerHTML = '';
                if (settings.codespaceUrls.length === 0) {
                    addCodespaceUrlField();
                } else {
                    settings.codespaceUrls.forEach(url => addCodespaceUrlField(url));
                }
            }
            if (settings.mouseSensitivity !== undefined && HTML.mouseSensitivity) {
                HTML.mouseSensitivity.value = settings.mouseSensitivity;
                if (HTML.sensitivityValue) HTML.sensitivityValue.textContent = settings.mouseSensitivity;
            }
            if (settings.spawnDelay !== undefined && HTML.spawnDelay) HTML.spawnDelay.value = settings.spawnDelay;
            if (settings.mainTickMs !== undefined && HTML.mainTickMs) HTML.mainTickMs.value = settings.mainTickMs;
            if (settings.chatMessage !== undefined && HTML.chatMessage) HTML.chatMessage.value = settings.chatMessage;
            if (settings.repeatChat !== undefined && HTML.repeatChat) HTML.repeatChat.checked = settings.repeatChat;
            if (settings.currentTank !== undefined) currentTank = settings.currentTank;
            if (settings.swarm2Tank !== undefined && HTML.swarm2TankSelect) HTML.swarm2TankSelect.value = settings.swarm2Tank;
            if (settings.swarm2ServerHash !== undefined && HTML.swarm2ServerHash) HTML.swarm2ServerHash.value = settings.swarm2ServerHash;
            if (settings.swarm2CustomBotName !== undefined && HTML.swarm2CustomBotName) HTML.swarm2CustomBotName.value = settings.swarm2CustomBotName;
            if (settings.swarm2BotCount !== undefined && HTML.swarm2BotCount) HTML.swarm2BotCount.value = settings.swarm2BotCount;
            if (settings.swarm2MidpointX !== undefined && HTML.swarm2MidpointX) HTML.swarm2MidpointX.value = settings.swarm2MidpointX;
            if (settings.swarm2MidpointY !== undefined && HTML.swarm2MidpointY) HTML.swarm2MidpointY.value = settings.swarm2MidpointY;
            if (settings.swarm2Radius !== undefined && HTML.swarm2Radius) HTML.swarm2Radius.value = settings.swarm2Radius;
            if (settings.swarm2SpawnDelay !== undefined && HTML.swarm2SpawnDelay) HTML.swarm2SpawnDelay.value = settings.swarm2SpawnDelay;
            if (settings.swarm2MainTickMs !== undefined && HTML.swarm2MainTickMs) HTML.swarm2MainTickMs.value = settings.swarm2MainTickMs;
            if (settings.swarm2Autofire !== undefined && HTML.swarm2Autofire) HTML.swarm2Autofire.checked = settings.swarm2Autofire;
            if (settings.swarm2Autospin !== undefined && HTML.swarm2Autospin) HTML.swarm2Autospin.checked = settings.swarm2Autospin;
            if (settings.swarm2FollowMouse !== undefined && HTML.swarm2FollowMouse) HTML.swarm2FollowMouse.checked = settings.swarm2FollowMouse;
            if (settings.swarm2AutoFeed !== undefined && HTML.swarm2AutoFeed) HTML.swarm2AutoFeed.checked = settings.swarm2AutoFeed;
            if (settings.swarm2HoldPosition !== undefined && HTML.swarm2HoldPosition) HTML.swarm2HoldPosition.checked = settings.swarm2HoldPosition;
            if (settings.swarm2Override !== undefined && HTML.swarm2OverrideToggle) HTML.swarm2OverrideToggle.checked = settings.swarm2Override;

            // Update UI state
            if (HTML.manualMode && HTML.manualMode.onchange) HTML.manualMode.onchange();
            syncUtilityEffects();
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    };

    // TANK DEFINITIONS (Clean & Deduplicated)
    // TANK DEFINITIONS (Exhaustive List)
    const tankCategories = {
        "Essentials": {
            basic: "Basic",
            twin: "Twin",
            sniper: "Sniper",
            machinegun: "Machine Gun",
            flankguard: "Flank Guard",
            director: "Director",
            pounder: "Pounder",
            smasher: "Smasher",
            auto6: "Auto-4/6",
            mega3: "Mega-3",
            shotgun: "Shotgun",
            pursuer_ram: "Pursuer (Ram)",
            pursuer_normal: "Pursuer (Normal)"
        },
        "Advanced Tanks": {
            doubletwin: "Double Twin",
            tripleshot: "Triple Shot",
            sprayer: "Sprayer",
            redistributor: "Redistributor",
            hexatank: "Hexa Tank",
            octotank: "Octo Tank",
            booster: "Booster",
            fighter: "Fighter",
            tripletwin: "Triple Twin",
            overseer: "Overseer",
            underseer: "Underseer",
            manager: "Manager",
            destroyer: "Destroyer",
            anni: "Annihilator",
            rocketeer: "Rocketeer",
            gunner: "Gunner",
            auto3_single: { name: "Auto-3", tanks: "auto3" },
            auto4: "Auto-4",
            toppler: "Toppler",
            crack: "Crackshot",
            triplex: "Triplex",
            quadruplex: "Quadruplex",
            predator: "Predator",
            lorry: "Lorry",
            parapet: "Parapet"
        },
        "Arms Race / Special": {
            browser: "Browser",
            strider: "Strider",
            surfer: "Surfer",
            eagle: "Eagle",
            phoenix: "Phoenix",
            vulture: "Vulture",
            automingler: "Automingler",
            gale: "Gale",
            nona: "Nona",
            septamachine: "Septa Machine",
            jerker: "Jerker",
            limpet: "Limpet",
            firework: "Firework",
            coli: "Collision",
            levi: "Leviathan",
            finger: "Finger",
            pincer: "Pincer",
            tempest: "Tempest",
            rocket: "Rocket (ram)"
        },
        "Support & Utility": {
            engineer: "Engineer",
            assembler: "Assembler",
            architect: "Architect",
            factory: "Factory",
            spawner: "Spawner",
            foundry: "Foundry",
            topbanana: "Top Banana",
            healer: "Healer",
            physician: "Physician",
            chemist: "Chemist"
        },
        "Smashers & Rams": {
            megasmasher: "Mega Smasher",
            spike: "spike",
            autosmasher: "Auto Smasher",
            landmine: "Landmine",
            thorn: "Thorn",
            megaspike: "Mega Spike",
            slammer: "Slammer",
            basher: "Basher"
        },
        "Branches": {
            triangle: {
                name: "Tri-Angle Path",
                tanks: ["fighter", "autotriangle", "surfer", "eagle", "bomber", "vulture", "phoenix"]
            },
            launchers: {
                name: "Launchers Path",
                tanks: ["skimmer", "twister", "swarmer", "sidewinder", "fieldgun"] 
            },
            drones: {
                name: "Drones Path",
                tanks: ["overczar", "tyrant", "autooverlord", "megaautooverseer", "tripleautooverseer", "autooverdrive", "headman", "overcheese", "overstorm"]
            },
            auto3: {
                name: "Auto-3 Path",
                tanks: ["auto5", "mega3", "auto6"]
            },
            dps: {
                name: "DPS Path",
                tanks: ["penta", "spread", "octo", "autogunner", "triplet", "predator", "triplex", "quadruplex", "machinegunner"]
            },
            smashers_branch: {
                name: "Smashers Path",
                tanks: ["megasmasher", "spike", "autosmasher", "landmine"]
            },
            all_normal: {
                name: "all(normal)",
                tanks: ["fighter", "autotriangle", "surfer", "eagle", "bomber", "vulture", "phoenix","skimmer", "twister", "swarmer", "sidewinder", "fieldgun","overczar", "tyrant", "autooverlord", "megaautooverseer", "tripleautooverseer", "autooverdrive", "headman", "overcheese", "overstorm","auto5", "mega3", "auto6","penta", "spread", "octo", "autogunner", "triplet", "predator", "triplex", "quadruplex", "machinegunner","megasmasher", "spike", "autosmasher", "landmine"]
            },
            crash_normal: {
                name: "crash(normal)",
                tanks: ["bentdouble_cr", "overdrive_cr", "overlord_cr","septatrapper_cr", "architect_cr", "hexatrapper_cr", "octo_cr","cyclone_cr", "penta_cr", "machinegunner_cr", "underseer_cr"]
            }
        },
        "Arms Race Branches": {
            triangle_ar: {
                name: "Tri-Angle (AR)",
                tanks: ["browser", "strider", "autobomber", "tripleautotriangle", "surferdrive", "electrocutor", "kicker", "megaautotriangle", "roller", "autoeagle"]
            },
            launchers_ar: {
                name: "Launchers (AR)",
                tanks: ["hyperskimmer", "skidder", "gyro", "hypercluster", "coli", "molotov", "hypertwister", "ream"]
            },
            annies: {
                name: "Annihilators (AR)",
                tanks: ["obliterator", "compound", "wiper", "stomper", "autoanni", "shaver", "eradicator"]
            },
            necro: {
                name: "Underseer (AR)",
                tanks: ["diviner", "autonecro", "necrodrive", "megaautounderdrive", "tripleautounderdrive", "pentamancer", "pentadrive", "warlock", "autopentaseer"]
            },
            carriers: {
                name: "Carriers (AR)",
                tanks: ["warship", "battlerdrive", "bismarck", "proddrive", "manufacture", "dirigible", "autobattleship", "autoprod", "autocruiserdrive"]
            },
            auto3_ar: {
                name: "Auto-3 (AR)",
                tanks: ["auto6", "auto7", "mega5", "batter4", "hurler3", "autoauto4"]
            },
            dps_ar: {
                name: "DPS (AR)",
                tanks: ["toppler", "coli", "crack", "autooperator", "manufacture", "lorry"]
            },
            spikes_ar: {
                name: "Spikes (AR)",
                tanks: ["thorn", "megaspike", "claymore", "spear", "prick"]
            },
            crash: {
                name: "Crash (AR)",
                tanks: ["whirlwind", "tempest", "septamech", "doubleequalizer", "rigger", "lorry", "manufacture", "doublespread", "palisade"]
            },
            all_ar: {
                name: "All (AR)",
                tanks: ["basic","whirlwind", "tempest", "septamech", "doubleequalizer", "rigger", "lorry", "manufacture", "doublespread", "palisade","thorn", "megaspike", "claymore", "spear", "prick","toppler", "coli", "crack", "autooperator", "manufacture", "lorry","auto6", "auto7", "mega5", "batter4", "hurler3", "autoauto4","warship", "battlerdrive", "bismarck", "proddrive", "manufacture", "dirigible", "autobattleship", "autoprod", "autocruiserdrive","diviner", "autonecro", "necrodrive", "megaautounderdrive", "tripleautounderdrive", "pentamancer", "pentadrive", "warlock", "autopentaseer","obliterator", "compound", "wiper", "stomper", "autoanni", "shaver", "eradicator","hyperskimmer", "skidder", "gyro", "hypercluster", "coli", "molotov", "hypertwister", "ream","browser", "strider", "autobomber", "tripleautotriangle", "surferdrive", "electrocutor", "kicker", "megaautotriangle", "roller", "autoeagle","megasmasher", "spike", "autosmasher", "landmine","penta", "spread", "octo", "autogunner", "triplet", "predator", "triplex", "quadruplex", "machinegunner","auto5", "mega3", "auto6","overczar", "tyrant", "autooverlord", "megaautooverseer", "tripleautooverseer", "autooverdrive", "headman", "overcheese", "overstorm","skimmer", "twister", "swarmer", "sidewinder", "fieldgun","fighter", "autotriangle", "surfer", "eagle", "bomber", "vulture", "phoenix"]
            }
        }
    };

    // Custom Select Logic
    let currentTank = "basic";
    let currentSwarm2Tank = "basic";

    function populateSwarm2TankOptions() {
        if (!HTML.swarm2TankSelect) return;
        const select = HTML.swarm2TankSelect;
        const options = [];
        const seen = new Set();

        for (const groupName in tankCategories) {
            for (const tankKey in tankCategories[groupName]) {
                const definition = tankCategories[groupName][tankKey];
                const label = typeof definition === "string" ? definition : definition.name;
                if (!seen.has(tankKey)) {
                    seen.add(tankKey);
                    options.push({ value: tankKey, label });
                }
            }
        }

        select.innerHTML = options.map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');
        const preferred = options.some(opt => opt.value === currentSwarm2Tank) ? currentSwarm2Tank : 'basic';
        currentSwarm2Tank = preferred;
        select.value = preferred;
    }

    function populateTankOptions(filter = "") {
        const list = HTML.tankOptionsList;
        list.innerHTML = "";
        const query = filter.toLowerCase();

        for (const groupName in tankCategories) {
            const matches = [];
            for (const tankKey in tankCategories[groupName]) {
                const definition = tankCategories[groupName][tankKey];
                const tankName = typeof definition === "string" ? definition : definition.name;

                if (tankName.toLowerCase().includes(query)) {
                    matches.push({ key: tankKey, name: tankName });
                }
            }

            if (matches.length > 0) {
                const label = document.createElement("div");
                label.className = "drop-group";
                label.textContent = groupName;
                list.appendChild(label);

                matches.forEach(match => {
                    const item = document.createElement("div");
                    item.className = "drop-item" + (match.key === currentTank ? " selected" : "");
                    item.textContent = match.name;
                    item.onclick = (e) => {
                        e.stopPropagation();
                        selectTank(match.key, match.name);
                    };
                    list.appendChild(item);
                });
            }
        }
    }

    function selectTank(key, name) {
        if (key) currentTank = key;

        let definition;
        for (const group in tankCategories) {
            if (tankCategories[group][currentTank]) {
                definition = tankCategories[group][currentTank];
                break;
            }
        }

        if (definition) {
            const displayName = typeof definition === "string" ? definition : definition.name;
            if (HTML.selectedTankDisplay) HTML.selectedTankDisplay.textContent = displayName;
            packet("Z", definition.tanks || currentTank);
            saveSettings();
        }
        closeDropdown();
    }

    function toggleDropdown() {
        const isOpen = HTML.tankOptionsList.classList.contains("show");
        if (isOpen) closeDropdown();
        else openDropdown();
    }

    function openDropdown() {
        if (!HTML.tankOptionsList) return;
        HTML.tankOptionsList.classList.add("show");
        if (HTML.tankTrigger) HTML.tankTrigger.classList.add("active");
        if (HTML.selectedTankDisplay) HTML.selectedTankDisplay.style.display = "none";
        if (HTML.tankSearchInput) {
            HTML.tankSearchInput.style.display = "block";
            HTML.tankSearchInput.value = "";
            HTML.tankSearchInput.focus();
        }
        populateTankOptions();
    }

    function closeDropdown() {
        if (!HTML.tankOptionsList) return;
        HTML.tankOptionsList.classList.remove("show");
        if (HTML.tankTrigger) HTML.tankTrigger.classList.remove("active");
        if (HTML.selectedTankDisplay) HTML.selectedTankDisplay.style.display = "block";
        if (HTML.tankSearchInput) HTML.tankSearchInput.style.display = "none";
    }



    if (HTML.tankTrigger) {
        HTML.tankTrigger.onclick = (e) => {
            e.stopPropagation();
            toggleDropdown();
        };
    }

    if (HTML.tankSearchInput) {
        HTML.tankSearchInput.oninput = () => {
            populateTankOptions(HTML.tankSearchInput.value);
        };

        HTML.tankSearchInput.onkeydown = (e) => {
            // Prevent keys from leaking to the game while typing
            e.stopPropagation();

            if (e.key === "Enter") {
                e.preventDefault();
                const firstItem = HTML.tankOptionsList.querySelector(".drop-item");
                if (firstItem) {
                    firstItem.click();
                }
            }
        };

        HTML.tankSearchInput.onclick = (e) => e.stopPropagation();
    }

    // Close on outside click
    if (HTML.tankContainer) {
        window.addEventListener("click", (e) => {
            if (!HTML.tankContainer.contains(e.target)) {
                closeDropdown();
            }
        });
    }

        const initializeCodespaceUrlFields = () => {
            const existingFields = document.querySelectorAll('.codespaceUrlInput');
            if (existingFields.length === 0) {
                addCodespaceUrlField();
            } else {
                existingFields.forEach(field => field.addEventListener('input', saveSettings));
            }
        };

        // Initial load and setup
        try {
            loadSettings();
            if (HTML.toggleAntiInvis) {
                window.antiInviActive = HTML.toggleAntiInvis.checked;
            }
            populateTankOptions();
            populateSwarm2TankOptions();
            setTimeout(() => {
                selectTank(currentTank);
            }, 100);

            // Auto-save listeners
const inputElements = [HTML.serverHash, HTML.botCount, HTML.spawnDelay, HTML.mainTickMs, HTML.manualX, HTML.manualY, HTML.localWsUrl, HTML.mouseSensitivity, HTML.chatMessage, HTML.autoRespawn, HTML.toggleAntiInvis, HTML.swarm2ServerHash, HTML.swarm2CustomBotName, HTML.swarm2BotCount, HTML.swarm2SpawnDelay, HTML.swarm2MainTickMs];
            inputElements.forEach(el => {
                if (el) {
                    el.addEventListener('input', () => {
                        if (el === HTML.mouseSensitivity && HTML.sensitivityValue) {
                            HTML.sensitivityValue.textContent = el.value;
                        }
                        saveSettings();
                    });
                }
            });

        if (HTML.addCodespaceUrl) {
            HTML.addCodespaceUrl.addEventListener('click', (event) => {
                event.preventDefault();
                addCodespaceUrlField();
                saveSettings();
            });
        }
        if (HTML.connectCodespaces) {
            HTML.connectCodespaces.addEventListener('click', (event) => {
                event.preventDefault();
                connect();
            });
        }
        if (HTML.disconnectCodespaces) {
            HTML.disconnectCodespaces.addEventListener('click', (event) => {
                event.preventDefault();
                disconnect();
            });
        }
        if (HTML.reconnectCodespaces) {
            HTML.reconnectCodespaces.addEventListener('click', (event) => {
                event.preventDefault();
                reconnect();
            });
        }

        initializeCodespaceUrlFields();

        const toggleElements = [HTML.autofire, HTML.autospin, HTML.overrideToggle, HTML.mbs, HTML.feeding, HTML.holdPosition, HTML.manualMode, HTML.repeatChat, HTML.autoRespawn, HTML.toggleAntiInvis, HTML.swarm2Autofire, HTML.swarm2Autospin, HTML.swarm2FollowMouse, HTML.swarm2AutoFeed, HTML.swarm2HoldPosition, HTML.swarm2OverrideToggle];
        toggleElements.forEach(el => {
            if (el) {
                el.addEventListener('change', () => {
                    saveSettings();
                    if (el === HTML.toggleAntiInvis) {
                        syncAntiInvisState();
                    }
                });
            }
        });

        if (HTML.swarm2TankSelect) {
            HTML.swarm2TankSelect.addEventListener('change', () => {
                currentSwarm2Tank = HTML.swarm2TankSelect.value;
                packet('Z', HTML.swarm2TankSelect.value, 'swarm2');
                saveSettings();
            });
        }

        if (HTML.swarm2Summon) {
            HTML.swarm2Summon.addEventListener('click', () => {
                const hash = HTML.swarm2ServerHash.value?.replace('#', '') || window.location.hash.slice(1);
                const count = parseInt(HTML.swarm2BotCount.value) || 1;
                if (!hash) {
                    alert('Please paste a server hash or join a game first for Swarm 2!');
                    return;
                }
                const currentName = HTML.swarm2CustomBotName?.value || '';
                const midpointX = parseFloat(HTML.swarm2MidpointX?.value) || 0;
                const midpointY = parseFloat(HTML.swarm2MidpointY?.value) || 0;
                const radius = parseFloat(HTML.swarm2Radius?.value) || 0;
                const spawnDelay = parseInt(HTML.swarm2SpawnDelay?.value) || 0;
                const mainTickMs = parseInt(HTML.swarm2MainTickMs?.value) || 140;
                const ready = sockets.some(entry => entry?.ws?.readyState === WebSocket.OPEN && entry?.ready);
                const selectedTank = HTML.swarm2TankSelect?.value || currentSwarm2Tank || 'basic';
                const circlePoints = [];
                if (count > 0 && radius > 0) {
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        circlePoints.push(midpointX + Math.cos(angle) * radius, midpointY + Math.sin(angle) * radius);
                    }
                }
                packet('Z', selectedTank, 'swarm2');
                if (!ready) {
                    connect();
                    setTimeout(() => {
                        if (sockets.some(entry => entry?.ws?.readyState === WebSocket.OPEN && entry?.ready)) {
                            packet('F', hash, count, currentName, spawnDelay, mainTickMs, HTML.autoRespawn?.checked || false, 'swarm2', selectedTank, HTML.swarm2Autofire?.checked || false, HTML.swarm2Autospin?.checked || false, circlePoints.length ? circlePoints : null);
                        }
                    }, 700);
                    return;
                }
                packet('F', hash, count, currentName, spawnDelay, mainTickMs, HTML.autoRespawn?.checked || false, 'swarm2', selectedTank, HTML.swarm2Autofire?.checked || false, HTML.swarm2Autospin?.checked || false, circlePoints.length ? circlePoints : null);
            });
        }

        if (HTML.swarm2DismissBots) {
            HTML.swarm2DismissBots.addEventListener('click', () => { packet('B', 'swarm2'); });
        }
    } catch (e) {
        console.error("Initialization error:", e);
    }

    // KEYBOARD CONTROLS
    let keys = {};
    let menuVisible = false;
    const handleMenuKey = (e) => {
        const code = e.code || "";
        if (keys[code]) return;
        keys[code] = true;

        const key = e.key || e.code || (e.keyCode === 27 ? 'Escape' : '');
        if (key === "Escape" || key === "Esc" || e.keyCode === 27) {
            menuVisible = !menuVisible;
            if (menu) {
                menu.style.display = menuVisible ? "flex" : "none";
                menu.style.zIndex = '9999999';
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };
    document.addEventListener("keydown", handleMenuKey, true);
    document.addEventListener("keyup", e => {
        const code = e.code || "";
        keys[code] = false;
    }, true);

    // MOUSE TRACKING
    let mouseX = 0, mouseY = 0, mouseDown = false, rMouseDown = false;
    window.addEventListener("mousedown", e => {
        if (e.button == 0) mouseDown = true;
        else if (e.button == 2) rMouseDown = true;
    });
    window.addEventListener("mouseup", e => {
        if (e.button == 0) mouseDown = false;
        else if (e.button == 2) rMouseDown = false;
    });
    window.addEventListener("mousemove", e => {
        mouseX = (e.clientX + window.scrollX) - (window.innerWidth / 2);
        mouseY = (e.clientY + window.scrollY) - (window.innerHeight / 2);
    });

    // WEBSOCKET COMMUNICATION
    let sockets = [];

    function getConnectRows() {
        if (!HTML.codespaceUrlFields) return [];
        return Array.from(HTML.codespaceUrlFields.querySelectorAll('.codespace-url-row'))
            .map(row => ({
                row,
                input: row.querySelector('.codespaceUrlInput'),
                url: row.querySelector('.codespaceUrlInput')?.value.trim() || ''
            }))
            .filter(entry => entry.url);
    }

    function getConnectUrls() {
        const rows = getConnectRows();
        if (rows.length > 0) return rows.map(entry => entry.url);
        const localUrlValue = HTML.localWsUrl?.value?.trim();
        const fallbackUrl = localUrlValue || "ws://127.0.0.1:8082";
        return [fallbackUrl];
    }

    function addCodespaceUrlField(initialUrl = '') {
        if (!HTML.codespaceUrlFields) return null;

        const row = document.createElement('div');
        row.className = 'codespace-url-row';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'codespaceUrlInput';
        input.placeholder = 'ws://codespace:1338';
        input.value = initialUrl;
        input.addEventListener('input', saveSettings);

        const status = document.createElement('span');
        status.className = 'mini-status codespace-row-status status-idle';
        status.textContent = 'Idle';

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'removeCodespaceUrl';
        removeButton.textContent = '✕';
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            row.remove();
            saveSettings();
        });

        row.append(input, removeButton, status);
        HTML.codespaceUrlFields.appendChild(row);
        return row;
    }

    function updateCodespaceRowStatus(row, status) {
        if (!row) return;
        const badge = row.querySelector('.codespace-row-status');
        if (!badge) return;

        const labelMap = {
            idle: 'Idle',
            connecting: 'Connecting',
            connected: 'Connected',
            disconnected: 'Disconnected',
            error: 'Error'
        };

        badge.textContent = labelMap[status] || 'Idle';
        badge.classList.toggle('status-idle', status === 'idle');
        badge.classList.toggle('status-connecting', status === 'connecting');
        badge.classList.toggle('status-connected', status === 'connected');
        badge.classList.toggle('status-disconnected', status === 'disconnected');
        badge.classList.toggle('status-error', status === 'error');
        row.dataset.status = status;
    }

    function updateCodespaceGlobalStatus(status) {
        if (HTML.codespaceGlobalStatus) HTML.codespaceGlobalStatus.textContent = status;
    }

    function packet(...args) {
        const encoded = msgpack.encode(args);
        sockets.forEach(entry => {
            const ws = entry?.ws;
            if (ws?.readyState === WebSocket.OPEN && entry?.ready) {
                ws.send(encoded);
            }
        });
    }

    function updateLocalStatus(value) {
        if (HTML.localWsStatus) HTML.localWsStatus.textContent = value;
    }

    function disconnect() {
        sockets.forEach(obj => obj.ws.close());
        sockets = [];
        updateCodespaceGlobalStatus('Disconnected');
        getConnectRows().forEach(({ row }) => updateCodespaceRowStatus(row, 'disconnected'));
        if (HTML.serverStatus) HTML.serverStatus.innerHTML = 'Disconnected';
        if (HTML.serverStatusBadge) HTML.serverStatusBadge.classList.remove('connected');
        updateLocalStatus('Idle');
    }

    function reconnect() {
        disconnect();
        setTimeout(connect, 150);
    }

    function connect() {
        disconnect();
        const connectRows = getConnectRows();
        const urlsToConnect = connectRows.length > 0 ? connectRows.map(entry => entry.url) : getConnectUrls();
        if (!urlsToConnect.length) {
            if (HTML.serverStatus) HTML.serverStatus.innerHTML = "No WS URL configured";
            updateCodespaceGlobalStatus('No URLs');
            return;
        }

        updateCodespaceGlobalStatus('Connecting');
        if (connectRows.length > 0) {
            connectRows.forEach(({ row }) => updateCodespaceRowStatus(row, 'connecting'));
        }

        urlsToConnect.forEach((url, index) => {
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";
            const row = connectRows[index]?.row;
            const socketEntry = { url, ws, row, ready: false };

            ws.onopen = () => {
                if (HTML.serverStatus) HTML.serverStatus.innerHTML = "Connected";
                if (HTML.serverStatusBadge) HTML.serverStatusBadge.classList.add("connected");
                if (row) updateCodespaceRowStatus(row, 'connected');
                updateCodespaceGlobalStatus('Connected');
                if (HTML.localWsUrl?.value && !connectRows.length) updateLocalStatus('Connected');
                ws.send(msgpack.encode(["M", 72011]));
            };

            ws.onmessage = m => {
                const data = msgpack.decode(new Uint8Array(m.data));
                const type = data[0];
                if (type === "M") {
                    ws.send(msgpack.encode(["C", data[1] ^ 845]));
                    socketEntry.ready = true;
                    if (HTML.serverStatus) HTML.serverStatus.innerHTML = "Ready";
                    selectTank();
                }
            };

            ws.onerror = () => {
                if (row) updateCodespaceRowStatus(row, 'error');
                updateCodespaceGlobalStatus('Error');
            };

            ws.onclose = () => {
                socketEntry.ready = false;
                if (row) updateCodespaceRowStatus(row, 'disconnected');
                if (sockets.every(obj => obj.ws.readyState === WebSocket.CLOSED)) {
                    if (HTML.serverStatus) HTML.serverStatus.innerHTML = "Disconnected";
                    if (HTML.serverStatusBadge) HTML.serverStatusBadge.classList.remove("connected");
                    updateCodespaceGlobalStatus('Disconnected');
                }
            };

            sockets.push(socketEntry);
        });
    }

    connect();

    if (HTML.serverStatus) {
    HTML.serverStatus.addEventListener("click", () => {
        // The new connect() function handles closing the old sockets for you now!
        HTML.serverStatus.innerHTML = "❌ Connecting...";
        connect();
    });
}

    if (HTML.connectNoob) {
        HTML.connectNoob.addEventListener("click", () => {
            const hash = HTML.serverHash.value?.replace("#", "") || window.location.hash.slice(1);
            const count = parseInt(HTML.botCount.value) || 1;
            if (!hash) {
                alert("Please paste a server hash or join a game first!");
                return;
            }
            const currentName = document.getElementById("customBotName")?.value || "";
            const spawnDelay = parseInt(HTML.spawnDelay?.value) || 0;
            const mainTickMs = parseInt(HTML.mainTickMs?.value) || 140;
            const ready = sockets.some(entry => entry?.ws?.readyState === WebSocket.OPEN && entry?.ready);
            if (!ready) {
                connect();
                setTimeout(() => {
                    if (sockets.some(entry => entry?.ws?.readyState === WebSocket.OPEN && entry?.ready)) {
                        packet("F", hash, count, currentName, spawnDelay, mainTickMs, HTML.autoRespawn?.checked || false);
                    }
                }, 700);
                return;
            }
            packet("F", hash, count, currentName, spawnDelay, mainTickMs, HTML.autoRespawn?.checked || false);
        });
    }

    if (HTML.deleteNoobs) {
        HTML.deleteNoobs.addEventListener("click", () => { packet("B"); });
    }

    // GAME COORDINATE INTERCEPTION
    let x = null, y = null, lastUpdate = 0;
    const oldStrokeText = CanvasRenderingContext2D.prototype.strokeText;
    CanvasRenderingContext2D.prototype.strokeText = function (text, ...args) {
        if (text.includes("Coordinates: (")) {
            const match = text.match(/Coordinates: \(([^)]+)\)/);
            if (match) {
                const parts = match[1].split(", ");
                x = parseFloat(parts[0]);
                y = parseFloat(parts[1]);
                lastUpdate = Date.now();
            }
        } else if (text.startsWith("You have been killed by") || text === "You have died a stupid death.") {
            x = y = null; // Clear coordinates on death
        }

        if (window.antiInviActive) {
            const prevAlpha = this.globalAlpha;
            this.globalAlpha = Math.max(prevAlpha, 0.95);
            try {
                return oldStrokeText.call(this, text, ...args);
            } finally {
                this.globalAlpha = prevAlpha;
            }
        }

        return oldStrokeText.call(this, text, ...args);
    };

    // Sensitivity slider update
    if (HTML.mouseSensitivity) {
        HTML.mouseSensitivity.oninput = () => {
            if (HTML.sensitivityValue) HTML.sensitivityValue.textContent = HTML.mouseSensitivity.value;
        };
    }

    function buildSwarmBitmask({ autofire, autospin, followMouse, feed, override, manualMode, holdPosition }) {
        let mask = 0;
        if (autofire) mask |= 1 << 0;
        if (autospin) mask |= 1 << 1;
        if (followMouse) mask |= 1 << 2;
        if (feed) mask |= 1 << 3;
        if (override) mask |= 1 << 4;
        if (manualMode) mask |= 1 << 5;
        if (holdPosition) mask |= 1 << 6;
        return mask;
    }

    // BOT HEARTBEAT
    setInterval(() => {
        const divisor = parseFloat(HTML.mouseSensitivity?.value) || 20;
        const manualModeActive = HTML.manualMode?.checked || false;
        const swarm1Mask = buildSwarmBitmask({
            autofire: HTML.autofire?.checked || false,
            autospin: HTML.autospin?.checked || false,
            followMouse: HTML.mbs?.checked || false,
            feed: HTML.feeding?.checked || false,
            override: HTML.overrideToggle?.checked || false,
            manualMode: manualModeActive,
            holdPosition: HTML.holdPosition?.checked || false,
        });
        const swarm2Mask = buildSwarmBitmask({
            autofire: HTML.swarm2Autofire?.checked || false,
            autospin: HTML.swarm2Autospin?.checked || false,
            followMouse: HTML.swarm2FollowMouse?.checked || false,
            feed: HTML.swarm2AutoFeed?.checked || false,
            override: HTML.swarm2OverrideToggle?.checked || false,
            manualMode: false,
            holdPosition: HTML.swarm2HoldPosition?.checked || false,
        });
        const swarm2Count = Math.max(0, parseInt(HTML.swarm2BotCount?.value) || 0);
        const swarm2MidpointX = parseFloat(HTML.swarm2MidpointX?.value) || 0;
        const swarm2MidpointY = parseFloat(HTML.swarm2MidpointY?.value) || 0;
        const swarm2Radius = parseFloat(HTML.swarm2Radius?.value) || 0;
        const swarm2CirclePoints = [];

        if (swarm2Count > 0 && swarm2Radius > 0) {
            for (let i = 0; i < swarm2Count; i++) {
                const angle = (i / swarm2Count) * Math.PI * 2;
                swarm2CirclePoints.push(
                    swarm2MidpointX + Math.cos(angle) * swarm2Radius,
                    swarm2MidpointY + Math.sin(angle) * swarm2Radius
                );
            }
        }

        packet("A",
            x, y,
            mouseX / divisor,
            mouseY / divisor,
            mouseDown, rMouseDown,
            HTML.mbs?.checked || false,
            HTML.feeding?.checked || false,
            keys["ShiftLeft"],
            HTML.autofire?.checked || false,
            HTML.autospin?.checked || false,
            manualModeActive,
            parseFloat(HTML.manualX?.value) || 0,
            parseFloat(HTML.manualY?.value) || 0,
            swarm1Mask,
            swarm2Mask,
            swarm2CirclePoints.length ? swarm2CirclePoints : null
        );
    }, 80);

})();
