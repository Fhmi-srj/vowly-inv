import * as React from "react";
import { useState, useEffect } from "react";
import {
    Send,
    CheckCircle2,
    Users,
    MoveRight,
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
        <section id="rsvp" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8d6e1c]/5 dark:bg-[#d4af37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <div className="space-y-20">
                        <div className="space-y-6">
                            <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 transition-colors duration-1000">Konfirmasi Kehadiran</p>
                            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/20 dark:to-white/20 transition-all duration-1000">RSVP</h2>
                        </div>

                        {submitted ? (
                            <div className="p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 bg-white/50 dark:bg-black/20 backdrop-blur-3xl rounded-none space-y-12 animate-reveal text-center relative overflow-hidden transition-all duration-1000">
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>

                                <CheckCircle2 className="text-[#d4af37] h-24 w-24 mx-auto" strokeWidth={1} />
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90 transition-colors duration-1000">Terima Kasih</h3>
                                    <p className="text-[#8d6e1c]/60 dark:text-[#d4af37]/60 font-serif italic text-lg leading-relaxed px-8 transition-colors duration-1000">Data kehadiran Anda telah kami simpan. Suatu kehormatan bagi kami atas kehadiran Anda.</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="text-[#8d6e1c] dark:text-[#d4af37] border-b border-[#8d6e1c]/20 dark:border-[#d4af37]/30 pb-1 text-[10px] font-bold uppercase tracking-widest hover:text-black dark:hover:text-white transition-all">Kirim Ulang</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d6e1c]/40 dark:text-[#d4af37]/40 ml-4 italic transition-colors duration-1000">Nama Lengkap</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="NAMA LENGKAP"
                                            className="w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic tracking-tight placeholder:text-[#8d6e1c]/20 dark:placeholder:text-[#d4af37]/10 text-black/80 dark:text-white focus:border-[#8d6e1c]/60 dark:focus:border-[#d4af37]/60 transition-all outline-none rounded-sm"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d6e1c]/40 dark:text-[#d4af37]/40 ml-4 italic transition-colors duration-1000">Pesan / Ucapan</label>
                                        <textarea
                                            rows={2}
                                            placeholder="TULIS PESAN ANDA..."
                                            className="w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic tracking-tight placeholder:text-[#8d6e1c]/20 dark:placeholder:text-[#d4af37]/10 text-black/80 dark:text-white focus:border-[#8d6e1c]/60 dark:focus:border-[#d4af37]/60 transition-all outline-none rounded-sm resize-none"
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
                                            className={`py-8 font-bold uppercase tracking-widest text-[9px] border transition-all rounded-sm ${formData.attendance === status
                                                ? 'bg-[#8d6e1c] dark:bg-[#d4af37] text-white dark:text-maroon-900 border-[#8d6e1c] dark:border-[#d4af37]'
                                                : 'bg-white dark:bg-black/20 text-[#8d6e1c]/40 dark:text-[#d4af37]/40 border-[#8d6e1c]/10 dark:border-[#d4af37]/10 hover:border-[#8d6e1c]/30 dark:hover:border-[#d4af37]/30'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Berhalangan').replace('HADIR', 'Akan Hadir')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-b from-[#8d6e1c] dark:from-[#d4af37] to-[#4a3a0a] dark:to-[#8d6e1c] text-white dark:text-maroon-900 py-8 font-bold uppercase tracking-[0.4em] text-[10px] hover:shadow-[0_0_40px_rgba(141,110,28,0.2)] dark:hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "MEMPROSES..." : "KONFIRMASI KEHADIRAN"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" size={16} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List Side */}
                    <div className="space-y-20 lg:pl-24">
                        <div className="flex md:justify-end items-end gap-6 text-right">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8d6e1c]/40 dark:text-[#d4af37]/40 transition-colors duration-1000">Total Konfirmasi</p>
                                <p className="text-7xl md:text-8xl font-serif italic tracking-tighter leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">{rsvps.length}</p>
                            </div>
                            <Users className="text-[#8d6e1c] dark:text-[#d4af37] h-14 w-14 opacity-10 dark:opacity-30 transition-all duration-1000" strokeWidth={1} />
                        </div>

                        <div className="space-y-4">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className="p-10 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white dark:bg-black/10 transition-all duration-700 hover:border-[#8d6e1c]/30 dark:hover:border-[#d4af37]/30 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#8d6e1c]/5 dark:bg-[#d4af37]/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#8d6e1c]/10 dark:group-hover:bg-[#d4af37]/10 transition-colors"></div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <h4 className="text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/80 transition-colors duration-1000">{rsvp.guest_name}</h4>
                                        <Heart size={16} className={rsvp.attendance === AttendanceStatus.HADIR ? "text-[#8d6e1c] dark:text-[#d4af37] fill-[#8d6e1c] dark:fill-[#d4af37]" : "text-black/10 dark:text-[#d4af37]/20"} />
                                    </div>
                                    <p className="text-[#8d6e1c]/40 dark:text-[#d4af37]/40 text-sm font-medium italic tracking-tight leading-relaxed line-clamp-2 mt-4 relative z-10 transition-colors duration-1000">"{rsvp.message || "Sebuah kehormatan dapat hadir."}"</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-12">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-14 h-14 font-serif italic text-xl transition-all border ${currentPage === i + 1 ? 'bg-[#8d6e1c] dark:bg-[#d4af37] text-white dark:text-maroon-900 border-[#8d6e1c] dark:border-[#d4af37] shadow-lg' : 'text-[#8d6e1c]/40 dark:text-[#d4af37]/40 border-[#8d6e1c]/10 dark:border-[#d4af37]/10 hover:border-[#8d6e1c]/30 dark:hover:border-[#d4af37]/30'}`}
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
