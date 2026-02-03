import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Gift, Copy, Check, Landmark, PartyPopper } from "lucide-react";
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
        <section id="gift" className="bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000">
            {/* Playful Patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400 rotate-45 translate-x-32 -translate-y-32 opacity-20"></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10 text-center">
                <div className="space-y-8 flex flex-col items-center">
                    <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-10 rounded-full shadow-[10px_10px_0_#3b82f6] -rotate-3 mb-4 transition-all">
                        <Gift className="text-pink-500 h-16 w-16" strokeWidth={3} />
                    </div>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-none dark:text-white transition-colors">Wedding Gift</h2>
                    <div className="flex gap-4 items-center">
                        <PartyPopper className="text-yellow-400" />
                        <p className="max-w-xl mx-auto text-zinc-400 font-bold uppercase tracking-tight text-xl leading-relaxed italic">"Your presence is our ultimate gift. But if you're feeling extra generous, here are our digital accounts!"</p>
                        <PartyPopper className="text-yellow-400 -scale-x-100" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className={`bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 group hover:shadow-[20px_20px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                            <div className="space-y-6">
                                <div className="w-24 h-24 bg-[#f0f9ff] dark:bg-slate-800 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all">
                                    <Landmark className="text-blue-600 h-10 w-10" strokeWidth={3} />
                                </div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.5em] italic">{account.bank}</p>
                                <h3 className="text-5xl font-black tracking-tighter uppercase italic dark:text-white transition-colors">{account.number}</h3>
                                <p className="text-sm font-black uppercase tracking-widest text-blue-600">A.N {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-6 rounded-full font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-4 bg-black text-white hover:bg-pink-500 active:scale-95 shadow-[8px_8px_0_#3b82f6]"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={18} className="text-yellow-400" /> NUMBER COPIED!</>
                                ) : (
                                    <><Copy size={18} /> COPY ACCOUNT NO</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GiftInfo;
