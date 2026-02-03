import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 transition-colors duration-1000 overflow-hidden px-8 py-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-fixed transition-opacity duration-1000"></div>

            {/* Soft Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,#0c2c1e_0%,transparent_100%)] opacity-60 transition-colors duration-1000"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal">
                <div className="text-center space-y-6">
                    <div className="w-16 h-px bg-[#c5a059]/30 mx-auto"></div>
                    <p className="tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#c5a059] leading-relaxed">
                        Maha Suci Allah Yang Menciptakan Makhluk-Nya Berpasang-pasangan
                    </p>
                    <div className="w-16 h-px bg-[#c5a059]/30 mx-auto"></div>
                </div>

                <div className="text-center space-y-8">
                    <h1 className="text-[5.5rem] md:text-[13rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white/95 transition-colors duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl font-sans not-italic text-[#c5a059] dark:text-[#c5a059] opacity-40 transition-colors duration-1000">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-10 text-center">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#2d4a3e]/40 dark:text-white/30 italic transition-colors duration-1000">— The Celebration —</p>
                        <p className="text-4xl md:text-7xl font-serif italic tracking-tight text-[#c5a059]">
                            {config.hero.date}
                        </p>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-20 transition-opacity duration-1000">
                <div className="w-[1px] h-16 bg-[#2d4a3e] dark:bg-[#c5a059] transition-colors duration-1000"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.8em] [writing-mode:vertical-rl] rotate-180 dark:text-white/50 transition-colors duration-1000">Discovery</span>
            </div>
        </section>
    );
};

export default Hero;
