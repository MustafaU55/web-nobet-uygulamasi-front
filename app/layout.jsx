"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { NotificationProvider } from "./components/NotificationContext";
import CustomToastContainer from "./components/ToastContainer";
import api from "@/app/loaders/baseApi";
import Pusher from 'pusher-js';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [userDataA, setUserData] = useState(null);
  const [echoInitialized, setEchoInitialized] = useState(false);
  const router = useRouter();

  const showHeaderPages = ["/", "/login", "/contact", "/about", "/register", "/pricing", "/nasil-kullanilir", "/gizlilik-politikasi", "/kvkk", "/cerez-politikasi"];
  const showFooterPages = ["/", "/login", "/contact", "/about", "/register", "/pricing", "/nasil-kullanilir", "/gizlilik-politikasi", "/kvkk", "/cerez-politikasi"];

  // pathname değerini temizle
  const cleanPathname = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // Echo başlatma işlemi
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Echo) {
      import('laravel-echo').then(({ default: Echo }) => {
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
          forceTLS: true,
          wsPort: 6001,
          encrypted: true,
          disableStats: true,
          enabledTransports: ['ws', 'wss']
        });
        setEchoInitialized(true);
        console.log('Echo başarıyla başlatıldı');
      }).catch(err => {
        console.error('Echo başlatma hatası:', err);
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.Echo) {
        window.Echo.disconnect();
      }
    };
  }, []);

  // Kullanıcı verilerini çek
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.post("/api/userData");

        if (response.status === 200 || response.status === 201) {
          const data = response.data;

          if (data.success === "true" && data.data && data.data.userData) {
            setUserData(data.data.userData);
          }
        }
      } catch (error) {
        console.error('Kullanıcı verisi çekme hatası:', error);
      }
    };

    // Yalnızca belirli sayfalarda userData fetch işlemi yap
    if (showHeaderPages.includes(cleanPathname)) {
      fetchUserData();
    }
  }, [cleanPathname]);

  return (
    <html lang="tr">
      <head>
        {/* Google Search Console Doğrulama Meta Etiketi */}
        <meta
          name="google-site-verification"
          content="LNt_O7Jhp-vEvbXmF1UcWO48j7pzh8znUw0Qo0ho0wY"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotificationProvider>
          {showHeaderPages.includes(cleanPathname) && <Header userDataA={userDataA} />}
          {children}
          {showFooterPages.includes(cleanPathname) && <Footer />}
          <CustomToastContainer />
        </NotificationProvider>
      </body>
    </html>
  );
}