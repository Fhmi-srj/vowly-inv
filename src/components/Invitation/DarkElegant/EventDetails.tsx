import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { ArrowUpRight, Calendar, MapPin, Clock } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Atmospheric Accents */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-12">
                    <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Ceremony</h2>
                    <div className="space-y-3 text-left md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500">The Schedule</p>
                        <p className="text-xl font-serif italic tracking-tight text-black/40 dark:text-white/40 transition-colors duration-1000">Points of destination for our union.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="group relative">
                            {/* Glass Card */}
                            <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all duration-700 group-hover:bg-emerald-500/5 group-hover:border-emerald-500/20 shadow-2xl"></div>

                            <div className="relative p-12 md:p-20 space-y-16">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.5em]">Session_{idx + 1}</span>
                                        <h3 className="text-5xl md:text-6xl font-serif italic tracking-tighter leading-none text-black dark:text-white transition-colors duration-1000">{event.title}</h3>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-emerald-500 animate-pulse transition-all">
                                        <Clock size={28} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-white/20">
                                            <Calendar size={18} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">The Date and Time</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-4xl font-serif italic tracking-tight">{event.day}, {event.date}</p>
                                            <p className="text-xl font-black uppercase tracking-tight text-emerald-500/60">{event.startTime} — {event.endTime} WIB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-white/20">
                                            <MapPin size={18} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">The Destination</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-serif italic tracking-tight text-black/80 dark:text-white/80 transition-colors duration-1000">{event.venue.name}</h4>
                                            <p className="text-sm text-black/30 dark:text-white/30 max-w-[300px] leading-relaxed italic transition-colors duration-1000">{event.venue.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-end transition-colors duration-1000">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group/btn flex items-center gap-6 text-[10px] font-black tracking-widest uppercase text-black/40 dark:text-white/40 hover:text-emerald-400 transition-all"
                                    >
                                        View Coordinate <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex items-center gap-8 py-10 px-16 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-full backdrop-blur-xl transition-all duration-1000">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30 italic">Dress Selection: Formal Midnight Attire</p>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
