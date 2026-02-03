import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Sparkles, Film } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-[#3d2b22] dark:bg-[#0a0a0a] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            {/* Background Film Strips */}
            <div className="absolute inset-x-0 top-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10 transition-colors duration-1000">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-4 h-8 border-x border-white/20 dark:border-white/5 transition-colors duration-1000"></div>
                ))}
            </div>
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-16 h-[1px] bg-[#f4ecd8]/20 dark:bg-white/10 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[11rem] italic tracking-tighter leading-none text-[#f4ecd8] dark:text-[#d4c3a1]/90 transition-colors duration-1000 drop-shadow-2xl opacity-90">The Archives</h2>
                    <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono">Our History Logged</p>
                </div>

                <div className="relative space-y-24 max-w-5xl mx-auto">
                    {/* Film Reel Verticals */}
                    <div className="absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-4 bg-black/10 border-x border-white/5 hidden md:block"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Film Marker */}
                            <div className="absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-12 h-8 bg-[#3d2b22] border-y-2 border-[#c5a059]/40 flex items-center justify-center shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></div>
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 dark:border-white/5 rounded-sm relative overflow-hidden transition-all duration-700 hover:bg-[#f4ecd8]/10 dark:hover:bg-white/10 hover:border-[#c5a059]/30 shadow-2xl">
                                    <div className="space-y-6">
                                        <p className="text-4xl md:text-5xl italic tracking-tighter text-[#c5a059] leading-none font-black italic">{story.date}</p>
                                        <h3 className="text-2xl md:text-3xl italic tracking-tight text-[#f4ecd8]/80 dark:text-[#d4c3a1]/80 leading-none font-mono uppercase tracking-widest transition-colors duration-1000">{story.title}</h3>
                                    </div>
                                    <div className={`w-16 h-[1px] bg-[#c5a059]/30 dark:bg-[#c5a059]/10 my-10 ${idx % 2 === 0 ? 'md:ml-auto' : ''} transition-colors duration-1000`}></div>
                                    <p className="text-[#f4ecd8]/30 dark:text-[#d4c3a1]/30 font-mono text-xs uppercase tracking-[0.1em] leading-relaxed italic transition-colors duration-1000">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex flex-col items-center gap-8 group">
                        <Film className="text-[#c5a059] opacity-30 h-10 w-10 transition-transform group-hover:rotate-180 duration-[2s]" />
                        <p className="text-3xl md:text-5xl italic tracking-tight text-[#f4ecd8]/40">To Be Continued In The Next Reel...</p>
                    </div>
                </div>
            </div>

            {/* Bottom Film Strip */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10 transition-colors duration-1000">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-4 h-8 border-x border-white/20 dark:border-white/5 transition-colors duration-1000"></div>
                ))}
            </div>
        </section>
    );
};

export default LoveStory;
