'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNotification } from '@/app/components/NotificationContext';
import api from '@/app/loaders/baseApi';
import Loading from "../../loading";

export default function DateRequests() {
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRequestsVisible, setIsRequestsVisible] = useState(true);
    const { showSuccess, showError, showWarning } = useNotification();
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [responseOfDayReason, setResponseOfDayReason] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [users, setUsers] = useState([]); // Kullanıcı bilgilerini saklamak için state
    const [pagination, setPagination] = useState({
        all: { page: 1, totalPages: 1 },
        approved: { page: 1, totalPages: 1 },
        rejected: { page: 1, totalPages: 1 },
        pending: { page: 1, totalPages: 1 }
    });

    // Kullanıcı bilgilerini çekme
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/userStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });

                if (res.status === 200 && res.data && res.data.success) {
                    setUsers(res.data.users.data); // Kullanıcı bilgilerini state'e kaydet
                }
            } catch {

            }
        };

        fetchUsers();
    }, []);

    // İzin taleplerini çekme ve kullanıcı bilgileriyle eşleştirme
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get("/api/offdayStore", {
                    params: {
                        status: statusFilter,
                        filterType: filterType,
                        countOfPaginate: 5,
                        page: pagination[statusFilter].page // Mevcut filtreye göre sayfa numarası
                    },
                    withCredentials: true,
                });

                if (res.status === 200 && res.data) {
                    const requestsWithUserInfo = res.data.data.data.map(request => {
                        const user = users.find(user => user.id === request.userID);
                        return {
                            ...request,
                            firstname: user ? user.firstname : "Bilinmiyor",
                            lastname: user ? user.lastname : "Bilinmiyor",
                            username: user ? user.username : "Bilinmiyor"
                        };
                    });

                    setRequests(requestsWithUserInfo);

                    // Toplam sayfa sayısını güncelle
                    setPagination(prev => ({
                        ...prev,
                        [statusFilter]: {
                            ...prev[statusFilter],
                            totalPages: Math.ceil(res.data.data.total / 5)
                        }
                    }));
                }
            } catch (error) {
                showError('İzin bilgileri alınırken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        if (users.length > 0) {
            fetchRequests();
        }
    }, [statusFilter, filterType, users, pagination[statusFilter].page]);

    const handleStatusUpdate = async (OffDayID, newStatus) => {
        try {
            const requestData = {
                OffDayID: OffDayID,
                response: newStatus,
            };

            if (newStatus === 'rejected') {
                requestData.responseOfDayReason = responseOfDayReason;
            }

            const response = await api.put("/api/responseOffDays", requestData, {
                withCredentials: true,
                params: {
                    countOfPaginate: 1000
                }
            });

            if (response.status === 200 && response.data) {
                setRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === OffDayID
                            ? { ...request, status: newStatus }
                            : request
                    )
                );
                showSuccess(newStatus === 'approved' ? "Talep Onaylandı!" : "Talep Reddedildi!");
                setSelectedRequest(null);
                setResponseOfDayReason('');
            } else {
                showWarning('Güncelleme yapılıyor...');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            showError('İşlem sırasında bir hata oluştu!');
        }
    };

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            [statusFilter]: {
                ...prev[statusFilter],
                page: newPage
            }
        }));
    };

    // Filtre değiştiğinde sayfa numarasını sıfırla
    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
        setPagination(prev => ({
            ...prev,
            [newFilter]: {
                ...prev[newFilter],
                page: 1
            }
        }));
    };

    // Pagination bileşeni
    const PaginationButtons = () => {
        const currentPagination = pagination[statusFilter];

        return (
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPagination.page - 1)}
                    disabled={currentPagination.page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Önceki
                </button>

                <span className="px-4 py-2">
                    Sayfa {currentPagination.page} / {currentPagination.totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPagination.page + 1)}
                    disabled={currentPagination.page === currentPagination.totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sonraki
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-4 text-black">
            <div className='flex items-center space-x-2'>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold cursor-pointer flex items-center" onClick={() => setIsRequestsVisible(!isRequestsVisible)}>
                    İzin Talepleri {isRequestsVisible ? '▲' : '▼'}
                </h2>
            </div>

            {isRequestsVisible && (
                <>
                    <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-full ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Hepsi
                        </button>
                        <button
                            onClick={() => handleFilterChange('approved')}
                            className={`px-4 py-2 rounded-full ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                            Onaylanmış
                        </button>
                        <button
                            onClick={() => handleFilterChange('rejected')}
                            className={`px-4 py-2 rounded-full ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                            Reddedilmiş
                        </button>
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`px-4 py-2 rounded-full ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                        >
                            Beklemede
                        </button>
                    </div>

                    {Array.isArray(requests) && requests.map((request) => (
                        <div key={request.id} className={`relative border p-4 rounded-lg max-w-full 
        ${request.status === 'approved' ? 'bg-green-50 border-green-200' :
                                request.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                    'bg-yellow-50 border-yellow-200'}`}>

                            <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-semibold
            ${request.status === 'approved' ? 'bg-green-200 text-green-800' :
                                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'}`}>
                                {request.status === 'pending' ? 'Beklemede' : request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                            </div>

                            <p><strong>Personel:</strong> {request.firstname} {request.lastname}</p>
                            <p><strong>Kullanıcı İsmi:</strong> {request.username}</p>
                            <p><strong>Not:</strong> {request.offdayReason}</p>
                            <p><strong>Talep Tarihi:</strong> {format(new Date(request.created_at), "d MMMM yyyy HH:mm", { locale: tr })}</p>
                            <p><strong>İzin Aralığı:</strong> {format(new Date(request.offdayStart), "d MMMM yyyy", { locale: tr })} - {format(new Date(request.offdayEnd), "d MMMM yyyy", { locale: tr })}</p>

                            {request.status === 'pending' && (
                                <div className="mt-4 space-x-2">
                                    <button
                                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Onayla
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setResponseOfDayReason('');
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Reddet
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Sayfalama butonları */}
                    <PaginationButtons />
                </>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Reddetme Sebebi</h2>
                        <textarea
                            value={responseOfDayReason}
                            onChange={(e) => setResponseOfDayReason(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                            placeholder="Reddetme sebebini yazın..."
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Reddet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}