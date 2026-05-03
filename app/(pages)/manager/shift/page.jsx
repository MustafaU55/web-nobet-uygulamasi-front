"use client";

import React, { useState, useEffect } from 'react';
import api from "@/app/loaders/baseApi";
import { useNotification } from '@/app/components/NotificationContext';
import Sidebar from "@/app/components/sidebar_left";
import MobileBottomBar from "@/app/components/mobile_bottom_bar";
import ScrollHandler from '@/app/components/ScrollHandler';
import Loading from '@/app/loading';


const CombinedList = () => {
    // State'ler
    const [departments, setDepartments] = useState([]);
    const [wishes, setWishes] = useState([]);
    const [users, setUsers] = useState({}); // Kullanıcı bilgilerini saklamak için
    const [errorDepartments, setErrorDepartments] = useState(null);
    const [errorWishes, setErrorWishes] = useState(null);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [loadingWishes, setLoadingWishes] = useState(true);
    const [reasonInput, setReasonInput] = useState(""); // Sebep inputu için state
    const [isShiftListOpen, setIsShiftListOpen] = useState(false); // Vardiya listesi akordiyon durumu
    const [statusFilter, setStatusFilter] = useState("all"); // Filtreleme durumu
    const [searchQuery, setSearchQuery] = useState(""); // Arama çubuğu için state
    const { showSuccess, showError, showWarning } = useNotification(); // Bildirim fonksiyonları

    // Sayfalama için yeni state'ler
    const [departmentsPagination, setDepartmentsPagination] = useState({
        page: 1,
        totalPages: 1
    });

    // İstekler için durum bazlı sayfalama state'i
    const [wishesPagination, setWishesPagination] = useState({
        all: { page: 1, totalPages: 1 },
        pending: { page: 1, totalPages: 1 },
        approved: { page: 1, totalPages: 1 },
        rejected: { page: 1, totalPages: 1 }
    });

    // Arama işlemi için yeni fonksiyon
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Arama yapıldığında sayfayı sıfırla
        setDepartmentsPagination(prev => ({
            ...prev,
            page: 1
        }));
    };

    // Vardiyaları çekme
    const fetchDepartments = async () => {
        try {
            const response = await api.get('/api/adminUserInventoriesStore', {
                params: {
                    countOfPaginate: 15,
                    page: departmentsPagination.page
                }
            });
            if (response.status === 200) {
                setDepartments(response.data.data.data);
                setDepartmentsPagination(prev => ({
                    ...prev,
                    totalPages: Math.ceil(response.data.data.total / 15)
                }));
            }
        } catch (err) {
            setErrorDepartments('Vardiyalar yüklenirken bir hata oluştu.');
        } finally {
            setLoadingDepartments(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [departmentsPagination.page]);

    // İstekleri ve kullanıcı bilgilerini çekme
    const fetchWishesAndUsers = async () => {
        try {
            const wishesResponse = await api.get('/api/adminUserinventorieswishesStore', {
                params: {
                    countOfPaginate: 5,
                    page: wishesPagination[statusFilter]?.page || 1,
                    status: statusFilter === 'all' ? 'all' : statusFilter,
                    filterType: "all"
                }
            });

            if (wishesResponse.status === 200) {
                const wishesData = wishesResponse.data.data.data;
                setWishes(wishesData);

                // API'den gelen sayfalama bilgilerini kullan
                setWishesPagination(prev => ({
                    ...prev,
                    [statusFilter]: {
                        page: wishesResponse.data.data.current_page,
                        totalPages: wishesResponse.data.data.last_page
                    }
                }));

                // Kullanıcı bilgilerini çek
                const usersResponse = await api.get('/api/userStore', {
                    params: {
                        countOfPaginate: 1000,
                    }
                });

                if (usersResponse.status === 200) {
                    const usersData = usersResponse.data.users.data;
                    const usersMap = usersData.reduce((acc, user) => {
                        acc[user.id] = `${user.firstname} ${user.lastname}`;
                        return acc;
                    }, {});
                    setUsers(usersMap);
                }
            }
        } catch (err) {
            setErrorWishes('İstekler veya kullanıcı bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setLoadingWishes(false);
        }
    };

    // Filtre değiştiğinde sayfa numarasını sıfırla
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setWishesPagination(prev => ({
            ...prev,
            [newStatus]: {
                ...prev[newStatus],
                page: 1
            }
        }));
    };

    // Sayfa değiştirme fonksiyonu
    const handleWishesPageChange = (newPage) => {
        if (newPage < 1 || newPage > wishesPagination[statusFilter]?.totalPages) return;

        setWishesPagination(prev => ({
            ...prev,
            [statusFilter]: {
                ...prev[statusFilter],
                page: newPage
            }
        }));
    };

    // İstek durumunu güncelleme (onayla/reddet)
    const handleResponse = async (whichShiftID, status) => {
        // Sebep boş ise uyarı göster
        if (!reasonInput.trim()) {
            showWarning('Lütfen sebep belirtiniz.');
            return;
        }

        try {
            const response = await api.put('/api/ResponseWhichShift', {
                whichShiftID,
                status,
                ResponseReason: reasonInput,
            });

            if (response.data.success) {
                setWishes((prevWishes) =>
                    prevWishes.map((wish) =>
                        wish.id === whichShiftID ? { ...wish, status } : wish
                    )
                );

                await fetchDepartments();
                showSuccess(`İstek ${status === "approved" ? "onaylandı" : "reddedildi"}.`);
                setReasonInput("");
            } else {
                showError("İstek durumu güncellenirken bir hata oluştu.");
            }
        } catch {
            showError("İstek durumu güncellenirken bir hata oluştu.");
        }
    };

    // Filtrelenmiş istekleri hesapla
    const filteredWishes = wishes.filter((wish) => {
        if (statusFilter === "all") return true;
        return wish.status === statusFilter;
    });

    // Filtrelenmiş departmanları hesapla
    const filteredDepartments = departments.filter((department) => {
        const userName = users[department.userID] || "";
        return userName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Durum badge rengi ve metni
    const getStatusBadgeStyles = (status) => {
        switch (status) {
            case "pending":
                return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Beklemede" };
            case "approved":
                return { bg: "bg-green-100", text: "text-green-800", label: "Onaylandı" };
            case "rejected":
                return { bg: "bg-red-100", text: "text-red-800", label: "Reddedildi" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-800", label: "Bilinmiyor" };
        }
    };

    // Sayfa değiştirme fonksiyonları
    const handleDepartmentsPageChange = (newPage) => {
        setDepartmentsPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Vardiya Listesi için Pagination bileşeni
    const DepartmentsPaginationButtons = () => {
        if (departmentsPagination.totalPages <= 1) return null;

        return (
            <div className="flex flex-col items-center gap-4 mt-6 border-t pt-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleDepartmentsPageChange(departmentsPagination.page - 1)}
                        disabled={departmentsPagination.page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Önceki
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: departmentsPagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handleDepartmentsPageChange(page)}
                                className={`px-4 py-2 rounded-md ${departmentsPagination.page === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handleDepartmentsPageChange(departmentsPagination.page + 1)}
                        disabled={departmentsPagination.page === departmentsPagination.totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sonraki
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    Vardiya Listesi - Sayfa {departmentsPagination.page} / {departmentsPagination.totalPages}
                </div>
            </div>
        );
    };

    // İstek Listesi için Pagination bileşeni
    const WishesPaginationButtons = () => {
        const currentPagination = wishesPagination[statusFilter] || { page: 1, totalPages: 1 };

        if (currentPagination.totalPages <= 1) return null;

        return (
            <div className="flex flex-col items-center gap-4 mt-6 border-t pt-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleWishesPageChange(currentPagination.page - 1)}
                        disabled={currentPagination.page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Önceki
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: currentPagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handleWishesPageChange(page)}
                                className={`px-4 py-2 rounded-md ${currentPagination.page === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handleWishesPageChange(currentPagination.page + 1)}
                        disabled={currentPagination.page >= currentPagination.totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sonraki
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    {statusFilter === 'all' && 'Tüm İstekler'}
                    {statusFilter === 'pending' && 'Bekleyen İstekler'}
                    {statusFilter === 'approved' && 'Onaylanmış İstekler'}
                    {statusFilter === 'rejected' && 'Reddedilmiş İstekler'} -
                    Sayfa {currentPagination.page} / {currentPagination.totalPages}
                </div>
            </div>
        );
    };

    // useEffect'i güncelle
    useEffect(() => {
        fetchWishesAndUsers();
    }, [statusFilter, wishesPagination[statusFilter]?.page]);

    // Yükleme durumu
    if (loadingDepartments || loadingWishes) {
        return <Loading />;
    }

    return (
        <div className='text-black flex min-h-screen bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 pb-32 xl:pb-0'>
            <Sidebar />
            <div className='flex-1 xl:ml-[40vh] p-2 sm:p-10'>

                <ScrollHandler />

                <h1 className='text-2xl font-bold mb-4'>Vardiya ve İstek Listesi</h1>

                {/* Vardiya Listesi */}
                <div className='bg-white p-6 rounded-xl shadow mb-8'>
                    <button
                        className="flex items-center w-full px-2 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        onClick={() => setIsShiftListOpen(!isShiftListOpen)}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>

                        Vardiya Listesi  {isShiftListOpen ? '▼' : '▶'} <span className="ml-1 relative group">
                            <span className="text-gray-500 cursor-pointer">❓</span>
                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                Vardiya 0=Her vardiyada çalışabilir. <br />
                                Vardiya 1=Sadece 1. vardiyada çalışır.<br />
                                Vardiya 2=Sadece 2. vardiyada çalışır.<br />
                                Vardiya 3=Sadece 3. vardiyada çalışır.<br />
                                Vardiya 4=Sadece 4. vardiyada çalışır.<br />
                                Vardiya 5=Sadece 5. vardiyada çalışır.
                            </span>
                        </span>
                    </button>

                    {isShiftListOpen && (
                        <div className="mt-4">
                            {/* Arama Çubuğu */}
                            <div className='px-2'>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Personel ara..."
                                    className="w-full p-2 border rounded mb-4 rounded-lg"
                                />
                            </div>
                            {errorDepartments ? (
                                <p className="text-red-600">{errorDepartments}</p>
                            ) : (
                                <>
                                    <ul className='grid grid-cols-3'>
                                        {filteredDepartments.map((department) => (
                                            <li key={department.id} className='mb-4 p-4 border rounded-lg bg-gray-50 mx-2'>
                                                <strong>Personel:</strong> {users[department.userID] || "Bilinmiyor"} <br />
                                                <strong>Vardiya:</strong> {department.whichShift} <br />
                                                <strong>Oluşturulma Tarihi:</strong> {new Date(department.created_at).toLocaleString()} <br />
                                            </li>
                                        ))}
                                    </ul>
                                    <DepartmentsPaginationButtons />
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* İstek Listesi */}
                <div className='bg-white p-6 rounded-xl shadow' id="shift_request">
                    <h2 className='text-xl font-semibold mb-4'>İstek Listesi<span className="ml-1 relative group">
                        <span className="text-gray-500 cursor-pointer">❓</span>
                        <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                            Personeliniz tarafından yollanan vardiya istek taleplerini buradan görüntüleyebilirsiniz. Burada onayladığınız istekler, istekte bulunan personelini seçtiği vardiyada çalışmasına sebep olur.
                        </span>
                    </span></h2>

                    {/* Filtreleme Butonları */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === "all" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Hepsi
                        </button>
                        <button
                            onClick={() => setStatusFilter("pending")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === "pending" ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                        >
                            Beklemede
                        </button>
                        <button
                            onClick={() => setStatusFilter("approved")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === "approved" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                            Onaylanmış
                        </button>
                        <button
                            onClick={() => setStatusFilter("rejected")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === "rejected" ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                            Reddedilmiş
                        </button>
                    </div>

                    {errorWishes ? (
                        <p className="text-red-600">{errorWishes}</p>
                    ) : (
                        <>
                            <ul>
                                {filteredWishes.map((wish) => {
                                    const { bg, text, label } = getStatusBadgeStyles(wish.status);
                                    return (
                                        <li
                                            key={wish.id}
                                            className={`mb-4 p-4 border rounded-lg relative ${wish.status === "pending" ? "bg-yellow-50" : wish.status === "approved" ? "bg-green-50" : "bg-red-50"}`}
                                        >
                                            {/* Durum Badge */}
                                            <div className={`absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-sm  font-bold ${bg} ${text}`}>
                                                {label}
                                            </div>
                                            <strong>Personel:</strong> {users[wish.userID] || "Bilinmiyor"} <br />
                                            <strong>Vardiya:</strong> {wish.whichShift} <br />
                                            <strong>Sebep:</strong> {wish.Reason} <br />
                                            <strong>Oluşturulma Tarihi:</strong> {new Date(wish.created_at).toLocaleString()} <br />
                                            {/* Onayla ve Reddet Butonları */}
                                            {wish.status === "pending" && (
                                                <div className="mt-2">
                                                    {/* Sebep Input Alanı */}
                                                    <input
                                                        type="text"
                                                        value={reasonInput}
                                                        onChange={(e) => setReasonInput(e.target.value)}
                                                        placeholder="Sebep girin..."
                                                        className="w-full p-2 border rounded mb-2"
                                                    />
                                                    <button
                                                        onClick={() => handleResponse(wish.id, "approved")}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-full mr-2 hover:bg-green-600 transition-colors"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => handleResponse(wish.id, "rejected")}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        Reddet
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                            <WishesPaginationButtons />
                        </>
                    )}
                </div>
            </div>
            <MobileBottomBar />
        </div>
    );
};

export default CombinedList;