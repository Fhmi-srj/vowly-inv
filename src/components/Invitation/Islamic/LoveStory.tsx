import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Sparkles } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-[#fdfbf7] dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Background Patterns */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] transition-opacity duration-1000"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-12 h-px bg-[#c5a059]/40 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000">The Hikayat</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic transition-colors duration-1000">Sekelumit Perjalanan Kasih</p>
                </div>

                <div className="relative space-y-20 max-w-4xl mx-auto">
                    {/* Spiritual Path Line */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent hidden md:block transition-colors duration-1000"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Center Path Marker */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-10 h-10 bg-white dark:bg-[#0c2c1e] rounded-full border border-[#2d4a3e]/5 dark:border-white/5 flex items-center justify-center shadow-sm transition-colors duration-1000">
                                    <Star size={12} className="text-[#c5a059]" />
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 shadow-sm">
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-serif italic tracking-tighter text-[#c5a059] leading-none transition-colors duration-1000">{story.date}</p>
                                        <h3 className="text-2xl md:text-3xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 leading-none transition-colors duration-1000">{story.title}</h3>
                                    </div>
                                    <div className={`w-12 h-[1px] bg-[#2d4a3e]/10 dark:bg-white/10 my-10 transition-colors duration-1000 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                    <p className="text-[#2d4a3e]/40 dark:text-white/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase transition-colors duration-1000">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex flex-col items-center gap-6 group">
                        <Sparkles className="text-[#c5a059] opacity-40 h-8 w-8 animate-pulse transition-opacity duration-1000" />
                        <p className="text-3xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e]/60 dark:text-white/60 transition-colors duration-1000">Walimatul 'Ursy Nan Berkah...</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
