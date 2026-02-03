import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Smile, Sparkles } from "lucide-react";

const CoupleProfile: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-slate-900 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white relative overflow-hidden transition-colors duration-1000">
            {/* Pop Art Dots */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ backgroundImage: 'radial-gradient(#ec4899 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="grid md:grid-cols-2 gap-20 md:gap-32 items-center">
                    {/* Groom Section */}
                    <div className="space-y-12">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-yellow-400 -rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500"></div>
                            <div className="relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            <div className="absolute -top-10 -right-10 bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 rotate-12 z-20 transition-all">
                                <Smile className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic transition-colors">{config.couple.groom.fullName}</h2>
                            <div className="flex items-center gap-4">
                                <div className="h-1.5 w-12 bg-pink-500 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">The Groom</p>
                            </div>
                            <div className="pt-6 space-y-1">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic">Son of</p>
                                <p className="text-3xl font-black uppercase tracking-tighter text-blue-600">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-12 md:mt-48">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-500 rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500"></div>
                            <div className="relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-yellow-400 text-black w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 -rotate-12 z-20 transition-all">
                                <Sparkles className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic transition-colors">{config.couple.bride.fullName}</h2>
                            <div className="flex items-center gap-4">
                                <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">The Bride</p>
                            </div>
                            <div className="pt-6 space-y-1">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic">Daughter of</p>
                                <p className="text-3xl font-black uppercase tracking-tighter text-pink-500">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-block bg-zinc-100 dark:bg-slate-800 p-12 rounded-[3.5rem] rotate-1 transition-colors">
                        <p className="text-3xl font-black uppercase italic tracking-tighter max-w-2xl">
                            "When our worlds collided, it was a explosion of colors and joy!"
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
