import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { dbService } from "../../../services/dbService";
import type { Wish } from "../../../types";
import {
    MoveRight,
    MoveLeft,
    Quote,
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
        <section id="wishes" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5 space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">Journal of Prayers</h2>
                            <div className="w-16 h-2 bg-black dark:bg-white transition-colors"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Leave your mark</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 bg-zinc-50 dark:bg-zinc-900 p-12 border border-zinc-100 dark:border-zinc-800 transition-colors">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contributor</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="YOUR NAME"
                                        className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                                    <textarea
                                        required
                                        placeholder="TYPE YOUR MESSAGE"
                                        rows={4}
                                        className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all resize-none text-black dark:text-white"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-6 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group active:scale-95"
                            >
                                {isSending ? "POSTING..." : "POST MESSAGE"}
                                <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="flex items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-8 transition-colors">
                            <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-300">Archives — {wishes.length}</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20"
                                >
                                    <MoveLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-12 h-12 border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20"
                                >
                                    <MoveRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-12">
                            {currentWishes.map(wish => (
                                <div key={wish.id} className="relative space-y-8 animate-reveal">
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic">"{wish.message}"</p>
                                        <div className="flex items-center gap-12">
                                            <div className="h-px w-12 bg-black dark:bg-white transition-colors"></div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black uppercase tracking-tight">{wish.name}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
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
