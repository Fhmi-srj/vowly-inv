import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Smile } from "lucide-react";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fafafa] dark:bg-slate-950 transition-colors duration-1000">
            {/* Comic Style Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Star className="text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" />
                <p className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[1em]">The Big Day is Coming</p>
                <Star className="text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" />
            </div>

            <div className="relative z-10 space-y-12 px-6 max-w-5xl">
                <div className="space-y-4 reveal-active">
                    <h1 className="font-sans text-[10rem] md:text-[18rem] font-black text-black leading-[0.75] tracking-tighter uppercase italic select-none">
                        <span className="text-blue-600">{config.couple.groom.name.substring(0, 1)}</span>
                        {config.couple.groom.name.substring(1)}
                    </h1>
                    <div className="flex items-center justify-center gap-8 -my-4 md:-my-12">
                        <div className="h-4 w-32 bg-yellow-400 -rotate-3 rounded-full"></div>
                        <Smile className="h-16 w-16 text-pink-500 animate-bounce" />
                        <div className="h-4 w-32 bg-blue-500 rotate-3 rounded-full"></div>
                    </div>
                    <h1 className="font-sans text-[10rem] md:text-[18rem] font-black text-black leading-[0.75] tracking-tighter uppercase italic select-none">
                        <span className="text-pink-500">{config.couple.bride.name.substring(0, 1)}</span>
                        {config.couple.bride.name.substring(1)}
                    </h1>
                </div>

                <div className="pt-12 animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <div className="inline-block bg-black dark:bg-slate-900 text-white px-12 py-6 rounded-3xl -rotate-2 shadow-[12px_12px_0_#fbd38d] dark:shadow-[12px_12px_0_#3b82f6] transition-all">
                        <p className="font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{config.hero.date}</p>
                        <p className="text-xs font-black uppercase tracking-[0.4em] mt-3 text-yellow-400">Save our union in {config.hero.city}</p>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="w-20 h-20 border-8 border-blue-600 rounded-full opacity-20"></div>
            </div>
            <div className="absolute top-10 right-10 hidden md:block">
                <div className="w-24 h-24 bg-pink-500 rotate-45 opacity-20"></div>
            </div>
        </section>
    );
};

export default Hero;
