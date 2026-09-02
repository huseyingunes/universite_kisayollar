/* Yonetim paneli */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };

  var state = null, cssText = "", themePref = "auto";
  var groupsEl = $("#groups"), msgEl = $("#msg"), previewEl = $("#preview");
  var pvT = null, pvUrl = null;

  function msg(t, kind) {
    msgEl.textContent = t || "";
    msgEl.className = "msg" + (kind ? " " + kind : "");
    if (t) { clearTimeout(msg._t); msg._t = setTimeout(function () { msgEl.textContent = ""; msgEl.className = "msg"; }, 5000); }
  }

  function syncPreview() {
    clearTimeout(pvT);
    pvT = setTimeout(function () {
      var html = KD.buildStandalone(state, cssText, themePref);
      var u = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
      previewEl.src = u;
      var old = pvUrl; pvUrl = u;
      if (old) setTimeout(function () { URL.revokeObjectURL(old); }, 1500);
    }, 180);
  }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function th(t) { return el("th", { text: t }); }
  function expand(h) { h = h.replace("#", ""); return "#" + h.split("").map(function (c) { return c + c; }).join(""); }
  function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return false; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; return true; }

  function normalize(m) {
    m = m || {};
    return {
      title: m.title || "Üniversite Kısayolları",
      kicker: m.kicker || "",
      dek: m.dek || "",
      footNote: m.footNote || "",
      groups: Array.isArray(m.groups) ? m.groups.map(function (g) {
        return {
          name: (g.name || "").toString(),
          color: KD.isHex(g.color) ? g.color : "#1a3fd0",
          links: Array.isArray(g.links) ? g.links.map(function (l) {
            return { label: (l.label || "").toString(), url: (l.url || "").toString(), tag: (l.tag || "").toString() };
          }) : []
        };
      }) : []
    };
  }

  /* ---- editor DOM ---- */
  function renderGroups() {
    groupsEl.textContent = "";
    state.groups.forEach(function (grp, gi) {
      var card = el("div", { class: "group" });

      var color = el("input", { type: "color" });
      color.value = KD.isHex(grp.color) ? (grp.color.length === 4 ? expand(grp.color) : grp.color) : "#1a3fd0";
      var hex = el("input", { type: "text", class: "hex", "aria-label": "Renk kodu" });
      hex.value = grp.color || "#1a3fd0";
      color.addEventListener("input", function () { grp.color = color.value; hex.value = color.value; syncPreview(); });
      hex.addEventListener("input", function () {
        grp.color = hex.value.trim();
        if (KD.isHex(grp.color)) color.value = grp.color.length === 4 ? expand(grp.color) : grp.color;
        syncPreview();
      });

      var name = el("input", { type: "text", class: "gname", placeholder: "Grup adi" });
      name.value = grp.name || "";
      name.addEventListener("input", function () { grp.name = name.value; syncPreview(); });

      var up = el("button", { class: "mini", type: "button", text: "▲", title: "Yukari" });
      var dn = el("button", { class: "mini", type: "button", text: "▼", title: "Asagi" });
      var del = el("button", { class: "mini danger", type: "button", text: "Sil" });
      up.addEventListener("click", function () { if (move(state.groups, gi, -1)) { renderGroups(); syncPreview(); } });
      dn.addEventListener("click", function () { if (move(state.groups, gi, 1)) { renderGroups(); syncPreview(); } });
      del.addEventListener("click", function () {
        if (confirm("\"" + (grp.name || "Grup") + "\" silinsin mi?")) { state.groups.splice(gi, 1); renderGroups(); syncPreview(); }
      });

      card.appendChild(el("div", { class: "group-top" }, [color, hex, name, up, dn, del]));

      var tbl = el("table", { class: "links" });
      tbl.appendChild(el("thead", {}, [el("tr", {}, [th("Ad"), th("Adres (URL)"), th("Etiket"), th("")])]));
      var tb = el("tbody");
      (grp.links || []).forEach(function (lnk, li) { tb.appendChild(linkRow(grp, li)); });
      tbl.appendChild(tb);
      card.appendChild(tbl);

      var addL = el("button", { class: "mini ghost", type: "button", text: "+ Baglanti ekle" });
      addL.addEventListener("click", function () {
        grp.links = grp.links || []; grp.links.push({ label: "", url: "", tag: "" });
        renderGroups(); syncPreview();
      });
      card.appendChild(el("div", { class: "rowbtns" }, [addL]));

      groupsEl.appendChild(card);
    });
  }

  function linkRow(grp, li) {
    var lnk = grp.links[li];
    var tr = el("tr");
    var lbl = el("input", { type: "text" }); lbl.value = lnk.label || "";
    lbl.addEventListener("input", function () { lnk.label = lbl.value; syncPreview(); });
    var url = el("input", { type: "text", placeholder: "https://..." }); url.value = lnk.url || "";
    url.addEventListener("input", function () { lnk.url = url.value; syncPreview(); });
    var tag = el("input", { type: "text", list: "tags", placeholder: "tur" }); tag.value = lnk.tag || "";
    tag.addEventListener("input", function () { lnk.tag = tag.value; syncPreview(); });

    var up = el("button", { class: "mini", type: "button", text: "▲" });
    var dn = el("button", { class: "mini", type: "button", text: "▼" });
    var del = el("button", { class: "mini danger", type: "button", text: "×" });
    up.addEventListener("click", function () { if (move(grp.links, li, -1)) { renderGroups(); syncPreview(); } });
    dn.addEventListener("click", function () { if (move(grp.links, li, 1)) { renderGroups(); syncPreview(); } });
    del.addEventListener("click", function () { grp.links.splice(li, 1); renderGroups(); syncPreview(); });

    tr.appendChild(el("td", { class: "lbl" }, [lbl]));
    tr.appendChild(el("td", { class: "url" }, [url]));
    tr.appendChild(el("td", { class: "tag" }, [tag]));
    tr.appendChild(el("td", { class: "act" }, [up, dn, del]));
    return tr;
  }

  function fillGeneral() {
    $("#f-title").value = state.title || "";
    $("#f-kicker").value = state.kicker || "";
    $("#f-dek").value = state.dek || "";
    $("#f-foot").value = state.footNote || "";
  }
  function bindGeneral() {
    [["#f-title", "title"], ["#f-kicker", "kicker"], ["#f-dek", "dek"], ["#f-foot", "footNote"]].forEach(function (p) {
      var n = $(p[0]);
      n.addEventListener("input", function () { state[p[1]] = n.value; syncPreview(); });
    });
  }

  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type || "text/html;charset=utf-8" }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function adoptDefaults() {
    if (!confirm("Kendi duzenlemelerin silinip bolumun guncel varsayilan listesine donulecek. Devam edilsin mi?")) return;
    KD.resetModel().then(function () {
      state = normalize(clone(window.KD_DEFAULTS));
      fillGeneral(); renderGroups(); syncPreview();
      $("#banner").classList.remove("on");
      msg("Varsayilan listeye donuldu.", "ok");
    });
  }

  function refreshBanner() {
    KD.loadModel().then(function (res) {
      if (res.updateAvailable) {
        $("#banner-text").innerHTML =
          "<b>Bolum varsayilan listesi guncellendi (surum " + res.defaultsVersion +
          ").</b> Kendi duzenin korunuyor. Guncel listeyi almak istersen:";
        $("#banner").classList.add("on");
      } else {
        $("#banner").classList.remove("on");
      }
    });
  }

  /* ---- actions ---- */
  $("#add-group").addEventListener("click", function () {
    state.groups.push({ name: "Yeni grup", color: "#0b7a86", links: [{ label: "", url: "", tag: "" }] });
    renderGroups(); syncPreview();
  });

  $("#save").addEventListener("click", function () {
    KD.saveModel(state).then(function () {
      msg("Kaydedildi — Chrome hesabinla senkron cihazlara aktarilacak.", "ok");
      refreshBanner();
    }).catch(function (e) {
      msg("Kaydedilemedi: " + (e && e.message ? e.message : e) +
        "  (Chrome sync tek kayit siniri ~8 KB; baglanti sayisini azalt ya da JSON yedegini kullan.)", "err");
    });
  });

  $("#reset").addEventListener("click", adoptDefaults);
  $("#banner-adopt").addEventListener("click", adoptDefaults);

  $("#download-html").addEventListener("click", function () {
    download("universite-kisayollari.html", KD.buildStandalone(normalize(state), cssText, themePref));
    msg("Indirildi: universite-kisayollari.html — bu dosyayi her yerde acabilirsin.", "ok");
  });

  $("#copy-html").addEventListener("click", function () {
    var html = KD.buildStandalone(normalize(state), cssText, themePref);
    var p = (navigator.clipboard && navigator.clipboard.writeText)
      ? navigator.clipboard.writeText(html) : Promise.reject();
    p.then(function () { msg("HTML panoya kopyalandi.", "ok"); }).catch(function () {
      var ta = document.createElement("textarea");
      ta.value = html; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); msg("HTML panoya kopyalandi.", "ok"); }
      catch (e) { msg("Kopyalanamadi.", "err"); }
      ta.remove();
    });
  });

  $("#export-json").addEventListener("click", function () {
    download("universite-kisayollari-ayarlar.json", JSON.stringify(normalize(state), null, 2), "application/json");
  });
  $("#import-json").addEventListener("click", function () { $("#file-json").click(); });
  $("#file-json").addEventListener("change", function () {
    var f = this.files && this.files[0]; this.value = "";
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        state = normalize(JSON.parse(rd.result));
        fillGeneral(); renderGroups(); syncPreview();
        msg("JSON yuklendi. Kalici olmasi icin 'Kaydet'e bas.", "ok");
      } catch (e) { msg("Gecersiz JSON dosyasi.", "err"); }
    };
    rd.readAsText(f);
  });

  /* ---- init ---- */
  Promise.all([
    KD.loadModel(),
    fetch(chrome.runtime.getURL("directory.css")).then(function (r) { return r.text(); }).catch(function () { return ""; }),
    new Promise(function (res) {
      try { chrome.storage.sync.get("kd_theme", function (o) { res((o && o.kd_theme) || "auto"); }); }
      catch (e) { res("auto"); }
    })
  ]).then(function (v) {
    state = normalize(clone(v[0].model));
    cssText = v[1];
    themePref = v[2];
    fillGeneral(); bindGeneral(); renderGroups(); syncPreview(); refreshBanner();
  });

  try {
    chrome.storage.onChanged.addListener(function (ch, area) {
      if (area === "sync" && ch.kd_theme) { themePref = ch.kd_theme.newValue || "auto"; syncPreview(); }
    });
  } catch (e) {}
})();
