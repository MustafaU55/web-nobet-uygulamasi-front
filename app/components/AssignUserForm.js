import React, { useState } from "react";
import { useNotification } from '@/app/components/NotificationContext';

const AssignUserForm = ({ users = [], departments = [], onAssign }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDepartmentsForAssignment, setSelectedDepartmentsForAssignment] = useState([]);
    const { showError } = useNotification();

    // RGB renk parlaklık kontrolü
    const getTextColor = (rgb) => {
        if (!rgb) return "black";
        const [r, g, b] = rgb.split(',').map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "black" : "white";
    };

    const handleAssignUserToDepartments = async () => {
        if (!selectedUser) {
            showError("Lütfen bir personel seçin.");
            return;
        }

        if (selectedDepartmentsForAssignment.length === 0) {
            showError("Lütfen en az bir departman seçin.");
            return;
        }

        await onAssign(selectedUser, selectedDepartmentsForAssignment);
        setSelectedUser(null);
        setSelectedDepartmentsForAssignment([]);
    };

    const clearSelectedDepartments = () => {
        setSelectedDepartmentsForAssignment([]);
    };

    return (
        <div className="bg-white p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Departmana Kişi Atama<span className="ml-1 relative group">
                <span className="text-gray-500 cursor-pointer">❓</span>
                <span className="absolute left-0 bottom-0 mb-1 w-64 p-2 text-xs text-white bg-gray-800 rounded-md hidden group-hover:block transition">
                    Özel olarak bir veya birden çok departmanda belirli bir personel çalıştırmak için atama yapabilirsin. Yapılan atamaları aşağıda {"\"Atanmış Personeller\""} kısmından görüntüleyebilirsin.
                </span>
            </span></h2>

            <div className="mb-4">
                <label className="block font-bold text-gray-700">Personel Seç</label>
                <select
                    value={selectedUser ? selectedUser.id : ""}
                    onChange={(e) => {
                        const user = users.find((u) => u.id === e.target.value);
                        setSelectedUser(user || null);
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">Personel Seçin</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.firstname} {user.lastname}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-bold text-gray-700 mb-2">Departman Seç</label>
                {selectedDepartmentsForAssignment.length > 0 && (
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <span className="font-medium text-gray-600">Seçilenler:</span>
                            <span className="text-blue-600">
                                {selectedDepartmentsForAssignment.join(" / ")}
                            </span>
                        </div>
                        <button
                            onClick={clearSelectedDepartments}
                            className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                            Seçilen Departmanları Temizle
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(Array.isArray(departments) ? departments : []).map((department) => (
                        <button
                            key={department.id}
                            className={`p-2 rounded-lg text-center border border-2 w-full hover:shadow-md transition-shadow duration-200 ${selectedDepartmentsForAssignment.includes(department.departmanName) ? 'opacity-100' : 'opacity-60'}`}
                            style={{ backgroundColor: `rgb(${department.RgbNumber})`, color: getTextColor(department.RgbNumber) }}
                            onClick={() => {
                                setSelectedDepartmentsForAssignment((prev) =>
                                    prev.includes(department.departmanName)
                                        ? prev.filter((d) => d !== department.departmanName)
                                        : [...prev, department.departmanName]
                                );
                            }}
                        >
                            {department.departmanName}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleAssignUserToDepartments}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                    Atama Yap
                </button>
            </div>
        </div>
    );
};

export default AssignUserForm;