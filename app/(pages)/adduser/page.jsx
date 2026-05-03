'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNotification } from '@/app/components/NotificationContext';
import api from "@/app/loaders/baseApi";
import Link from 'next/link';
import Sidebar from '../../components/sidebar_left';
import MobileBottomBar from '../../components/mobile_bottom_bar';

export default function AddUserPage() {
    const { showSuccess, showError, showWarning, showInfo } = useNotification();
    const router = useRouter();
    const [adminId, setAdminId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        gender: 'male',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });

    useEffect(() => {
        const fetchAdminId = async () => {
            try {
                const response = await api.get('/api/userData', { withCredentials: true });

                if (response.data.success) {
                    const adminID = response.data.data.userData.adminID;
                    setAdminId(adminID);
                } else {
                    showError('Admin kimliği alınamadı!');
                }
            } catch (error) {
                showError('Admin kimliği alınırken bir hata oluştu!');
            }
        };
        fetchAdminId();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Zorunlu alanlar için validasyon
        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setError("Lütfen zorunlu alanları doldurun.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        if (formData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
            setError("Telefon numarası geçerli formatta olmalıdır.");
            return;
        }

        if (formData.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
            setError("Geçersiz e-posta formatı.");
            return;
        }

        // Backend'e gönderilecek veriyi hazırla (boş alanlar için default değerler ata)
        const submissionData = {
            firstname: formData.firstname || 'Personelİsim',
            lastname: formData.lastname || 'PersonelSoyisim',
            username: formData.username,
            gender: formData.gender || 'male',
            phoneNumber: formData.phoneNumber || '+905555555555',
            email: formData.email || 'personel@example.com',
            password: formData.password,
            adminID: adminId,
            role: 'user'
        };

        try {
            const response = await api.post("/api/assingUser", submissionData);
            setSuccess("Personel başarıyla atandı!");
            setFormData({
                firstname: '',
                lastname: '',
                username: '',
                gender: 'male',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'user',
            });
        } catch (err) {
            if (err.response) {
                const statusCode = err.response.status;
                const errorMessage = err.response.data.message || "Bir hata oluştu.";

                if (statusCode === 404) {
                    showError(`${errorMessage}`);
                } else {
                    showError(`Hata (${statusCode}): ${errorMessage}`);
                }
            } else {
                showError("İstek sırasında bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-blue-300">
            <Sidebar />
            <div className="xl:ml-[40vh] flex justify-center items-center min-h-screen pt-12 pb-32 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 text-black">
                <div className="bg-white p-8 rounded-lg w-full max-w-md">
                    <h1 className="text-3xl font-semibold text-center mb-6">Personel Ekle <span className="ml-1 relative group">
                                            <span className="text-gray-500 cursor-pointer">❓</span>
                                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                Eğer opsiyonel alanları boş bırakırsanız otomatik olarak varsayılan değerler atanmaktadır.
                                            </span>
                                        </span></h1>
                    <form onSubmit={handleSubmit}>
                        {/* Firstname */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="firstname">
                                İsim: <span className="text-gray-500">(Opsiyonel)</span>
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder='Personelİsim'
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Lastname */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="lastname">
                                Soyisim: <span className="text-gray-500">(Opsiyonel)</span>
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                placeholder='PersonelSoysim'
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="username">Kullanıcı Adı:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="gender">
                                Cinsiyet: <span className="text-gray-500">(Opsiyonel)</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="male">Erkek</option>
                                <option value="female">Kadın</option>
                            </select>
                        </div>
                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">
                                Email: <span className="text-gray-500">(Opsiyonel)</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='personel@example.com'
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Phone Number (Optional) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
                                Telefon Numarası: <span className="text-gray-500">(Opsiyonel)</span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+90 555 555 55 55"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Şifre:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 cursor-pointer">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">Şifreyi Tekrar Girin:</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-10 cursor-pointer">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Admin ID (Auto-filled) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="adminID">Admin ID:</label>
                            <input
                                type="text"
                                id="adminID"
                                name="adminID"
                                value={adminId}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

                        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Kayıt Ol</button>
                    </form>
                </div>
            </div>
            {/* Sabit Alt Menü (Sadece Mobil) */}
            <MobileBottomBar />
        </div>
    );
}