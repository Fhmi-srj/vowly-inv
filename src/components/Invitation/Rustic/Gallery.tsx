import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Camera, Sparkles } from "lucide-react";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-6xl space-y-16 relative z-10">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 opacity-30">
                        <div className="h-[1px] w-12 bg-[#8c7851]"></div>
                        <Camera className="text-[#8c7851] h-6 w-6" />
                        <div className="h-[1px] w-12 bg-[#8c7851]"></div>
                    </div>
                    <h2 className="font-serif text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Kenangan Indah</h2>
                    <p className="tracking-[0.3em] text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">Moments Together</p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="relative group overflow-hidden rounded-2xl border-4 border-white dark:border-stone-800 shadow-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl"
                        >
                            <img
                                src={img}
                                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                alt={`Gallery image ${idx + 1}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4a3f35]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
