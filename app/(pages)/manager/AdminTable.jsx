"use client"; // Bu bileşen istemci tarafında çalışır
import Link from 'next/link';

import React, { useState } from "react";


export default function AdminTable({ dates }) {
  const [sortedDates, setSortedDates] = useState(dates);

  const updateStatus = (id, status) => {
    setSortedDates((prevDates) =>
      prevDates.map((range) =>
        range.id === id ? { ...range, status } : range
      )
    );

    // Onaylanan tarih aralıklarını güncelle
    if (status === "Approved") {
      const newApprovedDateRange = dates.find(date => date.id === id);
      setApprovedDates((prevApprovedDates) => [
        ...prevApprovedDates,
        {
          startDate: new Date(newApprovedDateRange.startDate),
          endDate: new Date(newApprovedDateRange.finishDate),
        },
      ]);
    }
  };

  const [approvedDates, setApprovedDates] = useState([]);

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <thead>
        <tr
          style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}
        >
          <th style={{ padding: "10px", textAlign: "left" }}>Kullanıcı Adı</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Başlangıç Tarihi</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Bitiş Tarihi</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Durum</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Aksiyon</th>
        </tr>
      </thead>
      <tbody>
        {sortedDates.map((range) => (
          <tr key={range.id}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
            <Link href={`/users/${range.id}`} passHref>
                <span className="text-black-500 font-bold cursor-pointer hover:underline">
                  {range.name}
                </span>
              </Link>

            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {range.startDate}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {range.finishDate}
            </td>
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                color:
                  range.status === "Approved"
                    ? "green"
                    : range.status === "Rejected"
                    ? "red"
                    : "orange",
              }}
            >
              {range.status}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              <button
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                  backgroundColor: "#00796b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => updateStatus(range.id, "Approved")}
              >
                Onayla
              </button>
              <button
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => updateStatus(range.id, "Rejected")}
              >
                Reddet
              </button>
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffa726",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => updateStatus(range.id, "Pending")}
              >
                Beklet
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
