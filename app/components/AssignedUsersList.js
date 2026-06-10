import React, { useState } from "react";

const AssignedUsersList = ({ assignedUsers, users, onDeleteAssignment }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const getUserFullName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? `${user.firstname} ${user.lastname}` : "Bilinmeyen Personel";
    };

    // Türkçe karakterleri normalize eden fonksiyon
    const normalizeString = (str) => {
        return str
            .toLocaleLowerCase("tr") // Türkçe karakterleri doğru şekilde küçült
           
    };
    

    // Gelişmiş arama fonksiyonu (büyük/küçük harf duyarsız ve boşluklara karşı toleranslı)
    const filteredAssignments = assignedUsers.filter(assignment => {
        const userFullName = normalizeString(getUserFullName(assignment.userID));
        const searchTermNormalized = normalizeString(searchTerm);

        return userFullName.includes(searchTermNormalized);
    });
    

    return (
        <div className="mt-6 bg-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Atanmış Personeller</h2>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Personel ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {filteredAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssignments.map((assignment) => (
                        <div key={assignment.id} className="p-4 border rounded-lg relative">
                            <button
                                onClick={() => onDeleteAssignment(assignment.id)}
                                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                            >
                                ✕
                            </button>
                            <h3 className="text-lg font-bold">{assignment.departmanName}</h3>
                            <p className="text-gray-600">Personel: {getUserFullName(assignment.userID)}</p>
                            <p className="text-gray-600">Atanma Tarihi: {new Date(assignment.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">
                    {searchTerm ? "Aramanızla eşleşen atanmış personel bulunamadı." : "Hiç atanmış personel bulunmamaktadır."}
                </p>
            )}
        </div>
    );
};

export default AssignedUsersList;