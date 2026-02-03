import * as React from "react";
import { MoveRight } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0b] overflow-hidden text-white">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-16 animate-reveal">
                <div className="space-y-6 text-center">
                    <p className="tracking-[1em] text-[10px] font-black uppercase text-emerald-500/60 font-sans">The Wedding Invitation of</p>
                    <h1 className="text-7xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
                        {config.couple.groom.name} <span className="font-sans not-italic text-emerald-500 mx-4">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-left space-y-4">
                        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.5em]">Dear Distinguished Guest</p>
                        <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white">
                            {guestName || "Distinguished Guest"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/50"
                    >
                        Enter Ceremony
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[1em] font-black text-white/20 uppercase">Midnight Est. {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};

export default Envelope;
