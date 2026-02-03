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
    Sparkles,
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
        <section id="wishes" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent opacity-30"></div>

            <div className="container mx-auto max-w-6xl relative z-10 space-y-24">
                <div className="text-center space-y-6">
                    <Sparkles className="text-[#db7093] h-8 w-8 mx-auto opacity-30 animate-pulse" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Love Notes</h2>
                    <p className="max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl transition-colors">"Your prayers and warm wishes mean the world to us as we begin this new journey together."</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Wrapper */}
                    <div className="lg:col-span-5 bg-[#fffafa] dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000">
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">Send a Wish</h3>
                            <div className="h-[1px] w-12 bg-[#db7093] opacity-30"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-10">
                                <div className="relative">
                                    <label className="absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">From</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Your lovely name"
                                        className="w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-700 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">Message</label>
                                    <textarea
                                        required
                                        placeholder="Write your beautiful message..."
                                        rows={5}
                                        className="w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-700 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-6 rounded-full text-[11px] font-black tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-4 ${postSuccess ? 'bg-green-500 text-white' : 'bg-[#db7093] dark:bg-[#ff8da1] text-white dark:text-slate-950 hover:bg-[#c71585] dark:hover:bg-white transition-colors duration-500'
                                    }`}
                            >
                                {isSending ? "Sending..." : postSuccess ? "Sent with Love!" : "Post Message"}
                                {!postSuccess && <Heart size={18} />}
                                {postSuccess && <Check size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* List Wrapper */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {currentWishes.map(wish => (
                                <div key={wish.id} className="relative group p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-1000 flex flex-col gap-6">
                                    <Quote className="text-[#db7093] h-10 w-10 opacity-10" />
                                    <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors">"{wish.message}"</p>
                                    <div className="pt-8 border-t border-[#fffafa] space-y-1">
                                        <p className="text-[11px] font-black tracking-[0.3em] text-[#db7093] dark:text-[#ff8da1] uppercase italic transition-colors">{wish.name}</p>
                                        <p className="text-[10px] text-slate-300 italic">
                                            {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#fffafa]"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="flex items-center gap-6 px-10 bg-[#fffafa] rounded-full text-[#db7093] font-serif text-2xl italic">
                                    <span>{currentPage}</span>
                                    <span className="opacity-20">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#fffafa]"
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
