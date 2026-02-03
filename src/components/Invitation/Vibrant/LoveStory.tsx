import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Smile, Zap, Sparkles, Heart } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-white dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000">
            {/* Geometric Accents */}
            <div className="absolute top-20 right-20 w-40 h-40 border-[1.5rem] border-blue-600 rounded-full opacity-5"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500 rotate-12 opacity-5"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="text-center space-y-8 flex flex-col items-center">
                    <div className="bg-blue-600 text-white px-10 py-4 rounded-full border-4 border-black dark:border-white/20 rotate-1 shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] transition-all">
                        <h2 className="text-5xl md:text-[7rem] font-black uppercase tracking-tighter italic leading-none">Fun Timeline</h2>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <Zap className="text-yellow-400 fill-yellow-400 h-8 w-8" />
                        <p className="tracking-[0.8em] text-[10px] font-black text-zinc-400 uppercase italic">How it all exploded!</p>
                        <Zap className="text-yellow-400 fill-yellow-400 h-8 w-8" />
                    </div>
                </div>

                <div className="relative space-y-40">
                    {/* Visual Connector Line */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-black hidden md:block opacity-[0.05]"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Center Icon Point */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 flex items-center justify-center shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] rotate-12 transition-all">
                                    {idx % 2 === 0 ? <Smile className="text-blue-600" /> : <Sparkles className="text-pink-500" />}
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-10 group transition-all duration-700 hover:-translate-y-4 ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className={`p-12 md:p-16 rounded-[4rem] border-4 border-black dark:border-white/20 bg-zinc-50 dark:bg-slate-900 shadow-[15px_15px_0_#000] dark:shadow-[15px_15px_0_rgba(255,255,255,0.05)] group-hover:shadow-[15px_15px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                                    <div className="space-y-4">
                                        <p className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-blue-600 leading-none">{story.date}</p>
                                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none transition-colors">{story.title}</h3>
                                    </div>
                                    <div className={`w-12 h-2 bg-pink-500 my-8 rounded-full ${idx % 2 === 0 ? 'ml-auto' : ''}`}></div>
                                    <p className="text-zinc-500 font-bold uppercase text-sm tracking-tight leading-relaxed italic">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex items-center gap-6 bg-black dark:bg-slate-900 text-white px-12 py-8 rounded-[3rem] shadow-[15px_15px_0_#fbd38d] dark:shadow-[15px_15px_0_#3b82f6] -rotate-1 transition-all">
                        <Heart className="text-pink-500 fill-pink-500 animate-pulse h-10 w-10" />
                        <p className="text-4xl font-black uppercase italic tracking-tighter">Stay Tuned!</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
