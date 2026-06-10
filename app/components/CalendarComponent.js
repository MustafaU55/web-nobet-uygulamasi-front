"use client"

import React, { useState } from 'react'; // useState ve React modülünü import et
import Calendar from 'react-calendar';

const CalendarComponent = ({ setDate }) => { // setDate props'u eklendi
  const [date, setDateState] = useState(new Date()); // date state'ini tanımla

  const handleDateChange = (newDate) => {
    setDateState(newDate); // Tıklanan tarihi state'e kaydet
    if (setDate) setDate(newDate); // Ana bileşene tarih aktarımı
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        nextLabel=">"
        prevLabel="<"
      />
      <p>Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;