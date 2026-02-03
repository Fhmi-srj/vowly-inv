import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Sparkles, Camera } from "lucide-react";

const Gallery: React.FC = () => {
    const { config } = useSettings();

    return (
        <section id="gallery" className="bg-white dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 overflow-hidden relative transition-colors duration-1000">
            {/* Pop Pattern Decor */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ec4899 4px, transparent 4px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto max-w-7xl space-y-24 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <Camera className="text-blue-600 h-10 w-10 mx-auto md:mx-0 animate-pulse" />
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none italic dark:text-white transition-colors">Gallery</h2>
                    </div>
                    <div className="bg-yellow-400 text-black p-8 border-4 border-black dark:border-white/20 -rotate-2 hidden md:block transition-all">
                        <p className="text-xl font-black uppercase tracking-tighter italic">Captured Moments of Us!</p>
                    </div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {config.galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group overflow-hidden border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[15px_15px_0_#3b82f6] hover:shadow-[15px_15px_0_#ec4899] transition-all duration-700 bg-zinc-100 dark:bg-slate-900 ${idx % 3 === 0 ? 'aspect-square rotate-1' : idx % 3 === 1 ? 'aspect-video -rotate-1' : 'aspect-square rotate-2'}`}
                        >
                            <img
                                src={img}
                                className="w-full h-full object-cover saturate-[1.1] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-3"
                                alt={`Pic ${idx + 1}`}
                            />
                            <div className="absolute inset-x-8 bottom-8 flex justify-between items-end translate-y-20 group-hover:translate-y-0 transition-all duration-700">
                                <div className="bg-black dark:bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                                    <Sparkles size={14} className="text-yellow-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">#{idx + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-12">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-300">Infinite Loops of Love</p>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
