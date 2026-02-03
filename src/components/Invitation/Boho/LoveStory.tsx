import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart, Sun, Star } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert rotate-12 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e2725b]/5 rounded-full blur-[120px]"></div>

            <div className="container mx-auto max-w-5xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Star className="text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Our Soul Connection</h2>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#e2725b] opacity-30"></div>
                        <p className="tracking-[0.8em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">Timeline of Togetherness</p>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#e2725b] opacity-30 transition-colors"></div>
                    </div>
                </div>

                <div className="relative space-y-32 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-[#c19a6b]/10 dark:before:bg-white/5 transition-colors">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Center Point */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-stone-800 border-2 border-[#e2725b] shadow-2xl flex items-center justify-center transition-colors">
                                <div className="w-2 h-2 rounded-full bg-[#e2725b] animate-ping"></div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-8 bg-[#faf7f2] dark:bg-stone-950 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-2xl transition-all duration-1000 hover:-translate-y-4 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="space-y-3">
                                    <p className="font-serif text-4xl md:text-5xl text-[#e2725b] italic tracking-tight transition-colors">{story.date}</p>
                                    <h3 className="font-serif text-3xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 font-black tracking-tight group-hover:text-[#e2725b] transition-colors">{story.title}</h3>
                                </div>
                                <div className={`w-12 h-1 bg-[#c19a6b] opacity-20 rounded-full ${idx % 2 === 0 ? 'ml-auto' : ''}`}></div>
                                <p className="text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">
                                    {story.desc}
                                </p>
                            </div>

                            {/* Spacer for desktop */}
                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-20">
                    <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-20 animate-spin-slow" />
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
