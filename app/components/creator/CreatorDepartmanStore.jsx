"use client";

import React, { useState, useEffect } from 'react';
import api from '@/app/loaders/baseApi';
import { useNotification } from '@/app/components/NotificationContext';
import Loading from '@/app/loading';

const CreatorDepartmanStore = ({ adminID }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showSuccess, showError } = useNotification();

    const priorities = ["low", "medium", "urgent"];
    const prioritiesTranslation = {
        low: "Düşük",
        medium: "Orta",
        urgent: "Acil",
    };

    // Sayfalama state'leri
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        countOfPaginate: 10 // Varsayılan olarak sayfa başına 10 kayıt
    });

    // Yeni departman oluşturma state'leri
    const [newDepartment, setNewDepartment] = useState({
        departmanName: '',
        priority: 1,
        userCounts: 1,
        color: '#005266' // Varsayılan renk
    });

    // Renk seçici için state
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Departman verilerini çekme
    const fetchDepartments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/departmanStore", {
                params: {
                    adminID,
                    page: pagination.page,
                    countOfPaginate: pagination.countOfPaginate
                },
                withCredentials: true
            });

            if (response.data?.data?.data) {
                setDepartments(response.data.data.data);
                setPagination(prev => ({
                    ...prev,
                    totalPages: Math.ceil(response.data.data.total / pagination.countOfPaginate)
                }));
            } else {
                setDepartments([]);
            }
        } catch (err) {
            setError(err.message);
            showError("Departmanlar yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    // HEX rengini RGB formatına çevirme
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    };

    // Sayfa değiştirme
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // Yeni departman oluşturma
    const handleCreateDepartment = async () => {
        if (!newDepartment.departmanName.trim()) {
            showError("Departman adı boş olamaz");
            return;
        }

        try {
            const res = await api.post("/api/createDepartman", {
                ...newDepartment,
                adminID,
                RgbNumber: hexToRgb(newDepartment.color)
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                showSuccess("Departman başarıyla oluşturuldu");
                setNewDepartment({
                    departmanName: '',
                    priority: 1,
                    userCounts: 1,
                    color: '#005266'
                });
                fetchDepartments(); // Listeyi yenile
            } else {
                showError(res.data.message || "Departman oluşturulamadı");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman oluşturulurken hata oluştu");
        }
    };

    // Departman silme
    const handleDeleteDepartment = async (departmanID) => {
        try {
            const res = await api.post("/api/deleteDepartman",
                { departmanID },
                {
                    params: {
                        adminID,
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                showSuccess("Departman başarıyla silindi");
                fetchDepartments(); // Listeyi yenile
            } else {
                showError(res.data.message || "Departman silinemedi");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman silinirken hata oluştu");
        }
    };

    // Departman önceliğini güncelleme
    const handleUpdatePriority = async (departmanID, newPriority) => {
        try {
            const res = await api.put("/api/updateDepartmanPriority",
                { departmanID, priority: newPriority },
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccess("Öncelik başarıyla güncellendi");
                fetchDepartments(); // Listeyi yenile
            } else {
                showError(res.data.message || "Öncelik güncellenemedi");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Öncelik güncellenirken hata oluştu");
        }
    };

    // Departman rengini güncelleme
    const handleUpdateColor = async (departmanID, newColor) => {
        try {
            const res = await api.post("/api/departmanColerUpdate",
                {
                    departmanID,
                    RgbNumber: hexToRgb(newColor)
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccess("Renk başarıyla güncellendi");
                fetchDepartments(); // Listeyi yenile
            } else {
                showError(res.data.message || "Renk güncellenemedi");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Renk güncellenirken hata oluştu");
        }
    };

    // İlk yüklemede verileri çek
    useEffect(() => {
        fetchDepartments();
    }, [adminID, pagination.page, pagination.countOfPaginate]);

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 p-4">Hata: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">{adminID}</h2>

            {/* Yeni Departman Ekleme Formu
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3">Yeni Departman Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Departman Adı"
                        value={newDepartment.departmanName}
                        onChange={(e) => setNewDepartment({ ...newDepartment, departmanName: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Öncelik"
                        value={newDepartment.priority}
                        onChange={(e) => setNewDepartment({ ...newDepartment, priority: parseInt(e.target.value) || 0 })}
                        className="p-2 border rounded"
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="Çalışan Sayısı"
                        value={newDepartment.userCounts}
                        onChange={(e) => setNewDepartment({ ...newDepartment, userCounts: parseInt(e.target.value) || 0 })}
                        className="p-2 border rounded"
                        min="0"
                    />
                    <input
                        type="color"
                        value={newDepartment.color}
                        onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
                        className="p-1 h-10 border rounded"
                    />
                </div>
                <button
                    onClick={handleCreateDepartment}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Departman Ekle
                </button>
            </div> */}

            {/* Departman Listesi */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border">Departman Adı</th>
                            <th className="py-2 px-4 border">Öncelik</th>
                            {/* <th className="py-2 px-4 border">Çalışan Sayısı</th>
                            <th className="py-2 px-4 border">Renk</th> */}
                            <th className="py-2 border">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">{department.departmanName}</td>
                                <td className="py-2 px-4 border text-center">
                                   {prioritiesTranslation[department.priority] || department.priority}
                                </td>
                                {/* <td className="py-2 px-4 border">{department.userCounts}</td> */}
                                {/* <td className="py-2 px-4 border">
                                    <div className="flex items-center">
                                        <div
                                            className="w-6 h-6 rounded border border-gray-300 mr-2"
                                            style={{
                                                backgroundColor: department.RgbNumber
                                                    ? `rgb(${department.RgbNumber})`
                                                    : '#005266'
                                            }}
                                        />
                                        <input
                                            type="color"
                                            value={department.RgbNumber
                                                ? `#${parseInt(department.RgbNumber.split(',')[0]).toString(16).padStart(2, '0')}${parseInt(department.RgbNumber.split(',')[1]).toString(16).padStart(2, '0')}${parseInt(department.RgbNumber.split(',')[2]).toString(16).padStart(2, '0')}`
                                                : '#005266'
                                            }
                                            onChange={(e) => handleUpdateColor(department.id, e.target.value)}
                                            className="w-8 h-8"
                                        />
                                    </div>
                                </td> */}
                                <td className="py-2 px-4 border text-center">
                                    <button
                                        onClick={() => handleDeleteDepartment(department.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sayfalama Kontrolleri */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Önceki
                    </button>
                    <span className="text-sm">
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
        </div>
    );
};

export default CreatorDepartmanStore;