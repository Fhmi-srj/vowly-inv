import * as React from "react";
import { Mail, PartyPopper } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const { config } = useSettings();
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f0f9ff] overflow-hidden">
            {/* Playful Geometric Shapes */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 right-40 w-24 h-24 bg-blue-500 -skew-x-12 hidden md:block"></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <PartyPopper className="text-pink-500 h-8 w-8" />
                        <span className="bg-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-black">You're Invited!</span>
                        <PartyPopper className="text-pink-500 h-8 w-8 -scale-x-100" />
                    </div>
                    <h1 className="font-sans text-6xl md:text-8xl font-black text-blue-600 tracking-tighter uppercase leading-none italic">
                        {config.couple.groom.name} <br />
                        <span className="text-pink-500">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] border-4 border-black space-y-4">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Special Guest</p>
                    <h2 className="font-sans text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
                        {guestName || "Awesome Person"}
                    </h2>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-pink-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-[8px_8px_0_#000]"
                >
                    <span className="relative z-10 font-black tracking-widest text-xs uppercase">Join The Party</span>
                    <Mail className="relative z-10 h-5 w-5" />
                    <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 transition-transform group-hover:scale-100"></div>
                </button>

                <p className="text-[10px] tracking-[0.6em] text-blue-600 font-bold uppercase opacity-60">Let's Celebrate Together!</p>
            </div>
        </div>
    );
};

export default Envelope;
