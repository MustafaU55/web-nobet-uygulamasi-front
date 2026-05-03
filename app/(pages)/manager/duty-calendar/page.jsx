"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNotification } from '@/app/components/NotificationContext';
import DutyRequests from "../DutyRequests";
import api from '@/app/loaders/baseApi'; // API istemcisini içe aktar
import PastDutyCalendar from '../../../components/PastDutyCalendar';
import Link from 'next/link';
import Loading from "@/app/loading";
import Sidebar from '../../../components/sidebar_left';
import MobileBottomBar from '../../../components/mobile_bottom_bar';
import Logo from '@/app/components/loadinglogo';
import ScrollHandler from '@/app/components/ScrollHandler';


export default function DutyCalendar() {
    const [users, setUsers] = useState([]);
    const [calendarCount, setCalendarCount] = useState([]);
    const [dutySchedule, setDutySchedule] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [dayInterval, setDayInterval] = useState(0); // Yeni state: kaç gün arayla nöbet atanacağı
    const { showSuccess, showError, showWarning } = useNotification(); // Bildirim fonksiyonları
    const [selectedShiftDays, setSelectedShiftDays] = useState([]); // Birden fazla gün seçimi için state
    const [activeCalendar, setActiveCalendar] = useState(1); // 1 veya 2 olarak takvimlerin hangisinin aktif olduğunu tutar
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedOffDates, setSelectedOffDates] = useState([]);
    const [selectionMode, setSelectionMode] = useState('range'); // 'single' veya 'range'
    const [shiftCounts, setShiftCounts] = useState(1); // Varsayılan değer 1 olarak ayarlandı
    const [departments, setDepartments] = useState([]); // Boş bir dizi olarak başlat
    const [selectedDepartments, setSelectedDepartments] = useState([]); // Seçilen departmanları tutacak state
    const firstDate = selectedDates?.[0];
    const [loading, setLoading] = useState(false); // Başlangıçta false olarak ayarlandı
    const [usersTotalShiftCounts, setUsersTotalShiftCounts] = useState([]);
    const [filterType, setFilterType] = useState('all'); // Filtre türü
    const [loadingShiftCounts, setLoadingShiftCounts] = useState(true); // Nöbet sayıları için loading state'i
    const MAX_DATE_RANGE = 31;
    const [calendarName, setCalendarName] = useState(''); // Takvim ismi
    const [maxShiftCount, setMaxShiftCount] = useState(1); // Maksimum nöbet sayısı (adminType'e göre belirlenecek)

    const daysOfWeek = [
        { value: 'Monday', label: 'Pazartesi' },
        { value: 'Tuesday', label: 'Salı' },
        { value: 'Wednesday', label: 'Çarşamba' },
        { value: 'Thursday', label: 'Perşembe' },
        { value: 'Friday', label: 'Cuma' },
        { value: 'Saturday', label: 'Cumartesi' },
        { value: 'Sunday', label: 'Pazar' },
    ];

    const filterButtons = [
        { type: 'weekly', label: 'Haftalık' },
        { type: 'monthly', label: 'Aylık' },
        { type: 'yearly', label: 'Yıllık' },
        { type: 'all', label: 'Tümü' },
    ];

    // API'den adminType değerini al ve maksimum nöbet sayısını belirle
    useEffect(() => {
        const fetchAdminType = async () => {
            try {
                const response = await api.post('/api/adminType', {}, {
                    withCredentials: true,
                });

                const adminType = response.data.data; // Örnek: 0, 1, 2, 3

                // Gelen adminType değerine göre maksimum nöbet sayısını belirle
                if (adminType === 0) {
                    setMaxShiftCount(1); // Sadece 1. vardiya
                } else if (adminType === 1 || adminType === 2) {
                    setMaxShiftCount(3); // 1, 2, 3. vardiyalar
                } else if (adminType === 3) {
                    setMaxShiftCount(5); // Tüm vardiyalar
                }
            } catch (error) {
                console.error("AdminType alınırken hata oluştu:", error);
            }
        };

        fetchAdminType(); // API'yi çağır
    }, []);

    // ShiftCounts değerini güncellerken maksimum değeri kontrol et
    const handleShiftCountChange = (value) => {
        if (value <= maxShiftCount) {
            setShiftCounts(value);
        } else {
            showWarning(`Maksimum nöbet sayısı: ${maxShiftCount}`);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Sadece istemci tarafında çalışacak kod
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/api/data');
            if (response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            } else {
                setUsers([]); // Yanıt beklenen formatta değilse boş dizi ata
            }
        } catch (error) {
            setUsers([]); // Hata durumunda boş dizi ata
        }
    };


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/api/departmanStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });
                // API yanıtının beklenen formatta olduğundan emin olun
                if (response.data && Array.isArray(response.data.data.data)) {
                    setDepartments(response.data.data.data); // Veriyi state'e ata
                } else {
                    setDepartments([]); // Yanıt beklenen formatta değilse boş dizi ata
                }
            } catch (error) {

                setDepartments([]); // Hata durumunda boş dizi ata
            }
        };
        fetchDepartments();
    }, []);

    const handleShiftDayChange = (day) => {
        setSelectedShiftDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day); // Seçili günü kaldır
            }
            return [...prev, day]; // Seçili günü ekle
        });
    };

    useEffect(() => {
        const fetchCountOfCalendar = async () => {
            try {
                const response = await api.get("/api/countOfCallender", {
                    withCredentials: true,
                });
                setCalendarCount(response.data.countOfCallendars);
            } catch (error) {

            }
        };

        fetchCountOfCalendar();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/userStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    },
                });

                // API yanıtını güvenli hale getir
                const users = response.data?.users.data;

                if (Array.isArray(users)) {
                    const sortedUsers = users
                        .filter(user => user.firstname && user.lastname) // Eksik verileri filtrele
                        .map(user => ({
                            ...user,
                            fullname: `${user.firstname} ${user.lastname}`.toLowerCase(),
                        }))
                        .sort((a, b) => a.fullname.localeCompare(b.fullname));

                    setUsers(sortedUsers);
                } else {
                    setUsers([]); // Yanıt beklenen formatta değilse boş dizi ata
                }
            } catch {
                setUsers([]); // Hata durumunda boş dizi ata
            }
        };
        fetchUsers();
    }, []);


    const handleOffDateClick = (date) => {
        // Eğer yanlışlıkla array gelirse (bazen oluyor)
        if (Array.isArray(date)) {
            date = date[0]; // Sadece ilk tarihi al
        }

        setSelectedOffDates(prev => {
            const dateStr = date.toISOString().split('T')[0];
            const existingIndex = prev.findIndex(d => d.toISOString().split('T')[0] === dateStr);

            if (existingIndex > -1) {
                return prev.filter((_, i) => i !== existingIndex);
            } else {
                return [...prev, date];
            }
        });
    };

    const handleDepartmentSelect = (departmentId) => {
        setSelectedDepartments(prev => {
            if (prev.includes(departmentId)) {
                return prev.filter(id => id !== departmentId); // Seçili departmanı kaldır
            }
            return [...prev, departmentId]; // Seçili departmanı ekle
        });
    };


    const handleDateClick = (value) => {
        if (selectionMode === 'range' && Array.isArray(value)) {
            const [start, end] = value;

            // Tarih aralığını kontrol et
            const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (diffInDays > MAX_DATE_RANGE) {
                showWarning(`En fazla ${MAX_DATE_RANGE} günlük aralık seçebilirsiniz.`);
                return;
            }

            // Tarih aralığını hesapla
            const dates = [];
            const currentDate = new Date(start);
            while (currentDate <= end) {
                dates.push(new Date(currentDate)); // Tarihleri diziye ekle
                currentDate.setDate(currentDate.getDate() + (dayInterval || 1)); // dayInterval 0 ise 1 gün ekle
            }

            // Mevcut seçili tarihlerle yeni tarihleri birleştir ve benzersiz hale getir
            setSelectedDates(prev => {
                const newDates = new Set(prev.map(date => date.toISOString())); // Mevcut tarihleri Set'e ekle
                dates.forEach(date => newDates.add(date.toISOString())); // Yeni tarihleri ekle
                return Array.from(newDates).map(dateStr => new Date(dateStr)); // Set'i tekrar diziye çevir
            });

        } else if (!Array.isArray(value)) {
            // Tekli seçim modu
            setSelectedDates(prev => {
                const dateStr = value.toISOString();
                const newDates = new Set(prev.map(date => date.toISOString())); // Mevcut tarihleri Set'e ekle
                if (newDates.has(dateStr)) {
                    newDates.delete(dateStr); // Tarih zaten varsa kaldır
                } else {
                    newDates.add(dateStr); // Tarih yoksa ekle
                }
                return Array.from(newDates).map(dateStr => new Date(dateStr)); // Set'i tekrar diziye çevir
            });
        }

        // Seçilen tarihleri API'ye göndermek için formatla
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Ay 0 tabanlı olduğu için +1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedDates = selectedDates.map(date => formatDate(date));
    };

    const tileContent = useCallback(({ date }) => {
        if (!dutySchedule) return null; // dutySchedule null ise null döndür
        const dateStr = date.toISOString().split('T')[0];
        const hasDuty = dutySchedule[dateStr];
        if (hasDuty) {
            return (
                <div className="text-xs mt-1">
                    {hasDuty.users?.map((user) => (
                        <div key={user.userId} className="font-semibold text-blue-600">
                            {user.userName}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    }, [dutySchedule]);

    const tileClassName = useCallback(({ date }) => {
        const dateStr = date.toISOString().split('T')[0];
        const isSelected = selectedDates.some(
            selectedDate => selectedDate.toISOString().split('T')[0] === dateStr
        );
        const hasDuty = dutySchedule && dutySchedule.hasOwnProperty(dateStr);
        return `${isSelected ? 'selected-date' : ''} ${hasDuty ? 'has-duty' : ''}`;
    }, [selectedDates, dutySchedule]);

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };


    const handleAssignDuty = async () => {
        if (selectedUsers.length === 0) {
            showWarning('Lütfen en az bir personel seçin');
            return;
        }

        if (selectedDates.length === 0) {
            showWarning('Lütfen en az bir tarih seçin');
            return;
        }

        if (selectedDepartments.length === 0) {
            showWarning('Lütfen en az bir departman seçin');
            return;
        }

        if (!calendarName) {
            showWarning('Lütfen takvim ismi girin');
            return;
        }

        setLoading(true); // Buton metnini "Takvim Oluşturuluyor..." yap

        try {
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const dataToSend = {
                callenderName: calendarName,
                condution: Number(dayInterval),
                shiftCounts: Number(shiftCounts),
                startDate: formatDate(selectedDates[0]),
                endDate: formatDate(selectedDates[selectedDates.length - 1]),
                departmans: selectedDepartments,
                activeusers: selectedUsers,
                specialOffDays: selectedOffDates.map(date => formatDate(date)),
                workdays: selectedShiftDays,
            };

            const response = await api.post('/api/createCallendar', dataToSend, {
                withCredentials: true,
            });

            if (response.data.success) {
                showSuccess('Nöbet atamaları başarıyla yapıldı');
                setDutySchedule(response.data.updatedSchedule);
                setSelectedDates([]);
                setSelectedUsers([]);
                setSelectedOffDates([]);
                setSelectedShiftDays([]);
                setSelectedDepartments([]);
                setCalendarName('');

                // Bilgiler güncelleniyor bildirimi göster
                showWarning('Bilgiler güncelleniyor...');

                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 2 saniye sonra sayfayı yenile
            } else {
                showError('Nöbet atama işlemi başarısız oldu');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    showWarning(error.response.data.message);
                } else if (error.response.status === 400) {
                    showError('Öncelik seviyesi acil olan bölüm boş olduğu için takvim oluşturulamadı. Lütfen daha fazla nöbetçi ya da daha az nöbet günü seçiniz.');
                } else {
                    showError(`Hata: ${error.response.data.message}`);
                }
            } else if (error.request) {
                showError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
            } else {
                showError(`Bir hata oluştu: ${error.message}`);
            }
        } finally {
            setLoading(false); // Buton metnini tekrar "Nöbet Ata" yap
        }
    };

    const fetchUsersTotalShiftCounts = async () => {
        setLoadingShiftCounts(true); // Yükleme başladı
        try {
            const response = await api.post('/api/usersTotalShiftCounts', { filterType }, {
                withCredentials: true,
            });

            if (response.data.success === "true") {
                setUsersTotalShiftCounts(response.data.data); // API yanıtındaki "data" kısmını al
            } else {
                showError('Nöbet sayıları alınamadı.');
            }
        } catch (error) {

            showError('Nöbet sayıları yüklenirken hata oluştu.');
        } finally {
            setLoadingShiftCounts(false); // Yükleme tamamlandı
        }
    };

    // Filtre türü değiştiğinde verileri yeniden çek
    useEffect(() => {
        fetchUsersTotalShiftCounts();
    }, [filterType]);


    return (

        <div className="min-h-screen bg-blue-300 ">
            <Sidebar />

            <main className='text-black flex-1 xl:ml-[40vh]  p-2 sm:p-10 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300'>

            <ScrollHandler />

                <div className=" mx-auto py-8">
                    <title>Nöbet Takvimi Oluşturma - NöbetX</title>
                    <meta
                        name="description"
                        content="Tek tuşla çalışanlarınız için yeni nöbet takvimleri oluşturun. Daha fazlası NöbetX.com'da."
                    />
                    <link rel="icon" href="/logoj.png" />
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mr-2">Nöbet Takvimi</h1>
                            <div className="calendar-count-container">
                                <button className="c-button c-button--gooey">
                                    <span className="calendar-count">
                                        Kalan Takvim Sayısı: {calendarCount !== null ? calendarCount : 'Yükleniyor...'}
                                    </span>
                                    <span className="purchase-text">
                                        <a href="/pricing" target="_blank" rel="noopener noreferrer">Satın Al</a>
                                    </span>
                                    <div className="c-button__blobs">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'block', height: 0, width: 0 }}>
                            <defs>
                                <filter id="goo">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
                                    <feBlend in="SourceGraphic" in2="goo"></feBlend>
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    <section className="relative">
                        {/* Loading overlay - tüm section'ı kaplayacak */}
                        {loading && (
                            <div className="absolute inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50 rounded-xl">
                                <div className="text-center">
                                    <div className="loading-container w-full min-h-screen flex items-center justify-center">
                                        <div className="loading-content page-wrapper flex flex-col items-center justify-center">
                                            <Logo />
                                            <p className="mt-4 text-2xl font-bold text-black">Takvim oluşturuluyor, lütfen bekleyin...</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 custom:grid-cols-3 gap-8">
                            {/* Sol Panel */}
                            <div className="lg:col-span-1 bg-white rounded-xl p-6">
                                {/* Takvim Seçim Butonları */}
                                <div className="mb-4 flex space-x-4">
                                    <button
                                        onClick={() => setActiveCalendar(1)}
                                        className={`px-4 py-2 rounded-full ${activeCalendar === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        Nöbet Tarihleri
                                        <span className="ml-1 relative group">
                                            <span className="text-gray-500 cursor-pointer">❓</span>
                                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                Aşağıdaki takvimden 1 adet başlangıç ve 1 adet bitiş tarihi seçerek nöbet listesinin hangi tarihler arsaında olacağını ayarlayabilirsiniz.
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveCalendar(2)}
                                        className={`px-4 py-2 rounded-full ${activeCalendar === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        Özel İzin Tarihleri
                                        <span className="ml-1 relative group">
                                            <span className="text-gray-500 cursor-pointer">❓</span>
                                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                Nöbet listesinde izinli olmasını istediğiniz tarihleri "Özel İzin Tarihleri" takviminden seçerek belirleyebilirsiniz.
                                            </span>
                                        </span>
                                    </button>
                                </div>

                                {/* Aktif Takvim */}
                                {activeCalendar === 1 && (
                                    <div>
                                        <div className="mb-4 flex space-x-4">
                                            {/* <button
                                                onClick={() => setSelectionMode('single')}
                                                className={`px-4 py-2 rounded-full ${selectionMode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                            >
                                                Tek Tarih Seçimi
                                            </button> */}
                                            {/* <button
                                                onClick={() => setSelectionMode('range')}
                                                className={`px-4 py-2 rounded-full ${selectionMode === 'range' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                            >
                                                Tarih Aralığı Seçimi
                                            </button> */}
                                        </div>
                                        <div className='calendar-container-s'>
                                            <Calendar
                                                onChange={handleDateClick}
                                                value={selectedDates}
                                                selectRange={selectionMode === 'range'}
                                                tileContent={tileContent}
                                                tileClassName={tileClassName}
                                                className="custom-calendar w-full h-[560px]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeCalendar === 2 && (
                                    <Calendar
                                        onChange={handleOffDateClick}
                                        value={selectedOffDates}
                                        selectRange={false}
                                        tileContent={(props) => <div>{/* Özel içerik */}</div>}
                                        className="w-full h-[700px] custom-calendar"
                                        tileClassName={({ date, view }) => {
                                            const dateStr = date.toISOString().split('T')[0];
                                            const isSelected = selectedOffDates.some(
                                                d => d.toISOString().split('T')[0] === dateStr
                                            );
                                            return isSelected ? 'selected-single-date' : '';
                                        }}
                                        tileDisabled={({ date, view }) => view === 'month' && date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                )}
                            </div>

                            {/* Sağ Panel */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-xl">
                                    <h2 className="text-xl font-semibold mb-6">Nöbet Ataması</h2>
                                    {/* Departman Seçimi */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-medium text-gray-700">Departmanlar ({selectedDepartments.length}) <span className="ml-1 relative group">
                                                <span className="text-gray-500 cursor-pointer">❓</span>
                                                <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                    Nöbet listenizde yer almasını istediğiniz departmanları aşağıdan seçiniz.
                                                </span>
                                            </span></h3>
                                            {/* Hepsini Seç Butonu */}
                                            <button
                                                onClick={() => {
                                                    if (selectedDepartments.length === departments.length) {
                                                        // Tümü seçiliyse, hepsini kaldır
                                                        setSelectedDepartments([]);
                                                    } else {
                                                        // Tümü seçili değilse, hepsini seç
                                                        setSelectedDepartments(departments.map((dept) => dept.id));
                                                    }
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {selectedDepartments.length === departments.length
                                                    ? "Seçimi Kaldır"
                                                    : "Hepsini Seç"}
                                            </button>
                                        </div>

                                        {departments.length > 0 ? (
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto grid grid-cols-2 2xl:grid-cols-3">
                                                {departments.map((department) => (
                                                    <label
                                                        key={department.id}
                                                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDepartments.includes(department.id)}
                                                            onChange={() => handleDepartmentSelect(department.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2">{department.departmanName}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">Departman bulunamadı.</p>
                                        )}
                                    </div>


                                    {/* Kullanıcı Seçimi */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-medium text-gray-700">
                                                Nöbetçileri Seç ({selectedUsers.length}) <span className="ml-1 relative group">
                                                    <span className="text-gray-500 cursor-pointer">❓</span>
                                                    <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                        Nöbet listenizde yer almasını istediğiniz personeli aşağıdan seçiniz.
                                                    </span>
                                                </span>
                                            </h3>
                                            {/* Hepsini Seç Butonu */}
                                            <button
                                                onClick={() => {
                                                    if (selectedUsers.length === users.length) {
                                                        // Tümü seçiliyse, hepsini kaldır
                                                        setSelectedUsers([]);
                                                    } else {
                                                        // Tümü seçili değilse, hepsini seç
                                                        setSelectedUsers(users.map((user) => user.id));
                                                    }
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {selectedUsers.length === users.length ? "Seçimi Kaldır" : "Hepsini Seç"}
                                            </button>
                                        </div>

                                        <div className="space-y-2 max-h-[200px] overflow-y-auto grid grid-cols-2">
                                            {users
                                                .sort((a, b) => {
                                                    const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
                                                    const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
                                                    return nameA.localeCompare(nameB);
                                                })
                                                .map((user) => (
                                                    <label
                                                        key={user.id}
                                                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user.id)}
                                                            onChange={() => handleUserSelect(user.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2">{`${user.firstname} ${user.lastname}`}</span>
                                                    </label>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Nöbet Sayıları */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Nöbet Sayıları<span className="ml-1 relative group">
                                            <span className="text-gray-500 cursor-pointer">❓</span>
                                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                Personelin toplam kaç gün nöbet tuttuğunu gösterir.
                                            </span>
                                        </span></h3>
                                        <div className="flex flex-wrap space-x-2 mb-4">
                                            {filterButtons.map((button) => (
                                                <button
                                                    key={button.type}
                                                    onClick={() => setFilterType(button.type)}
                                                    className={`px-4 py-2 mb-2 rounded-full ${filterType === button.type
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200'
                                                        }`}
                                                >
                                                    {button.label}
                                                </button>
                                            ))}
                                        </div>
                                        {loadingShiftCounts ? (
                                            <Loading />
                                        ) : usersTotalShiftCounts.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-4">
                                                {usersTotalShiftCounts.map((user) => (
                                                    <div
                                                        key={user.username}
                                                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded"
                                                    >
                                                        <span className="text-sm font-medium">{user.username}</span>
                                                        <span className="text-lg font-semibold">{user.totalNobetCounts}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className=" text-gray-500">
                                                Hiç nöbet sayısı bulunmamaktadır.
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                            <div className='bg-white p-6 rounded-xl '>
                                {/* Takvim İsmi Input Alanı */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Takvim İsmi</label>
                                    <input
                                        type="text"
                                        value={calendarName}
                                        onChange={(e) => setCalendarName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="Takvim ismi girin"
                                    />
                                </div>

                                {/* Şartlar Bölümü */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Şartlar</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <span className="mr-2">Nöbet Aralığı (Gün):</span>
                                            <input
                                                type="number"
                                                value={dayInterval}
                                                onChange={(e) => setDayInterval(Number(e.target.value))}
                                                className="w-16 p-1 border border-gray-300 rounded"
                                                min="1"
                                            /><span className="ml-1 relative group">
                                                <span className="text-gray-500 cursor-pointer">❓</span>
                                                <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                    Personelin kaç gün ara ile nöbet tutacağını belirler. "0 = Her gün nöbet tutulur."
                                                </span>
                                            </span>
                                        </label>
                                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <span className="mr-2">Nöbet Sayısı:</span>
                                            <input
                                                type="number"
                                                value={shiftCounts}
                                                onChange={(e) => handleShiftCountChange(Number(e.target.value))}
                                                className="w-16 p-1 border border-gray-300 rounded"
                                                min="1"
                                                max={maxShiftCount}
                                            /><span className="ml-1 relative group">
                                                <span className="text-gray-500 cursor-pointer">❓</span>
                                                <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                                    Nöbet listesinde kaç vardiyanın yer alacağını tanımlar.
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>


                                {/* Çalışma Günleri Seçimi */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Çalışma Günleri<span className="ml-1 relative group">
                                        <span className="text-gray-500 cursor-pointer">❓</span>
                                        <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                            Personelin genel çalışma günlerini seçin. Seçilmeyen gün için oluşturacağınız nöbet listesinde herhangi bir personel ataması yapılmayacaktır.
                                        </span>
                                    </span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {daysOfWeek.map((day) => (
                                            <label
                                                key={day.value}
                                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedShiftDays.includes(day.value)}
                                                    onChange={() => handleShiftDayChange(day.value)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Nöbet Günü Seçili Tarihler */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Nöbet Tarihleri ({selectedDates.length})
                                        </h3>
                                        {/* Seçilen Tüm Tarihleri Kaldır Butonu */}
                                        <button
                                            onClick={() => setSelectedDates([])} // Tüm tarihleri kaldır
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Seçilen Tüm Tarihleri Kaldır
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                        {selectedDates.map((date) => (
                                            <div
                                                key={date.toISOString()}
                                                className="text-blue-600 bg-blue-50 p-2 rounded flex justify-between items-center"
                                            >
                                                <span>
                                                    {date.toLocaleDateString("tr-TR", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                                {/* <button
                                                    onClick={() => handleDateClick(date)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* İzin Günü Seçili Tarihler */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Özel İzin Tarihleri ({selectedOffDates.length})
                                    </h3>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                        {selectedOffDates.map(date => (
                                            <div
                                                key={date.toISOString()}
                                                className="text-blue-600 bg-blue-50 p-2 rounded flex justify-between items-center"
                                            >
                                                <span>
                                                    {date.toLocaleDateString('tr-TR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <button
                                                    onClick={() => handleOffDateClick(date)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>



                                {/* Atama Butonu */}
                                <button
                                    onClick={handleAssignDuty}
                                    disabled={loading || selectedUsers.length === 0 || selectedDates.length === 0}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors
        ${loading || selectedUsers.length === 0 || selectedDates.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-b from-blue-600 to-purple-600 text-white'
                                        }`}
                                >
                                    {loading ? 'Takvim Oluşturuluyor...' : 'Nöbet Ata'}
                                </button>
                            </div>
                        </div>
                    </section>
                    <div className='py-6 rounded-xl bg-white mt-5' id="calendar_view">
                        <PastDutyCalendar />
                    </div>
                    {/* Nöbet Talepleri Kartı */}
                    <div className="bg-white rounded-2xl overflow-hidden mt-5 mb-12">
                        <div className="p-6" id="duty_requests">
                            <DutyRequests initialRequests={DutyRequests} />
                        </div>
                    </div>

                </div>
            </main>
            <MobileBottomBar />

        </div>
    );
}