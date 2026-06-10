import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/loaders/baseApi";

export default function Header({ userDataA }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const toggleMenu = () => {
    if (isLogOpen) setIsLogOpen(false);
    setIsMenuOpen((prev) => !prev);
  };

  const toggleLog = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setIsLogOpen((prev) => !prev);
  };

  const menuRef = useRef(null);
  const logRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Menü dışına tıklandığında menüyü kapat
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setIsMenuOpen(false);
  //     }
  //     // Log menüsü dışına tıklandığında log menüsünü kapat
  //     if (logRef.current && !logRef.current.contains(event.target)) {
  //       setIsLogOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const closeMenuOnLinkClick = () => {
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsLogOpen(false);
    }, 100);
  };

  const getUserInitials = (user) => {
    if (!user) return "";
    const { firstname, lastname } = user;
    return `${firstname ? firstname[0] : ""}${lastname ? lastname[0] : ""}`;
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch {

    }
  };

  return (
    <div className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-md text-black">
      <div className="container mx-auto py-6">
        <div className="flex justify-center md:justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image
                src="/nobetuygulamasi.png"
                alt="Logo"
                width={1080}
                height={1080}
                priority
                quality={100}
                className="w-auto h-12 md:h-16 lg:h-16"
              />
            </Link>

            <nav className="hidden md:block min-h-[30px]">
              <ul className="flex space-x-8">
                {[
                  { href: "/", text: "Anasayfa" },
                  { href: "/pricing", text: "Paketler" },
                  { href: "/#", text: "Nasıl Kullanılır?" },
                  { href: "/contact", text: "İletişim" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="relative group py-2">
                      <span className="text-lg relative z-10 text-black hover:text-black transition-colors">
                        {link.text}
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userDataA ? (
              <>
                <div className="relative" ref={logRef}>
                  <button
                    className="text-lg px-4 py-2 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
                    onClick={toggleLog}
                  >
                    {getUserInitials(userDataA)}
                  </button>
                  {isLogOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <div className="text-lg font-semibold">{`${userDataA.firstname} ${userDataA.lastname}`}</div>
                        <div className="text-sm text-gray-600">{userDataA.email}</div>
                        <div className="text-sm text-gray-600">{userDataA.phone}</div>
                        {userDataA.role === "admin" && (
                          <Link
                            href="/manager"
                            className="block mt-2 text-sm text-blue-600 hover:text-blue-700"
                            onClick={closeMenuOnLinkClick}
                          >
                            <span className="p-2 rounded-full bg-blue-300 hover:text-white">Yönetici Paneli</span>
                          </Link>
                        )}
                        {userDataA.role === "user" && (
                          <Link
                            href={`/users/${userDataA.id}`}
                            className="block mt-4 text-sm text-blue-600 hover:text-blue-700"
                            onClick={closeMenuOnLinkClick}
                          >
                            <span className="p-2 bg-blue-300 rounded-full hover:text-white">Profilim</span>
                          </Link>
                        )}
                        {/* Çıkış Yap metni */}
                        <div
                          className="block mt-4 text-sm text-red-600 hover:text-red-700 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <span className="p-2 bg-red-300 rounded-full hover:text-white">Çıkış Yap</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-lg px-4 py-2 relative z-10 text-gray-800 hover:text-black transition-colors duration-300 border border-gray-400 rounded-3xl hover:border-blue-700"
                  onClick={closeMenuOnLinkClick}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="text-lg px-4 py-2 font-medium text-white bg-blue-600 rounded-3xl hover:bg-blue-700 transition-colors duration-300"
                  onClick={closeMenuOnLinkClick}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden absolute left-0 px-5" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="focus:outline-none pb-4 px-2"
            >
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 12h16M4 6h16M4 18h8"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="md:hidden absolute right-0 px-5" ref={logRef}>
            <button
              onClick={toggleLog}
              className="focus:outline-none pb-4 px-2"
            >
              <svg
                className="w-10 h-11"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
              >
                {isLogOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <path
                      d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-gray-100 z-40" ref={menuRef}>
            <div className="flex justify-end p-5">
              <button onClick={toggleMenu} className="focus:outline-none">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col space-y-6 p-6 bg-gray-100 ">
              {[
                { href: "/", text: "Anasayfa" },
                { href: "/contact", text: "İletişim" },
                { href: "/#", text: "Nasıl Kullanılır?" },
                { href: "/pricing", text: "Paketler" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300"
                    onClick={closeMenuOnLinkClick}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isLogOpen && (
          <div className="md:hidden fixed inset-0 bg-gray-100 z-40 " ref={logRef}>
            <div className="flex justify-end p-5 ">
              <button onClick={toggleLog} className="focus:outline-none ">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-6 p-6 bg-gray-100">
              {userDataA ? (
                <>
                  <div className="text-2xl font-semibold">{`${userDataA.firstname} ${userDataA.lastname}`}</div>
                  <div className="text-lg text-gray-600">{userDataA.email}</div>
                  <div className="text-lg text-gray-600">{userDataA.phone}</div>
                  {userDataA.role === "admin" && (
                    <Link
                      href="/manager"
                      className="text-2xl font-semibold text-blue-600 hover:text-blue-700 bg-blue-300 py-3 px-6 text-center hover:bg-blue-700 transition-colors duration-300 hover:text-white rounded-full"
                      onClick={closeMenuOnLinkClick}
                    >
                      Yönetici Paneli
                    </Link>
                  )}
                  {userDataA.role === "user" && (
                    <Link
                      href={`/users/${userDataA.id}`}
                      className="text-2xl font-semibold text-blue-600 hover:text-blue-700 bg-blue-300 py-3 px-6 text-center hover:bg-blue-700 transition-colors duration-300 hover:text-white rounded-full"
                      onClick={closeMenuOnLinkClick}
                    >
                      Profilim
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-2xl font-semibold text-white bg-red-600 rounded-3xl py-3 px-6 text-center hover:bg-red-700 transition-colors duration-300"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="text-2xl font-semibold text-white bg-blue-600 rounded-3xl py-3 px-6 text-center hover:bg-blue-700 transition-colors duration-300"
                    onClick={closeMenuOnLinkClick}
                  >
                    Kayıt Ol
                  </Link>
                  <Link
                    href="/login"
                    className="text-2xl font-semibold text-gray-800 border border-gray-400 rounded-3xl py-3 px-6 text-center hover:border-blue-700 hover:text-blue-600 transition-colors duration-300"
                    onClick={closeMenuOnLinkClick}
                  >
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}