"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/loaders/baseApi";
import DateRequests from "./DateRequests";
import AdminCalendar from "./AdminCalendar";
import PastDutyCalendar from "../../components/PastDutyCalendar";
import Loading from "../../loading";
import UsersList from "../../components/UsersList";
import { useNotification } from '@/app/components/NotificationContext';
import Sidebar from "../../components/sidebar_left";
import MobileBottomBar from "../../components/mobile_bottom_bar";
import UserDutyList from "@/app/components/UserDutyList";
import ScrollHandler from '@/app/components/ScrollHandler';



export default function AdminDashboard() {
  const { showSuccess, showError, showWarning } = useNotification();
  const [error, setError] = useState(null);
  const [showPastCalendar, setShowPastCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUser2, setSelectedUser2] = useState("");
  const [startDate, setStartDate] = useState("");
  const [users, setUsers] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedShiftDay, setSelectedShiftDay] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [offdayReason, setOffdayReason] = useState("");
  const [SpecialtaskReason, setSpecialtaskReason] = useState("");
  const [calendarView, setCalendarView] = useState("izin"); // "izin", "gecmis", "benimNobetlerim"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, usersRes, departmanRes] = await Promise.all([
          api.get("/api/userData", { withCredentials: true, params: { countOfPaginate: 1000 } }),
          api.get("/api/userStore", { withCredentials: true, params: { countOfPaginate: 1000 } }),
          api.get("/api/departmanStore", { withCredentials: true, params: { countOfPaginate: 1000 } }),
        ]);

        // Handle users response
        if (usersRes.status === 200 && usersRes.data?.success && usersRes.data.users?.data) {
          setUsers(usersRes.data.users.data);
        } else {
          showError("Kullanıcılar yüklenirken hata oluştu.");
        }

        // Handle departments response
        if (departmanRes.status === 200 && departmanRes.data?.success && departmanRes.data.data?.data) {
          setDepartments(departmanRes.data.data.data);
        } else {
          showError("Departmanlar yüklenirken hata oluştu.");
        }

        setLoading(false);
      } catch {

        showError("Veriler yüklenirken hata oluştu.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const handleShiftAssignment = async (e) => {
    e.preventDefault();

    // Zorunlu alanları kontrol et
    if (!selectedDepartment || !selectedUser2 || !selectedShiftDay || !selectedShift || !SpecialtaskReason) {
      showError("Lütfen tüm alanları doldurun.");
      return;
    }

    // Gün tag'lerini belirle
    const dayTags = {
      Monday: "A",
      Tuesday: "B",
      Wednesday: "C",
      Thursday: "D",
      Friday: "E",
      Saturday: "F",
      Sunday: "G",
    };

    // Seçilen günün tag'ini al
    const dayTag = dayTags[selectedShiftDay];
    if (!dayTag) {
      showError("Geçersiz gün seçimi.");
      return;
    }

    // whichShift değerini oluştur (örneğin: AuserCountsShift3)
    const formattedShift = `${dayTag}${selectedShift}`;

    try {
      const response = await api.post(
        "/api/assingSpecialTask",
        {
          departmanName: selectedDepartment,
          userID: selectedUser2,
          shiftDay: selectedShiftDay,
          whichShift: formattedShift, // Oluşturulan whichShift değeri
          ResponsSpecialtaskReason: SpecialtaskReason,
        },
        {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          },
        }
      );

      if (response.status === 200) {
        showSuccess("Nöbet başarıyla atandı!");
        setSelectedDepartment("");
        setSelectedUser2("");
        setSelectedShiftDay("");
        setSelectedShift("");
        setSpecialtaskReason("");
        showError(null);
      }
    } catch (error) {
      showError(error.response?.data?.message || "Nöbet atanırken hata oluştu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !startDate || !endDate || !offdayReason) {
      showError("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await api.post(
        "/api/assignOffDays",
        {
          startDate,
          endDate,
          userID: selectedUser,
          offdayReason, // İzin nedeni
          ResponseOffdayReason: offdayReason, // Backend'in beklediği alan
        },
        {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          },
        }
      );

      if (response.status === 200) {
        showSuccess("İzin başarıyla atandı!");
        setSelectedUser("");
        setStartDate("");
        setEndDate("");
        setOffdayReason(""); // İzin nedenini temizle
        showError(null);
      }
    } catch (error) {
      // Backend'den gelen hata mesajını kontrol et
      if (error.response) {
        const errorMessage = error.response.data.message || "İzin atanırken hata oluştu.";
        showError(errorMessage); // Backend'den gelen hata mesajını göster
      } else if (error.request) {
        // İstek gönderildi ancak yanıt alınamadı
        showError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        // Beklenmeyen bir hata oluştu
        showError("İzin atanırken beklenmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 pb-32 xl:pb-0 text-black">


      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 xl:ml-[40vh] xl:mr-[40vh] p-2 sm:p-10">

      <ScrollHandler />
        
        <h1 className="text-4xl font-bold mb-6 pt-4">Yönetici Paneli</h1>
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-2xl p-8">
            <DateRequests />
          </div>
          <div className="bg-white rounded-2xl">
            <p className="text-2xl font-bold pt-6 px-6">
              {calendarView === "izin"
                ? "İzin Takvimi"
                : calendarView === "gecmis"
                  ? "Nöbet Takvimleri"
                  : "Nöbetlerim"}
            </p>
            <div className="flex space-x-4 pt-5 px-6" id="calendar">
              <button
                onClick={() => setCalendarView("izin")}
                className={`px-4 py-2 rounded-full ${calendarView === "izin" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                İzin Takvimi
              </button>
              <button
                onClick={() => setCalendarView("gecmis")}
                className={`px-4 py-2 rounded-full ${calendarView === "gecmis" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                Nöbet Takvimleri
              </button>
              <button
                onClick={() => setCalendarView("benimNobetlerim")}
                className={`px-4 py-2 rounded-full ${calendarView === "benimNobetlerim" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                Nöbetlerim
              </button>
            </div>
            {calendarView === "gecmis" ? (
              <PastDutyCalendar />
            ) : calendarView === "benimNobetlerim" ? (
              <UserDutyList />
            ) : (
              <AdminCalendar />
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Atamalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* İzin Atama Bölümü */}
            <div className="bg-gray-100 p-6 rounded-lg" id="assign_offday">
              <h3 className="text-xl font-semibold mb-4">İzin Atama</h3>
              <form onSubmit={handleSubmit}>
                {/* Kullanıcı Seçimi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Personel Seç</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Personel Seçiniz</option>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstname} {user.lastname}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Personel yükleniyor...</option>
                    )}
                  </select>
                </div>

                {/* İzin Başlangıç Tarihi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">İzin Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* İzin Bitiş Tarihi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">İzin Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* İzin Nedeni Input Alanı */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">İzin Nedeni</label>
                  <input
                    type="text"
                    value={offdayReason}
                    onChange={(e) => setOffdayReason(e.target.value)}
                    placeholder="İzin nedeni girin"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Hata Mesajı */}
                {error && <div className="text-red-600 mb-4">{error}</div>}

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                >
                  İzin Ata
                </button>
              </form>
            </div>

            {/* Nöbet Atama Bölümü */}
            <div className="bg-gray-100 p-6 rounded-lg" id="assign_duty">
              <h3 className="text-xl font-semibold mb-4">Nöbet Atama</h3>
              <form onSubmit={handleShiftAssignment}>
                {/* Departman Seçimi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Departman Seç</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Departman Seçiniz</option>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.departmanName}>
                          {dept.departmanName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Departman yükleniyor...</option>
                    )}
                  </select>
                </div>

                {/* Kullanıcı Seçimi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Personel Seç</label>
                  <select
                    value={selectedUser2}
                    onChange={(e) => setSelectedUser2(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Personel Seçiniz</option>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstname} {user.lastname}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Personel yükleniyor...</option>
                    )}
                  </select>
                </div>

                {/* Gün Seçimi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Gün Seç</label>
                  <select
                    value={selectedShiftDay}
                    onChange={(e) => setSelectedShiftDay(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Gün Seçiniz</option>
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
                  <label className="block text-sm font-medium text-gray-700">Vardiya Seç</label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Vardiya Seçiniz</option>
                    <option value="userCountsShift1">1. Vardiya</option>
                    <option value="userCountsShift2">2. Vardiya</option>
                    <option value="userCountsShift3">3. Vardiya</option>
                    <option value="userCountsShift4">4. Vardiya</option>
                    <option value="userCountsShift5">5. Vardiya</option>
                  </select>
                </div>

                {/* Görev Nedeni Input Alanı */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nöbet Nedeni</label>
                  <input
                    type="text"
                    value={SpecialtaskReason}
                    onChange={(e) => setSpecialtaskReason(e.target.value)}
                    placeholder="Nöbet nedeni girin"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Hata Mesajı */}
                {error && <div className="text-red-600 mb-4">{error}</div>}

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                >
                  Nöbet Ata
                </button>
              </form>
            </div>
          </div>
        </div>
      </main >

      {/* Right Sidebar */}
      < aside className="hidden xl:block w-[40vh] h-full bg-[#24244f] font-bold  fixed flex flex-col top-0 right-0" >
        <p className="text-2xl text-gray-300 flex items-center  justify-center pt-[69px]">Personel Listesi</p>
        {/* Placeholder for user list */}
        <div className="">
          <UsersList />
          {/* Add more users as needed */}
        </div>
      </aside >

      <MobileBottomBar />
    </div >
  );
}
