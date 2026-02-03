import * as React from "react";
import { useState } from "react";
import { X, Loader2, Heart, Sparkles, Smartphone, Lock, User, Globe } from "lucide-react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTheme?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, selectedTheme }) => {
    const [mode, setMode] = useState<"register" | "login">("register");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        password: "",
        slug: "",
    });

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-lg animate-reveal overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-slate-400" />
                </button>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <Heart className="h-8 w-8 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-serif italic font-bold mb-2">
                            {mode === "register" ? "Mulailah Kebahagiaan Anda" : "Selamat Datang Kembali"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {mode === "register"
                                ? "Daftar sekarang untuk membuat undangan digital impian Anda."
                                : "Masuk untuk mengelola undangan Anda."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        {mode === "register" && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Nama Anda"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nomor HP (WhatsApp)</label>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="081234567890"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {mode === "register" && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Subdomain / Slug</label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="nama-pasangan"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 ml-1 mt-1 italic">Hasilnya akan: vowly.com/nama-pasangan</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-white rounded-2xl font-bold tracking-widest uppercase shadow-luxury hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === "register" ? "DAFTAR SEKARANG" : "MASUK KE DASHBOARD"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {mode === "register" ? "Sudah memiliki akun?" : "Belum memiliki akun?"}{" "}
                            <button
                                onClick={() => setMode(mode === "register" ? "login" : "register")}
                                className="text-primary font-bold hover:underline"
                            >
                                {mode === "register" ? "Masuk di sini" : "Daftar di sini"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
