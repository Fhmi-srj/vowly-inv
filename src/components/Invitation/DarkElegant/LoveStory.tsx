import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Zap } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Constellation Pattern */}
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 opacity-0 dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-12">
                    <div className="space-y-6">
                        <Zap className="text-emerald-500 h-10 w-10" strokeWidth={1.5} />
                        <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Timeline</h2>
                    </div>
                    <div className="text-left md:text-right space-y-4 max-w-xl">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500">Chronicle of Aura</p>
                        <p className="text-2xl font-serif italic tracking-tight text-black/40 dark:text-white/40 italic transition-colors duration-1000">A documentation of monumental sequences leading to this formal union.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className="group relative">
                            {/* Elegant Border Card */}
                            <div className="absolute inset-0 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all duration-700 group-hover:bg-emerald-500/5 group-hover:border-emerald-500/20"></div>

                            <div className="relative p-12 md:p-16 space-y-12 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-emerald-500/30 uppercase tracking-[0.4em]">FRAGMENT_0{idx + 1}</span>
                                    <div className="text-right">
                                        <p className="text-5xl md:text-7xl font-serif italic tracking-tighter text-black/10 dark:text-white/20 group-hover:text-emerald-500 transition-colors duration-700">
                                            {story.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-4xl md:text-5xl font-serif italic tracking-tighter leading-tight text-black/80 dark:text-white/80 transition-colors duration-1000">{story.title}</h3>
                                    <div className="h-[2px] w-20 bg-emerald-500/30"></div>
                                    <p className="text-sm font-medium text-black/30 dark:text-white/30 uppercase tracking-tight leading-relaxed italic line-clamp-4 transition-colors duration-1000">
                                        {story.desc}
                                    </p>
                                </div>

                                <div className="pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <Star className="text-emerald-500 h-6 w-6" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 flex justify-center">
                    <div className="flex items-center gap-12 text-white/10">
                        <div className="h-px w-24 bg-white/10"></div>
                        <p className="text-[10px] font-black uppercase tracking-[1.5em]">The Sequence Continues</p>
                        <div className="h-px w-24 bg-white/10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
