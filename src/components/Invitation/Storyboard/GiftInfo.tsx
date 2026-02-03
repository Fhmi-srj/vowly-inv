import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Landmark, Copy, Check, Star, Zap } from "lucide-react";
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
        <section id="gift" className="bg-white dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            {/* Comic Spatter Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2196f3]/5 dark:bg-[#00e5ff]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 transition-all"></div>
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] bg-[radial-gradient(#0052cc_1px,transparent_1px)] dark:bg-[radial-gradient(#ff4081_1px,transparent_1px)] [background-size:20px_20px] transition-all duration-700"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="relative inline-block px-12 py-3 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[8px_8px_0_#2d2d2d] dark:shadow-[8px_8px_0_#ff4081] transform rotate-1 transition-all duration-700">
                        <p className="tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]">THE BONUS STAGE</p>
                    </div>
                    <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ff4081] transition-all duration-700">Tokens</h2>
                    <div className="max-w-2xl mx-auto space-y-10 group">
                        <div className="relative p-10 bg-[#fdfaf0] dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white shadow-[12px_12px_0_rgba(33,150,243,0.1)] dark:shadow-[12px_12px_0_#ff4081] transform -rotate-1 group-hover:rotate-0 transition-all">
                            <p className="text-xl md:text-2xl font-black italic text-[#2d2d2d]/80 dark:text-white/80 leading-relaxed uppercase tracking-tighter transition-colors">
                                "Your presence is our favorite episode. But if you wish to support our next adventure, here are our secret coordinates!"
                            </p>
                            <div className="absolute -bottom-6 -right-6 text-[#ff4081] dark:text-[#00e5ff] group-hover:animate-bounce transition-colors">
                                <Star size={40} fill="currentColor" stroke="#2d2d2d" strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-12 rounded-none shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] space-y-12 transition-all duration-700 hover:shadow-[20px_20px_0_#2196f3] dark:hover:shadow-[20px_20px_0_#00e5ff] hover:-translate-y-2 group relative overflow-hidden">
                            {/* Halftone Detail */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] dark:opacity-[0.1] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#00e5ff_1.5px,transparent_1.5px)] [background-size:10px_10px] transition-all"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-6">
                                    <div className="inline-block px-4 py-1 bg-[#2196f3] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] font-black text-[10px] uppercase tracking-widest border-[2px] border-[#2d2d2d] dark:border-white shadow-[4px_4px_0_#2d2d2d] dark:shadow-[4px_4px_0_#ff4081] transform -rotate-3 transition-all duration-700">
                                        {account.bank}
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase drop-shadow-[3px_3px_0_rgba(0,0,0,0.05)] transition-colors">{account.number}</h3>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/30 dark:text-white/30 italic transition-colors">Account Holder</p>
                                        <p className="text-2xl font-black italic tracking-tight text-[#2d2d2d]/80 dark:text-white/80 uppercase transform -skew-x-12 transition-colors">{account.name}</p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white flex items-center justify-center text-[#2d2d2d] group-hover:scale-125 transition-all rotate-12 group-hover:rotate-0">
                                    <Landmark size={24} strokeWidth={3} />
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-8 bg-[#2d2d2d] dark:bg-[#ff4081] text-white font-black uppercase text-[12px] tracking-[0.5em] hover:bg-[#ff4081] dark:hover:bg-[#00e5ff] dark:hover:text-[#2d2d2d] transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-[8px_8px_0_#ffeb3b] dark:shadow-[8px_8px_0_#2d2d2d] relative z-10 rounded-none transform -rotate-1"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={20} strokeWidth={3} /> DATA LOGGED!</>
                                ) : (
                                    <><Copy size={20} strokeWidth={3} /> CLONE DATA</>
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
