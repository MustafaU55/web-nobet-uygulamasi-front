"use client";

import { useState, useEffect } from 'react';
import UserDateRequests from './UserDateRequests';
import DateSelectForm from './DateSelectForm';
import api from "@/app/loaders/baseApi";

export default function RequestsAccordion({ userId, userName }) {
    const [isRequestsOpen, setIsRequestsOpen] = useState(true);
    const [user, setUser] = useState({ id: userId, name: userName });
    const [offDaysCount, setOffDaysCount] = useState(0); // İzin gün sayısını tutacak state

    // Eğer userId veya userName eksikse, hata mesajı göster
    useEffect(() => {
        if (!userId || !userName) {
        } else {
            // API'den izin gün sayısını al
            api.post(`/api/countOfOffDays`, { userID: userId }, {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                        pagination: true, // Add the required pagination parameter
                        filterType: 'all'
                    },
            }) // userId'yi body olarak gönder
                .then(response => {
                    if (response.success="true") {
                        setOffDaysCount(response.data.total_off_days); // API'den gelen total_off_days değerini state'e kaydet
                    } 
                })
                ;
        }
    }, [userId, userName]);

    if (!userId || !userName) {
        return <p className="text-red-500">Kullanıcı bilgileri eksik!</p>;
    }

    return (
        <div className="px-6 divide-y">
            {/* İzin Talepleri Butonu ve Accordion */}
            <div className="py-6">
                <button
                    onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                    className="flex items-center w-full px-2 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    İzin Talepleri {isRequestsOpen ? '▼' : '▶'}
                    {/* İzin gün sayısını göster */}
                    <span className="ml-auto bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Kullanılan İzin = {offDaysCount}
                    </span>
                </button>

                {isRequestsOpen && (
                    <div className="mt-4">
                        <UserDateRequests userId={user.id} />
                    </div>
                )}
            </div>

            {/* Yeni İzin Talebi - Normal görünüm */}
            <div className="pt-6 pb-6">
                <p className="text-xl font-semibold text-gray-800 mb-4">
                    İzin Talebi Oluştur
                </p>
                <DateSelectForm userId={userId} userName={userName} />
            </div>
        </div>
    );
}