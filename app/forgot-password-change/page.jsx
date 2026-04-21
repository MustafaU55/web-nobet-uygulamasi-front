"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/app/loaders/baseApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPasswordChange = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const validationSchema = Yup.object({
        password: Yup.string()
            .required("Şifre gereklidir.")
            .min(6, "Şifre en az 6 karakter olmalıdır.")
            .max(30, "Şifre en fazla 30 karakter olmalıdır."),
        rePassword: Yup.string()
            .required("Şifreyi tekrar girin.")
            .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor."),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            rePassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            setSuccess("");

            try {
                const response = await api.post(
                    "api/resetPassword",
                    {
                        password: values.password,
                        r_password: values.rePassword,
                        code: localStorage.getItem("resetCode"),
                    },
                    { withCredentials: true }
                );

                if (response.data?.success === "true") {
                    setSuccess(response.data.message || "Şifreniz başarıyla güncellendi.");

                    // localStorage'dan reset verilerini sil
                    localStorage.removeItem("resetCode");
                    localStorage.removeItem("resetEmail");

                    // 3 saniye sonra login sayfasına yönlendir
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                } else {
                    setError("Şifre sıfırlama başarısız. Lütfen tekrar deneyin.");
                }
            } catch (err) {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const code = localStorage.getItem("resetCode");
        if (!code) {
            router.push("/forgot-password-code");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-24 flex justify-center items-center text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Yeni Şifre Belirle</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">
                            Yeni Şifre:
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Yeni şifrenizi girin"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 mt-1"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-2" htmlFor="rePassword">
                            Şifreyi Tekrar Girin:
                        </label>
                        <input
                            type={showRePassword ? "text" : "password"}
                            id="rePassword"
                            name="rePassword"
                            value={formik.values.rePassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Şifreyi tekrar girin"
                        />
                        <button
                            type="button"
                            onClick={() => setShowRePassword(!showRePassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 mt-1"
                        >
                            {showRePassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        {formik.touched.rePassword && formik.errors.rePassword && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.rePassword}</div>
                        )}
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                    {success && (
                        <div className="text-green-500 text-sm mb-4 text-center">
                            {success} Giriş sayfasına yönlendiriliyorsunuz...
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordChange;
