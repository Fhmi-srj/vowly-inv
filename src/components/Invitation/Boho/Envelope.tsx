import * as React from "react";
import { Mail, Heart, Sun } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdf5e6] overflow-hidden">
            {/* Terracotta and Sage Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e2725b] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8a9a5b] opacity-10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" />
                    <p className="tracking-[0.8em] text-[10px] font-bold text-[#c19a6b] uppercase">Invitation From Us</p>
                    <h1 className="font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight">
                        {config.couple.groom.name} <span className="text-[#e2725b]">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="relative py-12 px-8 border-[1.5px] border-[#c19a6b]/20 rounded-[3rem]">
                    <div className="space-y-6">
                        <p className="text-sm font-medium text-[#c19a6b] italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="font-serif text-3xl md:text-5xl text-[#4a4a4a] font-bold tracking-tight">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#e2725b] text-white rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-[#e2725b]/30"
                >
                    <span className="relative z-10 font-bold tracking-widest text-[11px] uppercase">Buka Undangan</span>
                    <Mail className="relative z-10 h-4 w-4" />
                </button>

                <p className="text-[10px] tracking-widest text-[#c19a6b] uppercase opacity-60">Save The Date</p>
            </div>
        </div>
    );
};

export default Envelope;
