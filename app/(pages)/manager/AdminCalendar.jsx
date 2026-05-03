"use client";

import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import '@/calendar.css';
import Link from 'next/link';
import api from '@/app/loaders/baseApi'; // API istemcisini içe aktar

export default function AdminCalendar() {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRequests, setDateRequests] = useState([]); // Onaylanmış talepleri saklamak için
  const [users, setUsers] = useState({}); // Kullanıcı bilgilerini saklamak için { userID: { firstName, lastName } }
  const [filterType, setFilterType] = useState('all'); // Varsayılan filtre türü
  const [statusFilter, setStatusFilter] = useState('approved'); // Sadece onaylanmış talepleri göster

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/userStore', {
          params: {
            countOfPaginate: 1000,
          },
          withCredentials: true,
        });

        if (response.data && response.data.success && response.data.users && Array.isArray(response.data.users.data)) {
          const usersMap = {};
          response.data.users.data.forEach(user => {
            usersMap[user.id] = {
              firstName: user.firstname,
              lastName: user.lastname,
            };
          });
          setUsers(usersMap); // Kullanıcı bilgilerini state'e kaydet
        }
      } catch {

      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await api.get('/api/offdayStore', {
          params: {
            filterType: 'all',
            status: 'approved',
            countOfPaginate: 1000,
          },
          withCredentials: true,
        });

        if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.data)) {
          const transformedRequests = response.data.data.data.map(request => ({
            requestId: request.id,
            userId: request.userID, // Kullanıcı ID'si
            offdayStart: new Date(request.offdayStart), // Tarih dönüşümü
            offdayEnd: new Date(request.offdayEnd), // Tarih dönüşümü
            status: request.status,
            note: request.offdayReason, // İzin nedeni
            firstName: users[request.userID]?.firstName || 'Bilinmiyor', // Kullanıcı adı
            lastName: users[request.userID]?.lastName || 'Bilinmiyor', // Kullanıcı soyadı
          }));

          // Sadece onaylanmış talepleri filtrele
          const approvedRequests = transformedRequests.filter(request => request.status === 'approved');
          setDateRequests(approvedRequests);
        }
      } catch {
      
      }
    };

    if (Object.keys(users).length > 0) {
      fetchApprovedRequests();
    }
  }, [statusFilter, filterType, users]);

  // Seçilen tarihteki onaylanmış talepleri getir
  const getApprovedRequestsForDate = (date) => {
    if (!Array.isArray(dateRequests)) return [];

    return dateRequests.filter(request => {
      const start = new Date(request.offdayStart);
      const end = new Date(request.offdayEnd);

      // Tarih karşılaştırması (saat ve zaman dilimi dikkate alınmaz)
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      // Seçilen tarih, izin aralığı içinde mi?
      return date >= start && date <= end;
    });
  };

  // Kullanıcı adı ve soyadını birleştir
  const getFullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
  };

  // Kullanıcı adının baş harflerini al
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Takvimdeki her bir tarih için içerik oluştur
  const tileContent = ({ date }) => {
    const approvedRequests = getApprovedRequestsForDate(date);

    if (approvedRequests.length === 0) return null;

    return (
      <div className="approved-names text-xs mt-1">
        {approvedRequests.map((request) => (
          <div key={request.requestId} className="text-purple-500">
            {getInitials(request.firstName, request.lastName)} {/* Kullanıcı adının baş harflerini göster */}
          </div>
        ))}
      </div>
    );
  };

  // Takvimdeki her bir tarih için stil belirle
  const tileClassName = ({ date }) => {
    const hasApprovedRequests = getApprovedRequestsForDate(date).length > 0;
    return hasApprovedRequests ? 'bg-green-100 hover:bg-green-200' : '';
  };

  // Sayfa yüklendiğinde otomatik tarih seçimi
  useEffect(() => {
    const today = new Date();
    const todayRequests = getApprovedRequestsForDate(today);
    if (todayRequests.length > 0) {
      setSelectedDate(today);
    }
  }, [dateRequests]);

  // Tarih seçildiğinde çalışacak fonksiyon
  const handleDateClick = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 px-6 pb-2 text-black">
      <div className="calendar-container">
        <Calendar
          onChange={(value) => {
            setValue(value);
            handleDateClick(value);
          }}
          value={value}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="custom-calendar"
        />
      </div>

      <div className="details-panel bg-white py-6 pl-6 ">
        <p className="text-2xl font-semibold mb-4">
          {selectedDate ? selectedDate.toLocaleDateString('tr-TR') : 'İzin Detayları'}
        </p>
        {selectedDate && (
          <div className="space-y-4">
            {getApprovedRequestsForDate(selectedDate).map(request => (
              <div
                key={request.requestId}
                className="p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <p className="font-semibold text-green-800">
                  {getFullName(request.firstName, request.lastName)} {/* Kullanıcı adı ve soyadı */}
                </p>
                <p className="text text-gray-600">
                  {new Date(request.offdayStart).toLocaleDateString('tr-TR')} - {' '}
                  {new Date(request.offdayEnd).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-lg mt-2">{request.note}</p>
              </div>
            ))}
            {getApprovedRequestsForDate(selectedDate).length === 0 && (
              <p className="text-gray-500">Bu tarihte onaylanmış talep bulunmamaktadır.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}