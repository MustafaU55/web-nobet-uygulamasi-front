'use client';

import { useState, useEffect } from 'react';
import Loading from "../../../loading";
import api from '@/app/loaders/baseApi';
import Link from 'next/link';
import Sidebar from '../../../components/sidebar_left';
import MobileBottomBar from '../../../components/mobile_bottom_bar';

// Doğal sıralama (natural sort) için yardımcı fonksiyon
const naturalSort = (a, b) => {
    const ax = [];
    const bx = [];

    a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => ax.push([$1 || Infinity, $2 || '']));
    b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => bx.push([$1 || Infinity, $2 || '']));

    while (ax.length && bx.length) {
        const an = ax.shift();
        const bn = bx.shift();
        const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
};

export default function PastCalendars() {
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userNobetCounts, setUserNobetCounts] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [calendarToDelete, setCalendarToDelete] = useState(null);

    // API'den takvim verilerini çekme
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const res = await api.get('/api/callenderStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });

                if (res.data.success === "true") {
                    const parsedCalendars = res.data.data.data.map(calendar => ({
                        ...calendar,
                        pastCallender: JSON.parse(calendar.pastCallender),
                    }));
                    setCalendars(parsedCalendars);

                    parsedCalendars.forEach(calendar => {
                        fetchUserNobetCounts(calendar.id);
                    });
                }
            } catch (error) {
                console.error('Takvimler yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, []);

    // Her takvim için kullanıcı nöbet sayılarını çekme fonksiyonu
    const fetchUserNobetCounts = async (callenderID) => {
        try {
            const res = await api.post('/api/CallenderusersshiftcountsStore', { callenderID }, {
                withCredentials: true,
                params: {
                    countOfPaginate: 1000
                }
            });
            if (res.data.success === "true" && res.data.data.data.length > 0) {
                const counts = JSON.parse(res.data.data.data[0].userNobetCounts);
                setUserNobetCounts(prevCounts => ({
                    ...prevCounts,
                    [callenderID]: counts,
                }));
            }
        } catch (error) {
            console.error('Nöbet sayıları yüklenirken hata:', error);
        }
    };

    // Kullanıcıları ve departmanları tekrar etmeyecek şekilde filtreleme ve doğal sıralama
    const getUniqueUsersAndDepartments = (pastCallender) => {
        const uniqueUsers = new Set();
        const uniqueDepartments = new Set();

        pastCallender.forEach(shift => {
            if (shift.username) uniqueUsers.add(shift.username);
            if (shift.departman) uniqueDepartments.add(shift.departman);
        });

        const sortedUsers = Array.from(uniqueUsers).sort(naturalSort);
        const sortedDepartments = Array.from(uniqueDepartments).sort(naturalSort);

        return {
            users: sortedUsers,
            departments: sortedDepartments,
        };
    };

    // Takvim başlangıç ve bitiş tarihlerini bulma
    const getStartAndEndDates = (pastCallender) => {
        const dates = pastCallender.map(shift => new Date(shift.shiftDate).getTime());
        const startDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
        const endDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;

        return {
            startDate: startDate ? startDate.toISOString().split('T')[0] : 'Belirtilmemiş',
            endDate: endDate ? endDate.toISOString().split('T')[0] : 'Belirtilmemiş',
        };
    };

    // Silme işlemini başlat
    const initiateDelete = (callenderID) => {
        setCalendarToDelete(callenderID);
        setShowDeleteConfirm(true);
    };

    // Silme işlemini onayla
    const confirmDelete = async () => {
        if (calendarToDelete) {
            try {
                const res = await api.post('/api/callanderDelete', { callenderID: calendarToDelete }, {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });

                if (res.data.success) {
                    setCalendars(calendars.filter(calendar => calendar.id !== calendarToDelete));
                    setUserNobetCounts((prevCounts) => {
                        const newCounts = { ...prevCounts };
                        delete newCounts[calendarToDelete];
                        return newCounts;
                    });
                }
            } catch (error) {
                console.error('Silme işlemi sırasında hata:', error);
            } finally {
                setShowDeleteConfirm(false);
                setCalendarToDelete(null);
            }
        }
    };

    // Silme işlemini iptal et
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setCalendarToDelete(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-blue-300 text-black">
            <Sidebar />
            <div className="min-h-screen xl:ml-[40vh] px-4 p-2 sm:p-10 lg:px-8 pt-12 pb-32 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                <title>Geçmiş Takvimler - NöbetX</title>
                <meta
                    name="description"
                    content="Geçmiş takvimlerinizi görüntüleyin ve yönetin."
                />
                <link rel="icon" href="/logoj.png" />

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                        Geçmiş Takvimler
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                    </h1>
                </div>

                {/* Silme Onay Modalı */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Takvim Silme Onayı</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Seçtiğiniz takvim kalıcı olarak silinecektir. Emin misiniz?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Takvim Listesi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {calendars.map((calendar) => {
                        const { users, departments } = getUniqueUsersAndDepartments(calendar.pastCallender);
                        const { startDate, endDate } = getStartAndEndDates(calendar.pastCallender);
                        const calendarUserNobetCounts = userNobetCounts[calendar.id] || {};

                        return (
                            <div
                                key={calendar.id}
                                className="group bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {calendar.callenderName}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <strong>Takvim ID:</strong> {calendar.id}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium"><strong>Oluşturulma Tarihi:</strong></span> {calendar.created_at}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium"><strong>Başlangıç Tarihi:</strong></span> {startDate}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium"><strong>Bitiş Tarihi:</strong></span> {endDate}
                                    </p>
                                    <div className='grid grid-cols-2'>
                                        <div className="mb-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Departmanlar</h3>
                                            <ul className="list-disc list-inside">
                                                {departments.map((dept, index) => (
                                                    <li key={index} className="text-sm text-gray-500">
                                                        {dept}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Personel</h3>
                                            <ul className="list-disc list-inside">
                                                {users.map((user, index) => (
                                                    <li key={index} className="text-sm text-gray-500">
                                                        {user} ({calendarUserNobetCounts[user] || 0})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
                                        onClick={() => initiateDelete(calendar.id)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Boş Durum */}
                {calendars.length === 0 && (
                    <div className="text-center py-12 bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-md">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Geçmiş Takvim Bulunamadı!</h3>
                        <p className="mt-1 text-sm text-gray-500">Henüz geçmiş takvim kaydı bulunmamaktadır.</p>
                    </div>
                )}
            </div>
            <MobileBottomBar />
        </div>
    );
}