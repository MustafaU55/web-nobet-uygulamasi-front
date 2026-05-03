import React, { useEffect, useState } from 'react';
import api from "@/app/loaders/baseApi";
import Loading from '../../loading';

const LastCalendar = () => {
    const [calendarData, setCalendarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestCalendar = async () => {
            try {
                // İlk API çağrısı: Takvimleri getir
                const storeResponse = await api.get('/api/callenderStore', { withCredentials: true });
                
                if (!storeResponse.data.success || !storeResponse.data.data.length) {
                    setError('Takvim bilgisi bulunamadı.');
                    setLoading(false);
                    return;
                }

                // Son takvimin ID'sini al (status olacak)
                const lastCalendar = storeResponse.data.data[storeResponse.data.data.length - 1];
                const status = lastCalendar.id;

                // İkinci API çağrısı: Seçilen takvimi getir
                const doctorResponse = await api.get('/api/callenderDoctor', {
                    params: { status },
                    withCredentials: true
                });

                if (doctorResponse.data.success) {
                    setCalendarData(doctorResponse.data);
                } else {
                    setError('Takvim bilgileri alınamadı.');
                }
            } catch (err) {
                setError('API çağrısı sırasında bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestCalendar();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!calendarData) {
        return <div>Takvim bilgisi bulunamadı.</div>;
    }

    return (
        <div>
            <h1>Son Oluşturulan Takvim</h1>
            <p>Başlangıç Tarihi: {calendarData.startdate}</p>
            <p>Bitiş Tarihi: {calendarData.enddate}</p>
            <h2>Nöbet Listesi</h2>
            <ul>
                {calendarData.nobetList.map((nobet, index) => (
                    <li key={index}>
                        <strong>Tarih:</strong> {nobet.date} - <strong>Departman:</strong> {nobet.departman} - <strong>Personel:</strong> {nobet.user} - <strong>Tip:</strong> {nobet.type}
                    </li>
                ))}
            </ul>
            <h2>Personel Nöbet Sayıları</h2>
            <ul>
                {Object.entries(calendarData.userNobetCounts).map(([user, count]) => (
                    <li key={user}>
                        <strong>{user}:</strong> {count} nöbet
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LastCalendar;
