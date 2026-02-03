import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MapPin, Calendar, Clock, ArrowUpRight, Star } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#fdfaf0] dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            {/* Halftone Texture Overlay */}
            <div className="absolute inset-x-0 top-0 h-full opacity-[0.03] dark:opacity-[0.08] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#00e5ff_1.5px,transparent_1.5px)] [background-size:25px_25px] transition-all duration-700"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <div className="flex items-center gap-6 text-[#ff4081] dark:text-[#00e5ff] transition-colors">
                        <Star className="fill-current" size={24} />
                        <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter leading-none uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ffeb3b] dark:drop-shadow-[8px_8px_0_#ff4081] transition-all">Plan It</h2>
                        <Star className="fill-current" size={24} />
                    </div>
                    <p className="tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]/40 dark:text-white/40 italic transition-colors">Chapter: The Celebration</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group animate-reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Panel Style Card */}
                            <div className="absolute inset-0 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white rounded-none shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] transition-all duration-700 group-hover:shadow-[20px_20px_0_#2196f3] dark:group-hover:shadow-[20px_20px_0_#00e5ff] group-hover:-translate-x-1 group-hover:-translate-y-1"></div>

                            <div className="relative p-12 md:p-24 space-y-16 flex flex-col items-center text-center font-black">
                                <div className="space-y-6">
                                    <div className="inline-block px-12 py-3 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white text-[12px] font-black uppercase tracking-[0.4em] text-[#2d2d2d] mb-4 transform -rotate-2 transition-all duration-700">
                                        {event.title}
                                    </div>
                                    <div className="h-[4px] w-20 bg-[#2d2d2d] dark:bg-[#00e5ff] mx-auto rounded-full transition-colors"></div>
                                </div>

                                <div className="space-y-12 w-full">
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-center gap-4 text-[#2d2d2d]/20 dark:text-white/20 transition-colors">
                                            <Calendar size={20} strokeWidth={3} />
                                            <p className="text-[11px] uppercase tracking-widest italic">Timeline Log</p>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-4xl md:text-6xl italic tracking-tighter uppercase text-[#2196f3] dark:text-[#00e5ff] transition-colors">{event.day}, {event.date}</p>
                                            <div className="flex items-center justify-center gap-4 text-xl tracking-widest text-[#ff4081] dark:text-[#ff4081] transition-colors">
                                                <Clock size={22} strokeWidth={3} />
                                                <span className="italic">{event.startTime} — {event.endTime} PM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10 group/loc">
                                        <div className="flex items-center justify-center gap-4 text-[#2d2d2d]/20 dark:text-white/20 transition-colors">
                                            <MapPin size={20} strokeWidth={3} />
                                            <p className="text-[11px] uppercase tracking-widest italic">Location Key</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-3xl md:text-5xl italic tracking-tight text-[#2d2d2d]/80 dark:text-white/80 uppercase group-hover/loc:text-[#2196f3] dark:group-hover/loc:text-[#00e5ff] transition-colors">{event.venue.name}</h4>
                                            <div className="p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 dark:border-white/20 rounded-xl transition-all">
                                                <p className="text-xs md:text-sm text-[#2d2d2d]/60 dark:text-white/60 max-w-[340px] mx-auto leading-relaxed italic uppercase font-bold transition-colors">
                                                    {event.venue.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 w-full flex justify-center">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group/btn flex items-center gap-6 px-12 py-5 bg-[#2d2d2d] dark:bg-[#ff4081] text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-[#ff4081] dark:hover:bg-[#00e5ff] dark:hover:text-[#2d2d2d] transition-all shadow-[8px_8px_0_#ffeb3b] dark:shadow-[8px_8px_0_#2d2d2d] active:scale-95"
                                    >
                                        OPEN MISSION MAP <ArrowUpRight className="group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3 transition-transform" size={18} strokeWidth={3} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-block bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-10 py-2 rotate-1 transition-all shadow-[5px_5px_0_#ff4081]">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-[#2d2d2d]">MISSION STATUS: ACTIVE</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
