"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RequestsAccordion from "@/app/components/RequestsAccordion";
import Link from "next/link";
import api from "../../../loaders/baseApi";
import Loading from "@/app/loading";
import { useNotification } from '@/app/components/NotificationContext';
import SidebarUser from '@/app/components/side_bar_user';
import MobileBottomBarUser from "@/app/components/mobile_bottom_bar_user";

export default function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offDays, setOffDays] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { showSuccess, showError, showWarning } = useNotification();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedShiftDay, setSelectedShiftDay] = useState('');
    const [showSelection, setShowSelection] = useState(false);
    const [specialTaskReason, setSpecialTaskReason] = useState('');
    const [whichShift, setWhichShift] = useState('');
    const [dutySchedule, setDutySchedule] = useState([]);
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);
    const [status, setStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedShift, setSelectedShift] = useState('');
    const [shiftReason, setShiftReason] = useState('');
    const [shiftRequests, setShiftRequests] = useState([]); // Vardiya istekleri
    const [shiftStatus, setShiftStatus] = useState("all"); // Vardiya istekleri durumu
    const [isShiftRequestsOpen, setIsShiftRequestsOpen] = useState(false); // Akordiyon durumu
    const [shiftOptions, setShiftOptions] = useState([]);


    const priorityOptions = {
        low: "Düşük",
        medium: "Orta",
        urgent: "Acil",
    };

    const dayTranslations = {
        Monday: "Pazartesi",
        Tuesday: "Salı",
        Wednesday: "Çarşamba",
        Thursday: "Perşembe",
        Friday: "Cuma",
        Saturday: "Cumartesi",
        Sunday: "Pazar",
    };

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

    function getDutytStyles(status) {
        switch (status) {
            case 'pending':
                return { container: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-800', text: 'Beklemede' };
            case 'approved':
                return { container: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800', text: 'Onaylandı' };
            case 'rejected':
                return { container: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800', text: 'Reddedildi' };
            default:
                return { container: 'bg-gray-50 border-gray-200', badge: 'bg-gray-100 text-gray-800', text: 'Bilinmiyor' };
        }
    }

    useEffect(() => {
        const fetchAdminType = async () => {
            try {
                // API'den adminType değerini al
                const response = await api.post('/api/adminType', {}, {
                    withCredentials: true,
                });

                // API'den gelen data değerini al
                const adminType = response.data.data; // Örnek: 0, 1, 2, 3

                // Gelen adminType değerine göre vardiya seçeneklerini belirle
                let options = [];
                if (adminType === 0) {
                    options = [{ value: "1", label: "1. Vardiya" }];
                } else if (adminType === 1) {
                    options = [
                        { value: "1", label: "1. Vardiya" },
                        { value: "2", label: "2. Vardiya" },
                        { value: "3", label: "3. Vardiya" },
                    ];
                } else if (adminType === 2) {
                    options = [
                        { value: "1", label: "1. Vardiya" },
                        { value: "2", label: "2. Vardiya" },
                        { value: "3", label: "3. Vardiya" },
                    ];
                }
                else if (adminType === 3) {
                    options = [
                        { value: "1", label: "1. Vardiya" },
                        { value: "2", label: "2. Vardiya" },
                        { value: "3", label: "3. Vardiya" },
                        { value: "4", label: "4. Vardiya" },
                        { value: "5", label: "5. Vardiya" },
                    ];
                }

                // Vardiya seçeneklerini state'e kaydet
                setShiftOptions(options);
            } catch (error) {
                console.error("AdminType alınırken hata oluştu:", error);
            }
        };

        fetchAdminType(); // API'yi çağır
    }, []);

    // Silme işlemi için fonksiyon
    const handleDeleteSpecialTask = async (id) => {
        try {
            const response = await api.post('/api/deleteSpecialTask', { id }, {
                withCredentials: true,
            });

            if (response.data.success === true || response.data.success === "true") {
                showSuccess('Nöbet talebi başarıyla silindi!');
                // Silinen talebi listeden kaldır
                setDutySchedule(dutySchedule.filter(task => task.id !== id));
            } else {
                showError('Nöbet talebi silinirken bir hata oluştu!');
            }
        } catch (error) {
            showError('Bir hata oluştu!');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure filterType is valid
                const validFilterTypes = ["weekly", "monthly", "yearly", "all"];
                const validatedFilterType = validFilterTypes.includes(filterType) ? filterType : "all";
                const duties = await api.get(`/api/userSpecialTaskStore`, {
                    params: {
                        filterType: validatedFilterType, // Use validated filterType
                        status,
                        countOfPaginate: 1000, // Merge params into a single object
                    },
                    withCredentials: true,
                });

                setDutySchedule(duties.data.data.data);
                setLoading(false);
            } catch {
                setError("Bir hata oluştu");
                setLoading(false);
            }
        };

        fetchData();
    }, [id, filterType, status]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/api/departmanStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    },
                });
                if (response.data && response.data.success === true && Array.isArray(response.data.data.data)) {
                    setDepartments(response.data.data.data);
                } else {
                    // Handle error
                }
            } catch (error) {
                // Handle error
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const userResponse = await api.get(`/api/userData`, {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    },
                });
                if (userResponse.data && userResponse.data.success === "true" && userResponse.data.data.userData) {
                    const userData = userResponse.data.data.userData;
                    setCurrentUser(userData);

                    if (userData.id === id) {
                        setUser(userData);
                    } else {
                        const usersResponse = await api.get('/api/userStore', {
                            withCredentials: true,
                            params: {
                                countOfPaginate: 1000
                            },
                        });
                        if (usersResponse.data && usersResponse.data.success === "true" && Array.isArray(usersResponse.data.data)) {
                            const allUsers = usersResponse.data.data;
                            const selectedUser = allUsers.find((u) => u.id === id);
                            if (selectedUser) {
                                setUser(selectedUser);
                            } else {
                                setError("Kullanıcı bulunamadı!");
                            }
                        } else {
                            setError("Kullanıcı listesi alınamadı!");
                        }
                    }
                } else {
                    setError("Kullanıcı bilgileri alınamadı!");
                }
            } catch (err) {
                setError(`Bir hata oluştu: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchOffDays = async () => {
            try {
                const response = await api.get(`/api/countOfOffDays`, {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    },
                });
                setOffDays(response.data.total_off_days);
            } catch (err) {
                setError(`İzin günleri alınırken hata oluştu: ${err.response?.data?.message || err.message}`);
            }
        };

        fetchUserData();
        fetchOffDays();
    }, [id]);

    useEffect(() => {
        const fetchShiftRequests = async () => {
            if (!isShiftRequestsOpen) return; // Akordiyon kapalıysa API'ye istek gönderme

            try {
                const response = await api.post('/api/UserinventorieswishStore', {
                    countOfPaginate: 1000, // Zorunlu parametre
                    status: shiftStatus, // Durum parametresi
                    filterType: "all", // Filtre türü
                }, {
                    withCredentials: true,
                });

                if (response.data && (response.data.success === true || response.data.success === "true")) {
                    setShiftRequests(response.data.data.data);
                } else {
                    setError("Vardiya istekleri alınamadı.");
                }
            } catch {
                setError("Vardiya istekleri alınırken bir hata oluştu.");
            }
        };

        fetchShiftRequests();
    }, [isShiftRequestsOpen, shiftStatus]); // shiftStatus değiştiğinde yeniden çek

    // İlk yüklemede sadece approved istekleri getir
    useEffect(() => {
        setShiftStatus("pending"); // Varsayılan olarak approved istekleri getir
    }, []); // Sadece bileşen ilk render edildiğinde çalışır

    const handleShiftRequest = async (e) => {
        e.preventDefault();

        if (!selectedShift || !shiftReason) {
            showWarning('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            const requestData = {
                whichShift: selectedShift,
                Reason: shiftReason,
            };

            const response = await api.post('/api/takeWhichShift', requestData, {
                withCredentials: true,
            });

            if (response.data.success === true || response.data.success === "true") {
                showSuccess('Vardiya talebi başarıyla gönderildi!');
                setSelectedShift('');
                setShiftReason('');
            } else {
                showWarning(response.data.message || 'Vardiya talebi gönderilirken bir hata oluştu!');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showWarning(error.response.data.message);
            } else {
                showError('Bir hata oluştu!');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDepartment || !selectedShiftDay || !specialTaskReason || !whichShift) {
            showWarning('Lütfen tüm alanları doldurun.');
            return;
        }

        // Gün etiketlerini tanımla
        const dayTags = {
            Monday: 'A',
            Tuesday: 'B',
            Wednesday: 'C',
            Thursday: 'D',
            Friday: 'E',
            Saturday: 'F',
            Sunday: 'G'
        };

        // Seçilen günün etiketini al
        const dayTag = dayTags[selectedShiftDay];

        // whichShift değerini gün etiketi ile birleştir
        const formattedWhichShift = `${dayTag}userCountsShift${whichShift}`;

        try {
            const requestData = {
                departmanName: selectedDepartment,
                shiftDay: selectedShiftDay,
                whichShift: formattedWhichShift, // Birleştirilmiş değeri kullan
                SpecialtaskReason: specialTaskReason,
            };

            const response = await api.post('/api/takeSpecialTask', requestData, {
                withCredentials: true,
                params: {
                    countOfPaginate: 1000
                },
            });

            // Backend'den gelen success değerini kontrol et
            if (response.data.success === true || response.data.success === 'true') {
                showSuccess('Nöbet talebi başarıyla gönderildi!');
                setSelectedDepartment('');
                setSelectedShiftDay('');
                setSpecialTaskReason('');
                setWhichShift('');
                setShowSelection(false);
            } else {
                // Backend'den gelen mesajı göster
                showWarning(response.data.message || 'Bekleyen bir özel çalışma talebiniz var!');
            }
        } catch (error) {
            // Check if error response exists and show it as a warning
            if (error.response && error.response.data && error.response.data.message) {
                showWarning(error.response.data.message);
            } else {
                showError('Bir hata oluştu!');
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-100 py-48 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg">
                    <h1 className="text-xl text-red-600">{error}</h1>
                    <p className="mt-2 text-gray-600">Lütfen daha sonra tekrar deneyin</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Loading />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 pb-24 text-black">
            <title>{`${user.firstname} ${user.lastname} - NöbetX`}</title>
            <meta
                name="description"
                content={`${user.firstname} ${user.lastname} için kullanıcı profili sayfası. Daha fazlası NöbetX.com'da.`}
            />
            <Link rel="icon" href="/logoj.png" />

            <SidebarUser />

            <div className="xl:ml-[40vh]  mx-auto p-2 sm:p-10 ">

                <div className="bg-white rounded-2xl overflow-hidden mb-8">
                    <RequestsAccordion userId={id} userName={user?.firstname} />
                </div>
                <div className="p-6 bg-white rounded-xl divide-y">
                    {/* Nöbet Talepleri Başlığı ve Filtreleme Butonları */}

                    <div className="mb-6">

                        <button
                            className="flex items-center w-full px-2 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Nöbet Talepleri {isRequestsOpen ? '▼' : '▶'}
                        </button>

                        {/* Filtreleme Butonları (Masaüstü Görünüm) */}
                        {isRequestsOpen && (
                            <div className="mt-6 flex space-x-4 mb-6 md:block hidden">
                                <button
                                    onClick={() => setStatus('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${status === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Hepsi
                                </button>
                                <button
                                    onClick={() => setStatus('approved')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Onaylanan
                                </button>
                                <button
                                    onClick={() => setStatus('rejected')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Reddedilen
                                </button>
                                <button
                                    onClick={() => setStatus('pending')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Beklemede
                                </button>
                            </div>
                        )}

                        {/* Filtreleme Butonları (Mobil Görünüm) */}
                        {isRequestsOpen && (
                            <div className="flex flex-wrap justify-center space-x-4 gap-y-2 mb-6 md:hidden mt-6">
                                <button
                                    onClick={() => setStatus('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${status === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Hepsi
                                </button>
                                <button
                                    onClick={() => setStatus('approved')}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Onaylanan
                                </button>
                                <button
                                    onClick={() => setStatus('rejected')}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Reddedilen
                                </button>
                                <button
                                    onClick={() => setStatus('pending')}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    Beklemede
                                </button>
                            </div>
                        )}

                        {/* Nöbet Talepleri Listesi */}
                        {isRequestsOpen && (
                            <div className="mt-4">
                                {dutySchedule.length > 0 ? (
                                    dutySchedule.map(duty => {
                                        const { container, badge, text } = getDutytStyles(duty.status);
                                        return (
                                            <div key={duty.id} className={`p-4 mb-6 rounded-lg border ${container} relative`}>
                                                <div className="text-black"><strong>Talep Edilen Gün: </strong>{dayTranslations[duty.shiftDay] || duty.shiftDay}</div>
                                                <div className={`absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${badge}`}>
                                                    {text}
                                                </div>
                                                <div className="text-gray-600 text-sm"><strong>Departman: </strong>{duty.departmanName}</div>
                                                <div className="text-gray-600 text-sm"><strong>Talep Nedeni:</strong> {duty.SpecialtaskReason}</div>
                                                <div className="text-gray-600 text-sm"><strong>Vardiya:</strong> {duty.whichShift}</div>
                                                {duty.ResponsSpecialtaskReason && (
                                                    <div className="text-red-600 text-sm"><strong>Reddedilme Sebebi:</strong> {duty.ResponsSpecialtaskReason}</div>
                                                )}
                                                <div className="text-gray-600 text-sm"><strong>Talep Tarihi:</strong> {formatDate(duty.created_at)}</div>
                                                {duty.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleDeleteSpecialTask(duty.id)}
                                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
                                                    >
                                                        Talebi Sil
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-4 text-gray-500">
                                        Bu kategoriye ait nöbet talebi bulunamamıştır.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nöbet Talebi Oluşturma Formu */}
                    <div className="flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full relative">
                            <p className="text-xl font-semibold text-gray-800 mb-4">Özel Nöbet Talebi Oluştur</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1">
                                    <label htmlFor="departman" className="mr-4 pb-2 font-bold text-black">Departman Seç</label>
                                    <select
                                        id="departman"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="text-black">Departman Seçin</option>
                                        {departments.map((dep, index) => (
                                            <option key={index} value={dep.departmanName}>
                                                {dep.departmanName} - {priorityOptions[dep.priority] || "Bilinmiyor"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1">
                                    <label htmlFor="shiftDay" className="mr-4 pb-2 font-bold">Vardiya Günü Seç</label>
                                    <select
                                        id="shiftDay"
                                        value={selectedShiftDay}
                                        onChange={(e) => setSelectedShiftDay(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Vardiya Günü Seçin</option>
                                        <option value="Monday">Pazartesi</option>
                                        <option value="Tuesday">Salı</option>
                                        <option value="Wednesday">Çarşamba</option>
                                        <option value="Thursday">Perşembe</option>
                                        <option value="Friday">Cuma</option>
                                        <option value="Saturday">Cumartesi</option>
                                        <option value="Sunday">Pazar</option>
                                    </select>
                                </div>

                                {/* Vardiya Seçimi */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700">Vardiya Seç</label>
                                    <select
                                        value={whichShift}
                                        onChange={(e) => setWhichShift(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Vardiya Seçiniz</option>
                                        {shiftOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1">
                                    <label htmlFor="specialTaskReason" className="mr-4 pb-2 font-bold">Özel Görev Nedeni</label>
                                    <textarea
                                        id="specialTaskReason"
                                        value={specialTaskReason}
                                        onChange={(e) => setSpecialTaskReason(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Özel görevin nedenini açıklayın..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                                     py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Nöbet Talebini Gönder
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
                <div className="flex items-center justify-center mt-8">

                    <div className="bg-white rounded-lg p-6 w-full relative">
                        <div className="bg-white rounded overflow-hidden mb-8">
                            <button
                                className="flex items-center w-full px-2 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                onClick={() => setIsShiftRequestsOpen(!isShiftRequestsOpen)}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Vardiya İstekleri {isShiftRequestsOpen ? '▼' : '▶'}
                            </button>

                            {/* Filtreleme Butonları */}
                            {isShiftRequestsOpen && (
                                <div className="mt-6 flex space-x-4 mb-6">
                                    <button
                                        onClick={() => setShiftStatus('approved')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${shiftStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        Onaylanan
                                    </button>
                                    <button
                                        onClick={() => setShiftStatus('rejected')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${shiftStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        Reddedilen
                                    </button>
                                    <button
                                        onClick={() => setShiftStatus('pending')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${shiftStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        Beklemede
                                    </button>
                                </div>
                            )}

                            {/* Vardiya İstekleri Listesi */}
                            {isShiftRequestsOpen && (
                                <div className="mt-4">
                                    {shiftRequests.length > 0 ? (
                                        shiftRequests.map((request) => {
                                            const { container, badge, text } = getDutytStyles(request.status);
                                            return (
                                                <div key={request.id} className={`p-4 mb-6 rounded-lg border ${container} relative`}>
                                                    <div className="text-black"><strong>Vardiya:</strong> {request.whichShift}</div>
                                                    <div className={`absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${badge}`}>
                                                        {text}
                                                    </div>
                                                    <div className="text-gray-600 text-sm"><strong>Talep Nedeni:</strong> {request.Reason}</div>
                                                    {request.ResponsReason && (
                                                        <div className="text-red-600 text-sm"><strong>Reddedilme Sebebi:</strong> {request.ResponsReason}</div>
                                                    )}
                                                    <div className="text-gray-600 text-sm"><strong>Talep Tarihi:</strong> {formatDate(request.created_at)}</div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-4 text-gray-500">
                                            Bu kategoriye ait vardiya talebi bulunamamıştır.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xl font-semibold text-gray-800 mb-4">Vardiya Talebi Oluştur</p>
                        <form onSubmit={handleShiftRequest} className="space-y-6">
                            <div className="grid grid-cols-1">
                                <label htmlFor="shift" className="mr-4 pb-2 font-bold">Vardiya Seç</label>
                                <select
                                    id="shift"
                                    value={selectedShift}
                                    onChange={(e) => setSelectedShift(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Vardiya Seçin</option>
                                    {shiftOptions.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1">
                                <label htmlFor="shiftReason" className="mr-4 pb-2 font-bold">Talep Nedeni</label>
                                <textarea
                                    id="shiftReason"
                                    value={shiftReason}
                                    onChange={(e) => setShiftReason(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Vardiya talebinizin nedenini açıklayın..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                         py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Vardiya Talebini Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <MobileBottomBarUser />
            </div>
        </div>

    );
}