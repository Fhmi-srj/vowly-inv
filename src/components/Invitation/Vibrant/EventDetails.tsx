import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000">
            {/* Playful Background Elements */}
            <div className="absolute top-0 right-0 w-full h-[2px] bg-blue-600 opacity-20 rotate-12 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-500/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="text-center space-y-4">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-[1em]">The Big Occasions</p>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none dark:text-white transition-colors">Schedule</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="group relative">
                            {/* Comic Card Style */}
                            <div className={`absolute inset-0 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] transition-all group-hover:translate-x-4 group-hover:translate-y-4 duration-500`}></div>

                            <div className="relative p-12 md:p-20 space-y-12 text-center flex flex-col items-center">
                                <div className={`w-24 h-24 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${idx === 0 ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                                    <Calendar size={40} strokeWidth={2.5} />
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-black text-pink-500 uppercase tracking-widest italic">{idx === 0 ? "Initial Toast" : "The Main Bash"}</p>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none dark:text-white transition-colors">{event.title}</h3>
                                </div>

                                <div className="space-y-10 w-full">
                                    <div className="bg-zinc-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-black dark:border-white/20 rotate-1 transition-colors">
                                        <p className="text-xl font-black uppercase tracking-tight dark:text-white">{event.day}, {event.date}</p>
                                        <div className="flex items-center justify-center gap-3 mt-2 text-zinc-500">
                                            <Clock size={16} strokeWidth={3} />
                                            <p className="text-xs font-black uppercase tracking-widest">{event.startTime} — {event.endTime} WIB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <MapPin className="text-blue-600" size={24} strokeWidth={3} />
                                            <h4 className="text-2xl font-black uppercase tracking-tight dark:text-white transition-colors">{event.venue.name}</h4>
                                        </div>
                                        <p className="text-sm text-zinc-400 max-w-[280px] mx-auto font-medium leading-relaxed italic">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-slate-800 text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:bg-blue-600 hover:shadow-[10px_10px_0_#fbd38d] dark:hover:shadow-[10px_10px_0_#3b82f6]"
                                    >
                                        Google Maps <ArrowRight size={16} />
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
