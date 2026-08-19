(async () => {
  const { WebSocket } = await import('ws');
  const { HttpsProxyAgent } = await import('https-proxy-agent');
  const { SocksProxyAgent } = await import('socks-proxy-agent');
  const url = await import('url');
  //const fs = await import('fs');
  const fetchModule = await import('node-fetch');
  const realFetch = fetchModule.default || fetchModule;

  // ===== CHECK FOR COMMAND LINE ARGUMENTS =====
  const args = process.argv.slice(2);

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      autoStartCount = parseInt(args[i + 1]);
      autoStartMode = true;
      break;
    }
  }

  process.on('uncaughtException', function (e) { console.log(e) });
  // --- WORKER PROCESS (Bot logic) ---
  let isPaused = false;
  let currentBotInterface = {};
  let devastate = () => {};
  let target = {};

  //const names = fs.readFileSync("names.txt").toString().split("\n");

  const builds = {
    basic: "0/4/6/7/7/7/7/4",
    triangle: "0/2/3/7/7/7/7/7",
    smasher: "9/12/0/0/0/0/0/12/3/6"
  };
  
  const upgrade_map = {
    1: 50,
    2: 90,
    3: 120,
    4: 180
  };

  const tanks = {
    basic: {
      path: "",
      build: ""
    },

    // OTHER
    pursuer: {
      path: "uyiy",
      build: "8/9/0/0/0/0/0/9/8/8"
    },
    anni: {
      path: "kyu",
      build: builds.basic
    },
    shotgun: {
      path: "kj",
      build: builds.basic
    },
    penta: {
      path: "yuy",
      build: builds.basic
    },
    spread: {
      path: "yuu",
      build: builds.basic
    },
    octo: {
      path: "hyyc",
      build: builds.basic
    },
    autogunner: {
      path: "iiy",
      build: builds.basic
    },
    triplet: {
      path: "yuj",
      build: builds.basic
    },
    predator: {
      path: "uuy",
      build: builds.basic
    },
    triplex: {
      path: "yjy",
      build: builds.basic
    },
    quadruplex: {
      path: "yju",
      build: builds.basic
    },
    machinegunner: {
      path: "iih",
      build: builds.basic
    },
    cyclone: {
      path: "hyuc",
      build: builds.basic
    },
    factory: {
      path: "jhy",
      build: builds.basic
    },
    septatrap: {
      path: "hjic",
      build: "0/6/0/9/9/9/9"
    },

    // ANNIES
    obliterator: {
      path: "vkyuy",
      build: builds.basic
    },
    compound: {
      path: "kyui",
      build: builds.basic
    },
    wiper: {
      path: "kyuj",
      build: builds.basic
    },
    stomper: {
      path: ["k", "y", "u", [1, 3]],
      build: builds.basic
    },
    autoanni: {
      path: ["k", "y", "u", [2, 3]],
      build: builds.basic
    },
    shaver: {
      path: ["k", "y", "u", [2, 4]],
      build: builds.basic
    },
    eradicator: {
      path: ["k", "y", "u", [1, 4]],
      build: builds.basic
    },

    // FOR CRASH
    whirlwind: {
      path: "chyuk",
      build: "9/9/0/0/0/0/9"
    },
    tempest: {
      path: "chyuh",
      build: "9/9/0/0/0/0/9"
    },
    septamech: {
      path: "chjkh",
      build: "9/9/0/0/0/0/9"
    },
    doubleequalizer: {
      path: "yjyk",
      build: "9/9/0/0/0/0/9"
    },
    rigger: {
      path: "yjkk",
      build: "9/9/0/0/0/0/9"
    },
    doublespread: {
      path: "yuuy",
      build: "9/9/0/0/0/0/9"
    },
    palisade: {
      path: ["h", "j", "y", [3, 3]],
      build: "9/9/0/0/0/0/9"
    },

    // SMASHERS
    megasmasher: {
      path: ["r", [3, 3], "y"],
      build: builds.smasher
    },
    spike: {
      path: ["r", [3, 3], "u"],
      build: builds.smasher
    },
    autoshasher: {
      path: ["r", [3, 3], "i"],
      build: builds.smasher
    },
    landmine: {
      path: ["r", [3, 3], "h"],
      build: builds.smasher
    },

    thorn: {
      path: ["r", [2, 3], "u", "y"],
      build: builds.smasher
    },
    megaspike: {
      path: ["r", [2, 3], "u", "u"],
      build: "12/12/0/0/0/0/0/7/3/8" // bc its faster by default
    },
    claymore: {
      path: ["r", [2, 3], "u", "i"],
      build: builds.smasher
    },
    spear: {
      path: ["r", [2, 3], "u", "j"],
      build: builds.smasher
    },
    prick: {
      path: ["r", [2, 3], "u", "k"],
      build: builds.smasher
    },

    slammer: {
      path: [[2, 3], "k", "y"],
      build: "8/10/12/0/0/0/0/12"
    },
    basher: {
      path: [[2, 3], "j", "j"],
      build: "8/10/12/0/0/0/0/12"
    },
    phys: {
      path: [[2, 3], [3, 3]],
      build: builds.smasher
    },

    // DPS
    toppler: {
      path: "uijh",
      build: builds.basic
    },
    crack: {
      path: "yuyj",
      build: builds.basic
    },
    autooperator: {
      path: [[1, 3], "j", "j", [2, 3]],
      build: builds.basic
    },
    lorry: {
      path: "ihyy",
      build: builds.basic
    },

    // BUILDERS
    engineer: {
      path: "kui",
      build: builds.basic
    },
    assembler: {
      path: "kuj",
      build: builds.basic
    },
    architect: {
      path: "kuk",
      build: builds.basic
    },

    // AUTO
    auto5: {
      path: "hiy",
      build: builds.basic
    },
    mega3: {
      path: "hiu",
      build: builds.basic
    },
    auto6: {
      path: "hiiy",
      build: builds.basic
    },

    auto7: {
      path: "hiyy",
      build: builds.basic
    },
    mega5: {
      path: "hiyu",
      build: builds.basic
    },
    autoauto4: {
      path: "hiii",
      build: builds.basic
    },
    hurler3: {
      path: "hiui",
      build: builds.basic
    },
    batter4: {
      path: "hiiu",
      build: builds.basic
    },

    // LAUNCHERS
    skimmer: {
      path: "khy",
      build: builds.basic
    },
    twister: {
      path: "khu",
      build: builds.basic
    },
    swarmer: {
      path: "khi",
      build: builds.basic
    },
    sidewinder: {
      path: "khh",
      build: builds.basic
    },
    fieldgun: {
      path: "khj",
      build: builds.basic
    },

    // AR LAUNCHERS
    spinner: {
      path: "khju",
      build: builds.basic
    },
    helix_ar: {
      path: "khuh",
      build: builds.basic
    },
    hypertwister: {
      path: "khui",
      build: builds.basic
    },
    gyro: {
      path: "khuk",
      build: builds.basic
    },
    coli: {
      path: ["k", "h", "u", [3, 3]],
      build: builds.basic
    },

    hyperskimmer: {
      path: "khyi",
      build: builds.basic
    },
    skidder: {
      path: "khjy",
      build: builds.basic
    },
    ream: {
      path: "khyh",
      build: builds.basic
    },

    hyperswarmer: {
      path: "khih",
      build: builds.basic
    },
    molotov: {
      path: "khij",
      build: builds.basic
    },

    firework: {
      path: "khky",
      build: builds.basic
    },
    levi: {
      path: "khkh",
      build: builds.basic
    },

    hypercluster: {
      path: ["k", "h", [4, 2], "h"],
      build: builds.basic
    },
    neutron: {
      path: ["k", "h", [4, 2], [1, 4]],
      build: builds.basic
    },

    // DRONES
    overczar: {
      path: "jyyy",
      build: builds.basic
    },
    tyrant: {
      path: "jyyk",
      build: builds.basic
    },
    autooverlord: {
      path: "jyyj",
      build: builds.basic
    },
    megaautooverseer: {
      path: "jyiy",
      build: builds.basic
    },
    tripleautooverseer: {
      path: "jyiu",
      build: builds.basic
    },
    autooverdrive: {
      path: "jyhh",
      build: builds.basic
    },
    headman: {
      path: "jkyy",
      build: builds.basic
    },
    overcheese: {
      path: "jkyu",
      build: builds.basic
    },
    overstorm: {
      path: "jjyu",
      build: builds.basic
    },

    // NECRO
    diviner: {
      path: "jiyy",
      build: builds.basic
    },
    autonecro: {
      path: "jiyi",
      build: builds.basic
    },
    necrodrive: {
      path: "jiyh",
      build: builds.basic
    },
    megaautounderdrive: {
      path: "jiiy",
      build: builds.basic
    },
    tripleautounderdrive: {
      path: "jiiu",
      build: builds.basic
    },

    pentamancer: {
      path: "jiky",
      build: builds.basic
    },
    pentadrive: {
      path: "jikh",
      build: builds.basic
    },
    warlock: {
      path: "jikj",
      build: builds.basic
    },
    autopentaseer: {
      path: "jiki",
      build: builds.basic
    },

    // CARRIER
    warship: {
      path: "juuy",
      build: builds.basic
    },
    battlerdrive: {
      path: "jjiu",
      build: builds.basic
    },
    bismarck: {
      path: "juku",
      build: builds.basic
    },
    proddrive: {
      path: "jjjj",
      build: builds.basic
    },
    manufacture: {
      path: "jukj",
      build: builds.basic
    },
    dirigible: {
      path: "jukk",
      build: builds.basic
    },
    autobattleship: {
      path: "juhh",
      build: builds.basic
    },
    autoprod: {
      path: "juki",
      build: builds.basic
    },
    autocruiserdrive: {
      path: "jjih",
      build: builds.basic
    },


    // TRI ANGLE
    rocket: {
      path: "huuy",
      build: "8/8/0/0/0/0/8/8/2/8"
    },
    fighter: {
      path: "huy",
      build: builds.triangle
    },
    bomber: {
      path: "huh",
      build: builds.triangle
    },
    autotriangle: {
      path: "huj",
      build: builds.triangle
    },
    surfer: {
      path: "huk",
      build: builds.triangle
    },
    eagle: {
      path: "kk",
      build: builds.triangle
    },
    phoenix: {
      path: "ihu",
      build: builds.triangle
    },
    vulture: {
      path: "uij",
      build: builds.triangle
    },

    // ARMS RACE TRI ANGLE
    // surfer
    browser: {
      path: "huky",
      build: builds.triangle
    },
    surferdrive: {
      path: "huki",
      build: builds.triangle
    },
    roller: {
      path: "hukh",
      build: builds.triangle
    },
    strider: {
      path: "hukk",
      build: builds.triangle
    },

    // auto tri angle
    megaautotriangle: {
      path: "hujy",
      build: builds.triangle
    },
    tripleautotriangle: {
      path: "huju",
      build: builds.triangle
    },
    autofighter: {
      path: "huji",
      build: builds.triangle
    },
    autobomber: {
      path: "hujk",
      build: builds.triangle
    },

    // taser
    kicker: {
      path: "uikj",
      build: builds.triangle
    },
    electrocutor: {
      path: "uiki",
      build: builds.triangle
    },

    // eagle
    autoeagle: {
      path: "kkk",
      build: builds.triangle
    },
    griffin: {
      path: "kkh",
      build: builds.triangle
    }
  };

  const options = { start: () => { } };

  WebAssembly.instantiateStreaming = false
  const arras = (function () {
    const log = function () {
      global.console.log(`[headless]`, ...arguments)
    }

    let app = false
    const wasm = function () {
      return {
        arrayBuffer: function () {
          return app
        }
      }
    }
    let lastStatus = 0, statusData = ''
    const getStatus = function (f, s) {
      let now = global.performance.now()
      if (statusData && now - lastStatus < 15000) {
        return {
          then: function () {
            return {
              then: function (f) {
                let i = JSON.parse(statusData)
                s(i)
                f(i)
              }
            }
          }
        }
      }
      let then = function () { }
      realFetch(f).then(x => x.text()).then(x => {
        statusData = x
        let i = JSON.parse(x)
        s(i)
        then(i)
      })
      return {
        then: function () {
          return {
            then: function (f) {
              then = f
            }
          }
        }
      }
    }

    let ready = false, script = false, o = [], then = function (f) {
      if (ready) {
        f();
      } else {
        o.push(f);
      }
    };

    const initializeAndRunQueue = function () {
      ready = true;
      //log('Headless arras ready.');
      for (let i = 0, l = o.length; i < l; i++) {
        o[i]();
      }
      o = [];
      then = function (f) {
        f();
      };
    }

    let prerequisites = 0;
    const onPrerequisiteLoaded = function () {
      prerequisites++;
      if (prerequisites === 2) {
        initializeAndRunQueue();
      }
    }

    realFetch('https://arras.io/app.wasm').then(x => {
      x.arrayBuffer().then(x => {
        app = x;
        //log('Prerequisite 1/2: app.wasm loaded.');
        onPrerequisiteLoaded();
      })
    });

    const loadScript = function () {
      const activateBot = (scriptContent) => {
        script = scriptContent;
        //log('Prerequisite 2/2: Game script loaded.');
        onPrerequisiteLoaded();
      };

      const extractScriptFromHtml = (html) => {
        const scriptTagStart = html.indexOf('<script>');
        if (scriptTagStart === -1) {
          log('Error: Could not find <script> tag in content.');
          return null;
        }
        let scriptContent = html.slice(scriptTagStart + 8);
        const scriptTagEnd = scriptContent.indexOf('</script');
        if (scriptTagEnd === -1) {
          log('Error: Could not find closing </script> tag.');
          return null;
        }
        scriptContent = scriptContent.slice(0, scriptTagEnd);
        return scriptContent;
      };

      //log('Fetching from https://arras.io to ensure correct script execution order...');
      realFetch('https://arras.io').then(x => x.text()).then(html => {
        const extractedScript = extractScriptFromHtml(html);
        if (extractedScript) {
          activateBot(extractedScript);
        }
      }).catch(err => {
        log('FATAL: Could not fetch from arras.io. Please check network or use a valid cache file.', err);
      });
    }
    loadScript();

    let trigger = {};
    const run = function (x, config, oa) {
      const log = function () {
        global.console.log(`[headless ${config.id}]`, ...arguments)
      }

      const internalBotInterface = {
        log: log,
        simulateKey: (code) => {
          if (trigger.keydown && trigger.keyup) {
            trigger.keydown(code);
            setTimeout(() => trigger.keyup(code), 50);
          }
        }
      };

      let destroy = function () {
        if (destroyed) { return }
        log('Destroying instance...')
        if (gameSocket && gameSocket.readyState < 3) {
          gameSocket.close()
          gameSocket = false
        }
        clearInterval(mainInterval)
        destroyed = true
      }, destroyed = false
      devastate = destroy;

      const setInterval = new Proxy(global.setInterval, {
        apply: function (a, b, c) {
          if (destroyed) { return }
          return Reflect.apply(a, b, c)
        }
      }), setTimeout = new Proxy(global.setTimeout, {
        apply: function (a, b, c) {
          if (destroyed) { return }
          return Reflect.apply(a, b, c)
        }
      })
      const h = function (o) {
        return new Proxy(o, {
          get: function (a, b, c) {
            let d = Reflect.get(a, b, c)
            return d
          }, set: function (a, b, c) {
            return Reflect.set(a, b, c)
          }
        })
      }
      const handleListener = function (type, f) {
        listeners[type] = f
      }
      const listeners = {}
      trigger = {
        mousemove: function (clientX, clientY) {
          if (listeners.mousemove) {
            listeners.mousemove({
              isTrusted: true,
              clientX: clientX,
              clientY: clientY
            })
          }
        },
        mousedown: function (clientX, clientY, button) {
          if (listeners.mousedown) {
            listeners.mousedown({
              isTrusted: true,
              clientX: clientX,
              clientY: clientY,
              button: button
            })
          }
        },
        mouseup: function (clientX, clientY, button) {
          if (listeners.mouseup) {
            listeners.mouseup({
              isTrusted: true,
              clientX: clientX,
              clientY: clientY,
              button: button
            })
          }
        },
        keydown: function (code, repeat) {
          if (listeners.keydown) {
            listeners.keydown({
              isTrusted: true,
              code: code,
              key: '',
              repeat: repeat || false,
              preventDefault: function () { }
            })
          }
        },
        keyup: function (code, repeat) {
          if (listeners.keyup) {
            listeners.keyup({
              isTrusted: true,
              code: code,
              key: '',
              repeat: repeat || false,
              preventDefault: function () { }
            })
          }
        }
      }

      global.window = global.parent = global.top = {
        WebAssembly,
        googletag: {
          cmd: {
            push: function (f) { try { f(); } catch (e) { } }
          },
          defineSlot: function () { return this; },
          addService: function () { return this; },
          display: function () { return this; },
          pubads: function () { return this; },
          enableSingleRequest: function () { return this; },
          collapseEmptyDivs: function () { return this; },
          enableServices: function () { return this; }
        },
        arrasAdDone: true
      };

      global.crypto = global.window.crypto = {
        getRandomValues: function (a) { return a }
      };
      global.addEventListener = global.window.addEventListener = function (type, f) {
        handleListener(type, f, global.window)
      };
      global.removeEventListener = global.window.removeEventListener = function (type, f) {
      };
      global.Image = global.window.Image = function () {
        return {}
      };

      let inputs = [], setValue = function (str) {
        for (let i = 0, l = inputs.length; i < l; i++) {
          inputs[i].value = str
        }
      }
      let position = [0, 0, 5], died = false, died2 = false, ignore = false, disconnected = false, connected = false, inGame = false, upgrade = false, reconnectCount = 0;

      let innerWidth = global.window.innerWidth = 500
      let innerHeight = global.window.innerHeight = 500

      let st = 2, lx = 0, gd = 1, canvasRef = {}, sr = 1, s = 1;

      const g = function () {
        let w = innerWidth;
        let h = innerHeight;
        if (!canvasRef.width) canvasRef.width = w;
        if (w * 0.5625 > h) {
          s = 888.888888888 / w;
        } else {
          s = 500 / h;
        }
        sr = canvasRef.width / w;
      };
      g();

      global.document = global.window.document = (function () {
        const emptyFunc = () => { };
        const emptyStyle = { setProperty: emptyFunc };

        const simulatedContext2D = {
          isContextLost: () => false,

          fillText: function () {
            if (ignore) { return }
            let a = Array.from(arguments)
            if (this.font === 'bold 7px Ubuntu' && this.fillStyle === 'rgb(255,255,255)') {
              if (a[0] === `You have spawned! Welcome to the game.`) {
                hasJoined = firstJoin = true
              } else if (a[0] === 'You have traveled through a portal!') {
                hasJoined = true
              }
              if (!died && (
                (a[0].startsWith('The server was ') && a[0].endsWith('% active'))
                || a[0].startsWith('Survived for ')
                || a[0].startsWith('Succumbed to ')
                || a[0] === 'You have self-destructed.'
                || a[0] === `Vanished into thin air`
                || a[0].startsWith('You have been killed by '))) {
                died = true
              }
              if (!a[0].startsWith(`You're using an ad blocker.`) && a[0] !== 'Respawn' && a[0] !== 'Back' && a[0] !== 'Reconnect' && a[0].length > 2) {
                //log('[arras]', a[0])
                if (a[0].startsWith("You have been killed by ") || a[0] === "You have died a stupid death.") {
                  died = true;
                }
              }
            }
            if (this.font === 'bold 7.5px Ubuntu' && this.fillStyle === 'rgb(231,137,109)') {
              if (a[0] === 'You have been temporarily banned from the game.' || a[0] === 'Your IP address have been blacklisted due to suspicious activities.') {
                disconnected = true
                destroy()
                log('[arras]', a[0])
              } else if (a[0].startsWith('The connection closed due to ')) {
                disconnected = true
                if (!destroyed) {
                  destroy()
                  if (connected) {
                    if (reconnectCount < config.reconnectAttempts) {
                      reconnectCount++;
                      log(`Attempting to reconnect in ${config.reconnectDelay / 1000}s... (${reconnectCount}/${config.reconnectAttempts})`);
                      global.setTimeout(function () {
                        log('Reconnecting...');
                        run(x, config, arras);
                      }, config.reconnectDelay);
                    } else {
                      log(`Max reconnection attempts reached (${config.reconnectAttempts}). Will not reconnect.`);
                    }
                  }
                }
                log('[arras]', a[0])
              }
            }
            if (this.font === 'bold 5.1px Ubuntu' && this.fillStyle === 'rgb(255,255,255)') {
              if (a[0].startsWith('Coordinates: (')) {
                if (died2) {
                  hasJoined = true;
                }

                let b = a[0].slice(14), l = b.length
                if (b[l - 1] === ')') {
                  b = b.slice(0, l - 1).split(', ')
                  if (b.length === 2) {
                    let x = parseFloat(b[0])
                    let y = parseFloat(b[1])
                    position[0] = x
                    position[1] = y
                    position[2] = 5
                  }
                }
              }
            }
          },

          measureText: (text) => ({ width: text.length }),
          clearRect: emptyFunc, strokeRect: emptyFunc, fillRect: emptyFunc,
          save: emptyFunc, translate: emptyFunc, clip: emptyFunc, restore: emptyFunc,
          beginPath: emptyFunc,
          moveTo: function () {
            canvasRef = this.canvas;
            if (st > 0) {
              st--;
              if (st === 1) {
                lx = arguments[0];
              } else {
                const diff = arguments[0] - lx;
                if (diff !== 0) {
                  gd = sr / diff;
                }
              }
            }
          },
          lineTo: emptyFunc, rect: emptyFunc,
          arc: emptyFunc, ellipse: emptyFunc, roundRect: emptyFunc, closePath: emptyFunc,
          fill: emptyFunc, stroke: emptyFunc, strokeText: emptyFunc, drawImage: emptyFunc,
        };

        const createElement = function (tag, options) {
          const element = {
            tag: tag ? tag.toLowerCase() : '',
            appended: false,
            value: '',
            style: emptyStyle,
            addEventListener: (type, f) => handleListener(type, f, element),
            setAttribute: emptyFunc,
            appendChild: (e) => { e.appended = true },
            focus: emptyFunc,
            blur: emptyFunc,
            remove: emptyFunc,
            getBoundingClientRect: () => ({
              width: innerWidth, height: innerHeight, top: 0, left: 0, bottom: innerHeight, right: innerWidth,
            }),
          };

          if (element.tag === 'canvas') {
            element.toDataURL = () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';
            element.getContext = (type) => {
              if (type === '2d') {
                simulatedContext2D.canvas = element;
                return simulatedContext2D;
              }
              return null;
            };
          }

          if (element.tag === 'input') {
            inputs.push(element);
          }

          if (options) {
            Object.assign(element, options);
          }

          return element;
        };

        const doc = createElement('document', {
          createElement: createElement,
          body: null,
          fonts: { load: () => true },
          referrer: '',
        });
        doc.body = createElement('body');

        return doc;
      })();

      global.location = global.window.location = {
        hostname: 'arras.io',
        hash: config.hash,
        query: ''
      }
      let lastHash = global.location.hash
      global.prompt = global.window.prompt = function () {
        console.log('prompt', ...arguments)
      }
      let devicePixelRatio = global.window.devicePixelRatio = 1
      let a = false
      global.requestAnimationFrame = global.window.requestAnimationFrame = function (f) {
        st = 2;
        g();
        a = f
      }
      global.performance = {
        time: 0,
        now: function () {
          return this.time
        }
      }
      const console = {
        log: new Proxy(global.console.log, {
          apply: function (a, b, args) {
            if (args[0] === '%cStop!' || (args[0] && args[0].startsWith && args[0].startsWith('%cHackers have been known'))) { return }
            return Reflect.apply(a, b, args)
          }
        })
      }

      let proxyAgent = null;
      if (config.proxy) {
        if (config.proxy.type === 'socks') {
          proxyAgent = new SocksProxyAgent(config.proxy.url);
        } else if (config.proxy.type === 'http') {
          proxyAgent = new HttpsProxyAgent(config.proxy.url);
        }
      }

      let i = 0, controller = {
        x: 250,
        y: 250,
        mouseDown: function (button) {
          trigger.mousedown(controller.x, controller.y, button)
        },
        mouseUp: function (button) {
          trigger.mouseup(controller.x, controller.y, button)
        },
        click: function (x, y) {
          trigger.mousedown(x, y, 0)
          trigger.mouseup(x, y, 0)
        },
        press: function (code) {
          trigger.keydown(code)
          trigger.keyup(code)
        },
        chat: function (str) {
          controller.press('Enter')
          global.performance.time += 90
          a()
          controller.press('Enter')
          global.performance.time += 90
          a()
          setValue(str)
          controller.press('Enter')
          global.performance.time += 90
          a()
          setValue(str)
          controller.press('Enter')
        },
        moveDirection: function (x, y) {
          trigger[x < 0 ? 'keydown' : 'keyup']('KeyA')
          trigger[y < 0 ? 'keydown' : 'keyup']('KeyW')
          trigger[x > 0 ? 'keydown' : 'keyup']('KeyD')
          trigger[y > 0 ? 'keydown' : 'keyup']('KeyS')
        },
        iv: 4 / Math.PI,
        dv: Math.PI / 4,
        ix: [1, 1, 0, -1, -1, -1, 0, 1],
        iy: [0, 1, 1, 1, 0, -1, -1, -1],
        moveVector: function (x, y, i) {
          let d = Math.atan2(y, x)
          let h = (Math.round(d * controller.iv) % 8 + 8) % 8
          let x2 = controller.ix[h]
          let y2 = controller.iy[h]
          controller.moveDirection(x2, y2)
          return h * controller.dv
        }
      }, statusRecieved = false, firstJoin = false, hasJoined = false, timeouts = {}, timeout = function (f, t) {
        if (!(t >= 1)) { t = 1 }
        let n = i + t
        let a = timeouts[n]
        if (!a) {
          a = timeouts[n] = []
        }
        a.push(f)
      }, block = false

      async function waitTime(timeout) {
          await new Promise(resolve => setTimeout(resolve, timeout));
      }


      // PATH FIND FUNC
      function getDir(x1, y1, x2, y2) {
          return Math.atan2(y2 - y1, x2 - x1);
      }

      function randint(a, b) {
          return Math.floor(Math.random() * (b - a + 1)) + a;
      }

      function choice(array) {
          return array[randint(0, array.length-1)];
      }

      function stopMoving() {
        for (const key of "WASD") {
          trigger.keyup("Key" + key);
        }
      }

      function pathfind(x, y) {
        const angle = getDir(position[0], position[1], x, y);
        let hold = {};

        // Perfect 8-direction movement
        if (angle >= -Math.PI / 8 && angle < Math.PI / 8) {
            // Right
            hold["KeyD"] = true;
        } else if (angle >= Math.PI / 8 && angle < 3 * Math.PI / 8) {
            // Down-Right
            hold["KeyS"] = true;
            hold["KeyD"] = true;
        } else if (angle >= 3 * Math.PI / 8 && angle < 5 * Math.PI / 8) {
            // Down
            hold["KeyS"] = true;
        } else if (angle >= 5 * Math.PI / 8 && angle < 7 * Math.PI / 8) {
            // Down-Left
            hold["KeyS"] = true;
            hold["KeyA"] = true;
        } else if (angle >= 7 * Math.PI / 8 || angle < -7 * Math.PI / 8) {
            // Left
            hold["KeyA"] = true;
        } else if (angle >= -7 * Math.PI / 8 && angle < -5 * Math.PI / 8) {
            // Up-Left
            hold["KeyW"] = true;
            hold["KeyA"] = true;
        } else if (angle >= -5 * Math.PI / 8 && angle < -3 * Math.PI / 8) {
            // Up
            hold["KeyW"] = true;
        } else {
            // Up-Right
            hold["KeyW"] = true;
            hold["KeyD"] = true;
        }
        
        for (let key of "WASD") {
          key = "Key" + key;
          trigger[hold[key] ? "keydown" : "keyup"](key);
        }
      }

      async function onJoin() {
        reconnectCount = 0;

        let waited;
        for (const key of tanks[target.tank].path) {
          if (key === "wait") {
            await waitTime(1000);
          } else if (key instanceof Array) {
            await waitTime(500);
            controller.click(upgrade_map[key[0]], upgrade_map[key[1]]);
            await waitTime(500);
          } else {
            controller.press("Key" + key.toUpperCase());
          }
        }

        let build;
        if (target.feed) {
          build = [0, 0, 12, 0, 0, 0, 0, 8]
          controller.press("KeyR");
        } else {
          build = tanks[target.tank].build.split("/");
        }

        let i2 = 0;
        for (let i = 1; i <= build.length; i++) {
          const stat = parseInt(build[i2]);
          
          if (i == 10) {
            i = 0;
          }

          for (let i3 = 0; i3 < stat; i3++) {
            controller.press("Digit" + i);
          }

          if (i == 0)
            break;

          i2++;
        }

        for (const key of config.keysHold) {
          trigger.keydown("Key" + key.toUpperCase());
        }

        inGame = true
        died2 = false
      }

      const mainInterval = setInterval(function () {
        if (block || isPaused) {
          return
        }

        if (a) {
          switch (i) {
            case 1: {
              setValue(config.name)
              // xd setValue(choice(names))

              controller.press("Enter")
              log('Play button clicked!', config.name, global.location.hash)
              break
            }
          }
          if (lastHash !== global.location.hash) {
            log('hash =', global.location.hash)
            lastHash = global.location.hash
          }
          let at = timeouts[i]
          if (at) {
            delete timeouts[i]
            for (let i = 0, l = at.length; i < l; i++) {
              at[i]()
            }
          }
          position[2]--
          if (position[2] < 0) {
            controller.press('KeyL')
          }
          if (hasJoined) {
            hasJoined = false;
            fisrtJoin = false;
            if (tanks instanceof Array && tanks[target.tank].path.find(key => key instanceof Array)) {
              setTimeout(onJoin, 500);
            } else {
              onJoin();
            }
          }
          if (inGame && config.type === 'follow') {
            // if (i % 35 === 34) {
            //   controller.chat("7".repeat(randint(1, 60)))
            // }

            // if (Math.random() < 0.002) {
            //   controller.chat("#PRAISETHEPRIMORDIALNOOB");
            // }

            if (target.x) {
              let t = {
                x: target.x,
                y: target.y
              };

              if (target.followMouse) {
                t.x += target.mouseX;
                t.y += target.mouseY;
              }

              pathfind(
                t.x,
                t.y
              );

              let angle;
              if (target.shift) {
                angle = Math.atan2(target.mouseY, target.mouseX);
              } else {
                angle = getDir(
                  position[0],
                  position[1],
                  target.x + target.mouseX,
                  target.y + target.mouseY
                );
              }

              controller.x = (innerWidth / 2) + Math.cos(angle) * 200;
              controller.y = (innerHeight / 2) + Math.sin(angle) * 200;
            }

            /*if (Math.random() < 0.01) {
              let dist = 20;
              let randomAngle = 2 * Math.PI * Math.random();
              trigger.mousemove(
                controller.x = 250 + dist * Math.cos(randomAngle),
                controller.y = 250 + dist * Math.sin(randomAngle)
              );
            }*/

            controller[target.mouseDown && !target.feed ? "mouseDown" : "mouseUp"]()
            controller[target.rMouseDown && !target.feed ? "mouseDown" : "mouseUp"](2)
          }
          if (died) {
            inGame = false
            //log('Death detected. Clearing render cache...')
            stopMoving();
            block = true
            ignore = true
            let index = 0
            let interval = setInterval(function () {
              if (destroyed) {
                clearInterval(interval)
                return
              }
              for (let i = 0; i < 30; i++) {
                let r = 100 + 900 * Math.random(), q = 100 + 900 * Math.random(), p = 0.5 + Math.random()
                innerWidth = global.window.innerWidth = r
                innerHeight = global.window.innerHeight = q
                devicePixelRatio = global.window.devicePixelRatio = p
                global.performance.time += 9000
                a()
              }
              index++
              if (index >= 2) {
                clearInterval(interval)
                end()
              }
            }, 30), end = function () {
              innerWidth = global.window.innerWidth = 500
              innerHeight = global.window.innerHeight = 500
              devicePixelRatio = global.window.devicePixelRatio = 1
              if (config.autoRespawn) {
                //log('Render cache cleared, respawning...')
                const interv = setInterval(() => {
                  died2 = true
                  controller.press('Enter')
                  controller.press('Escape')
                  if (!died2) {
                    clearInterval(interv);
                  }
                }, 4000);
              } else {
                //log('Render cache cleared.')
              }
              block = false
              ignore = false
              global.performance.time += 9000
              a()
              if (statusRecieved) { i++ }
            }
            died = false
            return
          }
          global.performance.time += 9000
          a()
          if (statusRecieved) {
            i++
          }
        }
      }, 100)
      global.localStorage = global.window.localStorage = {
        setItem: function (i, v) {
          this[i] = v
        },
        getItem: function (i) {
          return this[i]
        }
      }

      global.fetch = global.window.fetch = new Proxy(realFetch, {
        apply: function (a, b, args) {
          let url = args[0];

          if (url.startsWith('./')) {
            url = args[0] = 'https://arras.io' + url.slice(1)
          } else if (url.startsWith('/')) {
            url = args[0] = 'https://arras.io' + url
          }

          let options = args[1] || {};
          if (proxyAgent) {
            options.agent = proxyAgent;
          }
          args[1] = options;

          if (url.includes('app.wasm')) { return wasm() }

          if (url.endsWith('/clientCount')) {
            // receiving clientCount instantly to improve network
            return new Promise(resolve => resolve({
              json: async () => {
                return {"ok": true, "clients": 7777}
              }
            }));
          }

          const fetchPromise = Reflect.apply(a, b, args);

          if (url.endsWith('/status')) {
            fetchPromise.then(response => {
              return response.clone().json();
            }).then(i => {
              if (i.ok && i.status) {
                statusRecieved = true;
                status = Object.values(i.status);
                //log('Status recieved and processed.');
              } else {
                log('Status error.');
              }
            }).catch(err => {
              log(`Failed to process status JSON (${url}):`, err);
              return new Promise(resolve => resolve({
                json: async () => {
                  return {"ok": false}
                }
              }));
            });
          }

          return fetchPromise;
        }
      })

      global.navigator = global.window.navigator = {}
      let gameSocket = false, host = false

      global.WebSocket = global.window.WebSocket = new Proxy(WebSocket, {
        construct: function (a, b, c) {
          const fullUrl = b[0];
          host = new url.URL(fullUrl).host

          let h = {
            headers: {
              'user-agent': `Mozilla/5.0 (X11; CrOS x86_64 14588.123.0) AppleWebKit/${(100 + 900 * Math.random()).toFixed(2)} (KHTML, like Gecko) Chrome 101.0.0.0 Safari ${(100 + 900 * Math.random()).toFixed(2)}`,
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'en-US,en;q=0.9',
              'cache-control': 'no-cache',
              'connection': 'Upgrade',
              'origin': 'https://arras.io',
              'pragma': 'no-cache',
              'upgrade': 'websocket',
              'Sec-WebSocket-Protocol': b[1] ? b[1].join(', ') : '',
              'host': host
            },
            followRedirects: true,
            origin: 'https://arras.io',
          }

          if (proxyAgent) { h.agent = proxyAgent; }

          const newArgs = [fullUrl, b[1], h];
          const d = Reflect.construct(a, newArgs, c)

          d.addEventListener('open', function () {
            log('WebSocket open.')
            connected = true
          })

          d.addEventListener('close', function (e) {
            if (gameSocket === d) { gameSocket = false; }
            //log('WebSocket closed. wasClean =', e.wasClean, 'code =', e.code, 'reason =', e.reason)
          })

          let closed = false
          d.addEventListener('message', function (e) { let u = Array.from(new Uint8Array(e.data)) })
          d.send = new Proxy(d.send, { apply: function (f, g, h) { return Reflect.apply(f, g, h) } })
          d.close = new Proxy(d.close, {
            apply: function (f, g, h) {
              if (closed) { return }
              log('WebSocket closed by client.')
              closed = true
              Reflect.apply(f, g, h)
            }
          })
          d.addEventListener = new Proxy(d.addEventListener, { apply: function (a, b, c) { return Reflect.apply(a, b, c) } })
          gameSocket = d
          return d
        }
      })
      eval(x)
      let ca = oa || {}
      ca.window = global.window
      ca.destroy = destroy
      ca.controller = controller
      ca.trigger = trigger
      return Object.assign(ca, internalBotInterface);
    }

    let arras = {
      then: (cb) => {
        then(() => cb(arras));
      },
      create: function (o) {
        if (!ready) {
          log("Warning: 'create' called before arras was ready. It will be queued.");
        }
        o.id = o.id !== undefined ? o.id : id++;
        return run(script, o)
      }
    }
    if (options.start) {
      options.start(arras)
    }
    return arras
  })()


  process.on('message', (message) => {
    if (message.type === 'start') {
      const config = message.config;
      options.token = config.token;
      options.loadFromCache = config.loadFromCache;
      options.cache = config.cache;
      options.arrasCache = config.arrasCache;

      arras.then(function () {
        currentBotInterface = arras.create(config);
      });
    } else if (message.type === 'pause') {
      isPaused = message.paused;
      if (currentBotInterface.log) {
        currentBotInterface.log(`Bot state is now: ${isPaused ? 'PAUSED' : 'RESUMED'}`);
      }
    } else if (message.type === 'key_command') {
      const key = message.key;
      if (currentBotInterface.log) currentBotInterface.log(`CMD Key: ${key}`);

      // Find trigger functions in scope? No, they are inside run()...
      // We need 'run' scope to access 'trigger'.
      // Actually, trigger is not exposed globally. 
      // Wait, the message listener is currently OUTSIDE 'run'.
      // We need a way to pass this down.
      // currentBotInterface is the object returned by arras.create(config).
      // Does it expose trigger? No.

      // FIX: Reroute this message to the internal listeners if possible.
      // Or store a global reference to the trigger?
      // Since we are in the worker context, let's look at where 'run' is called.
      // 'arras.create(config)' calls 'run(app, config, ...)'
      // 'run' defines 'trigger' and 'listeners'.

      // We can expose an event handler on currentBotInterface.
      if (currentBotInterface.simulateKey) {
        currentBotInterface.simulateKey(key);
      }
    } else if (message.type == 'position') {
      target.x = message.x;
      target.y = message.y;

      target.mouseX = message.mouseX;
      target.mouseY = message.mouseY;

      target.mouseDown = message.mouseDown;
      target.rMouseDown = message.rMouseDown;

      target.followMouse = message.mouse;
      target.feed = message.feeding;

      target.shift = message.shift;
    } else if (message.type == 'tankselect') {
      target.tank = message.tank;
    } else if (message.type == 'destroy') {
      console.log("why devastatee");
      devastate();
      process.exit();
    }
  });

  // setInterval(() => {
  //   const data = fs.readFileSync("active", "utf-8");

  //   if (data == "closed") {
  //     devastate();
  //     process.exit();
  //   }
  // }, 2000);
})();