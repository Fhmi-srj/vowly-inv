import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart } from "lucide-react";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-5xl space-y-24 relative z-10">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Heart className="text-[#c5a386] dark:text-[#d9c5b2] h-8 w-8 mx-auto animate-pulse transition-colors" />
                    <p className="font-serif text-2xl md:text-3xl text-slate-500 dark:text-stone-300 italic leading-relaxed transition-colors">
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
                    </p>
                    <p className="text-[10px] tracking-widest font-black text-[#8c7851] dark:text-[#c5a386] uppercase underline decoration-[#d9c5b2] dark:decoration- stone-700 underline-offset-8 transition-colors">Ar-Rum: 21</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                    {/* Groom */}
                    <div className="space-y-8 text-center group">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute inset-0 border-2 border-[#d9c5b2] translate-x-4 translate-y-4 rounded-3xl transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                            <img
                                src={config.couple.groom.image}
                                className="relative z-10 w-64 md:w-80 h-96 md:h-[30rem] object-cover rounded-3xl shadow-xl grayscale hover:grayscale-0 transition-all duration-1000"
                                alt={config.couple.groom.fullName}
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">{config.couple.groom.fullName}</h3>
                            <div className="h-[1px] w-12 bg-[#c5a386] mx-auto opacity-50"></div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase mb-1 transition-colors">Putra dari Pasangan</p>
                                <p className="font-serif text-xl italic text-slate-600 dark:text-stone-400 transition-colors">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride */}
                    <div className="space-y-8 text-center group md:mt-24">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute inset-0 border-2 border-[#d9c5b2] -translate-x-4 translate-y-4 rounded-3xl transition-transform group-hover:-translate-x-2 group-hover:translate-y-2"></div>
                            <img
                                src={config.couple.bride.image}
                                className="relative z-10 w-64 md:w-80 h-96 md:h-[30rem] object-cover rounded-3xl shadow-xl grayscale hover:grayscale-0 transition-all duration-1000"
                                alt={config.couple.bride.fullName}
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">{config.couple.bride.fullName}</h3>
                            <div className="h-[1px] w-12 bg-[#c5a386] mx-auto opacity-50"></div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase mb-1 transition-colors">Putri dari Pasangan</p>
                                <p className="font-serif text-xl italic text-slate-600 dark:text-stone-400 transition-colors">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
