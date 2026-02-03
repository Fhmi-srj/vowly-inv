import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Users,
    MoveRight,
    Heart,
    Type,
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
        <section id="rsvp" className="bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-mono transition-colors duration-1000">
            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-20 animate-reveal">
                        <div className="space-y-6">
                            <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic italic">Transmission Protocol</p>
                            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-white/90 dark:text-[#d4c3a1]/90 transition-colors duration-1000 drop-shadow-2xl">Confirm</h2>
                        </div>

                        {submitted ? (
                            <div className="p-16 border-4 border-dashed border-[#f4ecd8]/10 dark:border-white/5 bg-black/10 dark:bg-white/5 rounded-sm space-y-12 animate-reveal text-center relative overflow-hidden transition-all duration-1000">
                                <CheckCircle2 className="text-[#c5a059] h-24 w-24 mx-auto opacity-60" strokeWidth={1} />
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-serif italic tracking-tight text-white/90">Signal Received</h3>
                                    <p className="text-[#f4ecd8]/40 font-mono text-xs uppercase leading-relaxed tracking-widest px-8">— Your attendance has been documented in the archives of time —</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold uppercase tracking-[0.5em] hover:text-white transition-all">Re-Transmit</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#f4ecd8]/20 dark:text-[#d4c3a1]/20 ml-4 italic transition-colors duration-1000">Operator Name</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="IDENTIFY YOURSELF..."
                                            className="w-full bg-black/20 dark:bg-white/5 border-b-2 border-[#f4ecd8]/10 dark:border-white/10 px-8 py-6 text-2xl font-mono italic tracking-tighter placeholder:text-[#f4ecd8]/5 focus:border-[#c5a059]/40 transition-all outline-none rounded-none text-[#f4ecd8] dark:text-[#d4c3a1]"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#f4ecd8]/20 dark:text-[#d4c3a1]/20 ml-4 italic transition-colors duration-1000">Short Telegram</label>
                                        <textarea
                                            rows={2}
                                            placeholder="WRITE MESSAGE..."
                                            className="w-full bg-black/20 dark:bg-white/5 border-b-2 border-[#f4ecd8]/10 dark:border-white/10 px-8 py-6 text-2xl font-mono italic tracking-tighter placeholder:text-[#f4ecd8]/5 focus:border-[#c5a059]/40 transition-all outline-none rounded-none resize-none text-[#f4ecd8] dark:text-[#d4c3a1]"
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
                                            className={`py-8 font-bold uppercase tracking-[0.4em] text-[9px] border-2 transition-all rounded-none ${formData.attendance === status
                                                ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-[10px_10px_0_rgba(0,0,0,0.2)]'
                                                : 'bg-black/10 text-[#f4ecd8]/20 border-[#f4ecd8]/5 hover:border-[#f4ecd8]/10'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Negative').replace('HADIR', 'Positive')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-[#f4ecd8] dark:bg-[#d4c3a1] text-[#333] py-8 font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-white transition-all shadow-[12px_12px_0_rgba(0,0,0,0.3)] flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "SEND SIGNAL"}
                                    <Send size={16} className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-20 lg:pl-24 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right border-x-4 border-[#f4ecd8]/5 dark:border-white/5 px-8 py-12 transition-colors duration-1000">
                            <p className="text-8xl font-serif italic tracking-tighter leading-none text-[#f4ecd8]/20 dark:text-[#d4c3a1]/20 transition-colors duration-1000">{rsvps.length}</p>
                            <div className="flex items-center gap-4 text-[#c5a059]/60">
                                <Users size={16} />
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Operators Checked-In</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="p-10 border border-[#f4ecd8]/5 dark:border-white/5 bg-black/5 dark:bg-white/5 rounded-none space-y-4 group hover:bg-black/20 dark:hover:bg-white/10 transition-all duration-700 relative overflow-hidden">
                                    <div className="flex justify-between items-center relative z-10">
                                        <h4 className="text-2xl font-serif italic tracking-tight text-white/50 dark:text-[#d4c3a1]/50 transition-colors duration-1000">{rsvp.guest_name}</h4>
                                        <Type size={14} className="text-[#c5a059]/20" />
                                    </div>
                                    <p className="text-[#f4ecd8]/20 dark:text-[#d4c3a1]/20 text-[11px] font-mono italic tracking-tighter leading-relaxed line-clamp-2 mt-4 relative z-10 uppercase transition-colors duration-1000">— "{rsvp.message || "Message not provided."}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center lg:justify-end gap-6 pt-12">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-12 h-12 font-mono text-sm transition-all border-2 ${currentPage === i + 1 ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg' : 'text-[#f4ecd8]/40 border-[#f4ecd8]/10 hover:border-[#f4ecd8]/30'}`}
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
