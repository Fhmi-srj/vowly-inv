import * as React from "react";
import { MoveRight, Star } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfbf7] overflow-hidden text-[#2d4a3e]">
            {/* Islamic Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Ornamental Frame */}
            <div className="absolute inset-8 md:inset-16 border border-[#2d4a3e]/10 pointer-events-none"></div>
            <div className="absolute inset-10 md:inset-20 border-2 border-[#c5a059]/20 pointer-events-none"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                <div className="space-y-4">
                    <Star className="text-[#c5a059] mx-auto opacity-40" size={32} strokeWidth={1} />
                    <p className="tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#2d4a3e]/60">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059]">The Sacred Union of</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#2d4a3e]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent"></div>

                <div className="space-y-8 bg-white/50 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-[#2d4a3e]/5 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e]">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-5 bg-[#2d4a3e] text-white font-bold uppercase text-[10px] tracking-[0.4em] rounded-full hover:bg-[#1e332a] transition-all shadow-xl active:scale-95"
                    >
                        Buka Undangan
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#2d4a3e]/20 uppercase">Walimatul 'Ursy</p>
            </div>
        </div>
    );
};

export default Envelope;
