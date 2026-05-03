"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/loaders/baseApi";
import { useNotification } from '@/app/components/NotificationContext';
import Loading from "@/app/loading";
import Link from "next/link";
import Sidebar from "../../../components/sidebar_left";
import MobileBottomBar from "../../../components/mobile_bottom_bar";


export default function UserProfilePage() {
    const { showSuccess, showError, showWarning } = useNotification(); // Bildirim fonksiyonları
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        gender: "",
        phoneNumber: "",
        email: "",
        adminID: "",
        oldPassword: "",
        newPassword: "",
        rePassword: "", // Yeni şifre tekrarı için alan eklendi
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetchUserData fonksiyonunu bileşenin içinde tanımlayın
    const fetchUserData = async () => {
        try {
            const [userRes, calendarRes] = await Promise.all([
                api.get("api/userData", { withCredentials: true }),
            ]);

            // API yanıtının başarılı olup olmadığını kontrol et
            if (userRes.status === 201 && userRes.data.success === "true") {
                setUserData(userRes.data.data.userData); // userData'yı doğru şekilde ayarla
                setFormData({
                    firstname: userRes.data.data.userData.firstname,
                    lastname: userRes.data.data.userData.lastname,
                    username: userRes.data.data.userData.username,
                    gender: userRes.data.data.userData.gender,
                    phoneNumber: userRes.data.data.userData.phoneNumber,
                    email: userRes.data.data.userData.email,
                    adminID: userRes.data.data.userData.adminID,
                    oldPassword: "", // Eski şifre alanı boş bırakılır
                    newPassword: "", // Yeni şifre alanı boş bırakılır
                    rePassword: "", // Yeni şifre tekrarı alanı boş bırakılır
                });
            } else {
                showError("Kullanıcı verileri alınamadı.");
            }

            setLoading(false);
        } catch (error) {
            showError("Kullanıcı verileri yüklenirken hata oluştu.");
            setLoading(false);
        }
    };

    // useEffect içinde fetchUserData'yı çağırın
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdate = async (field) => {
        try {
            let endpoint = "";
            let payload = {};

            switch (field) {
                case "firstname":
                    endpoint = "/api/updateFirstname";
                    payload = { firstname: formData.firstname };
                    break;
                case "lastname":
                    endpoint = "/api/updateLastname";
                    payload = { lastname: formData.lastname };
                    break;
                case "username":
                    endpoint = "/api/updateUsername";
                    payload = { username: formData.username };
                    break;
                case "gender":
                    endpoint = "/api/updateGender";
                    payload = { gender: formData.gender };
                    break;
                case "phoneNumber":
                    endpoint = "/api/updatePhoneNumber";
                    payload = { phoneNumber: formData.phoneNumber };
                    break;
                case "email":
                    endpoint = "/api/updateEmail";
                    payload = { email: formData.email };
                    break;
                case "adminID":
                    endpoint = "/api/updateAdminID";
                    payload = { adminID: formData.adminID };
                    break;
                case "password":
                    endpoint = "/api/updatePassword";
                    // Yeni şifre ve tekrarının eşleştiğini kontrol et
                    if (formData.newPassword !== formData.rePassword) {
                        showError("Yeni şifre ve tekrarı eşleşmiyor.");
                        return;
                    }
                    // rePassword alanının boş olmadığını kontrol et
                    if (!formData.rePassword) {
                        showError("Yeni şifre tekrarı alanı zorunludur.");
                        return;
                    }
                    payload = {
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword,
                        rePassword: formData.rePassword, // rePassword alanını da gönder
                    };
                    break;
                default:
                    break;
            }

            const response = await api.put(endpoint, payload, { withCredentials: true });
            if (response.status === 200 && response.data.success === true) {
                showSuccess(`${field} başarıyla güncellendi!`);

                // Güncelleme başarılı olduğunda yeni verileri çek
                await fetchUserData();

                // Şifre güncellendikten sonra alanları temizle
                if (field === "password") {
                    setFormData({
                        ...formData,
                        oldPassword: "",
                        newPassword: "",
                        rePassword: "",
                    });
                }
            } else {
                showError(`${field} güncellenirken bir hata oluştu.`);
            }
        } catch (error) {
            showError(`${field} güncellenirken hata oluştu.`);
        }
    };

    if (loading) {
        return <Loading />; // return eklenmeli
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!userData) {
        return <div className="text-center text-red-600">Kullanıcı verileri yüklenemedi.</div>;
    }
    return (

        <div className="bg-blue-300">
            <Sidebar />
            <main className="text-black flex-1 xl:ml-[40vh] min-h-screen p-2 sm:p-10 pb-24 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                <h1 className="text-4xl font-bold mb-8">Kullanıcı Profili</h1>
                <div className="bg-white rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Kullanıcı Bilgileri</h2>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editMode ? "Düzenlemeyi Bitir" : "Düzenle"}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {editMode ? (
                            <>
                                {['firstname', 'lastname', 'username', 'phoneNumber', 'email', 'adminID'].map((field) => (
                                    <div key={field} className="flex flex-col space-y-1">
                                        <label className="text-gray-700 text-lg font-medium">
                                            {field === 'firstname' && 'İsim'}
                                            {field === 'lastname' && 'Soyisim'}
                                            {field === 'username' && 'Kullanıcı Adı'}
                                            {field === 'phoneNumber' && 'Telefon Numarası'}
                                            {field === 'email' && 'E-posta'}
                                            {field === 'adminID' && 'Admin ID'}
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder={`Enter ${field}`}
                                        />
                                        <button
                                            onClick={() => handleUpdate(field)}
                                            className="mt-2 bg-[#54a8fd] text-white font-medium py-2 rounded-lg hover:bg-[#1B89F7] transition"
                                        >
                                            Güncelle
                                        </button>
                                    </div>
                                ))}
                                {/* Şifre güncelleme alanı */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-gray-700 text-lg font-medium">Eski Şifre</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Eski Şifre"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-gray-700 text-lg font-medium">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Yeni Şifre"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-gray-700 text-lg font-medium">Yeni Şifre Tekrar</label>
                                    <input
                                        type="password"
                                        name="rePassword"
                                        value={formData.rePassword}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Yeni Şifre Tekrar"
                                    />
                                    <button
                                        onClick={() => handleUpdate("password")}
                                        className="mt-2 bg-[#54a8fd] text-white font-medium py-2 rounded-lg hover:bg-[#1B89F7] transition"
                                    >
                                        Şifreyi Güncelle
                                    </button>
                                </div>
                                {/* Cinsiyet için select elementi */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-gray-700 text-lg font-medium">Cinsiyet</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="">Cinsiyet Seçiniz</option>
                                        <option value="female">Kadın (Female)</option>
                                        <option value="male">Erkek (Male)</option>
                                    </select>
                                    <button
                                        onClick={() => handleUpdate("gender")}
                                        className="mt-2 bg-[#54a8fd] text-white font-medium py-2 rounded-lg hover:bg-[#1B89F7] transition"
                                    >
                                        Güncelle
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>İsim:</strong> {userData.firstname}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Soyisim:</strong> {userData.lastname}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Kullanıcı Adı:</strong> {userData.username}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Cinsiyet:</strong> {userData.gender === "female" ? "Kadın" : "Erkek"}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Telefon Numarası:</strong> {userData.phoneNumber}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>E-posta:</strong> {userData.email}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Admin ID:</strong> {userData.adminID}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Oluşturulma Tarihi:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 text-lg"><strong>Son Güncelleme Tarihi:</strong> {new Date(userData.updated_at).toLocaleDateString()}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <MobileBottomBar />

        </div >
    );
}