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
        <section id="gift" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8d6e1c]/5 dark:bg-[#d4af37]/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"></div>
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 rounded-full border border-[#8d6e1c]/20 dark:border-[#d4af37]/30 flex items-center justify-center opacity-60 mb-4 transition-colors duration-1000">
                        <Sparkles size={32} strokeWidth={1} />
                    </div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000">Kado Kasih</h2>
                    <div className="w-24 h-[1px] bg-[#8d6e1c]/10 dark:bg-[#d4af37]/30 mx-auto transition-colors duration-1000"></div>
                    <p className="text-xl md:text-2xl font-serif italic tracking-tight text-[#8d6e1c]/60 dark:text-[#d4af37]/60 mt-8 leading-relaxed max-w-2xl italic transition-colors duration-1000">"Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white/50 dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 p-12 rounded-none backdrop-blur-3xl space-y-10 group relative overflow-hidden transition-all duration-700 hover:border-[#8d6e1c]/60 dark:hover:border-[#d4af37]/60">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8d6e1c]/20 dark:border-[#d4af37]/40 transition-colors duration-1000"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 tracking-[0.4em] italic transition-colors duration-1000">{account.bank}</p>
                                    <h3 className="text-4xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90 font-black transition-colors duration-1000">{account.number}</h3>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8d6e1c]/40 dark:text-[#d4af37]/40 transition-colors duration-1000">A.N {account.name}</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border border-[#d4af37]/10 flex items-center justify-center text-[#d4af37]/20 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30 transition-all">
                                    <Landmark size={24} strokeWidth={1} />
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-5 border border-[#8d6e1c]/20 dark:border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8d6e1c] dark:text-[#d4af37] border-[#8d6e1c]/30 dark:border-[#d4af37]/30 hover:bg-[#8d6e1c] dark:hover:bg-[#d4af37] hover:text-white dark:hover:text-maroon-900 transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-xl"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={14} /> NOMOR DISALIN</>
                                ) : (
                                    <><Copy size={14} /> SALIN NOMOR REKENING</>
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
