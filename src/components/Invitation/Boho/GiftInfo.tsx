import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Gift, Copy, Check, Landmark, Sun } from "lucide-react";
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
        <section id="gift" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Geometric Background Decor */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e2725b]/5 rotate-45 translate-x-32 translate-y-32"></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10 text-center">
                <div className="space-y-6">
                    <Sun className="text-[#c19a6b] h-12 w-12 mx-auto opacity-30 animate-spin-slow" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Gifts of Love</h2>
                    <p className="max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">
                        "Your prayers are the most precious gifts. Should you wish to share more, we provide these digital options."
                    </p>
                    <div className="w-16 h-1 bg-[#e2725b] mx-auto opacity-30 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-10 group hover:shadow-[#e2725b]/20 transition-all duration-1000">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-[#faf7f2] dark:bg-stone-950 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all">
                                    <Landmark className="text-[#e2725b] h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-[#c19a6b] tracking-[0.5em] uppercase">{account.bank}</p>
                                <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold tracking-tight transition-colors">{account.number}</h3>
                                <p className="font-serif text-xl italic text-slate-400 dark:text-stone-500 transition-colors">a.n {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl transition-all duration-500"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={16} className="text-green-400" /> Account Copied</>
                                ) : (
                                    <><Copy size={16} /> Copy Number</>
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
