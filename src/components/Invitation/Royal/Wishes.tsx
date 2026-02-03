import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    MoveRight,
    MoveLeft,
    Quote,
    Sparkles,
} from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

const Wishes: React.FC = () => {
    const { invitationId } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 4;
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);

    useEffect(() => {
        if (!invitationId) return;
        loadWishes();
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) {
            setName(to);
            setIsNameLocked(true);
        }
    }, [invitationId]);

    const loadWishes = async () => {
        if (!invitationId) return;
        const data = await dbService.getWishes(invitationId);
        setWishes(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim() || !invitationId) return;
        setIsSending(true);
        try {
            await dbService.saveWish(invitationId, { name, message });
            setMessage("");
            if (!isNameLocked) setName("");
            await loadWishes();
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    const totalPages = Math.ceil(wishes.length / wishesPerPage);
    const currentWishes = useMemo(() => {
        const start = (currentPage - 1) * wishesPerPage;
        return wishes.slice(start, start + wishesPerPage);
    }, [wishes, currentPage]);

    return (
        <section id="wishes" className="bg-[#f9f8f0] dark:bg-[#2a0202] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-20">
                        <div className="space-y-6">
                            <Sparkles className="text-[#8d6e1c] dark:text-[#d4af37] h-10 w-10 opacity-40 dark:opacity-60 transition-colors duration-1000" strokeWidth={1} />
                            <h2 className="text-7xl md:text-8xl font-serif italic tracking-tighter leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">Untaian Doa</h2>
                            <div className="h-px w-24 bg-[#8d6e1c]/10 dark:bg-[#d4af37]/30 transition-colors duration-1000"></div>
                            <p className="text-[#8d6e1c]/50 dark:text-[#d4af37]/50 font-serif italic text-xl transition-colors duration-1000">Sampaikan doa restu dan harapan mulia untuk kedua mempelai.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-white dark:bg-black/20 p-12 md:p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 backdrop-blur-3xl shadow-2xl relative transition-all duration-1000">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>

                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/40 ml-4 italic">Nama Pengirim</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="NAMA ANDA"
                                        className="w-full bg-transparent border-b border-[#8d6e1c]/10 dark:border-[#d4af37]/20 py-4 text-2xl font-serif italic tracking-tight outline-none focus:border-[#8d6e1c]/60 dark:focus:border-[#d4af37]/60 transition-all text-black dark:text-white placeholder:text-[#8d6e1c]/10 dark:placeholder:text-[#d4af37]/10"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/40 ml-4 italic">Doa & Harapan</label>
                                    <textarea
                                        required
                                        placeholder="TULIS DOA ANDA..."
                                        rows={4}
                                        className="w-full bg-transparent border-b border-[#8d6e1c]/10 dark:border-[#d4af37]/20 py-4 text-2xl font-serif italic tracking-tight outline-none focus:border-[#8d6e1c]/60 dark:focus:border-[#d4af37]/60 transition-all text-black dark:text-white placeholder:text-[#8d6e1c]/10 dark:placeholder:text-[#d4af37]/10 resize-none font-sans"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-gradient-to-b from-[#8d6e1c] dark:from-[#d4af37] to-[#4a3a0a] dark:to-[#8d6e1c] text-white dark:text-maroon-900 py-8 font-bold uppercase tracking-[0.4em] text-[10px] hover:shadow-[0_0_40px_rgba(141,110,28,0.2)] dark:hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-6 group active:scale-95"
                            >
                                {isSending ? "MENGIRIM DOA..." : "KIRIM DOA RESTU"}
                                <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16 lg:pl-20">
                        <div className="flex items-center justify-between border-b border-[#8d6e1c]/10 dark:border-[#d4af37]/10 pb-12 transition-colors duration-1000">
                            <div className="flex items-center gap-6">
                                <Quote className="text-[#8d6e1c] dark:text-[#d4af37] h-10 w-10 rotate-180 opacity-20 dark:opacity-40 transition-colors duration-1000" strokeWidth={1} />
                                <p className="text-[10px] font-bold uppercase tracking-[1em] text-[#8d6e1c]/20 dark:text-[#d4af37]/20 transition-colors duration-1000">GUESTBOOK — {wishes.length}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border border-[#d4af37]/10 rounded-full flex items-center justify-center hover:bg-[#d4af37]/10 transition-all disabled:opacity-10"
                                >
                                    <MoveLeft size={24} className="text-[#d4af37]/60" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border border-[#d4af37]/10 rounded-full flex items-center justify-center hover:bg-[#d4af37]/10 transition-all disabled:opacity-10"
                                >
                                    <MoveRight size={24} className="text-[#d4af37]/60" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className="relative space-y-8 animate-reveal group">
                                    <div className="space-y-6">
                                        <p className="text-4xl md:text-5xl font-serif italic tracking-tight leading-tight text-white/80 group-hover:text-[#d4af37] transition-colors duration-700 italic">"{wish.message}"</p>
                                        <div className="flex items-center gap-12 pt-4">
                                            <div className="h-[1px] w-24 bg-[#d4af37]/20"></div>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-serif italic tracking-tight text-[#8d6e1c]/60 dark:text-[#d4af37]/80 transition-colors duration-1000">{wish.name}</p>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8d6e1c]/20 dark:text-[#d4af37]/20 italic transition-colors duration-1000">
                                                    {new Date(wish.created_at).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Wishes;
