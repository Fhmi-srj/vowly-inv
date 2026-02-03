import * as React from "react";
import { useSettings } from "../../../contexts/SettingsContext";
import { Landmark, Copy, Check, Sparkles, Heart } from "lucide-react";
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
        <section id="gift" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] transition-opacity duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#c5a059]/5 dark:bg-[#c5a059]/5 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2 transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-16 h-px bg-[#c5a059]/40 mx-auto transition-colors duration-1000"></div>
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none dark:text-white transition-colors duration-1000">Kado Kasih</h2>
                    <div className="max-w-xl mx-auto space-y-10">
                        <p className="text-lg md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 leading-relaxed italic transition-colors duration-1000">"Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."</p>
                        <Heart size={20} className="text-[#c5a059] mx-auto opacity-40 animate-pulse transition-opacity duration-1000" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 p-12 rounded-[4rem] shadow-sm space-y-12 transition-all duration-700 hover:shadow-2xl hover:border-[#c5a059]/20 group relative overflow-hidden">
                            {/* Decorative Circle */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdfbf7] dark:bg-[#061a12] -translate-y-1/2 translate-x-1/2 rounded-full transition-colors group-hover:bg-[#c5a059]/5"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-6 text-left">
                                    <p className="text-[12px] font-bold uppercase text-[#c5a059] tracking-[0.4em] italic transition-colors duration-1000">{account.bank}</p>
                                    <h3 className="text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white font-black transition-colors duration-1000">{account.number}</h3>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/30 dark:text-white/30 transition-colors duration-1000">Atas Nama</p>
                                        <p className="text-xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 transition-colors duration-1000">{account.name}</p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-[#fdfbf7] dark:bg-[#061a12] rounded-full flex items-center justify-center text-[#c5a059] shadow-inner group-hover:scale-110 transition-all duration-1000">
                                    <Landmark size={24} strokeWidth={1} />
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-6 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-white dark:text-[#061a12] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#c5a059] dark:hover:bg-[#2d4a3e] dark:hover:text-white transition-all flex items-center justify-center gap-6 group active:scale-95 shadow-xl relative z-10"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={16} /> NOMOR DISALIN</>
                                ) : (
                                    <><Copy size={16} /> SALIN NOMOR REKENING</>
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
