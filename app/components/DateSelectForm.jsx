'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/calendar.css';
import { useNotification } from '@/app/components/NotificationContext';
import api from '@/app/loaders/baseApi';

export default function DateSelectForm({ userId, userName }) {
    const [dateRange, setDateRange] = useState([]);
    const [offdayReason, setNote] = useState('');
    const { showSuccess, showError, showWarning } = useNotification(); // Bildirim fonksiyonları


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tarih aralığı kontrolü (Both start and end dates should be selected)
        if (!dateRange || dateRange.length < 2) {
            showWarning('Lütfen bir başlangıç ve bitiş tarihi seçin.');
            return;
        }

        const formatDate = (date) => {
            return date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split('.').reverse().join('-'); // YYYY-MM-DD formatına çevir
        };

        try {
            const requestData = {
                requestId: Date.now().toString(),
                userId,
                userName,
                startDate: dateRange[0] ? formatDate(dateRange[0]) : null,
                endDate: dateRange[1] ? formatDate(dateRange[1]) : null,
                offdayReason, // Here, using offdayReason instead of note
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const response = await api.post('/api/takeOffDays', requestData, {
                withCredentials: true, // Auth için cookie'yi gönder
                params: {
                    countOfPaginate: 1000,
                }
            });

            // Backend'den gelen success değerini kontrol et
            if (response.data.success === "true") {
                showSuccess('İzin talebi başarıyla gönderildi!');
                setDateRange([]);
                setNote('');
                window.location.reload();
            } else {
                showWarning('Beklemede olan bir isteğiniz bulunmaktadır!');
            }

        } catch {

            // Check if error response exists and show it as a warning
            if (error.response && error.response.data && error.response.data.message) {
                showWarning(error.response.data.message);
            } else {
                showError('Bir hata oluştu!');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg p-0 sm:p-16 max-w-2xl mx-auto">
            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-center bg-white rounded-lg">
                        <Calendar
                            onChange={setDateRange}
                            value={dateRange}
                            selectRange={true}
                            className="custom-calendar"
                            minDate={new Date()}
                            formatMonthYear={(locale, date) => {
                                return new Intl.DateTimeFormat('tr-TR', {
                                    month: 'long',
                                    year: 'numeric'
                                }).format(date);
                            }}
                            formatShortWeekday={(locale, date) => {
                                return new Intl.DateTimeFormat('tr-TR', {
                                    weekday: 'short'
                                }).format(date);
                            }}
                            tileClassName={({ date, view }) => {
                                if (view === 'month') {
                                    if (date.getDay() === 0 || date.getDay() === 6) {
                                        return 'weekend-tile';
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <textarea
                            value={offdayReason}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 
                                         focus:ring-blue-500 min-h-[100px] p-3 text-black"
                            placeholder="Notunuzu buraya yazın..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                                     py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        İzin Talebini Gönder
                    </button>
                </form>
            </div>
        </div>
    );
}