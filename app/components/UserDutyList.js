"use client";

import { useEffect, useState } from "react";
import api from "@/app/loaders/baseApi"; // API istemcisini içe aktar
import Loading from "../loading";

const PastCalendar = () => {
    const [, setEvents] = useState([]);
    const [user, setUser] = useState(null); // Giriş yapan kullanıcı bilgisini sakla
    const [loading, setLoading] = useState(true); // Loading durumunu ekleyelim
    const [error, setError] = useState(null); // Hata durumunu ekleyelim
    const [calendars, setCalendars] = useState([]); // Tüm takvimler
    const [selectedCalendar, setSelectedCalendar] = useState(null); // Seçilen takvim
    const [weeks, setWeeks] = useState([]); // Haftaları sakla
    const [selectedWeek, setSelectedWeek] = useState(1); // Seçilen hafta

    // Kullanıcı verilerini çek
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await api.get("/api/userData", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });
                setUser(userRes.data.data.userData); // Giriş yapan kullanıcıyı sakla
            } catch {

                setError("Kullanıcı verisi alınamadı.");
                setLoading(false); // Hata durumunda loading'i false yap
            }
        };

        fetchUserData();
    }, []);

    // Takvim verilerini çek
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const res = await api.get("/api/callenderStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });

                if (Array.isArray(res.data.data.data)) {
                    setCalendars(res.data.data.data); // Takvimleri state'e kaydet
                } else {
                    setError("Takvim verileri beklenen formatta değil.");
                }
            } catch {

                setError("Takvim verileri alınamadı.");
            } finally {
                setLoading(false); // Veriler yüklendikten sonra loading durumunu false yap
            }
        };

        fetchCalendars();
    }, []);

    // Seçilen takvime göre nöbet bilgilerini çek ve haftalara böl
    useEffect(() => {
        const fetchCalendarData = async () => {
            if (!selectedCalendar || !user) return;

            try {
                setLoading(true);
                const events = JSON.parse(selectedCalendar.pastCallender);

                // Kullanıcıya ait olanları filtrele
                const userEvents = events.filter(event => event.username === user.username);

                // Tarihe göre sırala
                userEvents.sort((a, b) => new Date(a.shiftDate) - new Date(b.shiftDate));

                // Haftaları oluşturmak için bir nesne
                const weeksMap = new Map();

                userEvents.forEach(event => {
                    const eventDate = new Date(event.shiftDate);
                    const startOfWeek = new Date(eventDate);
                    startOfWeek.setDate(eventDate.getDate() - ((eventDate.getDay() + 6) % 7)); // Haftanın Pazartesi'sini bul

                    const weekKey = startOfWeek.toISOString().split("T")[0]; // YYYY-MM-DD formatında anahtar belirle

                    if (!weeksMap.has(weekKey)) {
                        weeksMap.set(weekKey, { weekNumber: weeksMap.size + 1, events: Array(7).fill(null) });
                    }

                    // Haftanın gününü bul (Pazartesi = 0, Salı = 1, ... Pazar = 6)
                    const dayIndex = (eventDate.getDay() + 6) % 7;
                    weeksMap.get(weekKey).events[dayIndex] = event;
                });

                // Sadece en az bir nöbet atanmış haftaları al
                const weeksArray = Array.from(weeksMap.values()).filter(week => week.events.some(event => event !== null));

                setWeeks(weeksArray);
                setEvents(userEvents);
            } catch {

                setError("Takvim verileri alınamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, [user, selectedCalendar]);

    // Haftanın günlerini tanımla
    const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

    // Seçilen haftanın etkinliklerini filtrele
    const selectedWeekEvents = weeks.find((week) => week.weekNumber === selectedWeek)?.events || [];

    // Yalnızca seçili haftada nöbet atanmış departmanları al ve sıralama uygula
    const visibleDepartments = [...new Set(selectedWeekEvents.filter(event => event !== null).map(event => event.departman))]
        .sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, ""), 10);
            const numB = parseInt(b.replace(/\D/g, ""), 10);
            return numA - numB;
        });

    // Tablo için verileri hazırla
    const tableData = visibleDepartments.map((department) => {
        const departmentEvents = daysOfWeek.map((day, index) => {
            const event = selectedWeekEvents[index]; // İlgili gündeki etkinlik
            return event && event.departman === department ? event : null;
        });

        return {
            department,
            departmentEvents,
        };
    });

    if (!user) {
        return <Loading />;
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p className="text-center text-red-500">Hata: {error}</p>;
    }

    return (
        <div className="bg-white rounded-lg p-4">
            {/* Takvim Seçimi */}
            <div className="mb-4">
                <label htmlFor="calendarSelect" className="block text-sm font-medium text-gray-700">
                    Takvim Seçin
                </label>
                <select
                    id="calendarSelect"
                    onChange={(e) => {
                        const selected = calendars.find((cal) => cal.callenderName === e.target.value);
                        setSelectedCalendar(selected);
                        setSelectedWeek(1); // Takvim değiştiğinde haftayı 1'e sıfırla
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Takvim Seçin</option>
                    {calendars.map((calendar) => (
                        <option key={calendar.id} value={calendar.callenderName}>
                            {calendar.callenderName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hafta Seçimi veya Bilgilendirme Mesajı */}
            {selectedCalendar && (
                <>
                    {weeks.length === 0 ? (
                        <p className="text-center text-gray-600 font-medium mb-4">
                            Bu takvimde size ait herhangi bir nöbet bulunmamaktadır.
                        </p>
                    ) : (
                        <div className="mb-4">
                            <label htmlFor="weekSelect" className="block text-sm font-medium text-gray-700 mb-1">
                                Hafta Seçin
                            </label>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {weeks.map((week) => (
                                    <button
                                        key={week.weekNumber}
                                        onClick={() => setSelectedWeek(week.weekNumber)}
                                        className={`px-4 py-2 ${selectedWeek === week.weekNumber
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-300 text-black"
                                            } rounded-full whitespace-nowrap`}
                                    >
                                        {week.weekNumber}. Hafta
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Masaüstü Tablo */}
            <div className="hidden md:block overflow-x-auto border border-2 rounded-xl">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border border-gray-200 bg-[#37386e]"></th>
                            {daysOfWeek.map((day) => (
                                <th key={day} className="px-4 py-2 bg-[#37386e] text-white whitespace-nowrap">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 font-semibold bg-[#37386e] text-white whitespace-nowrap">{row.department}</td>
                                {row.departmentEvents.map((event, dayIndex) => (
                                    <td key={dayIndex} className="border border-gray-200 bg-[#babae9]">
                                        {event ? (
                                            <div className="p-2 bg-[#822e81] text-white">
                                                <p className="text-sm font-bold">{event.username}</p>
                                                <p className="text-xs"><strong>Vardiya:</strong> {event.whichShift}</p>
                                            </div>
                                        ) : (
                                            <p></p>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobil Tablo */}
            <div className="md:hidden">
                <div className="overflow-x-auto border border-2 rounded-xl">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border border-gray-200 bg-[#37386e] text-white">Gün</th>
                                <th className="px-4 py-2 border border-gray-200 bg-[#37386e] text-white">Departman & Vardiya</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daysOfWeek.map((day, dayIndex) => {
                                const eventsForDay = selectedWeekEvents[dayIndex];
                                return (
                                    <tr key={day}>
                                        <td className="px-4 py-2 border border-gray-200 bg-[#37386e] text-white whitespace-nowrap">
                                            {day}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200 bg-[#babae9]">
                                            {eventsForDay ? (
                                                <div className="p-2 bg-[#822e81] text-white">
                                                    <p className="text-sm font-bold">{eventsForDay.departman}</p>
                                                    <p className="text-xs"><strong>Vardiya:</strong> {eventsForDay.whichShift}</p>
                                                </div>
                                            ) : (
                                                <p></p>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PastCalendar;