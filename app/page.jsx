"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

function page() {
  const [sliderHeight, setSliderHeight] = useState('100vh');
  const [selectedSlider, setSelectedSlider] = useState(null);

  const sliders = [
    {
      id: 1,
      type: 'video',
      src: '/slider_masaustu.mp4',
      title: 'Modern Nöbet Yönetimi',
      description: 'Sağlık sektörü için özel tasarlanmış çözümler',

    },
    {
      id: 2,
      type: 'video',
      src: '/slider_masaustu_1.mp4',
      title: 'Kolay Plan Çözümleri',
      description: 'Her zamankinden daha hızlı ve kullanıcı dostu araçlar',
    },
  ];

  useEffect(() => {
    // Rastgele bir slider seçimi
    const randomIndex = Math.floor(Math.random() * sliders.length);
    setSelectedSlider(sliders[randomIndex]);

    // Slider yüksekliğini hesapla
    const calculateSliderHeight = () => {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      const newSliderHeight = windowHeight + headerHeight;
      setSliderHeight(`${newSliderHeight}px`);
    };

    calculateSliderHeight(); // İlk yüklemede çalıştır
    window.addEventListener('resize', calculateSliderHeight);

    return () => window.removeEventListener('resize', calculateSliderHeight); // Cleanup
  }, []);

  if (!selectedSlider) return null; // Slider seçimi yapılana kadar boş döner

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-200 relative">
      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "NöbetX",
          "description": "Nöbet ve vardiya yönetimi için tüm sektörlere uygun otomatik planlama çözümü.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web"
        })}
      </script>
      <meta
        name="description"
        content="NöbetX, iş planlamanızı kolaylaştırır ve kullanıcı dostu araçlarla hızlı bir şekilde takvim oluşturmanıza yardımcı olur."
      />

      {/* Arka plan deseni */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url('/calendar.png')`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          zIndex: 0,
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
        }}
      >
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-color"></div>
      </div>

      {/* Ana içerik */}
      <div className="relative z-10">
        {/* Slider Bölümü */}
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600" style={{ height: "100vh" }}>
          {selectedSlider.type === 'video' && (
            <video
              className="absolute inset-0 w-full h-[100vh] object-cover"
              src={selectedSlider.src}
              autoPlay
              loop
              muted
              playsInline
            ></video>
          )}
          {/* Sağ Blok */}
          <picture
            className="absolute right-0 top-0 w-[15vh] md:w-[30vh] h-[30vh] md:h-[50vh]  bg-blue-300 opacity-100 flex items-center justify-center"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
            }}
          >
            {/* Görsel */}
            <img
              src="/pngnoalt.png"
              alt="Flama Görseli"
              width="300"
              height="150"
              className="w-2/3 h-auto object-contain"
              loading="lazy"
            />

          </picture>


          {/* Video üzerine metin */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:pt-[28vh] pt-[5vh]">
            <h2 className="text-3xl text-black md:text-6xl font-bold mb-4">
              {selectedSlider.title}
            </h2>
            <p className="text-lg text-black md:text-2xl px-5 text-center md:px-0">
              {selectedSlider.description}
            </p>
          </div>
        </div>


        {/* Hero Section - Takvim efekti ve düzenlenmiş başlık */}
        <div className="bg-white py-20 ">
          <div className="relative w-full py-20 ">
            <title>Modern Nöbet Yönetim - NöbetX</title>
            {/* Meta Açıklama */}
            <meta
              name="description"
              content="NöbetX - Tüm sektörler için modern nöbet ve vardiya yönetim sistemi. Otomatik nöbet planlama, takvim entegrasyonu ve anlık bildirimlerle iş süreçlerinizi kolaylaştırın."
            />   {/* Favicon (Site logosu) */}
            <link rel="icon" href="/logoj.png" />

            {/* Ana İçerik */}
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
                {/* Sol Görsel */}
                <div>
                  <Image src="/calendar_blue.jpg" alt="calendar" width={500} height={500}
                    className="w-full h-auto object-cover rounded-2xl"
                    priority
                  />
                </div>
                <div>

                  {/* Başlık ve Logo Grubu */}
                  <div className="flex gap-5 mb-2 pt-16 ">
                    <div className=""> {/* Başlık Grubu */}
                      <h1 className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight filter">NöbetX
                      </h1>
                      <div className=" md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold tracking-wide">
                        Modern Nöbet Yönetim Sistemi
                      </div>
                    </div>
                    {/* Logo Komponenti */}
                    <div className="relative w-16 h-16 md:w-24 md:h-24 md:w-24 md:h-24 flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl transform rotate-45 shadow-lg group-hover:rotate-[225deg] transition-transform duration-700"></div>
                      <div className="absolute md:inset-2 inset-1 bg-white rounded-xl transform rotate-45 group-hover:rotate-[225deg] transition-transform duration-700"></div>

                      {/* Takvim İkonu */}
                      <div className="relative z-10 text-4xl md:text-5xl font-bold text-blue-600 transform group-hover:scale-110 transition-transform duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-12 h-12 md:w-16 md:h-16"
                        >
                          <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                          <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* Açıklama Metni */}
                  <div className="max-w-xl bg-white">
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed py-4">
                      <strong>NöbetX</strong>, sağlık çalışanlarından güvenlik ekiplerine, fabrika operasyonlarından IT ekiplerine kadar<span> </span>
                      <span className="text-blue-600 font-medium">tüm sektörlerdeki</span> nöbet ve vardiya planlamasını kolaylaştıran<span> </span>
                      <span className="text-purple-600 font-medium">modern bir yönetim sistemi</span> sunar.
                    </p>

                  </div>
                </div>
              </div>
            </div>
            {/* Dekoratif Alt Çizgi */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div> */}
          </div>
        </div>
        <div className="bg-gray-100">
          {/* Features Section */}
          <div className="relative max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
              Neden <span className="text-blue-600">NöbetX</span>?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Kolay Kullanım",
                  description: "Kullanıcı dostu arayüz ile hızlı ve kolay nöbet planlaması",
                  icon: "🎯"
                },
                {
                  title: "Otomatik Nöbet Atamaları",
                  description: "Sistem, tüm kriterleri dikkate alarak otomatik atama yapar",
                  icon: "🤖"
                },
                {
                  title: "Takvim Entegrasyonu",
                  description: "Çalışanların nöbetlerini kolayca görüntülemesi için takvim entegrasyonu sunar",
                  icon: "📅"
                },
                {
                  title: "Anlık Bildirimler",
                  description: " Nöbet değişiklikleri veya güncellemelerle ilgili anında bilgilendirme.",
                  icon: "📱"
                },
                {
                  title: "Detaylı Raporlar",
                  description: "Takvimlerinizi PDF veya Excel formatında dilediğiniz gibi görüntüleyin ve indirin",
                  icon: "📊"
                },
                {
                  title: "Esnek Ayarlar",
                  description: "Nöbet sıklığı, izin günleri ve çalışma saatlerine göre özelleştirme",
                  icon: "⚙️"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 ">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center text-gray-600">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hemen Başlayın
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Modern nöbet yönetimi için NöbetX'i tercih edin.
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full 
                       text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 
                       transition-all duration-300 shadow-lg"
            >
              Ücretsiz Deneyin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;