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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-950 overflow-hidden text-white">
            {/* Geometric Background Elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-12 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-white/5 skew-y-12 translate-y-1/2"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-16 animate-reveal">
                <div className="space-y-6 text-center">
                    <p className="tracking-[1em] text-[10px] font-black uppercase text-zinc-500">The Wedding Invitation of</p>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        {config.couple.groom.name} <span className="text-zinc-600">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full h-px bg-zinc-800"></div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
                    <div className="text-left space-y-4">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Inviting You</p>
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
                            {guestName || "Distinguished Guest"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-10 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-[10px_10px_0_rgba(255,255,255,0.2)]"
                    >
                        Enter Experience
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.8em] font-black text-zinc-700 uppercase">Est. {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};

export default Envelope;
