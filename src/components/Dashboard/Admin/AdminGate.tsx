import * as React from "react";
import { useState } from "react";
import { Shield, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

const AdminGate: React.FC = () => {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Succes! Refresh to let the server-side check pass
                window.location.reload();
            } else {
                setError(data.error || "Akses Ditolak");
            }
        } catch (err) {
            setError("Gagal menghubungi server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] bg-slate-50 flex items-center justify-center p-6 overflow-hidden font-sans">
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse-soft"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>

            <div className="relative w-full max-w-md animate-reveal">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] border border-slate-200 mb-8 shadow-xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <Shield className="h-10 w-10 text-primary relative z-10 animate-pulse" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif italic text-slate-900 mb-6 tracking-tight">Admin Gate</h1>
                    <p className="text-slate-500 font-light tracking-wide leading-relaxed">Masukkan kunci otorisasi untuk mengakses <br /> Pusat Kendali Vowly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="KUNCI OTORISASI"
                            className="w-full bg-white border border-slate-200 rounded-3xl py-6 pl-16 pr-6 text-slate-900 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-mono tracking-[0.3em] text-center shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white hover:bg-slate-800 rounded-3xl py-6 font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Buka Akses <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-16 flex flex-col items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary/40" />
                        <span className="text-[10px] uppercase font-black tracking-[0.4em]">Vowly Governance System</span>
                    </div>
                    <div className="h-10 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminGate;
