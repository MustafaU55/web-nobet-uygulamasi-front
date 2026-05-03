"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/loaders/baseApi"; // API istemcisini içe aktar
import Link from "next/link";
import Loading from "../../../../loading";
import PastDutyCalendarUser from "@/app/components/PastDutyCalendarUser";
import UserDutyList from "@/app/components/UserDutyList";
import SidebarUser from "@/app/components/side_bar_user";
import MobileBottomBarUser from "@/app/components/mobile_bottom_bar_user";

// İngilizce gün isimlerini Türkçeye çeviren obje
const dayTranslations = {
    Monday: "Pazartesi",
    Tuesday: "Salı",
    Wednesday: "Çarşamba",
    Thursday: "Perşembe",
    Friday: "Cuma",
    Saturday: "Cumartesi",
    Sunday: "Pazar",
};

// Tarihi biçimlendiren fonksiyon
const formatDate = (dateString) => {
    if (!dateString) return "Tarih bilgisi yok";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

function getDutytStyles(status) {
    switch (status) {
        case 'pending':
            return { container: 'bg-yellow-100 border-yellow-300', badge: 'bg-yellow-500 text-white', text: 'Beklemede' };
        case 'approved':
            return { container: 'bg-green-100 border-green-300', badge: 'bg-green-500 text-white', text: 'Onaylandı' };
        case 'rejected':
            return { container: 'bg-red-100 border-red-300', badge: 'bg-red-500 text-white', text: 'Reddedildi' };
        default:
            return { container: 'bg-gray-100 border-gray-300', badge: 'bg-gray-500 text-white', text: 'Bilinmiyor' };
    }
}

export default function UserDutiesPage() {
    const { id } = useParams();
    const [dutySchedule, setDutySchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("all");
    const [filterType, setFilterType] = useState("all"); // Filtre türü için state

    useEffect(() => {
        const fetchData = async () => {
            try {
                // filterType ve status değerlerini kontrol et
                const validFilterTypes = ["weekly", "monthly", "yearly", "all"];
                const validStatuses = ["pending", "approved", "rejected", "all"];

                const validatedFilterType = validFilterTypes.includes(filterType) ? filterType : "all";
                const validatedStatus = validStatuses.includes(status) ? status : "all";

                const duties = await api.get(`/api/userSpecialTaskStore`, {
                    params: {
                        filterType: validatedFilterType, // Doğrulanmış filterType
                        status: validatedStatus,        // Doğrulanmış status
                        countOfPaginate: 1000,
                    },
                    withCredentials: true,
                });

                setDutySchedule(duties.data.data);
                setLoading(false);
            } catch (err) {
                setError("Bir hata oluştu: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchData();
    }, [id, filterType, status]); // Update the useEffect dependencies

    const handleFilterChange = (newStatus) => {
        setStatus(newStatus);
    };

    const handleFilterTypeChange = (newFilterType) => {
        setFilterType(newFilterType);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-200 py-16 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg">
                    <h1 className="text-xl text-red-600">{error}</h1>
                    <p className="mt-2 text-gray-600">Lütfen daha sonra tekrar deneyin</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 pb-24 text-black">
            <title>Nöbet Programı - NöbetX</title>
            <meta name="description" content="Kullanıcı nöbet talepleri. Daha fazlası NöbetX.com'da." />
            <link rel="icon" href="/logoj.png" />
            <SidebarUser/>
            <div className="xl:ml-[40vh] mx-auto p-2 sm:p-10">
                
                <div className="mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8">Nöbet Görüntüleme</h1>
                </div>

                <div className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden">
                    <div className="p-8 space-y-8">
                        <div className="">
                            {/* Sol Taraf */}
                            <div className="space-y-8">
                                <div className="">
                                    <p className="text-2xl font-semibold text-gray-800 mb-2 px-4">Nöbet Bilgileri</p>
                                    <UserDutyList />
                                </div>
                            </div>

                        </div>
                        <hr></hr>


                        <div className="">
                            <p className="text-2xl font-semibold text-gray-800 px-4">Nöbet Takvimi</p>
                            <PastDutyCalendarUser />
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <MobileBottomBarUser />
            </div>
        </div>
    );
}
