import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin/useLogin.tsx";
import { themeSettings } from "../../ThemeSettings.ts";

interface IFormInput {
  email: string;   
  password: string;
}

function Login() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<IFormInput>();

    const { login } = useLogin();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        login(data.email, data.password);
    };

    const [themeStatus] = useState(() => {
        return localStorage.getItem("trello_theme") || "Небесна";
    });

    const currentTheme = themeSettings[themeStatus] || themeSettings["Небесна"];

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentTheme.bg} p-4 relative overflow-hidden font-sans`}>
            
            {/* фон (менш прив’язаний до синього) */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 max-w-4xl w-full z-10">
                
                <div className="w-48 md:w-72 shrink-0 drop-shadow-2xl">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500 pointer-events-none"
                    >
                        <source src="src/assets/sticker.webm" type="video/webm" />
                    </video>
                </div>

                <div className="w-full max-w-[340px] flex flex-col items-center md:items-start">
                    
                    <h1 className={`text-3xl font-extrabold ${currentTheme.text} mb-8 uppercase tracking-wide`}>
                        Вхід
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">

                        <div className="flex flex-col gap-1 w-full">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>

                                <input
                                    className="w-full bg-white/50 border border-white/80 rounded-2xl py-3.5 pr-4 pl-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-inner"
                                    type="email"
                                    placeholder="Email або логін"
                                    {...register("email", { required: "Вкажіть email" })}
                                />
                            </div>

                            {errors.email && (
                                <span className="text-red-500 text-xs ml-2">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>

                                <input
                                    className="w-full bg-white/50 border border-white/80 rounded-2xl py-3.5 pr-4 pl-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-inner"
                                    type="password"
                                    placeholder="Пароль"
                                    {...register("password", { 
                                        required: "Введіть пароль",
                                        minLength: { value: 6, message: "Мінімум 6 символів" }
                                    })}
                                />
                            </div>

                            {errors.password && (
                                <span className="text-red-500 text-xs ml-2">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3 mt-2 w-full">
                            <button 
                                type="submit" 
                                className={`flex-[3] ${currentTheme.btn} text-white py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all`}
                            >
                                УВІЙТИ
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center w-full">
                        <Link 
                            to="/register" 
                            className="text-gray-500 hover:text-gray-800 transition-colors font-medium"
                        >
                            Створити акаунт
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;