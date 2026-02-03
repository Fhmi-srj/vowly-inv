import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Calendar, Clock, MapPin, Map, ExternalLink } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section className="bg-[#f9f5f0] dark:bg-slate-900 py-24 md:py-40 px-6 relative transition-colors duration-1000">
            {/* Floral/Nature Corner Decoration Placeholder Interface */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-10 rotate-180 pointer-events-none">
                <img src="https://www.transparenttextures.com/patterns/natural-paper.png" className="w-full h-full object-cover" />
            </div>

            <div className="container mx-auto max-w-6xl space-y-20 relative z-10">
                <div className="text-center space-y-4">
                    <p className="tracking-[0.5em] text-[10px] font-bold text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">Save The Date</p>
                    <h2 className="font-serif text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Waktu & Tempat</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group">
                            <div className="absolute inset-0 bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 rounded-[3rem] shadow-2xl transition-all group-hover:scale-[1.02] duration-1000"></div>

                            <div className="relative p-10 md:p-16 space-y-10 text-center">
                                <div className="space-y-4">
                                    <div className="w-16 h-[1px] bg-[#c5a386] mx-auto opacity-40"></div>
                                    <h3 className="font-serif text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-200 font-bold transition-colors">{event.title}</h3>
                                    <div className="w-16 h-[1px] bg-[#c5a386] mx-auto opacity-40"></div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <Calendar className="text-[#c5a386] h-6 w-6 mb-2" />
                                        <p className="font-serif text-2xl text-[#4a3f35] dark:text-stone-300 italic transition-colors">{event.day}, {event.date}</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <Clock className="text-[#c5a386] h-6 w-6 mb-2" />
                                        <p className="text-[12px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-[0.3em] uppercase transition-colors">
                                            {event.startTime} - {event.endTime} WIB
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-[#f4ebe1] dark:border-white/5 flex flex-col items-center gap-2 transition-colors">
                                        <MapPin className="text-[#c5a386] h-6 w-6 mb-2" />
                                        <p className="font-serif text-xl font-bold text-[#4a3f35] dark:text-stone-200 transition-colors">{event.venue.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-stone-400 max-w-sm italic transition-colors">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#8c7851] text-white rounded-full text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[#4a3f35] shadow-lg shadow-[#8c7851]/20"
                                    >
                                        <Map size={16} /> Lihat Lokasi
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
