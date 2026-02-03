import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Calendar, Clock, MapPin, Map, ExternalLink, Sparkles } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative transition-colors duration-1000">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-slate-900 to-transparent opacity-50 transition-colors"></div>

            <div className="container mx-auto max-w-6xl space-y-24 relative z-10">
                <div className="text-center space-y-4">
                    <Sparkles className="text-[#db7093] h-6 w-6 mx-auto opacity-40 animate-pulse" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">The Wedding Event</h2>
                    <p className="tracking-[0.5em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Blessing & Reception</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="group relative">
                            {/* Floral Card Background */}
                            <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl transition-all group-hover:shadow-[#ffd1dc]/40 group-hover:-translate-y-2 duration-1000 overflow-hidden border border-[#ffd1dc]/20 dark:border-white/5">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd1dc] opacity-10 rounded-full blur-[50px]"></div>
                            </div>

                            <div className="relative p-12 md:p-20 space-y-12 text-center">
                                <div className="space-y-4">
                                    <p className="text-xs font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.4em] uppercase transition-colors">{idx === 0 ? "Holy Matrimony" : "Grand Reception"}</p>
                                    <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{event.title}</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <Calendar className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                        <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-none transition-colors">{event.day}, {event.date}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Clock className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                        <p className="text-[12px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.2em] uppercase transition-colors">
                                            {event.startTime} — {event.endTime} WIB
                                        </p>
                                    </div>

                                    <div className="pt-10 border-t border-[#ffd1dc]/30 dark:border-white/5 space-y-4 transition-colors">
                                        <MapPin className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                        <h4 className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">{event.venue.name}</h4>
                                        <p className="text-sm text-slate-400 dark:text-stone-400 max-w-[250px] mx-auto italic leading-relaxed transition-colors">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group inline-flex items-center gap-3 px-10 py-5 bg-[#db7093] dark:bg-[#ff8da1] text-white dark:text-slate-950 rounded-full text-[11px] font-black tracking-widest uppercase transition-all hover:pr-14 hover:shadow-2xl active:scale-95 duration-500"
                                    >
                                        <Map size={16} /> Open Maps
                                        <div className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all">
                                            <ExternalLink size={14} />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
