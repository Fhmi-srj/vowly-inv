import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Calendar, Clock, MapPin, Map, Sun } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Abstract Geometric Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e2725b]/10 -rotate-12 translate-x-32 -translate-y-32"></div>

            <div className="container mx-auto max-w-6xl space-y-24 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">Sacred Union</h2>
                    <p className="tracking-[0.6em] text-[11px] font-black text-[#e2725b] uppercase transition-colors">Place & Time</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group">
                            {/* Organic Shaped Background */}
                            <div className="absolute inset-0 bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 rounded-[3rem] shadow-2xl transition-all group-hover:shadow-[#e2725b]/20 group-hover:-translate-y-2 duration-1000"></div>

                            <div className="relative p-12 md:p-20 space-y-12 text-center">
                                <div className="space-y-4">
                                    <div className="w-12 h-1 bg-[#e2725b] mx-auto opacity-40 rounded-full"></div>
                                    <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors">{event.title}</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <Calendar className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{event.day}, {event.date}</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <Clock className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <p className="text-[12px] font-black text-[#e2725b] tracking-[0.3em] uppercase">
                                            {event.startTime} — {event.endTime} WIB
                                        </p>
                                    </div>

                                    <div className="pt-10 border-t border-[#faf7f2] dark:border-white/5 flex flex-col items-center gap-4 transition-colors">
                                        <MapPin className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <h4 className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">{event.venue.name}</h4>
                                        <p className="text-sm text-slate-400 dark:text-stone-500 max-w-[280px] mx-auto italic leading-relaxed transition-colors">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl shadow-[#4a4a4a]/20 duration-500"
                                    >
                                        <Map size={16} /> Open Location
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
