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
  const [deletingUserId, setDeletingUserId] = useState(null);

  const [callenderData, setCallenderData] = useState([]);
  const [expandedAllUserId, setExpandedAllUserId] = useState(null);
  const [expandedAdminUserId, setExpandedAdminUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [countOfPaginate, setCountOfPaginate] = useState(10);
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
    perPage: 12,
    totalPages: 1
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.post('/api/usersStore', { role: 'all' }, {});
        const sortedUsers = [...response.data.data].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setAllUsers(sortedUsers);
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
        adminId: adminUser?.adminID,
        username: adminUser?.username
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

      setDeletingUserId(userId);
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
      setDeletingUserId(null);
    }
  };

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
    setExpandedAdminUserId(null);
    setCountOfCallendars(null);
    setShowPanel(false);
    setSelectedAdminID(null);
    setSelectedUserName(null);
    setShowSpecialTasks(false);
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
    setShowOffdayStore(true);
    setShowPanel(false);
    setShowSpecialTasks(false);
    setShowDepartments(false);
  };

  const handleAdminUserClick = (userId) => {
    setExpandedAdminUserId(prevId => (prevId === userId ? null : userId));
    setExpandedAllUserId(null);
    setCountOfCallendars(null);
    setShowPanel(false);
    setSelectedAdminID(null);
    setSelectedUserName(null);
    setShowSpecialTasks(false);
  };

  const handleUserStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowUserStore(true);
    setShowPanel(false);
    setShowSpecialTasks(false);
    setShowDepartments(false);
  };

  const handleCountOfCallender = async (adminID, username) => {
    try {
      setSelectedAdminID(adminID);
      setSelectedUserName(username);
      const response = await api.post('/api/countOfCallender', { adminID });
      if (response.data && response.data.success) {
        setCountOfCallendars(response.data.countOfCallendars);
        setPanelContent("countOfCallendars");
        setShowPanel(true);
        setShowSpecialTasks(false);
      }
    } catch (error) {
      console.error("Takvim sayısı alınırken hata:", error);
    }
  };

  const handleDepartmanStore = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowDepartments(true);
    setShowPanel(false);
    setShowSpecialTasks(false);
  };

  const handleCallenderStore = async (adminID, username) => {
    try {
      setSelectedAdminID(adminID);
      setSelectedUserName(username);
      setPagination(prev => ({ ...prev, page: 1 }));
      const adminUser = adminUsers.find(user => user.adminID === adminID);
      const response = await fetchPaginatedData(
        '/api/callenderStore',
        {
          filter: "all",
          adminID: adminID,
          username: username
        },
        adminUser
      );

      if (response) {
        setCallenderData(response.data);
        setPanelContent("callenderStore");
        setShowPanel(true);
        setShowSpecialTasks(false);
      }
    } catch (error) {
      console.error("Takvim verileri yüklenirken hata:", error);
    }
  };

  const handleSpecialTask = (adminID, username) => {
    setSelectedAdminForTasks(adminID);
    setSelectedUserName(username);
    setShowSpecialTasks(true);
    setShowPanel(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedAdminID(null);
    setSelectedUserName(null);
  };

  const handleAllUsersPageChange = (newPage) => {
    if (newPage > 0 && newPage <= allUsersPagination.totalPages) {
      setAllUsersPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const getPaginatedUsers = () => {
    const startIndex = (allUsersPagination.page - 1) * allUsersPagination.perPage;
    const endIndex = startIndex + allUsersPagination.perPage;
    return filteredUsers(allUsers).slice(startIndex, endIndex);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">

      {/* Modern Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Yönetim Paneli</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Sistem ve Kullanıcı Yönetim Merkezi</p>
        </div>

        {/* Modern Search Bar */}
        <div className="relative w-full sm:w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="İsim, e-posta, tel no ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">

        {/* --- Yöneticiler (Admins) Section --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Yöneticiler (Admins)</h2>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold">
              {adminUsers.length} Kayıt
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                handleUserStore={handleUserStore}
                handleDepartmanOffDayStore={handleDepartmanOffDayStore}
                handleDeleteUser={handleDeleteUser}
                deletingUserId={deletingUserId}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-slate-200" />

        {/* --- Tüm Kullanıcılar Section --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Tüm Personel</h2>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
              {allUsers.length} Kayıt
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                handleUserStore={handleUserStore}
                handleDepartmanOffDayStore={handleDepartmanOffDayStore}
                handleDeleteUser={handleDeleteUser}
                deletingUserId={deletingUserId}
              />
            ))}
          </div>

          {/* Pagination Component */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={allUsersPagination.page}
              totalPages={allUsersPagination.totalPages}
              onPageChange={handleAllUsersPageChange}
            />
          </div>
        </section>

      </div>

      {/* --- Modals (Paneller) --- */}
      {/* (Mevcut Modal yapıları aynı tutuldu, sadece arka plan backdrop-blur yapıldı) */}
      {showPanel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {panelContent === "countOfCallendars" && "Admin Takvim Sayısı"}
                {panelContent === "departmanStore" && "Departmanlar"}
                {panelContent === "offdayStore" && "Offday Talepleri"}
                {panelContent === "callenderStore" && "Takvim Verileri"}
              </h2>
              <button onClick={handleClosePanel} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {panelContent === "countOfCallendars" && (
                <div className="text-center py-12">
                  <p className="text-xl font-medium text-slate-600">
                    <span className="font-bold text-indigo-600">{selectedUserName}</span> kullanıcısı için kalan takvim hakkı:
                  </p>
                  <p className="text-6xl font-black text-slate-800 mt-6">{countOfCallendars}</p>
                </div>
              )}
              {panelContent === "callenderStore" && (
                <CreatorPastCalendar adminID={selectedAdminID} username={selectedUserName} />
              )}
            </div>
          </div>
        </div>
      )}

      {showOffdayStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedUserName ? `${selectedUserName} - ` : ''}İzin Talepleri
              </h2>
              <button onClick={() => setShowOffdayStore(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <CreatorOffDayStore adminID={selectedAdminForTasks} />
            </div>
          </div>
        </div>
      )}

      {showSpecialTasks && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedUserName ? `${selectedUserName} - ` : ''}Nöbet Talepleri
              </h2>
              <button onClick={() => setShowSpecialTasks(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <CreatorDutyRequests adminID={selectedAdminForTasks} />
            </div>
          </div>
        </div>
      )}

      {showUserStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedUserName ? `${selectedUserName} - ` : ''}Kullanıcı Yönetimi
              </h2>
              <button onClick={() => setShowUserStore(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <CreatorUserStore adminID={selectedAdminForTasks} />
            </div>
          </div>
        </div>
      )}

      {showDepartmanOffDayStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedUserName ? `${selectedUserName} - ` : ''}Departman İzinleri
              </h2>
              <button onClick={() => setShowDepartmanOffDayStore(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <CreatorDepartmanOffDayStore adminID={selectedAdminForTasks} />
            </div>
          </div>
        </div>
      )}

      {showDepartments && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedUserName ? `${selectedUserName} - ` : ''}Departmanlar
              </h2>
              <button onClick={() => setShowDepartments(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <CreatorDepartmanStore adminID={selectedAdminForTasks} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


// Modern Pagination Bileşeni
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 mt-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200 w-fit mx-auto">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
      >
        Önceki
      </button>

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
      >
        Sonraki
      </button>
    </div>
  );
};

// Avatar Helper
const getInitials = (first, last) => {
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
};

// Modern User Card Bileşeni
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
}) => {
  const isExpanded = expandedUserId === user.id;
  const isAdmin = user.role === 'admin';

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? "border-indigo-500 shadow-lg shadow-indigo-100" : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
      }`}>

      {/* Card Header (Clickable) */}
      <div
        onClick={() => handleUserClick(user.id)}
        className="p-5 cursor-pointer flex items-start gap-4"
      >
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
          {getInitials(user.firstname, user.lastname)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-800 truncate">
              {user.firstname} {user.lastname}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${isAdmin ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
              {isAdmin ? 'Yönetici' : 'Personel'}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate mt-0.5">@{user.username}</p>
        </div>

        {/* Expand Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 group-hover:bg-slate-50'}`}>
            <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 border-t border-slate-100 mt-2">

          {/* User Details Box */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>{user.phoneNumber || 'Belirtilmemiş'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
              <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">ID: {user.adminID}</span>
            </div>
          </div>

          {/* Normal Personel (User) Action */}
          {!isAdmin && (
            <button
              onClick={() => handleDeleteUser(user.id)}
              disabled={deletingUserId === user.id}
              className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl font-medium text-sm transition-all ${deletingUserId === user.id
                  ? 'bg-red-50 text-red-400 cursor-not-allowed'
                  : 'bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                }`}
            >
              {deletingUserId === user.id ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              )}
              {deletingUserId === user.id ? 'Siliniyor...' : 'Personeli Sistemden Sil'}
            </button>
          )}

          {/* Admin Actions (Modern Grid Toolbar) */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn
                title="Takvimler"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                onClick={() => handleCallenderStore(user.adminID, user.username)}
                colorClass="text-blue-600 hover:bg-blue-50 hover:border-blue-200"
              />
              <ActionBtn
                title="Kullanıcılar"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                onClick={() => handleUserStore(user.adminID, user.username)}
                colorClass="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
              />
              <ActionBtn
                title="Nöbet Talebi"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>}
                onClick={() => handleSpecialTask(user.adminID, user.username)}
                colorClass="text-purple-600 hover:bg-purple-50 hover:border-purple-200"
              />
              <ActionBtn
                title="İzin Talebi"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                onClick={() => handleOffdayStore(user.adminID, user.username)}
                colorClass="text-orange-600 hover:bg-orange-50 hover:border-orange-200"
              />
              <ActionBtn
                title="Departmanlar"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                onClick={() => handleDepartmanStore(user.adminID, user.username)}
                colorClass="text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
              />
              <ActionBtn
                title="Dept. İzinleri"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                onClick={() => handleDepartmanOffDayStore(user.adminID, user.username)}
                colorClass="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
              />
              <div className="col-span-2">
                <ActionBtn
                  title="Kalan Takvim Hakkı"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                  onClick={() => handleCountOfCallender(user.adminID, user.username)}
                  colorClass="text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200 justify-center"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Yeni Toolbar Buton Bileşeni (Admin paneli için)
const ActionBtn = ({ title, icon, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 p-2.5 rounded-xl border border-transparent transition-all duration-200 text-sm font-medium w-full ${colorClass}`}
  >
    {icon}
    {title}
  </button>
);

export default AdminPanel;