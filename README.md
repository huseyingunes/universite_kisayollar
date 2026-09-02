# Üniversite Kısayolları — Chrome Uzantısı

Bölüm ve üniversite kaynaklarını tek sayfada toplayan, hızlı açılan bir başlangıç
sayfası. Yeni sekmede açılır, araç çubuğu düğmesiyle de erişilir, ve her kullanıcı
kendi listesini yönetim panelinden düzenleyebilir.

## İçindekiler

| Dosya | Görevi |
|---|---|
| `manifest.json` | Uzantı tanımı (Manifest V3). Sürüm numarası burada. |
| `defaults.js` | **Bölümün varsayılan bağlantı listesi.** Güncellemeyi buradan yaparsın. |
| `directory.css` | Ortak görünüm (yeni sekme + popup + dışa aktarılan düz HTML). |
| `render.js` | Ortak mantık: çizim, `chrome.storage.sync` okuma/yazma, düz HTML üretimi. |
| `newtab.html` / `newtab.js` | Yeni sekme sayfası. |
| `popup.html` / `popup.js` | Araç çubuğu penceresi. |
| `admin.html` / `admin.js` | Yönetim paneli (uzantı ayar sayfası). |
| `icons/` | 16/32/48/128 px simgeler. İstersen kendi tasarımınla değiştir. |

Hiçbir dış bağımlılık yok, ağ isteği yok, izin olarak yalnızca `storage` isteniyor.

---

## 1) Geliştirirken denemek (paketlemeden)

1. Chrome'da `chrome://extensions` aç.
2. Sağ üstten **Geliştirici modu**'nu aç.
3. **Paketlenmemiş öğe yükle** → bu klasörü (`kaynak-dizini-eklentisi`) seç.
4. Yeni sekme aç → dizin gelir. Araç çubuğundaki simgeye tıkla → popup.
5. Simgeye sağ tık → **Seçenekler** ya da popup'taki **Yönetim paneli** → düzenleme ekranı.

Kod değiştirince `chrome://extensions` sayfasında uzantının **↻ yenile** düğmesine bas.

---

## 2) Kendi bağlantılarını koymak

`defaults.js` içindeki `groups` dizisini düzenle. Her grup:

```js
{
  name: "Öğrenci Sistemleri",
  color: "#1a3fd0",          // grup rengi (hex)
  links: [
    { label: "Öğrenci Bilgi Sistemi", url: "https://...", tag: "giriş" }
  ]
}
```

`tag` serbesttir; panelde öneri olarak `giriş, pdf, form, site, liste, katalog, arşiv` gelir.

> **Not:** Dosyalar UTF-8'dir; Türkçe karakter (ğ, ü, ş, ı, ö, ç) doğrudan yazılabilir.

---

## 3) Güncellemeyi herkese yaymak

Kullanıcı davranışı iki katmanlıdır:

- **Listesini hiç düzenlememiş** kullanıcı → her zaman `defaults.js`'i görür.
  Sen yeni sürüm yayınlayınca Chrome uzantıyı otomatik günceller, liste de güncellenir.
- **Kendi listesini düzenlemiş** kullanıcı → kendi kopyasını görür (`chrome.storage.sync`).
  Ona yönetim panelinde *"Bölüm varsayılan listesi güncellendi"* uyarısı çıkar;
  **Varsayılan listeye dön** derse senin güncel listene geçer.

Yeni sürüm çıkarma adımları:

1. `defaults.js` içinde `version` sayısını **1 artır** (ör. `1` → `2`).
2. Aynı değişikliği `manifest.json` içindeki `"version"` alanına yansıt (ör. `"1.0.0"` → `"1.1.0"`).
3. Klasörü ZIP'le (aşağıya bak) ve Chrome Web Store'da **Yeni paket yükle**.
4. Yayınla. Kullanıcılara birkaç saat içinde otomatik iner.

---

## 4) Chrome Web Store'a yükleme

**Gerekenler:** bir Google hesabı + tek seferlik **5 USD** geliştirici kayıt ücreti
(https://chrome.google.com/webstore/devconsole).

### ZIP hazırlama

Klasörün **içeriğini** zip'le (klasörün kendisini değil). PowerShell:

```powershell
Compress-Archive -Path C:\calisma\ceng\kaynak-dizini-eklentisi\* -DestinationPath C:\calisma\ceng\universite-kisayollari.zip -Force
```

ZIP kök dizininde `manifest.json` görünmeli.

### Konsol adımları

1. **Developer Dashboard → New Item → ZIP yükle.**
2. **Store listing:**
   - İsim: `Üniversite Kısayolları`
   - Kısa açıklama (öneri): *Bölüm ve üniversite kaynaklarına tek tıkla erişim. Yeni sekmede açılır, kendi bağlantılarını ekleyebilirsin.*
   - Kategori: `Productivity`
   - Dil: `Türkçe`
   - Simge: `icons/icon128.png` (mağaza ayrıca 128 px ister — hazır).
   - En az **1 ekran görüntüsü** (1280×800 ya da 640×400). Yeni sekme sayfasının görüntüsü yeterli.
3. **Privacy:**
   - *Single purpose*: *"Kullanıcının sık kullandığı akademik/kurumsal bağlantıları yeni sekmede tek sayfada gösterir."*
   - `storage` izni gerekçesi: *"Kullanıcının kendi bağlantı düzenlemelerini cihazları arasında senkron saklamak için."*
   - **Yeni sekmeyi değiştirme (New Tab override)** kullandığın için Chrome bunu açıkça sorar; "kullanıcının başlangıç bağlantı sayfası" gerekçesini yaz.
   - Uzaktan kod yok, veri satışı yok, analytics yok → tüm kutulara "hayır".
4. **Distribution:** Public (herkese açık) ya da Unlisted (sadece linkle). Bölüm içi dağıtım için **Unlisted** pratik olur.
5. **Submit for review.** İlk inceleme genelde birkaç gün sürer.

### İnceleme ipuçları

- New Tab override + net olmayan açıklama = ret sebebi. Açıklamada bağlantı
  yöneticisi olduğunu net yaz.
- Ekran görüntüsü gerçek uzantıyı göstersin.
- `defaults.js` içindeki `ornek.edu.tr` adreslerini gerçek adreslerle değiştirmeyi unutma.

---

## 5) "Düz HTML" çıktısı

Yönetim panelinde **Düz HTML indir** / **HTML'i kopyala**:
tek dosya, ~12 KB, dış istek yok, JavaScript'i yalnızca tema düğmesi için ~1 KB.
Herhangi bir tarayıcıda, sunucusuz, çevrimdışı açılır. Tarayıcıda "ana sayfa" ya da
yer imi olarak kullanılabilir. Bu dosya uzantıdan bağımsızdır; senkron değildir.

## 6) Depolama sınırı

`chrome.storage.sync` tek kayıt sınırı ~8 KB'dir. 6 grup × ~6 bağlantı bunun çok
altında. Çok uzun listelerde panel "kaydedilemedi" uyarısı verirse bağlantı
sayısını azalt ya da JSON yedeğini kullan.
