import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8d6e1c]/10 dark:via-[#d4af37]/30 to-transparent transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center opacity-50">
                        <Calendar size={24} strokeWidth={1} />
                    </div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000">Momentum</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000">Agenda Perayaan Suci</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group">
                            {/* Royal Ornament Card */}
                            <div className="absolute inset-0 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 bg-white dark:bg-black/20 backdrop-blur-xl transition-all duration-700 group-hover:bg-[#8d6e1c]/5 dark:group-hover:bg-[#d4af37]/5 group-hover:border-[#8d6e1c]/50 dark:group-hover:border-[#d4af37]/50 rounded-lg"></div>

                            <div className="relative p-12 md:p-20 space-y-16 flex flex-col items-center text-center">
                                <div className="space-y-6">
                                    <div className="inline-block px-8 py-2 border border-[#8d6e1c]/30 dark:border-[#d4af37]/30 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-[#8d6e1c]/80 dark:text-[#d4af37]/80 mb-4 transition-colors duration-1000">
                                        {event.title}
                                    </div>
                                    <div className="h-[1px] w-20 bg-[#8d6e1c]/10 dark:bg-[#d4af37]/30 mx-auto transition-colors duration-1000"></div>
                                </div>

                                <div className="space-y-12 w-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-4 text-white/40">
                                            <Calendar size={18} strokeWidth={1.5} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Waktu Pelaksanaan</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-3xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90 transition-colors duration-1000">{event.day}, {event.date}</p>
                                            <div className="flex items-center justify-center gap-3 text-xl font-bold uppercase tracking-widest text-[#8d6e1c]/70 dark:text-[#d4af37]/70 transition-colors duration-1000">
                                                <Clock size={20} strokeWidth={1.5} />
                                                <span>{event.startTime} — {event.endTime} WIB</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center gap-4 text-white/40">
                                            <MapPin size={18} strokeWidth={1.5} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Lokasi Acara</p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/80 transition-colors duration-1000">{event.venue.name}</h4>
                                            <p className="text-xs md:text-sm text-[#8d6e1c]/40 dark:text-[#d4af37]/40 max-w-[350px] mx-auto leading-relaxed italic uppercase tracking-wider transition-colors duration-1000">{event.venue.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#d4af37]/10 w-full flex justify-center">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group/btn flex items-center gap-4 px-10 py-4 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 rounded-md text-[10px] font-bold tracking-[0.3em] uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 hover:bg-[#8d6e1c] dark:hover:bg-[#d4af37] hover:text-white dark:hover:text-maroon-900 transition-all"
                                    >
                                        Petunjuk Peta <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[1em] text-[#d4af37]/20">A Royal Heritage Experience</p>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
