"use client";

import { useState, useEffect } from "react";
import { useNotification } from '@/app/components/NotificationContext';
import api from "@/app/loaders/baseApi";

export default function Payment() {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvc: "",
    amount: "",
  });

  const [cardInfo, setCardInfo] = useState({
    brand: '',
    bank: ''
  });
  // payment.js dosyanızın başına bu veritabanını ekleyin
  const BIN_DATABASE = [
    { bin: '4', brand: 'Visa', bank: 'Visa' },
    { bin: '5', brand: 'Mastercard', bank: 'Mastercard' },
    { bin: '34', brand: 'American Express', bank: 'American Express' },
    { bin: '37', brand: 'American Express', bank: 'American Express' },
    { bin: '62', brand: 'UnionPay', bank: 'UnionPay' },
    // Türk bankaları için örnek BIN'ler
    { bin: '453144', brand: 'Visa', bank: 'Yapı Kredi' },
    { bin: '454671', brand: 'Visa', bank: 'Akbank' },
    { bin: '415565', brand: 'Visa', bank: 'Garanti BBVA' },
    { bin: '552645', brand: 'Mastercard', bank: 'İş Bankası' },
    { bin: '517041', brand: 'Mastercard', bank: 'Halkbank' },
    // Daha fazla BIN ekleyebilirsiniz
  ];

  async function getBankFromBin(bin) {
    try {
      const response = await fetch(`https://lookup.binlist.net/${bin}`, {
        headers: {
          'Accept-Version': '3'
        }
      });
      if (!response.ok) throw new Error('BIN bulunamadı');
      return await response.json();
    } catch (error) {
      console.error('BIN lookup error:', error);
      return null;
    }
  }

  const getCardInfo = (cardNumber) => {
    if (!cardNumber) return { brand: '', bank: '' };

    const cleanNumber = cardNumber.replace(/\s/g, '');

    // Yerel veritabanında arama
    const matchedBin = [...BIN_DATABASE]
      .sort((a, b) => b.bin.length - a.bin.length) // En uzun BIN'ler önce gelsin
      .find(binData => cleanNumber.startsWith(binData.bin));

    return matchedBin || { brand: '', bank: '' };
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const priceFromQuery = queryParams.get("price");
    if (priceFromQuery) {
      setFormData((prev) => ({
        ...prev,
        amount: priceFromQuery,
      }));
    }

    // Popup'dan gelen mesajları dinle
    window.addEventListener('message', handlePopupMessage);

    return () => {
      window.removeEventListener('message', handlePopupMessage);
    };
  }, []);


  const formatCardDisplay = (number) => {
    if (!number) return "•••• •••• •••• ••••";
    const cleanNumber = number.replace(/\s/g, "");
    const formatted = cleanNumber.padEnd(16, "•").match(/.{1,4}/g);
    return formatted ? formatted.join(" ") : "•••• •••• •••• ••••";
  };

  const formatCardHolder = (name) => {
    return name ? name.toUpperCase() : "AD SOYAD";
  };

  const formatExpiryDate = (date) => {
    return date || "AA/YY";
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      value = value.substring(0, 19);
      
      const cleanNumber = value.replace(/\s/g, '');
      if (cleanNumber.length >= 4) {
        const info = getCardInfo(cleanNumber);
        setCardInfo(info);
      } else {
        setCardInfo({ brand: '', bank: '' });
      }
    }

    if (name === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      value = value.substring(0, 5);
    }

    if (name === "cvc") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }

    if (name === "cardHolder") {
      value = value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePopupMessage = async (event) => {
    // Sipay'den gelen mesajları kontrol et
    if (event.origin.includes('sipay.com.tr')) {
      const data = event.data;

      try {
        if (data.status === 'success') {
          const response = await api.post('/api/return_url', {
            payment_id: data.payment_id,
            status: 'success'
          });

          if (response.data.success) {
            showSuccess("Ödeme başarıyla tamamlandı!");
            // Başarılı ödeme sonrası yönlendirme yapabilirsin
            // router.push('/success');
          }
        } else {
          const response = await api.post('/api/cancel_url', {
            payment_id: data.payment_id,
            status: 'failed'
          });

          showError("Ödeme işlemi iptal edildi.");
          // İptal sonrası yönlendirme yapabilirsin
          // router.push('/cancel');
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        showError("Ödeme durumu kontrol edilirken bir hata oluştu.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [expiryMonth, expiryYear] = formData.expiryDate.split('/');

    const paymentData = {
      card_holder_name: formData.cardHolder,
      card_number: formData.cardNumber.replace(/\s/g, ''),
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      cvc: formData.cvc,
      amount: parseFloat(formData.amount),
      currency: "TRY",
      installment: 1,
      invoiceId: "INV123456789",
    };

    try {
      const response = await api.post('/api/makePayment', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const html = response.data;

      // Popup'ı aç
      const popup = window.open('', '3DSecure', 'width=500,height=600,scrollbars=yes');
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        showError('Lütfen tarayıcınızdaki pop-up engelleyiciyi devre dışı bırakın ve tekrar deneyin.');
        return;
      }

      // HTML'i popup'a yaz
      popup.document.open();
      popup.document.write(html);
      popup.document.close();

      // Popup'ın kapanmasını kontrol et
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // Popup kapandığında ödeme durumunu kontrol et
          checkPaymentStatus(paymentData.invoiceId);
        }
      }, 1000);

    } catch (error) {
      showError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error('Payment error:', error);
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await api.get(`/api/checkPaymentStatus?payment_id=${paymentId}`);
      const result = response.data;

      if (response.status === 200) {
        if (result.success) {
          showSuccess("Ödeme başarılı!");
        } else {
          showError("Ödeme işlemi başarısız oldu.");
        }
      } else {
        showError("Ödeme durumu kontrol edilemedi.");
      }
    } catch (error) {
      showError("Bir hata oluştu. Lütfen tekrar deneyin.");

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-48 px-4 sm:px-6 lg:px-8 pt-36 text-black">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="relative w-full h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl overflow-hidden">
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2">
              {cardInfo.bank && (
                <div className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                  {cardInfo.bank}
                </div>
              )}
            </div>
            <svg className="w-12 h-12 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 4H2a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V6a2 2 0 00-2-2zm0 13.5H2a.5.5 0 01-.5-.5V9h21v8a.5.5 0 01-.5.5zm.5-10.5h-21V6a.5.5 0 01.5-.5h20a.5.5 0 01.5.5v1z" />
            </svg>
          </div>
          <div className="absolute top-12 left-4">
            <div className="w-12 h-10 bg-yellow-400/80 rounded-lg"></div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xl tracking-widest mb-4 font-mono">
              {formatCardDisplay(formData.cardNumber)}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80 mb-1">Kart Sahibi</div>
                <div className="font-medium tracking-wider">
                  {formatCardHolder(formData.cardHolder)}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-80 mb-1">Son Kullanma</div>
                <div className="font-medium tracking-wider">
                  {formatExpiryDate(formData.expiryDate)}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-gradient-to-t from-black/50"></div>
        </div>
        <div className="py-8 px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Yap</h1>
            <p className="text-gray-600">Güvenli ödeme işlemi</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Kart Numarası
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                Kart Sahibi
              </label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="Ad Soyad"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Son Kullanma Tarihi
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="AA/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Tutar (TL)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="1"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
            >
              Ödemeyi Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
