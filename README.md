# Web Tabanlı Nöbet Uygulaması (Frontend)

Bu proje, kurum içi nöbet ve vardiya yönetimini dijitalleştiren kapsamlı bir web uygulamasının kullanıcı arayüzüdür (Frontend). 

## 📖 Uygulama Hakkında

Temel amacı nöbet oluşturma ve takip süreçlerini kolaylaştırmaktır. Sistem üzerinden **yöneticiler nöbet çizelgeleri oluşturabilirken**, **çalışanlar kendilerine atanan nöbetleri kolayca görüntüleyebilir.** 

Bunun yanı sıra uygulama, sadece bir takvim olmanın ötesine geçerek aşağıdaki temel yönetim modüllerini de barındırır:

*   **Nöbet Yönetimi:** Nöbet atamaları, değişiklik talepleri ve takvim üzerinden takip.
*   **İzin Yönetimi:** Çalışanların izin taleplerinin toplanması ve yöneticiler tarafından onaylanması/reddedilmesi.
*   **Departman Yönetimi:** Kurum içindeki farklı birimlerin ve departmanların sisteme tanımlanması ve yönetilmesi.
*   **Kullanıcı Yönetimi:** Sisteme yeni çalışan/yönetici ekleme, yetkilendirme ve profil yönetimi işlemleri.

## 🚀 Kullanılan Teknolojiler ve Mimari

Proje, modern ve performanslı bir web deneyimi sunmak amacıyla **Next.js (App Router)** mimarisi kullanılarak geliştirilmiştir. 

*   **Framework:** Next.js (App Router)
*   **Dil:** JavaScript / JSX
*   **Stil:** Tailwind CSS

Klasör yapısı, modülerliği sağlamak için `(pages)` route grubu altında login, admin, manager ve users gibi temel modüllere ayrılmış durumdadır. UI bileşenleri ise `components` dizini altında merkezi olarak yönetilmektedir.

## 🛠️ Kurulum ve Geliştirme

Yerel ortamda projeyi ayağa kaldırmak için aşağıdaki adımları izleyebilirsiniz:

1.  Depoyu bilgisayarınıza klonlayın.
2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  Gerekli `.env` ayarlarınızı yapın.
4.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
5.  Uygulamayı `http://localhost:3000` adresinde görüntüleyin.