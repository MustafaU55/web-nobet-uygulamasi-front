'use client';
import { useState } from 'react';
import emailjs from 'emailjs-com';

function İletişim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    // EmailJS API kullanımı
    emailjs
      .send(
        'service_f4v9ako', // EmailJS servis ID
        'template_6sj6kkb', // EmailJS şablon ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        'stltpe_szD0x0CPWa' // EmailJS kullanıcı ID
      )
      .then(() => {
        setSuccessMessage('Mesajınız başarıyla gönderildi. Teşekkür ederiz!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      })
      .catch((error) => {
        setErrorMessage('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-48 pt-36 text-black">
      <div className="max-w-6xl mx-auto px-4 ">
        <title>İletişim - NöbetX</title>
        <meta
          name="description"
          content="NöbetX ekibine hızlıca ulaşarak iş planlamanız ve takvim çözümleriniz için profesyonel destek alabilirsiniz. Daha fazlası NöbetX.com'da."
        />
        {/* Favicon (Site logosu) */}
        <link rel="icon" href="/logoj.png" />

        {/* Header */}
        <div className="text-center mb-16 ">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız için bize ulaşın. En kısa sürede size dönüş yapacağız.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* İletişim Bilgileri */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl ">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">İletişim Bilgileri</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telefon</h3>
                    <p className="text-gray-600">+90 (850) 309 55 43</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">E-posta</h3>
                    <p className="text-gray-600">info@nobetx.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Adres</h3>
                    <p className="text-gray-600">Samsun Teknopark, Samsun</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="bg-white p-8 rounded-2xl ">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Konum</h2>
              <div className="w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.593675177369!2d36.177023676438786!3d41.36118469761945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40887f005ed7eb6f%3A0xeac58a07a907878b!2sSamsun%20Teknopark!5e0!3m2!1str!2str!4v1736779681386!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

           {/* İletişim Formu */}
           <div className="bg-white p-8 rounded-2xl ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bize Ulaşın</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>

            {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
            {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default İletişim;