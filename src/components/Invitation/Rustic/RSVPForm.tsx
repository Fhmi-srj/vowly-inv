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
    const rsvpsPerPage = 10;
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

    const handleGuestCount = (operation: "inc" | "dec") => {
        setFormData((prev) => {
            const current = prev.guest_count;
            let next = current;
            if (operation === "inc" && current < MAX_GUESTS) next = current + 1;
            if (operation === "dec" && current > 1) next = current - 1;
            return { ...prev, guest_count: next };
        });
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

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="rsvp" className="bg-[#fdfaf7] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-10 relative overflow-hidden transition-all duration-1000">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a386]/5 rounded-bl-full pointer-events-none"></div>

                            <div className="space-y-4">
                                <Heart className="text-[#c5a386] h-6 w-6" />
                                <h2 className="font-serif text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Reservasi</h2>
                                <p className="text-xs font-bold text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Konfirmasi Kehadiran</p>
                            </div>

                            {submitted ? (
                                <div className="text-center py-10 space-y-6 animate-reveal">
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="font-serif text-3xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Terima Kasih!</h3>
                                    <p className="text-slate-500 dark:text-stone-400 italic transition-colors">Data Anda telah kami simpan.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[#8c7851] text-xs font-bold tracking-widest uppercase underline underline-offset-4">Isi Kembali</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Nama Lengkap</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                className="w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-serif text-xl italic text-[#4a3f35] dark:text-stone-200 focus:ring-2 focus:ring-[#c5a386] outline-none transition-all"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Pesan (Opsional)</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-serif text-xl italic text-[#4a3f35] dark:text-stone-200 focus:ring-2 focus:ring-[#c5a386] outline-none transition-all resize-none"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Kehadiran</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, attendance: status })}
                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${formData.attendance === status
                                                        ? 'bg-[#4a3f35] dark:bg-stone-200 border-[#4a3f35] dark:border-stone-200 text-white dark:text-slate-900'
                                                        : 'bg-white dark:bg-slate-800 border-[#d9c5b2] dark:border-white/5 text-[#8c7851] dark:text-stone-400'
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold tracking-widest uppercase">{status.replace('_', ' ')}</span>
                                                    {formData.attendance === status && <CheckCircle2 size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#8c7851] text-white py-5 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#4a3f35] transition-all shadow-xl shadow-[#8c7851]/20 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                                        <Send size={16} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Hadir", count: stats.hadir, bg: "bg-[#4a3f35] text-white" },
                                { label: "Ragu", count: stats.ragu, bg: "bg-white dark:bg-slate-800 text-[#8c7851] dark:text-stone-400" },
                                { label: "Absen", count: stats.tidak, bg: "bg-white dark:bg-slate-800 text-red-400" }
                            ].map((stat, i) => (
                                <div key={i} className={`p-6 md:p-10 rounded-[2.5rem] border border-[#d9c5b2] text-center space-y-2 shadow-lg ${stat.bg}`}>
                                    <p className="font-serif text-3xl md:text-5xl font-bold">{stat.count}</p>
                                    <p className="text-[9px] font-black tracking-widest uppercase opacity-60">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] border border-[#d9c5b2] dark:border-white/5 shadow-xl space-y-12 transition-all duration-1000">
                            <div className="flex items-center justify-between border-b border-[#f4ebe1] pb-8">
                                <h3 className="font-serif text-3xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Daftar Kehadiran</h3>
                                <Users className="text-[#c5a386] h-6 w-6" />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {currentRSVPs.map(rsvp => (
                                    <div key={rsvp.id} className="p-6 bg-[#f9f5f0] dark:bg-slate-800 rounded-2xl space-y-3 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <p className="font-serif text-xl text-[#4a3f35] dark:text-stone-200 italic truncate max-w-[150px] transition-colors">{rsvp.guest_name}</p>
                                            <span className={`text-[8px] font-black tracking-widest uppercase ${rsvp.attendance === AttendanceStatus.HADIR ? 'text-green-600' : 'text-slate-400'}`}>
                                                {rsvp.attendance.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-stone-400 italic line-clamp-2 transition-colors">"{rsvp.message || "Eshari bersama..."}"</p>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 pt-8">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-10 h-10 rounded-full font-serif text-lg transition-all ${currentPage === i + 1 ? 'bg-[#4a3f35] text-white shadow-lg' : 'text-[#8c7851] hover:bg-[#f9f5f0]'}`}
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
