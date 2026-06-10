import React from "react";

const ShiftModal = ({ isOpen, onClose, selectedDepartment, daysOfWeek, onDaySelect, shiftData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                <h2 className="text-xl font-bold mb-4">{selectedDepartment?.departmanName} Vardiyaları</h2>
                <div className="mb-4">
                    <label className="block font-bold text-gray-700">Gün Seçin</label>
                    <select
                        onChange={(e) => onDaySelect(e.target.value, selectedDepartment)} // Gün seçimi yaparken departmanı da gönder
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">Gün Seçin</option>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                                {day === "A" ? "Pazartesi" : 
                                 day === "B" ? "Salı" : 
                                 day === "C" ? "Çarşamba" : 
                                 day === "D" ? "Perşembe" : 
                                 day === "E" ? "Cuma" : 
                                 day === "F" ? "Cumartesi" : 
                                 "Pazar"}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <h3 className="font-bold text-gray-700">Vardiyalar</h3>
                    <ul>
                        {shiftData.map((shift, index) => (
                            <li key={index} className="mb-2">
                                <span className="font-bold">{shift.shift}. Vardiya</span> -{" "}
                                <span>{shift.userCount} Kişi</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                    Kapat
                </button>
            </div>
        </div>
    );
};

export default ShiftModal;