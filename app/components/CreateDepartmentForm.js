// components/CreateDepartmentForm.js
import React, { useState } from "react";
import { useNotification } from '@/app/components/NotificationContext';

const CreateDepartmentForm = ({ onCreate }) => {
    const [departmanName, setDepartmanName] = useState("");
    const [priority, setPriority] = useState("low");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [customColor, setCustomColor] = useState("");
    const [showShiftForm, setShowShiftForm] = useState(false); // Vardiya formunu göstermek için
    const [selectedDay, setSelectedDay] = useState("A"); // Seçilen gün (A: Pazartesi, B: Salı, ...)
    const [selectedShift, setSelectedShift] = useState("1"); // Seçilen vardiya (1, 2, 3, 4, 5)
    const [userCount, setUserCount] = useState(1); // Vardiyadaki kişi sayısı
    const [shifts, setShifts] = useState([]); // Tüm vardiyaları tutacak state

    const { showError, showSuccess } = useNotification();

    const priorities = ["low", "medium", "urgent"];
    const prioritiesTranslation = {
        low: "Düşük",
        medium: "Orta",
        urgent: "Acil",
    };

    const days = [
        { value: "A", label: "Pazartesi" },
        { value: "B", label: "Salı" },
        { value: "C", label: "Çarşamba" },
        { value: "D", label: "Perşembe" },
        { value: "E", label: "Cuma" },
        { value: "F", label: "Cumartesi" },
        { value: "G", label: "Pazar" },
    ];

    const shiftOptions = [1, 2, 3, 4, 5]; // Vardiyalar

    // HEX rengini RGB'ye dönüştüren fonksiyon
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    };

    // RGB rengini HEX'e dönüştüren fonksiyon
    const rgbToHex = (rgb) => {
        const [r, g, b] = rgb.split(',').map(Number);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    // Vardiya ekleme fonksiyonu
    const handleAddShift = () => {
        const newShift = {
            day: selectedDay,
            shift: selectedShift,
            userCount: userCount,
        };
        setShifts([...shifts, newShift]);
        setSelectedDay("A"); // Günü sıfırla
        setSelectedShift("1"); // Vardiyayı sıfırla
        setUserCount(1); // Kullanıcı sayısını sıfırla
    };

    // Vardiya silme fonksiyonu
    const handleRemoveShift = (index) => {
        const updatedShifts = shifts.filter((_, i) => i !== index);
        setShifts(updatedShifts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tüm gün ve vardiyalar için varsayılan değerler (0)
            const defaultShifts = {};
            days.forEach(day => {
                shiftOptions.forEach(shift => {
                    defaultShifts[`${day.value}userCountsShift${shift}`] = 1;
                });
            });

            // Kullanıcının eklediği vardiyaları güncelle
            shifts.forEach(shift => {
                defaultShifts[`${shift.day}userCountsShift${shift.shift}`] = shift.userCount;
            });

            // Backend'e gönderilecek veri
            const departmentData = {
                departmanName,
                priority,
                ...defaultShifts,
                RgbNumber: customColor || backgroundColor || "243,243,243",
            };

            const response = await onCreate(departmentData); // Backend'e veriyi gönder ve yanıtı al

            // Backend'den gelen yanıtta success=true kontrolü
            if (response.data.success === true) {
                showSuccess(response.message || "Departman başarıyla oluşturuldu.");

                // Formu sıfırla
                setDepartmanName("");
                setPriority("low");
                setBackgroundColor("");
                setCustomColor("");
                setShifts([]);
                setShowShiftForm(false);

                // Sadece başarılı durumda sayfayı yenile
                setTimeout(() => {
                    window.location.reload(); // Sayfayı yeniden yükle
                }, 2000); // 2 saniye sonra yenile, kullanıcı başarı mesajını görebilsin
            } else {
                // Backend'den success=false veya geçersiz yanıt geldiğinde hata göster
                showError(response.message || "Departman oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const errorMessage = error.response.data?.message || "Departman oluşturulurken bir hata oluştu.";

                // 404 hatası için özel mesaj
                if (statusCode === 404) {
                    showError(`${errorMessage}`);
                } else {
                    showError(`Hata (${statusCode}): ${errorMessage}`);
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg mb-6 mr-0 lg:mr-2">
            <h2 className="text-xl font-bold mb-4">Yeni Departman Oluştur</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold text-gray-700">Departman Adı</label>
                    <input
                        type="text"
                        value={departmanName}
                        onChange={(e) => setDepartmanName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold text-gray-700">Öncelik</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        {priorities.map((p) => (
                            <option key={p} value={p}>
                                {prioritiesTranslation[p]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-bold text-gray-700">Departman Rengini Seç</label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={customColor}
                            onChange={(e) => {
                                setCustomColor(e.target.value);
                                setBackgroundColor(rgbToHex(e.target.value)); // Özel renk girişi yapıldığında HEX'e dönüştür
                            }}
                            placeholder="Örnek: 243,243,243"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                            type="color"
                            value={backgroundColor || "#f3f3f3"}
                            onChange={(e) => {
                                setBackgroundColor(e.target.value);
                                setCustomColor(hexToRgb(e.target.value)); // Renk seçici değiştiğinde RGB'ye dönüştür
                            }}
                            className="ml-2"
                        />
                    </div>
                </div>

                {/* Vardiya Oluştur Butonu */}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setShowShiftForm(!showShiftForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        {showShiftForm ? "Vardiya Formunu Kapat" : "Vardiya Oluştur"}
                    </button><span className="ml-1 relative group">
                        <span className="text-gray-500 cursor-pointer">‼️</span>
                        <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                            Özel olarak belirtmediğiniz vardiyalar için otomatik olarak 1 çalışan atanmaktadır. Kullanmayacağınız vardiyalar için herhangi bir ekleme yapmanıza gerek yoktur.
                        </span>
                    </span>
                </div>

                {/* Vardiya Formu */}
                {showShiftForm && (
                    <div className="mb-4 p-4 border rounded-lg">
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700">Gün Seçin</label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                {days.map((day) => (
                                    <option key={day.value} value={day.value}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700">Vardiya Seçin</label>
                            <select
                                value={selectedShift}
                                onChange={(e) => setSelectedShift(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                {shiftOptions.map((shift) => (
                                    <option key={shift} value={shift}>
                                        {shift}. Vardiya
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700">Vardiyadaki Kişi Sayısı</label>
                            <input
                                type="number"
                                value={userCount}
                                onChange={(e) => setUserCount(Number(e.target.value))}
                                min="1"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddShift}
                            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                            Vardiya Ekle
                        </button>
                    </div>
                )}

                {/* Eklenen Vardiyaların Listesi */}
                {shifts.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-700 mb-2">Eklenen Vardiyalar</h3>
                        <ul>
                            {shifts.map((shift, index) => (
                                <li key={index} className="mb-2">
                                    <span className="font-bold">{days.find(d => d.value === shift.day).label}</span> -{" "}
                                    <span>{shift.shift}. Vardiya</span> -{" "}
                                    <span>{shift.userCount} Kişi</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveShift(index)}
                                        className="ml-2 px-2 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                    >
                                        Sil
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Departman Oluştur Butonu */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        Departman Oluştur
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDepartmentForm;