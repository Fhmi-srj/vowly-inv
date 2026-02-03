import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 transition-colors duration-1000">Dokumentasi Moment</p>
                    <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000">Galeri</h2>
                    <div className="h-px w-24 bg-[#8d6e1c]/10 dark:bg-[#d4af37]/30 mx-auto transition-colors duration-1000"></div>
                </div>

                <div className="grid md:grid-cols-4 auto-rows-[300px] gap-4">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden border border-[#8d6e1c]/10 dark:border-[#d4af37]/30 p-2 bg-white/50 dark:bg-[#4a0404]/20 backdrop-blur-xl shadow-2xl transition-all duration-1000 ${idx === 0 ? "md:col-span-2 md:row-span-2" :
                                idx === 1 ? "md:col-span-2 md:row-span-1" :
                                    "md:col-span-1 md:row-span-1"
                                }`}
                        >
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110"
                                    alt={`Moment ${idx + 1}`}
                                />
                            </div>
                            {/* Ornamental Corner Frames */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>

                <div className="flex md:justify-center items-center gap-12 text-[#d4af37]/10 pt-24">
                    <div className="h-px w-24 bg-[#d4af37]/10"></div>
                    <p className="text-[10px] font-black uppercase tracking-[1em]">Kisah Dalam Bingkai</p>
                    <div className="h-px w-24 bg-[#d4af37]/10"></div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
