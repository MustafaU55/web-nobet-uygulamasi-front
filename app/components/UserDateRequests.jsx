'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Loading from '../loading';
import api from '@/app/loaders/baseApi';

export default function UserDateRequests({ }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // Durum filtresi
    const [filterType, setFilterType] = useState('all'); // Tarih filtresi (weekly, monthly, yearly, all)

    // Tarihi biçimlendiren fonksiyon
    const formatDate = (dateString) => {
        if (!dateString) return "Tarih bilgisi yok";

        const date = new Date(dateString);
        return new Intl.DateTimeFormat("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    useEffect(() => {
        const fetchUserRequests = async () => {
            setLoading(true); // Yükleme durumunu başlat
            try {
                const response = await api.get(`/api/userOfdayStore`, {
                    params: {
                        status: filter,  // Durum filtresi
                        filterType: filterType,  // Tarih filtresi
                        countOfPaginate: 1000  // Tüm talepleri getirmek için
                    },
                    withCredentials: true,  // withCredentials: true ekleniyor
                });
    
                if (response.status === 200) {
                    if (response.data.offdays && response.data.offdays.data) {
                        const data = response.data.offdays.data;
                        const sortedData = data.sort(
                            (a, b) => new Date(b.created_at) - new Date(a.created_at)
                        );
                        setRequests(sortedData);
                    } else {
                        setRequests([]); // Boş bir liste ayarla
                    }
                } else {
                    setRequests([]); // Boş bir liste ayarla
                }
            } catch {
                setRequests([]); // Boş bir liste ayarla
            } finally {
                setLoading(false); // Yükleme durumunu bitir
            }
        };
    
        fetchUserRequests();
    }, [filter, filterType]);  // filter ve filterType değiştiğinde yeniden çağrılacak

    const getRequestStyles = (status) => {
        const styles = {
            pending: {
                container: 'bg-yellow-50 border-yellow-200',
                badge: 'bg-yellow-100 text-yellow-800',
                text: 'Beklemede'
            },
            approved: {
                container: 'bg-green-50 border-green-200',
                badge: 'bg-green-100 text-green-800',
                text: 'Onaylandı'
            },
            rejected: {
                container: 'bg-red-50 border-red-200',
                badge: 'bg-red-100 text-red-800',
                text: 'Reddedildi'
            }
        };

        return styles[status] || styles.pending;
    };

    const handleDeleteRequest = async (id) => {
        try {
            const response = await api.post(`/api/deleteOffDays`, { id }, {
                withCredentials: true,
            });

            if (response.status === 201) {
                // Silme işlemi başarılı ise, listeden kaldır
                setRequests(requests.filter(request => request.id !== id));
            } else {
                console.error('Silme işlemi başarısız oldu.');
            }
        } catch (error) {
            console.error('Silme işlemi sırasında bir hata oluştu:', error);
        }
    };

    const filteredRequests = requests.filter((request) => {
        return request.status === filter || filter === 'all';  // Duruma göre filtreleme
    });

    if (loading) {
        return <div><Loading /></div>;
    }

    // Geçerli bir tarih olup olmadığını kontrol etme
    const getValidDate = (date) => {
        return !isNaN(new Date(date).getTime());
    };

    return (
        <div className="space-y-6">
            <p className="text-xl font-semibold mb-4"></p>

            {/* Filtreleme Seçenekleri */}
            <div className="flex space-x-4 mb-6 md:block hidden">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                >
                    Hepsi
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'
                        }`}
                >
                    Onaylanan
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'
                        }`}
                >
                    Reddedilen
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
                        }`}
                >
                    Beklemede
                </button>
            </div>

            {/* Mobil Filtreleme Butonları */}
            <div className="flex flex-wrap justify-center space-x-4 gap-y-2 mb-6 md:hidden">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                >
                    Hepsi
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Onaylanan
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Reddedilen
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Beklemede
                </button>
            </div>

            {filteredRequests.length === 0 ? (
                <p className="text-gray-500">Bu kategoriye ait izin talebi bulunmamaktadır.</p>
            ) : (
                filteredRequests.map((request) => {
                    const styles = getRequestStyles(request.status);

                    // Geçerli bir tarih olup olmadığını kontrol etme
                    const formattedStartDate = getValidDate(request.offdayStart)
                        ? format(new Date(request.offdayStart), 'PPP', { locale: tr })
                        : 'Geçersiz Tarih';  // Geçersiz tarih durumunda alternatif gösterim

                    const formattedEndDate = getValidDate(request.offdayEnd)
                        ? format(new Date(request.offdayEnd), 'PPP', { locale: tr })
                        : 'Geçersiz Tarih';  // Geçersiz tarih durumunda alternatif gösterim

                    return (
                        <div
                            key={`${request.id}-${request.created_at}`} // Benzersiz key değeri
                            className={`border rounded-lg p-4 shadow-sm transition-all duration-200 ${styles.container}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-lg font-semibold text-gray-800">{request.offdayReason}</div>
                                <div
                                    className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold ${styles.badge}`}
                                >
                                    {styles.text}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <div>
                                    <strong>Başlangıç Tarihi:</strong> {formattedStartDate}
                                </div>
                                <div>
                                    <strong>Bitiş Tarihi:</strong> {formattedEndDate}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    <strong> Nöbet Talebi Oluşturulma Tarihi:</strong> {formatDate(request.created_at)}
                                </div>
                                {/* Reddedilme Sebebi */}
                                {request.status === 'rejected' && (
                                    <div className="text-sm text-red-600 mt-2">
                                        <strong>Reddedilme Sebebi:</strong> {request.ResponseOffdayReason}
                                    </div>
                                )}
                                {/* Yanıt Açıklaması */}
                                {request.ResponseOffdayReason && (
                                    <div className="text-sm text-gray-600 mt-2">
                                        <strong>Yanıt Açıklaması:</strong> {request.ResponseOffdayReason}
                                    </div>
                                )}
                                {/* Silme Butonu (Sadece pending durumunda göster) */}
                                {request.status === 'pending' && (
                                    <button
                                        onClick={() => handleDeleteRequest(request.id)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
                                    >
                                        Talebi Sil
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}