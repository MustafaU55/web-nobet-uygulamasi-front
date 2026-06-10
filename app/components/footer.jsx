import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-white text-black ">
      <div className="container mx-auto px-4 pt-6 ">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-16 gap-y-8 mt-24 mb-14">
            <div className="flex flex-col">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4 ">
                Hakkımızda
              </h4>
              <p className="text-xl text-gray-600 leading-relaxed">
                Vardiyalı çalışan kurumlar ve yoğun mesai gerektiren departmanlar için nöbet listelerini hazırlamak...
                <br></br>
                <a href="/#" target="_blank" className="font-bold hover:underline hover:text-blue-600 transition duration-500 ">Devamını Oku</a>

              </p>
              <div className="flex gap-6 pt-10">
                <a href="/#" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="size-8 color-black hover:text-blue-600 transition-colors duration-500" />
                </a>
                <a href="/#" target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="size-8 color-black  hover:text-white hover:w-8 hover:h-8 hover:bg-black  hover:rounded transition-colors duration-500" />
                </a>
                <a href="/#" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="size-8 color-black hover:animate-rainbow transition-colors duration-500" />
                </a>
                <a
                  href="https://wa.me/905396852754"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="size-8 text-black hover:text-green-500 transition-colors duration-500" />
                </a>

              </div>
            </div>

            <div className="flex flex-col ">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Hızlı Bağlantılar
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/", text: "Anasayfa" },
                  { href: "/pricing", text: "Paketler" },
                  { href: "/contact", text: "İletişim" },
                  { href: "/#", text: "Nasıl Kullanılır?" }

                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-600 hover:text-blue-600 transition-colors duration-500"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Kurumsal
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/#", text: "KVKK" },
                  { href: "/#", text: "Gizlilik Politikası" },
                  { href: "/#", text: "Kullanım Koşulları" },
                  { href: "/#", text: "Çerez Politikası" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-600 hover:text-blue-600 transition-colors duration-300 inline-block"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                İletişim
              </h4>
              <div className="space-y-3">
                <p className="text-base text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@nobet.com
                </p>
                <p className="text-base text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +90 539 685 27 54
                </p>
                <p className="text-base text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  OMU
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm opacity-75">
              © {new Date().getFullYear()} RO3. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-75">Powered by</span>
              <Link
                href="#"
                className="group flex items-center hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-blue-400 hover:text-blue-900 transition-colors duration-300">
                  RO3
                </span>
                <div className="px-2">
                  <Logo />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
