import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

const LoveStory: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -rotate-12"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-12">
                    <h2 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-none">The <br /> Log</h2>
                    <div className="text-left md:text-right space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Sequential Connection</p>
                        <p className="text-2xl font-bold uppercase tracking-tight max-w-md ml-auto">A documentation of significant milestones that led us to this union.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-px bg-zinc-800 border-[1px] border-zinc-800">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className="bg-zinc-950 p-12 md:p-20 space-y-12 group hover:bg-zinc-900 transition-all duration-700">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-black text-zinc-700">STORY_{idx + 1}</span>
                                <p className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white/20 group-hover:text-white transition-colors">
                                    {story.date}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{story.title}</h3>
                                <div className="w-12 h-2 bg-white"></div>
                                <p className="text-sm font-medium text-zinc-500 uppercase tracking-tight leading-relaxed line-clamp-4">
                                    {story.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-20 border-t border-zinc-800 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Status: Evolving</p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                        <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
