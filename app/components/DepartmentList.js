import React, { useState, useEffect } from "react";
import { useNotification } from '@/app/components/NotificationContext';
import api from "@/app/loaders/baseApi";
import OffdayModal from "@/app/components/OffdayModal";
import OffdayListModal from "@/app/components/OffdayListModal";
import ShiftModal from "@/app/components/ShiftModal";

const DepartmentList = ({ onDelete, onUpdatePriority, onUpdateUserCounts }) => {
    const [departments, setDepartments] = useState([]);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [shiftData, setShiftData] = useState([]);
    const [updatedUserCounts, setUpdatedUserCounts] = useState({});
    const { showError, showSuccess } = useNotification();
    const [, setAdminID] = useState("");

    // OffdayModal ve OffdayListModal için state'ler
    const [offdayModalOpen, setOffdayModalOpen] = useState(false);
    const [selectedDepartmentForOffday, setSelectedDepartmentForOffday] = useState(null);
    const [offdayListModalOpen, setOffdayListModalOpen] = useState(false);
    const [selectedDepartmentForOffdays, setSelectedDepartmentForOffdays] = useState(null);
    const [offdayList, setOffdayList] = useState({ daily: [], weekly: [] });
    const [, setOffDayofweek] = useState("");
    const [, setOffdayStart] = useState("");
    const [, setOffdayEnd] = useState("");

    // ShiftModal için state'ler
    const [shiftModalOpen, setShiftModalOpen] = useState(false);
    const [selectedDepartmentForShift, setSelectedDepartmentForShift] = useState(null);

    // Renk değiştirme için state'ler
    const [backgroundColor, setBackgroundColor] = useState(""); // Renk seçici için
    const [manualRgb, setManualRgb] = useState(""); // Manuel RGB girişi için

    const priorities = ["low", "medium", "urgent"];
    const prioritiesTranslation = {
        low: "Düşük",
        medium: "Orta",
        urgent: "Acil",
    };

    const daysOfWeek = ["A", "B", "C", "D", "E", "F", "G"]; // A: Pazartesi, B: Salı, ..., G: Pazar
    const shifts = ["1", "2", "3", "4", "5"]; // Vardiyalar

    // Departmanları çekme işlemi
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get("/api/departmanStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });

                if (res.status === 200 && res.data.success) {
                    setDepartments(res.data.data.data); // API'den gelen departmanları state'e ata
                } else {
                    showError("Departmanlar yüklenirken bir hata oluştu.");
                }
            } catch (err) {
                showError(err.response?.data?.message || "Departmanlar yüklenirken bir hata oluştu.");
            }
        };

        fetchDepartments();
    }, [showError]);

    const handleEditClick = (department) => {
        if (editingDepartment === department.departmanName) {
            setEditingDepartment(null); // Düzenleme modunu kapat
        } else {
            setEditingDepartment(department.departmanName);
            setSelectedDay(""); // Gün seçimini sıfırla
            setShiftData([]); // Vardiya verilerini sıfırla
            setUpdatedUserCounts({}); // Güncellenen çalışan sayılarını sıfırla
            setBackgroundColor(`#${department.RgbNumber.replace(/,/g, "")}`); // Renk seçiciyi güncelle
            setManualRgb(department.RgbNumber); // Manuel RGB girişini güncelle
        }
    };

    const handleUserCountChange = (shift, newUserCount) => {
        setUpdatedUserCounts((prev) => ({
            ...prev,
            [shift]: newUserCount,
        }));
    };

    const handleSave = async () => {
        if (!editingDepartment || !selectedDay) {
            alert("Lütfen bir gün seçin.");
            return;
        }

        const departmentToUpdate = departments.find((d) => d.departmanName === editingDepartment);
        if (!departmentToUpdate) {
            showError("Departman bulunamadı.");
            return;
        }

        try {
            // Tüm güncellenen çalışan sayılarını API'ye gönder
            for (const [shift, userCount] of Object.entries(updatedUserCounts)) {
                const identifier = `${selectedDay}userCountsShift${shift}`;
                await onUpdateUserCounts(departmentToUpdate.id, identifier, userCount);
            }

            // API'den başarılı yanıt alındıktan sonra departments state'ini güncelle
            const updatedDepartments = departments.map((department) => {
                if (department.departmanName === editingDepartment) {
                    // Seçilen gün ve vardiyalar için güncellenmiş çalışan sayılarını ekleyin
                    const updatedDepartment = { ...department };
                    for (const [shift, userCount] of Object.entries(updatedUserCounts)) {
                        updatedDepartment[`${selectedDay}userCountsShift${shift}`] = userCount;
                    }
                    return updatedDepartment;
                }
                return department;
            });

            setDepartments(updatedDepartments); // State'i güncelle
            showSuccess("Çalışan sayıları başarıyla güncellendi.");
            setEditingDepartment(null); // Düzenleme modunu kapat
        } catch (err) {
            showError(err.response?.data?.message || "Çalışan sayıları güncellenirken bir hata oluştu.");
        }
    };

    const getTextColor = (rgb) => {
        const [r, g, b] = rgb.split(',').map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "black" : "white";
    };

    const handleDaySelection = (day, department) => {
        setSelectedDay(day);

        // Seçilen güne ait vardiyaları ve çalışan sayılarını al
        const selectedDepartment = department || departments.find((d) => d.departmanName === editingDepartment);

        if (!selectedDepartment) {

            return;
        }

        const shiftsForDay = shifts.map((shift) => ({
            shift,
            userCount: selectedDepartment[`${day}userCountsShift${shift}`] || 0, // Varsayılan değer olarak 0 kullan
        }));

        setShiftData(shiftsForDay);
    };

    const handleOpenShiftModal = (department) => {
        setSelectedDepartmentForShift(department);
        setShiftModalOpen(true);
        handleDaySelection("", department); // Varsayılan olarak bir gün seçimi yap
    };

    // İzin silme işlemi
    const handleDeleteOffday = async (departmanOffDayID) => {
        try {
            if (!departmanOffDayID) {
                showError("İzin ID'si bulunamadı. Lütfen tekrar deneyin.");
                return;
            }

            const res = await api.post(
                "/api/departmanOffDayDelete",
                { departmanOffDayID }, // Silinecek iznin ID'si
                { withCredentials: true }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("İzin başarıyla silindi.");

                // İzin listesini güncelle
                setOffdayList((prev) => ({
                    daily: prev.daily.filter((offday) => offday.id !== departmanOffDayID),
                    weekly: prev.weekly.filter((offday) => offday.id !== departmanOffDayID),
                }));
            } else {
                showError("İzin silinemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "İzin silinirken bir hata oluştu.");
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get("/api/userData", {
                    withCredentials: true,
                });

                if (res.status === 201 && res.data.success === "true") { // success değeri string olarak "true" geliyor

                    setAdminID(res.data.data.userData.adminID); // Doğru erişim yolu
                } else {
                    showError("Kullanıcı bilgileri alınamadı.");
                }
            } catch (err) {

                showError(err.response?.data?.message || "Kullanıcı bilgileri alınırken bir hata oluştu.");
            }
        };

        fetchUserData();
    }, [showError]);

    const fetchDepartmentOffdays = async (departmanID) => {
        try {
            const res = await api.post(
                "/api/DepartmanOffDayStore",
                {
                    departmanID, // Departman ID'si
                    filterType: "all" // Varsayılan olarak "all" kullan
                },
                {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            // API yanıtını kontrol et
            if (res.status === 201 && res.data.success === "true") {
                const { departmansOffDays, departmansOffDayOfWeek } = res.data;

                // Departman ID'sine göre filtreleme yap
                const filteredDailyOffdays = departmansOffDays.data.filter(
                    (offday) => offday.departmanID === departmanID
                );

                const filteredWeeklyOffdays = departmansOffDayOfWeek.data.filter(
                    (offday) => offday.departmanID === departmanID
                );

                return {
                    daily: filteredDailyOffdays, // Filtrelenmiş günlük izinler
                    weekly: filteredWeeklyOffdays, // Filtrelenmiş haftalık izinler
                };
            } else {
                showWarning("Henüz bir izin ataması bulunmamaktadır.");
                return {
                    daily: [],
                    weekly: [],
                };
            }
        } catch (err) {
            showError(err.response?.data?.message || "İzinler çekilirken bir hata oluştu.");
            return {
                daily: [],
                weekly: [],
            };
        }
    };

    const addOffdayOfWeek = async (departmanID, offDayofweek) => {
        try {
            const res = await api.post(
                "/api/addOffdayOfWeek",
                {
                    departmanID,
                    offDayofweek,
                },
                { withCredentials: true }
            );

            if (res.status === 200 && (res.data.success === true || res.data.success === "true")) {
                return true; // İşlem başarılı
            } else {
                showError("İzin günü eklenemedi. Lütfen tekrar deneyin.");
                return false;
            }
        } catch (err) {
            showError(err.response?.data?.message || "İzin günü eklenirken bir hata oluştu.");
            return false;
        }
    };

    // İzin ekleme işlemi
    const handleOffdaySubmit = async (data) => {
        const { offdayType, offdayStart, offdayEnd, offDayofweek } = data;
        try {
            const departmentToUpdate = departments.find(
                (department) => department.departmanName === selectedDepartmentForOffday
            );

            if (!departmentToUpdate) {
                showError("Departman bulunamadı.");
                return;
            }

            if (offdayType === "date") {
                // Tarih bazlı izin ekleme
                const res = await api.post(
                    "/api/addDepartmanOffday",
                    {
                        departmanID: departmentToUpdate.id,
                        offdayStart,
                        offdayEnd,
                    },
                    { withCredentials: true }
                );

                if (res.status === 200 && (res.data.success === true || res.data.success === "true")) {
                    showSuccess("İzin başarıyla eklendi.");
                    setOffdayModalOpen(false);
                    setOffdayStart("");
                    setOffdayEnd("");

                    // İzin listesini güncelle
                    const updatedOffdays = await fetchDepartmentOffdays(selectedDepartmentForOffday);
                    if (updatedOffdays) {
                        setOffdayList(updatedOffdays);
                    }
                } else {
                    showError("İzin eklenemedi. Lütfen tekrar deneyin.");
                }
            } else if (offdayType === "day") {
                // Gün bazlı izin ekleme
                const success = await addOffdayOfWeek(departmentToUpdate.id, offDayofweek);
                if (success) {
                    showSuccess("İzin günü başarıyla eklendi.");
                    setOffdayModalOpen(false);
                    setOffDayofweek(""); // Burada setOffDayofweek kullanılıyor

                    // İzin listesini güncelle
                    const updatedOffdays = await fetchDepartmentOffdays(selectedDepartmentForOffday);
                    if (updatedOffdays) {
                        setOffdayList(updatedOffdays);
                    }
                }
            }
        } catch (err) {
            showError(err.response?.data?.message || "İzin eklenirken bir hata oluştu.");
        }
    };

    // İzinleri göster butonu için modal açma fonksiyonu
    const handleOpenOffdayListModal = async (department) => {
        setSelectedDepartmentForOffdays(department);
        const offdays = await fetchDepartmentOffdays(department.id); // Departman ID'sini gönder
        if (offdays) {
            setOffdayList(offdays);
        }
        setOffdayListModalOpen(true);
    };

    // Arka plan rengini güncelleme fonksiyonu
    const handleBackgroundColorChange = async (departmentId) => {
        try {
            // Manuel RGB değerini kontrol et
            const rgbRegex = /^\d{1,3},\d{1,3},\d{1,3}$/;
            if (!rgbRegex.test(manualRgb)) {
                showError("Geçersiz RGB formatı. Lütfen 'r,g,b' formatında girin.");
                return;
            }

            const res = await api.post(
                "/api/departmanColerUpdate",
                {
                    departmanID: departmentId,
                    RgbNumber: manualRgb, // Manuel RGB değerini gönder
                },
                { withCredentials: true }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("Arka plan rengi başarıyla güncellendi.");
                // State'i güncelle
                setDepartments((prevDepartments) =>
                    prevDepartments.map((department) =>
                        department.id === departmentId
                            ? { ...department, RgbNumber: manualRgb }
                            : department
                    )
                );
            } else {
                showError("Arka plan rengi güncellenirken bir hata oluştu.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Arka plan rengi güncellenirken bir hata oluştu.");
        }
    };

    return (
        <div className="mt-6 bg-white p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Departmanlar<span className="ml-1 relative group">
                                            <span className="text-gray-500 cursor-pointer">❓</span>
                                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                              Oluşturduğunuz departmanları silebilir, düzenleyebilirsiniz. İsterseniz deprtmanları izinlendirebilirsiniz ve vardiyaları görüntüleyebilirsiniz.
                                            </span>
                                            </span></h2>
            {departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-5">
                    {departments.map((department, index) => {
                        const textColor = getTextColor(department.RgbNumber);
                        return (
                            <div
                                key={index}
                                className="p-4 rounded-lg relative border border-2"
                                style={{
                                    backgroundColor: `rgb(${department.RgbNumber})`,
                                    color: textColor,
                                }}
                            >
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <button
                                        onClick={() => onDelete(department.departmanName)}
                                        className="px-2 py-1 bg-white text-blue-600 shadow rounded-lg hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(department)}
                                        className="px-2 py-1 bg-white text-blue-600 shadow rounded-lg hover:bg-gray-100"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDepartmentForOffday(department.departmanName);
                                            setOffdayModalOpen(true);
                                        }}
                                        className="px-2 py-1 bg-white text-blue-600 shadow rounded-lg hover:bg-gray-100"
                                    >
                                        İzin Al
                                    </button>
                                    <button
                                        onClick={() => handleOpenOffdayListModal(department)}
                                        className="px-2 py-1 bg-white text-blue-600 shadow rounded-lg hover:bg-gray-100"
                                    >
                                        İzinleri Göster
                                    </button>
                                    <button
                                        onClick={() => handleOpenShiftModal(department)}
                                        className="px-2 py-1 bg-white text-blue-600 shadow rounded-lg hover:bg-gray-100"
                                    >
                                        Vardiyaları Göster
                                    </button>
                                </div>
                                <p className="text-lg font-bold">{department.departmanName}</p>
                                {editingDepartment === department.departmanName ? (
                                    <div className="mt-2">
                                        <label className="block font-bold text-textColor">Öncelik</label>
                                        <select
                                            value={department.priority}
                                            onChange={(e) => onUpdatePriority(department.departmanName, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                                        >
                                            {priorities.map((p) => (
                                                <option key={p} value={p}>
                                                    {prioritiesTranslation[p]}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="block font-bold text-textColor">Gün Seçin</label>
                                        <select
                                            value={selectedDay}
                                            onChange={(e) => handleDaySelection(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                                        >
                                            <option className="text-black" value="">Gün Seçin</option>
                                            {daysOfWeek.map((day) => (
                                                <option className="text-black" key={day} value={day}>
                                                    {day === "A" ? "Pazartesi" :
                                                        day === "B" ? "Salı" :
                                                            day === "C" ? "Çarşamba" :
                                                                day === "D" ? "Perşembe" :
                                                                    day === "E" ? "Cuma" :
                                                                        day === "F" ? "Cumartesi" :
                                                                            "Pazar"}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedDay && (
                                            <div className="mt-4 text-black"
                                                style={{
                                                    backgroundColor: `rgb(${department.RgbNumber})`,
                                                    color: textColor,
                                                }}>
                                                <h3 className="font-bold text-textColor">Vardiyalar</h3>
                                                {shiftData.map((shift) => (
                                                    <div key={shift.shift} className="mb-2">
                                                        <label className="block font-bold text-textColor">
                                                            {shift.shift}. Vardiya
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={updatedUserCounts[shift.shift] ?? shift.userCount}
                                                            onChange={(e) => handleUserCountChange(shift.shift, Number(e.target.value))}
                                                            className="w-full px-3 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        />
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={handleSave}
                                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                                                >
                                                    Kaydet
                                                </button>
                                            </div>
                                        )}
                                        {/* Arka plan rengini değiştirme inputu */}
                                        <label className="block font-bold text-textColor mt-4">Arka Plan Rengi</label>
                                        <div className="grid grid-cols-5 space-x-1 items-center">
                                            <input
                                                type="text"
                                                value={manualRgb}
                                                onChange={(e) => setManualRgb(e.target.value)}
                                                className="w-full col-span-4 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                                                placeholder="Örnek: 49,148,36"
                                            />
                                            <input
                                                type="color"
                                                value={backgroundColor}
                                                onChange={(e) => {
                                                    const hexColor = e.target.value;
                                                    setBackgroundColor(hexColor);
                                                    // Hex rengini RGB'ye çevir
                                                    const rgb = hexToRgb(hexColor);
                                                    setManualRgb(rgb);
                                                }}
                                                className="w-full h-[4vh]  border col-span-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleBackgroundColorChange(department.id)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                        >
                                            Renk Kaydet
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-textColor">
                                            Öncelik: {prioritiesTranslation[department.priority] || department.priority}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500">Hiç departman bulunmamaktadır.</p>
            )}

            {/* OffdayModal */}
            <OffdayModal
                isOpen={offdayModalOpen}
                onClose={() => setOffdayModalOpen(false)}
                onSubmit={handleOffdaySubmit}
                selectedDepartment={selectedDepartmentForOffday}
            />

            {/* OffdayListModal */}
            <OffdayListModal
                isOpen={offdayListModalOpen}
                onClose={() => setOffdayListModalOpen(false)}
                offdayList={offdayList}
                selectedDepartment={selectedDepartmentForOffdays}
                onDeleteOffday={handleDeleteOffday}
                dayTranslation={{
                    Monday: "Pazartesi",
                    Tuesday: "Salı",
                    Wednesday: "Çarşamba",
                    Thursday: "Perşembe",
                    Friday: "Cuma",
                    Saturday: "Cumartesi",
                    Sunday: "Pazar",
                }}
            />

            {/* ShiftModal */}
            <ShiftModal
                isOpen={shiftModalOpen}
                onClose={() => setShiftModalOpen(false)}
                selectedDepartment={selectedDepartmentForShift}
                daysOfWeek={daysOfWeek}
                shifts={shifts}
                onDaySelect={handleDaySelection}
                shiftData={shiftData}
            />
        </div>
    );
};

// Hex rengini RGB'ye çevirme fonksiyonu
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
};

export default DepartmentList;