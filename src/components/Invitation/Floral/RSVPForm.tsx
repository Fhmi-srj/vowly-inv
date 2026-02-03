import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Heart,
    Users,
    Clock,
    RefreshCcw,
    Minus,
    Plus,
    Smile,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { dbService } from "../../../services/dbService";
import { AttendanceStatus, type RSVP } from "../../../types";
import { MAX_GUESTS } from "../../../constants";
import StickerPicker from "../Shared/StickerPicker";
import { useSettings } from "../../../contexts/SettingsContext";

const RSVPForm: React.FC = () => {
    const { invitationId } = useSettings();
    const [formData, setFormData] = useState({
        guest_name: "",
        phone: "",
        attendance: AttendanceStatus.HADIR,
        guest_count: 1,
        message: "",
        sticker: null as { id: string; src: string } | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rsvpsPerPage = 6;
    const [showStickerPicker, setShowStickerPicker] = useState(false);

    const loadRSVPs = async () => {
        if (!invitationId) return;
        const data = await dbService.getRSVPs(invitationId);
        setRsvps(data);
    };

    useEffect(() => {
        if (!invitationId) return;

        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) {
            setFormData((prev) => ({ ...prev, guest_name: to }));
            setIsNameLocked(true);
        }
        loadRSVPs();
    }, [invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !invitationId) return;

        setIsSubmitting(true);
        try {
            await dbService.saveRSVP(invitationId, {
                ...formData,
                sticker: formData.sticker?.id || undefined,
            });
            setSubmitted(true);
            await loadRSVPs();
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = {
        hadir: rsvps
            .filter((r) => r.attendance === AttendanceStatus.HADIR)
            .reduce((total, r) => total + (r.guest_count || 1), 0),
        ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
        tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR)
            .length,
    };

    const currentRSVPs = React.useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        const sorted = [...rsvps].sort(
            (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
        );
        return sorted.slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    return (
        <section id="rsvp" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Soft Floral Splash Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd1dc] opacity-20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffe4e1] opacity-20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-14 relative overflow-hidden transition-all duration-1000">
                            <div className="space-y-4">
                                <Heart className="text-[#db7093] h-6 w-6 fill-[#db7093] opacity-20" />
                                <h2 className="font-serif text-5xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Confirmation</h2>
                                <p className="text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase italic transition-colors">Please let us know if you can attend</p>
                            </div>

                            {submitted ? (
                                <div className="text-center py-10 space-y-8 animate-reveal">
                                    <CheckCircle2 className="text-[#db7093] h-20 w-20 mx-auto opacity-30" />
                                    <h3 className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">Thank You So Much!</h3>
                                    <p className="text-slate-400 dark:text-stone-400 italic transition-colors">Your response has been recorded beautifully.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[#db7093] text-[10px] font-black tracking-widest uppercase border-b border-[#ffd1dc] pb-2">Send another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Full Name</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                className="w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-full px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#ffd1dc]/20 outline-none transition-all"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Message for the Couple</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-[2rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#ffd1dc]/20 outline-none transition-all resize-none"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Attendance Status</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, attendance: status })}
                                                    className={`flex flex-col items-center gap-2 py-6 rounded-[2rem] border transition-all ${formData.attendance === status
                                                        ? 'bg-[#db7093] dark:bg-[#ff8da1] border-[#db7093] dark:border-[#ff8da1] text-white dark:text-slate-900 shadow-lg'
                                                        : 'bg-white dark:bg-slate-800 border-[#ffd1dc]/30 dark:border-white/10 text-[#db7093] dark:text-[#ff8da1]'
                                                        }`}
                                                >
                                                    <span className="text-[9px] font-black tracking-widest uppercase">{status.replace('TIDAK_HADIR', 'No').replace('HADIR', 'Yes').replace('RAGU', 'Maybe')}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#db7093] text-white py-6 rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 flex items-center justify-center gap-4"
                                    >
                                        {isSubmitting ? "Sending..." : "Submit Response"}
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16">
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: "Attending", count: stats.hadir, color: "text-[#db7093]" },
                                { label: "Unsure", count: stats.ragu, color: "text-slate-400" },
                                { label: "Absent", count: stats.tidak, color: "text-pink-200" }
                            ].map((stat, i) => (
                                <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-[#ffd1dc]/20 dark:border-white/5 text-center space-y-3 shadow-xl group hover:-translate-y-2 transition-all duration-500">
                                    <p className={`font-serif text-5xl md:text-7xl font-bold ${stat.color}`}>{stat.count}</p>
                                    <p className="text-[10px] font-black tracking-[0.2em] text-[#db7093] uppercase italic">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-center gap-4 py-8">
                                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#ffd1dc]"></div>
                                <Users className="text-[#db7093] h-6 w-6 opacity-30" />
                                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#ffd1dc]"></div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {currentRSVPs.map(rsvp => (
                                    <div key={rsvp.id} className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg space-y-4 hover:shadow-2xl transition-all duration-500">
                                        <div className="flex items-center justify-between">
                                            <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{rsvp.guest_name}</p>
                                            <Heart className={`h-4 w-4 ${rsvp.attendance === AttendanceStatus.HADIR ? 'fill-[#db7093] text-[#db7093]' : 'text-slate-200'}`} />
                                        </div>
                                        <p className="text-slate-400 text-sm italic leading-relaxed">"{rsvp.message || "Sending love..."}"</p>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-3 pt-12">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 rounded-full font-serif text-xl border transition-all ${currentPage === i + 1 ? 'bg-[#db7093] text-white border-[#db7093] shadow-lg' : 'text-[#db7093] border-[#ffd1dc] hover:bg-[#fffafa]'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RSVPForm;
