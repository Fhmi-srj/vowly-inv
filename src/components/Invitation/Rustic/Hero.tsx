import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart } from "lucide-react";

const Hero: React.FC = () => {
    const { config } = useSettings();

    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fdfaf7] dark:bg-slate-950 transition-colors duration-1000">
            {/* Background Image / Texture */}
            <div className="absolute inset-0 z-0 scale-110 animate-subtle-zoom opacity-10">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover grayscale"
                    alt="Rustic Background"
                />
            </div>

            <div className="absolute inset-0 bg-[#fdfaf7]/40 dark:bg-slate-950/60 pointer-events-none transition-colors duration-1000"></div>

            <div className="relative z-10 space-y-12 px-6 max-w-4xl">
                <div className="space-y-4 reveal-active">
                    <p className="tracking-[0.8em] text-[10px] font-bold text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">The Wedding Celebration of</p>
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="font-serif text-7xl md:text-[10rem] text-[#4a3f35] leading-[0.8]">
                            {config.couple.groom.name}
                        </h1>
                        <span className="font-serif text-4xl md:text-6xl text-[#c5a386] italic">&</span>
                        <h1 className="font-serif text-7xl md:text-[10rem] text-[#4a3f35] leading-[0.8]">
                            {config.couple.bride.name}
                        </h1>
                    </div>
                </div>

                <div className="h-24 w-[1px] bg-[#d9c5b2] dark:bg-stone-700 mx-auto animate-reveal transition-colors" style={{ animationDelay: '0.4s' }}></div>

                <div className="space-y-3 animate-reveal" style={{ animationDelay: '0.6s' }}>
                    <p className="font-serif text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-300 italic transition-colors">{config.hero.date}</p>
                    <p className="tracking-[0.3em] text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">#ThePerfectMatch</p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
