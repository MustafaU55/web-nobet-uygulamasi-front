"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import trLocale from "@fullcalendar/core/locales/tr";
import api from "@/app/loaders/baseApi";
import Loading from "../../loading";
import { useNotification } from '@/app/components/NotificationContext';

// YENİ: xlsx yerine xlsx-js-style kullanıyoruz
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const replaceTurkishChars = (str) => {
    if (!str) return "";
    let letters = {
        "İ": "I", "I": "I", "Ş": "S", "Ğ": "G", "Ü": "U", "Ö": "O", "Ç": "C",
        "i": "i", "ı": "i", "ş": "s", "ğ": "g", "ü": "u", "ö": "o", "ç": "c"
    };
    return str.replace(/(([İIŞĞÜÖÇiışğüöç]))/g, function (letter) { return letters[letter]; });
};

const CreatorPastCalendar = ({ adminID }) => {
    const calendarRef = useRef(null);
    const { showSuccess, showError, showWarning } = useNotification();

    const [events, setEvents] = useState([]);
    const [calendarData, setCalendarData] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedCalendar, setSelectedCalendar] = useState("");
    const [selectedCalendarID, setSelectedCalendarID] = useState("");

    const departments = [...new Set(events.map(event => event.departman))].sort();
    const shifts = [1, 2, 3, 4, 5];
    const calendarNames = [...new Set(calendarData.map(cal => cal.callenderName))];

    const formatEvents = async (calendarData) => {
        if (!calendarData) return [];

        const userStoreResponse = await api.get("/api/userStore", {
            withCredentials: true,
            params: { adminID, countOfPaginate: 1000 }
        });
        const users = userStoreResponse.data.users?.data || [];

        return calendarData.flatMap(adminData => {
            if (typeof adminData.pastCallender !== 'string') return [];
            const events = JSON.parse(adminData.pastCallender || '[]');

            return events.map(event => {
                const user = users.find(u => u.username === event.username);
                const displayName = user
                    ? `${user.firstname || ''} ${user.lastname?.charAt(0) || ''}.`
                    : 'Atanmamış';

                return {
                    title: `${event.departman} / ${displayName} / V${event.whichShift}`,
                    start: event.shiftDate,
                    departman: event.departman,
                    callenderName: adminData.callenderName,
                    callenderID: adminData.id,
                    whichShift: event.whichShift,
                    username: event.username,
                    displayName,
                    extendedProps: {
                        customHTML: `<div class="font-semibold">${event.departman}</div><div class="text-sm">${displayName}</div><div class="text-xs opacity-75">V${event.whichShift}</div>`
                    }
                };
            });
        });
    };

    const filteredEvents = events.filter(event => (
        (!selectedCalendar || event.callenderName === selectedCalendar) &&
        (filteredDepartments.length === 0 || filteredDepartments.includes(event.departman)) &&
        (filteredShifts.length === 0 || filteredShifts.includes(event.whichShift)) &&
        (filteredUsers.length === 0 || filteredUsers.includes(event.username))
    ));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [calendarRes, userRes] = await Promise.all([
                    api.get("/api/callenderStore", {
                        params: { filter: "all", countOfPaginate: 1000, adminID },
                        withCredentials: true
                    }),
                    api.get("/api/userStore", {
                        params: { adminID, countOfPaginate: 1000 },
                        withCredentials: true
                    })
                ]);

                setCalendarData(calendarRes.data.data?.data || []);
                setUsers(userRes.data.users?.data || []);

                const formattedEvents = await formatEvents(calendarRes.data.data?.data);
                setEvents(formattedEvents);

            } catch (error) {
                showError("Veri yüklenirken hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [adminID]);

    const handleCalendarChange = (e) => {
        const name = e.target.value;
        setSelectedCalendar(name);

        const calendar = calendarData.find(c => c.callenderName === name);
        setSelectedCalendarID(calendar?.id || "");

        if (name && calendarRef.current) {
            const firstEvent = events.find(e => e.callenderName === name);
            if (firstEvent) {
                calendarRef.current.getApi().gotoDate(firstEvent.start);
            }
        }
    };

    // ===== RENKLİ VE STİLLİ EXCEL İNDİRME FONKSİYONU =====
    const handleDownloadExcel = async () => {
        if (!selectedCalendarID) {
            showWarning("Lütfen önce bir takvim seçin.");
            return;
        }

        try {
            const selectedCalData = calendarData.find(cal => cal.id === selectedCalendarID);
            if (!selectedCalData || typeof selectedCalData.pastCallender !== 'string') {
                showError("Seçilen takvime ait veri bulunamadı veya formatı bozuk.");
                return;
            }

            const calendarEvents = JSON.parse(selectedCalData.pastCallender);

            const allDates = [...new Set(calendarEvents.map(event => event.shiftDate))].sort();
            const allDepartments = [...new Set(calendarEvents.map(event => event.departman))]
                .sort((a, b) => {
                    const aNum = a.match(/\d+/);
                    const bNum = b.match(/\d+/);
                    return (aNum ? parseInt(aNum[0]) : 0) - (bNum ? parseInt(bNum[0]) : 0);
                });

            // 1. Veri Matrisini Oluştur
            const header = ["Tarih / Departman", ...allDepartments];
            const dataMatrix = [header];

            for (const date of allDates) {
                const row = [new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })];

                for (const department of allDepartments) {
                    const event = calendarEvents.find(e => e.shiftDate === date && e.departman === department);

                    if (event) {
                        const userFound = users.find(u => u.username === event.username);
                        const displayName = userFound
                            ? `${userFound.firstname || ''} ${userFound.lastname || ''}`.trim()
                            : event.username;
                        row.push(displayName);
                    } else {
                        row.push("-"); // Boş hücreler için çizgi
                    }
                }
                dataMatrix.push(row);
            }

            // 2. Worksheet Oluştur
            const ws = XLSX.utils.aoa_to_sheet(dataMatrix);

            // 3. Stilleri Uygula
            const range = XLSX.utils.decode_range(ws['!ref']);

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!ws[cellAddress]) continue;

                    let cellStyle = {
                        alignment: { horizontal: "center", vertical: "center", wrapText: true },
                        border: {
                            top: { style: "thin", color: { rgb: "CCCCCC" } },
                            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                            left: { style: "thin", color: { rgb: "CCCCCC" } },
                            right: { style: "thin", color: { rgb: "CCCCCC" } }
                        },
                        font: { name: "Arial", sz: 10, color: { rgb: "333333" } }
                    };

                    // Başlık Satırı
                    if (R === 0) {
                        cellStyle.fill = { fgColor: { rgb: "1E3A8A" } };
                        cellStyle.font = { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } };
                    }
                    // Tarih Sütunu
                    else if (C === 0) {
                        cellStyle.fill = { fgColor: { rgb: "F1F5F9" } };
                        cellStyle.font = { name: "Arial", sz: 10, bold: true, color: { rgb: "1E293B" } };
                    }
                    // Diğer Hücreler (Zebra)
                    else {
                        if (R % 2 === 0) {
                            cellStyle.fill = { fgColor: { rgb: "F8FAFC" } };
                        } else {
                            cellStyle.fill = { fgColor: { rgb: "FFFFFF" } };
                        }
                    }

                    ws[cellAddress].s = cellStyle;
                }
            }

            // 4. Sütun Genişliklerini Ayarla
            const columnWidths = [{ wch: 18 }];
            allDepartments.forEach(() => columnWidths.push({ wch: 22 }));
            ws['!cols'] = columnWidths;

            // 5. Kaydet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Nöbet Listesi");

            XLSX.writeFile(wb, `${selectedCalendar}_Nobet_Listesi.xlsx`);
            showSuccess("Renkli Excel başarıyla indirildi!");

        } catch (err) {
            console.error("Excel oluşturma hatası:", err);
            showError("Excel indirilirken bir hata oluştu.");
        }
    };

    const handleDownloadPDF = async () => {
        if (!selectedCalendarID) {
            showWarning("Lütfen önce bir takvim seçin.");
            return;
        }

        try {
            const selectedCalData = calendarData.find(cal => cal.id === selectedCalendarID);
            if (!selectedCalData || typeof selectedCalData.pastCallender !== 'string') {
                showError("Seçilen takvime ait veri bulunamadı veya formatı bozuk.");
                return;
            }

            const calendarEvents = JSON.parse(selectedCalData.pastCallender);

            const allDates = [...new Set(calendarEvents.map(event => event.shiftDate))].sort();
            const allDepartments = [...new Set(calendarEvents.map(event => event.departman))]
                .sort((a, b) => {
                    const aNum = a.match(/\d+/);
                    const bNum = b.match(/\d+/);
                    return (aNum ? parseInt(aNum[0]) : 0) - (bNum ? parseInt(bNum[0]) : 0);
                });

            const doc = new jsPDF({ orientation: "landscape" });

            doc.setFontSize(18);
            doc.text(replaceTurkishChars(`${selectedCalendar} Nobet Listesi`), 14, 22);
            doc.setFontSize(11);

            const tableHead = [["Tarih", ...allDepartments]];
            const tableBody = [];

            for (const date of allDates) {
                const rowData = [new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })];
                for (const department of allDepartments) {
                    const event = calendarEvents.find(e => e.shiftDate === date && e.departman === department);
                    const userFound = event ? users.find(u => u.username === event.username) : null;
                    let displayName = userFound ? `${userFound.firstname || ''} ${userFound.lastname || ''}`.trim() : (event ? event.username : "");

                    displayName = replaceTurkishChars(displayName);
                    rowData.push(displayName);
                }
                tableBody.push(rowData);
            }

            autoTable(doc, {
                head: tableHead,
                body: tableBody,
                startY: 30,
                theme: 'grid',
                headStyles: { fillColor: [22, 160, 133] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                willDrawCell: (data) => {
                    if (data.section === 'body') {
                        const dateStr = data.row.raw[0];
                        if (typeof dateStr === 'string' && dateStr.includes('.')) {
                            const parts = dateStr.split('.');
                            if (parts.length === 3) {
                                const dayOfWeek = new Date(parts[2], parts[1] - 1, parts[0]).getDay();
                                if (dayOfWeek === 0 || dayOfWeek === 6) {
                                    doc.setFillColor(255, 235, 238);
                                }
                            }
                        }
                    }
                }
            });

            doc.save(replaceTurkishChars(`${selectedCalendar}.pdf`));
            showSuccess("PDF başarıyla oluşturuldu!");

        } catch (err) {
            console.error("PDF Oluşturma Hatası:", err);
            showError("PDF oluşturulurken bir hata oluştu.");
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow text-black">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1 text-sm text-gray-700">Takvim Seçin</label>
                            <select
                                value={selectedCalendar}
                                onChange={handleCalendarChange}
                                className="w-full p-2 border rounded border-gray-300"
                            >
                                <option value="">Tüm Takvimler</option>
                                {calendarNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-sm text-gray-700">Departman Seçin</label>
                            <select
                                value={filteredDepartments[0] || "Tümü"}
                                onChange={e => setFilteredDepartments(
                                    e.target.value === "Tümü" ? [] : [e.target.value]
                                )}
                                className="w-full p-2 border rounded border-gray-300"
                            >
                                <option value="Tümü">Tüm Departmanlar</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-sm text-gray-700">Vardiya Seçin</label>
                            <select
                                value={filteredShifts[0] || "Tümü"}
                                onChange={e => setFilteredShifts(
                                    e.target.value === "Tümü" ? [] : [Number(e.target.value)]
                                )}
                                className="w-full p-2 border rounded border-gray-300"
                            >
                                <option value="Tümü">Tüm Vardiyalar</option>
                                {shifts.map(shift => (
                                    <option key={shift} value={shift}>{shift}. Vardiya</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-sm text-gray-700">Personel Seçin</label>
                            <select
                                value={
                                    filteredUsers.length === 0 ? "Tümü" :
                                        users.find(u => u.username === filteredUsers[0])?.username || "Tümü"
                                }
                                onChange={e => setFilteredUsers(
                                    e.target.value === "Tümü" ? [] : [e.target.value]
                                )}
                                className="w-full p-2 border rounded border-gray-300"
                            >
                                <option value="Tümü">Tüm Personel</option>
                                {users.map(user => (
                                    <option key={user.username} value={user.username}>
                                        {user.firstname} {user.lastname?.charAt(0)}.
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex space-x-3">
                        <button
                            onClick={handleDownloadExcel}
                            disabled={!selectedCalendarID}
                            className={`px-4 py-2 rounded-full ${selectedCalendarID
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            Excel Olarak İndir
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={!selectedCalendarID}
                            className={`px-4 py-2 rounded-full ${selectedCalendarID
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            PDF Olarak İndir
                        </button>
                    </div>

                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={trLocale}
                        events={filteredEvents}
                        height={1400}
                        eventContent={(arg) => (
                            <div
                                className="p-1 cursor-pointer hover:opacity-80 transition-opacity"
                                dangerouslySetInnerHTML={{ __html: arg.event.extendedProps.customHTML }}
                            />
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default CreatorPastCalendar;