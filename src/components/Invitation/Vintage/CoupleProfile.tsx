import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-[#f4ecd8] dark:bg-[#121212] py-24 md:py-48 px-6 md:px-24 text-[#5c4033] dark:text-[#d4c3a1] relative overflow-hidden font-serif transition-colors duration-1000">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-10 animate-reveal">
                    <h2 className="text-6xl md:text-9xl italic tracking-tighter leading-none text-[#5c4033]/80 dark:text-[#d4c3a1]/90 transition-colors duration-1000">The Protagonists</h2>
                    <div className="flex items-center justify-center gap-6">
                        <div className="w-12 h-px bg-[#5c4033]/20 dark:bg-white/10 transition-colors duration-1000"></div>
                        <p className="text-sm md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 max-w-2xl font-mono uppercase tracking-widest italic leading-relaxed py-4 px-8 bg-[#5c4033]/5 dark:bg-white/5 transition-colors duration-1000">
                            "A cinematic journey of two souls, captured in the grain of time."
                        </p>
                        <div className="w-12 h-px bg-[#5c4033]/20 dark:bg-white/10 transition-colors duration-1000"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 md:gap-40 items-center">
                    {/* Groom Section */}
                    <div className="space-y-16 group flex flex-col items-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] -rotate-3 transition-all duration-700 group-hover:rotate-0 group-hover:scale-105">
                            {/* Polaroid Style */}
                            <div className="w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover grayscale brightness-90 contrast-125 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            <div className="h-[10%] flex items-center justify-center">
                                <p className="text-2xl font-mono tracking-tighter opacity-70 italic dark:text-[#d4c3a1]/50 transition-colors duration-1000">{config.couple.groom.name} — '70</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="text-5xl md:text-7xl italic tracking-tight leading-none text-[#5c4033] dark:text-[#d4c3a1] transition-colors duration-1000">{config.couple.groom.fullName}</h3>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono">Legacy of</p>
                                <p className="text-2xl italic tracking-tight opacity-60 dark:text-[#d4c3a1]/60 transition-colors duration-1000">Sutan {config.couple.groom.parents.split('&')[0]} & Nyonya {config.couple.groom.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group flex flex-col items-center md:mt-32">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] rotate-3 transition-all duration-700 group-hover:rotate-0 group-hover:scale-105">
                            {/* Polaroid Style */}
                            <div className="w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover grayscale brightness-90 contrast-125 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            <div className="h-[10%] flex items-center justify-center">
                                <p className="text-2xl font-mono tracking-tighter opacity-70 italic dark:text-[#d4c3a1]/50 transition-colors duration-1000">{config.couple.bride.name} — '72</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="text-5xl md:text-7xl italic tracking-tight leading-none text-[#5c4033] dark:text-[#d4c3a1] transition-colors duration-1000">{config.couple.bride.fullName}</h3>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono">Heritage of</p>
                                <p className="text-2xl italic tracking-tight opacity-60 dark:text-[#d4c3a1]/60 transition-colors duration-1000">Bpk. {config.couple.bride.parents.split('&')[0]} & Ibu {config.couple.bride.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Decorative Text */}
                <div className="hidden lg:block absolute top-1/2 left-4 -translate-y-1/2 [writing-mode:vertical-rl] opacity-10 font-mono">
                    <p className="text-[10px] font-black uppercase tracking-[2em]">Analog Memories — Volume 1970</p>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
