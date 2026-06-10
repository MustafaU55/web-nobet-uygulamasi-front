"use client";

import { useState, useEffect } from "react";
import { useNotification } from "@/app/components/NotificationContext";
import api from "@/app/loaders/baseApi";
import OffdayModal from "@/app/components/OffdayModal";
import OffdayListModal from "@/app/components/OffdayListModal";

const CreatorDepartmanOffDayStore = ({ adminID }) => {
  const { showError, showSuccess, showWarning } = useNotification();
  const [departments, setDepartments] = useState([]);
  const [offdayModalOpen, setOffdayModalOpen] = useState(false);
  const [selectedDepartmentForOffday, setSelectedDepartmentForOffday] = useState(null);
  const [offdayListModalOpen, setOffdayListModalOpen] = useState(false);
  const [selectedDepartmentForOffdays, setSelectedDepartmentForOffdays] = useState(null);
  const [offdayList, setOffdayList] = useState({ daily: [], weekly: [] });
  const [loading, setLoading] = useState(true);

  // Fetch departments for the admin
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/api/departmanStore", {
        withCredentials: true,
        params: {
          countOfPaginate: 1000,
          adminID: adminID
        }
      });

      if (res.status === 200 && res.data.success) {
        setDepartments(res.data.data.data);
      } else {
        showError("Departmanlar yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Departmanlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch department offdays
  const fetchDepartmentOffdays = async (departmanID) => {
    try {
      const res = await api.post(
        "/api/DepartmanOffDayStore",
        {
          departmanID,
          filterType: "all",
          adminID
        },
        {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          }
        }
      );

      if (res.status === 201 && res.data.success === "true") {
        const { departmansOffDays, departmansOffDayOfWeek } = res.data;

        const filteredDailyOffdays = departmansOffDays.data.filter(
          (offday) => offday.departmanID === departmanID && offday.adminID === adminID
        );

        const filteredWeeklyOffdays = departmansOffDayOfWeek.data.filter(
          (offday) => offday.departmanID === departmanID && offday.adminID === adminID
        );

        return {
          daily: filteredDailyOffdays,
          weekly: filteredWeeklyOffdays,
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

  // Handle offday submission
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
        const res = await api.post(
          "/api/addDepartmanOffday",
          {
            departmanID: departmentToUpdate.id,
            offdayStart,
            offdayEnd,
            adminID
          },
          { withCredentials: true }
        );

        if (res.status === 200 && (res.data.success === true || res.data.success === "true")) {
          showSuccess("İzin başarıyla eklendi.");
          setOffdayModalOpen(false);
          
          // Refresh offday list
          const updatedOffdays = await fetchDepartmentOffdays(departmentToUpdate.id);
          if (updatedOffdays) {
            setOffdayList(updatedOffdays);
          }
        }
      } else if (offdayType === "day") {
        const res = await api.post(
          "/api/addOffdayOfWeek",
          {
            departmanID: departmentToUpdate.id,
            offDayofweek,
            adminID
          },
          { withCredentials: true }
        );

        if (res.status === 200 && (res.data.success === true || res.data.success === "true")) {
          showSuccess("İzin günü başarıyla eklendi.");
          setOffdayModalOpen(false);
          
          // Refresh offday list
          const updatedOffdays = await fetchDepartmentOffdays(departmentToUpdate.id);
          if (updatedOffdays) {
            setOffdayList(updatedOffdays);
          }
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || "İzin eklenirken bir hata oluştu.");
    }
  };

  // Handle delete offday
  const handleDeleteOffday = async (departmanOffDayID) => {
    try {
      const res = await api.post(
        "/api/departmanOffDayDelete",
        { departmanOffDayID },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        showSuccess("İzin başarıyla silindi.");
        setOffdayList(prev => ({
          daily: prev.daily.filter(offday => offday.id !== departmanOffDayID),
          weekly: prev.weekly.filter(offday => offday.id !== departmanOffDayID)
        }));
      }
    } catch (err) {
      showError(err.response?.data?.message || "İzin silinirken bir hata oluştu.");
    }
  };

  // Handle open offday list modal
  const handleOpenOffdayListModal = async (department) => {
    setSelectedDepartmentForOffdays(department);
    const offdays = await fetchDepartmentOffdays(department.id);
    if (offdays) {
      setOffdayList(offdays);
    }
    setOffdayListModalOpen(true);
  };

  useEffect(() => {
    if (adminID) {
      fetchDepartments();
    }
  }, [adminID]);

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Departman İzin Yönetimi</h2>
      
      {departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {/* <button
                  onClick={() => {
                    setSelectedDepartmentForOffday(department.departmanName);
                    setOffdayModalOpen(true);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  İzin Ekle
                </button> */}
                <button
                  onClick={() => handleOpenOffdayListModal(department)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  İzinleri Görüntüle
                </button>
              </div>
              <p className="text-lg font-bold">{department.departmanName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Hiç departman bulunmamaktadır.</p>
      )}

      <OffdayModal
        isOpen={offdayModalOpen}
        onClose={() => setOffdayModalOpen(false)}
        onSubmit={handleOffdaySubmit}
        selectedDepartment={selectedDepartmentForOffday}
      />

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
    </div>
  );
};

export default CreatorDepartmanOffDayStore;