import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    MoveRight,
    MoveLeft,
    Quote,
    Sparkles,
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
        <section id="wishes" className="bg-white dark:bg-[#0a0a0b] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            {/* Stars decor */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            <div className="absolute inset-0 opacity-0 dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-20">
                        <div className="space-y-6">
                            <Zap className="text-emerald-500 h-10 w-10 animate-pulse" strokeWidth={1.5} />
                            <h2 className="text-7xl md:text-8xl font-serif italic tracking-tighter leading-none text-black dark:text-white transition-colors duration-1000">Vocal <br /> Sentiments</h2>
                            <div className="h-[1px] w-20 bg-emerald-500/50"></div>
                            <p className="text-black/40 dark:text-white/40 font-serif italic text-xl transition-colors duration-1000">Leave a trace of your warmth in our registry.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-black/[0.01] dark:bg-white/[0.02] p-12 md:p-16 border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl shadow-2xl transition-all duration-1000">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Signatory</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="YOUR NAME"
                                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all text-black dark:text-white placeholder:text-black/5 dark:placeholder:text-white/5"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 italic">Sentiment</label>
                                    <textarea
                                        required
                                        placeholder="TYPE MESSAGE..."
                                        rows={4}
                                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all text-black dark:text-white placeholder:text-black/5 dark:placeholder:text-white/5 resize-none font-sans"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-xl"
                            >
                                {isSending ? "RECORDING..." : "POST SENTIMENT"}
                                <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16 lg:pl-20">
                        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-12 transition-colors duration-1000">
                            <div className="flex items-center gap-6">
                                <Quote className="text-emerald-500 h-10 w-10 rotate-180" strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-[1em] text-black/20 dark:text-white/20 transition-colors duration-1000">The Archive — {wishes.length}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20"
                                >
                                    <MoveLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20"
                                >
                                    <MoveRight size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-16">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className="relative space-y-12 animate-reveal group">
                                    <div className="space-y-6">
                                        <p className="text-5xl md:text-6xl font-serif italic tracking-tight leading-tight text-black/90 dark:text-white/90 group-hover:text-emerald-400 transition-colors duration-700 italic">"{wish.message}"</p>
                                        <div className="flex items-center gap-12 pt-4">
                                            <div className="h-[1px] w-12 bg-emerald-500/30"></div>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{wish.name}</p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/10 dark:text-white/10 transition-colors duration-1000">
                                                    {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
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
