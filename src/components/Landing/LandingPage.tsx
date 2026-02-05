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
    ExternalLink,
    Plus,
    Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_THEMES } from "../../themes";
import RegisterModal from "./RegisterModal";

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 md:px-10 py-5 md:py-8 flex items-center justify-between text-left group"
            >
                <span className="text-sm md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {q}
                </span>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                    {isOpen ? <Minus className="h-4 w-4 md:h-5 md:w-5" /> : <Plus className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 md:px-10 pb-6 md:pb-10 pt-0">
                            <div className="h-[1px] w-full bg-slate-100 dark:bg-white/5 mb-6 md:mb-8"></div>
                            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-300 leading-relaxed italic font-serif">
                                "{a}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LandingPage: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [selectedTheme, setSelectedTheme] = React.useState<string | undefined>();
    const [currentSlide, setCurrentSlide] = React.useState(AVAILABLE_THEMES.length);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const mobileCarouselRef = React.useRef<HTMLDivElement>(null);
    const desktopCarouselRef = React.useRef<HTMLDivElement>(null);

    // Force Light Theme for Landing Page
    React.useEffect(() => {
        document.documentElement.classList.remove("dark");
    }, []);

    // Prevent body scroll when mobile menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Auto-scroll carousel
    React.useEffect(() => {
        const interval = setInterval(() => {
            const isDesktop = window.innerWidth >= 1024;
            const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;

            if (ref.current) {
                // Mobile: 165px + 12px gap = 177px
                // Desktop: 280px + 24px gap = 304px
                const cardWidth = isDesktop ? 304 : 177;
                const nextSlide = currentSlide + 1;

                ref.current.scrollTo({
                    left: nextSlide * cardWidth,
                    behavior: 'smooth'
                });

                setCurrentSlide(nextSlide);

                // Reset to middle set when reaching end
                if (nextSlide >= AVAILABLE_THEMES.length * 2) {
                    setTimeout(() => {
                        if (ref.current) {
                            ref.current.scrollLeft = AVAILABLE_THEMES.length * cardWidth;
                            setCurrentSlide(AVAILABLE_THEMES.length);
                        }
                    }, 500);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    // Set initial scroll position
    React.useEffect(() => {
        const isDesktop = window.innerWidth >= 1024;
        const mobileRef = mobileCarouselRef.current;
        const desktopRef = desktopCarouselRef.current;

        if (mobileRef) {
            mobileRef.scrollLeft = AVAILABLE_THEMES.length * 177;
        }
        if (desktopRef) {
            desktopRef.scrollLeft = AVAILABLE_THEMES.length * 304;
        }
    }, []);

    const scrollToPrev = () => {
        const isDesktop = window.innerWidth >= 1024;
        const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
        const cardWidth = isDesktop ? 304 : 177;

        if (ref.current) {
            const prevSlide = currentSlide - 1;
            ref.current.scrollTo({
                left: prevSlide * cardWidth,
                behavior: 'smooth'
            });
            setCurrentSlide(prevSlide);

            if (prevSlide < AVAILABLE_THEMES.length) {
                setTimeout(() => {
                    if (ref.current) {
                        ref.current.scrollLeft = (AVAILABLE_THEMES.length * 2 - 1) * cardWidth;
                        setCurrentSlide(AVAILABLE_THEMES.length * 2 - 1);
                    }
                }, 500);
            }
        }
    };

    const scrollToNext = () => {
        const isDesktop = window.innerWidth >= 1024;
        const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
        const cardWidth = isDesktop ? 304 : 177;

        if (ref.current) {
            const nextSlide = currentSlide + 1;
            ref.current.scrollTo({
                left: nextSlide * cardWidth,
                behavior: 'smooth'
            });
            setCurrentSlide(nextSlide);

            if (nextSlide >= AVAILABLE_THEMES.length * 2) {
                setTimeout(() => {
                    if (ref.current) {
                        ref.current.scrollLeft = AVAILABLE_THEMES.length * cardWidth;
                        setCurrentSlide(AVAILABLE_THEMES.length);
                    }
                }, 500);
            }
        }
    };

    const openRegister = (themeId?: string) => {
        setSelectedTheme(themeId);
        setIsRegisterOpen(true);
    };

    const activeIndex = currentSlide % AVAILABLE_THEMES.length;

    return (
        <div className="bg-gradient-to-b from-white to-pink-50/30 text-slate-900 selection:bg-pink-200/50 selection:text-pink-700">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/80 border-b border-pink-100/50">
                <div className="container mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo-vowly.png" alt="Vowly Logo" className="h-8 md:h-10 w-auto object-contain" />
                        <span className="font-serif text-xl md:text-2xl italic font-bold tracking-tighter text-pink-600">Vowly</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                        <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
                        <a href="#templates" className="hover:text-primary transition-colors">Template</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
                        <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                        <button
                            onClick={() => openRegister()}
                            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-pink-200 transition-all active:scale-95 cursor-pointer"
                        >
                            Buat Undangan
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => openRegister()}
                            className="px-4 py-2 text-xs bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                            Buat
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Menu"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <span className={`w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Hidden, hanya untuk close saat click outside */}
            <div
                className={`fixed inset-0 z-[90] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-16 left-0 right-0 bg-white dark:bg-slate-900 z-[95] md:hidden transition-all duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    }`}
                style={{
                    boxShadow: isMobileMenuOpen ? '0 10px 40px rgba(0, 0, 0, 0.15)' : 'none'
                }}
            >
                <div className="container mx-auto px-4 py-6">
                    {/* Menu Items */}
                    <div className="space-y-1">
                        <a
                            href="#"
                            className="block py-3 text-slate-900 dark:text-white font-semibold text-lg hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Beranda
                        </a>
                        <a
                            href="#templates"
                            className="block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Tema
                        </a>
                        <a
                            href="#features"
                            className="block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Fitur
                        </a>
                        <a
                            href="#pricing"
                            className="block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Harga
                        </a>
                        <a
                            href="#faq"
                            className="block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            FAQ
                        </a>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-12 md:pt-48 md:pb-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-300/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-200/20 rounded-full blur-[120px] -ml-40 -mb-40"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 text-center space-y-4 md:space-y-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-pink-50 rounded-full border border-pink-100 animate-reveal">
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-pink-500" />
                        <span className="text-[9px] md:text-xs font-bold tracking-widest uppercase text-pink-600">Digital Wedding Invitation</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl md:text-8xl lg:text-[10rem] leading-[0.95] md:leading-[0.85] tracking-tighter italic animate-reveal text-gray-800" style={{ animationDelay: "200ms" }}>
                        Abadikan Momen <br />
                        <span className="text-pink-500 italic">Cinta</span> Selamanya
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-300 text-sm sm:text-base md:text-xl animate-reveal leading-relaxed px-2" style={{ animationDelay: "400ms" }}>
                        Buat undangan pernikahan digital yang elegan, mewah, dan interaktif hanya dalam hitungan menit.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 animate-reveal px-4" style={{ animationDelay: "600ms" }}>
                        <button
                            onClick={() => openRegister()}
                            className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury hover:shadow-2xl hover:shadow-pink-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Mulai Buat Sekarang <ChevronRight className="h-4 w-4" />
                        </button>
                        <a href="#templates" className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-white border border-pink-200 rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury transition-all hover:bg-pink-50 text-center text-pink-600">
                            Lihat Demo
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 md:py-40 bg-pink-50/50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mb-8 md:mb-24">
                        <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-slate-900 dark:text-white italic mb-3 md:mb-6">
                            Fitur Premium Untuk <br /> Hari Bahagia Anda
                        </h2>
                        <p className="text-slate-500 dark:text-slate-300 text-sm md:text-lg">
                            Kami menyediakan segala yang Anda butuhkan untuk membuat undangan digital yang sempurna.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                        {[
                            { icon: Smartphone, title: "Mobile Friendly", desc: "Tampilan responsif yang terlihat sempurna di semua perangkat." },
                            { icon: Music, title: "Background Music", desc: "Pilih lagu favorit untuk memberikan suasana romantis." },
                            { icon: ImageIcon, title: "Gallery & Video", desc: "Tampilkan foto pre-wedding terbaik dalam galeri berkualitas." },
                            { icon: MessageSquare, title: "RSVP & Wishes", desc: "Kelola konfirmasi kehadiran dan terima doa restu langsung." },
                            { icon: Calendar, title: "Add to Calendar", desc: "Tamu dapat menyimpan jadwal ke Google Calendar atau iCal." },
                            { icon: ShieldCheck, title: "Digital Greeting", desc: "Fitur nama tamu khusus untuk setiap link yang dibagikan." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-4 md:p-10 rounded-xl md:rounded-[2.5rem] border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-2 transition-all duration-500 group backdrop-blur-sm">
                                <div className="w-10 h-10 md:w-16 md:h-16 bg-pink-50 rounded-lg md:rounded-2xl flex items-center justify-center text-pink-500 mb-3 md:mb-8 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500">
                                    <feature.icon className="h-5 w-5 md:h-8 md:w-8" />
                                </div>
                                <h3 className="text-xs md:text-xl font-bold mb-1.5 md:mb-4 leading-tight">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-300 text-[10px] md:text-base leading-snug md:leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Tema Section */}
            <section id="templates" className="py-12 md:py-40">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
                        <h2 className="font-serif text-2xl sm:text-4xl md:text-7xl italic mb-3 md:mb-6">Pilih Desain Impian Anda</h2>
                        <p className="text-slate-500 dark:text-slate-300 text-sm md:text-lg">
                            Berbagai pilihan tema premium dirancang khusus untuk membuat undangan Anda terlihat unik.
                        </p>
                    </div>

                    {/* Carousel for Mobile & Tablet */}
                    <div className="lg:hidden">
                        <div className="relative">
                            {/* Auto-scrolling Carousel Container */}
                            <div
                                ref={mobileCarouselRef}
                                className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <div className="flex gap-3">
                                    {/* Triple the themes for infinite loop */}
                                    {[...AVAILABLE_THEMES, ...AVAILABLE_THEMES, ...AVAILABLE_THEMES].map((theme, idx) => (
                                        <div key={`${theme.id}-${idx}`} className="flex-shrink-0 w-[165px] snap-center">
                                            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-3 shadow-lg border border-slate-100 dark:border-white/10">
                                                {/* Theme Preview */}
                                                <div className="relative aspect-square overflow-hidden rounded-xl mb-2.5 shadow-md">
                                                    <img
                                                        src={theme.preview}
                                                        alt={theme.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Theme Name */}
                                                <h3 className="text-center font-serif text-sm font-bold mb-2 text-slate-900 dark:text-white leading-tight">{theme.name}</h3>

                                                {/* Buttons */}
                                                <div className="space-y-1.5">
                                                    <a
                                                        href={`/demo-${theme.id}`}
                                                        target="_blank"
                                                        className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:shadow-lg transition-colors"
                                                    >
                                                        Lihat Demo <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <button
                                                        onClick={() => openRegister(theme.id)}
                                                        className="w-full py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                                    >
                                                        Pilih Tema
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows & Dots */}
                            <div className="flex justify-center items-center gap-3 mt-5">
                                <button
                                    onClick={scrollToPrev}
                                    className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-pink-200 transition-all active:scale-95"
                                >
                                    <ChevronRight className="h-5 w-5 rotate-180" />
                                </button>

                                {/* Pagination Dots */}
                                <div className="flex gap-1.5">
                                    {AVAILABLE_THEMES.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-2 rounded-full transition-all ${idx === activeIndex
                                                ? 'bg-pink-500 w-6'
                                                : 'bg-pink-200 w-2'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={scrollToNext}
                                    className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-pink-200 transition-all active:scale-95"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* View All Themes Button */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => openRegister()}
                                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-pink-200 transition-colors text-sm flex items-center gap-2 mx-auto"
                            >
                                <Heart className="h-4 w-4" /> Lihat Semua Tema
                            </button>
                        </div>
                    </div>

                    {/* Grid for Desktop */}
                    <div className="hidden lg:block">
                        <div className="relative group/carousel">
                            {/* Desktop Carousel Container */}
                            <div
                                ref={desktopCarouselRef}
                                className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <div className="flex gap-6 px-10">
                                    {/* Triple the themes for infinite loop */}
                                    {[...AVAILABLE_THEMES, ...AVAILABLE_THEMES, ...AVAILABLE_THEMES].map((theme, idx) => (
                                        <div key={`${theme.id}-${idx}`} className="flex-shrink-0 w-[280px] snap-center group">
                                            <div className="bg-white dark:bg-slate-800/60 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                                                {/* Theme Preview */}
                                                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] mb-6 shadow-lg">
                                                    <img
                                                        src={theme.preview}
                                                        alt={theme.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>

                                                {/* Theme Name */}
                                                <div className="text-center px-2">
                                                    <h3 className="font-serif text-2xl font-bold mb-2 text-slate-900 dark:text-white leading-tight">{theme.name}</h3>
                                                    <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 leading-snug">{theme.description}</p>
                                                </div>

                                                {/* Buttons */}
                                                <div className="space-y-3">
                                                    <a
                                                        href={`/demo-${theme.id}`}
                                                        target="_blank"
                                                        className="w-full py-3.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                                                    >
                                                        Lihat Demo <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => openRegister(theme.id)}
                                                        className="w-full py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95"
                                                    >
                                                        Pilih Tema
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows & Dots */}
                            <div className="flex justify-center items-center gap-6 mt-12">
                                <button
                                    onClick={scrollToPrev}
                                    className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-xl hover:shadow-pink-200 transition-all active:scale-90 hover:scale-105"
                                >
                                    <ChevronRight className="h-6 w-6 rotate-180" />
                                </button>

                                {/* Pagination Dots */}
                                <div className="flex gap-2.5 px-6 py-3 bg-pink-50 rounded-full">
                                    {AVAILABLE_THEMES.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const isDesktop = window.innerWidth >= 1024;
                                                const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
                                                if (ref.current) {
                                                    const cardWidth = isDesktop ? 304 : 177;
                                                    const targetSlide = AVAILABLE_THEMES.length + idx;
                                                    ref.current.scrollTo({
                                                        left: targetSlide * cardWidth,
                                                        behavior: 'smooth'
                                                    });
                                                    setCurrentSlide(targetSlide);
                                                }
                                            }}
                                            className={`h-2.5 rounded-full transition-all duration-500 ${idx === activeIndex
                                                ? 'bg-pink-500 w-10'
                                                : 'bg-pink-200 w-2.5 hover:bg-pink-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={scrollToNext}
                                    className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-xl hover:shadow-pink-200 transition-all active:scale-90 hover:scale-105"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-12 md:py-40">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-serif text-2xl sm:text-4xl md:text-7xl italic mb-8 md:mb-20">Pilih Paket Sesuai Kebutuhan</h2>

                    <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 items-stretch px-2 md:px-0">
                        {[
                            {
                                id: "lite",
                                name: "Lite",
                                price: "Gratis",
                                priceNum: 0,
                                originalPrice: "50k",
                                features: ["1 Tema Pilihan", "Masa Aktif 3 Hari", "RSVP Dasar", "Maksimal 20 Tamu"],
                                color: "slate",
                                badge: "Trial"
                            },
                            {
                                id: "basic",
                                name: "Basic",
                                price: "49k",
                                priceNum: 49000,
                                originalPrice: "99k",
                                features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan Dasar", "Galeri Foto (5)"],
                                color: "blue",
                                badge: "Hemat"
                            },
                            {
                                id: "premium",
                                name: "Premium",
                                price: "149k",
                                priceNum: 149000,
                                originalPrice: "249k",
                                features: ["Semua Tema Pilihan", "Masa Aktif Selamanya", "RSVP & Ucapan Pro", "Galeri Foto & Video", "Musik Latar Custom"],
                                color: "pink",
                                badge: "Populer"
                            },
                            {
                                id: "royal",
                                name: "Royal",
                                price: "299k",
                                priceNum: 299000,
                                originalPrice: "499k",
                                features: ["Semua Fitur Premium+", "Domain Custom .com*", "QR Code Check-in", "Prioritas Support", "Desain Eksklusif"],
                                color: "amber",
                                badge: "VIP"
                            }
                        ].map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`group relative p-4 md:p-10 rounded-2xl md:rounded-[3rem] border transition-all duration-500 flex flex-col items-center text-center overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${pkg.id === 'premium'
                                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 border-transparent text-white shadow-xl shadow-pink-200 lg:scale-[1.05]'
                                    : 'bg-white border-pink-100 text-slate-900 shadow-lg'
                                    }`}
                            >
                                {/* Badge */}
                                <div className={`absolute top-0 right-0 px-2.5 py-1 md:px-5 md:py-2 rounded-bl-xl md:rounded-bl-2xl text-[7px] md:text-[10px] font-black tracking-widest uppercase ${pkg.id === 'premium' ? 'bg-white/20' : 'bg-pink-50 text-pink-500'
                                    }`}>
                                    {pkg.badge}
                                </div>

                                <span className={`px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-4 md:mb-8 ${pkg.id === 'premium' ? 'bg-white/20' : 'bg-pink-50 text-pink-600'
                                    }`}>
                                    {pkg.name}
                                </span>

                                <div className="mb-4 md:mb-10">
                                    <div className={`text-[9px] md:text-sm font-bold line-through mb-0.5 md:mb-1 ${pkg.id === 'premium' ? 'text-white/50 decoration-white/40' : 'text-slate-300 decoration-pink-300'
                                        }`}>
                                        Rp {pkg.originalPrice}
                                    </div>
                                    <div className="flex items-baseline justify-center gap-0.5 md:gap-1">
                                        <span className="text-lg md:text-5xl font-black">
                                            {pkg.priceNum === 0 ? "Gratis" : pkg.price}
                                        </span>
                                        {pkg.priceNum > 0 && <span className={`text-[8px] md:text-sm font-bold opacity-70`}>/unit</span>}
                                    </div>
                                </div>

                                <ul className="space-y-1.5 md:space-y-4 text-left w-full mb-6 md:mb-12">
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className={`flex items-start gap-1.5 md:gap-3 text-[9px] md:text-sm ${pkg.id === 'premium' ? 'text-white/90' : 'text-slate-600'
                                            }`}>
                                            <Zap className={`h-2.5 w-2.5 md:h-4 md:w-4 flex-shrink-0 mt-0.5 ${pkg.id === 'premium' ? 'text-white' : 'text-pink-500'
                                                }`} />
                                            <span className="leading-snug md:leading-tight">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => openRegister()}
                                    className={`w-full py-2.5 md:py-4 text-[10px] md:text-base rounded-xl md:rounded-2xl font-bold transition-all mt-auto cursor-pointer ${pkg.id === 'premium'
                                        ? 'bg-white text-pink-600 hover:shadow-xl hover:scale-[1.02]'
                                        : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
                                        }`}
                                >
                                    Pilih {pkg.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <RegisterModal
                    isOpen={isRegisterOpen}
                    onClose={() => setIsRegisterOpen(false)}
                    selectedTheme={selectedTheme}
                />
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-12 md:py-40 bg-pink-50/50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24">
                        <h2 className="font-serif text-2xl sm:text-4xl md:text-7xl italic mb-3 md:mb-6">Pertanyaan Sering Diajukan</h2>
                        <p className="text-slate-500 dark:text-slate-300 text-sm md:text-lg">
                            Temukan jawaban untuk pertanyaan yang paling sering ditanyakan mengenai Vowly.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {[
                            {
                                q: "Apa itu Vowly?",
                                a: "Vowly adalah platform pembuatan undangan pernikahan digital yang memudahkan Anda membuat undangan elegan dan interaktif dalam hitungan menit."
                            },
                            {
                                q: "Bagaimana cara membuat undangan digital?",
                                a: "Cukup pilih tema yang Anda sukai, lengkapi data pendaftaran, selesaikan pembayaran (jika berbayar), dan undangan Anda siap dikelola dari dashboard."
                            },
                            {
                                q: "Apakah saya bisa mengubah tema setelah memilih?",
                                a: "Ya, Anda dapat mengubah tema kapan saja melalui dashboard admin tanpa kehilangan data yang sudah diisi."
                            },
                            {
                                q: "Apakah ada biaya tambahan untuk fitur premium?",
                                a: "Tidak ada. Sekali bayar untuk paket Premium atau Royal, Anda mendapatkan akses ke semua fitur yang dijanjikan tanpa biaya tersembunyi."
                            },
                            {
                                q: "Berapa lama undangan saya akan aktif?",
                                a: "Untuk paket Lite aktif selama 3 hari. Paket Basic aktif 1 tahun, sedangkan paket Premium dan Royal aktif selamanya."
                            },
                            {
                                q: "Bagaimana cara membagikan undangan?",
                                a: "Anda akan mendapatkan link khusus yang bisa dibagikan langsung melalui WhatsApp, Instagram, atau media sosial lainnya."
                            },
                            {
                                q: "Apakah tamu bisa mengirim ucapan dan doa?",
                                a: "Tentu saja! Fitur RSVP dan Digital Guestbook memungkinkan tamu memberikan doa restu secara langsung di undangan."
                            },
                            {
                                q: "Bisakah saya menambahkan musik sendiri?",
                                a: "Ya, untuk paket Premium Anda dapat memilih dari daftar lagu kami atau mengunggah musik favorit Anda sendiri."
                            }
                        ].map((item, idx) => (
                            <FAQItem key={idx} q={item.q} a={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 md:py-20 border-t border-pink-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
                        <div className="space-y-2 md:space-y-4 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <img src="/logo-vowly.png" alt="Vowly Logo" className="h-6 md:h-8 w-auto object-contain" />
                                <span className="font-serif text-lg md:text-xl italic font-bold text-pink-600">Vowly</span>
                            </div>
                            <p className="text-slate-400 dark:text-slate-300 text-xs md:text-sm max-w-xs">Mewujudkan undangan impian Anda menjadi kenyataan digital.</p>
                        </div>
                        <div className="flex gap-4 md:gap-10 text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-300">
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-20 pt-6 md:pt-10 border-t border-slate-50 dark:border-white/[0.02] text-center text-[9px] md:text-[10px] text-slate-400 tracking-widest uppercase">
                        © 2026 Vowly. Created with love by Fahmi
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;