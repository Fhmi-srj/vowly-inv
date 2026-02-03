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
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#f9f5f0] dark:from-slate-900 to-transparent transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-6xl relative z-10 space-y-24">
                <div className="text-center space-y-6">
                    <Quote className="text-[#c5a386] h-12 w-12 mx-auto opacity-30" />
                    <h2 className="font-serif text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">Doa & Harapan</h2>
                    <div className="w-24 h-[1px] bg-[#d9c5b2] mx-auto"></div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Wrapper */}
                    <div className="lg:col-span-4 bg-[#f9f5f0] dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-[#d9c5b2] dark:border-white/5 shadow-xl space-y-12 transition-all duration-1000">
                        <div className="space-y-2">
                            <h3 className="font-serif text-3xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Kirim Doa</h3>
                            <p className="text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Buku Tamu Digital</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="group relative">
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Nama Anda"
                                        className="w-full bg-transparent border-b border-[#d9c5b2] dark:border-white/10 py-4 font-serif text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none placeholder:text-slate-300 dark:placeholder:text-stone-600 transition-all focus:border-[#4a3f35] dark:focus:border-stone-200"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="group relative">
                                    <textarea
                                        required
                                        placeholder="Tulis ucapan..."
                                        rows={4}
                                        className="w-full bg-transparent border-b border-[#d9c5b2] dark:border-white/10 py-4 font-serif text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none placeholder:text-slate-300 dark:placeholder:text-stone-600 transition-all focus:border-[#4a3f35] dark:focus:border-stone-200 resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-3 ${postSuccess ? 'bg-green-500 text-white' : 'bg-[#4a3f35] dark:bg-stone-200 text-white dark:text-slate-900 hover:bg-[#8c7851] dark:hover:bg-white'
                                    }`}
                            >
                                {isSending ? "Mengirim..." : postSuccess ? "Berhasil!" : "Kirim Ucapan"}
                                {!postSuccess && <Send size={16} />}
                                {postSuccess && <Check size={16} />}
                            </button>
                        </form>
                    </div>

                    {/* List Wrapper */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {currentWishes.map(wish => (
                                <div key={wish.id} className="relative group">
                                    <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-[#f4ebe1] dark:border-white/5 rounded-[2.5rem] shadow-md transition-all group-hover:shadow-xl group-hover:border-[#d9c5b2] dark:group-hover:border-stone-700"></div>
                                    <div className="relative p-10 space-y-6 flex flex-col h-full">
                                        <Quote className="text-[#c5a386] h-6 w-6 opacity-20" />
                                        <p className="font-serif text-2xl text-[#4a3f35] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors">"{wish.message}"</p>
                                        <div className="pt-6 border-t border-[#f9f5f0] space-y-1">
                                            <p className="text-[10px] font-black tracking-widest text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">{wish.name}</p>
                                            <p className="text-[9px] text-slate-400 italic">
                                                {new Date(wish.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 rounded-full border border-[#d9c5b2] flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-4 px-6 bg-[#f9f5f0] dark:bg-slate-900 rounded-full text-[#8c7851] dark:text-[#c5a386] font-serif text-lg italic transition-colors">
                                    <span>{currentPage}</span>
                                    <span className="opacity-30">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-12 h-12 rounded-full border border-[#d9c5b2] flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]"
                                >
                                    <ChevronRight size={20} />
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
