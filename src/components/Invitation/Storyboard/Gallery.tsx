import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Camera, Star } from "lucide-react";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-[#050510] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-sans transition-colors duration-700">
            {/* Ink Spatter Decorations */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-[#ff4081]/5 dark:bg-[#ff4081]/20 rounded-full blur-2xl transition-opacity"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#2196f3]/5 dark:bg-[#00e5ff]/20 rounded-full blur-2xl transition-opacity"></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <div className="relative inline-block px-10 py-2 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[8px_8px_0_#2d2d2d] dark:shadow-[8px_8px_0_#ff4081] transform rotate-2 transition-all duration-700">
                        <p className="tracking-[0.6em] text-[10px] font-black uppercase text-[#2d2d2d]">EPISODE: MOMENTS</p>
                    </div>
                    <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 transition-colors duration-700">The Panels</h2>
                    <div className="flex items-center gap-4 text-[#ff4081] dark:text-[#00e5ff] transition-colors">
                        <Star className="fill-current" size={20} />
                        <div className="w-20 h-[3px] bg-[#2d2d2d] dark:bg-white/10 rounded-full transition-colors"></div>
                        <Star className="fill-current" size={20} />
                    </div>
                </div>

                <div className="grid md:grid-cols-4 auto-rows-[350px] gap-8">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-3 shadow-[12px_12px_0_rgba(0,0,0,0.1)] dark:shadow-[12px_12px_0_#ff4081] transition-all duration-700 ${idx === 0 ? "md:col-span-2 md:row-span-2" :
                                idx === 1 ? "md:col-span-2 md:row-span-1" :
                                    "md:col-span-1 md:row-span-1"
                                } hover:shadow-[18px_18px_0_#2196f3] dark:hover:shadow-[18px_18px_0_#00e5ff] hover:-translate-x-1 hover:-translate-y-1 hover:z-20`}
                        >
                            <div className="w-full h-full overflow-hidden border-[2px] border-[#2d2d2d] bg-gray-50">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 group-hover:rotate-1"
                                    alt={`Capture ${idx + 1}`}
                                />
                            </div>

                            {/* Panel Number Label */}
                            <div className="absolute top-6 left-6 px-4 py-1 bg-white dark:bg-[#2d2d2d] border-[2px] border-[#2d2d2d] dark:border-white font-black text-[9px] dark:text-white uppercase shadow-[4px_4px_0_#2d2d2d] dark:shadow-[4px_4px_0_#ff4081] opacity-0 group-hover:opacity-100 transition-all">
                                SCENE #{idx + 1}
                            </div>

                            {/* Flash Effect on Hover */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-12 text-[#2d2d2d]/10 dark:text-white/10 pt-24 transition-colors">
                    <div className="h-[3px] w-24 bg-[#2d2d2d]/10 dark:bg-white/10 rounded-full transition-colors"></div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-[#2d2d2d] dark:text-white">To Be Continued</p>
                    <div className="h-[3px] w-24 bg-[#2d2d2d]/10 dark:bg-white/10 rounded-full transition-colors"></div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
