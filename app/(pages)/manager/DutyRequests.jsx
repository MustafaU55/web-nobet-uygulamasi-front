import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/app/loaders/baseApi'; // API istemcisini içe aktar
import { useNotification } from '@/app/components/NotificationContext';

const DutyRequests = () => {
    const [dutyRequests, setDutyRequests] = useState([]);
    const [users, setUsers] = useState([]); // Tüm kullanıcıları saklamak için state
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRequestsVisible, setIsRequestsVisible] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending'); // Başlangıçta "PENDING" olarak ayarlandı
    const [filterType, setFilterType] = useState('all'); // Filtre türü ekledik
    const [rejectReason, setRejectReason] = useState(''); // Reddedilme sebebi
    const [selectedRequestId, setSelectedRequestId] = useState([]); // Seçilen talep ID'si
    const { showSuccess, showError, showWarning } = useNotification();

    // Sayfalama için yeni state'ler
    const [pagination, setPagination] = useState({
        pending: { page: 1, totalPages: 1 },
        approved: { page: 1, totalPages: 1 },
        rejected: { page: 1, totalPages: 1 }
    });

    // Günleri İngilizce'den Türkçe'ye çevirme fonksiyonu
    const translateDayToTurkish = (day) => {
        const daysMap = {
            Monday: 'Pazartesi',
            Tuesday: 'Salı',
            Wednesday: 'Çarşamba',
            Thursday: 'Perşembe',
            Friday: 'Cuma',
            Saturday: 'Cumartesi',
            Sunday: 'Pazar',
        };
        return daysMap[day] || day;
    };

    // Kullanıcı ID'sine göre isim bulma fonksiyonu
    const getUserNameById = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? `${user.firstname} ${user.lastname}` : 'Bilinmeyen Kullanıcı';
    };

    const fetchDutyRequests = async (status, filterType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/specialtaskStore?status=${status}&filterType=${filterType}`, {
                withCredentials: true,
                params: {
                    countOfPaginate: 5,
                    page: pagination[status].page
                }
            });

            if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
                setDutyRequests(response.data.data.data);
                // Toplam sayfa sayısını güncelle
                setPagination(prev => ({
                    ...prev,
                    [status]: {
                        ...prev[status],
                        totalPages: Math.ceil(response.data.data.total / 5)
                    }
                }));
            } else {
                setDutyRequests([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPagination(prev => ({
            ...prev,
            [newStatus]: {
                ...prev[newStatus],
                page: 1
            }
        }));
    };

    // Pagination bileşeni
    const PaginationButtons = () => {
        const currentPagination = pagination[statusFilter];
        
        // Eğer toplam sayfa sayısı 1'den küçükse pagination'ı gösterme
        if (currentPagination.totalPages <= 1) return null;

        return (
            <div className="flex flex-col items-center gap-4 mt-6 border-t pt-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPagination.page - 1)}
                        disabled={currentPagination.page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Önceki
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: currentPagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-md ${
                                    currentPagination.page === page
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPagination.page + 1)}
                        disabled={currentPagination.page === currentPagination.totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sonraki
                    </button>
                </div>
                
                <div className="text-sm text-gray-600">
                    {statusFilter === 'pending' && 'Bekleyen Talepler'}
                    {statusFilter === 'approved' && 'Onaylanmış Talepler'}
                    {statusFilter === 'rejected' && 'Reddedilmiş Talepler'} - 
                    Sayfa {currentPagination.page} / {currentPagination.totalPages}
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchDutyRequests(statusFilter, filterType);
    }, [statusFilter, filterType, pagination[statusFilter].page]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/userStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });
                if (response.data.success === true && Array.isArray(response.data.users.data)) {
                    setUsers(response.data.users.data); // Kullanıcıları state'e kaydet
                }
            } catch  {
           
            }
        };

        fetchUsers();
    }, []);

    const handleStatusUpdate = async (request, status) => {
        if (status === 'rejected' && !rejectReason) {
            showWarning('Lütfen reddedilme sebebini girin.');
            return;
        }

        try {
            const response = await api.put(
                '/api/responseSpecialTask',
                {
                    specialTaskID: request.id, // specialTaskID'yi gönder
                    response: status,
                    ResponsSpecialtaskReason: status === 'rejected' ? rejectReason : null,
                },
                {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                }
            );

            if (response.data.success === true) {
                showSuccess(`Talep başarıyla ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.`);
                fetchDutyRequests(statusFilter, filterType); // Listeyi yenile
                setRejectReason(''); // Reddedilme sebebini temizle
                setSelectedRequestId(null); // Seçilen talep ID'sini temizle
            } else {
                showError(response.data.message || 'Talep güncellenirken bir hata oluştu.');
            }
        } catch (err) {
            showError('Talep güncellenirken bir hata oluştu.');
        }
    };

    const handleDeleteTask = async (specialTaskID) => {
        try {
            const response = await api.post('/api/deleteSpecialTask', {
                data: { specialTaskID },
                withCredentials: true,
            });

            if (response.data.success === "true") {
                showSuccess('Görev başarıyla silindi.');
                fetchDutyRequests(statusFilter, filterType); // Listeyi yenile
            } else {
                showError('Görev silinirken bir hata oluştu.');
            }
        } catch (err) {
            showError('Görev silinirken bir hata oluştu.');
        }
    };

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-50 border-green-200 '; // Onaylanmış
            case 'rejected':
                return 'bg-red-50 border-red-200'; // Reddedilmiş
            case 'pending':
                return 'bg-yellow-50 border-yellow-200 '; // Beklemede
            default:
                return 'bg-gray-100 border-gray-200'; // Varsayılan
        }
    };

    if (loading) return <p className="text-center text-gray-500">Yükleniyor...</p>;
    if (error) return <p className="text-center text-red-500">Hata: {error}</p>;

    return (
        <div className="p-4">
            {/* Başlık */}
            <div className="flex justify-between items-center mb-4">
                <h2
                    className="text-2xl font-bold text-gray-800 cursor-pointer"
                    onClick={() => setIsRequestsVisible(!isRequestsVisible)}
                >
                    Nöbet Talepleri {isRequestsVisible ? '▲' : '▼'}
                </h2>
            </div>

            {/* Filtreleme Butonları ve Filtre Türü Seçimi */}
            {isRequestsVisible && (
                <>
                    {/* Filtreleme Butonları */}
                    <div className="mb-4">
                        <button
                            className={`px-4 py-2 mb-2 rounded-full mr-2 ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleFilterChange('pending')}
                        >
                            Beklemede
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full mr-2 ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleFilterChange('approved')}
                        >
                            Onaylanmış
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full mr-2 ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleFilterChange('rejected')}
                        >
                            Reddedilmiş
                        </button>
                    </div>

                    {/* Filtre Türü Seçimi */}
                    <div className="mb-4">
                        <button
                            className={`px-4 py-2 rounded-full mr-2 ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setFilterType('all')}
                        >
                            Hepsi
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full mr-2 ${filterType === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setFilterType('weekly')}
                        >
                            Haftalık
                        </button>
                    </div>
                </>
            )}

            {/* Talepler */}
            {isRequestsVisible && (
                <div>
                    {dutyRequests.length === 0 ? (
                        <p className="text-gray-500">Hiç nöbet talebi bulunmamaktadır.</p>
                    ) : (
                        <div className="space-y-4">
                            {dutyRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className={`border p-4 rounded-lg ${getStatusBackgroundColor(request.status)}`}
                                >
                                    <p><strong>İsim:</strong> {getUserNameById(request.userID)}</p>
                                    <p><strong>Departman:</strong> {request.departmanName ? request.departmanName : 'Bilgi Yok'}</p>
                                    <p><strong>Nöbet Günü:</strong> {translateDayToTurkish(request.shiftDay)}</p>
                                    <p><strong>Oluşturulma Tarihi:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                                    <p><strong>Nöbet Nedeni:</strong> {request.SpecialtaskReason}</p>
                                    <p><strong>Yanıt Nöbet Nedeni:</strong> {request.ResponsSpecialtaskReason}</p>
                                    <p><strong>Durum:</strong> <span className={`${getStatusBackgroundColor(request.status).split(' ')[2]}`}>
                                        {request.status === 'approved' ? 'Onaylandı' : request.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                                    </span></p>

                                    {/* Reddedilme Sebebi Girişi */}
                                    {selectedRequestId === request.id && (
                                        <div className="mt-4">
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Reddedilme sebebini girin..."
                                                className="w-full p-2 border rounded-lg"
                                                rows={3}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4 space-x-2">
                                        <button
                                            onClick={() => handleStatusUpdate(request, 'approved')} // request objesini geçiyoruz
                                            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full ${request.status === 'approved' ? 'opacity-50' : ''}`}
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedRequestId(request.id); // Reddedilme sebebi girişini aç
                                                if (request.status !== 'rejected') {
                                                    setRejectReason(''); // Reddedilme sebebini temizle
                                                }
                                                handleStatusUpdate(request, 'rejected'); // request objesini geçiyoruz
                                            }}
                                            className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full ${request.status === 'rejected' ? 'opacity-50' : ''}`}
                                        >
                                            Reddet
                                        </button>
                                        {/* <button
                                            onClick={() => handleDeleteTask(request.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            X
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sayfalama butonları */}
                    <PaginationButtons />
                </div>
            )}
        </div>
    );
};

export default DutyRequests;