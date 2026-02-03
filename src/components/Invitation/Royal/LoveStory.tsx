import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Star, Sparkle } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Background Motifs */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8d6e1c]/10 dark:via-[#d4af37]/20 to-transparent transition-colors duration-1000"></div>
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center opacity-40">
                        <Star size={24} strokeWidth={1} />
                    </div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000">Romansa</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000">Sekelumit Kisah Cinta Kami</p>
                </div>

                <div className="relative space-y-24 max-w-5xl mx-auto">
                    {/* Visual Timeline Line */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#d4af37]/10 hidden md:block"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Center Icon Point */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-[#fdfcf0] dark:bg-[#2a0202] border border-[#8d6e1c]/30 dark:border-[#d4af37]/50 flex items-center justify-center transition-colors duration-1000">
                                    <div className="w-1 h-1 rounded-full bg-[#8d6e1c] dark:bg-[#d4af37] animate-ping transition-colors duration-1000"></div>
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-8 group transition-all duration-700 hover:-translate-y-2 ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white/50 dark:bg-black/10 backdrop-blur-xl relative overflow-hidden transition-all duration-700 group-hover:border-[#8d6e1c]/40 dark:group-hover:border-[#d4af37]/40 shadow-2xl">
                                    {/* Corner Accents */}
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#d4af37]/30"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#d4af37]/30"></div>

                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-serif italic tracking-tighter text-[#8d6e1c] dark:text-[#d4af37]/80 leading-none transition-colors duration-1000">{story.date}</p>
                                        <h3 className="text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90 leading-none transition-colors duration-1000">{story.title}</h3>
                                    </div>
                                    <div className={`w-12 h-[1px] bg-[#d4af37]/40 my-8 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                    <p className="text-[#8d6e1c]/40 dark:text-[#d4af37]/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase transition-colors duration-1000">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex items-center gap-6 px-12 py-6 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 relative group transition-colors duration-1000">
                        <div className="absolute inset-0 bg-[#8d6e1c]/5 dark:bg-[#d4af37]/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-700"></div>
                        <Sparkle className="text-[#8d6e1c] dark:text-[#d4af37] opacity-60 h-6 w-6 transition-colors duration-1000" size={24} />
                        <p className="text-2xl md:text-3xl font-serif italic tracking-tight text-[#8d6e1c]/80 dark:text-[#d4af37]/80 relative z-10 transition-colors duration-1000">Keabadian Langkah...</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
