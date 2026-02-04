import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

interface AutoScrollControllerProps {
    isOpened: boolean;
}

const AutoScrollController: FC<AutoScrollControllerProps> = ({ isOpened }) => {
    const [isActive, setIsActive] = useState(false);
    const scrollRef = useRef<number | null>(null);

    const startAutoScroll = () => {
        const scroll = () => {
            window.scrollBy({ top: 1, behavior: "auto" });
            scrollRef.current = requestAnimationFrame(scroll);
        };
        scrollRef.current = requestAnimationFrame(scroll);
    };

    const stopAutoScroll = () => {
        if (scrollRef.current) {
            cancelAnimationFrame(scrollRef.current);
            scrollRef.current = null;
        }
    };

    useEffect(() => {
        if (isActive) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }
        return () => stopAutoScroll();
    }, [isActive]);

    const toggleScroll = () => {
        setIsActive(!isActive);
    };

    if (!isOpened) return null;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
            <button
                onClick={toggleScroll}
                className={`group flex h-16 w-10 flex-col items-center justify-center gap-1 rounded-tl-xl rounded-tr-sm rounded-bl-sm rounded-br-xl border border-white/20 shadow-xl transition-all duration-500 hover:scale-105 backdrop-blur-md ${isActive
                    ? "bg-accent text-white"
                    : "bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-white"
                    }`}
            >
                <RefreshCw className={`h-5 w-5 ${isActive ? "animate-spin" : ""}`} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Auto</span>
                <ChevronDown className={`h-3 w-3 opacity-50 transition-transform ${isActive ? "rotate-180" : ""}`} />
            </button>
        </div>
    );
};

export default AutoScrollController;
