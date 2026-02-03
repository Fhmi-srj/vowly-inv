import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Heart,
    Users,
    Smile,
    MoveRight,
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
        <section id="rsvp" className="bg-[#fafafa] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000">
            {/* Playful Shapes */}
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-yellow-400 -translate-x-1/2 rotate-45 opacity-20"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest -rotate-2">
                                <Smile size={18} /> Let's RSVP!
                            </div>
                            <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.8] dark:text-white transition-colors">Join <br /> The Bash</h2>
                            <p className="text-xl font-bold uppercase tracking-tight text-zinc-400">Confirm your presence for the most exciting night of our lives.</p>
                        </div>

                        {submitted ? (
                            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[3.5rem] shadow-[20px_20px_0_#ec4899] space-y-10 animate-reveal transition-all">
                                <CheckCircle2 className="text-blue-600 h-20 w-20 mx-auto" strokeWidth={3} />
                                <div className="text-center space-y-4">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white transition-colors">Total Success!</h3>
                                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-8">Your response has been added to our guest list. We are thrilled to see you!</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="w-full bg-black dark:bg-slate-800 text-white py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic">Who are you?</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="INPUT YOUR AWESOME NAME"
                                            className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#3b82f6] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] text-black dark:text-white"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic">Any words?</label>
                                        <textarea
                                            rows={2}
                                            placeholder="SEND A FUN MESSAGE!"
                                            className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#ec4899] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] resize-none text-black dark:text-white"
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
                                            className={`py-8 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-4 border-black dark:border-white/20 transition-all shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] active:translate-y-1 active:shadow-none ${formData.attendance === status
                                                ? 'bg-yellow-400 text-black shadow-[6px_6px_0_#3b82f6]'
                                                : 'bg-white dark:bg-slate-800 text-zinc-400'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Cannot Come').replace('HADIR', 'Confirming!')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-8 rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-black dark:hover:bg-slate-800 transition-all shadow-[12px_12px_0_#fbd38d] hover:shadow-[12px_12px_0_#ec4899] flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "PROCESSING..." : "SUBMIT TICKET"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-16">
                        <div className="flex md:justify-end">
                            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-8 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] flex items-center gap-8 -rotate-1 transition-all">
                                <div className="text-right">
                                    <p className="text-6xl font-black tracking-tighter leading-none dark:text-white">{rsvps.length}</p>
                                    <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Confirmed Guests</p>
                                </div>
                                <Users className="text-blue-600 h-14 w-14" strokeWidth={3} />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className={`p-8 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2.5rem] shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] space-y-5 group hover:-translate-y-2 transition-all ${Math.random() > 0.5 ? 'rotate-1' : '-rotate-1'}`}>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-2xl font-black uppercase tracking-tighter truncate max-w-[150px] dark:text-white transition-colors">{rsvp.guest_name}</h4>
                                        <div className={`w-8 h-8 rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-pink-500' : 'bg-zinc-100 dark:bg-slate-800'}`}>
                                            <Heart size={14} className="text-white fill-white" />
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-xs font-black uppercase tracking-tight line-clamp-2 leading-relaxed italic">"{rsvp.message || "Sending hugs!"}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-8">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-14 h-14 font-black uppercase text-xl transition-all border-4 border-black dark:border-white/20 rounded-2xl ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.1)] -translate-y-1' : 'bg-white dark:bg-slate-900 text-zinc-400 hover:bg-yellow-400 hover:text-black'}`}
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
