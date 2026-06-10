import React, { useState } from "react";

const OffdayModal = ({ isOpen, onClose, onSubmit }) => {
    const [offdayType, setOffdayType] = useState("date"); // "date" veya "day" olabilir
    const [offdayStart, setOffdayStart] = useState("");
    const [offdayEnd, setOffdayEnd] = useState("");
    const [offDayofweek, setOffDayofweek] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            offdayType,
            offdayStart,
            offdayEnd,
            offDayofweek,
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">İzin Ekle</h2>
                <div className="mb-4">
                    {/* Günlük İzin Al Butonu */}
                    <button
                        onClick={() => setOffdayType("date")}
                        className={`px-4 py-2 mr-2 ${offdayType === "date" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                            } rounded-lg`}
                    >
                        Günlük İzin Al<span className="ml-1 relative group">
                            <span className="text-gray-500 cursor-pointer">❓</span>
                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                Sadece verilen tarihte departmanı izinli yapar.
                            </span>
                        </span>
                    </button>
                    {/* Haftalık İzin Al Butonu */}
                    <button
                        onClick={() => setOffdayType("day")}
                        className={`px-4 py-2 ${offdayType === "day" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                            } rounded-lg`}
                    >
                        Haftalık İzin Al<span className="ml-1 relative group">
                            <span className="text-gray-500 cursor-pointer">❓</span>
                            <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                                {`Seçtiğiniz güne göre departmanı her hafta izinli yapar. Örnek = Departmana "Salı" günü izin verdiyseniz, her hafta "Salı" günü izinli olacaktır bu departman.`}
                            </span>
                        </span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {offdayType === "date" ? (
                        <>
                            {/* Günlük İzin Formu */}
                            <div className="mb-4">
                                <label className="block font-bold text-gray-700">İzin Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    value={offdayStart}
                                    onChange={(e) => setOffdayStart(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold text-gray-700">İzin Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    value={offdayEnd}
                                    onChange={(e) => setOffdayEnd(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Haftalık İzin Formu */}
                            <div className="mb-4">
                                <label className="block font-bold text-gray-700">İzin Günü</label>
                                <select
                                    value={offDayofweek}
                                    onChange={(e) => setOffDayofweek(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="">Gün Seçin</option>
                                    <option value="Monday">Pazartesi</option>
                                    <option value="Tuesday">Salı</option>
                                    <option value="Wednesday">Çarşamba</option>
                                    <option value="Thursday">Perşembe</option>
                                    <option value="Friday">Cuma</option>
                                    <option value="Saturday">Cumartesi</option>
                                    <option value="Sunday">Pazar</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end space-x-2">
                        {/* Kapat Butonu */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Kapat
                        </button>
                        {/* Kaydet Butonu */}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OffdayModal;