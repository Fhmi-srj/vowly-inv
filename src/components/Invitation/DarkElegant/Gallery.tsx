import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500">Visual Archives</p>
                    <h2 className="text-8xl md:text-[14rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Celestial</h2>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                </div>

                <div className="grid md:grid-cols-12 auto-rows-[400px] gap-6">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-3 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000 ${idx === 0 ? "md:col-span-8 md:row-span-1" :
                                idx === 1 ? "md:col-span-4 md:row-span-2" :
                                    idx === 2 ? "md:col-span-4 md:row-span-1" :
                                        "md:col-span-4 md:row-span-1"
                                }`}
                        >
                            <div className="w-full h-full overflow-hidden rounded-[2rem]">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 group-hover:brightness-125"
                                    alt={`Capture ${idx + 1}`}
                                />
                            </div>
                            <div className="absolute inset-x-12 bottom-12 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                                <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Aura_0{idx + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex md:justify-end items-center gap-6 opacity-20">
                    <div className="h-px w-20 bg-white"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Still Life in Motion</p>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
