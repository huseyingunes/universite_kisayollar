/* Arac cubugu penceresi */
(function () {
  "use strict";
  var app = document.getElementById("app");

  KD.loadModel().then(function (res) {
    KD.mount(app, res.model);
    KD.initTheme(document.getElementById("kd-theme-btn"));
  });

  document.getElementById("kd-open-newtab").addEventListener("click", function () {
    try { chrome.tabs.create({ url: "chrome://newtab" }); } catch (e) {}
    window.close();
  });
  document.getElementById("kd-open-admin").addEventListener("click", function () {
    try { chrome.runtime.openOptionsPage(); } catch (e) {}
    window.close();
  });
})();
