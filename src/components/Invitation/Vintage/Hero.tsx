import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] overflow-hidden px-8 py-20 font-serif transition-colors duration-1000">
            {/* Distressed Background */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-fixed transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#704214]/5 dark:via-white/5 to-transparent transition-all duration-1000"></div>

            {/* Film Reel Accents */}
            <div className="absolute top-0 left-0 w-full h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20 transition-colors duration-1000">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-6 h-6 border-x-2 border-black/20 dark:border-white/10 transition-colors duration-1000"></div>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20 transition-colors duration-1000">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-6 h-6 border-x-2 border-black/20 dark:border-white/10 transition-colors duration-1000"></div>
                ))}
            </div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal">
                <div className="text-center space-y-6">
                    <div className="flex items-center gap-6 justify-center text-[#c5a059]">
                        <div className="h-px w-12 bg-[#c5a059]/40 dark:bg-[#c5a059]/20 transition-colors duration-1000"></div>
                        <p className="tracking-[0.8em] text-[10px] md:text-sm font-bold uppercase font-mono">A Nostalgic Chronicle</p>
                        <div className="h-px w-12 bg-[#c5a059]/40 dark:bg-[#c5a059]/20 transition-colors duration-1000"></div>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-[5.5rem] md:text-[14rem] italic tracking-tighter leading-none text-[#5c4033]/90 dark:text-[#d4c3a1]/90 drop-shadow-2xl transition-colors duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-9xl font-sans not-italic text-[#c5a059] opacity-30">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-12 text-center pt-8">
                    <div className="space-y-4">
                        <p className="text-[9px] font-bold uppercase tracking-[1em] text-[#5c4033]/40 dark:text-[#d4c3a1]/30 font-mono italic transition-colors duration-1000">Documented on</p>
                        <p className="text-5xl md:text-8xl italic tracking-tight text-[#5c4033]/70 dark:text-[#d4c3a1]/80 font-black transition-colors duration-1000">
                            {config.hero.date}
                        </p>
                    </div>
                    <div className="py-6 px-12 border-y-2 border-[#5c4033]/10 dark:border-white/10 transition-colors duration-1000">
                        <p className="text-xs md:text-sm font-medium text-[#c5a059] leading-relaxed uppercase tracking-[0.4em] font-mono">
                            — ESTABLISHED FOR ETERNITY —
                        </p>
                    </div>
                </div>
            </div>

            {/* Grain & Dust Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40 animate-pulse">
                <span className="text-[9px] font-black uppercase tracking-[0.8em] font-mono rotate-90 dark:text-[#d4c3a1]/60 transition-colors duration-1000">Rewind</span>
                <div className="w-[2px] h-12 bg-[#5c4033]/30 dark:bg-[#d4c3a1]/20 transition-colors duration-1000"></div>
            </div>
        </section>
    );
};

export default Hero;
