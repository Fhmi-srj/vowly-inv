import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart } from "lucide-react";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Soft Floral Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fffafa]/50 dark:bg-slate-900/20 rotate-45 opacity-50 pointer-events-none transition-colors">
                <img src="https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-5xl space-y-24 relative z-10">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <Heart className="text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto animate-pulse fill-[#db7093] dark:fill-[#ff8da1] opacity-20 transition-colors" />
                    <p className="font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed transition-colors">
                        "Maka demi Tuhanmu, Kami pasti akan menanyakan mereka semua, tentang apa yang telah mereka kerjakan dahulu."
                    </p>
                    <p className="text-[10px] tracking-widest font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">— Our Commitment —</p>
                </div>

                <div className="grid md:grid-cols-2 gap-20 items-center">
                    {/* Groom */}
                    <div className="space-y-10 text-center group">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover rounded-full saturate-[0.8]"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.groom.fullName}</h3>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                                <p className="text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">The Groom</p>
                                <div className="h-[1px] w-8 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                            </div>
                            <p className="font-serif text-xl italic text-slate-500 dark:text-stone-400 transition-colors">Putra dari Pasangan</p>
                            <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors">{config.couple.groom.parents}</p>
                        </div>
                    </div>

                    {/* Bride */}
                    <div className="space-y-10 text-center group md:mt-24">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover rounded-full saturate-[0.8]"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.bride.fullName}</h3>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                                <p className="text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">The Bride</p>
                                <div className="h-[1px] w-8 bg-[#ffd1dc] dark:bg-stone-800 transition-colors"></div>
                            </div>
                            <p className="font-serif text-xl italic text-slate-500 dark:text-stone-400 transition-colors">Putri dari Pasangan</p>
                            <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors">{config.couple.bride.parents}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
