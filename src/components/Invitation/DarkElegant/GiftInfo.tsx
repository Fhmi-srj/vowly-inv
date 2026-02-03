import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { MoveRight, Landmark, Copy, Check, Sparkles } from "lucide-react";
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
        <section id="gift" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-b border-black/5 dark:border-white/5 pb-24 transition-colors duration-1000">
                    <div className="space-y-8 max-w-2xl">
                        <div className="flex items-center gap-4 text-emerald-500">
                            <Sparkles size={20} />
                            <p className="text-[10px] font-black uppercase tracking-[1em]">The Sentiment</p>
                        </div>
                        <h2 className="text-8xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Presence</h2>
                        <p className="text-2xl font-serif italic tracking-tight text-black/40 dark:text-white/40 mt-8 leading-relaxed max-w-xl italic transition-colors duration-1000">"Your presence is our ultimate reward. Should you wish to gift a token of love, we provide these simple digital passages."</p>
                    </div>

                    <div className="w-full lg:w-1/2 grid grid-cols-1 gap-6">
                        {config.bankAccounts?.map((account, idx) => (
                            <div key={idx} className="bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl space-y-10 group hover:border-emerald-500/20 transition-all duration-700">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black uppercase text-emerald-500/40 tracking-[0.5em] italic">{account.bank}</p>
                                        <h3 className="text-5xl font-serif italic tracking-tight text-black dark:text-white font-black transition-colors duration-1000">{account.number}</h3>
                                        <p className="text-sm font-black uppercase tracking-widest text-black/20 dark:text-white/20 transition-colors duration-1000">Holder: {account.name}</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center text-black/10 dark:text-white/10 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all">
                                        <Landmark size={32} strokeWidth={1} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                    className="w-full py-6 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-black dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-2xl"
                                >
                                    {copiedId === `bank-${idx}` ? (
                                        <><Check size={16} /> RECORD COPIED</>
                                    ) : (
                                        <><Copy size={16} /> REPLICATE ACCOUNT</>
                                    )}
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
