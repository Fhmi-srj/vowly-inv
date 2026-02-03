import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart, Sparkles } from "lucide-react";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fffafa] dark:bg-slate-950 transition-colors duration-1000">
            {/* Background Image with Watercolor Bloom effect */}
            <div className="absolute inset-0 z-0 scale-105 animate-subtle-zoom">
                <img
                    src="https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-20 contrast-75 brightness-125 saturate-50"
                    alt="Floral Background"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-[#fffafa]/30 via-transparent to-[#fffafa]/30 dark:from-slate-950/30 dark:to-slate-950/30 pointer-events-none transition-colors duration-1000"></div>

            <div className="relative z-10 space-y-12 px-6 max-w-4xl">
                <div className="animate-reveal flex flex-col items-center gap-4">
                    <Sparkles className="text-[#db7093] opacity-30 h-8 w-8 animate-pulse" />
                    <p className="tracking-[0.8em] text-[10px] font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">The Wedding Celebration of</p>
                </div>

                <div className="reveal-active space-y-4">
                    <h1 className="font-serif text-8xl md:text-[12rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.8] transition-colors">
                        {config.couple.groom.name}
                    </h1>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-[1px] w-24 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                        <span className="font-serif text-5xl md:text-7xl text-[#db7093] dark:text-[#ff8da1] italic transition-colors">&</span>
                        <div className="h-[1px] w-24 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                    </div>
                    <h1 className="font-serif text-8xl md:text-[12rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.8] transition-colors">
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="space-y-3 animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <p className="font-serif text-3xl md:text-5xl text-[#db7093] dark:text-[#ff8da1] italic tracking-wide transition-colors">{config.hero.date}</p>
                    <div className="flex items-center justify-center gap-2">
                        <Heart className="h-3 w-3 fill-[#db7093] dark:fill-[#ff8da1] text-[#db7093] dark:text-[#ff8da1] transition-colors" />
                        <p className="tracking-[0.3em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Save the date</p>
                        <Heart className="h-3 w-3 fill-[#db7093] dark:fill-[#ff8da1] text-[#db7093] dark:text-[#ff8da1] transition-colors" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
