import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 text-[#2d4a3e] dark:text-white/90 relative overflow-hidden transition-colors duration-1000">
            {/* Subtle Geometric Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fdfbf7] dark:bg-[#0c2c1e] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-10 animate-reveal">
                    <h2 className="text-5xl md:text-8xl font-serif italic tracking-tight leading-none dark:text-white transition-colors duration-1000">The Mempelai</h2>
                    <p className="text-sm md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed border-y border-[#2d4a3e]/5 dark:border-white/5 py-10 transition-colors duration-1000">
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." <br />
                        <span className="text-[#c5a059] dark:text-[#c5a059] mt-4 block text-xs md:text-sm font-bold uppercase tracking-widest">( QS. Ar-Rum: 21 )</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-center">
                    {/* Groom Section */}
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700">
                            {/* Geometric Border Layer */}
                            <div className="absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem] transition-colors duration-1000"></div>
                            <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative z-10">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]">The Groom</span>
                            <h3 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white transition-colors duration-1000">{config.couple.groom.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5 transition-colors duration-1000">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40 transition-colors duration-1000">Putra Dari</p>
                                <p className="text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all duration-1000">Bpk. {config.couple.groom.parents.split('&')[0]} & Ibu {config.couple.groom.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700">
                            <div className="absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem] transition-colors duration-1000"></div>
                            <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative z-10">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]">The Bride</span>
                            <h3 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white transition-colors duration-1000">{config.couple.bride.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5 transition-colors duration-1000">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40 transition-colors duration-1000">Putri Dari</p>
                                <p className="text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all duration-1000">Bpk. {config.couple.bride.parents.split('&')[0]} & Ibu {config.couple.bride.parents.split('&')[1]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
