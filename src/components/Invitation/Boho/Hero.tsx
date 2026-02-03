import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Sun, Heart } from "lucide-react";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#faf7f2] dark:bg-stone-950 transition-colors duration-1000">
            {/* Boho Textures and Patterns */}
            <div className="absolute inset-x-0 top-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert transition-all"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#c19a6b]/10 dark:border-white/5 rounded-full scale-0 animate-reveal transition-colors" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}></div>

            <div className="relative z-10 space-y-16 px-6 max-w-5xl">
                <div className="space-y-6 reveal-active">
                    <Sun className="text-[#c19a6b] dark:text-stone-500 h-10 w-10 mx-auto opacity-20 animate-spin-slow transition-colors" />
                    <p className="tracking-[1em] text-[10px] font-bold text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">The Wedding Journey of</p>
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors">
                            {config.couple.groom.name}
                        </h1>
                        <span className="font-serif text-5xl md:text-7xl text-[#e2725b] italic font-light transition-colors">&</span>
                        <h1 className="font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors">
                            {config.couple.bride.name}
                        </h1>
                    </div>
                </div>

                <div className="space-y-4 animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <div className="w-16 h-[1px] bg-[#c19a6b]/30 dark:bg-stone-800 mx-auto mb-6 transition-colors"></div>
                    <p className="font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.hero.date}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Heart className="h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" />
                        <p className="tracking-[0.5em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">At {config.hero.city}</p>
                        <Heart className="h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
