"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/app/loaders/baseApi";
import { OtpInput } from "reactjs-otp-input"; // OTP girişi için kullanılan kütüphane

const ForgotPasswordCode = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Formik ve Yup ile doğrulama şeması
    const validationSchema = Yup.object({
        code: Yup.string()
            .required("Doğrulama kodu gereklidir.")
            .min(6, "Kod 6 karakter olmalıdır.")
            .max(6, "Kod 6 karakter olmalıdır."),
    });

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            setSuccess("");

            try {
                const response = await api.post(
                    "api/verifyResetCode",
                    { code: values.code },
                    { withCredentials: true }
                );

                if (response.data?.status === false) {
                    setError("Doğrulama kodu geçersiz.");
                } else {
                    // Doğrulama kodunu localStorage'a kaydet
                    localStorage.setItem("resetCode", values.code);

                    setSuccess("Kod doğrulandı. Yeni şifrenizi belirleyin.");
                    router.push("/forgot-password-change");
                }
            } catch (err) {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        },
    });

    // Kullanıcıyı önceki sayfaya yönlendir
    useEffect(() => {
        const email = localStorage.getItem("resetEmail"); // Önceki sayfadan e-posta bilgisini al
        if (!email) {
            router.push("/forgot-password-email"); // E-posta yoksa önceki sayfaya yönlendir
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-24 flex justify-center items-center text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Şifre Sıfırlama Kodu</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Lütfen e-posta adresinize gönderilen 6 haneli kodu girin.
                        </p>
                        <div className="w-full flex justify-center">
                            <OtpInput
                                value={formik.values.code}
                                onChange={(value) => formik.setFieldValue("code", value)}
                                onBlur={formik.handleBlur("code")}
                                numInputs={6}
                                separator={<span style={{ width: "10px" }}></span>}
                                isInputNum
                                shouldAutoFocus
                                inputStyle={{
                                    width: "100%",
                                    height: "50px",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    margin: "0 5px",
                                }}
                            />
                        </div>
                        {formik.touched.code && formik.errors.code && (
                            <div className="text-red-500 text-sm mt-2 text-center">
                                {formik.errors.code}
                            </div>
                        )}
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                    {success && (
                        <div className="text-green-500 text-sm mb-4 text-center">{success}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? "Doğrulanıyor..." : "Doğrula"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordCode;