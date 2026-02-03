import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart, Sparkles, Star } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Watercolor Accents */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white dark:from-slate-900 to-transparent transition-colors"></div>
            <div className="absolute -left-32 top-1/2 w-96 h-96 bg-[#ffd1dc] opacity-10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto max-w-5xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Star className="text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Our Love Story</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#db7093] opacity-30"></div>
                        <p className="tracking-[0.6em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">A Beautiful Journey</p>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#db7093] dark:to-[#ff8da1] opacity-30 transition-colors"></div>
                    </div>
                </div>

                <div className="space-y-32 relative before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#db7093]/20 before:to-transparent">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Elegant Center Icon */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-800 border border-[#db7093] dark:border-[#ff8da1] shadow-lg shadow-[#db7093]/20 transition-colors"></div>
                                <div className="w-1 h-12 bg-gradient-to-b from-[#db7093]/30 to-transparent"></div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-8 bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-[#ffd1dc]/10 shadow-2xl transition-all hover:-translate-y-2 duration-1000 ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="space-y-2">
                                    <p className="font-serif text-4xl md:text-5xl text-[#db7093] dark:text-[#ff8da1] italic tracking-tight transition-colors">{story.date}</p>
                                    <h3 className="font-serif text-3xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors">{story.title}</h3>
                                </div>
                                <div className={`w-12 h-0.5 bg-[#db7093] opacity-30 ${idx % 2 === 0 ? 'ml-auto' : ''}`}></div>
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
                    <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-900 px-10 py-6 rounded-full border border-[#ffd1dc]/20 dark:border-white/5 shadow-xl transition-all">
                        <Heart className="text-[#db7093] dark:text-[#ff8da1] h-6 w-6 fill-[#db7093] dark:fill-[#ff8da1] animate-pulse transition-colors" />
                        <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">To be continued...</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
