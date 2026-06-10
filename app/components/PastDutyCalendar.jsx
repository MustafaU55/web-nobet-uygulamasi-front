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

const replaceTurkishChars = (str) => {
    if (!str) return "";
    let letters = {
        "İ": "I", "I": "I", "Ş": "S", "Ğ": "G", "Ü": "U", "Ö": "O", "Ç": "C",
        "i": "i", "ı": "i", "ş": "s", "ğ": "g", "ü": "u", "ö": "o", "ç": "c"
    };
    return str.replace(/(([İIŞĞÜÖÇiışğüöç]))/g, function (letter) { return letters[letter]; });
};

const formatEvents = async (calendarData, user) => {
  if (!user || !user.data || !user.data.userData) {
    return [];
  }

  const loggedInUser = user.data.userData;

  const userStoreResponse = await api.get("/api/userStore", {
    withCredentials: true,
    params: {
      countOfPaginate: 1000,
    },
  });

  const users = userStoreResponse.data.users.data;

  return calendarData
    .map((adminData) => {
      if (typeof adminData.pastCallender !== 'string') return [];
      const events = JSON.parse(adminData.pastCallender);
      return events.map((event) => {
        const isLoggedInUserEvent = event.username === loggedInUser.username;
        const shiftLabel = `V${event.whichShift}`;

        const userFound = users.find((user) => user.username === event.username);
        const displayName = userFound
          ? `${userFound.firstname || 'Atanmamış'} ${userFound.lastname ? userFound.lastname.charAt(0) + '.' : 'Atanmamış'}`
          : 'Atanmamış';

        return {
          title: `${event.departman} / ${displayName} / ${shiftLabel}`,
          start: event.shiftDate,
          departman: event.departman,
          callenderName: adminData.callenderName,
          callenderID: adminData.id,
          whichShift: event.whichShift,
          username: event.username,
          displayName: displayName,
          color: isLoggedInUserEvent
            ? "#822E81"
            : (event.type === "regular"
              ? "#BABAE9"
              : "#85C0FC"),
          textColor: isLoggedInUserEvent
            ? "#FFFFFF"
            : (event.type === "regular"
              ? "#232344"
              : "#AA6373"),
          extendedProps: {
            customHTML: `<div class="font-semibold">${event.departman}</div><div class="text-sm">${displayName}</div><div class="text-xs opacity-75">${shiftLabel}</div>`,
          },
        };
      });
    })
    .flat();
};

