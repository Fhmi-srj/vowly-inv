import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#0a0a1a] py-24 md:py-48 px-6 md:px-24 text-[#2d2d2d] dark:text-white relative overflow-hidden font-sans transition-colors duration-700">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[radial-gradient(#000_2px,transparent_2px)] dark:bg-[radial-gradient(#2196f3_2px,transparent_2px)] [background-size:40px_40px] transition-all duration-700"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-12 animate-reveal">
                    <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase transform -skew-x-12 transition-all duration-700 drop-shadow-[5px_5px_0_#ffeb3b] dark:drop-shadow-[5px_5px_0_#ff4081]">Meet The Cast</h2>
                    <div className="relative inline-block px-12 py-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[10px_10px_0_#2196f3] dark:shadow-[10px_10px_0_#ff4081] transform rotate-1 transition-all duration-700">
                        <p className="text-sm md:text-xl font-bold italic text-[#2d2d2d] uppercase tracking-widest leading-relaxed">
                            "Every great story needs its heroes."
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 md:gap-40 items-center">
                    {/* Groom Section */}
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] group-hover:shadow-[20px_20px_0_#2196f3] dark:group-hover:shadow-[20px_20px_0_#00e5ff] transition-all duration-700">
                            {/* Comic Panel Style */}
                            <div className="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-[3px] border-[#2d2d2d] dark:border-white transition-colors duration-700">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            {/* Overlay Sticker */}
                            <div className="absolute -bottom-6 -right-6 px-10 py-3 bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#ff4081] rotate-6 group-hover:rotate-0 transition-all">
                                Groom
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black italic tracking-tight leading-none uppercase text-[#2196f3] dark:text-[#00e5ff] transition-colors duration-700">{config.couple.groom.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10 transition-colors">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/30 dark:text-white/30 italic">Son of</p>
                                <p className="text-xl md:text-3xl font-bold italic tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">Mr. {config.couple.groom.parents.split('&')[0]} & Mrs. {config.couple.groom.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#00e5ff] group-hover:shadow-[20px_20px_0_#ff4081] dark:group-hover:shadow-[20px_20px_0_#ff4081] transition-all duration-700">
                            {/* Comic Panel Style */}
                            <div className="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-[3px] border-[#2d2d2d] dark:border-white transition-colors duration-700">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            {/* Overlay Sticker */}
                            <div className="absolute -bottom-6 -right-6 px-10 py-3 bg-[#2196f3] dark:bg-[#ff4081] text-white font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#00e5ff] -rotate-6 group-hover:rotate-0 transition-all">
                                Bride
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black italic tracking-tight leading-none uppercase text-[#ff4081] dark:text-[#ff4081] transition-colors duration-700">{config.couple.bride.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10 transition-colors">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/30 dark:text-white/30 italic">Daughter of</p>
                                <p className="text-xl md:text-3xl font-bold italic tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">Mr. {config.couple.bride.parents.split('&')[0]} & Mrs. {config.couple.bride.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
