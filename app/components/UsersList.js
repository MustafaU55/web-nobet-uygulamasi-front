"use client";

import { useState, useEffect } from 'react';
import Loading from "@/app/loading";
import api from '@/app/loaders/baseApi'; // API istemcisini içe aktar

const UserList = ({ users }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] user-hide-scrollbar">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="group w-full bg-[#37386e] backdrop-blur-lg rounded-2xl overflow-hidden transform transition-all duration-300  "
                >
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            {/* <div className="relative w-16 h-16 rounded-full overflow-hidden"> */}
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
                            {/* </div> */}
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-semibold text-white truncate">
                                    {user.firstname} {user.lastname}
                                </p>
                                {user.username && (
                                    <p className="text-sm text-gray-300 truncate">
                                        {user.username}
                                    </p>
                                )}
                                {user.email && (
                                    <p className="text-sm text-gray-300 truncate">
                                        {user.email}
                                    </p>
                                )}
                                {user.phoneNumber && (
                                    <p className="text-sm text-gray-300 truncate">
                                        {user.phoneNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/api/userStore', {
                    withCredentials: true,
                    params: {
                        countOfPaginate: 1000
                    }
                });


                if (res.data.success && Array.isArray(res.data.users.data)) {
                    setUsers(res.data.users.data);
                } else {
                    setUsers([]); // Set to an empty array if data is invalid
                    setErrorMessage(res.data.message || 'Kullanıcılar alınamadı.');
                }
            } catch (error) {
                setErrorMessage('Veri çekme hatası: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [errorMessage]);

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        return (user.firstname && user.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastname && user.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    }) : [];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Section */}
                <div className=" backdrop-blur-lg bg-opacity-90 rounded-2xl py-6 mb-8 transform transition-all duration-300 ">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Personel ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300"
                        />
                    </div>
                </div>

                {/* User Cards Grid */}
                {users.length > 0 ? (
                    <UserList users={filteredUsers} />
                ) : (
                    <div className="text-center py-12 bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl ">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">Henüz kayıtlı bir personel bulunmamaktadır.</p>
                    </div>
                )}

                {/* Empty State */}
                {searchTerm && !filteredUsers.length && (
                    <div className="text-center py-12 bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl ">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-300">Personel Bulunamadı!</p>
                        <p className="mt-1 text-sm text-gray-500">Arama kriterlerinize uygun personel bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;