import React from "react";

const OffdayListModal = ({ isOpen, onClose, offdayList, selectedDepartment, onDeleteOffday, dayTranslation }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    {selectedDepartment?.departmanName} İzinleri
                </h2>

                {/* Günlük İzinler */}
                <div className="mb-4">
                    <p className="font-bold text-gray-700">Günlük İzinler</p>
                    {offdayList.daily.length > 0 ? (
                        offdayList.daily.map((offday) => (
                            <div key={offday.id} className="text-gray-600 flex justify-between items-center">
                                <p>
                                    Başlangıç: {offday.offdayStart} - Bitiş: {offday.offdayEnd}
                                </p>
                                <button
                                    onClick={() => onDeleteOffday(offday.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Günlük izin bulunmamaktadır.</p>
                    )}
                </div>

                {/* Haftalık İzinler */}
                <div className="mb-4">
                    <p className="font-bold text-gray-700">Haftalık İzinler</p>
                    {offdayList.weekly.length > 0 ? (
                        offdayList.weekly.map((offday) => (
                            <div key={offday.id} className="text-gray-600 flex justify-between items-center">
                                <p>Gün: {dayTranslation[offday.offDayofweek] || offday.offDayofweek}</p>
                                <button
                                    onClick={() => onDeleteOffday(offday.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Haftalık izin bulunmamaktadır.</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};
export default OffdayListModal;