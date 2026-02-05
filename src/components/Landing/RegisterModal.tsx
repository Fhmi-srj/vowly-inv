import * as React from "react";
import { useState, useEffect } from "react";
import { X, Loader2, Heart, Smartphone, Lock, User, Globe, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTheme?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, selectedTheme }) => {
    const [view, setView] = useState<"selection" | "auth">("selection");
    const [mode, setMode] = useState<"login">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [direction, setDirection] = useState(0);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        password: "",
        slug: "",
    });

    // Handle modal open/close animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const handleShowLogin = () => {
        setDirection(1);
        setView("auth");
        setError("");
    };

    const handleBackToSelection = () => {
        setDirection(-1);
        setView("selection");
        setError("");
    };

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const endpoint = "/api/auth/login";
            const payload = { phone: formData.phone, password: formData.password };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                // Success! Redirect based on role
                if (data.role === "admin") {
                    window.location.href = "/admin";
                } else if (data.role === "user") {
                    // Redirect to specific invitation if found, else to dashboard hub
                    window.location.href = data.invitationId ? `/dashboard/manage/${data.invitationId}` : "/dashboard";
                } else {
                    window.location.href = "/dashboard"; // Default fallback
                }
            } else {
                setError(data.error || "Terjadi kesalahan");
            }
        } catch (err) {
            setError("Gagal menghubungi server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { 
                        transform: translateX(0); 
                    }
                    25% { 
                        transform: translateX(-5px); 
                    }
                    75% { 
                        transform: translateX(5px); 
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }

                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>

            <div className={`fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className={`absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleClose}
                ></div>

                <div className={`relative w-full max-w-lg overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white shadow-2xl border border-pink-100 max-h-[95vh] overflow-y-auto transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    </button>

                    <div className="p-0">
                        <AnimatePresence mode="wait" initial={false} custom={direction}>
                            {view === "selection" ? (
                                <motion.div
                                    key="selection"
                                    custom={direction}
                                    initial={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="p-6 sm:p-8 md:p-12"
                                >
                                    <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-3xl flex items-center justify-center p-2 mb-4 sm:mb-6">
                                            <img src="/logo-vowly.png" alt="Vowly Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-serif italic font-bold mb-2">
                                            Abadikan Momen Cinta
                                        </h2>
                                        <p className="text-sm sm:text-base text-slate-500 px-2">
                                            Pilih langkah Anda untuk memulai kebahagiaan.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <a
                                            href={`/register${selectedTheme ? `?theme=${selectedTheme}` : ''}`}
                                            className="w-full py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-lg shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Belum Punya Akun? Daftar
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </a>

                                        <button
                                            onClick={handleShowLogin}
                                            className="w-full py-4 sm:py-5 bg-white text-pink-500 border-2 border-pink-100 rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm hover:bg-pink-50 hover:border-pink-200 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Sudah Punya Akun? Masuk
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="auth"
                                    custom={direction}
                                    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="p-6 sm:p-8 md:p-12"
                                >
                                    <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-3xl flex items-center justify-center p-2 mb-4 sm:mb-6">
                                            <img src="/logo-vowly.png" alt="Vowly Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-serif italic font-bold mb-2">
                                            Selamat Datang Kembali
                                        </h2>
                                        <p className="text-sm sm:text-base text-slate-500 px-2">
                                            Masuk untuk mengelola undangan Anda.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                        {error && (
                                            <div className="p-3 sm:p-4 bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl border border-red-100 animate-shake">
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nomor HP (WhatsApp)</label>
                                            <div className="relative group">
                                                <Smartphone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="081234567890"
                                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-pink-50/50 border border-pink-100 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-pink-50/50 border border-pink-100 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-lg shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
                                        >
                                            {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : "MASUK KE DASHBOARD"}
                                        </button>
                                    </form>

                                    <div className="mt-6 sm:mt-8 text-center">
                                        <button
                                            onClick={handleBackToSelection}
                                            className="text-pink-500 text-xs sm:text-sm font-bold hover:underline transition-all flex items-center justify-center gap-2 mx-auto"
                                        >
                                            <ArrowRight className="h-3 w-3 rotate-180" /> Kembali ke pilihan
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterModal;