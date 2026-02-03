import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-zinc-950 py-24 md:py-48 px-6 md:px-20 overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-32">
                <div className="space-y-8 flex flex-col items-center text-center">
                    <h2 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none">Frames</h2>
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-[2px] bg-black dark:bg-white transition-colors"></div>
                        <p className="text-[10px] font-black uppercase tracking-[1em] dark:text-white transition-colors">Static Motion</p>
                        <div className="w-20 h-[2px] bg-black dark:bg-white transition-colors"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-12 gap-1 mb-px">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${idx === 0 ? "md:col-span-8 md:row-span-2 aspect-video" :
                                idx === 1 ? "md:col-span-4 aspect-square" :
                                    idx === 2 ? "md:col-span-4 aspect-square" :
                                        "md:col-span-3 aspect-square"
                                }`}
                        >
                            <img
                                src={img}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                alt={`Frame ${idx + 1}`}
                            />
                            <div className="absolute inset-x-8 bottom-8 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black dark:bg-zinc-800 px-3 py-1 transition-colors">#{idx + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex md:justify-end">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">End of Session</p>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
