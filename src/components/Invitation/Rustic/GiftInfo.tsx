import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Gift, Copy, Check, Landmark, CreditCard } from "lucide-react";
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
        <section id="gift" className="bg-[#f9f5f0] dark:bg-slate-900 py-24 md:py-40 px-6 relative transition-colors duration-1000">
            <div className="container mx-auto max-w-4xl space-y-20 relative z-10">
                <div className="text-center space-y-4">
                    <Gift className="text-[#c5a386] h-10 w-10 mx-auto opacity-40 mb-4" />
                    <h2 className="font-serif text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Kado Kasih</h2>
                    <p className="max-w-xl mx-auto text-slate-500 dark:text-stone-400 italic transition-colors">Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 p-10 rounded-[3rem] shadow-xl space-y-8 flex flex-col justify-center text-center group transition-all hover:scale-[1.02] duration-1000">
                            <div className="space-y-2">
                                <div className="w-16 h-16 bg-[#f9f5f0] dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                                    <Landmark className="text-[#8c7851] h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-[#c5a386] tracking-[0.3em] uppercase">{account.bank}</p>
                                <h3 className="font-serif text-3xl text-[#4a3f35] dark:text-stone-200 italic font-bold transition-colors">{account.number}</h3>
                                <p className="font-serif text-xl italic text-slate-500 dark:text-stone-400 transition-colors">a.n {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="inline-flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#8c7851] dark:text-[#c5a386] hover:text-[#4a3f35] dark:hover:text-[#d9c5b2] transition-colors"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={14} className="text-green-500" /> Tersalin</>
                                ) : (
                                    <><Copy size={14} /> Salin Nomor Rekening</>
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
