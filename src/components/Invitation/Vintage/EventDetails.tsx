import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            {/* Distressed Texture Overlay */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <div className="w-16 h-[1px] bg-[#f4ecd8]/20 dark:bg-white/10 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[11rem] italic tracking-tighter leading-none opacity-90 dark:text-[#d4c3a1]/90 drop-shadow-xl transition-colors duration-1000">The Docket</h2>
                    <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono">Confidential Schedule</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group animate-reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Folder Style Card */}
                            <div className="absolute inset-0 bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 dark:border-white/5 rounded-sm shadow-2xl transition-all duration-700 group-hover:bg-[#f4ecd8]/10 dark:hover:bg-white/10 group-hover:border-[#c5a059]/30"></div>

                            <div className="relative p-12 md:p-24 space-y-16 flex flex-col items-center text-center">
                                <div className="space-y-6">
                                    <div className="inline-block px-12 py-3 border-2 border-[#c5a059]/40 rounded-none text-[11px] font-bold uppercase tracking-[0.5em] text-[#c5a059] mb-4 font-mono shadow-[5px_5px_0_rgba(197,160,89,0.2)]">
                                        {event.title}
                                    </div>
                                    <div className="h-px w-20 bg-[#f4ecd8]/20 mx-auto"></div>
                                </div>

                                <div className="space-y-12 w-full">
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-center gap-4 text-[#f4ecd8]/30 dark:text-[#d4c3a1]/20 transition-colors duration-1000">
                                            <Calendar size={18} strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic font-mono">Date Received</p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-4xl md:text-6xl italic tracking-tight font-black">{event.day}, {event.date}</p>
                                            <div className="flex items-center justify-center gap-4 text-xl font-mono tracking-widest text-[#c5a059] opacity-80">
                                                <Clock size={20} />
                                                <span>{event.startTime} — {event.endTime} HRS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center justify-center gap-4 text-[#f4ecd8]/30 dark:text-[#d4c3a1]/20 transition-colors duration-1000">
                                            <MapPin size={18} strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic font-mono">Coordinates</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-3xl md:text-4xl italic tracking-tight opacity-90">{event.venue.name}</h4>
                                            <p className="text-xs md:text-sm text-[#f4ecd8]/40 dark:text-[#d4c3a1]/40 max-w-[340px] mx-auto leading-relaxed border-l-2 border-[#c5a059]/30 pl-6 text-left font-mono italic transition-colors duration-1000">
                                                {event.venue.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-[#f4ecd8]/5 dark:border-white/5 w-full flex justify-center transition-colors duration-1000">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group/btn flex items-center gap-6 px-12 py-5 bg-[#f4ecd8] dark:bg-[#d4c3a1] rounded-none text-[10px] font-bold tracking-[0.4em] uppercase text-[#333] hover:bg-[#c5a059] dark:hover:bg-[#c5a059] hover:text-white transition-all shadow-[8px_8px_0_rgba(0,0,0,0.2)] font-mono"
                                    >
                                        Locate Signal <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[1.5em] text-[#f4ecd8]/20 font-mono">— DISPATCH COMPLETED —</p>
                </div>
            </div>

            {/* Corner Stamp */}
            <div className="absolute bottom-12 right-12 w-32 h-32 border-4 border-dashed border-[#f4ecd8]/10 rounded-full flex items-center justify-center rotate-12 rotate-[-15deg] opacity-20">
                <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-none">Classified <br /> Wedding <br /> 1970</span>
            </div>
        </section>
    );
};

export default EventDetails;
