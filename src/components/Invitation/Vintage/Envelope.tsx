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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ecd8] overflow-hidden text-[#5c4033]">
            {/* Old Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]"></div>
            <div className="absolute inset-0 bg-[#704214]/5 mix-blend-multiply"></div>

            {/* Distressed Border */}
            <div className="absolute inset-8 md:inset-16 border-[12px] border-[#5c4033]/10 border-double pointer-events-none"></div>

            {/* Vintage Stamps / Philately Accents */}
            <div className="absolute top-12 right-12 md:top-24 md:right-24 rotate-12 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                <div className="w-24 h-32 md:w-32 md:h-40 bg-white p-2 border-2 border-dashed border-[#5c4033]/30 shadow-lg flex flex-col items-center justify-center text-center">
                    <div className="w-full h-2/3 bg-[#5c4033]/5 mb-2 border border-[#5c4033]/10"></div>
                    <p className="text-[8px] font-black uppercase tracking-tighter">Postage Paid</p>
                    <p className="text-[12px] font-serif italic text-[#c5a059]">1970s</p>
                </div>
            </div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-10 text-center animate-reveal">
                <div className="space-y-4">
                    <p className="tracking-[0.6em] text-[10px] md:text-sm font-bold uppercase text-[#5c4033]/60 font-mono">Top Secret & Exclusive</p>
                    <div className="w-16 h-[2px] bg-[#5c4033]/20 mx-auto"></div>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] font-mono">The Union of Two Souls</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#5c4033]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-[1px] bg-[#5c4033]/10"></div>

                <div className="space-y-8 bg-white/40 backdrop-blur-sm p-12 md:p-20 border-x-4 border-[#5c4033]/20 relative shadow-2xl">
                    {/* Coffee Stain Decor */}
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#704214]/5 rounded-full blur-xl"></div>

                    <div className="space-y-3 relative z-10">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#5c4033]/40 italic font-mono">Kepada Yth. Kolega & Kerabat</p>
                        <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight text-[#5c4033]/80">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-[#5c4033] text-[#f4ecd8] font-mono font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#3d2b22] transition-all shadow-[0_15px_30px_rgba(92,64,51,0.3)] active:scale-95 mx-auto"
                    >
                        Open Telegram
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1.5em] font-bold text-[#5c4033]/20 uppercase font-mono">Classified Information</p>
            </div>

            {/* Grain Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
        </div>
    );
};

export default Envelope;
