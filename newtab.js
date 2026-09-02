/* Yeni sekme sayfasi */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var banner = document.getElementById("kd-banner");

  function draw(res) {
    KD.mount(app, res.model);
    KD.initTheme(document.getElementById("kd-theme-btn"));

    var showBanner = false;
    if (res.updateAvailable) {
      try {
        chrome.storage.sync.get("kd_dismissedUpdate", function (o) {
          if (!o || o.kd_dismissedUpdate !== res.defaultsVersion) {
            banner.classList.add("on");
          }
        });
      } catch (e) { banner.classList.add("on"); }
      showBanner = true;
    }
    if (!showBanner) banner.classList.remove("on");
  }

  KD.loadModel().then(draw);

  document.getElementById("kd-banner-open").addEventListener("click", function () {
    try { chrome.runtime.openOptionsPage(); } catch (e) {}
  });
  document.getElementById("kd-banner-hide").addEventListener("click", function () {
    banner.classList.remove("on");
    KD.loadModel().then(function (res) {
      try { chrome.storage.sync.set({ kd_dismissedUpdate: res.defaultsVersion }); } catch (e) {}
    });
  });

  // baska bir sekmede / cihazda liste degisince tazele
  try {
    chrome.storage.onChanged.addListener(function (ch, area) {
      if (area === "sync" && ch.kd_user) KD.loadModel().then(draw);
    });
  } catch (e) {}
})();
