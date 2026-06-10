'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNotification } from '@/app/components/NotificationContext';
import api from '@/app/loaders/baseApi';
import Loading from "@/app/loading";

const CreatorOffDayStore = ({ adminID }) => {
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [responseOfDayReason, setResponseOfDayReason] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [users, setUsers] = useState([]);
    const { showSuccess, showError, showWarning } = useNotification();

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalPages: 1
    });

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/userStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                        adminID
                    }
                });
                if (res.data?.success) setUsers(res.data.users.data);
            } catch (error) {
                showError("Kullanıcı bilgileri alınamadı");
            }
        };
        fetchUsers();
    }, []);

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Fetch requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const res = await api.get("/api/offdayStore", {
                    params: {
                        status: statusFilter,
                        filterType,
                        adminID,
                        page: pagination.page,
                        countOfPaginate: pagination.perPage
                    },
                    withCredentials: true
                });

                if (res.data?.success) {
                    const requestsWithUserInfo = res.data.data.data.map(request => {
                        const user = users.find(u => u.id === request.userID);
                        return {
                            ...request,
                            firstname: user?.firstname || "Bilinmiyor",
                            lastname: user?.lastname || "Bilinmiyor",
                            username: user?.username || "Bilinmiyor"
                        };
                    });

                    setRequests(requestsWithUserInfo);
                    setPagination(prev => ({
                        ...prev,
                        totalPages: Math.ceil(res.data.data.total / pagination.perPage)
                    }));
                }
            } catch (error) {
                showError('İzin bilgileri alınamadı');
            } finally {
                setLoading(false);
            }
        };

        if (users.length > 0) fetchRequests();
    }, [statusFilter, filterType, users, pagination.page, adminID]);

    const handleStatusUpdate = async (OffDayID, newStatus) => {
        try {
            const requestData = {
                OffDayID,
                response: newStatus,
                ...(newStatus === 'rejected' && { responseOfDayReason })
            };

            const response = await api.put("/api/responseOffDays", requestData, {
                withCredentials: true
            });

            if (response.data?.success) {
                setRequests(prev => prev.map(req =>
                    req.id === OffDayID ? { ...req, status: newStatus } : req
                ));
                showSuccess(`Talep ${newStatus === 'approved' ? 'onaylandı' : 'reddedildi'}`);
                setSelectedRequest(null);
                setResponseOfDayReason('');
            }
        } catch (error) {
            showError('İşlem başarısız oldu');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="block mb-1 font-medium">Durum</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            Hepsi
                        </button>
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
                </div>

                <div>
                    <label className="block mb-1 font-medium">Filtre Tipi</label>
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="p-2 border rounded"
                    >
                        <option value="all">Tümü</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                        <option value="yearly">Yıllık</option>
                    </select>
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id} className={`border p-4 rounded-lg relative
                            ${request.status === 'approved' ? 'bg-green-50 border-green-200' :
                                request.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                    'bg-yellow-50 border-yellow-200'}`}
                        >
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold
                                ${request.status === 'approved' ? 'bg-green-200 text-green-800' :
                                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'}`}
                            >
                                {request.status === 'pending' ? 'Beklemede' :
                                    request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p><strong>Personel:</strong> {request.firstname} {request.lastname}</p>
                                <p><strong>Kullanıcı Adı:</strong> {request.username}</p>
                                <p><strong>Başlangıç:</strong> {format(new Date(request.offdayStart), "d MMMM yyyy", { locale: tr })}</p>
                                <p><strong>Bitiş:</strong> {format(new Date(request.offdayEnd), "d MMMM yyyy", { locale: tr })}</p>
                                <p className="md:col-span-2"><strong>Sebep:</strong> {request.offdayReason}</p>
                            </div>

                            {request.status === 'pending' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Onayla
                                    </button>
                                    <button
                                        onClick={() => setSelectedRequest(request)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Reddet
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {statusFilter === 'all' ? 'Henüz izin talebi bulunmamaktadır' :
                            `Henüz ${statusFilter === 'pending' ? 'bekleyen' :
                                statusFilter === 'approved' ? 'onaylanmış' : 'reddedilmiş'} izin talebi bulunmamaktadır`}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Önceki
                    </button>
                    <span>
                        Sayfa {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sonraki
                    </button>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Reddetme Sebebi</h3>
                        <textarea
                            value={responseOfDayReason}
                            onChange={(e) => setResponseOfDayReason(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Reddetme sebebini yazın..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                disabled={!responseOfDayReason}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                                Reddet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorOffDayStore;