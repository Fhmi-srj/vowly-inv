import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Gift, Copy, Check, Landmark, Sparkles } from "lucide-react";
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
        <section id="gift" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Soft Background Decor */}
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#db7093 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10">
                <div className="text-center space-y-6">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <Gift className="text-[#db7093] h-14 w-14 relative z-10" />
                    </div>
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Digital Envelope</h2>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#db7093] to-transparent mx-auto opacity-30"></div>
                    <p className="max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl leading-relaxed transition-colors">"Your presence is enough for us, but if you wish to give a gift, we provide the digital envelope below."</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-[#ffd1dc]/40 dark:border-white/5 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-center text-center space-y-10 group hover:shadow-[#ffd1dc]/30 dark:hover:shadow-white/5 transition-all duration-1000">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-[#fffafa] dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all shadow-inner">
                                    <Landmark className="text-[#db7093] h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-[#db7093] tracking-[0.4em] uppercase">{account.bank}</p>
                                <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors">{account.number}</h3>
                                <p className="font-serif text-xl italic text-slate-400 dark:text-stone-400 transition-colors">a.n {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#fffafa] border border-[#ffd1dc]/40 text-[#db7093] rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#db7093] hover:text-white transition-all shadow-md group-hover:shadow-lg"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={16} className="text-green-500" /> Account Copied</>
                                ) : (
                                    <><Copy size={16} /> Copy Number</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-10">
                    <Sparkles className="text-[#db7093] h-6 w-6 mx-auto opacity-20 animate-spin-slow" />
                </div>
            </div>
        </section>
    );
};

export default GiftInfo;
