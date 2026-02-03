import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] transition-colors duration-1000">Kisah Visual</p>
                    <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000">Archives</h2>
                    <div className="w-16 h-px bg-[#2d4a3e]/10 dark:bg-white/10 mx-auto transition-colors duration-1000"></div>
                </div>

                <div className="grid md:grid-cols-4 auto-rows-[350px] gap-6">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden rounded-[4rem] border border-[#2d4a3e]/5 dark:border-white/5 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 p-4 shadow-sm transition-all duration-1000 ${idx === 0 ? "md:col-span-2 md:row-span-2" :
                                idx === 1 ? "md:col-span-2 md:row-span-1" :
                                    "md:col-span-1 md:row-span-1"
                                }`}
                        >
                            <div className="w-full h-full overflow-hidden rounded-[3rem]">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover saturate-[0.9] brightness-[1.02] group-hover:saturate-100 group-hover:brightness-100 transition-all duration-[2s] group-hover:scale-110"
                                    alt={`Capture ${idx + 1}`}
                                />
                            </div>
                            <div className="absolute inset-x-8 bottom-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0 text-white relative z-10">
                                <span className="bg-[#2d4a3e]/80 backdrop-blur-md px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg">View Moments</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex md:justify-center items-center gap-12 text-[#2d4a3e]/10 dark:text-white/5 pt-24 transition-colors duration-1000">
                    <div className="h-px w-24 bg-[#2d4a3e]/10 dark:bg-white/5 transition-colors duration-1000"></div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] transition-colors duration-1000">Cinta Dalam Doa</p>
                    <div className="h-px w-24 bg-[#2d4a3e]/10 dark:bg-white/5 transition-colors duration-1000"></div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
