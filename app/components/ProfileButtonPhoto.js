import React, { useState, useEffect } from "react";
import api from "@/app/loaders/baseApi";

const ProfileCardPhoto = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get("/api/userData");
            if (response.data.success) {
                setUserData(response.data.data.userData); // Update userData
            } else {
                setError("Veri alınırken bir hata oluştu.");
            }
        } catch {
            setError("Veri alınırken bir hata oluştu.");

        }
    };

    const LogoutButton = () => {
        const [loading, setLoading] = useState(false);

        const logout = async () => {
            setLoading(true);
            try {
                await api.post("/api/logout", { withCredentials: true });
                window.location.href = "/login";
            } catch {
            } finally {
                setLoading(false);
            }
        };

        return (
            <button
                onClick={logout}
                className="w-full mt-4 text-black pt-2 rounded-md flex items-center justify-center transition duration-100 group"
                disabled={loading}
            >
                <svg
                    fill="currentColor"
                    width="24px"
                    height="24px"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 group-hover:text-black"
                >
                    <path d="M19 10l-6-5v3H6v4h7v3l6-5zM3 3h8V1H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H3V3z"></path>
                </svg>
                {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
            </button>
        );
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-sm mx-auto rounded-lg overflow-hidden xl:p-6 xl:border xl:border-gray-200 relative sm:max-w-full md:max-w-lg">
            {/* Profil Bilgileri */}
            <div className="flex items-center justify-between xl:mb-4 flex-col xl:flex-row">
                <div className="flex items-center xl:space-x-4 py-7 xl:mb-4">
                    <div>
                        <h2 className="hidden xl:block text-xl font-bold text-gray-800 text-center xl:text-left">
                            {userData?.firstname} {userData?.lastname}
                        </h2>
                    </div>
                </div>

                {/* Daha Fazla Bilgi Butonu */}
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="hidden xl:block text-blue-500 hover:text-blue-700 flex items-center pl-3"
                >
                    <svg
                        width="32px"
                        height="32px"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(90)"
                        className="w-10 h-10"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.81812 4.68161C4.99386 4.85734 4.99386 5.14227 4.81812 5.318L3.08632 7.0498H11.9135L10.1817 5.318C10.006 5.14227 10.006 4.85734 10.1817 4.68161C10.3575 4.50587 10.6424 4.50587 10.8181 4.68161L13.3181 7.18161C13.4939 7.35734 13.4939 7.64227 13.3181 7.818L10.8181 10.318C10.6424 10.4937 10.3575 10.4937 10.1817 10.318C10.006 10.1423 10.006 9.85734 10.1817 9.68161L11.9135 7.9498H3.08632L4.81812 9.68161C4.99386 9.85734 4.99386 10.1423 4.81812 10.318C4.64239 10.4937 4.35746 10.4937 4.18173 10.318L1.68173 7.818C1.50599 7.64227 1.50599 7.35734 1.68173 7.18161L4.18173 4.68161C4.35746 4.50587 4.64239 4.50587 4.81812 4.68161Z"
                            fill="#000000"
                        ></path>
                    </svg>
                </button>
            </div>

            {showMore && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm z-50 p-6">
                    <div className="bg-white rounded-lg p-6 w-96 text-center relative">
                        {/* Kapat Butonu */}
                        <button
                            onClick={() => setShowMore(false)}
                            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>

                        {/* Kullanıcı Bilgileri */}
                        <p className="text-gray-600">
                            <strong className="text-black">Email:</strong> {userData?.email}
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-black">Kullanıcı Adı:</strong> {userData?.username}
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-black">Telefon:</strong> {userData?.phoneNumber}
                        </p>

                        <div className="">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCardPhoto;