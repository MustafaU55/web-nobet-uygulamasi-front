'use client';

import { FaCalendarAlt, FaUserShield, FaExchangeAlt, FaBell, FaMobileAlt, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Image from 'next/image';

export default function HowToUsePage() {
    const [activeTab, setActiveTab] = useState('admin');

    // User content section refs

    const anasayfaRef = useRef(null);
    const izinTalepleriRef = useRef(null);
    const izinTakvimiRef = useRef(null);
    const nobetTakvimleriRef = useRef(null);
    const nobetlerimRef = useRef(null);
    const izinAtamaRef = useRef(null);
    const nobetAtamaRef = useRef(null);
    const departmanYonetimiRef = useRef(null);
    const departmanOlusturRef = useRef(null);
    const departmanKisiAtamaRef = useRef(null);
    const departmanlarRef = useRef(null);
    const atanmisPersonellerRef = useRef(null);
    const vardiyaYonetimiRef = useRef(null);
    const vardiyaListesiRef = useRef(null);
    const vardiyaIstekListesiRef = useRef(null);
    const nobetOlusturRef = useRef(null);
    const nobetTalepleriRef = useRef(null);
    const gecmisTakvimlerRef = useRef(null);
    const personelEkleRef = useRef(null);
    const personelListesiRef = useRef(null);
    const vardiyaTalepleriRef = useRef(null)
    const nobetProgramiRef = useRef(null)

    const scrollToRef = (ref) => {
        window.scrollTo({
            top: ref.current.offsetTop - 120,
            behavior: 'smooth'
        });
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 pt-[12vh] text-black">
            <title>Nasıl Kullanılır? - Nöbet Uygulaması</title>
            <meta
                name="description"
                content="Personel ve yönetici sayfalarınızı nasıl kullanacağınız detaylı bir şekilde öğrenin. Daha fazlası nobetuygulamasi.com'da."
            />
            <link rel="icon" href="/logoj.png" />

            <section className="relative bg-cover bg-center bg-no-repeat bg-[url('/nasil_kullanilir.jpg')] min-h-[50vh] flex items-center justify-center">
                <div className="container mx-auto px-6 text-center transform -translate-y-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-black"
                    >
                        Nöbet Uygulaması Kullanım Kılavuzu
                    </motion.h1>
                    <p className="text-xl md:text-2xl max-w-xl mx-auto text-black">
                        Nöbet yönetim sistemimizi en verimli şekilde kullanmanız için hazırlanan rehber
                    </p>
                </div>
            </section>


            {/* Tab Buttons */}
            <div className="container mx-auto px-6 flex justify-center">
                <div className="flex mt-12 bg-white rounded-xl shadow-sm overflow-hidden space-x-1 p-1 bg-gray-100">
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`px-8 py-3 font-medium text-lg transition-all duration-200 ease-out rounded-lg flex items-center ${activeTab === 'admin'
                            ? 'bg-white text-blue-600 shadow-sm font-semibold transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-50 transform hover:scale-[1.01]'
                            }`}
                    >
                        {activeTab === 'admin' && (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                        Yönetici Kılavuzu
                    </button>

                    <button
                        onClick={() => setActiveTab('user')}
                        className={`px-8 py-3 font-medium text-lg transition-all duration-300 rounded-lg flex items-center ${activeTab === 'user'
                            ? 'bg-white text-blue-600 shadow-md font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {activeTab === 'user' && (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                            </svg>
                        )}
                        Personel Kılavuzu
                    </button>
                </div>
            </div>

            {/* Admin Content - Only shown when activeTab is 'admin' */}
            {activeTab === 'admin' && (
                <div className="admin-content">
                    {/* Admin Features Section */}
                    <section className="py-12">
                        <div className="">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                            >
                                <div className="w-full ">
                                    <p className="text-gray-600 mb-4 break-words">
                                        Yönetici Kılavuzu, Nöbet Uygulaması'nı bir adım ileriye taşımak için hazırlanmıştır. Yönetici panelinizdeki özelliklerin nasıl çalıştığı detaylı bir şekilde aşağıda anlatılmıştır.
                                        <br />
                                    </p>
                                    <ul className="space-y-2 overflow-x-auto">
                                        <p className='font-bold text-xl'>İçerik</p>
                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(anasayfaRef)}>
                                            1-Anasayfa
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(izinTalepleriRef)}>
                                            1.1-İzin Talepleri
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(izinTakvimiRef)}>
                                            1.2-İzin Takvimi
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(nobetTakvimleriRef)}>
                                            1.3-Nöbet Takvimlerim
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(nobetlerimRef)}>
                                            1.4-Nöbetlerim
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(izinAtamaRef)}>
                                            1.5-İzin Atama
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(nobetAtamaRef)}>
                                            1.6-Nöbet Atama
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(departmanYonetimiRef)}>
                                            2-Departman Yönetimi
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(departmanOlusturRef)}>
                                            2.1-Departman Oluştur
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(departmanKisiAtamaRef)}>
                                            2.2-Departmana Kişi Atama
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(departmanlarRef)}>
                                            2.3-Departmanlar
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(atanmisPersonellerRef)}>
                                            2.4-Atanmış Personeller
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(vardiyaYonetimiRef)}>
                                            3-Vardiya Yönetimi
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(vardiyaListesiRef)}>
                                            3.1-Vardiya Listesi
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(vardiyaIstekListesiRef)}>
                                            3.2-Vardiya İstek Listesi
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(nobetOlusturRef)}>
                                            4-Nöbet Takvimi Oluştur
                                        </li>
                                        <li className="ml-4 cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(nobetTalepleriRef)}>
                                            4.1-Nöbet Talepleri
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(gecmisTakvimlerRef)}>
                                            5-Geçmiş Takvimler
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(personelEkleRef)}>
                                            6-Personel Ekle
                                        </li>

                                        <li className="cursor-pointer text-blue-600 hover:underline" onClick={() => scrollToRef(personelListesiRef)}>
                                            7-Personel Listesi
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            <div ref={anasayfaRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >
                                    <div className="w-full max-w-7xl">
                                        <h2 className='text-3xl font-bold mb-6 text-center'> Anasayfa</h2>
                                        <p className="text-gray-600">
                                            Yönetici panelinizin anasyfasına geldiğiniz ilk olarak sizi <strong className='text-blue-500'>İzin Talepleri</strong> karşılayacak. Daha sonrasında takvimler alanında gerekli takipleri sağlayabileceksiniz. Anasayfanın en altında ise personellere atamalar yapabildiğiniz alanlar bulunmaktadır.

                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Vardiya Taleplerim Features */}
                            <div ref={izinTalepleriRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >

                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">
                                            <h3 className="text-xl font-semibold">İzin Talepleri</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu alanda personellerinizin izin taleplerini görüntüleyebilirsiniz. Buradaki talepler personelin belirttiği günde izin almak istediği anlamına gelir.<br /> <br /> Bu izinleri <span className='text-green-500'>onaylamak</span> ya da <span className='text-red-500'>reddetmek</span> yönetici olarak sizin kontrolünüzdedir. Bir izni onayladığınız zaman personel ilgili tarihte izinli olmaktadır ve bundan dolayı bir sonraki takvim oluşturmanızda ilgili tarih nöbete dahil ise izinli olan personele nöbet ataması yapılmayacaktır.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_izin_görüntüle.png"
                                                alt="Yönetici İzin Talepleri"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                            >
                                <div className="w-full ">
                                    <p className="text-gray-600">
                                        Yönetici panelinin devamında sizi 3 seçenekli bir alan karşılıyor. Burada <button className='text-blue-500 font-bold hover:text-blue-700' onClick={() => scrollToRef(izinTakvimiRef)}>İzin Takvimi</button>, <button className='text-blue-500 font-bold hover:text-blue-700' onClick={() => scrollToRef(nobetTakvimleriRef)}>Nöbet Takvimleri</button>, <button className='text-blue-500 font-bold hover:text-blue-700' onClick={() => scrollToRef(nobetlerimRef)}>Nöbetlerim</button> butonaları arasında geçiş yaparak içerikleri görüntüleyebilirsiniz. İlk olarak izin takvimini ele alacağız.

                                    </p>
                                </div>
                            </motion.div>

                            {/* Vardiya Taleplerim Features */}
                            <div ref={izinTakvimiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">İzin Takvimi</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu takvimde önceden onaylanmış izinler görüntülenmektedir. Takvim üzerinden günlere tıklayarak izinlerin detaylarına ulaşabilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_izin_takvimi.png"
                                                alt="Yönetici İzin Takvimi"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>


                            {/* Vardiya Taleplerim Features */}
                            <div ref={nobetTakvimleriRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Nöbet Takvimlerim</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu bölüm oluşturduğunuz nöbet takvimlerini görüntülemenize yardımcı oluyor. İsterseniz departman, vardiya ya da personel seçerek takvimlerinizi daha özelleştirilmiş bir şekilde görebilirsiniz. <span className='p-1 bg-blue-500 text-white rounded-full'>Takvim İndir</span> butonu sayesinde görüntülediğiniz takvimi excel dosyası olarak indirebilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_nobet_takvimleri.png"
                                                alt="Yönetici Nöbet Takvimleri"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Vardiya Taleplerim Features */}
                            <div ref={nobetlerimRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >


                                    {/* Content Container */}
                                    <div className="w-full  ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Nöbetlerim</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Nöbetlerim bölümü sadece size özeldir. İlk olarak  önceden oluşturduğunuz bir takvimi seçmeniz gerekmektedir. Daha sonrasında seçtiğimiz nöbet takviminde sadece sizin tuttuğunuz nöbetler tablo halinde size sunulacaktır. Buradaki hafta butonları ise nöbet tablosunu hafta hafta görüntülemenize yardımcı olacaktır.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_nobetlerim.png"
                                                alt="Yönetici Nöbetlerim"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>



                            <div className='grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72'>
                                {/* Vardiya Taleplerim Features */}
                                <div ref={izinAtamaRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 pt-8 rounded-xl flex flex-col items-center mb-8"
                                    >

                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">

                                                <h3 className="text-xl font-semibold">İzin Atama</h3>
                                            </div>
                                            <p className="text-gray-600 mb-4 pb-2">
                                                Bu alan herhangi bir personeli izinlendirmenizi sağlar. Bunun için ilk olarak personeli, daha sonrasında ilgili tarih aralığını ve son olarak da izin nedeni girmeniz gerekmektedir.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/yonetici_izin_atama.png"
                                                    alt="Yönetici İzin Atama"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Vardiya Taleplerim Features */}
                                <div ref={nobetAtamaRef

                                }>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 pt-8 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">

                                                <h3 className="text-xl font-semibold">Nöbet Atama</h3>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Bu alan ise bir personele özel olarak çalıştırmak istediğinizde kullanabilirsiniz.  Bu nöbet atama oluşturulduğunda o personelin hangi gün, hangi departmanda, hangi vardiyada çalışacağı önceden belirlenmiş olacaktır.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/yonetici_nobet_atama.png"
                                                    alt="Yönetici Nöbet Atama"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div ref={departmanYonetimiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72"
                                >
                                    <div className="w-full max-w-7xl">
                                        <h2 className='text-3xl font-bold mb-6 text-center'> Departman Yönetimi</h2>
                                        <p className="text-gray-600">
                                            Departman Yönetimi sayfasında yönetici olarak departmanlarınızı oluşturabilir, bu departmanlara personel atayabilir ve isterseniz departmanları özelleştirebilirsiniz.

                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72'>
                                {/* Vardiya Taleplerim Features */}
                                <div ref={departmanOlusturRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">

                                                <h3 className="text-xl font-semibold">Departman Oluştur</h3>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Bu alan departmanlarınızı oluşturmanızı sağlar. Çalışma planınızdaki departmanları isimlendirerek ekleyebilirsiniz. Departmanlara öncelik seçmek, nöbet takvimi oluştururken öncelik seviyesine göre personel atamasına fayda sağlar.<br /><br /> Örneğin <span className='text-red-500'>"Acil"</span> önceliğinde bir departmanız varsa, nöbet atamasında ilk olarak buraya personel atanacağı için asla boş kalmayacaktır.<br /><br /> <span className='p-2 bg-blue-500 text-white rounded-full'>Vardiya Oluştur</span> ise departmanların hangi vardiyasında kaç personelle birlikte çalışacağını ayarlar. Bu ekstra bir özelliktir eğer herhangi bir düzenleme yapmazsanız sistem otomatik 1 değerini atayacaktır endişelenmenize gerek yok.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/yonetici_departman_olustur.png"
                                                    alt="Yönetici Departman Oluştur"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Vardiya Taleplerim Features */}
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white p-8 rounded-xl flex flex-col items-center mb-8"
                                    >

                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/yonetici_departman_vardiyalari.png"
                                                    alt="Yönetici Departman Vardiyaları"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <div ref={departmanKisiAtamaRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Departmana Kişi Atama</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bir personeli kesin olarak bir departmanda çalıştırmak istiyorsanız, buradan personel ve departmanları seçerek atamayı sağlayabilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_departman_kisi_atama.png"
                                                alt="Yönetici Departmana Kişi Atama"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={departmanlarRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Departmanlar</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Burada oluşturduğunuz departmanlar listelenmekte. Eğer departmanlarınız hakkında değişiklik yapmak istiyorsanız buradan yönetebilirsiniz. <span className='text-blue-500'>İzin Al</span> butonu ile departmanlara izin ataması yapabilirsiniz. Bu da departmanı bir sonraki takvim oluşturmasında sizin departmana atadığınız izin günlerinde izinli olmasına sebep olur.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full mb-4 flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_departmanlar.png"
                                                alt="Yönetici Departmanlar"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        İzin ekleme alanında iki türlü izin atayabilirsiniz. <span className='bg-blue-500 p-2 text-white rounded-lg'>Günlük İzin Al</span> sayesinde departmanı özel bir günde izinli yapmış olursunuz. <span className='p-2 bg-blue-500 text-white rounded-lg'>Haftalık İzin Al</span> ise haftanın bir gününü seçersiniz ve departman artık her hafta o gün izinli olur. <br /><br /> Sağ tarafta ise düzenleme kısmı yer alıyor. Burada departmanın daha öncesinde atanmış olan bilgilerini değiştirebilirsiniz.
                                    </p>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <div>
                                                <Image
                                                    src="/yonetici_departman_izin_ekle.png"
                                                    alt="Yönetici Departman İzin Ekle"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                                <p className="text-gray-600 mb-4">
                                                    Departmanlar alanında "İzinleri Göster" butonuna tıkladığınızda ilgili departmana ait izinler görüntülenmektedir. Burada isterseniz izinleri silebilirsiniz.
                                                </p>
                                                <Image
                                                    src="/yonetici_departman_izin_sil.png"
                                                    alt="Yönetici Departman İzin Sil"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_departman_ozellestirme.png"
                                                alt="Yönetici Departman Özelleştirme"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={atanmisPersonellerRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Atanmış Personeller</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Daha öncesinde bir departmana kişi atamasında bulunduysanız, atanan personelleri burada hangi departmana atadığınızı görebilirsiniz. İsterseniz bu atamaları silebilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_atanmis_personeller.png"
                                                alt="Yönetici Atanmış Personeller"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={vardiyaYonetimiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <h2 className='text-3xl font-bold mb-6 text-center'> Vardiya Yönetimi</h2>
                                        <p className="text-gray-600">
                                            Vardiya Yönetimi sayfasında sizi <button onClick={() => scrollToRef(vardiyaYonetimiRef)} className='text-blue-500 hover:text-blue-700 font-bold'>Vardiya Listesi</button> ve <button onClick={() => scrollToRef(vardiyaIstekListesiRef)} className='text-blue-500 hover:text-blue-700 font-bold'>Vardiya İstekleri</button> karşılamakta.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={vardiyaListesiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Vardiya Listesi</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu alanda personellerin hangi vardiyalarda çalıştıkaları bulunmaktadır.
                                        </p>
                                        <ul className='text-gray-600'>
                                            <li>Vardiya 0=Her vardiyada çalışabilir. </li>
                                            <li>Vardiya 1=Sadece 1. vardiyada çalışır.</li>
                                            <li>Vardiya 2=Sadece 2. vardiyada çalışır.</li>
                                            <li>Vardiya 3=Sadece 3. vardiyada çalışır.</li>
                                            <li>Vardiya 4=Sadece 4. vardiyada çalışır.</li>
                                            <li>Vardiya 5=Sadece 5. vardiyada çalışır.</li>
                                        </ul>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_vardiya_listesi.png"
                                                alt="Yönetici Vardiya Listesi"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={vardiyaIstekListesiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Vardiya İstek Listesi</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu alanda personellerin size gönderdiği çalışma vardiyası talepleri bulunmaktadır. Buradaki onayladığınız istekler iligili personelin çalışacağı vardiyayı değiştirmektedir.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full  overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_vardiya_istek_listesi.png"
                                                alt="Yönetici Vardiya İstek Listesi"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={nobetOlusturRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full ">
                                        <div className="flex justify-center items-center mb-4">
                                            <h2 className='text-3xl font-bold mb-6 text-center'> Nöbet Takvimi Oluştur</h2>
                                        </div>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full  flex justify-center">
                                        <div className="w-full max-w-9xl overflow-hidden rounded-lg">
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                                                <div>
                                                    <p className="text-gray-600 mb-4">
                                                        Nöbet takvimi oluştururken ilk olarak bir tarih aralığı seçmeniz lazım. Bunu da aşağıdaki takvimden bir adet başlangıç ve bitiş tarihi seçerek sağlayabilirsiniz. Böylelik o tarih aralığını seçmiş olacaksınız.<br /><br />  Eğer bir tatil günü belirlemek istiyorsanız da <span className='p-2 bg-blue-500 text-white rounded-full'>Özel İzin Tarihleri</span> takviminde izinli olunması gereken günleri tek tek seçebilirsiniz. İzinli olan günlere herhangi bir nöbet ataması yapılmayacaktır.
                                                    </p>
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                                                        <Image
                                                            src="/yonetici_takvim_olustur_tarih.png"
                                                            alt="Yönetici Takvim Oluştur Tarih"
                                                            width={1600}
                                                            height={800}
                                                            className="w-full h-auto object-cover"

                                                        />
                                                        <Image
                                                            src="/yonetici_takvim_olustur_tarih_ozel.png"
                                                            alt="Yönetici Takvim Oluştur Tarih"
                                                            width={1600}
                                                            height={800}
                                                            className="w-full h-auto object-cover"

                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-gray-600 mb-4">
                                                        Devamında ise nöbette yer alacak departmanları ve personeli seçmeniz gerekmektedir. Alt kısımdaki Nöbet Sayıları ise geçmiş takvimlerde personellerin toplam kaç gün nöbet tuttuğunu gösterir.
                                                    </p>
                                                    <Image
                                                        src="/yonetici_nobet_olustur_1.png"
                                                        alt="Yönetici Nöbet Oluştur 1"
                                                        width={1600}
                                                        height={800}
                                                        className="w-full h-auto object-cover"

                                                    />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                                                <p className="text-gray-600 mb-4">
                                                    Nöbet takvimi oluşturmak için son aşamada ilk olarak bir takvim ismi belirlemeniz lazım. Nöbet Aralığı, personelin kaç gün ara ile nöbet tutacağını belirler.<br /><br /> Nöbet Sayısı, hangi vardiyanın görev alacağını belirler. Çalışma günlerinde ise seçmediğiniz günlere takvim genelinde nöbet atanmayacaktır.<br /><br /> Örneğin Salı gününü seçmediğiniz senaryoda nöbet tarihlerinde ne kadar salı günü varsa hepsi boş bırakılacaktır.
                                                </p>
                                                <Image
                                                    src="/yonetici_nobet_olustur_2.png"
                                                    alt="Yönetici Nöbet Oluştur 2"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={nobetTalepleriRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white px-4 md:px-8 pt-8  rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full">
                                        <div className="flex justify-center items-center mb-4">

                                            <h3 className="text-xl font-semibold">Nöbet Talepleri</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu alan personeller tarafından gönderilen nöbet taleplerini listelemektedir. Bir talebi onaylamak, personelin bir sonraki takvim oluşturulurken istediği yerde çalışmasını sağlar. Örneğin  Personel, KB-1'de Salı günü çalışmak istemiş. Siz bu isteği onayladığınızda, personel yer aldığı nöbet takvimlerinde Salı günleri direkt KB-1 nöbetine atanacaktır.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici-nobet_talepleri.png"
                                                alt="Yönetici Nöbet Talepleri"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={gecmisTakvimlerRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full">
                                        <div className="flex justify-center items-center mb-4">
                                            <h2 className='text-3xl font-bold mb-6 text-center'> Geçmiş Takvimler</h2>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu sayfada önceden oluşturuduğunuz takvimlerin genel bilgileri sunulmakta. Takvimde yer alan departmanlar ve personeller listelenir. Bu listede ayrıca personellerin o takvimde kaç gün nöbet tuttukları bilgisini de görebilirsiniz. Bir takvimi kalıcı olarak kaldırmak istediğiniz zamanda <span className='bg-red-500 p-2 px-3 rounded-full text-white'>Sil</span> butonunu kullanabilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_gecmis_takvimler.png"
                                                alt="Yönetici Geçmiş Takvimler"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"

                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div ref={personelEkleRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white px-4 md:px-8 pt-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full">
                                        <div className="flex justify-center items-center mb-4">

                                            <h2 className='text-3xl font-bold mb-6 text-center'> Personel Ekle</h2>
                                        </div>

                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className='grid grid-cols-1 md:grid-cols-2'>
                                        <p className="text-gray-600 mt-12">
                                            Uygulamaya giriş yapamamış ya da kayıt olamamış personelleri bu sayfada siz kendiniz de oluşturabilirsiz.<br /><br /> Kayıt Opsiyonel alanları boş bırakabilirsiniz. Bu durumda sistem otomatik olarak değer atamaktadır.<br /><br /> Eklediğiniz personel daha sonra uygulamaya girip bilgilerini istediği gibi değiştirebilir.<br /><br /> Bilgi olarak daha önceden oluşturduğunuz Admin ID direkt size aittir. Bunun üzerinde personelinizde bir değişiklik yapmamaktadır.
                                        </p>
                                        <div className="w-full flex justify-center">
                                            <div className="w-full overflow-hidden rounded-lg">
                                                <Image
                                                    src="/yonetici_personel_ekle.png"
                                                    alt="Yönetici Personel Ekle"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <div ref={personelListesiRef}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-4 md:p-8 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">


                                    {/* Content Container */}
                                    <div className="w-full">
                                        <div className="flex justify-center items-center mb-4">

                                            <h2 className='text-3xl font-bold mb-6 text-center'> Personel Listesi</h2>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Bu sayfada size ait olan bütün personlleri görüntüleyebilirsiniz. <span className='bg-red-500 p-2 px-3 rounded-full text-white'>Sil</span> butonu sayesinde de istediğiniz personeli silerek ekibinizden çıkartabilirsiniz.
                                        </p>
                                    </div>
                                    {/* Image Container - Full width and centered */}
                                    <div className="w-full flex justify-center">
                                        <div className="w-full overflow-hidden rounded-lg">
                                            <Image
                                                src="/yonetici_kullanici_listesi.png"
                                                alt="Yönetici Kullanıcı Listesi"
                                                width={1600}
                                                height={800}
                                                className="w-full h-auto object-cover"
                                                layout=""
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                        </div>
                    </section>
                </div>
            )}

            {/* User Content - Only shown when activeTab is 'user' */}
            {activeTab === 'user' && (
                <div className="user-content">
                    {/* User Features Section */}
                    <section className="p-4 md:p-8 mt-12 rounded-xl flex flex-col items-center mb-8 mx-6 sm:mx-8 md:mx-8 lg:mx-36 xl:mx-72">
                        <div className="">

                            <div className="w-full">
                                {/* İzin Talebi Features */}

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-8 rounded-xl flex flex-col items-center mb-8"
                                >
                                    <div className="w-full">
                                        <p className="text-gray-600 mb-4">
                                            Personel kılavuzunu inceleyerek Nöbet Uygulaması'na bir adım daha yaklaşın. Hesabınızda özelliklerin nasıl çalıştığını aşağıdaki kılavuzdan detaylıca öğrenebilirsiniz.
                                            <br />
                                        </p>
                                        <ul className="space-y-2">
                                            <p className='font-bold text-xl'>İçerik</p>
                                            <li
                                                className="cursor-pointer text-blue-600 hover:underline"
                                                onClick={() => scrollToRef(izinTalepleriRef)}
                                            >
                                                1-İzin Talepleri
                                            </li>
                                            <li
                                                className="cursor-pointer text-blue-600 hover:underline"
                                                onClick={() => scrollToRef(nobetTalepleriRef)}
                                            >
                                                2-Nöbet Talepleri
                                            </li>
                                            <li
                                                className="cursor-pointer text-blue-600 hover:underline"
                                                onClick={() => scrollToRef(vardiyaTalepleriRef)}
                                            >
                                                3-Vardiya Talepleri
                                            </li>
                                            <li
                                                className="cursor-pointer text-blue-600 hover:underline"
                                                onClick={() => scrollToRef(nobetProgramiRef)}
                                            >
                                                4-Nöbet Programı
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>

                                <div ref={izinTalepleriRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">
                                                <div className=" p-2">

                                                    <svg
                                                        fill="#83A0A0"
                                                        width={"64px"}
                                                        height={"64px"}
                                                        viewBox="0 0 512 512"
                                                        id="photo_x5F_travel"
                                                        version="1.1"
                                                        xmlSpace="preserve"

                                                    >
                                                        <g>
                                                            <path d="M400.375,105.154c-1.066-6.42-4.57-12.04-9.865-15.826c-5.291-3.785-11.74-5.281-18.164-4.217L285.75,99.497l-3.889-7.804 c-2.756-5.531-7.502-9.657-13.361-11.619c-5.861-1.963-12.135-1.525-17.666,1.232l-72.204,35.985l-20.594,3.421 c-9.209,1.531-16.35,8.075-19.117,16.37l-68.955,34.366c-11.417,5.689-16.077,19.607-10.387,31.025L168.14,420.308 c2.757,5.53,7.502,9.657,13.362,11.618c2.413,0.809,4.895,1.209,7.366,1.209c3.533,0,7.044-0.818,10.298-2.441l7.078-3.527 c0.884-0.05,1.77-0.131,2.656-0.277l214.309-35.602c6.42-1.067,12.041-4.57,15.826-9.863c3.787-5.295,5.283-11.745,4.217-18.166 L400.375,105.154z M256.857,93.389c1.355-0.676,2.817-1.017,4.289-1.017c1.029,0,2.063,0.167,3.068,0.504 c2.439,0.817,4.418,2.535,5.564,4.839l2.043,4.096l-47.797,7.94L256.857,93.389z M185.789,419.125 c-2.441-0.817-4.417-2.535-5.566-4.84L71.66,196.453c-2.37-4.756-0.429-10.553,4.326-12.923l62.604-31.2l1.892,11.386 l-43.546,21.702c-8.406,4.189-11.837,14.438-7.648,22.845l77.24,154.982c1.853,3.718,4.891,6.46,8.431,8.003l5.914,35.598 c0.796,4.789,2.95,9.132,6.189,12.602C186.634,419.365,186.208,419.266,185.789,419.125z M428.055,373.571 c-1.689,2.36-4.195,3.923-7.059,4.398l-174.054,28.914l-40.255,6.687c-1.161,0.193-2.323,0.188-3.454,0.014 c-1.656-0.257-3.243-0.891-4.646-1.893c-2.361-1.688-3.923-4.194-4.398-7.059l-5.553-33.427l-2.306-13.882l-30.896-185.978 l-2.314-13.93l-1.809-10.887c-0.028-0.171-0.039-0.341-0.059-0.512c-0.675-5.719,3.257-11.034,8.996-11.987l22.586-3.752 l37.107-6.164l46.87-7.787l11.309-1.878l13.93-2.313l82.508-13.707c0.604-0.1,1.205-0.15,1.805-0.15 c2.246,0,4.432,0.697,6.295,2.029c2.361,1.688,3.924,4.195,4.398,7.059l42.877,258.104 C430.41,368.334,429.742,371.21,428.055,373.571z" />
                                                            <path d="M408.422,312.098c0-0.007,0-0.014-0.002-0.02l-6.762-40.699c0-0.001,0-0.002,0-0.002L378,128.959 c-0.779-4.691-3.34-8.8-7.209-11.567c-3.869-2.767-8.584-3.858-13.277-3.081l-176.163,29.266 c-4.692,0.779-8.799,3.339-11.566,7.209c-2.767,3.869-3.861,8.583-3.082,13.275l21.483,129.32c0,0.001,0,0.002,0,0.003 l2.053,12.358l6.969,41.951c1.446,8.703,9.01,14.891,17.557,14.891c0.965,0,1.945-0.079,2.928-0.242l95.498-15.865l64.553-10.724 c0.004-0.001,0.008-0.002,0.01-0.002l15.588-2.59l0,0l0.516-0.086c9.686-1.609,16.256-10.797,14.646-20.483L408.422,312.098z M391.131,319.843l-12.51,2.078l-62.396-53.023l4.23-7.573l10.338-4.053l9.193,3.142c2.141,0.731,4.5,0.341,6.295-1.034 l7.797-5.986l10.418,0.42l24.227,22.085l6.381,38.404C395.531,316.923,393.752,319.406,391.131,319.843z M328.117,330.312 l-36.57,6.075l-14.359,2.386l32.324-57.862l51.672,43.908L328.117,330.312z M203.83,305.168l-2.325-13.996 c-0.06-0.359,0.032-0.732,0.25-1.023l15.699-20.897l9.203,3.137c0.71,0.242,1.445,0.36,2.177,0.36c1.428,0,2.841-0.453,4.02-1.326 l7.466-5.533l9.285,2.8c2.045,0.618,4.261,0.229,5.975-1.044l7.463-5.545l9.586,2.792c2.16,0.626,4.498,0.138,6.227-1.311 l5.166-4.335L299.027,272l-38.885,69.604l-43.397,7.209c-3.04,0.501-5.924-1.557-6.429-4.596L203.83,305.168z M180.766,158.637 c0.669-0.936,1.663-1.555,2.797-1.743l176.164-29.265c0.238-0.039,0.479-0.06,0.717-0.06c0.889,0,1.756,0.276,2.494,0.805 c0.938,0.668,1.555,1.662,1.744,2.798l20.465,123.197l-44.244-40.335c-0.082-0.075-0.172-0.139-0.258-0.209 c-0.098-0.081-0.193-0.165-0.295-0.24c-0.104-0.075-0.211-0.142-0.318-0.21c-0.107-0.07-0.213-0.145-0.324-0.208 c-0.104-0.059-0.211-0.107-0.316-0.161c-0.121-0.062-0.24-0.126-0.365-0.18c-0.098-0.042-0.197-0.074-0.295-0.11 c-0.141-0.053-0.279-0.108-0.422-0.151c-0.086-0.026-0.174-0.043-0.26-0.065c-0.158-0.042-0.316-0.085-0.479-0.114 c-0.078-0.014-0.158-0.02-0.238-0.031c-0.17-0.025-0.342-0.051-0.514-0.063c-0.084-0.006-0.168-0.003-0.25-0.006 c-0.17-0.005-0.338-0.012-0.508-0.004c-0.115,0.004-0.229,0.021-0.344,0.032c-0.129,0.013-0.256,0.018-0.385,0.037 c-0.01,0.001-0.02,0.005-0.029,0.006c-0.01,0.002-0.02,0.002-0.031,0.003c-0.127,0.021-0.25,0.056-0.375,0.084 c-0.115,0.025-0.234,0.045-0.35,0.077c-0.129,0.036-0.256,0.085-0.383,0.129c-0.113,0.039-0.229,0.071-0.34,0.116 c-0.129,0.053-0.252,0.117-0.377,0.178c-0.104,0.049-0.209,0.092-0.309,0.146c-0.133,0.072-0.258,0.156-0.385,0.237 c-0.086,0.054-0.176,0.102-0.258,0.16c-0.143,0.098-0.273,0.208-0.406,0.316c-0.063,0.051-0.129,0.096-0.189,0.148 c-0.148,0.131-0.287,0.272-0.424,0.416c-0.037,0.04-0.08,0.075-0.117,0.117c-0.146,0.161-0.283,0.333-0.414,0.51 c-0.021,0.029-0.047,0.055-0.068,0.084c-0.15,0.209-0.289,0.426-0.416,0.653l-24.723,44.256l-54.481-46.296 c-1.415-1.2-3.261-1.773-5.104-1.563c-0.006,0.001-0.013-0.001-0.019,0c-0.368,0.041-0.723,0.134-1.075,0.233 c-0.089,0.025-0.184,0.03-0.271,0.059c-0.295,0.097-0.569,0.24-0.846,0.376c-0.132,0.063-0.276,0.106-0.404,0.179 c-0.26,0.148-0.492,0.34-0.729,0.521c-0.125,0.096-0.264,0.17-0.383,0.273c-0.283,0.25-0.532,0.539-0.772,0.836 c-0.051,0.063-0.115,0.111-0.164,0.176l-0.001,0.002c-0.001,0.002-0.002,0.002-0.004,0.004l-0.268,0.358l-42.864,57.056 l-18.333-110.354C179.832,160.713,180.097,159.572,180.766,158.637z" />
                                                            <path d="M333.717,191.869c1.238,0,2.494-0.102,3.756-0.312c6.02-1.001,11.291-4.285,14.842-9.25 c3.549-4.965,4.951-11.013,3.951-17.034v0.001c-2.064-12.428-13.844-20.868-26.281-18.794c-6.021,1-11.291,4.284-14.84,9.249 c-3.551,4.964-4.953,11.014-3.955,17.033C313.045,183.93,322.75,191.869,333.717,191.869z M326.125,163.582 c1.451-2.031,3.609-3.375,6.072-3.784c0.518-0.087,1.035-0.129,1.551-0.129c1.934,0,3.813,0.6,5.416,1.747 c2.031,1.451,3.375,3.608,3.783,6.07v0.002c0.41,2.463-0.164,4.938-1.615,6.968c-1.453,2.031-3.609,3.375-6.072,3.783 c-5.078,0.849-9.908-2.604-10.752-7.688C324.098,168.088,324.672,165.612,326.125,163.582z" />
                                                            <path d="M220.714,212.664c0.966,0,1.949-0.08,2.941-0.245l45.961-7.634c10.775-1.792,15.418-11.043,14.436-19.256 c-0.82-6.848-5.611-13.473-13.502-15.013c-1.5-3.818-4.32-8.852-9.459-12.471c-5.59-3.937-12.415-5.216-20.284-3.787 c-9.629,1.743-16.535,5.913-20.525,12.393c-2.73,4.435-3.497,9.03-3.529,12.702c-0.522,0.16-1.059,0.339-1.608,0.537 c-8.392,3.027-12.845,11.496-10.589,20.133C206.561,207.695,213.11,212.664,220.714,212.664z M219.727,192.588 c2.66-0.958,4.945-1.176,4.941-1.176c2.03-0.16,3.878-1.229,5.03-2.906c1.152-1.679,1.486-3.788,0.908-5.739 c-0.014-0.049-1.314-4.998,1.173-9.037c1.893-3.075,5.74-5.156,11.434-6.188c12.251-2.204,15.033,7.579,15.584,10.581 c0.584,3.513,3.783,5.966,7.34,5.609l0.355-0.029c3.223-0.23,3.99,2.047,4.156,3.43c0.166,1.39-0.033,3.801-3.242,4.334 l-45.963,7.635c0,0,0,0,0,0c-2.646,0.446-3.533-1.373-3.824-2.489C217.328,195.498,217.215,193.496,219.727,192.588z" />
                                                            <path d="M110.737,333.221l-30.108-62.579c-1.617-3.357-5.648-4.771-9.01-3.155c-3.359,1.615-4.772,5.65-3.156,9.01l30.108,62.578 c1.163,2.415,3.575,3.824,6.088,3.824c0.981,0,1.978-0.215,2.922-0.668C110.94,340.613,112.353,336.58,110.737,333.221z" />
                                                            <path d="M121.21,353.664c-1.603-3.367-5.633-4.795-8.997-3.193c-3.366,1.604-4.795,5.631-3.191,8.997l3.375,7.087 c1.157,2.43,3.576,3.85,6.099,3.85c0.973,0,1.961-0.211,2.897-0.656c3.366-1.603,4.795-5.631,3.192-8.996L121.21,353.664z" />
                                                            <path d="M425.932,178.626c0.535,3.313,3.4,5.673,6.654,5.673c0.357,0,0.721-0.029,1.086-0.089c3.68-0.595,6.182-4.061,5.584-7.741 l-2.012-12.441c-0.596-3.68-4.049-6.189-7.742-5.584c-3.68,0.594-6.18,4.061-5.584,7.741L425.932,178.626z" />
                                                            <path d="M442.211,199.516c-0.596-3.683-4.064-6.188-7.742-5.585c-3.68,0.596-6.18,4.062-5.584,7.741l12.551,77.525 c0.537,3.315,3.402,5.672,6.656,5.672c0.357,0,0.721-0.028,1.086-0.088c3.68-0.596,6.18-4.062,5.584-7.741L442.211,199.516z" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <h2 className="text-3xl font-semibold">İzin Taleplerim</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Personel anasayfanıza ilk girdiğinizde <strong className='text-blue-600'>İzin Talepleri</strong> ile karşılaşmaktasınız. Burada yöneticizeden izin talebinde bulunabilirsiniz. İzin talebinde bulunurken ilk olarak gün aralığı seçmeniz gerekmete daha sonrasında bir izin açıklaması eklemelisiniz. Böylelikle izin talebiniz başarılı bir şekilde yöneticinize iletilecektir.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_izin_al.png"
                                                    alt="Personel İzin Al"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full ">
                                            <p className="text-gray-600 mb-4">
                                                Yöneticine gönderdiğiniz izin taleplerini burada <strong className='text-green-600'>Onaylanan</strong>, <strong className='text-red-600'>Reddedilen</strong> ya da <strong className='text-yellow-600'>Beklemede</strong> şeklinde görüntüleyebilirsiniz. Eğer isterseniz beklemede olan isteklerinizi silebilirsiniz. Sağ üstte görebileceiğinz <span className='text-blue-600 p-2 bg-blue-300 rounded-full'>Kullanılan İzin</span> sizin toplamda kaç gün izin yaptığınızı göstermekte.
                                            </p>
                                        </div>

                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_izin_goruntule.png"
                                                    alt="Personel İzin Görüntüle"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>


                                        <div className="w-full ">
                                            <p className="text-gray-600 mb-4">
                                                Sağ üstte görebileceiğinz <strong className='text-blue-600'>Kullanılan İzin</strong> sizin toplamda kaç gün izin yaptığınızı göstermektedir.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Nöbet Talebi Features */}
                                <div ref={nobetTalepleriRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 pt-2 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">
                                                <svg
                                                    fill="#444B6E"
                                                    width={"64px"}
                                                    height={"64px"}
                                                    viewBox="10 10 80 80"
                                                    id="photo_x5F_travel"
                                                    version="1.1"
                                                    xmlSpace="preserve"

                                                >
                                                    <path d="M73.3,69.4c-2.3-.9-2.6-1.8-2.6-2.8A3.59,3.59,0,0,1,72.1,64a6.42,6.42,0,0,0,2.1-5c0-3.8-2.3-7-6.3-7s-6.3,3.2-6.3,7a6.78,6.78,0,0,0,2.1,5,3.59,3.59,0,0,1,1.4,2.6c0,1-.3,1.9-2.6,2.9-3.3,1.5-6.4,3.3-6.5,6.3,0,2,1.5,4.1,3.4,4.1H76.6c1.9,0,3.4-2.1,3.2-4.1C79.7,72.8,76.6,70.8,73.3,69.4Z" />
                                                    <path d="M52,75.8v-.2c.2-5.4,5.2-8.1,8.2-9.5A10.53,10.53,0,0,1,57.6,59a12.59,12.59,0,0,1,.84-4.6H50.1a1.22,1.22,0,0,1-1.2-1.2V50.9a1.22,1.22,0,0,1,1.2-1.2h12a10.58,10.58,0,0,1,11.15-.22V25.6A5.59,5.59,0,0,0,67.7,20H32.3a5.59,5.59,0,0,0-5.6,5.6V70.4A5.59,5.59,0,0,0,32.3,76H52C52,75.93,52,75.87,52,75.8ZM48.9,34.9a1.22,1.22,0,0,1,1.2-1.2H65.3a1.22,1.22,0,0,1,1.2,1.2v2.3a1.13,1.13,0,0,1-1.1,1.2H50.1a1.22,1.22,0,0,1-1.2-1.2ZM44.8,55.4a.91.91,0,0,1,0,1.2l-1.2,1.2a.91.91,0,0,1-1.2,0L39,54.4l-3.3,3.3a.91.91,0,0,1-1.2,0l-1.2-1.2a.91.91,0,0,1,0-1.2L36.6,52l-3.3-3.3a.91.91,0,0,1,0-1.2l1.2-1.2a.91.91,0,0,1,1.2,0L39,49.6l3.4-3.4a.91.91,0,0,1,1.2,0l1.2,1.2a.91.91,0,0,1,0,1.2L41.4,52Zm2.8-24.3-9,9a1.66,1.66,0,0,1-1.2.5,1.58,1.58,0,0,1-1.2-.5l-4.3-4.3a.75.75,0,0,1,0-1.2l1.2-1.2a.75.75,0,0,1,1.2,0l3.1,3.1,7.7-7.7a.75.75,0,0,1,1.2,0L47.5,30C47.8,30.4,47.8,31,47.6,31.1Z" />
                                                </svg>
                                                <h2 className="text-xl font-semibold">Nöbet Taleplerim</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Personel anasayfanızda bulunan <strong className='text-blue-600'>Özel Nöbet Talebi Oluştur</strong> kısmındaki ilgili alanları seçerek yöneticinize nöbet talebi isteği yollamanıza yarar. İlk olarak yöneticizin oluşturduğu departmanlardan 1 tanesini seçmelisiniz. Daha sonrasında çlışmak istediğiniz günü ve vardiyayı belirtmeniz gerekmektedir. Son olarak nöbet talebiniz için bir neden ya da not girerek yöneticinize talebi yollayablirsiniz.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_nobet_al.png"
                                                    alt="Personel Nöbet Al"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full ">
                                            <p className="text-gray-600 mb-4">
                                                Yöneticinize gönderdiğiniz nöbet taleplerini burada <strong className='text-green-600'>Onaylanan</strong>, <strong className='text-red-600'>Reddedilen</strong> ya da <strong className='text-yellow-600'>Beklemede</strong> şeklinde görüntüleyebilirsiniz. Eğer isterseniz beklemede olan isteklerinizi silebilirsiniz.
                                            </p>
                                        </div>

                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_nobet_goruntule.png"
                                                    alt="Personel Nöbet Görüntüle"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                {/* Vardiya Taleplerim Features */}
                                <div ref={vardiyaTalepleriRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white p-8 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">
                                                <FaExchangeAlt className="text-[#A3BAC3] text-4xl mr-4" />
                                                <h2 className="text-xl font-semibold">Vardiya Taleplerim</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                <strong className='text-blue-600'>Vardiya Talebi Oluştur</strong> ile vardiyanızı değiştirebilirsiniz. Bunun için talep ettiğiniz vardiyayı seçerek ve nedenini açıklayarak yönetinize istekte bulunabilirsiniz. Yöneticiniz vardiya değişim talebinizi onaylarsa bir dahaki nöbet atamalarında otomatik olarak istediğiniz vardiyada çalışacaksınızdır.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_vardiya_al.png"
                                                    alt="Personel Vardiya Al"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full ">
                                            <p className="text-gray-600 mb-4">
                                                Yöneticine gönderdiğiniz vardiya taleplerini burada <strong className='text-green-600'>Onaylanan</strong>, <strong className='text-red-600'>Reddedilen</strong> ya da <strong className='text-yellow-600'>Beklemede</strong> şeklinde görüntüleyebilirsiniz. Eğer isterseniz beklemede olan isteklerinizi silebilirsiniz. Sağ üstte görebileceiğinz <strong className='text-blue-600'>"Kullanılan İzin"</strong> sizin toplamda kaç gün izin yaptığınızı göstermekte.
                                            </p>
                                        </div>

                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_vardiya_goruntule.png"
                                                    alt="Personel Vardiya Görüntüleme"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>


                                {/* Nöbet Listeleri Features */}
                                <div ref={nobetProgramiRef}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white px-8 pt-4 rounded-xl flex flex-col items-center mb-8"
                                    >


                                        {/* Content Container */}
                                        <div className="w-full ">
                                            <div className="flex justify-center items-center mb-4">
                                                <FaCalendarAlt className="text-[#1C3144] text-4xl mr-4" />
                                                <h2 className="text-xl font-semibold">Nöbet Programı</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                <strong className='text-blue-600'>Nöbet Bilgileri</strong> kısmında ilk önce görüntülemek istediğiniz takvimin adını seçmeniz gerekmekte. Daha sonrasında ise hafta hafta şeklinde çalışacağınız departmanları, günleri ve vardiyaları görebilirsiniz.
                                            </p>
                                        </div>
                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_nobet_programi.png"
                                                    alt="Personel Nöbet Programı"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full ">
                                            <p className="text-gray-600 mb-4">
                                                <strong className='text-blue-600'>Nöbet Takvimi</strong> alanında istediğiniz takvimi seçerek görüntüleyebilirsiniz. Bu takvimde bütün personelin çalışacağı günü, departmanı ve vardiyayı herkes görebilmektedir. Departman ya da vardiya seçerek daha fazla özelleştirebilirsiniz.
                                            </p>
                                        </div>

                                        {/* Image Container - Full width and centered */}
                                        <div className="w-full mb-8 flex justify-center">
                                            <div className="w-full  overflow-hidden rounded-lg">
                                                <Image
                                                    src="/personel_nobet_takvimi.png"
                                                    alt="Personel Nöbet Takvimi"
                                                    width={1600}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                    layout=""
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div >
            )
            }

            {/* CTA Section */}
            <section className="relative mih-h-screen py-16 text-white bg-cover bg-center bg-no-repeat bg-[url('/nasil_kullanilir_destek.jpg')]">
                {/* Opacity efekti için overlay */}
                <div className="absolute inset-0 bg-blue-500 opacity-70"></div>

                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Hala Sorularınız Mı Var?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full 
          text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 
          transition-all duration-300 shadow-lg"
                        >
                            İletişime Geçin
                        </Link>
                    </div>
                </div>
            </section>

        </div >
    );
}