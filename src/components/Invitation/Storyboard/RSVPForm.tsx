import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Users,
    MoveRight,
    Heart,
    MessageSquare,
    Zap,
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
        <section id="rsvp" className="bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.1] bg-[radial-gradient(#2196f3_2px,transparent_2px)] dark:bg-[radial-gradient(#ff4081_2px,transparent_2px)] [background-size:30px_30px] transition-all duration-700"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-20 animate-reveal">
                        <div className="space-y-6">
                            <div className="inline-block bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] px-8 py-2 border-[3px] border-[#2d2d2d] dark:border-white shadow-[6px_6px_0_#2d2d2d] dark:shadow-[6px_6px_0_#ff4081] transform -rotate-2 transition-all duration-700">
                                <p className="tracking-[0.6em] text-[10px] font-black uppercase">ACTION REQUIRED</p>
                            </div>
                            <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 transition-colors duration-700">RSVP!</h2>
                        </div>

                        {submitted ? (
                            <div className="p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white rounded-none shadow-[15px_15px_0_#2196f3] dark:shadow-[15px_15px_0_#ff4081] space-y-12 animate-reveal text-center relative overflow-hidden group transition-all duration-700">
                                <div className="absolute top-4 right-4 text-[#ffeb3b] animate-bounce">
                                    <Zap size={40} fill="currentColor" />
                                </div>
                                <CheckCircle2 className="text-[#2196f3] h-24 w-24 mx-auto" strokeWidth={3} />
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-black italic uppercase italic tracking-tight text-[#2d2d2d] dark:text-white">Signal Received!</h3>
                                    <p className="text-[#2d2d2d]/60 dark:text-white/60 font-bold uppercase tracking-widest text-xs px-8 transition-colors">YOU'VE BEEN SUCCESSFULLY ADDED TO THE CAST LIST!</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="text-[#ff4081] dark:text-[#00e5ff] border-b-2 border-[#ff4081] dark:border-[#00e5ff] pb-1 text-[10px] font-black uppercase tracking-widest hover:text-[#2d2d2d] dark:hover:text-white hover:border-[#2d2d2d] dark:hover:border-white transition-all">TRY AGAIN?</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#2d2d2d]/40 dark:text-white/40 ml-4 italic transition-colors">Character Name</label>
                                        <div className="relative">
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                placeholder="WHO ARE YOU?"
                                                className="w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white px-10 py-6 text-2xl font-black italic tracking-tighter placeholder:text-[#2d2d2d]/10 dark:placeholder:text-white/10 focus:shadow-[8px_8px_0_#ffeb3b] dark:focus:shadow-[8px_8px_0_#00e5ff] transition-all outline-none rounded-none uppercase text-[#2d2d2d] dark:text-white"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#2d2d2d]/40 dark:text-white/40 ml-4 italic transition-colors">Your Quote (Message)</label>
                                        <div className="relative group">
                                            <textarea
                                                rows={2}
                                                placeholder="SPEAK YOUR MIND..."
                                                className="w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white px-10 py-6 text-2xl font-black italic tracking-tighter placeholder:text-[#2d2d2d]/10 dark:placeholder:text-white/10 focus:shadow-[8px_8px_0_#ff4081] dark:focus:shadow-[8px_8px_0_#00e5ff] transition-all outline-none rounded-none resize-none uppercase text-[#2d2d2d] dark:text-white"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                            <MessageSquare className="absolute -top-4 -right-4 text-[#ffeb3b] dark:text-[#00e5ff] opacity-0 group-hover:opacity-100 transition-opacity" size={24} fill="currentColor" stroke="#2d2d2d" strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, attendance: status })}
                                            className={`py-8 font-black uppercase tracking-[0.4em] text-[10px] border-[4px] border-[#2d2d2d] dark:border-white transition-all rounded-none transform ${formData.attendance === status
                                                ? 'bg-[#ffeb3b] dark:bg-[#00e5ff] text-[#2d2d2d] shadow-[10px_10px_0_#2d2d2d] dark:shadow-[10px_10px_0_#ff4081] -translate-x-1 -translate-y-1'
                                                : 'bg-white dark:bg-transparent text-[#2d2d2d]/30 dark:text-white/30 hover:shadow-[5px_5px_0_rgba(0,0,0,0.1)]'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'SORRY, BUSY!').replace('HADIR', "COUNT ME IN!")}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-[#ff4081] dark:bg-[#ff4081] text-white py-8 font-black uppercase tracking-[0.5em] text-[12px] border-[4px] border-[#2d2d2d] dark:border-white shadow-[12px_12px_0_#2d2d2d] dark:shadow-[12px_12px_0_#00e5ff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "SUBMIT LOG"}
                                    <Zap size={20} className="fill-white group-hover:animate-ping" strokeWidth={3} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-20 lg:pl-24 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
                            <div className="relative">
                                <p className="text-9xl font-black italic tracking-tighter leading-none text-[#2196f3] dark:text-[#00e5ff] transform -skew-x-12 drop-shadow-[10px_10px_0_#ffeb3b] dark:drop-shadow-[10px_10px_0_#ff4081] transition-all duration-700">{rsvps.length}</p>
                                <div className="absolute -top-4 -left-8 bg-[#ff4081] text-white px-6 py-2 border-[3px] border-[#2d2d2d] dark:border-white rotate-[-15deg] font-black text-xs uppercase shadow-[4px_4px_0_#2d2d2d] dark:shadow-[4px_4px_0_#00e5ff] transition-all">JOINED!</div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="relative p-10 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white rounded-none group hover:shadow-[10px_10px_0_#ffeb3b] dark:hover:shadow-[10px_10px_0_#00e5ff] transition-all duration-700">
                                    <div className="flex justify-between items-center relative z-10">
                                        <h4 className="text-3xl font-black italic text-[#2d2d2d] dark:text-white uppercase transform -skew-x-6 transition-colors">{rsvp.guest_name}</h4>
                                        <Heart size={20} className={rsvp.attendance === AttendanceStatus.HADIR ? "text-[#ff4081] fill-[#ff4081]" : "text-[#2d2d2d]/10 dark:text-white/10"} strokeWidth={3} />
                                    </div>
                                    <div className="mt-6 p-6 bg-[#fdfaf0] dark:bg-black/20 border-[2px] border-[#2d2d2d] dark:border-white/20 relative group-hover:bg-[#2196f3]/5 dark:group-hover:bg-[#00e5ff]/5 transition-colors">
                                        <p className="text-[#2d2d2d]/60 dark:text-white/60 text-sm font-black italic tracking-tight leading-relaxed line-clamp-2 uppercase transition-colors">— "{rsvp.message || "NO QUOTES PROVIDED."}"</p>
                                        {/* Comic Tail */}
                                        <div className="absolute -top-[10px] left-10 w-4 h-4 bg-white dark:bg-[#1a1a2e] border-l-[2px] border-t-[2px] border-[#2d2d2d] dark:border-white rotate-45 group-hover:bg-[#ebf5fe] dark:group-hover:bg-[#00e5ff]/5 transition-colors"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center lg:justify-end gap-6 pt-12">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-14 h-14 font-black italic text-xl transition-all border-[4px] border-[#2d2d2d] dark:border-white ${currentPage === i + 1 ? 'bg-[#ffeb3b] dark:bg-[#00e5ff] text-[#2d2d2d] shadow-[6px_6px_0_#2d2d2d] dark:shadow-[6px_6px_0_#ff4081] -translate-x-1 -translate-y-1' : 'bg-white dark:bg-transparent text-[#2d2d2d]/20 dark:text-white/20 hover:text-[#2d2d2d] dark:hover:text-white'}`}
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
