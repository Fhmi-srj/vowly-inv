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
        <section id="wishes" className="bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-serif transition-colors duration-1000">
            {/* Dust & Grain */}
            <div className="absolute inset-0 opacity-20 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-20 animate-reveal">
                        <div className="space-y-6">
                            <Sparkles className="text-[#c5a059] h-10 w-10 opacity-60" strokeWidth={1} />
                            <h2 className="text-7xl md:text-8xl italic tracking-tighter leading-none text-[#5c4033]/90 dark:text-[#d4c3a1]/90 transition-colors duration-1000">Telegrams</h2>
                            <div className="w-16 h-px bg-[#5c4033]/20 dark:bg-white/10 transition-colors duration-1000"></div>
                            <p className="text-[#5c4033]/60 dark:text-[#d4c3a1]/60 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed transition-colors duration-1000">Please send your warmest greetings to be archived in our family docket.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-white/40 dark:bg-white/5 p-12 md:p-16 rounded-sm border-y-4 border-[#5c4033]/10 dark:border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-700 hover:shadow-3xl group">
                            {/* Typewriter Key Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 -translate-y-1/2 translate-x-1/2 rounded-full transition-colors group-hover:bg-[#c5a059]/10"></div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5c4033]/30 dark:text-[#d4c3a1]/30 ml-4 font-mono italic transition-colors duration-1000">Sender's Handle</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="NAMA ANDA..."
                                        className="w-full bg-transparent border-b-2 border-[#5c4033]/10 dark:border-white/10 py-6 text-2xl font-mono italic tracking-tighter outline-none focus:border-[#c5a059]/40 transition-all text-[#5c4033] dark:text-[#d4c3a1] placeholder:text-[#5c4033]/5"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5c4033]/30 dark:text-[#d4c3a1]/30 ml-4 font-mono italic transition-colors duration-1000">Message Script</label>
                                    <textarea
                                        required
                                        placeholder="TULIS PESAN..."
                                        rows={4}
                                        className="w-full bg-transparent border-b-2 border-[#5c4033]/10 dark:border-white/10 py-6 text-2xl font-mono italic tracking-tighter outline-none focus:border-[#c5a059]/40 transition-all text-[#5c4033] dark:text-[#d4c3a1] placeholder:text-[#5c4033]/5 resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] dark:text-[#121212] py-8 rounded-none font-mono font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] dark:hover:text-white transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-[15px_15px_0_rgba(92,64,51,0.15)] relative z-10"
                            >
                                {isSending ? "ARCHIVING..." : "DISPATCH TELEGRAM"}
                                <MoveRight size={16} className="group-hover:translate-x-4 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between border-b-2 border-[#5c4033]/5 dark:border-white/5 pb-10 font-mono transition-colors duration-1000">
                            <div className="flex items-center gap-6">
                                <Quote size={32} className="text-[#c5a059] opacity-30" strokeWidth={1} />
                                <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#5c4033]/20 dark:text-[#d4c3a1]/20 transition-colors duration-1000">ARCHIVE LOG — {wishes.length}</p>
                            </div>
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-14 h-14 border border-[#5c4033]/10 dark:border-white/10 rounded-none flex items-center justify-center hover:bg-[#5c4033]/5 dark:hover:bg-white/5 transition-all disabled:opacity-10 shadow-sm"
                                >
                                    <MoveLeft size={20} className="text-[#5c4033]/40 dark:text-[#d4c3a1]/40" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-14 h-14 border border-[#5c4033]/10 dark:border-white/10 rounded-none flex items-center justify-center hover:bg-[#5c4033]/5 dark:hover:bg-white/5 transition-all disabled:opacity-10 shadow-sm"
                                >
                                    <MoveRight size={20} className="text-[#5c4033]/40 dark:text-[#d4c3a1]/40" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-16">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className="relative space-y-8 animate-reveal group">
                                    <p className="text-4xl md:text-5xl italic tracking-tight leading-tight text-[#5c4033]/70 dark:text-[#d4c3a1]/70 font-black transition-colors duration-1000">— "{wish.message}"</p>
                                    <div className="flex items-center gap-12 pt-4">
                                        <div className="h-[2px] w-16 bg-[#c5a059]/20 transition-colors duration-1000"></div>
                                        <div className="space-y-2">
                                            <p className="text-2xl italic tracking-tight text-[#5c4033]/60 dark:text-[#d4c3a1]/60 font-mono uppercase italic transition-colors duration-1000">{wish.name}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#5c4033]/20 dark:text-[#d4c3a1]/20 font-mono transition-colors duration-1000">
                                                {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
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
