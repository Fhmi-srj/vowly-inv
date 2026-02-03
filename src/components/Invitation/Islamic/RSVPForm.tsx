import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Users,
    MoveRight,
    Heart,
    Star,
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
        <section id="rsvp" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a059]/5 dark:bg-[#c5a059]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-20 animate-reveal">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-4 text-[#c5a059] transition-colors duration-1000">
                                <Star size={18} strokeWidth={1} />
                                <p className="text-[10px] font-bold uppercase tracking-[0.8em]">Konfirmasi Kehadiran</p>
                            </div>
                            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000">Reservasi</h2>
                        </div>

                        {submitted ? (
                            <div className="p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] space-y-12 animate-reveal text-center shadow-sm relative overflow-hidden transition-all duration-700">
                                <CheckCircle2 className="text-[#2d4a3e] dark:text-white h-24 w-24 mx-auto opacity-80" strokeWidth={1} />
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white">Terima Kasih</h3>
                                    <p className="text-[#2d4a3e]/60 dark:text-white/60 font-serif italic text-lg leading-relaxed px-8 transition-colors duration-1000">Data kehadiran Anda telah kami simpan. Semoga Allah melimpahkan berkah-Nya.</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold uppercase tracking-widest hover:text-[#2d4a3e] dark:hover:text-white transition-all">Kirim Ulang</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d4a3e]/30 dark:text-white/30 ml-8 italic transition-colors duration-1000">Nama Tamu</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="NAMA LENGKAP"
                                            className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic tracking-tight placeholder:text-[#2d4a3e]/10 dark:placeholder:text-white/10 text-[#2d4a3e] dark:text-white focus:border-[#c5a059]/30 transition-all outline-none shadow-sm"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d4a3e]/30 dark:text-white/30 ml-8 italic transition-colors duration-1000">Salam & Doa</label>
                                        <textarea
                                            rows={2}
                                            placeholder="PESAN SINGKAT..."
                                            className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic tracking-tight placeholder:text-[#2d4a3e]/10 dark:placeholder:text-white/10 text-[#2d4a3e] dark:text-white focus:border-[#c5a059]/30 transition-all outline-none shadow-sm resize-none"
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
                                            className={`py-8 rounded-full font-bold uppercase tracking-widest text-[9px] border transition-all ${formData.attendance === status
                                                ? 'bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] border-[#2d4a3e] dark:border-[#c5a059] shadow-lg'
                                                : 'bg-white dark:bg-[#0c2c1e]/40 text-[#2d4a3e]/40 dark:text-white/30 border-[#2d4a3e]/5 dark:border-white/5 hover:border-[#2d4a3e]/10 dark:hover:border-white/10'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Insyaallah Berhalangan').replace('HADIR', 'Insyaallah Hadir')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-[#c5a059] text-white py-8 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-[#b08b45] transition-all shadow-xl flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "MENGIRIM..." : "KONFIRMASI KEHADIRAN"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-20 lg:pl-24 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
                            <p className="text-8xl font-serif italic tracking-tighter leading-none text-[#2d4a3e]/40 dark:text-white/20 transition-colors duration-1000">{rsvps.length}</p>
                            <div className="flex items-center gap-4 text-[#c5a059] transition-colors duration-1000">
                                <Users size={16} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Tamu Terdaftar</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="p-10 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3.5rem] space-y-6 group hover:border-[#c5a059]/20 transition-all duration-700 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a059]/5 dark:bg-[#c5a059]/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#c5a059]/10 transition-colors"></div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <h4 className="text-3xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 transition-colors duration-1000">{rsvp.guest_name}</h4>
                                        <Heart size={16} className={rsvp.attendance === AttendanceStatus.HADIR ? "text-[#c5a059] fill-[#c5a059]" : "text-[#2d4a3e]/10 dark:text-white/10"} />
                                    </div>
                                    <p className="text-[#2d4a3e]/40 dark:text-white/40 text-sm font-medium italic tracking-tight leading-relaxed line-clamp-2 mt-4 relative z-10 transition-colors duration-1000">"{rsvp.message || "Barakallahu lakum wa baraka 'alaikum."}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center lg:justify-end gap-4 pt-12">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-14 h-14 font-serif italic text-xl transition-all border rounded-full ${currentPage === i + 1 ? 'bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] border-[#2d4a3e] dark:border-[#c5a059] shadow-lg scale-110' : 'text-[#2d4a3e]/20 dark:text-white/20 border-[#2d4a3e]/5 dark:border-white/5 hover:border-[#2d4a3e]/10 hover:text-[#2d4a3e] dark:hover:text-white'}`}
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
