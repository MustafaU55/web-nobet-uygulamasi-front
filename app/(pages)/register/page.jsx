"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import api from "@/app/loaders/baseApi";
import { useNotification } from '@/app/components/NotificationContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    phoneNumber: "+90",
    email: "",
    gender: "male",
    password: "",
    confirmPassword: "",
    adminID: "",
    role: "user",
  });

  const [displayPhoneNumber, setDisplayPhoneNumber] = useState("+90 "); // Display value with +90 prefix
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [adminIDTouched, setAdminIDTouched] = useState(false);
  const router = useRouter();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Sadece rakamları al
      const digitsOnly = value.replace(/\D/g, '');

      // +90'dan sonraki kısmı al (eğer kullanıcı +90'ı silmeye çalışırsa)
      const withoutPrefix = digitsOnly.startsWith('90') ? digitsOnly.substring(2) : digitsOnly;

      // Formatlı görüntü için
      let formatted = "";
      if (withoutPrefix.length > 0) formatted += withoutPrefix.substring(0, 3);
      if (withoutPrefix.length > 3) formatted += " " + withoutPrefix.substring(3, 6);
      if (withoutPrefix.length > 6) formatted += " " + withoutPrefix.substring(6, 8);
      if (withoutPrefix.length > 8) formatted += " " + withoutPrefix.substring(8, 10);

      // Görüntülenen değer (+90 ile birlikte)
      setDisplayPhoneNumber("+90 " + formatted);

      // Form verisinde +90 ile birlikte sakla
      setFormData({
        ...formData,
        phoneNumber: "+90" + withoutPrefix,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // AdminID için blur handler
  const handleAdminIDBlur = () => {
    setAdminIDTouched(true);
    if (formData.adminID.length > 0 && formData.adminID.length < 6) {
      showWarning("adminID en az 6 karakter olmalıdır");
    }
  };

  const validateFirstStep = () => {
    const { firstname, lastname, username, email, password, confirmPassword } = formData;

    if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Geçersiz e-posta formatı.");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateFirstStep()) {
      setStep(2);
      setError("");
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.adminID || !formData.role) {
      setError("Lütfen rol ve admin ID bilgilerini doldurun.");
      return;
    }

    if (formData.adminID.length < 6) {
      showWarning("adminID en az 6 karakter olmalıdır");
      setAdminIDTouched(true);
      return;
    }

    try {
      const response = await api.post("/api/register", formData);
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      if (err.response) {
        const statusCode = err.response.status;
        const errorMessage = err.response.data.message || "Kayıt sırasında bir hata oluştu.";

        if (statusCode === 404) {
          showError(`${errorMessage}`);
        } else {
          setError(errorMessage);
        }
      } else {
        setError("İstek sırasında bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-24 pt-32 flex justify-center items-center text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Kayıt Ol</h1>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              {/* İlk Aşama: Temel Bilgiler */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="firstname">
                  İsim:
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="lastname">
                  Soyisim:
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="username">
                  Kullanıcı Adı:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="gender">
                  Cinsiyet:
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
                  Telefon Numarası:
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={displayPhoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                  Şifre:
                  <span className="ml-1 relative group">
                    <span className="text-gray-500 cursor-pointer">❓</span>
                    <span className="absolute left-0 bottom-full mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Şifre en az 8 karakter içermelidir.
                    </span>
                  </span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  style={{ top: "70%", transform: "translateY(-50%)" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Şifreyi Tekrar Girin:
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  style={{ top: "70%", transform: "translateY(-50%)" }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* İleri Butonu */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 flex items-center"
                >
                  İleri <FaArrowRight className="ml-2" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* İkinci Aşama: Rol ve Admin ID */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-2" htmlFor="adminID">
                  Admin ID:
                  <span className="ml-1 relative group">
                    <span className="text-gray-500 cursor-pointer">❓</span>
                    <span className="absolute left-0 bottom-full mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Yönetici iseniz bir adminID oluşturunuz. adminID en az 6 karakter olmalıdır. Personel iseniz Yöneticinizin size ilettiği adminID'yi giriniz.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  id="adminID"
                  name="adminID"
                  value={formData.adminID}
                  onChange={handleChange}
                  onBlur={handleAdminIDBlur}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {adminIDTouched && formData.adminID.length > 0 && formData.adminID.length < 6 && (
                  <div className="text-red-600 text-xs mt-1">adminID en az 6 karakter olmalıdır</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="role">
                  Rol:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Personel</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>

              {/* Geri ve Kayıt Ol Butonları */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Geri
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-semibold rounded-full ${formData.role === "admin"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-purple-500 hover:bg-purple-600"
                    }`}
                >
                  Kayıt Ol
                </button>
              </div>
            </>
          )}

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default Register;