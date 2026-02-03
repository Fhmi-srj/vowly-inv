import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    MoveRight,
    MoveLeft,
    Quote,
    Smile,
    Check,
    Send,
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
        <section id="wishes" className="bg-white dark:bg-slate-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden relative transition-colors duration-1000">
            {/* Dot Background Decor */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-32">
                <div className="text-center space-y-8 flex flex-col items-center">
                    <div className="bg-pink-500 p-8 border-4 border-black dark:border-white/20 rotate-2 shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] transition-all">
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-white">Guest Notes</h2>
                    </div>
                    <div className="flex items-center gap-6 pt-4">
                        <Smile className="text-yellow-400 h-10 w-10 fill-yellow-400" />
                        <p className="text-xl font-bold uppercase tracking-tight max-w-xl">"Your words are the fuel for our celebration! Leave a fun message below."</p>
                        <Smile className="text-yellow-400 h-10 w-10 fill-yellow-400" />
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 bg-zinc-50 dark:bg-slate-900 p-12 md:p-16 border-4 border-black dark:border-white/20 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 transition-all">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.5em] italic">Post your wish</p>
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic font-sans leading-none dark:text-white transition-colors">Drop a Line!</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 font-sans italic">Name</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Your Awesome Name"
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-full px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#3b82f6] transition-all text-black dark:text-white placeholder:dark:text-slate-600"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 font-sans italic">Wish</label>
                                    <textarea
                                        required
                                        placeholder="Write something cool..."
                                        rows={4}
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-[2.5rem] px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#ec4899] transition-all resize-none text-black dark:text-white placeholder:dark:text-slate-600"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-6 rounded-full font-black uppercase tracking-[0.5em] text-xs transition-all shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 group active:scale-95 ${postSuccess ? 'bg-green-500 text-white' : 'bg-black dark:bg-slate-800 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isSending ? "POSTING..." : postSuccess ? "POSTED!" : "SEND WISH"}
                                {!postSuccess && <Send size={18} className="group-hover:translate-x-1" />}
                                {postSuccess && <Check size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-8 transition-colors">
                            <div className="flex items-center gap-4">
                                <Quote className="text-blue-600 h-10 w-10 rotate-180" strokeWidth={3} />
                                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-zinc-300">Archives — {wishes.length}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border-4 border-black rounded-2xl flex items-center justify-center hover:bg-yellow-400 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000]"
                                >
                                    <MoveLeft size={28} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border-4 border-black rounded-2xl flex items-center justify-center hover:bg-yellow-400 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000]"
                                >
                                    <MoveRight size={28} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-12">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className={`p-10 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[12px_12px_0_#3b82f6] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] space-y-8 animate-reveal transition-all hover:-translate-y-2 ${idx % 2 === 0 ? 'rotate-1 hover:shadow-[12px_12px_0_#ec4899]' : '-rotate-1 hover:shadow-[12px_12px_0_#fbd38d]'}`}>
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic dark:text-white transition-colors">"{wish.message}"</p>
                                        <div className="pt-6 border-t-2 border-zinc-100 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xl font-black uppercase tracking-tight text-blue-600">{wish.name}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">
                                                    {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <Smile className="text-pink-500 opacity-20 h-10 w-10" />
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
