"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Loading from "../../loading";
import api from "@/app/loaders/baseApi";
import CreatorPastCalendar from "@/app/components/creator/CreatorPastCalendar";
import CreatorDutyRequests from "@/app/components/creator/CreatorDutyRequest";
import CreatorDepartmanStore from "@/app/components/creator/CreatorDepartmanStore";
import CreatorUserStore from "@/app/components/creator/CreatorUserStore ";
import CreatorOffDayStore from "@/app/components/creator/CreatorOffDayStore";
import CreatorDepartmanOffDayStore from "@/app/components/creator/CreatorDepartmanOffDayStore"

const AdminPanel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [countOfCallendars, setCountOfCallendars] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [offdays, setOffdays] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [status, setStatus] = useState("pending");
  const [selectedAdminID, setSelectedAdminID] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null); // Kullanıcı Sil

  const [callenderData, setCallenderData] = useState([]);
  const [expandedAllUserId, setExpandedAllUserId] = useState(null); // Tüm kullanıcılar için
  const [expandedAdminUserId, setExpandedAdminUserId] = useState(null); // Adminler için
  const [currentPage, setCurrentPage] = useState(1);
  const [countOfPaginate, setCountOfPaginate] = useState(10); // Sayfa başına 10 öğe
  const [totalPages, setTotalPages] = useState(1);
  const [showSpecialTasks, setShowSpecialTasks] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [selectedAdminForTasks, setSelectedAdminForTasks] = useState(null);
  const [showUserStore, setShowUserStore] = useState(false);
  const [showOffdayStore, setShowOffdayStore] = useState(false);
  const [showDepartmanOffDayStore, setShowDepartmanOffDayStore] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 1
  });

  const [allUsersPagination, setAllUsersPagination] = useState({
    page: 1,
    perPage: 12, // Her sayfada 4 kullanıcı gösterelim
    totalPages: 1
  });

  // Tüm kullanıcıları ve admin kullanıcılarını API'den çekme ve sıralama
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.post('/api/usersStore', { role: 'all' }, {});
        const sortedUsers = [...response.data.data].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setAllUsers(sortedUsers);
        // Toplam sayfa sayısını hesapla
        setAllUsersPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(sortedUsers.length / prev.perPage)
        }));
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();

    // Admin kullanıcılarını çekme kısmı aynı kalacak
    const fetchAdminUsers = async () => {
      try {
        const adminRes = await api.post('/api/usersStore', { role: 'admin' }, {});
        const sortedAdminUsers = [...adminRes.data.data].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setAdminUsers(sortedAdminUsers);
      } catch (error) {
        console.error("Admin kullanıcıları yüklenirken hata oluştu:", error);
      }
    };
    fetchAdminUsers();
  }, []);

  const fetchPaginatedData = async (endpoint, params = {}, adminUser) => {
    try {
      const response = await api.post(endpoint, {
        ...params,
        page: pagination.page,
        countOfPaginate: pagination.perPage,
        adminId: adminUser?.adminID, // adminId ekleniyor
        username: adminUser?.username // username ekleniyor
      });

      if (response.data && response.data.success) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1
        }));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Veri yüklenirken hata oluştu:", error);
      return null;
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = allUsers.find(user => user.id === userId) ||
        adminUsers.find(user => user.id === userId);

      if (!userToDelete) {
        alert("Kullanıcı bulunamadı!");
        return;
      }

      const confirmDelete = window.confirm(
        `${userToDelete.firstname} ${userToDelete.lastname} kullanıcısını silmek istediğinize emin misiniz?`
      );

      if (!confirmDelete) return;

      setDeletingUserId(userId); // Silme işlemi başladı
      setLoading(true);

      const response = await api.post('/api/deleteUser', {
        userID: userId,
        adminID: userToDelete.adminID
      });

      if (response.data?.success) {
        setAllUsers(prev => prev.filter(u => u.id !== userId));
        setAdminUsers(prev => prev.filter(u => u.id !== userId));
        toast.success("Kullanıcı başarıyla silindi!");
      }
    } catch (error) {
      toast.error(`Silme işlemi başarısız: ${error.message}`);
    } finally {
      setLoading(false);
      setDeletingUserId(null); // İşlem tamamlandı
    }
  };

  // Kullanıcıları filtreleme
  const filteredUsers = (users) => {
    return users?.filter(user => {
      return user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleAllUserClick = (userId) => {
    setExpandedAllUserId(prevId => (prevId === userId ? null : userId));
    setExpandedAdminUserId(null); // Admin panelindeki açık kartı kapat
    setCountOfCallendars(null);
    setShowPanel(false);
    setSelectedAdminID(null);
    setSelectedUserName(null);
    setShowSpecialTasks(false); // Special Tasks panelini kapat
  };


  const handleDepartmanOffDayStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowDepartmanOffDayStore(true);
    setShowPanel(false);
    setShowSpecialTasks(false);
    setShowDepartments(false);
  };

  const handleOffdayStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowOffdayStore(true); // Add this state to your component
    setShowPanel(false);
    setShowSpecialTasks(false);
    setShowDepartments(false);
  };

  const handleAdminUserClick = (userId) => {
    setExpandedAdminUserId(prevId => (prevId === userId ? null : userId));
    setExpandedAllUserId(null); // Tüm kullanıcılardaki açık kartı kapat
    setCountOfCallendars(null);
    setShowPanel(false);
    setSelectedAdminID(null);
    setSelectedUserName(null);
    setShowSpecialTasks(false); // Special Tasks panelini kapat
  };

  const handleUserStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowUserStore(true);
    setShowPanel(false);
    setShowSpecialTasks(false);
    setShowDepartments(false);
  };


  // countOfCallender butonuna tıklandığında yapılacak işlem
  const handleCountOfCallender = async (adminID, username) => {
    try {
      setSelectedAdminID(adminID); // adminID'yi state'e kaydet
      setSelectedUserName(username);
      const response = await api.post('/api/countOfCallender', { adminID });
      if (response.data && response.data.success) {
        setCountOfCallendars(response.data.countOfCallendars);
        setPanelContent("countOfCallendars");
        setShowPanel(true);
        setShowSpecialTasks(false); // Special Tasks panelini kapat
      }
    } catch (error) {
      console.error("Takvim sayısı alınırken hata:", error);
    }
  };

  // departmanStore butonuna tıklandığında yapılacak işlem
  const handleDepartmanStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowDepartments(true);
    setShowPanel(false); // Diğer paneli kapat
    setShowSpecialTasks(false); // Special Tasks panelini kapat
  };

  // callenderStore butonuna tıklandığında yapılacak işlem
  const handleCallenderStore = async (adminID, username) => {
    try {
      setSelectedAdminID(adminID);
      setSelectedUserName(username); // username state'ini güncelle
      setPagination(prev => ({ ...prev, page: 1 }));
      const adminUser = adminUsers.find(user => user.adminID === adminID);
      const response = await fetchPaginatedData(
        '/api/callenderStore',
        {
          filter: "all",
          adminID: adminID,
          username: username // username'i de gönder
        },
        adminUser
      );

      if (response) {
        setCallenderData(response.data);
        setPanelContent("callenderStore");
        setShowPanel(true);
        setShowSpecialTasks(false); // Special Tasks panelini kapat
      }
    } catch (error) {
      console.error("Takvim verileri yüklenirken hata:", error);
    }
  };

  // Special Task butonuna tıklandığında yapılacak işlem
  const handleSpecialTask = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowSpecialTasks(true);
    setShowPanel(false); // Diğer paneli kapat
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Mevcut panel içeriğine göre veriyi yeniden yükle
      switch (panelContent) {
        case "departmanStore":
          handleDepartmanStore(selectedAdminID);
          break;
        case "offdayStore":
          handleOffdayStore();
          break;
        case "callenderStore":
          handleCallenderStore(selectedAdminID);
          break;
        default:
          break;
      }
    }
  };

  // Paneli kapatma işlevi
  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedAdminID(null); // State'i temizle
    setSelectedUserName(null);
  };

  const handleUserClick = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
    setCountOfCallendars(null);
    setShowPanel(false);
    setSelectedAdminID(null); // State'i temizle
    setSelectedUserName(null);
    setShowSpecialTasks(false); // Special Tasks panelini kapat
  };

  // Sayfa değişikliği için yeni fonksiyon
  const handleAllUsersPageChange = (newPage) => {
    if (newPage > 0 && newPage <= allUsersPagination.totalPages) {
      setAllUsersPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Sayfalanmış kullanıcıları hesapla
  const getPaginatedUsers = () => {
    const startIndex = (allUsersPagination.page - 1) * allUsersPagination.perPage;
    const endIndex = startIndex + allUsersPagination.perPage;
    return filteredUsers(allUsers).slice(startIndex, endIndex);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-42 pt-36 pb-36 text-black">
      <h1 className="text-3xl font-semibold mb-8 text-center">Admin Paneli</h1>

      {/* Kullanıcı Arama Çubuğu */}
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Tüm Kullanıcı Listesi */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Tüm Kullanıcılar</h2>
          <div className="flex items-center gap-4">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
              Toplam: {allUsers.length}
            </span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Sayfa: {allUsersPagination.page} / {allUsersPagination.totalPages}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {getPaginatedUsers().map((user) => (
            <UserCard
              key={user.id}
              user={user}
              expandedUserId={expandedAllUserId}
              handleUserClick={handleAllUserClick}
              handleCountOfCallender={handleCountOfCallender}
              handleDepartmanStore={handleDepartmanStore}
              handleOffdayStore={handleOffdayStore}
              handleCallenderStore={handleCallenderStore}
              handleSpecialTask={handleSpecialTask}
              countOfCallendars={countOfCallendars}
              setSelectedAdminID={setSelectedAdminID}
              setSelectedUserName={setSelectedUserName}
              handleUserStore={handleUserStore}
              handleDepartmanOffDayStore={handleDepartmanOffDayStore}
              panelContent={panelContent}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
        </div>

        {/* Tüm Kullanıcılar için Sayfalama */}
        <div className="mt-6 border-t pt-4">
          <Pagination
            currentPage={allUsersPagination.page}
            totalPages={allUsersPagination.totalPages}
            onPageChange={handleAllUsersPageChange}
          />
        </div>
      </div>

      {/* Admin Kullanıcı Listesi */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Kullanıcılar</h2>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Toplam: {adminUsers.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredUsers(adminUsers).map((user) => (
            <UserCard
              key={user.id}
              user={user}
              expandedUserId={expandedAdminUserId}
              handleUserClick={handleAdminUserClick}
              handleCountOfCallender={handleCountOfCallender}
              handleDepartmanStore={handleDepartmanStore}
              handleOffdayStore={handleOffdayStore}
              handleCallenderStore={handleCallenderStore}
              handleSpecialTask={handleSpecialTask}
              countOfCallendars={countOfCallendars}
              setSelectedAdminID={setSelectedAdminID}
              setSelectedUserName={setSelectedUserName}
              handleUserStore={handleUserStore}
              handleDepartmanOffDayStore={handleDepartmanOffDayStore}
              panelContent={panelContent}
            />
          ))}
        </div>
      </div>

      {/* Modals - All centered and full width */}
      {showPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {panelContent === "countOfCallendars" && "Admin Takvim Sayısı"}
                {panelContent === "departmanStore" && "Departmanlar"}
                {panelContent === "offdayStore" && "Offday Talepleri"}
                {panelContent === "callenderStore" && "Takvim Verileri"}
              </h2>
              <button
                onClick={handleClosePanel}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {panelContent === "countOfCallendars" && (
                <div className="text-center py-8">
                  <p className="text-2xl font-bold">
                    <span className="text-blue-600">{selectedUserName}</span> için kalan takvim sayısı:
                  </p>
                  <p className="text-4xl font-bold text-purple-600 mt-4">{countOfCallendars}</p>
                </div>
              )}
              {panelContent === "callenderStore" && (
                <CreatorPastCalendar
                  adminID={selectedAdminID}
                  username={selectedUserName}
                  style={{ height: '70vh' }}
                />
              )}

            </div>
          </div>
        </div>
      )}


      {/* Off Day */}
      {
        showOffdayStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">
                  {selectedUserName ? `${selectedUserName} - ` : ''}İzin Talepleri
                </h2>
                <button
                  onClick={() => setShowOffdayStore(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <CreatorOffDayStore adminID={selectedAdminForTasks} />
              </div>
            </div>
          </div>
        )
      }

      {/* Special Tasks Modal */}
      {
        showSpecialTasks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-3xl font-semibold">
                  {selectedUserName ? `${selectedUserName} - ` : ''}Nöbet Talepleri
                </h2>
                <button
                  onClick={() => setShowSpecialTasks(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <CreatorDutyRequests
                  adminID={selectedAdminForTasks}
                />
              </div>
            </div>
          </div>
        )
      }
      {/* User Store  */}
      {
        showUserStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-3xl font-semibold">
                  {selectedUserName ? `${selectedUserName} - ` : ''}Kullanıcı Yönetimi
                </h2>
                <button
                  onClick={() => setShowUserStore(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <CreatorUserStore adminID={selectedAdminForTasks} />
              </div>
            </div>
          </div>
        )
      }
      {/* Departman İzin GÜnleri */}
      {
        showDepartmanOffDayStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-3xl font-semibold">
                  {selectedUserName ? `${selectedUserName} - ` : ''}Departman İzinleri
                </h2>
                <button
                  onClick={() => setShowDepartmanOffDayStore(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <CreatorDepartmanOffDayStore adminID={selectedAdminForTasks} />
              </div>
            </div>
          </div>
        )
      }

      {/* Departman Modal */}
      {
        showDepartments && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-3xl font-semibold">
                  {selectedUserName ? `${selectedUserName} - ` : ''}Departmanlar
                </h2>
                <button
                  onClick={() => setShowDepartments(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <CreatorDepartmanStore
                  adminID={selectedAdminForTasks}
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};



// Pagination bileşeni
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Eğer toplam sayfa sayısı 1'den küçükse pagination'ı gösterme
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Önceki
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${currentPage === page
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sonraki
      </button>
    </div>
  );
};

// Kullanıcı kartı bileşeni
const UserCard = ({
  user,
  expandedUserId,
  handleUserClick,
  handleCountOfCallender,
  handleDepartmanStore,
  handleOffdayStore,
  handleCallenderStore,
  handleSpecialTask,
  handleUserStore,
  handleDeleteUser,
  deletingUserId,
  handleDepartmanOffDayStore,
  countOfCallendars,
  setSelectedUserName,
  setSelectedAdminID,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${expandedUserId === user.id ? "ring-2 ring-purple-500" : ""
        }`}
    >
      <div
        onClick={() => handleUserClick(user.id)}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-sm text-gray-500">
              @{user.username}
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedUserId === user.id ? "rotate-90" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {expandedUserId === user.id && (
        <div className="p-4 pt-0 border-t">
          <div className="mt-3 space-y-2 text-sm">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Telefon:</span> {user.phoneNumber || '-'}</p>
            <p><span className="font-medium">Admin ID:</span> {user.adminID}</p>
            <p><span className="font-medium">Rol:</span> {user.role}</p>
            <p><span className="font-medium">Id:</span> {user.id}</p>

            {user.role !== 'admin' && (
              <button
                onClick={() => handleDeleteUser(user.id)}
                disabled={deletingUserId === user.id}
                className={`p-2 bg-red-600 text-white rounded-lg w-full mt-3 ${deletingUserId === user.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
              >
                {deletingUserId === user.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Siliniyor...
                  </span>
                ) : 'Kullanıcıyı Sil'}
              </button>
            )}

            {user.role === 'admin' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDepartmanOffDayStore(user.adminID, user.username)}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Departman İzinleri
                </button>
                <button
                  onClick={() => handleUserStore(user.adminID, user.username)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Kullanıcı Yönetimi
                </button>
                <button
                  onClick={() => handleSpecialTask(user.adminID, user.username)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm col-span-2"
                >
                  Nöbet Talepleri
                </button>
                <button
                  onClick={() => handleCallenderStore(user.adminID, user.username)}
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  Takvimler
                </button>
                <button
                  onClick={() => handleOffdayStore(user.adminID, user.username)}
                  className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  İzinler
                </button>
                <button
                  onClick={() => handleDepartmanStore(user.adminID, user.username)}
                  className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm col-span-2"
                >
                  Departmanlar
                </button>
                <button
                  onClick={() => handleCountOfCallender(user.adminID)}
                  className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm col-span-2"
                >
                  Takvim Durumu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;