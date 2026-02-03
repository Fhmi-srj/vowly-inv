import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white overflow-hidden px-8 py-20 font-sans transition-colors duration-700">
            {/* Comic Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(#2d2d2d_1px,transparent_1px),linear-gradient(90deg,#2d2d2d_1px,transparent_1px)] dark:bg-[linear-gradient(#2196f3_1px,transparent_1px),linear-gradient(90deg,#2196f3_1px,transparent_1px)] [background-size:100px_100px] transition-all duration-700"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-24 animate-reveal">
                <div className="text-center space-y-6">
                    <div className="bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-12 py-3 shadow-[8px_8px_0_#2d2d2d] dark:shadow-[8px_8px_0_#ff4081] transform -rotate-1 transition-all duration-700">
                        <p className="tracking-[0.8em] text-[10px] md:text-sm font-black uppercase text-[#2d2d2d]">VOLUME ONE: ETERNAL LOVE</p>
                    </div>
                </div>

                <div className="text-center relative">
                    <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#ff4081]/10 dark:bg-[#ff4081]/20 rounded-full blur-3xl transition-opacity"></div>
                    <h1 className="text-[5.5rem] md:text-[15rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#2196f3] dark:drop-shadow-[5px_5px_0_#ff4081] transition-all duration-700">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl not-skew-x-0 inline-block text-[#ff4081] dark:text-[#00e5ff] -rotate-12 transition-colors duration-700">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-12 text-center">
                    <div className="space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2d2d2d]/30 dark:text-white/30 italic transition-colors">— THE PREMIERE —</p>
                        <p className="text-5xl md:text-9xl font-black italic tracking-tighter text-[#2196f3] dark:text-[#00e5ff] uppercase transform -rotate-1 hover:rotate-1 transition-all duration-700 cursor-default">
                            {config.hero.date}
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-[#2d2d2d] dark:bg-[#ff4081] blur-md opacity-20 transition-all"></div>
                        <div className="relative bg-white dark:bg-[#0a0a1a] border-[3px] border-[#2d2d2d] dark:border-white px-16 py-6 rounded-[2rem] transform rotate-1 transition-all duration-700">
                            <p className="text-xs md:text-sm font-black text-[#2d2d2d] dark:text-white leading-relaxed uppercase tracking-[0.3em] transition-colors">
                                LIVE AT: {config.events[0].venue.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating "POW" stickers style decorations */}
            <div className="absolute top-20 right-20 hidden lg:block opacity-20 animate-pulse">
                <div className="w-24 h-24 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white flex items-center justify-center font-black text-2xl -rotate-12 shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#ff4081] transition-all">WOW!</div>
            </div>
            <div className="absolute bottom-20 left-20 hidden lg:block opacity-20 animate-bounce">
                <div className="w-24 h-24 bg-[#ff4081] dark:bg-[#ff4081] border-[3px] border-[#2d2d2d] dark:border-white rounded-full flex items-center justify-center font-black text-2xl rotate-12 text-white shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#00e5ff] transition-all">YAY!</div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] [writing-mode:vertical-rl] rotate-180 text-[#2d2d2d] dark:text-white transition-colors">Scroll Down</span>
                <div className="w-[4px] h-12 bg-[#2d2d2d] dark:bg-[#ff4081] rounded-full transition-colors"></div>
            </div>
        </section>
    );
};

export default Hero;
