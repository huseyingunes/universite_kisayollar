/* ============================================================
   VARSAYILAN BAGLANTILAR  —  bolum tarafindan yonetilir
   ------------------------------------------------------------
   Bu dosyayi duzenleyip eklentinin surumunu yukselttiginde
   (manifest.json > "version") ve magazaya yeni surumu
   yukledinde, HENUZ kendi listesini duzenlememis butun
   kullanicilarda liste otomatik guncellenir.

   Kendi listesini duzenlemis kullanicilarda ise degismez;
   onlara yonetim panelinde "yeni surum var" uyarisi cikar.

   version: her anlamli degisiklikte 1 artir.
   ============================================================ */
window.KD_DEFAULTS = {
  version: 1,
  title: "Balıkesir Üniversitesi",
  kicker: "Bilgisayar Mühendisliği Bölümü",
  dek: "",
  footNote: "",
  groups: [
    {
      name: "Üniversite Bağlantılar",
      color: "#1f4f5c",
      links: [
        { label: "OBS - Akademik",       url: "https://obs.balikesir.edu.tr/oibs/acd/login.aspx", tag: "site" },
        { label: "EBYS",                 url: "https://ebys.balikesir.edu.tr/",                   tag: "site" },
        { label: "Personel E-Posta",     url: "https://mail.balikesir.edu.tr/",                   tag: "site" },
        { label: "Üniversite Ana Sayfa", url: "https://www.balikesir.edu.tr/",                    tag: "site" },
        { label: "Mühendislik Ana Sayfa", url: "https://mf.balikesir.edu.tr/",                    tag: "site" },
        { label: "CENG Ana Sayfa",       url: "https://ceng.balikesir.edu.tr/",                   tag: "site" }
      ]
    },
    {
      name: "CENG Bağlantılar",
      color: "#0a7f37",
      links: [
        { label: "CENG Ana Sayfa",   url: "https://ceng.balikesir.edu.tr/",           tag: "site" },
        { label: "Duyurular",        url: "https://ceng.balikesir.edu.tr/duyurular",  tag: "site" },
        { label: "Haberler",         url: "https://ceng.balikesir.edu.tr/haberler",   tag: "site" },
        { label: "Kalite",           url: "https://ceng.balikesir.edu.tr/kalite",     tag: "site" },
        { label: "Ders Programı",    url: "https://ornek.edu.tr/akts",                tag: "site" },
        { label: "Sınav Programı",   url: "https://ornek.edu.tr/not-girisi",          tag: "site" },
        { label: "Staj",             url: "https://ceng.balikesir.edu.tr/staj",       tag: "" }
      ]
    },
    {
      name: "Bologna",
      color: "#c25510",
      links: [
        { label: "Bologna Bilgi Paketi",  url: "https://ornek.edu.tr/bologna",          tag: "site" },
        { label: "Program Ciktilari",     url: "https://ornek.edu.tr/bologna/ciktilar", tag: "site" },
        { label: "Bologna Formlari",      url: "https://ornek.edu.tr/bologna/formlar",  tag: "form" },
        { label: "Ders Ogretim Planlari", url: "https://ornek.edu.tr/bologna/planlar",  tag: "site" },
        { label: "AKTS Katalogu",         url: "https://ornek.edu.tr/bologna/akts",     tag: "katalog" }
      ]
    },
    {
      name: "Bolum",
      color: "#d61f56",
      links: [
        { label: "Bolum Ana Sayfasi",         url: "https://ornek.edu.tr/bilgisayar",               tag: "site" },
        { label: "Staj Sayfasi",              url: "https://ornek.edu.tr/bilgisayar/staj",          tag: "site" },
        { label: "Staj Yonergesi & Formlari", url: "https://ornek.edu.tr/bilgisayar/staj/formlar",  tag: "form" },
        { label: "Bitirme Projesi",           url: "https://ornek.edu.tr/bilgisayar/bitirme",       tag: "site" },
        { label: "Ogretim Elemanlari",        url: "https://ornek.edu.tr/bilgisayar/kadro",         tag: "liste" },
        { label: "Ders Gorevlendirmeleri",    url: "https://ornek.edu.tr/bilgisayar/gorevlendirme", tag: "pdf" }
      ]
    },
    {
      name: "Kutuphane & Arastirma",
      color: "#0b7a86",
      links: [
        { label: "Kutuphane Katalogu",     url: "https://ornek.edu.tr/kutuphane/katalog",    tag: "katalog" },
        { label: "Abone Veri Tabanlari",   url: "https://ornek.edu.tr/kutuphane/veritabani", tag: "liste" },
        { label: "Turnitin / iThenticate", url: "https://www.turnitin.com/",                 tag: "giris" },
        { label: "YOK Ulusal Tez Merkezi", url: "https://tez.yok.gov.tr/",                   tag: "arsiv" },
        { label: "TR Dizin",               url: "https://trdizin.gov.tr/",                   tag: "arsiv" },
        { label: "Google Akademik",        url: "https://scholar.google.com/",               tag: "arsiv" }
      ]
    },
    {
      name: "Personel",
      color: "#6d28e0",
      links: [
        { label: "Personel Bilgi Sistemi", url: "https://ornek.edu.tr/pbs",  tag: "giris" },
        { label: "Izin / Gorevlendirme",   url: "https://ornek.edu.tr/izin", tag: "giris" },
        { label: "BAP Koordinasyon",       url: "https://ornek.edu.tr/bap",  tag: "site" },
        { label: "Maas / Bordro (KBS)",    url: "https://kbs.hmb.gov.tr/",   tag: "giris" },
        { label: "EBYS (Personel)",        url: "https://ebys.balikesir.edu.tr/", tag: "giris" },
        { label: "Kurul Kararlari",        url: "https://ornek.edu.tr/kurul", tag: "arsiv" }
      ]
    }
  ]
};
