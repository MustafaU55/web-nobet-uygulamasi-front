'use client';

import { useState } from 'react';
import { useNotification } from '@/app/components/NotificationContext';


export default function UserForm() {
    const { showSuccess, showError } = useNotification(); // Bildirim fonksiyonları
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/save-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showSuccess('Form başarıyla kaydedildi!');
                setFormData({ name: '', email: '' });
            } else {
                showError('Bir hata oluştu!');
            }
        } catch  {
       
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                    İsim:
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                    E-posta:
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Gönder
            </button>
        </form>
    );
}