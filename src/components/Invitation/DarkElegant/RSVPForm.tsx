import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Users,
    MoveRight,
    Sparkles,
    Heart,
} from "lucide-react";
import { dbService } from "../../../services/dbService";
import { AttendanceStatus, type RSVP } from "../../../types";
import { useSettings } from "../../../contexts/SettingsContext";

const RSVPForm: React.FC = () => {
    const { invitationId } = useSettings();
    const [formData, setFormData] = useState({
        guest_name: "",
        phone: "",
        attendance: AttendanceStatus.HADIR,
        guest_count: 1,
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rsvpsPerPage = 5;

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
                ...formData
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

    const currentRSVPs = React.useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        return [...rsvps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    return (
        <section id="rsvp" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-20">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center">
                                    <Sparkles size={18} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.8em]">Registry of Presence</p>
                            </div>
                            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000">Guest Reception</h2>
                        </div>

                        {submitted ? (
                            <div className="p-16 border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] space-y-12 animate-reveal text-center transition-all duration-1000">
                                <CheckCircle2 className="text-emerald-500 h-24 w-24 mx-auto" strokeWidth={1} />
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-serif italic tracking-tight text-black dark:text-white transition-colors duration-1000">Entry Recorded</h3>
                                    <p className="text-black/40 dark:text-white/40 font-serif italic text-lg leading-relaxed transition-colors duration-1000">"Your confirmation has been whispered to the stars. We await your presence at the ceremony."</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="text-emerald-500 border-b border-emerald-500/30 pb-1 text-[10px] font-black uppercase tracking-widest hover:text-emerald-400 transition-all">Request Correction</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-8 italic">Your Formal Title</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="INPUT FULL NAME"
                                            className="w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic tracking-tight placeholder:text-black/10 dark:placeholder:text-white/10 text-black dark:text-white focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all outline-none"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-8 italic">Message for the Couple</label>
                                        <textarea
                                            rows={2}
                                            placeholder="A SHORT SENTIMENT..."
                                            className="w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-[2.5rem] px-12 py-8 text-2xl font-serif italic tracking-tight placeholder:text-black/10 dark:placeholder:text-white/10 text-black dark:text-white focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all outline-none resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, attendance: status })}
                                            className={`py-8 rounded-full font-black uppercase tracking-widest text-[10px] border transition-all ${formData.attendance === status
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                                : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Distantly Notified').replace('HADIR', 'Confirming Presence')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-500 text-white py-8 rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "PROCESSING ARCHIVES..." : "CONFIRM RECEIPT"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-20 lg:pl-24">
                        <div className="flex md:justify-end">
                            <div className="flex flex-col items-end gap-3">
                                <p className="text-8xl font-serif italic tracking-tighter leading-none text-black dark:text-white transition-colors duration-1000">{rsvps.length}</p>
                                <div className="flex items-center gap-4 text-emerald-500">
                                    <Users size={16} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Enrolled Guests</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="p-10 bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[3rem] space-y-6 group hover:border-emerald-500/20 transition-all duration-700">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/80 transition-colors duration-1000">{rsvp.guest_name}</h4>
                                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${rsvp.attendance === AttendanceStatus.HADIR ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-black/5 dark:border-white/5 text-black/20 dark:text-white/20'}`}>
                                            <Heart size={16} {... (rsvp.attendance === AttendanceStatus.HADIR ? { fill: 'currentColor' } : {})} />
                                        </div>
                                    </div>
                                    <p className="text-black/30 dark:text-white/30 text-sm font-medium italic tracking-tight leading-relaxed line-clamp-2 transition-colors duration-1000">"{rsvp.message || "A silent wish of joy."}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-12">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-14 h-14 font-serif italic text-xl transition-all border rounded-full ${currentPage === i + 1 ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20 shadow-xl' : 'text-black/20 dark:text-white/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RSVPForm;
