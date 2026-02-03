import * as React from "react";
import { MoveRight, Zap } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfaf0] dark:bg-slate-950 overflow-hidden text-[#2d2d2d] dark:text-slate-100 font-sans transition-colors duration-1000">
            {/* Halftone / Comic Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

            {/* Ink Border */}
            <div className="absolute inset-8 md:inset-16 border-[4px] border-[#2d2d2d] dark:border-blue-500 rounded-[2rem] pointer-events-none shadow-[10px_10px_0_rgba(0,0,0,0.1)] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] transition-all duration-1000"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                {/* Speech Bubble Greeting */}
                <div className="relative bg-white dark:bg-slate-900 border-[3px] border-[#2d2d2d] dark:border-blue-400 px-10 py-5 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.1)] group transition-all duration-1000">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#2d2d2d] dark:text-blue-100 transition-colors duration-1000">NEW ISSUE: THE BIG DAY!</p>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-900 border-r-[3px] border-b-[3px] border-[#2d2d2d] dark:border-blue-400 rotate-45 group-hover:bg-[#ffeb3b] dark:group-hover:bg-blue-600 transition-colors duration-300"></div>
                </div>

                <div className="space-y-6">
                    <p className="text-sm font-black uppercase tracking-[0.5em] text-[#ff4081] dark:text-pink-500 transition-colors duration-1000">Starring</p>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase italic transform -skew-x-6 transition-colors duration-1000">
                        {config.couple.groom.name} <span className="not-italic text-2xl md:text-5xl text-[#2196f3] dark:text-blue-400 mx-2 transition-colors duration-1000">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-[4px] bg-[#2d2d2d] dark:bg-blue-500 rounded-full transition-colors duration-1000"></div>

                <div className="space-y-8 bg-white dark:bg-slate-900 border-[4px] border-[#2d2d2d] dark:border-blue-600 p-12 md:p-20 rounded-[3rem] shadow-[15px_15px_0_rgba(33,150,243,0.3)] dark:shadow-[15px_15px_0_rgba(139,92,246,0.3)] relative group overflow-hidden transition-all duration-1000">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ffeb3b]/20 dark:bg-pink-500/10 rounded-full blur-2xl group-hover:bg-[#ffeb3b]/40 dark:group-hover:bg-pink-500/20 transition-colors"></div>

                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/40 dark:text-slate-500 italic transition-colors duration-1000">Exclusive Access For:</p>
                        <h2 className="text-4xl md:text-7xl font-black italic tracking-tight text-[#2d2d2d] dark:text-white uppercase transition-colors duration-1000">
                            {guestName || "VIP GUEST"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-[#2196f3] dark:bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] border-[4px] border-[#2d2d2d] dark:border-white shadow-[8px_8px_0_#2d2d2d] dark:shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 mx-auto"
                    >
                        START THE STORY
                        <Zap className="fill-white group-hover:animate-bounce" size={18} />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[1em] font-black text-[#2d2d2d]/20 dark:text-slate-500 uppercase transition-colors duration-1000">A Love Journey Storyboard</p>
            </div>
        </div>
    );
};

export default Envelope;
