"use client";

import { useState, useEffect } from "react";
import api from "@/app/loaders/baseApi";
import Loading from "@/app/loading";
import { useNotification } from "@/app/components/NotificationContext";

const CreatorUserStore = ({ adminID }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError, showSuccess } = useNotification();

  // Fetch users for the admin
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/userStore", {
        params: {
          adminID,
          countOfPaginate: 100
        },
        withCredentials: true
      });

      if (response.data?.success) {
        setUsers(response.data.users.data || []);
      } else {
        showError("Kullanıcılar yüklenirken hata oluştu");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Kullanıcılar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminID) {
      fetchUsers();
    }
  }, [adminID]);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await api.post("/api/deleteUser", 
        { userID: userId,adminID },
        { withCredentials: true }
      );

      if (response.data?.success) {
        showSuccess("Kullanıcı başarıyla silindi");
        // Refresh the user list
        fetchUsers();
      } else {
        showError("Kullanıcı silinirken hata oluştu");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Kullanıcı silinirken hata oluştu");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Kullanıcı Yönetimi</h2>
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Toplam: {users.length}
        </span>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border text-left">Kullanıcı Adı</th>
                <th className="py-3 px-4 border text-left">Ad Soyad</th>
                <th className="py-3 px-4 border text-left">Email</th>
                <th className="py-3 px-4 border text-left">Telefon</th>
                <th className="py-3 px-4 border text-left">Rol</th>
                <th className="py-3 px-4 border text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border">{user.username}</td>
                  <td className="py-3 px-4 border">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="py-3 px-4 border">{user.email}</td>
                  <td className="py-3 px-4 border">{user.phoneNumber || "-"}</td>
                  <td className="py-3 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2 bg-red-300 rounded-full  text-red-600 hover:text-red-800 font-medium"
                      title="Kullanıcıyı sil"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "Aradığınız kriterlere uygun kullanıcı bulunamadı" : "Henüz kullanıcı kaydı bulunmamaktadır"}
        </div>
      )}
    </div>
  );
};

export default CreatorUserStore;