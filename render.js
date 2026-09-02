/* Kaynak Dizini — ortak mantik (yeni sekme + popup + admin paylasir)
   Global: window.KD                                                    */
(function () {
  "use strict";

  var THEME_NAMES = { auto: "Tema: Otomatik", light: "Tema: Acik", dark: "Tema: Koyu" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(u)) return "https://" + u; // "alan.edu.tr/yol"
    return "#";
  }

  function isHex(c) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c || ""); }

  function numInk(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some(isNaN)) return "#ffffff";
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#15150f" : "#ffffff";
  }

  /* ---- model markup ---- */
  function markup(model) {
    model = model || {};
    var title = esc(model.title || "Üniversite Kısayolları");
    var kicker = esc(model.kicker || "");
    var dek = esc(model.dek || "Tek sayfada tum kaynaklar. Acildiginda hepsi gorunur; hicbir yone kaydirmak gerekmez.");
    var groups = Array.isArray(model.groups) ? model.groups : [];
    var total = 0;

    var sections = groups.map(function (grp, i) {
      var color = isHex(grp.color) ? grp.color : "#1a3fd0";
      var links = (Array.isArray(grp.links) ? grp.links : []).map(function (l) {
        total++;
        var u = safeUrl(l.url);
        return '<li><a href="' + esc(u) + '"><span class="t">' + esc(l.label || u) +
          '</span><span class="lead"></span><span class="g">' + esc(l.tag || "") + "</span></a></li>";
      }).join("");
      var num = String(i + 1).length < 2 ? "0" + (i + 1) : String(i + 1);
      return '<section class="kd-entry" style="--key:' + color + ";--num-ink:" + numInk(color) + '">' +
        '<div class="kd-head"><span class="kd-num">' + num + '</span><h2 class="kd-label">' + esc(grp.name || "") + "</h2></div>" +
        '<ul class="kd-list">' + links + "</ul></section>";
    }).join("\n");

    return '<div class="kd-sheet">' +
      '<header class="kd-mast"><div class="kd-topline">' +
      '<div><p class="kd-kicker">' + kicker + "</p><h1>" + title + "</h1></div>" +
      '<button class="kd-theme" id="kd-theme-btn" type="button">Tema</button></div>' +
      '<p class="kd-dek">' + dek + "</p>" +
      '<div class="kd-byline"><span>' + esc(model.footNote || "Baglantilari yonetim panelinden duzenleyebilirsin") +
      "</span><span>" + total + " baglanti</span></div></header>" +
      '<div class="kd-index">' + sections + "</div>" +
      '<p class="kd-foot">Sol kenardaki renk ve numara her bolumun kendi rengidir; sagdaki kucuk etiket baglantinin turunu soyler.</p>' +
      "</div>";
  }

  function mount(el, model) { if (el) el.innerHTML = markup(model); }

  /* ---- depolama (chrome.storage.sync) ---- */
  function loadModel() {
    var defaults = window.KD_DEFAULTS;
    return new Promise(function (resolve) {
      var done = function (user) {
        if (!user || !Array.isArray(user.groups)) {
          resolve({ model: defaults, custom: false, updateAvailable: false, defaultsVersion: defaults.version });
        } else {
          resolve({
            model: user, custom: true,
            updateAvailable: (defaults.version || 0) > (user.basedOn || 0),
            defaultsVersion: defaults.version
          });
        }
      };
      try {
        chrome.storage.sync.get("kd_user", function (o) { done(o && o.kd_user); });
      } catch (e) { done(null); }
    });
  }

  function saveModel(m) {
    var out = JSON.parse(JSON.stringify(m));
    out.basedOn = (window.KD_DEFAULTS.version || 0);
    return new Promise(function (resolve, reject) {
      try {
        chrome.storage.sync.set({ kd_user: out }, function () {
          if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
          else resolve(out);
        });
      } catch (e) { reject(e); }
    });
  }

  function resetModel() {
    return new Promise(function (resolve) {
      try { chrome.storage.sync.remove("kd_user", function () { resolve(); }); }
      catch (e) { resolve(); }
    });
  }

  /* ---- tema ---- */
  function applyTheme(t, btn) {
    var r = document.documentElement;
    if (t === "light" || t === "dark") r.setAttribute("data-theme", t);
    else r.removeAttribute("data-theme");
    if (btn) btn.textContent = THEME_NAMES[t] || THEME_NAMES.auto;
  }

  function initTheme(btn) {
    var cur = "auto";
    try {
      chrome.storage.sync.get("kd_theme", function (o) {
        cur = (o && o.kd_theme) || "auto";
        applyTheme(cur, btn);
      });
    } catch (e) { applyTheme(cur, btn); }

    if (btn) btn.addEventListener("click", function () {
      var ord = ["auto", "light", "dark"];
      cur = ord[(ord.indexOf(cur) + 1) % 3];
      applyTheme(cur, btn);
      try { chrome.storage.sync.set({ kd_theme: cur }); } catch (e) {}
    });

    try {
      chrome.storage.onChanged.addListener(function (ch, area) {
        if (area === "sync" && ch.kd_theme) {
          cur = ch.kd_theme.newValue || "auto";
          applyTheme(cur, btn);
        }
      });
    } catch (e) {}
  }

  /* ---- disa aktarim: tek dosya duz HTML ---- */
  function buildStandalone(model, css, theme) {
    var attr = (theme === "light" || theme === "dark") ? ' data-theme="' + theme + '"' : "";
    var toggle =
      "(function(){var K='kdtheme',R=document.documentElement,B=document.getElementById('kd-theme-btn')," +
      "N={auto:'Tema: Otomatik',light:'Tema: Acik',dark:'Tema: Koyu'};" +
      "function a(t){if(t==='light'||t==='dark')R.setAttribute('data-theme',t);else R.removeAttribute('data-theme');if(B)B.textContent=N[t]||N.auto;}" +
      "var c=null;try{c=localStorage.getItem(K);}catch(e){}if(!c)c=R.getAttribute('data-theme')||'auto';a(c);" +
      "if(B)B.addEventListener('click',function(){var o=['auto','light','dark'];c=o[(o.indexOf(c)+1)%3];try{localStorage.setItem(K,c);}catch(e){}a(c);});})();";
    return "<!doctype html>\n<html lang=\"tr\"" + attr + ">\n<head>\n<meta charset=\"utf-8\">\n" +
      "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n" +
      "<title>" + esc(model.title || "Üniversite Kısayolları") + "</title>\n<style>\n" + css + "\n</style>\n</head>\n<body>\n" +
      markup(model) + "\n<script>" + toggle + "<\/script>\n</body>\n</html>\n";
  }

  window.KD = {
    esc: esc, safeUrl: safeUrl, isHex: isHex, numInk: numInk,
    markup: markup, mount: mount,
    loadModel: loadModel, saveModel: saveModel, resetModel: resetModel,
    applyTheme: applyTheme, initTheme: initTheme,
    buildStandalone: buildStandalone
  };
})();
