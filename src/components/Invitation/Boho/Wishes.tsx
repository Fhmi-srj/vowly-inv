import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    Quote,
    Heart,
    Send,
    ChevronLeft,
    ChevronRight,
    Sun,
    Check,
} from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

const Wishes: React.FC = () => {
    const { invitationId } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 6;
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

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
            setPostSuccess(true);
            setTimeout(() => setPostSuccess(false), 3000);
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
        <section id="wishes" className="bg-white dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-6xl relative z-10 space-y-32">
                <div className="text-center space-y-8">
                    <Sun className="text-[#c19a6b] h-10 w-10 mx-auto opacity-20 animate-spin-slow" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Blessing Tree</h2>
                    <div className="flex flex-col items-center gap-4">
                        <p className="max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">"Your words are the seeds of our future garden. Thank you for being part of our story."</p>
                        <div className="w-20 h-px bg-[#e2725b] opacity-40"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Wrapper */}
                    <div className="lg:col-span-5 bg-[#faf7f2] dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000">
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">Write a Note</h3>
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.4em] uppercase">Digital Guestbook</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Your Name</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Beautiful name here"
                                        className="w-full bg-white dark:bg-stone-800 rounded-2xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Warm Wishes</label>
                                    <textarea
                                        required
                                        placeholder="Pour your heart out..."
                                        rows={5}
                                        className="w-full bg-white dark:bg-stone-800 rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700 resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${postSuccess ? 'bg-green-600 text-white' : 'bg-[#e2725b] text-white dark:text-slate-950 hover:bg-[#4a4a4a] dark:hover:bg-white transition-colors duration-500'
                                    }`}
                            >
                                {isSending ? "Sending Wish..." : postSuccess ? "Wish Received!" : "Post Message"}
                                {!postSuccess && <Send size={18} />}
                                {postSuccess && <Check size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* List Wrapper */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {currentWishes.map(wish => (
                                <div key={wish.id} className="relative group p-12 bg-white dark:bg-stone-900 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-xl hover:shadow-[#e2725b]/20 transition-all duration-1000 flex flex-col gap-6">
                                    <Quote className="text-[#e2725b] h-10 w-10 opacity-10 -ml-2" />
                                    <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors">"{wish.message}"</p>
                                    <div className="pt-8 border-t border-[#faf7f2] dark:border-white/5 flex items-center justify-between transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black tracking-[0.3em] text-[#e2725b] uppercase italic">{wish.name}</p>
                                            <p className="text-[10px] text-slate-300 dark:text-stone-500 italic transition-colors">
                                                {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <Heart className="text-[#e2725b] h-4 w-4 opacity-20 fill-[#e2725b]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="flex items-center gap-8 px-12 bg-[#faf7f2] dark:bg-stone-800 rounded-2xl text-[#c19a6b] dark:text-stone-400 font-serif text-2xl italic shadow-inner transition-colors">
                                    <span>{currentPage}</span>
                                    <span className="opacity-10">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Wishes;
