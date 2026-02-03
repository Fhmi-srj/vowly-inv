import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Heart,
    Users,
    Clock,
    Sun,
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
        <section id="rsvp" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Decor Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#8a9a5b]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/30 dark:border-white/5 shadow-2xl space-y-14 relative group overflow-hidden transition-all duration-1000">
                            <div className="space-y-4">
                                <Sun className="text-[#c19a6b] h-6 w-6 opacity-30 animate-spin-slow" />
                                <h2 className="font-serif text-5xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Will You Join Us?</h2>
                                <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">RSVP Online</p>
                            </div>

                            {submitted ? (
                                <div className="text-center py-10 space-y-8 animate-reveal">
                                    <CheckCircle2 className="text-[#e2725b] h-20 w-20 mx-auto opacity-30" />
                                    <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors">Wonderful!</h3>
                                    <p className="text-slate-400 dark:text-stone-400 italic transition-colors">Your presence will fill our hearts with joy.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[#e2725b] text-[10px] font-black tracking-widest uppercase border-b-2 border-[#e2725b]/20 pb-1">Reset Form</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Full Name</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                className="w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-3xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all shadow-inner"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Prayer or Message</label>
                                            <textarea
                                                rows={4}
                                                className="w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all resize-none shadow-inner"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Are you joining?</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, attendance: status })}
                                                    className={`flex items-center justify-between px-10 py-5 rounded-3xl border transition-all duration-500 ${formData.attendance === status
                                                        ? 'bg-[#e2725b] border-[#e2725b] text-white shadow-xl translate-x-2'
                                                        : 'bg-white dark:bg-stone-800 border-[#c19a6b]/20 dark:border-white/5 text-[#c19a6b] dark:text-stone-400 hover:bg-[#faf7f2] dark:hover:bg-stone-700'
                                                        }`}
                                                >
                                                    <span className="text-[10px] font-black tracking-widest uppercase">{status.replace('TIDAK_HADIR', 'Cannot Attend').replace('HADIR', 'Confirm Presence').replace('RAGU', 'Maybe Later')}</span>
                                                    {formData.attendance === status && <Heart size={16} className="fill-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase hover:bg-[#e2725b] transition-all shadow-2xl flex items-center justify-center gap-4 duration-500"
                                    >
                                        {isSubmitting ? "Sending..." : "Submit Reservation"}
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
                                { label: "Joined", count: stats.hadir, color: "text-[#e2725b]" },
                                { label: "Uncertain", count: stats.ragu, color: "text-[#c19a6b]" },
                                { label: "Absent", count: stats.tidak, color: "text-slate-300" }
                            ].map((stat, i) => (
                                <div key={i} className="p-12 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 text-center space-y-2 shadow-2xl transition-all duration-1000">
                                    <p className={`font-serif text-5xl md:text-8xl font-black tracking-tighter ${stat.color}`}>{stat.count}</p>
                                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-6 px-4">
                                <p className="text-[11px] font-black text-[#e2725b] tracking-widest uppercase">Community Attendance</p>
                                <div className="h-px flex-grow bg-gradient-to-r from-[#e2725b]/40 to-transparent"></div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {currentRSVPs.map(rsvp => (
                                    <div key={rsvp.id} className="p-10 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-lg space-y-5 hover:scale-[1.02] transition-all duration-500">
                                        <div className="flex items-center justify-between">
                                            <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{rsvp.guest_name}</p>
                                            <div className={`w-3 h-3 rounded-full ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-[#e2725b]' : 'bg-slate-200'}`}></div>
                                        </div>
                                        <p className="text-slate-400 dark:text-stone-400 text-lg font-serif italic leading-relaxed transition-colors">"{rsvp.message || "Blessings..."}"</p>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-4 pt-10">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-14 h-14 rounded-2xl font-serif text-2xl transition-all duration-500 ${currentPage === i + 1 ? 'bg-[#e2725b] text-white shadow-2xl -translate-y-2' : 'text-[#c19a6b] dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 border border-[#c19a6b]/20 dark:border-white/5'}`}
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
