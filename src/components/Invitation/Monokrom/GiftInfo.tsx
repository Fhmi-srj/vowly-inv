import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MoveRight } from "lucide-react";
import { useState } from "react";

const GiftInfo: React.FC = () => {
    const { config } = useSettings();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section id="gift" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-full bg-white opacity-[0.02] -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-6 max-w-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Contribution</p>
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Digital <br /> Tokens</h2>
                        <p className="text-xl text-zinc-500 font-bold uppercase tracking-tight mt-8">Your presence is the priority, but should you wish to share a token of love, we provide these simple digital channels.</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-1">
                        {config.bankAccounts?.map((account, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-zinc-800 p-10 space-y-8 min-w-[350px] group">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{account.bank}</p>
                                    <h3 className="text-4xl font-black tracking-tighter uppercase">{account.number}</h3>
                                    <p className="text-sm font-bold uppercase tracking-tight text-white/50">A.N {account.name}</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                    className="w-full py-4 border-2 border-white text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95"
                                >
                                    {copiedId === `bank-${idx}` ? "IDENTIFIER COPIED" : "COPY ACCOUNT NUMBER"}
                                    <MoveRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GiftInfo;
