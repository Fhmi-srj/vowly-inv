import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Camera, Sparkles, Heart } from "lucide-react";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none transition-colors" style={{ backgroundImage: 'radial-gradient(#db7093 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

            <div className="container mx-auto max-w-7xl space-y-24 relative z-10">
                <div className="text-center space-y-6">
                    <Heart className="text-[#db7093] h-8 w-8 mx-auto opacity-20" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Sweet Memories</h2>
                    <p className="tracking-[0.6em] text-[10px] font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Our Journey Captured</p>
                    <div className="w-24 h-[1px] bg-[#ffd1dc] mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden rounded-[2rem] border-2 border-[#ffd1dc]/20 dark:border-white/5 shadow-xl transition-all duration-1000 hover:scale-[1.05] ${idx % 3 === 0 ? 'md:row-span-2' : ''}`}
                        >
                            <img
                                src={img}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover:rotate-3 group-hover:scale-110"
                                alt={`Gallery image ${idx + 1}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#db7093]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
                                <Sparkles className="text-white h-5 w-5 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
