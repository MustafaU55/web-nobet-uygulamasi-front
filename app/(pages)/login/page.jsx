"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Password visibility icons
import api from "@/app/loaders/baseApi";
import Link from "next/link";

const LoginUser = () => {
    const [identifier, setIdentifier] = useState(""); // username veya email için
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // localStorage'dan kullanıcı bilgilerini al
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            // Eğer kullanıcı bilgileri varsa, otomatik giriş yap
            setIdentifier(user.email || user.username);
            setPassword(user.password);
            handleAutoLogin(user);
        } else {
            checkUserSession();
        }
    }, []);

    const handleAutoLogin = async (user) => {
        try {
            const response = await api.post("/api/login", {
                identifier: user.email || user.username,
                password: user.password,
            }, { withCredentials: true });

            if (response.data && response.data.user) {
                const userRole = response.data.user.role;
                const userId = response.data.user.id;

                if (userRole === "admin") {
                    router.push("/manager");
                } else if (userRole === "user") {
                    router.push(`/users/${userId}`);
                } else if (userRole === "creator") {
                    router.push("/admin");
                }
            }
        } catch {
      
        }
    };

    const checkUserSession = async () => {
        try {
            const response = await api.get("/api/userData", { withCredentials: true });
            if (response.data?.data?.userData) {
                const user = response.data.data.userData;
                
                if (user.role === "admin") {
                    router.push("/manager");
                } else if (user.role === "user") {
                    router.push(`/users/${user.id}`);
                } else if (user.role === "creator") {
                    router.push("/admin");
                }
            }
        } catch {
    
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/api/login", {
                identifier,
                password,
            }, { withCredentials: true });

            if (response.data && response.data.user) {
                setSuccess("Giriş başarılı!");
                setError("");

                const userRole = response.data.user.role;
                const userId = response.data.user.id;

                if (userRole === "admin") {
                    router.push("/manager");
                } else if (userRole === "user") {
                    router.push(`/users/${userId}`);
                } else if (userRole === "creator") {
                    router.push("/admin");
                }
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Giriş sırasında bir hata oluştu.");
            } else {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
            setSuccess("");
        }
    };

    return (
        <div className="text-black min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-24 flex justify-center items-center">
             <title>Kayıt Ol - NöbetX</title>
      {/* Meta Açıklama */}
      <meta
        name="description"
        content="NöbetX uygulamasına hemen kayıt olun! Nöbetleriniz tek tuşla oluşturulsun."
      />
      {/* Favicon (Site logosu) */}
      <link rel="icon" href="/logoj.png" />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Giriş Yap</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="identifier">
                            Email veya Kullanıcı Adı:
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email veya kullanıcı adınızı girin"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">
                            Şifre:
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 mt-1"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
                    <p className="text-sm text-center mb-4">
                        Hesabınız yok mu?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Kayıt olun.
                        </Link>
                    </p>
                    <p className="text-sm text-center mb-4">
                        <Link href="/forgot-password-email" className="text-blue-500 hover:underline">
                            Şifremi Unuttum
                        </Link>
                    </p>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginUser;