import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Heart,
    Users,
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
        <section id="rsvp" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-800"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Confirmation</p>
                            <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">Are You <br /> Coming?</h2>
                        </div>

                        {submitted ? (
                            <div className="p-12 border border-zinc-800 bg-zinc-900/50 space-y-8 animate-reveal">
                                <CheckCircle2 className="text-white h-16 w-16" />
                                <h3 className="text-4xl font-black uppercase tracking-tighter">Response Recorded</h3>
                                <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest leading-loose">Thank you for your response. We have added your name to our guest list session.</p>
                                <button onClick={() => setSubmitted(false)} className="text-white border-b-2 border-white pb-1 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400 hover:border-zinc-400 transition-all">Send another response</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="INPUT FULL NAME"
                                            className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Statement</label>
                                        <textarea
                                            rows={2}
                                            placeholder="LEAVE A SHORT MESSAGE"
                                            className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, attendance: status })}
                                            className={`py-8 font-black uppercase tracking-widest text-[10px] border-2 transition-all ${formData.attendance === status
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Absent').replace('HADIR', 'Attending')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black py-8 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "PROCESSING..." : "SUBMIT RESPONSE"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-16">
                        <div className="flex md:justify-end">
                            <div className="flex items-center gap-8">
                                <div className="space-y-1 text-right">
                                    <p className="text-4xl font-black tracking-tighter">{rsvps.length}</p>
                                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Responses</p>
                                </div>
                                <Users className="text-zinc-800 h-12 w-12" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="p-10 border border-zinc-800 hover:border-zinc-500 transition-all space-y-6 group bg-zinc-900/10">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-2xl font-black uppercase tracking-tighter">{rsvp.guest_name}</h4>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                            {rsvp.attendance.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-tight leading-relaxed line-clamp-2">"{rsvp.message || "No message provided."}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 pt-8">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-12 h-12 font-black uppercase text-[10px] transition-all border ${currentPage === i + 1 ? 'bg-white text-black border-white' : 'text-zinc-600 border-zinc-900 hover:border-zinc-700'}`}
                                    >
                                        0{i + 1}
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