const PastCalendar = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [calendarNames, setCalendarNames] = useState([]);
  const [selectedCalendarID, setSelectedCalendarID] = useState("");
  const calendarRef = useRef(null);
  const [calendarData, setCalendarData] = useState([]);
  const { showSuccess, showError, showWarning } = useNotification();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const filterEvents = (events, filteredDepartments, filteredShifts, filteredUsers) => {
    return events.filter((event) => {
      return (
        (filteredDepartments.length === 0 || filteredDepartments.includes(event.departman)) &&
        (filteredShifts.length === 0 || filteredShifts.includes(event.whichShift)) &&
        (filteredUsers.length === 0 || filteredUsers.includes(event.username))
      );
    });
  };

  const handleUserFilter = (event) => {
    const selectedUser = event.target.value;

    if (selectedUser === "Tüm Personel") {
      setFilteredUsers([]);
      return;
    }

    const selectedUserObj = users.find(user =>
      `${user.firstname} ${user.lastname ? user.lastname.charAt(0) + '.' : ''}` === selectedUser
    );

    if (selectedUserObj) {
      setFilteredUsers([selectedUserObj.username]);
    } else {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get("/api/userData", {
          withCredentials: true, params: {
            countOfPaginate: 1000
          }
        });
        setUser(userRes.data);
        const userStoreResponse = await api.get("/api/userStore", {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          },
        });
        setUsers(userStoreResponse.data.users.data);
      } catch (error) {
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/callenderStore", {
          params: {
            filter: "all",
            countOfPaginate: 1000,
          },
          withCredentials: true,
        });
        const data = res.data.data.data;
        setCalendarData(data);

        if (Array.isArray(data)) {
          const formattedEvents = await formatEvents(data, user);
          setEvents(formattedEvents);

          const uniqueCalendarNames = [...new Set(data.map((cal) => cal.callenderName))];
          setCalendarNames(uniqueCalendarNames);

          const uniqueDepartments = [...new Set(formattedEvents.map((event) => event.departman))];
          setDepartments(uniqueDepartments);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCalendarData();
    }
  }, [user]);

  const handleDepartmentFilter = (event) => {
    const selectedDepartment = event.target.value;
    setFilteredDepartments(selectedDepartment === "Tüm Departmanlar" ? [] : [selectedDepartment]);
  };

  const handleShiftFilter = (event) => {
    const selectedShift = event.target.value;
    setFilteredShifts(selectedShift === "Tüm Vardiyalar" ? [] : [Number(selectedShift)]);
  };

  const handleCalendarChange = (event) => {
    const selectedName = event.target.value;
    setSelectedCalendar(selectedName);

    const selectedCalendarData = calendarData.find((cal) => cal.callenderName === selectedName);
    if (selectedCalendarData) {
      setSelectedCalendarID(selectedCalendarData.id);
    } else {
      setSelectedCalendarID("");
    }

    if (calendarRef.current && selectedName) {
      const selectedCalendarEvents = events.filter(
        (event) => event.callenderName === selectedName
      );
      if (selectedCalendarEvents.length > 0) {
        const firstEventDate = selectedCalendarEvents[0].start;
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(firstEventDate);
      }
    }
  };

  // ===== RENKLİ VE STİLLİ EXCEL İNDİRME FONKSİYONU =====
  const handleDownloadCalendar = async () => {
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
            row.push("-"); // Boş hücreler için çizgi koyduk
          }
        }
        dataMatrix.push(row);
      }

      // 2. Worksheet (Çalışma Sayfası) Oluştur
      const ws = XLSX.utils.aoa_to_sheet(dataMatrix);

      // 3. Stilleri Uygula (xlsx-js-style özellikleri)
      const range = XLSX.utils.decode_range(ws['!ref']);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;

          // Ortak Kenarlık ve Hizalama
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

          // Başlık Satırı (Lacivert)
          if (R === 0) {
            cellStyle.fill = { fgColor: { rgb: "1E3A8A" } }; 
            cellStyle.font = { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } }; 
          } 
          // Tarih Sütunu (Açık Gri)
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

      showSuccess("Renkli Takvim başarıyla indirildi!");

    } catch (err) {
      console.error(err);
      showError("Takvim indirilirken bir hata oluştu.");
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

  const filteredEvents = filterEvents(events, filteredDepartments, filteredShifts, filteredUsers).filter(
    (event) => !selectedCalendar || event.callenderName === selectedCalendar
  );

  return (
    <div className="px-6 pt-2 pb-7 bg-white rounded-lg text-black">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid lg:grid-cols-3">
            <div className="mb-4 mr-2">
              <label htmlFor="calendarSelect" className="block text-sm font-medium text-gray-700">
                Takvim Seçin
              </label>
              <select
                id="calendarSelect"
                value={selectedCalendar}
                onChange={handleCalendarChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Tüm Takvimler</option>
                {calendarNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 mr-2">
              <label htmlFor="departmentSelect" className="block text-sm font-medium text-gray-700">
                Departman Seçin
              </label>
              <select
                id="departmentSelect"
                value={filteredDepartments.length === 0 ? "Tüm Departmanlar" : filteredDepartments[0]}
                onChange={handleDepartmentFilter}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Tüm Departmanlar">Tüm Departmanlar</option>
                {departments
                  .slice()
                  .sort((a, b) => {
                    const aNumber = a ? a.match(/\d+/) : null;
                    const bNumber = b ? b.match(/\d+/) : null;
                    return (aNumber ? Number(aNumber[0]) : 0) - (bNumber ? Number(bNumber[0]) : 0);
                  })
                  .map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4 mr-2">
              <label htmlFor="shiftSelect" className="block text-sm font-medium text-gray-700">
                Vardiya Seçin
              </label>
              <select
                id="shiftSelect"
                value={filteredShifts.length === 0 ? "Tüm Vardiyalar" : filteredShifts[0]}
                onChange={handleShiftFilter}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Tüm Vardiyalar">Tüm Vardiyalar</option>
                {shifts.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}. Vardiya
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 flex space-x-3">
            <button
              onClick={handleDownloadCalendar}
              disabled={!selectedCalendarID}
              className={`px-4 py-2 rounded-full ${selectedCalendarID ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Excel Olarak İndir
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={!selectedCalendarID}
              className={`px-4 py-2 rounded-full ${selectedCalendarID ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
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

export default PastCalendar;