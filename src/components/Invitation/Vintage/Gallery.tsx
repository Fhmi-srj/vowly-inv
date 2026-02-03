import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-[#f4ecd8] dark:bg-[#121212] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-sans transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#5c4033]/40 dark:text-[#d4c3a1]/30 font-mono italic transition-colors duration-1000">Negative Film #001</p>
                    <h2 className="text-7xl md:text-[11rem] font-serif italic tracking-tighter leading-none text-[#5c4033] dark:text-[#d4c3a1]/90 transition-colors duration-1000">The Reels</h2>
                    <div className="w-16 h-px bg-[#5c4033]/20 dark:bg-white/10 mx-auto transition-colors duration-1000"></div>
                </div>

                <div className="grid md:grid-cols-4 auto-rows-[320px] gap-6">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden bg-white dark:bg-[#1a1a1a] p-4 shadow-[10px_10px_30px_rgba(0,0,0,0.1)] transition-all duration-1000 ${idx === 0 ? "md:col-span-2 md:row-span-2 rotate-[-2deg]" :
                                idx === 1 ? "md:col-span-2 md:row-span-1 rotate-[1deg]" :
                                    "md:col-span-1 md:row-span-1"
                                } ${idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[2deg]"} hover:rotate-0 hover:scale-105 hover:z-20 hover:shadow-2xl`}
                        >
                            <div className="w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/40 border border-black/5 dark:border-white/5 transition-colors duration-1000">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover grayscale brightness-90 contrast-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]"
                                    alt={`Capture ${idx + 1}`}
                                />
                            </div>
                            <div className="h-[15%] flex items-center justify-between px-2 font-mono text-[9px] text-[#5c4033]/40 dark:text-[#d4c3a1]/40 transition-colors duration-1000 uppercase tracking-tighter italic">
                                <span>Film Reel #{idx + 10}</span>
                                <span>ISO 400</span>
                            </div>

                            {/* Dust Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-12 text-[#5c4033]/10 dark:text-white/5 pt-24 font-mono transition-colors duration-1000">
                    <div className="h-px w-24 bg-[#5c4033]/10 dark:bg-white/5 transition-colors duration-1000"></div>
                    <p className="text-[10px] font-black uppercase tracking-[1em]">Analog Memories</p>
                    <div className="h-px w-24 bg-[#5c4033]/10 dark:bg-white/5 transition-colors duration-1000"></div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
