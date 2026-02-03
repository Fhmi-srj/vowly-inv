import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Landmark, Copy, Check, Sparkles } from "lucide-react";
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
        <section id="gift" className="bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            {/* Coffee Stain Decor */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#704214]/5 dark:bg-white/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"></div>
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-16 h-px bg-[#5c4033]/30 dark:bg-white/10 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[11rem] italic tracking-tighter leading-none text-[#5c4033]/80 dark:text-[#d4c3a1]/90 drop-shadow-xl transition-colors duration-1000">The Tokens</h2>
                    <div className="max-w-xl mx-auto space-y-10">
                        <p className="text-lg md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 leading-relaxed font-mono uppercase tracking-widest italic transition-colors duration-1000">
                            "Your presence is the greatest gift of all. However, should you wish to send a token of affection, we've provided our bank coordinates below."
                        </p>
                        <div className="flex justify-center gap-4 text-[#c5a059] opacity-40">
                            <Sparkles size={20} />
                            <div className="w-12 h-px bg-[#c5a059]/40 self-center"></div>
                            <Sparkles size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white/40 dark:bg-white/5 border-2 border-[#5c4033]/10 dark:border-white/5 p-12 rounded-none backdrop-blur-md space-y-12 transition-all duration-700 hover:shadow-3xl hover:border-[#c5a059]/30 group relative overflow-hidden">
                            {/* Stamp Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 border-b-2 border-l-2 border-dashed border-[#5c4033]/10 dark:border-white/10 opacity-30 dark:opacity-20 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-6">
                                    <p className="text-[12px] font-bold uppercase text-[#c5a059] tracking-[0.4em] font-mono italic">{account.bank} — ACCOUNT</p>
                                    <h3 className="text-4xl md:text-5xl italic tracking-tight text-[#5c4033] font-mono tracking-tighter shadow-sm">{account.number}</h3>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5c4033]/40 dark:text-[#d4c3a1]/30 font-mono transition-colors duration-1000">Receiver handle</p>
                                        <p className="text-2xl italic tracking-tight text-[#5c4033]/80 dark:text-[#d4c3a1]/80 uppercase transition-colors duration-1000">{account.name}</p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-[#5c4033]/5 dark:bg-white/5 rounded-none flex items-center justify-center text-[#c5a059]/40 group-hover:text-[#c5a059] transition-all border border-[#5c4033]/10 dark:border-white/5">
                                    <Landmark size={24} strokeWidth={1} />
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-6 bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] dark:text-[#121212] font-mono font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] dark:hover:text-white transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-[8px_8px_0_rgba(0,0,0,0.1)] relative z-10 rounded-none"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={16} /> DATA COPIED</>
                                ) : (
                                    <><Copy size={16} /> CLONE REKENING</>
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
