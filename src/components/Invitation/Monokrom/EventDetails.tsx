import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Map, ArrowUpRight } from "lucide-react";

const EventDetails: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-[1px] bg-zinc-800"></div>

            <div className="container mx-auto max-w-7xl space-y-32">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-8">
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Schedule</h2>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">The Grand Occasions</p>
                </div>

                <div className="space-y-px bg-zinc-800">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="grid md:grid-cols-12 bg-zinc-950 py-20 px-4 md:px-12 group hover:bg-zinc-900 transition-all duration-700 items-center gap-12 border-b border-zinc-800">
                            <div className="md:col-span-3 space-y-4">
                                <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{idx === 0 ? "Part One" : "Part Two"}</span>
                                <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{event.title}</p>
                            </div>

                            <div className="md:col-span-4 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">{event.date}</p>
                                    <p className="text-xl font-bold uppercase tracking-tight text-white/50">{event.startTime} — {event.endTime} WIB</p>
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Venue</p>
                                    <h4 className="text-xl font-black uppercase leading-tight">{event.venue.name}</h4>
                                    <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed">{event.venue.address}</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex md:justify-end">
                                <a
                                    href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                    target="_blank"
                                    className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:scale-110 active:scale-95"
                                >
                                    <ArrowUpRight size={32} strokeWidth={2.5} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-20 text-center">
                    <div className="inline-block px-12 py-8 bg-zinc-900 border border-zinc-800 animate-pulse">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Dresscode Policy</p>
                        <p className="text-2xl font-black uppercase tracking-tighter mt-2">Monochromatic Attire Recommended</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
