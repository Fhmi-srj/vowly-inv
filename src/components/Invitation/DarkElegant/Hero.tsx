import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col justify-end bg-white dark:bg-[#0a0a0b] text-black dark:text-white transition-colors duration-1000 overflow-hidden p-8 md:p-24">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,white_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0b_100%)] z-10 transition-colors duration-1000"></div>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 blur-[120px] scale-150 animate-pulse"></div>
            </div>

            <div className="relative z-20 flex flex-col md:flex-row items-end justify-between gap-16 border-t border-black/5 dark:border-white/5 pt-16 transition-colors duration-1000">
                <div className="space-y-8 max-w-4xl text-left animate-reveal">
                    <div className="flex items-center gap-6">
                        <div className="h-px w-12 bg-emerald-500"></div>
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500">Official Union</p>
                    </div>
                    <h1 className="text-8xl md:text-[15rem] font-serif italic tracking-tighter text-black dark:text-white leading-[0.8] transition-colors duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="font-sans not-italic text-emerald-500/50">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-start md:items-end gap-6 text-left md:text-right animate-reveal" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">The Calendar Event</p>
                    <p className="text-5xl md:text-8xl font-serif italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000">
                        {config.hero.date}
                    </p>
                    <p className="text-sm font-medium text-white/30 max-w-[280px] leading-relaxed italic border-r-2 border-emerald-500/30 pr-6 hidden md:block">
                        "Two paths converge under the midnight sky to form a constellation of eternal love."
                    </p>
                    <div className="w-20 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
                </div>
            </div>

            {/* Side Branding */}
            <div className="absolute top-24 right-8 md:right-24 [writing-mode:vertical-rl] rotate-180 hidden md:block opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[1.5em] text-white whitespace-nowrap">
                    CONSTELLATION OF LOVE — VOL I
                </p>
            </div>
        </section>
    );
};

export default Hero;
