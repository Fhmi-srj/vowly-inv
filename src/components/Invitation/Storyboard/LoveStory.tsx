import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Zap, BoomBox } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-white dark:bg-[#050510] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            {/* Dynamic Storyboard Path */}
            <div className="absolute inset-x-0 top-0 h-full opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(45deg,#2d2d2d_1px,transparent_1px),linear-gradient(-45deg,#2d2d2d_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,#ff4081_1px,transparent_1px),linear-gradient(-45deg,#ff4081_1px,transparent_1px)] [background-size:60px_60px] transition-all duration-700"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-12 py-2 shadow-[8px_8px_0_#ff4081] dark:shadow-[8px_8px_0_#ff4081] transform -rotate-1 transition-all duration-700">
                        <p className="tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]">THE BACKSTORY</p>
                    </div>
                    <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[10px_10px_0_#2196f3] dark:drop-shadow-[10px_10px_0_#ff4081] transition-all duration-700">Chronicles</h2>
                    <div className="w-20 h-[5px] bg-[#2d2d2d] dark:bg-[#00e5ff] rounded-full mx-auto transition-colors duration-700"></div>
                </div>

                <div className="relative space-y-32 max-w-5xl mx-auto">
                    {/* Visual Narrative Line */}
                    <div className="absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-[6px] bg-[#2d2d2d]/10 dark:bg-[#00e5ff]/20 rounded-full hidden md:block transition-colors"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            {/* Chapter Marker */}
                            <div className="absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white dark:bg-[#0a0a1a] border-[4px] border-[#2d2d2d] dark:border-white rounded-full flex items-center justify-center shadow-[6px_6px_0_#ffeb3b] dark:shadow-[6px_6px_0_#ff4081] group hover:scale-125 transition-all group-hover:rotate-12">
                                    <Zap size={24} className="text-[#2d2d2d] dark:text-[#ffeb3b] fill-[#ffeb3b] dark:fill-[#ffeb3b]/20" strokeWidth={3} />
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white rounded-none relative overflow-hidden transition-all duration-700 hover:shadow-[15px_15px_0_#2196f3] dark:hover:shadow-[15px_15px_0_#00e5ff] hover:-translate-y-2">
                                    <div className="space-y-6">
                                        <div className="inline-block px-10 py-1 bg-[#ff4081] text-white font-black italic text-4xl leading-none shadow-[6px_6px_0_#2d2d2d] transform -rotate-1">
                                            {story.date}
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 italic transition-colors">{story.title}</h3>
                                    </div>
                                    <div className={`w-20 h-[3px] bg-[#2d2d2d]/10 dark:bg-white/10 my-12 ${idx % 2 === 0 ? 'md:ml-auto' : ''} transition-colors`}></div>
                                    <div className="relative p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 dark:border-white/20 rounded-xl group-hover:bg-[#2196f3]/5 dark:group-hover:bg-[#00e5ff]/5 transition-colors">
                                        <p className="text-[#2d2d2d]/60 dark:text-white/60 font-black italic text-xs uppercase tracking-[0.1em] leading-relaxed transition-colors">
                                            {story.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-[#ffeb3b] blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                        <div className="relative flex flex-col items-center gap-10">
                            <Star className="text-[#ff4081] h-12 w-12 fill-current animate-spin-slow" strokeWidth={3} />
                            <p className="text-4xl md:text-7xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#2196f3] dark:drop-shadow-[5px_5px_0_#ff4081] transition-all">To Be Continued In Real Life...</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
