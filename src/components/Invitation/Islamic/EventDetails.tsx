import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Islamic Pattern Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <div className="w-12 h-px bg-[#c5a059]/40 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000">The Rangkaian</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic transition-colors duration-1000">Acara Kebahagiaan</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group animate-reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Sophisticated Card */}
                            <div className="absolute inset-0 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] shadow-sm transition-all duration-700 group-hover:shadow-xl group-hover:border-[#c5a059]/20"></div>

                            <div className="relative p-12 md:p-20 space-y-16 flex flex-col items-center text-center">
                                <div className="space-y-6">
                                    <div className="inline-block px-10 py-3 bg-[#fdfbf7] dark:bg-[#061a12] border border-[#c5a059]/20 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e] dark:text-white/80 mb-4 transition-colors duration-1000">
                                        {event.title}
                                    </div>
                                    <div className="w-12 h-px bg-[#c5a059]/20 mx-auto transition-colors duration-1000"></div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center gap-4 text-[#2d4a3e]/30 dark:text-white/30 transition-colors duration-1000">
                                            <Calendar size={18} strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Waktu & Tanggal</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-3xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white transition-colors duration-1000">{event.day}, {event.date}</p>
                                            <div className="flex items-center justify-center gap-3 text-lg font-bold uppercase tracking-widest text-[#c5a059] transition-colors duration-1000">
                                                <Clock size={18} strokeWidth={1.5} />
                                                <span>{event.startTime} — {event.endTime} WIB</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center gap-4 text-[#2d4a3e]/30 dark:text-white/30 transition-colors duration-1000">
                                            <MapPin size={18} strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Lokasi Acara</p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-2xl md:text-3xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 transition-colors duration-1000">{event.venue.name}</h4>
                                            <p className="text-xs md:text-sm text-[#2d4a3e]/40 dark:text-white/40 max-w-[320px] mx-auto leading-relaxed italic uppercase tracking-wider transition-colors duration-1000">{event.venue.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#2d4a3e]/5 dark:border-white/5 w-full flex justify-center transition-colors duration-1000">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group/btn flex items-center gap-4 px-10 py-5 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-white hover:bg-[#c5a059] dark:hover:bg-[#2d4a3e] transition-all shadow-md"
                                    >
                                        Petunjuk Peta <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[1em] text-[#2d4a3e]/20 dark:text-white/10 transition-colors duration-1000">— Syukron Jazakumullah Khairan —</p>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
