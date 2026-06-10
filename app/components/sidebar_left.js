// components/Sidebar.jsx
"use client";

import Link from 'next/link';
import ProfileButton from "@/app/components/ProfileButton";
import { useState } from "react";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    home: false,
    department: false,
    shift: false,
    duty: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <aside className="hidden xl:block w-[40vh] h-full bg-[#24244f] text-black font-bold p-6 fixed flex flex-col">
      <div className="flex items-center space-x-2 mb-6 bg-[#37386e] rounded-lg">
        <ProfileButton />
      </div>

      {/* Scrollable container */}
      <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] user-hide-scrollbar">
        {/* Anasayfa Accordion */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu('home')}
            className="w-full px-4 py-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z"
                />
              </svg>
              Anasayfa
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openMenus.home ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openMenus.home && (
            <div className="pl-4 mt-2 space-y-1">
              <Link href="/manager/#dateRequests" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                İzin Talepleri
              </Link>
              <Link href="/manager?section=calendar" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                İzin Takvimi
              </Link>
              <Link href="/manager?section=calendar" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbet Takvimleri
              </Link>
              <Link href="/manager?section=calendar" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbetlerim
              </Link>
              <Link href="/manager?section=assign_offday" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                İzin Atama
              </Link>
              <Link href="/manager?section=assign_duty" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbet Atama
              </Link>
            </div>
          )}
        </div>
        <hr />

        {/* Departman Yönetimi Accordion */}
        <div className="mb-2 mt-2">
          <button
            onClick={() => toggleMenu('department')}
            className="w-full px-4 py-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <svg
                fill="#ffffff"
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path d="M5.04146 3C5.22009 2.6906 5.55022 2.5 5.90748 2.5L9.75278 2.5C10.11 2.5 10.4402 2.6906 10.6188 3L12.5415 6.33013C12.7201 6.63953 12.7201 7.02073 12.5415 7.33013L10.6188 10.6603C10.4402 10.9697 10.11 11.1603 9.75278 11.1603H5.90748C5.55022 11.1603 5.22009 10.9697 5.04146 10.6603L3.11881 7.33013C2.94017 7.02073 2.94017 6.63953 3.11881 6.33013L5.04146 3Z"></path>
                <path d="M5.1216 13.2272C5.30023 12.9178 5.63036 12.7272 5.98762 12.7272H9.83292C10.1902 12.7272 10.5203 12.9178 10.6989 13.2272L12.6216 16.5574C12.8002 16.8668 12.8002 17.248 12.6216 17.5574L10.6989 20.8875C10.5203 21.1969 10.1902 21.3875 9.83292 21.3875H5.98762C5.63036 21.3875 5.30023 21.1969 5.1216 20.8875L3.19895 17.5574C3.02031 17.248 3.02031 16.8668 3.19895 16.5574L5.1216 13.2272Z"></path>
                <path d="M14.1216 8.22723C14.3002 7.91783 14.6304 7.72723 14.9876 7.72723L18.8329 7.72723C19.1902 7.72723 19.5203 7.91783 19.6989 8.22723L21.6216 11.5574C21.8002 11.8668 21.8002 12.248 21.6216 12.5574L19.6989 15.8875C19.5203 16.1969 19.1902 16.3875 18.8329 16.3875H14.9876C14.6304 16.3875 14.3002 16.1969 14.1216 15.8875L12.1989 12.5574C12.0203 12.248 12.0203 11.8668 12.1989 11.5574L14.1216 8.22723Z"></path>
              </svg>
              Departman Yönetimi
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openMenus.department ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openMenus.department && (
            <div className="pl-4 mt-2 space-y-1">
              <Link href="/manager/departman" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departman Oluştur
              </Link>
              <Link href="/manager/departman?section=department-assign" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departman Personel Atama
              </Link>
              <Link href="/manager/departman?section=department_list" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departman Listesi
              </Link>
              <Link href="/manager/departman?section=department_user_list" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departmana Atanmış Personeller
              </Link>
              <Link href="/manager/departman?section=department_list" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departman Düzenle
              </Link>
              <Link href="/manager/departman?section=department_list" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Departman İzin Al
              </Link>
            </div>
          )}
        </div>
        <hr />

        {/* Vardiya Yönetimi Accordion */}
        <div className="mb-2 mt-2">
          <button
            onClick={() => toggleMenu('shift')}
            className="w-full px-4 py-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <svg
                fill="currentColor"
                width="32px"
                height="32px"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className='mr-2'
              >
                <path d="M40,47H8a2,2,0,0,1-2-2V3A2,2,0,0,1,8,1H40a2,2,0,0,1,2,2V45A2,2,0,0,1,40,47ZM10,43H38V5H10Z"></path>
                <path d="M15,19a2,2,0,0,1-1.41-3.41l4-4a2,2,0,0,1,2.31-.37l2.83,1.42,5-4.16A2,2,0,0,1,30.2,8.4l4,3a2,2,0,1,1-2.4,3.2l-2.73-2.05-4.79,4a2,2,0,0,1-2.17.25L19.4,15.43l-3,3A2,2,0,0,1,15,19Z"></path>
                <circle cx="15" cy="24" r="2"></circle>
                <circle cx="15" cy="31" r="2"></circle>
                <circle cx="15" cy="38" r="2"></circle>
                <path d="M33,26H22a2,2,0,0,1,0-4H33a2,2,0,0,1,0,4Z"></path>
                <path d="M33,33H22a2,2,0,0,1,0-4H33a2,2,0,0,1,0,4Z"></path>
                <path d="M33,40H22a2,2,0,0,1,0-4H33a2,2,0,0,1,0,4Z"></path>
              </svg>
              Vardiya Yönetimi
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openMenus.shift ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openMenus.shift && (
            <div className="pl-4 mt-2 space-y-1">
              <Link href="/manager/shift" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Vardiya Listesi
              </Link>
              <Link href="/manager/shift?section=shift_request" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Vardiya İstekleri
              </Link>
            </div>
          )}
        </div>
        <hr />

        {/* Nöbet Oluştur Accordion */}
        <div className="mb-2 mt-2">
          <button
            onClick={() => toggleMenu('duty')}
            className="w-full px-4 py-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nöbet Oluştur
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openMenus.duty ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openMenus.duty && (
            <div className="pl-4 mt-2 space-y-1">
              <Link href="/manager/duty-calendar" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Kalan Takvim Sayısı
              </Link>
              <Link href="/manager/duty-calendar" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbet Takvimi Oluştur
              </Link>
              <Link href="/manager/duty-calendar?section=calendar_view" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbet Takvimi Görüntüle
              </Link>
              <Link href="/manager/duty-calendar?section=duty_requests" className="block px-4 py-2 text-white bg-[#3a3a6e] hover:bg-[#4a4a7e] rounded-md">
                Nöbet İstekleri
              </Link>
            </div>
          )}
        </div>
        <hr />

        {/* Other links remain the same */}
        <Link href="/manager/past-calendar" className="block px-4 py-2 mb-2 mt-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center">
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M3 9H21M17 13.0014L7 13M10.3333 17.0005L7 17M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Geçmiş Nöbetler
        </Link>
        <hr />
        <Link href="../adduser" className="block px-4 py-2 mb-2 mt-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center">
          <svg
            fill="#FFFFFF"
            width="32px"
            height="32px"
            version="1.1"
            viewBox="0 0 512 512"
            className="mr-2"
          >
            <g>
              <polygon points="451.368,229.053 451.368,168.421 410.947,168.421 410.947,229.053 350.316,229.053 350.316,269.474 410.947,269.474 410.947,330.105 451.368,330.105 451.368,269.474 512,269.474 512,229.053" />
            </g>
            <g>
              <path d="M239.915,276.724c33.652-18.238,56.506-53.864,56.506-94.829c0-59.531-48.259-107.789-107.789-107.789 S80.842,122.364,80.842,181.895c0,40.965,22.854,76.591,56.506,94.829C66.732,283.298,0,352.877,0,437.895h377.263 C377.263,352.877,310.531,283.298,239.915,276.724z" />
            </g>
          </svg>
          Personel Ekle
        </Link>
        <hr />
        <Link
          href="../users"
          className="block px-4 py-1 mb-2 mt-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center"
        >
          <svg
            fill="#FFFFFF"
            className="w-10 h-10 mr-2"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="M149.73145,190.00586A8,8,0,0,1,141.98389,200H18.01611a8,8,0,0,1-7.74756-9.99414A71.90424,71.90424,0,0,1,50.89,142.13013a48,48,0,1,1,58.22,0A71.90424,71.90424,0,0,1,149.73145,190.00586ZM152,88h96a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Zm96,80H176a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm0-48H152a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z" />
            </g>
          </svg>
          Personel Listesi
        </Link>
        <hr />
        <Link href="/manager/settings" className="block px-4 py-2 mt-2 mb-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center">
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 20"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            className="mr-2"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
              <title>profile_round [#1342]</title>
              <desc>Created with Sketch.</desc>
              <defs />
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-140.000000, -2159.000000)"
                  fill="#ffffff"
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"
                      id="profile_round-[#1342]"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          Kullanıcı Profili
        </Link>
        <hr />
        <Link href="/#" className="block px-4 py-2 mb-2 mt-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center">
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            className="mr-2"

          >
            <g fill="#ffffff">
              <path d="M12.75 1a.75.75 0 000 1.5h.69l-1.97 1.97a.75.75 0 001.06 1.06l1.97-1.97v.69a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75h-2.5z"></path>
              <path
                fillRule="evenodd"
                d="M1.25 2C.56 2 0 2.56 0 3.25v8.5C0 12.44.56 13 1.25 13H5c.896 0 1.475.205 1.809.448.317.23.441.51.441.802a.751.751 0 101.5 0c0-.292.124-.572.441-.802.334-.243.913-.448 1.809-.448h3.75c.69 0 1.25-.56 1.25-1.25v-4.5a.75.75 0 00-1.5 0v4.25H11c-.878 0-1.64.158-2.25.467v-6.55c0-.788.376-1.42 1.12-1.722a.75.75 0 00-.561-1.39 3.27 3.27 0 00-1.31.941A3.13 3.13 0 007.773 3C7.106 2.354 6.154 2 5 2H1.25zm6 3.417c0-.553-.187-1.015-.522-1.34C6.394 3.753 5.846 3.5 5 3.5H1.5v8H5c.878 0 1.64.158 2.25.467v-6.55z"
                clipRule="evenodd"
              ></path>
            </g>
          </svg>
          Kullanım Kılavuzu
        </Link>
        <hr />
        <Link href="/contact" className="block px-4 py-2 mb-2 mt-2 text-white bg-[#54a8fd] hover:bg-[#1B89F7] rounded-md flex items-center">
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            className="mr-2"
          >
            <path d="M379.734355,174.506667 C373.121022,106.666667 333.014355,-2.13162821e-14 209.067688,-2.13162821e-14 C85.1210217,-2.13162821e-14 45.014355,106.666667 38.4010217,174.506667 C15.2012632,183.311569 -0.101643453,205.585799 0.000508304259,230.4 L0.000508304259,260.266667 C0.000508304259,293.256475 26.7445463,320 59.734355,320 C92.7241638,320 119.467688,293.256475 119.467688,260.266667 L119.467688,230.4 C119.360431,206.121456 104.619564,184.304973 82.134355,175.146667 C86.4010217,135.893333 107.307688,42.6666667 209.067688,42.6666667 C310.827688,42.6666667 331.521022,135.893333 335.787688,175.146667 C313.347976,184.324806 298.68156,206.155851 298.667688,230.4 L298.667688,260.266667 C298.760356,283.199651 311.928618,304.070103 332.587688,314.026667 C323.627688,330.88 300.801022,353.706667 244.694355,360.533333 C233.478863,343.50282 211.780225,336.789048 192.906491,344.509658 C174.032757,352.230268 163.260418,372.226826 167.196286,392.235189 C171.132153,412.243552 188.675885,426.666667 209.067688,426.666667 C225.181549,426.577424 239.870491,417.417465 247.041022,402.986667 C338.561022,392.533333 367.787688,345.386667 376.961022,317.653333 C401.778455,309.61433 418.468885,286.351502 418.134355,260.266667 L418.134355,230.4 C418.23702,205.585799 402.934114,183.311569 379.734355,174.506667 Z M76.8010217,260.266667 C76.8010217,269.692326 69.1600148,277.333333 59.734355,277.333333 C50.3086953,277.333333 42.6676884,269.692326 42.6676884,260.266667 L42.6676884,230.4 C42.6676884,224.302667 45.9205765,218.668499 51.2010216,215.619833 C56.4814667,212.571166 62.9872434,212.571166 68.2676885,215.619833 C73.5481336,218.668499 76.8010217,224.302667 76.8010217,230.4 L76.8010217,260.266667 Z M341.334355,230.4 C341.334355,220.97434 348.975362,213.333333 358.401022,213.333333 C367.826681,213.333333 375.467688,220.97434 375.467688,230.4 L375.467688,260.266667 C375.467688,269.692326 367.826681,277.333333 358.401022,277.333333 C348.975362,277.333333 341.334355,269.692326 341.334355,260.266667 L341.334355,230.4 Z" />
          </svg>
          Destek
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;