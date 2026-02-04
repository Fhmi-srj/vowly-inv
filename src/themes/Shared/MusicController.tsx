import { useState, useEffect } from "react";
import type { FC } from "react";
import { Music, Play } from "lucide-react";

const MusicController: FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        window.addEventListener("play-wedding-music", handlePlay);
        window.addEventListener("pause-wedding-music", handlePause);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("play-wedding-music", handlePlay);
            window.removeEventListener("pause-wedding-music", handlePause);
        };
    }, []);

    const toggleMusic = () => {
        window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className={`transition-all duration-1000 transform ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
        >
            <button
                onClick={toggleMusic}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-[#d9c5b2] dark:border-white/10 shadow-xl transition-all hover:scale-110"
            >
                {/* Vinyl Disk Visual */}
                <div
                    className={`absolute inset-1 rounded-full border border-[#d9c5b2]/30 dark:border-white/5 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                        }`}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#c5a386]"></div>
                </div>

                <div className="relative z-10 text-[#4a3f35] dark:text-stone-200">
                    {isPlaying ? (
                        <div className="relative">
                            <Music className="h-4 w-4" />
                            <div className="absolute -top-1 -right-2 text-[7px] font-black">ON</div>
                        </div>
                    ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                    )}
                </div>
            </button>
        </div>
    );
};

export default MusicController;
