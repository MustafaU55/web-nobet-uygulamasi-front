import { useState, useEffect } from 'react';
import { useNotification } from '@/app/components/NotificationContext';
import api from '@/app/loaders/baseApi';

export default function DateSelectForm({ userId, userName }) {
    const { showSuccess, showError, showWarning } = useNotification();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedShiftDay, setSelectedShiftDay] = useState('');
    const [showSelection, setShowSelection] = useState(false); // To toggle modal visibility
    const priorityOptions = {
        low: "Düşük",
        medium: "Orta",
        high: "Yüksek",
        critical: "Kritik",
        urgent: "Acil",
    };

    useEffect(() => {
        // Get departments from the backend
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/api/departmanStore', { withCredentials: true });
                if (response.data && Array.isArray(response.data.data)) {
                    setDepartments(response.data.data); // Correctly set departments from the response
                }
            } catch {
     
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDepartment || !selectedShiftDay) {
            showWarning('Lütfen bir departman ve vardiya günü seçin.');
            return;
        }

        try {
            const requestData = {
                userId,
                userName,
                departmanName: selectedDepartment,
                shiftDay: selectedShiftDay,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const response = await api.post('/api/takeSpecialTask', requestData, { withCredentials: true });

            if (response.data.success === 'true') {
                showSuccess('Nöbet talebi başarıyla gönderildi!');
                setSelectedDepartment('');
                setSelectedShiftDay('');
                setShowSelection(false); // Hide modal after submission
            } else if (response.data.success === 'false') {
                showError('Bir hata oluştu! ' + (response.data.message || ''));
            } else {
                showError('Beklenmedik bir durum oluştu!');
            }
        } catch {

            showError('Bir hata oluştu!');
        }
    };

    return (
        <div>
            <p
                onClick={() => setShowSelection((prev => !prev))}
                className="flex px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
                    <svg className="w-10 h-10 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Nöbet Talebi Oluştur
            </p>

            {/* Modal */}
            {showSelection && (
                <div className="flex items-center justify-center pt-2">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full ">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1">
                                <label htmlFor="departman" className="mr-4 pb-2">Departman Seç</label>
                                <select
                                    id="departman"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">Departman Seçin</option>
                                    {departments.map((dep, index) => (
                                        <option key={index} value={dep.departmanName}>
                                            {dep.departmanName} - {priorityOptions[dep.priority] || "Bilinmiyor"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1">
                                <label htmlFor="shiftDay" className="mr-4 pb-2">Vardiya Günü Seç</label>
                                <select
                                    id="shiftDay"
                                    value={selectedShiftDay}
                                    onChange={(e) => setSelectedShiftDay(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">Vardiya Günü Seçin</option>
                                    <option value="Monday">Pazartesi</option>
                                    <option value="Tuesday">Salı</option>
                                    <option value="Wednesday">Çarşamba</option>
                                    <option value="Thursday">Perşembe</option>
                                    <option value="Friday">Cuma</option>
                                    <option value="Saturday">Cumartesi</option>
                                    <option value="Sunday">Pazar</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Nöbet Talebi Oluştur
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
