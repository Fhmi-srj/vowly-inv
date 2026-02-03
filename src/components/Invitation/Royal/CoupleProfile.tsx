import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 text-[#8d6e1c] dark:text-[#d4af37] relative overflow-hidden transition-colors duration-1000">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')]"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-8">
                    <h2 className="text-5xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/40 dark:to-white/40 transition-all duration-1000">Sang Mempelai</h2>
                    <div className="w-24 h-[1px] bg-[#d4af37] mx-auto opacity-30"></div>
                    <p className="text-sm md:text-lg font-serif italic text-[#d4af37]/60 max-w-2xl mx-auto leading-relaxed">
                        "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, binalah rumah tangga kami dengan ikatan pusaka-Mu."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    {/* Groom Section */}
                    <div className="space-y-16 group flex flex-col items-center md:items-start">
                        <div className="relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]">
                            <div className="w-full h-full overflow-hidden rounded-t-[9.5rem]">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            {/* Gold Ornament Overlay */}
                            <div className="absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none"></div>
                        </div>
                        <div className="space-y-8 text-center md:text-left">
                            <h3 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">{config.couple.groom.fullName}</h3>
                            <div className="h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:mx-0"></div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37]/40">Putra dari Pasangan</p>
                                <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group flex flex-col items-center md:items-end md:mt-32">
                        <div className="relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]">
                            <div className="w-full h-full overflow-hidden rounded-t-[9.5rem]">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            <div className="absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none"></div>
                        </div>
                        <div className="space-y-8 text-center md:text-right">
                            <h3 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">{config.couple.bride.fullName}</h3>
                            <div className="h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:ml-auto md:mr-0"></div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37]/40">Putri dari Pasangan</p>
                                <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Branding */}
                <div className="hidden lg:block absolute top-1/2 left-4 -translate-y-1/2 [writing-mode:vertical-rl] opacity-10">
                    <p className="text-[10px] font-black uppercase tracking-[2em]">Royal Heritage — Eternal Bond</p>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
