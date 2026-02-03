import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Heart, Sparkles } from "lucide-react";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f9f5f0] dark:from-slate-900 to-transparent transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10">
                <div className="text-center space-y-4">
                    <Sparkles className="text-[#c5a386] h-8 w-8 mx-auto opacity-30 animate-pulse" />
                    <h2 className="font-serif text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Perjalanan Cinta</h2>
                    <p className="tracking-[0.4em] text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">Their Beautiful Story</p>
                </div>

                <div className="relative space-y-20 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-[#d9c5b2] before:opacity-30">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-12 md:gap-24 ${idx % 2 === 1 ? 'flex-reverse md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Dot */}
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c5a386] border-4 border-white dark:border-slate-800 shadow-lg z-10 transition-colors"></div>

                            <div className={`w-full md:w-1/2 space-y-6 ${idx % 2 === 1 ? 'md:text-left' : 'md:text-right text-left'}`}>
                                <div className="space-y-2">
                                    <p className="font-serif text-3xl md:text-4xl text-[#c5a386] italic transition-colors">{story.date}</p>
                                    <h3 className="font-serif text-2xl md:text-3xl text-[#4a3f35] dark:text-stone-200 font-bold transition-colors">{story.title}</h3>
                                </div>
                                <p className="text-slate-500 dark:text-stone-400 italic leading-relaxed md:text-lg transition-colors">
                                    {story.desc}
                                </p>
                            </div>
                            {/* Empty spacer for the other side on desktop */}
                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Heart className="text-[#c5a386] h-6 w-6 mx-auto fill-[#c5a386] animate-bounce" />
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
