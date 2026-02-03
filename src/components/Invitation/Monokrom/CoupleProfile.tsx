import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-zinc-950 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    {/* Groom Section */}
                    <div className="space-y-16 group">
                        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0_rgba(255,255,255,0.02)] transition-all">
                            <img
                                src={config.couple.groom.image}
                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                alt={config.couple.groom.fullName}
                            />
                            <div className="absolute top-8 left-8 flex flex-col items-start gap-2">
                                <span className="bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors">Groom</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{config.couple.groom.fullName}</h2>
                            <div className="w-12 h-2 bg-black"></div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Parents</p>
                                <p className="text-2xl font-bold uppercase tracking-tight transition-colors">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group md:mt-64">
                        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[-20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[-20px_20px_0_rgba(255,255,255,0.02)] transition-all">
                            <img
                                src={config.couple.bride.image}
                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                alt={config.couple.bride.fullName}
                            />
                            <div className="absolute top-8 right-8 flex flex-col items-end gap-2 text-right">
                                <span className="bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors">Bride</span>
                            </div>
                        </div>
                        <div className="space-y-6 md:text-right flex flex-col md:items-end">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{config.couple.bride.fullName}</h2>
                            <div className="w-12 h-2 bg-black"></div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Parents</p>
                                <p className="text-2xl font-bold uppercase tracking-tight transition-colors">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Narrative Divider */}
                <div className="mt-40 grid md:grid-cols-2 items-center gap-12 border-t border-zinc-100 dark:border-zinc-800 pt-12 transition-colors">
                    <p className="text-3xl font-black uppercase tracking-tighter italic">"A monochromatic bond, etched in time and love."</p>
                    <div className="flex md:justify-end">
                        <p className="text-xs font-medium text-zinc-400 max-w-sm leading-relaxed">
                            Witness the union of two souls that complete each other's shades. A journey of depth, contrast, and infinite connection.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
