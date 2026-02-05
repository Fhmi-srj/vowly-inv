import * as React from "react";
import { useState, useEffect } from "react";
import { X, Loader2, Heart, Smartphone, Lock, User, Globe } from "lucide-react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTheme?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, selectedTheme }) => {
    const [mode, setMode] = useState<"register" | "login">("register");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

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

    const handleModeSwitch = (newMode: "register" | "login") => {
        setIsAnimating(true);
        setTimeout(() => {
            setMode(newMode);
            setError("");
            setTimeout(() => setIsAnimating(false), 50);
        }, 200);
    };

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
            const payload = mode === "register"
                ? { ...formData, themeId: selectedTheme }
                : { phone: formData.phone, password: formData.password };

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

                <div className={`relative w-full max-w-lg overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-white/5 max-h-[95vh] overflow-y-auto transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    </button>

                    <div className="p-6 sm:p-8 md:p-12">
                        <div className={`flex flex-col items-center text-center mb-8 sm:mb-10 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 sm:mb-6">
                                <Heart className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold mb-2">
                                {mode === "register" ? "Mulailah Kebahagiaan Anda" : "Selamat Datang Kembali"}
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 px-2">
                                {mode === "register"
                                    ? "Daftar sekarang untuk membuat undangan digital impian Anda."
                                    : "Masuk untuk mengelola undangan Anda."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={`space-y-4 sm:space-y-5 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                            {error && (
                                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl border border-red-100 dark:border-red-900/30 animate-shake">
                                    {error}
                                </div>
                            )}

                            {mode === "register" && (
                                <div className="space-y-1.5 animate-fadeIn">
                                    <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nama Lengkap</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nama Anda"
                                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5 animate-fadeIn" style={{ animationDelay: mode === "register" ? "50ms" : "0ms" }}>
                                <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nomor HP (WhatsApp)</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="081234567890"
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {mode === "register" && (
                                <div className="space-y-1.5 animate-fadeIn" style={{ animationDelay: "100ms" }}>
                                    <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Subdomain / Slug</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            name="slug"
                                            required
                                            value={formData.slug}
                                            onChange={handleChange}
                                            placeholder="nama-pasangan"
                                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 ml-1 mt-1 italic">Hasilnya akan: vowly.com/nama-pasangan</p>
                                </div>
                            )}

                            <div className="space-y-1.5 animate-fadeIn" style={{ animationDelay: mode === "register" ? "150ms" : "50ms" }}>
                                <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-luxury hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 animate-fadeIn"
                                style={{ animationDelay: mode === "register" ? "200ms" : "100ms" }}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : mode === "register" ? "DAFTAR SEKARANG" : "MASUK KE DASHBOARD"}
                            </button>
                        </form>

                        <div className={`mt-6 sm:mt-8 text-center transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                            <p className="text-xs sm:text-sm text-slate-500">
                                {mode === "register" ? "Sudah memiliki akun?" : "Belum memiliki akun?"}{" "}
                                <button
                                    onClick={() => handleModeSwitch(mode === "register" ? "login" : "register")}
                                    className="text-primary font-bold hover:underline transition-all hover:scale-105 inline-block"
                                >
                                    {mode === "register" ? "Masuk di sini" : "Daftar di sini"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterModal;