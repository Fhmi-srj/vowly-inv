import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col justify-end bg-zinc-950 text-white overflow-hidden p-8 md:p-20">
            {/* Massive Background Typography */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
                <h1 className="text-[30rem] md:text-[50rem] font-black uppercase tracking-tighter leading-none whitespace-nowrap -rotate-6">
                    Marr-ied
                </h1>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-12 border-t border-zinc-800 pt-12">
                <div className="space-y-6 max-w-2xl text-left">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500">Official Ceremony</p>
                    <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter uppercase leading-[0.8]">
                        {config.couple.groom.name} <br />
                        <span className="text-zinc-700">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4 text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Save the Date</p>
                    <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{config.hero.date}</p>
                    <p className="text-sm font-medium text-zinc-400 max-w-[200px] leading-relaxed">
                        Join us at {config.hero.city} for a night of celebration and joy.
                    </p>
                    <div className="w-12 h-px bg-zinc-700 mt-4"></div>
                </div>
            </div>

            {/* Side Date Accent */}
            <div className="absolute top-20 right-8 md:right-20 vertical-text hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800 whitespace-nowrap">
                    CHAPTER TWO — {new Date().getFullYear()}
                </p>
            </div>

            <style jsx>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            `}</style>
        </section>
    );
};

export default Hero;
