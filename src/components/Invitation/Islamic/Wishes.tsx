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
        <section id="wishes" className="bg-white dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-20 animate-reveal">
                        <div className="space-y-6">
                            <Sparkles className="text-[#c5a059] h-10 w-10 opacity-60 transition-opacity duration-1000" strokeWidth={1} />
                            <h2 className="text-7xl md:text-8xl font-serif italic tracking-tighter leading-none dark:text-white transition-colors duration-1000">Doa & Restu</h2>
                            <div className="w-16 h-px bg-[#2d4a3e]/10 dark:bg-white/10 transition-colors duration-1000"></div>
                            <p className="text-[#2d4a3e]/60 dark:text-white/60 font-serif italic text-xl leading-relaxed transition-colors duration-1000">Kehadiran doa Anda adalah hadiah terindah dalam perjalanan ibadah kami.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 p-12 md:p-16 rounded-[4rem] border border-[#2d4a3e]/5 dark:border-white/5 shadow-sm relative overflow-hidden transition-all duration-700 hover:shadow-xl">
                            {/* Geometric Pattern Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 dark:bg-[#c5a059]/5 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors duration-1000"></div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d4a3e]/30 dark:text-white/30 ml-8 italic transition-colors duration-1000">Nama Pengirim</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="NAMA ANDA"
                                        className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-6 text-2xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 transition-all placeholder:text-[#2d4a3e]/10 dark:placeholder:text-white/10 shadow-sm"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d4a3e]/30 dark:text-white/30 ml-8 italic transition-colors duration-1000">Tulis Doa</label>
                                    <textarea
                                        required
                                        placeholder="DOA TERBAIK ANDA..."
                                        rows={4}
                                        className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 transition-all placeholder:text-[#2d4a3e]/10 dark:placeholder:text-white/10 resize-none font-sans shadow-sm"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] py-8 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-[#1e332a] dark:hover:bg-[#2d4a3e] dark:hover:text-white transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-xl relative z-10"
                            >
                                {isSending ? "MENGIRIM..." : "KIRIM DOA RESTU"}
                                <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between border-b border-[#2d4a3e]/5 dark:border-white/5 pb-12 transition-colors duration-1000">
                            <div className="flex items-center gap-6">
                                <Quote size={40} className="text-[#c5a059] opacity-20 transition-opacity duration-1000" strokeWidth={1} />
                                <p className="text-[11px] font-bold uppercase tracking-[0.8em] text-[#2d4a3e]/20 dark:text-white/20 transition-colors duration-1000">GUESTBOOK ARCHIVE</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full flex items-center justify-center hover:bg-[#fdfbf7] dark:hover:bg-[#0c2c1e]/40 transition-all disabled:opacity-10 shadow-sm"
                                >
                                    <MoveLeft size={20} className="text-[#2d4a3e]/40 dark:text-white/40" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full flex items-center justify-center hover:bg-[#fdfbf7] dark:hover:bg-[#0c2c1e]/40 transition-all disabled:opacity-10 shadow-sm"
                                >
                                    <MoveRight size={20} className="text-[#2d4a3e]/40 dark:text-white/40" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className="relative space-y-10 group animate-reveal">
                                    <p className="text-4xl md:text-5xl font-serif italic tracking-tight leading-tight text-[#2d4a3e]/90 dark:text-white/90 transition-colors duration-700 group-hover:text-[#2d4a3e] dark:group-hover:text-white">"{wish.message}"</p>
                                    <div className="flex items-center gap-10">
                                        <div className="h-px w-20 bg-[#c5a059]/30 transition-colors duration-1000"></div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-serif italic tracking-tight text-[#2d4a3e]/70 dark:text-white/70 transition-colors duration-1000">{wish.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/20 dark:text-white/20 italic transition-colors duration-1000">
                                                {new Date(wish.created_at).toLocaleDateString("id-ID", { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
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
