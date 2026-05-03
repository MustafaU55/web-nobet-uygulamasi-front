'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '../../loading';
import api from '@/app/loaders/baseApi'; // API istemcisini içe aktar
import Sidebar from '../../components/sidebar_left';
import MobileBottomBar from '../../components/mobile_bottom_bar';

export default function Users() {
  const [users, setUsers] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/userStore', {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          },
        });

       

        if (res.data.success && Array.isArray(res.data.users.data)) {
          setUsers(res.data.users.data); // Ensure res.data.users is an array
        } else {

        }
      } catch {
  
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Fetch işlemi başlatılıyor
  }, []);

  const deleteUser = async (userId) => {
    try {
      const res = await api.post(
        '/api/deleteUser',
        { userID: userId }, // userID olarak gönderiyoruz
        {
          withCredentials: true,
          params: {
            countOfPaginate: 1000,
          },
        }
      );

      if (res.data.success) {
        // Kullanıcı başarıyla silindi, kullanıcı listesini güncelle
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch {
    }
  };

  // Ensure users is an array before filtering
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        return (
          (user.firstname &&
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.lastname &&
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.username &&
            user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.phoneNumber &&
            user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    : [];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-blue-300 ">
      <Sidebar />
      <div className="min-h-screen xl:ml-[40vh] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
        <title>Kullanıcı Listesi - NöbetX</title>
        <meta
          name="description"
          content="Çalışanlarınıza ya da iş arkadaşlarını kolayca bulup ulaşabilirsiniz.. Daha fazlası NöbetX.com'da."
        />
        {/* Favicon (Site logosu) */}
        <link rel="icon" href="/logoj.png" />

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Personel Listesi
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </h1>
        </div>

        {/* Search Section */}
        <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl p-6 mb-8 transform transition-all duration-300 ">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Personel ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 1550:grid-cols-2 custom:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id} // Add this line
              className="group bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 "
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-[2px]"> */}
                    {/* <div className="absolute inset-[2px] bg-white rounded-full"> */}
                    {/* <img
                src={user.profilePhotoUrl || '/default-avatar.png'}
                alt={user.firstname}
                fill
                className="object-cover rounded-full"
              /> */}
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate transition-colors">
                      {user.firstname} {user.lastname}
                    </p>
                    {user.username && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.username}
                      </p>
                    )}
                    {user.email && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    )}
                    {user.phoneNumber && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {/* Sadece admin olmayan kullanıcılar için silme butonunu göster */}
                    {user.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Personel Bulunamadı!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun personel bulunmamaktadır.
            </p>
          </div>
        )}
      </div>
      <MobileBottomBar />
    </div>
  );
}