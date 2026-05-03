"use client"

// pages/DepartmentManager.js
import React, { useState, useEffect, Suspense } from "react";
import api from "@/app/loaders/baseApi";
import { useNotification } from '@/app/components/NotificationContext';
import Loading from "../../loading";
import CreateDepartmentForm from "@/app/components/CreateDepartmentForm";
import AssignUserForm from "@/app/components/AssignUserForm";
import DepartmentList from "@/app/components/DepartmentList";
import AssignedUsersList from "@/app/components/AssignedUsersList";
import ScrollHandler from '@/app/components/ScrollHandler';

const DepartmentManager = () => {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [loadingDepartmentsForAssignment, setLoadingDepartmentsForAssignment] = useState(true);
    const { showError, showSuccess, showWarning } = useNotification();

    // Modal state'leri
    const [offdayModalOpen, setOffdayModalOpen] = useState(false);
    const [selectedDepartmentForOffday, setSelectedDepartmentForOffday] = useState(null);
    const [offdayListModalOpen, setOffdayListModalOpen] = useState(false);
    const [selectedDepartmentForOffdays, setSelectedDepartmentForOffdays] = useState(null);

    // İzin Al butonu için modal açma fonksiyonu
    const handleOpenOffdayModal = (departmanName) => {
        setSelectedDepartmentForOffday(departmanName);
        setOffdayModalOpen(true);
    };

    // İzinleri Göster butonu için modal açma fonksiyonu
    const handleOpenOffdayListModal = (department) => {
        setSelectedDepartmentForOffdays(department);
        setOffdayListModalOpen(true);
    };

    const hexToRgb = (hex) => {
        // HEX rengini RGB'ye dönüştür
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`; // Format: "0,82,102"
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoadingDepartments(true);
            setLoadingDepartmentsForAssignment(true);
            try {
                const response = await api.get("/api/departmanStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });

                if (response.data && Array.isArray(response.data.data.data)) {
                    setDepartments(response.data.data.data);
                } else {
                    setDepartments([]); // Yanıt geçersizse boş dizi ata
                }
            } catch (error) {
                setDepartments([]); // Hata durumunda boş dizi ata
            } finally {
                setLoadingDepartments(false);
                setLoadingDepartmentsForAssignment(false);
            }
        };

        fetchDepartments();
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const assignedResponse = await api.get("/api/assingSpecialDepartmanStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });
                if (assignedResponse.data && Array.isArray(assignedResponse.data.data.data)) {
                    setAssignedUsers(assignedResponse.data.data.data);
                } else {
                    setAssignedUsers([]);
                }

                const usersResponse = await api.get("/api/userStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });
                if (usersResponse.data && Array.isArray(usersResponse.data.users.data)) {
                    setUsers(usersResponse.data.users.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                showError("Veriler yüklenirken bir hata oluştu.");
            }
        };

        fetchData();
    }, []);

    const handleCreateDepartment = async (data) => {
        let res
        try {
            res = await api.post("/api/createDepartman", data, {
                withCredentials: true, params: {
                    countOfPaginate: 1000,
                }
            });
            if (res.data.success === true) {
                const updatedDepartments = await api.get("/api/departmanStore", {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                });
                setDepartments(updatedDepartments.data.data);
                showWarning("Departman bilgileri güncellendi.");
            } else {
                showError("Departman oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman oluşturulurken bir hata oluştu.");
        } finally {
            return res
        }
    };

    const handleAssignUser = async (user, departments) => {
        try {
            const res = await api.post(
                "/api/assingSpecialDepartman",
                {
                    departmanNames: departments,
                    userID: user.id,
                },
                {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            // API yanıtını kontrol et
            if (res.status === 200 && res.data.success === "true") {
                showSuccess("Personel başarıyla departmanlara atandı.");

                // Yeni atanmış kullanıcıyı assignedUsers state'ine ekle
                const newAssignment = {
                    id: user.id, // Kullanıcının ID'sini kullanıyoruz
                    userID: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    departmanNames: departments,
                };

                // State'i güncelle
                setAssignedUsers((prev) => [...prev, newAssignment]);

                // Departman listesini yeniden çek
                const updatedDepartments = await api.get("/api/departmanStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });

                if (updatedDepartments.data && Array.isArray(updatedDepartments.data.data.data)) {
                    setDepartments(updatedDepartments.data.data.data);
                } else {
                    setDepartments([]); // Yanıt geçersizse boş dizi ata
                }

                // Atanmış kullanıcılar listesini yeniden çek
                const assignedResponse = await api.get("/api/assingSpecialDepartmanStore", {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                });

                if (assignedResponse.data && Array.isArray(assignedResponse.data.data.data)) {
                    setAssignedUsers(assignedResponse.data.data.data);
                } else {
                    setAssignedUsers([]);
                }
            } else {
                showError("Kullanıcı departmanlara atanamadı. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Kullanıcı departmanlara atanırken bir hata oluştu.");
        }
    };


    const handleDeleteDepartment = async (departmanName) => {
        try {
            const departmentToDelete = departments.find((department) => department.departmanName === departmanName);
            if (!departmentToDelete) {
                showError("Departman bulunamadı.");
                return;
            }

            const res = await api.post(
                "/api/deleteDepartman",
                { departmanID: departmentToDelete.id },
                {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("Departman başarıyla silindi.");

                // Sayfayı yenile
                window.location.reload();
            } else {
                showError("Departman silinemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman silinirken bir hata oluştu.");
        }
    };

    const handleUpdatePriority = async (departmanName, newPriority) => {
        try {
            const departmentToUpdate = departments.find((department) => department.departmanName === departmanName);
            if (!departmentToUpdate) {
                showError("Departman bulunamadı.");
                return;
            }

            const res = await api.put(
                "/api/updateDepartmanPriority",
                {
                    departmanID: departmentToUpdate.id,
                    priority: newPriority,
                },
                {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                }
            );


            if (res.status === 200 && res.data.success) {
                showSuccess("Departman önceliği başarıyla güncellendi.");
                // Departman listesini güncelle
                const updatedDepartments = departments.map((department) =>
                    department.departmanName === departmanName
                        ? { ...department, priority: newPriority }
                        : department
                );
                setDepartments(updatedDepartments);
            } else {
                showError("Departman önceliği güncellenemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman önceliği güncellenirken bir hata oluştu.");
        }
    };

    const handleUpdateUserCounts = async (departmanID, identifier, userCounts) => {
        try {
            const res = await api.put(
                "/api/updateDepartmansUserCounts",
                {
                    departmanID,
                    identifier,
                    userCounts,
                },
                {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("Çalışan sayısı başarıyla güncellendi.");
                // Departman listesini yeniden çek
                const updatedDepartments = await api.get("/api/departmanStore", {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                });
                if (updatedDepartments.data && Array.isArray(updatedDepartments.data.data.data)) {
                    setDepartments(updatedDepartments.data.data.data);
                } else {
                    setDepartments([]); // Yanıt geçersizse boş dizi ata
                }
            } else {
                showError("Çalışan sayısı güncellenemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Çalışan sayısı güncellenirken bir hata oluştu.");
        }
    };

    const handleUpdateColor = async (departmanID, newColor) => {
        try {
            // newColor'ün doğru formatta olduğundan emin ol (örneğin: "0,82,102")
            const formattedColor = newColor.includes(",") ? newColor : hexToRgb(newColor);

            const res = await api.post(
                "/api/departmanColerUpdate",
                {
                    departmanID: departmanID,
                    RgbNumber: formattedColor, // Format: "0,82,102"
                },
                {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("Departman rengi başarıyla güncellendi.");

                // Departman listesini yeniden çek
                const updatedDepartments = await api.get("/api/departmanStore", {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                });
                if (updatedDepartments.data && Array.isArray(updatedDepartments.data.data.data)) {
                    setDepartments(updatedDepartments.data.data.data);
                } else {
                    setDepartments([]); // Yanıt geçersizse boş dizi ata
                }

                showWarning("Departman bilgileri güncellendi.");
            } else {
                showError("Departman rengi güncellenemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Departman rengi güncellenirken bir hata oluştu.");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            const res = await api.post(
                "/api/assingSpecialDepartmanDelete",
                { assingSpecialDepartmanID: assignmentId },
                {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                }
            );

            if (res.status === 200 && res.data.success) {
                showSuccess("Atama başarıyla silindi.");
                const assignedResponse = await api.get("/api/assingSpecialDepartmanStore", {
                    withCredentials: true, params: {
                        countOfPaginate: 1000,
                    }
                });
                if (assignedResponse.data && Array.isArray(assignedResponse.data.data.data)) {
                    setAssignedUsers(assignedResponse.data.data.data);
                }
            } else {
                showError("Atama silinemedi. Lütfen tekrar deneyin.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Atama silinirken bir hata oluştu.");
        }
    };

    return (
        <div className="text-black">

            <ScrollHandler />

            <h1 className="text-3xl font-bold mb-6">Departman Yönetimi</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <CreateDepartmentForm onCreate={handleCreateDepartment} />
                <div id="department-assign">
                <AssignUserForm
                    users={users}
                    departments={departments}
                    onAssign={handleAssignUser}
                />
                </div>
            </div>
            <div id="department_list">
            <DepartmentList
                departments={departments}
                onDelete={handleDeleteDepartment}
                onEdit={() => { }}
                onUpdatePriority={handleUpdatePriority}
                onUpdateUserCounts={handleUpdateUserCounts}
                onUpdateColor={handleUpdateColor}
                onOpenOffdayModal={handleOpenOffdayModal} // İzin Al butonu için fonksiyon
                onOpenOffdayListModal={handleOpenOffdayListModal} // İzinleri Göster butonu için fonksiyon
            />
            </div>
            <div id="department_user_list">
                <AssignedUsersList
                    assignedUsers={assignedUsers}
                    users={users}
                    onDeleteAssignment={handleDeleteAssignment}
                />
            </div>
            {/* İzin Al Modal'ı */}
            {offdayModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">İzin Ekle</h2>
                        <p>{selectedDepartmentForOffday} için izin ekleme formu burada olacak.</p>
                        <button
                            onClick={() => setOffdayModalOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}

            {/* İzinleri Göster Modal'ı */}
            {offdayListModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{selectedDepartmentForOffdays?.departmanName} İzinleri</h2>
                        <p>İzin listesi burada gösterilecek.</p>
                        <button
                            onClick={() => setOffdayListModalOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManager;