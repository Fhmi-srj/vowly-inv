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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ebe1] overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <p className="tracking-[0.5em] text-[10px] font-bold text-[#8c7851] uppercase">Undangan Pernikahan</p>
                    <h1 className="font-serif text-6xl md:text-7xl text-[#4a3f35] italic leading-tight">
                        {config.couple.groom.name} <span className="text-[#c5a386]">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="relative py-12 px-8 border-y border-[#d9c5b2]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4ebe1] px-4">
                        <Heart className="text-[#c5a386] fill-[#c5a386] h-6 w-6" />
                    </div>

                    <div className="space-y-6">
                        <p className="text-sm font-medium text-[#8c7851] italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="font-serif text-3xl md:text-4xl text-[#4a3f35] font-bold">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#4a3f35] text-[#f4ebe1] rounded-full overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-xl shadow-[#4a3f35]/20"
                >
                    <span className="relative z-10 font-bold tracking-widest text-[11px] uppercase">Buka Undangan</span>
                    <Mail className="relative z-10 h-4 w-4 transition-all group-hover:translate-x-2" />
                    <div className="absolute inset-0 bg-[#5d5043] translate-y-full transition-transform group-hover:translate-y-0"></div>
                </button>

                <p className="text-[10px] tracking-widest text-[#8c7851] uppercase opacity-60">Tanpa Mengurangi Rasa Hormat</p>
            </div>
        </div>
    );
};

export default Envelope;
