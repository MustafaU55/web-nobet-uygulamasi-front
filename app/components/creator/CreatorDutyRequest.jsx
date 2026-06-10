import React, { useState, useEffect } from 'react';
import api from '@/app/loaders/baseApi';
import { useNotification } from '@/app/components/NotificationContext';

const CreatorDutyRequests = ({ adminID }) => {
    const [dutyRequests, setDutyRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [filterType, setFilterType] = useState('weekly');
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const { showSuccess, showError, showWarning } = useNotification();

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        countOfPaginate: 4
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

    const fetchDutyRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            // Doğru HTTP metodu ve body parametreleri kullanılıyor
            const response = await api.post('/api/specialtaskStore', {
                adminID,
                filterType,
                status: statusFilter,
                countOfPaginate: pagination.countOfPaginate,
                page: pagination.page
            }, {
                withCredentials: true
            });

            if (response.data?.data?.data) {
                setDutyRequests(response.data.data.data);
                setPagination(prev => ({
                    ...prev,
                    totalPages: Math.ceil(response.data.data.total / pagination.countOfPaginate)
                }));
            } else {
                setDutyRequests([]);
            }
        } catch (err) {
            setError(err.message);
            console.error("Nöbet talepleri yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // Filtre değiştiğinde sayfa numarasını sıfırla
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    useEffect(() => {
        fetchDutyRequests();
    }, [adminID, statusFilter, filterType, pagination.page]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Düzeltilmiş users API çağrısı - params yerine doğrudan GET parametreleri kullanılıyor
                const response = await api.get('/api/userStore', {
                    params: {
                        adminID,
                        countOfPaginate: 1000
                    },
                    withCredentials: true
                });

                if (response.data.success && Array.isArray(response.data.users.data)) {
                    setUsers(response.data.users.data);
                }
            } catch (err) {
                console.error("Kullanıcılar yüklenirken hata:", err);
                // Kullanıcı verileri yüklenemezse hata durumu - ama bileşenin çalışmaya devam etmesine izin verilir
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
                    specialTaskID: request.id,
                    response: status,
                    ResponsSpecialtaskReason: status === 'rejected' ? rejectReason : null,
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                showSuccess(`Talep başarıyla ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.`);
                fetchDutyRequests();
                setRejectReason('');
                setSelectedRequestId(null);
            } else {
                showError(response.data.message || 'Talep güncellenirken bir hata oluştu.');
            }
        } catch (err) {
            showError('Talep güncellenirken bir hata oluştu.');
            console.error("Talep güncellenirken hata:", err);
        }
    };

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-50 border-green-200';
            case 'rejected': return 'bg-red-50 border-red-200';
            case 'pending': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-gray-100 border-gray-200';
        }
    };

    if (loading) return <p className="text-center text-gray-500">Yükleniyor...</p>;
    if (error) return <p className="text-center text-red-500">Hata: {error}</p>;

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h2 className="text-xl font-bold text-gray-800">
                    {adminID ? adminID : 'Yönetici'}
                </h2>

                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('pending')}
                    >
                        Beklemede
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('approved')}
                    >
                        Onaylanmış
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('rejected')}
                    >
                        Reddedilmiş
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setFilterType('all')}
                    >
                        Tümü
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${filterType === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setFilterType('weekly')}
                    >
                        Haftalık
                    </button>
                </div>
            </div>

            {dutyRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Hiç nöbet talebi bulunmamaktadır.</p>
            ) : (
                <div className="space-y-3">
                    {dutyRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`border p-3 rounded-lg ${getStatusBackgroundColor(request.status)}`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p><strong>İsim:</strong> {getUserNameById(request.userID)}</p>
                                <p><strong>Departman:</strong> {request.departmanName || 'Bilgi Yok'}</p>
                                <p><strong>Nöbet Günü:</strong> {translateDayToTurkish(request.shiftDay)}</p>
                                <p><strong>Tarih:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                            </div>

                            <p className="mt-2"><strong>Sebep:</strong> {request.SpecialtaskReason}</p>

                            {request.status === 'rejected' && request.ResponsSpecialtaskReason && (
                                <p className="mt-1 text-red-600"><strong>Reddetme Sebebi:</strong> {request.ResponsSpecialtaskReason}</p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {request.status === 'approved' ? 'Onaylandı' :
                                        request.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                                </span>

                                {request.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedRequestId(request.id);
                                                setRejectReason('');
                                            }}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full"
                                        >
                                            Reddet
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(request, 'approved')}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-full"
                                        >
                                            Onayla
                                        </button>
                                    </div>
                                )}
                            </div>

                            {selectedRequestId === request.id && (
                                <div className="mt-3">
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Reddetme sebebini girin..."
                                        className="w-full p-2 border rounded text-sm"
                                        rows={2}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => setSelectedRequestId(null)}
                                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(request, 'rejected')}
                                            disabled={!rejectReason}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded disabled:opacity-50"
                                        >
                                            Onayla ve Reddet
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Önceki
                    </button>

                    <span className="text-sm text-gray-600">
                        Sayfa {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatorDutyRequests;