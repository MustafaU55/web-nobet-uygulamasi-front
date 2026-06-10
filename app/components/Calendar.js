"use client"
import React, { useState } from 'react';
import Calendar from 'react-calendar';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Yeni state: Seçilen tarih

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate); // Tıklanan tarihi state'e kaydet
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        nextLabel=">"
        prevLabel="<"
      />
      <p>Selected Date: {selectedDate ? selectedDate.toDateString() : 'None'}</p> {/* Seçilen tarihi gösterir */}
    </div>
  );
};

export default CalendarComponent;
