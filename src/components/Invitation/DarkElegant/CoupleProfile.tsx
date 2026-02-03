import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 text-black dark:text-white relative overflow-hidden transition-colors duration-1000">
            {/* Elegant Radial Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/4"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    {/* Groom Section */}
                    <div className="space-y-16 group">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000">
                            <div className="w-full h-full overflow-hidden rounded-[2rem]">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            <div className="absolute top-12 left-12 flex flex-col items-start gap-4">
                                <span className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">The Groom</span>
                            </div>
                        </div>
                        <div className="space-y-8 pl-6">
                            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000">{config.couple.groom.fullName}</h2>
                            <div className="h-[2px] w-20 bg-emerald-500/50"></div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Lineage</p>
                                <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group md:mt-64">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000">
                            <div className="w-full h-full overflow-hidden rounded-[2rem]">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            <div className="absolute top-12 right-12 flex flex-col items-end gap-4 text-right">
                                <span className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">The Bride</span>
                            </div>
                        </div>
                        <div className="space-y-8 md:text-right flex flex-col md:items-end pr-6">
                            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000">{config.couple.bride.fullName}</h2>
                            <div className="h-[2px] w-20 bg-emerald-500/50"></div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Lineage</p>
                                <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-40 text-center border-t border-black/5 dark:border-white/5 pt-24 transition-colors duration-1000">
                    <p className="text-4xl md:text-7xl font-serif italic tracking-tight text-white/10 leading-snug max-w-5xl mx-auto">
                        "Under the emerald glow of infinite stars, two souls find their eternal residence in each other's heartbeat."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
