import Image from 'next/image';

function Hakkımızda() {
  const teamMembers = [
    {
      name: "Onur Karagöl",
      role: "Founder & CEO ",
      image: "/onur1.png",
      description: "Pazarlama Müdürü / Project Manager",
    },
    {
      name: "Yasir Kaygusuz",
      role: "Co-Founder Xristal",
      image: "/yasir1.png",
      description: "Full Stack Developer / Project Manager",
    },
    {
      name: "Mustafa Uzunal",
      role: "Yazılım Geliştirici",
      image: "/sari1.png",
      description: "Frontend Developer",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 pt-[12vh] py-16 text-black">
      {/* Sayfa Başlığı */}
      <title>Hakkımızda - Nöbet Uygulaması</title>
      {/* Meta Açıklama */}
      <meta
        name="description"
        content="Nöbet Uygulaması, uzman ekibiyle iş planlamasında size destek olur ve kullanıcı odaklı çözümlerle süreçlerinizi optimize eder. Daha fazlası nobetuygulamasi.com'da."
      />
      {/* Favicon (Site logosu) */}
      <link rel="icon" href="/logoj.png" />
      <div className=''>
        <div className="relative w-full h-[400px]">
          <Image
            src="/hakkimizda_nobetx_2.jpg"
            alt="Nöbet Uygulaması Hakkında"
            fill
            className="object-cover"
            quality={100} // Kaliteyi %100 yapar (varsayılan 75)
            priority // Öncelikli yükleme
            sizes="100vw" // Viewport genişliği kadar yer kaplasın
          />
          <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-2xl shadow-lg max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Hakkımızda</h1>
            <p className="text-lg text-gray-900">
              Gelişen teknoloji ile birlikte şirketlerin ve kurumsal yapıların iş süreçlerini düzenlemek ve verimliliği artırmak çok daha kolay hale geldi.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center">

            {/* Hakkımızda Bölümü */}
            <div className="">
              {/* Giriş Bölümü */}
              <section className="bg-white p-8 rounded-2xl mb-16 mt-16">
                <p className='text-gray-600 mb-6'>
                  Vardiyalı çalışan kurumlar ve yoğun mesai gerektiren departmanlar için nöbet listelerini hazırlamak ve düzenlemek büyük bir zaman kaybı ve karmaşaya yol açabiliyor. İşte bu noktada Nöbet Uygulaması devreye giriyor!
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Nöbet Uygulaması Nedir?</h2>
                <p className="text-gray-600">
                  Nöbet Uygulaması, nöbet planlama süreçlerini otomatikleştirerek hem yöneticilere hem de çalışanlara büyük kolaylık sağlar. Kullanıcı dostu arayüzü ve esnek yapılandırma seçenekleriyle karmaşık nöbet çizelgelerini hızlı ve hatasız bir şekilde oluşturmanıza yardımcı olur. Böylece iş gücü yönetimini optimize ederken zaman kaybını minimuma indirirsiniz.
                </p>
                <p className="text-gray-600 mt-4">
                  Nöbet Uygulaması, çağın gereksinimlerine uygun olarak geliştirilmiş, kullanıcı dostu bir nöbet planlama ve yönetim platformudur. Amacımız, mevcut manuel ve karmaşık nöbet listesi hazırlama süreçlerini ortadan kaldırarak, hızlı ve pratik bir çözüm sunmaktır. Tek bir tuşla, ihtiyaç duyduğunuz nöbet listesini oluşturabilir ve çalışanlarınızın programlarını şeffaf bir şekilde görmesini sağlayabilirsiniz.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl mb-16 mt-16 ">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Nöbet Uygulaması ile Kolay ve Etkili Nöbet Yönetimi</h2>
                <p className="text-gray-600">
                  Nöbet Uygulaması, sadece nöbet listesi oluşturmayı değil, aynı zamanda şirket veya kurum içerisindeki tüm departmanların ve bölümlerin etkin bir şekilde yönetilmesini de sağlar. Yöneticiler, sistem üzerinden kolaylıkla yeni departmanlar ekleyebilir, mevcut yapıları organize edebilir ve işleyişi en verimli hale getirebilirler.
                </p>
                <p className="text-gray-600 mt-4">
                  Ayrıca, Nöbet Uygulaması sadece yöneticilere değil, çalışanlara da büyük kolaylıklar sunar. Çalışanlar, sistem üzerinden izin taleplerini, vardiya değişiklik isteklerini veya diğer bütün taleplerini doğrudan yöneticiye iletebilirler. Bu sayede yöneticiler ve çalışanlar arasında etkili bir etkileşim sağlanarak, organizasyon içi iletişim ve planlama maksimum seviyeye çıkartılır.
                </p>
              </section>
            </div>
            <div className='rounded-2xl mb-16 mt-16 flex items-center justify-center h-[300px] overflow-hidden'>
              <Image
                src="/hakkimizda_tum_planlar.jpg"
                alt="Nöbet Uygulaması Hakkında"
                width={1200}
                height={400} // Yüksekliği biraz daha büyük tutarak yukardan ve aşağıdan kırpma etkisi yaratıyoruz
                className="object-cover"
                quality={100}
              />
            </div>


            {/* Tüm Planlar Elinizin Altında */}
            <section className='bg-white p-6 rounded-2xl'>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tüm Planlar Elinizin Altında</h2>
              <p className="text-gray-600">
                Nöbet Uygulaması ile oluşturduğunuz nöbet listelerini ve takvimleri istediğiniz gibi gözlemleyebilir, gerekli güncellemeleri anında yapabilirsiniz. Sistemin sunduğu sezgisel ve esnek yapı sayesinde hem yöneticiler hem de çalışanlar istedikleri bilgilere her zaman kolayca erişebilmektedir.
              </p>
              <p className="text-gray-600 mt-4">
                Güvenli ve bulut tabanlı altyapımız sayesinde, tüm verileriniz güvende olurken, her an her yerden Nöbet Uygulaması'na erişim sağlayabilirsiniz. Bu da, iş akışınızı kesintisiz bir şekilde devam ettirmenize olanak tanır.
              </p>
              <p className="text-gray-600 mt-4">
                Ayrıca, Nöbet Uygulaması kullanıcılarına gelişmiş analiz ve raporlama araçları da sunar. Yöneticiler, nöbet düzenlerini detaylı grafikler ve istatistiklerle inceleyerek, daha verimli planlamalar yapabilirler. Böylece, kurum içi verimlilik artırılarak, iş gücü yönetimi en iyi seviyeye getirilir.
              </p>
            </section>

            {/* Neden Nöbet Uygulaması? Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-16  py-12">
              {/* Sol Taraf: Liste */}
              <div className="self-start">
                {/* Tüm Planlar Elinizin Altında */}

                <section className='bg-white p-6 rounded-2xl mt-[17vh]'>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Neden Nöbet Uygulaması?</h2>
                  <ul className="space-y-4 text-start">
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Zamandan Tasarruf:</strong> Manuel olarak vakit harcamadan, tek tuşla nöbet listelerinizi hazırlayabilirsiniz.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Esnek Departman Yönetimi:</strong> Yöneticiler için esnek departman ve bölüm oluşturma özelliği.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Etkili Etkileşim:</strong> Çalışanların izin ve vardiya değişiklik taleplerini kolayca iletmesi.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Kolay Gözetim:</strong> Oluşturulan nöbet listelerini ve takvimleri her zaman gözlemleyebilme.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Bulut Tabanlı Güvenlik:</strong> Tüm verileriniz güvenli ve her yerden erişilebilir.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Gelişmiş Raporlama:</strong> Nöbet düzenleriyle ilgili detaylı analiz ve istatistikler.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 text-2xl mr-4">•</span>
                      <span className="text-gray-600 text-lg">
                        <strong>Kullanıcı Dostu Arayüz:</strong> Basit ve sezgisel kullanım sayesinde her seviyeden kullanıcı kolaylıkla adapte olabilir.
                      </span>
                    </li>
                  </ul>
                </section>
              </div>

              {/* Sağ Taraf: Görsel */}
              <div className="rounded-2xl flex items-center ">
                <Image
                  src="/hakkimizda_nobet.jpg" // Görselin yolunu buraya ekleyin
                  alt="Nöbet Uygulaması Hakkında"
                  width={800} // Görsel genişliği
                  height={1400} // Görsel yüksekliği
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Ekip */}
            <div className="text-center bg-white rounded-xl py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Ekibimiz</h2>
              <div className="grid md:grid-cols-3 gap-8 px-12">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-blue-600 mb-2">
                      {member.role.split(" / ").map((role, i) => (
                        <span key={i}>
                          {role}
                          <br />
                        </span>
                      ))}
                    </p>
                    <p className="text-gray-600">
                      {member.description.split(" / ").map((desc, i) => (
                        <span key={i}>
                          {desc}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Hakkımızda;