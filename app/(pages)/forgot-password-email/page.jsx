"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/app/loaders/baseApi";

const ForgotPasswordEmail = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validationSchema = Yup.object({
        usernameAndEmail: Yup.string()
            .required("E-posta gereklidir.")
            .matches(
                /^(?=(?:[^.]*\.){0,3}[^.]*$)(?=(?:[^-]*-){0,3}[^-]*$)(?=(?:[^_]*_){0,3}[^_]*$)(?=(?:[^@]*@){0,3}[^@]*$)[a-zA-Z0-9._@-]+$/,
                "Geçersiz karakterler içeriyor."
            ),
    });

    const formik = useFormik({
        initialValues: {
            usernameAndEmail: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await api.post(
                    "api/sendResetCode",
                    { email: values.usernameAndEmail },
                    { withCredentials: true }
                );

                if (response.data?.status === false) {
                    setError("E-posta bulunamadı.");
                } else {
                    // E-posta bilgisini localStorage'a kaydet
                    localStorage.setItem("resetEmail", values.usernameAndEmail);

                    setSuccess("Şifre sıfırlama bağlantısı gönderildi.");
                    router.push("/forgot-password-code");
                }
            } catch (err) {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        },
    });

    return (
        <div className="text-black min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-24 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Şifremi Unuttum</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="usernameAndEmail">
                            E-posta:
                        </label>
                        <input
                            type="text"
                            id="usernameAndEmail"
                            name="usernameAndEmail"
                            value={formik.values.usernameAndEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="E-posta girin"
                        />
                        {formik.touched.usernameAndEmail && formik.errors.usernameAndEmail && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.usernameAndEmail}</div>
                        )}
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;