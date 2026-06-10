'use client';

import { useState } from 'react';
import { useNotification } from '@/app/components/NotificationContext';


export default function AddUserForm({ onClose }) {
    const { showSuccess, showError,showWarning, showInfo } = useNotification(); // Bildirim fonksiyonları
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        photo: '/default-avatar.png', // Varsayılan profil fotoğrafı
        role: 'user' // Varsayılan rol
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    id: Date.now().toString() // Basit bir ID oluşturma
                }),
            });

            if (response.ok) {
                showSuccess('Personel başarıyla eklendi!');
                onClose();
                window.location.reload();
            } else {
                showError('Bir hata oluştu!');
            }
        } catch {
  
            showError('Bir hata oluştu!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Yeni Personel Ekle</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            İsim:
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            E-posta:
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Telefon:
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Rol:
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="user">Personel</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 