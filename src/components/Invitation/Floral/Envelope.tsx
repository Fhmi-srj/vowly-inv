import * as React from "react";
import { Mail, Heart } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fffafa] overflow-hidden">
            {/* Soft Pink Watercolor Splashes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ffe4e1] opacity-30 rounded-full blur-[100px] animate-pulse-soft"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#fdf5e6] opacity-30 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <p className="tracking-[0.6em] text-[10px] font-bold text-[#db7093] uppercase">Dear Beloved Guests</p>
                    <h1 className="font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight">
                        {config.couple.groom.name} <span className="text-[#db7093]">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="relative py-12 px-8">
                    {/* Decorative Border */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent"></div>

                    <div className="space-y-6">
                        <p className="text-sm font-medium text-[#db7093] italic">Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="font-serif text-3xl md:text-4xl text-[#4a4a4a] font-bold">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#db7093] text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#db7093]/20"
                >
                    <span className="relative z-10 font-bold tracking-widest text-[11px] uppercase">Open Invitation</span>
                    <Heart className="relative z-10 h-4 w-4 fill-white" />
                    <div className="absolute inset-0 bg-[#c71585] rounded-full scale-0 transition-transform group-hover:scale-100 origin-center"></div>
                </button>

                <p className="text-[10px] tracking-widest text-[#db7093] uppercase opacity-60">We are getting married!</p>
            </div>
        </div>
    );
};

export default Envelope;
