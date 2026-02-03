import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    MoveRight,
    MoveLeft,
    Quote,
    Zap,
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
        <section id="wishes" className="bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-sans transition-colors duration-700">
            <div className="absolute inset-x-0 bottom-0 h-4 bg-[#2d2d2d] opacity-5"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-20 animate-reveal">
                        <div className="space-y-6">
                            <div className="inline-block bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-10 py-2 rotate-2 shadow-[8px_8px_0_#2d2d2d] dark:shadow-[8px_8px_0_#ff4081] transition-all duration-700">
                                <p className="tracking-[0.6em] text-[10px] font-black uppercase text-[#2d2d2d]">FAN GREETINGS</p>
                            </div>
                            <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter leading-none uppercase transform -skew-x-12 transition-colors duration-700">The Dialogue</h2>
                            <div className="w-16 h-[4px] bg-[#2d2d2d] dark:bg-[#00e5ff] rounded-full transition-colors"></div>
                            <p className="text-[#2d2d2d]/60 dark:text-white/60 font-black italic text-xl leading-relaxed uppercase tracking-tighter transition-colors">Your wishes fuel our next chapter!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-white dark:bg-[#1a1a2e] p-12 md:p-16 border-[4px] border-[#2d2d2d] dark:border-white shadow-[15px_15px_0_#2196f3] dark:shadow-[15px_15px_0_#ff4081] relative overflow-hidden transition-all duration-700 hover:shadow-[20px_20px_0_#ff4081] dark:hover:shadow-[20px_20px_0_#00e5ff] group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ffeb3b]/20 dark:bg-[#00e5ff]/20 rounded-full group-hover:bg-[#ffeb3b]/40 dark:group-hover:bg-[#00e5ff]/40 transition-colors"></div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#2d2d2d]/30 dark:text-white/30 ml-4 italic transition-colors">Writer handle</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="WHO ARE YOU?"
                                        className="w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] dark:border-white/20 px-10 py-6 text-2xl font-black italic tracking-tighter outline-none focus:bg-white dark:focus:bg-white/5 transition-all text-[#2d2d2d] dark:text-white placeholder:text-[#2d2d2d]/10 dark:placeholder:white/10 uppercase"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#2d2d2d]/30 dark:text-white/30 ml-4 italic transition-colors">The Script (Your Wish)</label>
                                    <textarea
                                        required
                                        placeholder="TYPE YOUR MESSAGE..."
                                        rows={4}
                                        className="w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] dark:border-white/20 px-10 py-6 text-2xl font-black italic tracking-tighter outline-none focus:bg-white dark:focus:bg-white/5 transition-all text-[#2d2d2d] dark:text-white placeholder:text-[#2d2d2d]/10 dark:placeholder:white/10 resize-none uppercase"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-[#2d2d2d] dark:bg-[#ff4081] text-white py-8 font-black uppercase tracking-[0.6em] text-[12px] hover:bg-[#ff4081] dark:hover:bg-[#00e5ff] dark:hover:text-[#2d2d2d] transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-[10px_10px_0_#ffeb3b] dark:shadow-[10px_10px_0_#2d2d2d] relative z-10"
                            >
                                {isSending ? "ARCHIVING..." : "SEND TO LOG"}
                                <Zap size={20} className="fill-white group-hover:rotate-180 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between border-b-[4px] border-[#2d2d2d]/10 dark:border-white/10 pb-10 transition-colors duration-700">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#ff4081] -rotate-3 transition-all duration-700">
                                    <Quote size={28} className="text-[#2d2d2d]" fill="currentColor" strokeWidth={3} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#2d2d2d]/30 dark:text-white/30 italic transition-colors">CHAPTER ARCHIVE — {wishes.length}</p>
                            </div>
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border-[4px] border-[#2d2d2d] dark:border-white flex items-center justify-center hover:bg-[#ffeb3b] dark:hover:bg-[#00e5ff] transition-all disabled:opacity-10 shadow-[5px_5px_0_rgba(0,0,0,0.1)] dark:shadow-[5px_5px_0_#ff4081]"
                                >
                                    <MoveLeft size={24} className="text-[#2d2d2d] dark:text-white dark:group-hover:text-[#2d2d2d]" strokeWidth={3} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border-[4px] border-[#2d2d2d] dark:border-white flex items-center justify-center hover:bg-[#ffeb3b] dark:hover:bg-[#00e5ff] transition-all disabled:opacity-10 shadow-[5px_5px_0_rgba(0,0,0,0.1)] dark:shadow-[5px_5px_0_#ff4081]"
                                >
                                    <MoveRight size={24} className="text-[#2d2d2d] dark:text-white dark:group-hover:text-[#2d2d2d]" strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-16">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className="relative space-y-8 animate-reveal group">
                                    <div className="p-10 bg-white dark:bg-[#1a1a2e] border-[3px] border-[#2d2d2d] dark:border-white shadow-[10px_10px_0_rgba(0,0,0,0.05)] dark:shadow-[10px_10px_0_#ff4081] group-hover:shadow-[12px_12px_0_#2196f3] dark:group-hover:shadow-[12px_12px_0_#00e5ff] transition-all relative overflow-hidden">
                                        {/* Halftone Sticker Effect */}
                                        <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] dark:opacity-[0.1] bg-[radial-gradient(#000_2px,transparent_2px)] dark:bg-[radial-gradient(#00e5ff_2px,transparent_2px)] [background-size:10px_10px] transition-all"></div>
                                        <p className="text-4xl md:text-5xl italic tracking-tighter leading-tight text-[#2d2d2d] dark:text-white font-black uppercase transform -skew-x-6 transition-colors">— "{wish.message}"</p>
                                    </div>

                                    <div className="flex items-center gap-12 pt-4 px-8">
                                        <div className="h-[4px] w-20 bg-[#ff4081]/30 dark:bg-[#00e5ff]/30 rounded-full transition-colors"></div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black italic tracking-tighter text-[#2d2d2d]/60 dark:text-white/60 uppercase transform -skew-x-12 transition-colors">{wish.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/20 dark:text-white/20 italic transition-colors">
                                                LOGGED: {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
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
