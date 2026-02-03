import * as React from "react";
import {
    Heart,
    Sparkles,
    Smartphone,
    Music,
    Image as ImageIcon,
    MessageSquare,
    Calendar,
    ChevronRight,
    ShieldCheck,
    Zap,
    Star,
    ExternalLink
} from "lucide-react";
import { AVAILABLE_THEMES } from "../../themes";
import RegisterModal from "./RegisterModal";

const LandingPage: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [selectedTheme, setSelectedTheme] = React.useState<string | undefined>();

    const openRegister = (themeId?: string) => {
        setSelectedTheme(themeId);
        setIsRegisterOpen(true);
    };

    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-accent/30 selection:text-primary">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-primary animate-pulse" />
                        <span className="font-serif text-2xl italic font-bold tracking-tighter">Vowly</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                        <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
                        <a href="#templates" className="hover:text-primary transition-colors">Template</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
                        <button
                            onClick={() => openRegister()}
                            className="px-6 py-2.5 bg-primary text-white rounded-full hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                            Buat Undangan
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>
                </div>

                <div className="container mx-auto px-6 text-center space-y-8 md:space-y-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10 animate-reveal">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Digital Wedding Invitation Platform</span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter italic animate-reveal" style={{ animationDelay: "200ms" }}>
                        Abadikan Momen <br />
                        <span className="text-primary italic">Cinta</span> Selamanya
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-xl animate-reveal leading-relaxed" style={{ animationDelay: "400ms" }}>
                        Buat undangan pernikahan digital yang elegan, mewah, dan interaktif hanya dalam hitungan menit. Bagikan kebahagiaan Anda dengan cara yang lebih berkesan.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-reveal" style={{ animationDelay: "600ms" }}>
                        <button
                            onClick={() => openRegister()}
                            className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-bold tracking-luxury hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Mulai Buat Sekarang <ChevronRight className="h-4 w-4" />
                        </button>
                        <a href="#templates" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold tracking-luxury transition-all hover:bg-slate-50 dark:hover:bg-white/10 text-center">
                            Lihat Demo
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 md:py-40 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mb-16 md:mb-24">
                        <h2 className="font-serif text-4xl md:text-6xl text-slate-900 dark:text-white italic mb-6">
                            Fitur Premium Untuk <br /> Hari Bahagia Anda
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Kami menyediakan segala yang Anda butuhkan untuk membuat undangan digital yang sempurna dan fungsional.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Smartphone, title: "Mobile Friendly", desc: "Tampilan responsif yang terlihat sempurna di semua perangkat mobile maupun desktop." },
                            { icon: Music, title: "Background Music", desc: "Pilih lagu favorit Anda untuk memberikan suasana romantis saat tamu membuka undangan." },
                            { icon: ImageIcon, title: "Gallery & Video", desc: "Tampilkan foto-foto pre-wedding terbaik Anda dalam galeri berkualitas tinggi." },
                            { icon: MessageSquare, title: "RSVP & Wishes", desc: "Kelola konfirmasi kehadiran tamu dan terima doa restu langsung di dashboard Anda." },
                            { icon: Calendar, title: "Add to Calendar", desc: "Tamu dapat menyimpan jadwal pernikahan Anda langsung ke Google Calendar atau iCal." },
                            { icon: ShieldCheck, title: "Digital Greeting", desc: "Fitur nama tamu khusus (personalized) untuk setiap link yang Anda bagikan." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Tema Section */}
            <section id="templates" className="py-24 md:py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                        <h2 className="font-serif text-4xl md:text-7xl italic mb-6">Pilih Desain Impian Anda</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Berbagai pilihan tema premium yang dirancang khusus untuk membuat undangan pernikahan Anda terlihat unik dan personal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                        {AVAILABLE_THEMES.map((theme) => (
                            <div key={theme.id} className="group relative">
                                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl">
                                    <img
                                        src={theme.preview}
                                        alt={theme.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                                        <div className="flex gap-4 w-full">
                                            <a
                                                href={`/demo-${theme.id}`}
                                                target="_blank"
                                                className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                                            >
                                                Lihat Demo <ExternalLink className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={() => openRegister(theme.id)}
                                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
                                            >
                                                Pilih Tema
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2 text-center">
                                    <h3 className="text-2xl font-serif italic font-bold">{theme.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400">{theme.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 md:py-40">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-serif text-4xl md:text-7xl italic mb-12 md:mb-20">Pilih Paket Sesuai Kebutuhan</h2>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-stretch pt-1">
                        {/* Basic Plan */}
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/5 flex flex-col items-center">
                            <span className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8">Basic</span>
                            <div className="text-5xl font-bold mb-4">Gratis</div>
                            <p className="text-slate-400 mb-10">Cocok untuk mencoba fitur dasar</p>
                            <ul className="space-y-4 text-left w-full mb-12">
                                <li className="flex items-center gap-3 text-sm opacity-60"><Zap className="h-4 w-4 text-primary" /> Desain Standar</li>
                                <li className="flex items-center gap-3 text-sm opacity-60"><Zap className="h-4 w-4 text-primary" /> RSVP Management</li>
                                <li className="flex items-center gap-3 text-sm opacity-60"><Zap className="h-4 w-4 text-primary" /> Masa Aktif 7 Hari</li>
                                <li className="flex items-center gap-3 text-sm opacity-30 line-through"><Zap className="h-4 w-4 text-slate-300" /> Background Music</li>
                                <li className="flex items-center gap-3 text-sm opacity-30 line-through"><Zap className="h-4 w-4 text-slate-300" /> Gallery Tanpa Batas</li>
                            </ul>
                            <a href="/admin" className="w-full py-4 rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all mt-auto">Pilih Paket</a>
                        </div>

                        {/* Premium Plan */}
                        <div className="bg-primary p-12 rounded-[3.5rem] text-white flex flex-col items-center relative overflow-hidden shadow-2xl scale-105">
                            <div className="absolute top-0 right-0 bg-white/20 px-6 py-2 rounded-bl-3xl text-[10px] font-black tracking-widest uppercase">Best Value</div>
                            <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8">Premium</span>
                            <div className="text-5xl font-bold mb-4">Rp 149.000</div>
                            <p className="text-white/70 mb-10">Fitur lengkap untuk momen spesial</p>
                            <ul className="space-y-4 text-left w-full mb-12">
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 fill-white" /> Semua Fitur Basic</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 fill-white" /> Background Music</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 fill-white" /> Gallery Unlimited</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 fill-white" /> Digital Wedding Gift</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 fill-white" /> Masa Aktif Selamanya</li>
                            </ul>
                            <button
                                onClick={() => openRegister()}
                                className="w-full py-4 bg-white text-primary rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-[1.02] mt-auto"
                            >
                                Mulai Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                <RegisterModal
                    isOpen={isRegisterOpen}
                    onClose={() => setIsRegisterOpen(false)}
                    selectedTheme={selectedTheme}
                />
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Heart className="h-5 w-5 text-primary" />
                                <span className="font-serif text-xl italic font-bold">Vowly</span>
                            </div>
                            <p className="text-slate-400 text-sm max-w-xs">Mewujudkan undangan impian Anda menjadi kenyataan digital.</p>
                        </div>
                        <div className="flex gap-10 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-slate-50 dark:border-white/[0.02] text-center text-[10px] text-slate-400 tracking-widest uppercase">
                        © 2026 Vowly. Created with love by Fahmi
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
