import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] transition-colors duration-1000 overflow-hidden px-8 py-20">
            {/* Parallax Background with Traditional Motifs */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] opacity-[0.03] dark:opacity-10 bg-fixed transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#2a0202] via-transparent to-white dark:to-[#2a0202] opacity-60 transition-colors duration-1000"></div>

            {/* Ornamental Corners */}
            <div className="absolute top-0 left-0 w-48 h-48 border-t-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute top-0 right-0 w-48 h-48 border-t-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 border-b-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 border-b-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-16 animate-reveal">
                <div className="text-center space-y-6">
                    <p className="tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#d4af37]/80 leading-relaxed max-w-2xl mx-auto">
                        Mengarungi Samudera Kehidupan Dalam Ikatan Suci
                    </p>
                    <div className="h-px w-24 bg-[#d4af37] mx-auto opacity-50"></div>
                </div>

                <div className="text-center">
                    <h1 className="text-[5rem] md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-[#f9d976] via-[#d4af37] to-[#4a3a0a] dark:to-[#8d6e1c] transition-all duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl font-sans not-italic text-[#d4af37]/40">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-8 text-center pt-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37]/60">Saturdays | Premiere</p>
                        <p className="text-4xl md:text-6xl font-serif italic tracking-tight text-black/80 dark:text-white/90 transition-colors duration-1000">
                            {config.hero.date}
                        </p>
                    </div>
                    <div className="max-w-md">
                        <p className="text-xs md:text-sm font-medium text-[#d4af37]/40 leading-relaxed italic uppercase tracking-wider">
                            — The Royal Union of Two Noble Hearts —
                        </p>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce opacity-30">
                <div className="w-[1px] h-12 bg-[#d4af37]"></div>
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
            </div>
        </section>
    );
};

export default Hero;
