import * as React from "react";
import { Mail, MoveRight } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#4a0404] overflow-hidden text-[#d4af37]">
            {/* Traditional Batik Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')]"></div>

            {/* Elegant Gold Borders */}
            <div className="absolute inset-4 md:inset-8 border-[1px] border-[#d4af37]/30 pointer-events-none"></div>
            <div className="absolute inset-6 md:inset-12 border-[3px] border-[#d4af37]/20 pointer-events-none"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                {/* Royal Crest / Logo Area */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-[#d4af37]/20 animate-pulse"></div>
                    <span className="text-4xl md:text-5xl font-serif italic">{config.couple.groom.name[0]}{config.couple.bride.name[0]}</span>
                </div>

                <div className="space-y-6">
                    <p className="tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#d4af37]/80">The Honorable Wedding of</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#f9d976] via-[#d4af37] to-[#8d6e1c]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/60 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="text-3xl md:text-5xl font-serif italic tracking-tight text-white/90">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-4 px-12 py-5 bg-gradient-to-b from-[#d4af37] to-[#8d6e1c] text-maroon-900 font-bold uppercase text-[10px] tracking-[0.3em] rounded-md hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all active:scale-95 text-black"
                    >
                        <Mail size={16} />
                        Buka Undangan
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#d4af37]/40 uppercase">Exclusive Invitation</p>
            </div>
        </div>
    );
};

export default Envelope;
