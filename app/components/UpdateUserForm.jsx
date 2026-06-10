"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/components/NotificationContext"; // Bildirim bağlamı
import api from "@/app/loaders/baseApi"; // Axios instance'ı

export default function UpdateUserForm({ user }) {
    const router = useRouter();
    const { showSuccess, showError, showWarning } = useNotification();
    const [formData, setFormData] = useState({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fieldNames = {
        firstname: "İsim",
        lastname: "Soyisim",
        username: "Kullanıcı Adı",
        email: "E-posta",
        phoneNumber: "Telefon"
    };

    const updateField = async (field, value, endpoint) => {
        try {
            setLoading(true);
            const response = await api.post(endpoint, { [field]: value }, { withCredentials: true });

            if (response.status === 200) {
                showSuccess(`${fieldNames[field]} başarıyla güncellendi!`);
                return true;
            } else {
                showError(response.data.error || "Güncelleme sırasında bir hata oluştu!");
                return false;
            }
        } catch (error) {
            showError(error.response?.data?.error || "Bir hata oluştu!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updated = false;

        const fieldsToUpdate = [
            { field: "firstname", value: formData.firstname },
            { field: "lastname", value: formData.lastname },
            { field: "username", value: formData.username },
            { field: "email", value: formData.email },
            { field: "phoneNumber", value: formData.phoneNumber },
        ];

        for (const { field, value } of fieldsToUpdate) {
            if (value !== user[field]) {
                const success = await updateField(field, value, `/api/update${field.charAt(0).toUpperCase() + field.slice(1)}`);
                if (success) {
                    updated = true;
                }
            }
        }

        showWarning("Bilgiler aktarılıyor...");
        if (updated) {
            setIsEditing(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    useEffect(() => {
        const handleUserDataUpdated = () => {
            router.replace(router.asPath);
        };

        window.addEventListener("userDataUpdated", handleUserDataUpdated);
        return () => {
            window.removeEventListener("userDataUpdated", handleUserDataUpdated);
        };
    }, []);

    return (
        <div className='relative'>
            <div className="mt-4 space-y-4">
                <div className="border p-4 rounded-lg">
                    <div className="space-y-2">
                        <p><span className="font-semibold">İsim: </span>{user.firstname} {user.lastname}</p>
                        <p><span className="font-semibold">E-posta: </span>{user.email}</p>
                        <p><span className="font-semibold">Telefon: </span>{user.phoneNumber}</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Düzenle
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Bilgileri Düzenle</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">İsim:</label>
                                <input
                                    type="text"
                                    value={formData.firstname}
                                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Soyisim:</label>
                                <input
                                    type="text"
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E-posta:</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefon:</label>
                                <input
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Kaydet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
