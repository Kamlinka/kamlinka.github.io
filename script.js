(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  var boot = document.getElementById("boot");
  if (boot) {
    var bootLog = document.getElementById("bootLog");
    var bootBar = document.getElementById("bootBar");
    var bootPct = document.getElementById("bootPct");
    var bootLabel = document.getElementById("bootLabel");
    var bootSkip = document.getElementById("bootSkip");
    var bootTimers = [];
    var bootLeaving = false;
    var bootCursor = null;
    var siteRegions = document.querySelectorAll(".topbar, main, .footer");

    var setSiteInert = function (value) {
      Array.prototype.forEach.call(siteRegions, function (region) {
        if (value) {
          region.setAttribute("inert", "");
        } else {
          region.removeAttribute("inert");
        }
      });
    };

    var bootLater = function (fn, ms) {
      bootTimers.push(setTimeout(fn, ms));
    };

    var setBootProgress = function (value) {
      bootBar.style.width = value + "%";
      bootPct.textContent = value + "%";
    };

    var addBootLine = function (text, className) {
      if (bootCursor && bootCursor.parentNode) {
        bootCursor.parentNode.removeChild(bootCursor);
      }
      var line = document.createElement("div");
      if (className) line.className = className;
      line.textContent = text;
      bootCursor = document.createElement("span");
      bootCursor.className = "boot-cursor";
      line.appendChild(bootCursor);
      bootLog.appendChild(line);
      bootLog.scrollTop = bootLog.scrollHeight;
    };

    var revealSite = function () {
      if (bootLeaving) return;
      bootLeaving = true;
      bootTimers.forEach(clearTimeout);
      bootTimers = [];
      document.removeEventListener("keydown", bootKey);
      boot.classList.add("is-leaving");
      document.body.classList.remove("is-booting");
      setSiteInert(false);
      setTimeout(function () {
        if (boot.parentNode) boot.parentNode.removeChild(boot);
      }, 620);
    };

    var completeBoot = function () {
      if (bootLeaving) return;
      if (bootCursor && bootCursor.parentNode) {
        bootCursor.parentNode.removeChild(bootCursor);
      }
      boot.classList.add("is-complete");
      bootLabel.textContent = "access granted";
      setBootProgress(100);
      bootLater(revealSite, 950);
    };

    var bootKey = function (event) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealSite();
      }
    };

    var bootLines = [
      ["[ boot ] kamlinka.exe · rev 2.6", "", 6, 240],
      ["[ ok ] mount /dev/void", "boot-ok", 13, 130],
      ["[ ok ] load modules: net, crypt, stealth", "boot-ok", 21, 150],
      ["[ .. ] portscan 127.0.0.1", "", 30, 180],
      ["[ !! ] user detected: kamlinka", "boot-warn", 39, 210],
      ["[ ok ] bypass firewall", "boot-ok", 52, 180],
      ["[ ok ] escalate privileges", "boot-ok", 63, 160],
      ["[ ok ] decrypt /home/kamlinka", "boot-ok", 76, 210],
      ["[ net ] 0x7f3a 0xdead 0x2f1c 0x90ff", "boot-dim", 84, 140],
      ["[ .. ] wiping traces", "", 91, 170],
      ["[ ok ] connection stable", "boot-ok", 97, 130],
      ["[ :: ] access granted", "boot-ok", 100, 150]
    ];

    setSiteInert(true);

    if (reduceMotion) {
      bootLines.forEach(function (item) {
        addBootLine(item[0], item[1]);
      });
      if (bootCursor && bootCursor.parentNode) {
        bootCursor.parentNode.removeChild(bootCursor);
      }
      boot.classList.add("is-complete");
      bootLabel.textContent = "access granted";
      setBootProgress(100);
      bootLater(revealSite, 850);
    } else {
      var bootIndex = 0;
      var nextBootLine = function () {
        if (bootLeaving) return;
        if (bootIndex >= bootLines.length) {
          bootLater(completeBoot, 120);
          return;
        }
        var item = bootLines[bootIndex];
        bootIndex += 1;
        addBootLine(item[0], item[1]);
        setBootProgress(item[2]);
        bootLater(nextBootLine, item[3]);
      };
      bootLater(nextBootLine, 250);
    }

    if (bootSkip) {
      bootSkip.addEventListener("click", revealSite);
      bootSkip.focus({ preventScroll: true });
    }
    document.addEventListener("keydown", bootKey);
    bootLater(function () {
      if (!bootLeaving) revealSite();
    }, 9000);
  }

  var clock = document.getElementById("clock");
  if (clock) {
    var timeFormat = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    var tick = function () {
      clock.textContent = timeFormat.format(new Date());
    };
    tick();
    setInterval(tick, 1000);
  }

  var typed = document.getElementById("typed");
  var phrases = [
    "пишу код, ломаю прод, собираю заново.",
    "backend, automation и немного терминальной магии.",
    "строю штуки, которые не должны падать в три утра."
  ];

  if (typed) {
    if (reduceMotion) {
      typed.textContent = phrases[0];
    } else {
      var phraseIndex = 0;
      var charIndex = 0;
      var deleting = false;

      var type = function () {
        var phrase = phrases[phraseIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = phrase.slice(0, charIndex);

        var delay = deleting ? 26 : 55;
        if (!deleting && charIndex === phrase.length) {
          delay = 2300;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 380;
        }

        setTimeout(type, delay + Math.random() * 45);
      };

      setTimeout(type, 550);
    }
  }

  var logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", function () {
      logo.classList.remove("is-glitching");
      void logo.offsetWidth;
      logo.classList.add("is-glitching");
    });
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var glowFrame = 0;
    window.addEventListener("pointermove", function (event) {
      if (glowFrame) return;
      glowFrame = requestAnimationFrame(function () {
        glowFrame = 0;
        root.style.setProperty("--mx", event.clientX + "px");
        root.style.setProperty("--my", event.clientY + "px");
      });
    }, { passive: true });
  }

  var toast = document.getElementById("toast");
  var toastTimer = 0;

  var showToast = function (message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  };

  var copyText = function (text) {
    var done = function () {
      showToast("скопировано → " + text);
    };
    var fallback = function () {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (error) {
        showToast("не вышло. выдели руками");
      }
      document.body.removeChild(area);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  };

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".copy");
    if (button) {
      copyText(button.getAttribute("data-copy") || "");
    }
  });

  var input = document.getElementById("cmd");
  var output = document.getElementById("out");
  var runButton = document.querySelector(".shell-run");
  var history = [];
  var historyIndex = 0;

  var commandList = [
    ["help", "этот список"],
    ["whoami", "коротко обо мне"],
    ["games", "во что играю"],
    ["contact", "как связаться"],
    ["neofetch", "гордость и предубеждение"],
    ["date", "время сервера"],
    ["clear", "очистить экран"],
    ["sudo", "не пытайся"]
  ];

  var commands = {
    help: function () {
      return "доступные команды:\n" + commandList.map(function (item) {
        return "  " + item[0].padEnd(10, " ") + "— " + item[1];
      }).join("\n");
    },
    whoami: function () {
      return "Kamlinka — разработчик. Бэкенд, автоматизация, немного терминальной магии.";
    },
    games: function () {
      return "PUBG: BATTLEGROUNDS · Phasmophobia · PAYDAY 2\nвиджеты — в разделе 02.";
    },
    contact: function () {
      return "email     kamlinka@proton.me\ntelegram  @kamlinka\ngithub    github.com/kamlinka";
    },
    neofetch: function () {
      return [
        "        ▄▄▄▄▄        kamlinka@void",
        "      ▄███████▄      ----------------",
        "      ██  █  ██      OS: Linux (почти всегда)",
        "      ██  █  ██      Shell: bash + zsh",
        "      ▀███████▀      Editor: vim (не спрашивай)",
        "        ▀▀▀▀▀        Uptime: с 2019 года",
        "                     Coffee: 92%"
      ].join("\n");
    },
    date: function () {
      return new Date().toLocaleString("ru-RU");
    },
    sudo: function () {
      return "сначала кофе. потом sudo.";
    },
    matrix: function () {
      return "ты не в той реальности, Нео.";
    },
    exit: function () {
      return "уйти нельзя. только закрыть вкладку.";
    }
  };

  var append = function (text, className) {
    var line = document.createElement("div");
    if (className) line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  var runCommand = function (raw) {
    var command = raw.trim();
    if (!command) return;

    append("kamlinka@void:~$ " + command, "out-cmd");
    history.push(command);
    historyIndex = history.length;

    var name = command.split(/\s+/)[0].toLowerCase();

    if (name === "clear") {
      output.textContent = "";
      return;
    }

    if (/^rm\s+-rf\s+\/$/.test(command)) {
      append("нет. я тут живу.", "err");
      return;
    }

    if (Object.prototype.hasOwnProperty.call(commands, name)) {
      append(commands[name](), "out-res");
      return;
    }

    append("команда не найдена: " + name + ". попробуй help.", "err");
  };

  if (input && output) {
    append("// тут можно печатать. начни с help", "out-res");

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        runCommand(input.value);
        input.value = "";
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (historyIndex > 0) {
          historyIndex -= 1;
          input.value = history[historyIndex];
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex += 1;
          input.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.value = "";
        }
      }
    });

    if (runButton) {
      runButton.addEventListener("click", function () {
        runCommand(input.value);
        input.value = "";
        input.focus();
      });
    }
  }

  var gameList = document.querySelector(".game-list");
  var gameFrames = document.querySelectorAll(".game-frame");
  var lastGameWidth = -1;

  var fitGameFrames = function () {
    if (!gameList || !gameFrames.length) return;
    var width = gameList.clientWidth;
    if (width === lastGameWidth) return;
    lastGameWidth = width;
    var scale = Math.min(1, width / 646);
    Array.prototype.forEach.call(gameFrames, function (frame) {
      var iframe = frame.querySelector("iframe");
      if (!iframe) return;
      iframe.style.transform = scale < 1 ? "scale(" + scale + ")" : "";
      frame.style.height = (190 * scale) + "px";
    });
  };

  fitGameFrames();
  window.addEventListener("resize", fitGameFrames);
  window.addEventListener("load", fitGameFrames);
  if (gameList && window.ResizeObserver) {
    new ResizeObserver(fitGameFrames).observe(gameList);
  }

  console.log(
    "%c kamlinka ",
    "background:#b6ff3c;color:#060809;font-family:monospace;font-weight:700;padding:2px 6px;",
    "привет, любопытный. сайт написан руками, так что баги — авторские."
  );
})();
