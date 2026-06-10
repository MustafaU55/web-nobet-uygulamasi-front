"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/loaders/baseApi";
import { ClipboardCopyIcon } from "lucide-react";

function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [userData, setUserData] = useState(null);
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleBuyClick = (price) => {
    setSelectedPrice(price);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.post("/api/userData");

        if (response.status === 200 || response.status === 201) {
          const data = response.data;

          if (data.success === "true" && data.data && data.data.userData) {
            setUserData(data.data.userData);
          }
        }
      } catch {

      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-white relative pt-[10vh] text-black">
      {/* Arka plan resmi */}
      <div className="absolute inset-0 z-0 h-[700px]">
        <Image
          src="/fiyatladirma_giris.jpg"
          alt="Fiyatlandirma"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-100"
          priority // Öncelikli yükleme
          sizes="100vw" // Viewport genişliği kadar yer kaplasın
        />
      </div>

      {/* İçerik */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 flex justify-center pt-36">
          Takvim Paketleri
        </h1>

        {/* Metin */}
        <div className="flex justify-center items-center text-center px-4 sm:px-6 lg:px-8 mt-8 mb-12">
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
            Nöbet Uygulaması'in sunduğu esnek takvim paketleriyle iş planlamanızı kolaylaştırın! İhtiyacınıza uygun paketi seçerek personel yönetimini daha verimli hale getirin ve hemen kullanmaya başlayın.
          </p>
        </div>

        <title>Takvim Paketleri - Nöbet Uygulaması</title>
        <meta
          name="description"
          content="Nöbet Uygulaması paketlerini keşfedin! İş planlaması ve takvim oluşturma için ihtiyaçlarınıza uygun çözümleri bulun. Daha fazlası nobetuygulamasi.com'da."
        />
        <link rel="icon" href="/logoj.png" />

        {/* Paketlerin bulunduğu alan */}
        <div className="pb-20">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-8xl w-full px-4 sm:px-6 lg:px-8">
              {/* Ücretsiz Paket */}
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-lg p-8 text-center border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300 relative">
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Ücretsiz</h3>
                <p className="text-gray-800">Bir test sürüşüne ne dersiniz?</p>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-[45px] font-bold text-blue-500">0</p>
                  <p className="text-gray-600">TL</p>
                </div>
                <br />
                <ul className="text-left list-disc list-inside text-gray-600 space-y-2">
                  <li>1 Takvim Hakkı</li>
                  <li>Personel Etkileşimi</li>
                  <li>Sınırlı Personel Sayısı (6)</li>
                  <li>Sınırlı Departman Yönetimi (6)</li>
                  <li>Vardiya Yönetimi (1)</li>
                  <li>İzin Yönetimi</li>
                  <li>Nöbet Yönetimi</li>
                </ul>
                <br />
                <div className="mb-[15vh] mt-2">
                  <Link
                    href={`/register`}
                    className="bg-blue-500 text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-600 transition"
                  >
                    Ücretsiz Başla
                  </Link>
                </div>
                {/* Alt kısma görsel ekleniyor */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <Image
                    src="/paketler_ucretsiz.png"
                    alt="Ücretsiz"
                    width={50}
                    height={100}
                    className="rounded-lg opacity-30"
                  />
                </div>
              </div>

              {/* 280TL Paket */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-center text-white hover:shadow-xl transition-shadow duration-300 relative">
                <h3 className="text-3xl font-bold mb-4">Yeni Başlayanlar</h3>
                <p className="text-gray-200">Ekip yönetimi için</p>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-[45px] font-bold">280</p>
                  <p>TL</p>
                </div>
                <br />
                <ul className="text-left list-disc list-inside text-white space-y-2">
                  <li>1 Takvim Hakkı</li>
                  <li>Personel Etkileşimi</li>
                  <li>Sınırlı Personel Sayısı (12)</li>
                  <li>Sınırlı Departman Yönetimi (12)</li>
                  <li>Vardiya Yönetimi (3)</li>
                  <li>İzin Yönetimi</li>
                  <li>Nöbet Yönetimi</li>
                </ul>
                <br />
                <div className="mb-[15vh]">
                  <button
                    onClick={() => handleBuyClick(280)}
                    className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                  >
                    Satın Al
                  </button>
                </div>

                {/* Alt kısma görsel ekleniyor */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <Image
                    src="/paketler_yeni_baslayanlar.png"
                    alt="Yeni Başlayanlar Paketi"
                    width={150}
                    height={100}
                    className="rounded-lg opacity-30"
                  />
                </div>
              </div>

              {/* 800TL Paket */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 pb-0 text-center text-white hover:shadow-xl transition-shadow duration-300 relative">
                <h3 className="text-3xl font-bold mb-4">Deneyimli Yönetim</h3>
                <p className="text-gray-200">Uzmanlar için tavsiye edilen</p>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-[45px] font-bold">800</p>
                  <p>TL</p>
                </div>
                <br />
                <ul className="text-left list-disc list-inside text-white space-y-2">
                  <li>2 Takvim Hakkı</li>
                  <li>Personel Etkileşimi</li>
                  <li>Sınırlı Personel Sayısı (24)</li>
                  <li>Sınırlı Departman Yönetimi (24)</li>
                  <li>Vardiya Yönetimi (3)</li>
                  <li>İzin Yönetimi</li>
                  <li>Nöbet Yönetimi</li>
                </ul>
                <br />
                <div className="mb-[15vh]">
                  <button
                    onClick={() => handleBuyClick(800)}
                    className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                  >
                    Satın Al
                  </button>
                </div>

                {/* Alt kısma görsel ekleniyor */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <Image
                    src="/paketler_deneyimli.png"
                    alt="Deneyimli Yönetim Paketi"
                    width={250}
                    height={100}
                    className="rounded-lg opacity-30"
                  />
                </div>
              </div>

              {/* 1500TL Paket */}
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-lg shadow-lg p-8 pb-0 text-center text-white hover:shadow-xl transition-shadow duration-300 relative">
                <h3 className="text-3xl font-bold mb-4">Profesyonel Yönetici</h3>
                <p className="text-gray-200">"Büyük işler, büyük takvim yönetimi getirir."</p>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-[45px] font-bold">1500</p>
                  <p>TL</p>
                </div>
                <br />
                <ul className="text-left list-disc list-inside text-white space-y-2">
                  <li>10 Takvim Hakkı</li>
                  <li>Personel Etkileşimi</li>
                  <li>Sınırsız Personel Sayısı</li>
                  <li>Sınırsız Departman Yönetimi</li>
                  <li>Vardiya Yönetimi (5)</li>
                  <li>İzin Yönetimi</li>
                  <li>Nöbet Yönetimi</li>
                </ul>
                <br />
                <div className="mb-[15vh]">
                  <button
                    onClick={() => handleBuyClick(1500)}
                    className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                  >
                    Satın Al
                  </button>
                </div>

                {/* Alt kısma görsel ekleniyor */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <Image
                    src="/paketler_profesyonel.png"
                    alt="Profesyonel Yönetici Paketi"
                    width={300}
                    height={100}
                    className="rounded-lg opacity-30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Havale ile Bakiye Yükleme</h2>
            {/* Banka Adı */}
            <div className="flex justify-between items-center mb-2">
              <p><strong>Banka Adı:</strong> AKBANK T.A.Ş</p>
              <button
                onClick={() => handleCopy("AKBANK T.A.Ş")}
                className="text-blue-500 hover:text-blue-700"
              >
                <ClipboardCopyIcon size={20} />
              </button>
            </div>

            {/* Hesap Adı */}
            <div className="flex justify-between items-center mb-2">
              <p><strong>Hesap Adı:</strong> Xristal Bilgi Sistemleri Ticaret Sanayi Limited Şirketi</p>
              <button
                onClick={() => handleCopy("Xristal Bilgi Sistemleri Ticaret Sanayi Limited Şirketi")}
                className="text-blue-500 hover:text-blue-700"
              >
                <ClipboardCopyIcon size={20} />
              </button>
            </div>

            {/* IBAN */}
            <div className="flex justify-between items-center mb-2">
              <p><strong>IBAN:</strong> TR02 0004 6005 5388 8000 1598 58</p>
              <button
                onClick={() => handleCopy("TR02 0004 6005 5388 8000 1598 58")}
                className="text-blue-500 hover:text-blue-700"
              >
                <ClipboardCopyIcon size={20} />
              </button>
            </div>

            {/* Açıklama */}
            <div className="flex justify-between items-center mb-4">
              <p><strong>Açıklama:</strong> @{userData?.username || "kullanıcı_adı"}</p>
              <button
                onClick={() => handleCopy("@" + (userData?.username || "kullanıcı_adı"))}
                className="text-blue-500 hover:text-blue-700"
              >
                <ClipboardCopyIcon size={20} />
              </button>
            </div>

            <p className="text-red-500 mb-4">
              <strong>Önemli!</strong> Açıklama bölümüne kullanıcı adınızı @ işareti ile beraber birleşik girmeniz gerekiyor.
            </p>

            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default PricingPage;