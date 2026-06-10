import React from 'react';
import CalendarComponent from './CalendarComponent'; // CalendarComponent'ı import et

const MyCalendar = ({ setDate }) => {
  return <CalendarComponent setDate={setDate} />; // setDate prop'unu CalendarComponent'a iletiriz
};

export default MyCalendar;
