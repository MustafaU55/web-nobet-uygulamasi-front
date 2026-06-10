"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import trLocale from "@fullcalendar/core/locales/tr";
import api from "@/app/loaders/baseApi";
import Loading from "../loading"; 
import { useNotification } from '@/app/components/NotificationContext';

// YENİ: xlsx yerine xlsx-js-style kullanıyoruz
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Türkçe karakterleri İngilizce karşılıklarına dönüştüren fonksiyon (PDF için)
const replaceTurkishChars = (str) => {
  if (!str) return "";
  let letters = {
    "İ": "I", "I": "I", "Ş": "S", "Ğ": "G", "Ü": "U", "Ö": "O", "Ç": "C",
    "i": "i", "ı": "i", "ş": "s", "ğ": "g", "ü": "u", "ö": "o", "ç": "c"
  };
  return str.replace(/(([İIŞĞÜÖÇiışğüöç]))/g, function (letter) { return letters[letter]; });
};

const PastDutyCalendarUser = () => {
  const calendarRef = useRef(null);
  const { showSuccess, showError, showWarning } = useNotification();

  // Veri State'leri
  const [events, setEvents] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Filtre State'leri
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState("");

  // Türetilmiş Veriler (Menüler için)
  const [departments, setDepartments] = useState([]);
  const shifts = [1, 2, 3, 4, 5];
  const [calendarNames, setCalendarNames] = useState([]);

  // 1. Veri Çekme İşlemi
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        let currentUser = "";
        let adminID = "";

        try {
          const userRes = await api.get("/api/userData", { withCredentials: true, params: { countOfPaginate: 1000 } });
          const userData = userRes.data?.data?.userData || userRes.data?.userData;

          if (userData) {
            currentUser = userData.username || "";
            adminID = userData.adminID || "";
            setLoggedInUsername(currentUser);
          }
        } catch (e) {
          showError("Oturum bilgileri alınamadı.");
          setLoading(false);
          return;
        }

        const [usersRes, calendarsRes] = await Promise.all([
          api.get("/api/userStore", { params: { adminID: adminID, countOfPaginate: 1000 }, withCredentials: true }),
          api.get("/api/callenderStore", { params: { filter: "all", adminID: adminID, countOfPaginate: 1000 }, withCredentials: true })
        ]);

        const fetchedUsers = usersRes.data?.users?.data || usersRes.data?.data || [];
        const fetchedCalendars = calendarsRes.data?.data?.data || [];

        setUsers(fetchedUsers);
        setCalendarData(fetchedCalendars);

        let allFormattedEvents = [];
        let allDepts = new Set();
        let allCalNames = new Set();

        fetchedCalendars.forEach((cal) => {
          allCalNames.add(cal.callenderName);
          if (cal.pastCallender && typeof cal.pastCallender === 'string') {
            try {
              const parsedEvents = JSON.parse(cal.pastCallender);

              parsedEvents.forEach((event) => {
                allDepts.add(event.departman);

                const foundUser = fetchedUsers.find((u) => u.username === event.username);
                const displayName = foundUser
                  ? `${foundUser.firstname || ''} ${foundUser.lastname ? foundUser.lastname.charAt(0) + '.' : ''}`.trim()
                  : event.username;

                const isMyEvent = currentUser && event.username === currentUser;
                const shiftLabel = `V${event.whichShift}`;

                allFormattedEvents.push({
                  id: `${cal.id}-${event.shiftDate}-${event.username}`,
                  title: `${event.departman} / ${displayName} / ${shiftLabel}`,
                  start: event.shiftDate,
                  departman: event.departman,
                  callenderName: cal.callenderName,
                  whichShift: event.whichShift,
                  username: event.username,
                  backgroundColor: isMyEvent ? "#822E81" : (event.type === "regular" ? "#BABAE9" : "#85C0FC"),
                  borderColor: isMyEvent ? "#822E81" : (event.type === "regular" ? "#BABAE9" : "#85C0FC"),
                  textColor: isMyEvent ? "#FFFFFF" : (event.type === "regular" ? "#232344" : "#AA6373"),
                  extendedProps: {
                    customHTML: `<div class="font-semibold">${event.departman}</div><div class="text-sm">${displayName}</div><div class="text-xs opacity-75">${shiftLabel}</div>`
                  }
                });
              });
            } catch (err) {
              console.error("JSON Parse hatası:", err);
            }
          }
        });

        setEvents(allFormattedEvents);

        const sortedDepts = Array.from(allDepts).sort((a, b) => {
          const aNum = a.match(/\d+/);
          const bNum = b.match(/\d+/);
          return (aNum ? parseInt(aNum[0]) : 0) - (bNum ? parseInt(bNum[0]) : 0);
        });
        setDepartments(sortedDepts);

        const calNamesArray = Array.from(allCalNames);
        setCalendarNames(calNamesArray);

        if (calNamesArray.length > 0) {
          const initialCalName = calNamesArray[0];
          setSelectedCalendar(initialCalName);
        }

      } catch (error) {
        showError("Takvim verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedCalendar && events.length > 0 && calendarRef.current) {
      const firstEventOfSelectedCal = events.find(e => e.callenderName === selectedCalendar);
      if (firstEventOfSelectedCal) {
        calendarRef.current.getApi().gotoDate(firstEventOfSelectedCal.start);
      }
    }
  }, [selectedCalendar, events]);

  const filteredEvents = events.filter((event) => {
    return (
      (selectedCalendar === "" || event.callenderName === selectedCalendar) &&
      (filteredDepartments.length === 0 || filteredDepartments.includes(event.departman)) &&
      (filteredShifts.length === 0 || filteredShifts.includes(event.whichShift)) &&
      (filteredUsers.length === 0 || filteredUsers.includes(event.username))
    );
  });

  const selectedCalendarID = calendarData.find(c => c.callenderName === selectedCalendar)?.id;


  // ===== RENKLİ VE STİLLİ EXCEL İNDİRME FONKSİYONU =====
  const handleDownloadExcel = async () => {
    if (!selectedCalendarID) return showWarning("Lütfen bir takvim seçin.");

    try {
      const selectedCalData = calendarData.find(cal => cal.id === selectedCalendarID);
      const calendarEvents = JSON.parse(selectedCalData.pastCallender);

      const allDates = [...new Set(calendarEvents.map(e => e.shiftDate))].sort();
      const allDepartments = [...new Set(calendarEvents.map(e => e.departman))]
        .sort((a, b) => (a.match(/\d+/) ? parseInt(a.match(/\d+/)[0]) : 0) - (b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : 0));

      // 1. Veri Matrisini Oluştur
      const dataMatrix = [["Tarih / Departman", ...allDepartments]];

      allDates.forEach(date => {
        const row = [new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })];
        allDepartments.forEach(dept => {
          const event = calendarEvents.find(e => e.shiftDate === date && e.departman === dept);
          if (event) {
            const userFound = users.find(u => u.username === event.username);
            row.push(userFound ? `${userFound.firstname || ''} ${userFound.lastname || ''}`.trim() : event.username);
          } else {
            row.push("-"); // Boş hücreler yerine - işareti daha şık durur
          }
        });
        dataMatrix.push(row);
      });

      // 2. Worksheet (Çalışma Sayfası) Oluştur
      const ws = XLSX.utils.aoa_to_sheet(dataMatrix);

      // 3. Stilleri Uygula (xlsx-js-style özellikleri)
      const range = XLSX.utils.decode_range(ws['!ref']); // Tablonun boyutlarını al

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;

          // Ortak Kenarlık (Border) ve Hizalama Stili
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

          // Başlık Satırı Stili (0. Satır)
          if (R === 0) {
            cellStyle.fill = { fgColor: { rgb: "1E3A8A" } }; // Koyu Lacivert arka plan
            cellStyle.font = { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } }; // Beyaz kalın yazı
          }
          // Tarih Sütunu Stili (0. Sütun)
          else if (C === 0) {
            cellStyle.fill = { fgColor: { rgb: "F1F5F9" } }; // Çok Açık Gri
            cellStyle.font = { name: "Arial", sz: 10, bold: true, color: { rgb: "1E293B" } };
          }
          // İçerik Hücreleri (Zebra deseni)
          else {
            if (R % 2 === 0) {
              cellStyle.fill = { fgColor: { rgb: "F8FAFC" } }; // Çift satırlar için hafif gri
            } else {
              cellStyle.fill = { fgColor: { rgb: "FFFFFF" } }; // Tek satırlar beyaz
            }
          }

          // Stili hücreye ata
          ws[cellAddress].s = cellStyle;
        }
      }

      // 4. Sütun Genişliklerini Ayarla
      const columnWidths = [{ wch: 18 }]; // Tarih sütunu genişliği
      allDepartments.forEach(() => columnWidths.push({ wch: 22 })); // Departman sütunları genişliği
      ws['!cols'] = columnWidths;

      // 5. Excel Dosyasını Oluştur ve İndir
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Nöbet Listesi");

      // Dosya ismine takvim adını ekle
      XLSX.writeFile(wb, `${selectedCalendar}_Nobet_Listesi.xlsx`);
      showSuccess("Renkli Excel başarıyla indirildi!");

    } catch (err) {
      console.error("Excel Hatası:", err);
      showError("Excel oluşturulamadı.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedCalendarID) return showWarning("Lütfen bir takvim seçin.");

    try {
      const selectedCalData = calendarData.find(cal => cal.id === selectedCalendarID);
      const calendarEvents = JSON.parse(selectedCalData.pastCallender);

      const allDates = [...new Set(calendarEvents.map(e => e.shiftDate))].sort();
      const allDepartments = [...new Set(calendarEvents.map(e => e.departman))]
        .sort((a, b) => (a.match(/\d+/) ? parseInt(a.match(/\d+/)[0]) : 0) - (b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : 0));

      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(18);
      doc.text(replaceTurkishChars(`${selectedCalendar} Nobet Listesi`), 14, 22);

      const tableBody = [];
      allDates.forEach(date => {
        const rowData = [new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })];
        allDepartments.forEach(dept => {
          const event = calendarEvents.find(e => e.shiftDate === date && e.departman === dept);
          const userFound = event ? users.find(u => u.username === event.username) : null;
          let name = userFound ? `${userFound.firstname || ''} ${userFound.lastname || ''}`.trim() : (event?.username || "");
          rowData.push(replaceTurkishChars(name));
        });
        tableBody.push(rowData);
      });

      autoTable(doc, {
        head: [["Tarih", ...allDepartments]],
        body: tableBody,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }, // Tailwind Blue-500
        alternateRowStyles: { fillColor: [248, 250, 252] },
        willDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 0) {
            const dateStr = data.cell.raw;
            if (dateStr && typeof dateStr === 'string') {
              const parts = dateStr.split('.');
              if (parts.length === 3) {
                const dayOfWeek = new Date(parts[2], parts[1] - 1, parts[0]).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  doc.setFillColor(254, 226, 226); // Açık kırmızı arka plan hafta sonu için
                }
              }
            }
          }
        }
      });

      doc.save(replaceTurkishChars(`${selectedCalendar}.pdf`));
      showSuccess("PDF oluşturuldu!");
    } catch (err) {
      showError("PDF oluşturulamadı.");
    }
  };

  return (
    <div className="bg-transparent rounded-lg text-black">
      {loading ? (
        <div className="flex justify-center p-10"><Loading /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Takvim Seçin</label>
              <select
                value={selectedCalendar}
                onChange={(e) => setSelectedCalendar(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {calendarNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Departman</label>
              <select
                value={filteredDepartments[0] || "Tümü"}
                onChange={(e) => setFilteredDepartments(e.target.value === "Tümü" ? [] : [e.target.value])}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Tümü">Tüm Departmanlar</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vardiya</label>
              <select
                value={filteredShifts[0] || "Tümü"}
                onChange={(e) => setFilteredShifts(e.target.value === "Tümü" ? [] : [Number(e.target.value)])}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Tümü">Tüm Vardiyalar</option>
                {shifts.map((shift) => (
                  <option key={shift} value={shift}>{shift}. Vardiya</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personel</label>
              <select
                value={filteredUsers[0] || "Tümü"}
                onChange={(e) => setFilteredUsers(e.target.value === "Tümü" ? [] : [e.target.value])}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Tümü">Tüm Personel</option>
                {users.map((u) => (
                  <option key={u.username} value={u.username}>
                    {u.firstname} {u.lastname ? u.lastname.charAt(0) + '.' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownloadExcel}
              disabled={!selectedCalendarID}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${selectedCalendarID ? "bg-green-600 hover:bg-green-700 text-white shadow-md" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Excel İndir
              </span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={!selectedCalendarID}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${selectedCalendarID ? "bg-red-500 hover:bg-red-600 text-white shadow-md" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                PDF İndir
              </span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={trLocale}
              events={filteredEvents}
              height={800} // Mobil için biraz daha kısa
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              eventContent={(arg) => (
                <div
                  className="p-1 cursor-pointer hover:opacity-80 transition-opacity"
                  dangerouslySetInnerHTML={{ __html: arg.event.extendedProps.customHTML }}
                />
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PastDutyCalendarUser;