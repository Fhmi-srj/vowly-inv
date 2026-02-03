import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Sun } from "lucide-react";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Terracotta Splash Decor */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#e2725b]/5 dark:bg-[#e2725b]/2 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors"></div>

            <div className="container mx-auto max-w-6xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Sun className="text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-20 transition-colors" />
                    <p className="font-serif text-2xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed max-w-3xl mx-auto transition-colors">
                        "Two souls, one heart. A journey that began with flowers and continues with stars."
                    </p>
                    <div className="w-20 h-[1px] bg-[#e2725b] mx-auto opacity-30"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-24 items-center">
                    {/* Groom */}
                    <div className="space-y-12 text-center group">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700"></div>
                            <div className="relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">The Groom</p>
                            <h3 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.groom.fullName}</h3>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors">Putra dari Pasangan</p>
                                <p className="font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride */}
                    <div className="space-y-12 text-center group md:mt-40">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700"></div>
                            <div className="relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">The Bride</p>
                            <h3 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.bride.fullName}</h3>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors">Putri dari Pasangan</p>
                                <p className="font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
