import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Camera, Sun, Sparkles } from "lucide-react";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Pattern Accent */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 dark:invert pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-7xl space-y-24 relative z-10">
                <div className="text-center space-y-6">
                    <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Glimpses of Love</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold text-[#e2725b] uppercase transition-colors">Visual Journey</p>
                    <div className="w-16 h-px bg-[#e2725b] mx-auto opacity-30"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden rounded-[4rem] border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl transition-all duration-1000 hover:shadow-[#e2725b]/20 ${idx % 3 === 1 ? 'w-full md:w-[60%]' : 'w-full md:w-[35%]'}`}
                        >
                            <img
                                src={img}
                                className="w-full h-[400px] md:h-[600px] object-cover transition-all duration-[2s] group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
                                alt={`Gallery image ${idx + 1}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4a4a4a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-end p-12">
                                <Sparkles className="text-white h-6 w-6 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
