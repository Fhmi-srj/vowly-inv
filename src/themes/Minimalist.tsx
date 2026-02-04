import { useState, useEffect, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../contexts/SettingsContext";
import {
    Heart,
    MailOpen,
    Sparkles,
    Home,
    User,
    Calendar,
    Image as ImageIcon,
    CheckCircle2,
    Quote,
    Gift,
    Moon,
    Sun,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
} from "lucide-react";
import MusicPlayer from "./Shared/MusicPlayer";
import MusicController from "./Shared/MusicController";
import AutoScrollController from "./Shared/AutoScrollController";
import type { ThemeProps } from "./types";

// --- Animation Components ---

const Reveal: FC<{ children: React.ReactNode; delay?: number; width?: "fit-content" | "100%"; className?: string }> = ({ children, delay = 0, width = "100%", className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            style={{ width }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// --- Sub-components ---

const Envelope: FC<{ onOpen: () => void }> = ({ onOpen }) => {
    const { config } = useSettings();
    const [guestName, setGuestName] = useState<string>("");
    const [isAnimate, setIsAnimate] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) setGuestName(to);
        setTimeout(() => setIsAnimate(true), 300);
    }, []);

    const handleOpenClick = () => {
        setIsExiting(true);
        setTimeout(() => {
            onOpen();
        }, 800);
    };

    return (
        <div
            className={`fixed inset-0 z-[2000] flex items-center justify-center bg-slate-50 transition-all duration-1000 ease-in-out dark:bg-slate-950 ${isExiting ? "pointer-events-none opacity-0 scale-110" : "opacity-100"
                }`}
        >
            <div className={`max-w-md w-full px-8 text-center transition-all duration-1000 ${isAnimate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="space-y-12">
                    <div className="space-y-4">
                        <p className="tracking-[0.5em] text-xs uppercase text-slate-400">The Wedding of</p>
                        <h1 className="text-4xl md:text-6xl font-light italic text-slate-900 dark:text-white">
                            {config.couple.groom.name} & {config.couple.bride.name}
                        </h1>
                    </div>

                    <div className="py-12 border-y border-slate-100 dark:border-slate-800 space-y-4">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Kepada Yth.</p>
                        <h2 className="text-3xl font-light dark:text-white">{guestName || "Tamu Undangan"}</h2>
                    </div>

                    <button
                        onClick={handleOpenClick}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-sm text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all group"
                    >
                        <MailOpen className="w-4 h-4" />
                        Buka Undangan
                    </button>
                </div>
            </div>
        </div>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[1100] transition-all duration-500`}>
            <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-xl">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <Home className="w-5 h-5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800"></div>
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
            </div>
        </nav>
    );
};

const Gallery: FC = () => {
    const { config } = useSettings();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedImg, setSelectedImg] = useState<number | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    // Auto-play logic: berganti setiap 3 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % config.galleryImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [config.galleryImages.length]);

    const openLightbox = (index: number) => {
        setSelectedImg(index);
        setIsClosing(false);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedImg(null);
            setIsClosing(false);
            document.body.style.overflow = "unset";
        }, 400);
    };

    const navigate = (direction: "prev" | "next", e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImg !== null) {
            if (direction === "prev") {
                setSelectedImg(selectedImg === 0 ? config.galleryImages.length - 1 : selectedImg - 1);
            } else {
                setSelectedImg(selectedImg === config.galleryImages.length - 1 ? 0 : selectedImg + 1);
            }
        } else {
            if (direction === "prev") {
                setActiveIndex(activeIndex === 0 ? config.galleryImages.length - 1 : activeIndex - 1);
            } else {
                setActiveIndex((activeIndex + 1) % config.galleryImages.length);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImg === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") navigate("prev");
            if (e.key === "ArrowRight") navigate("next");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImg]);

    return (
        <section id="gallery" className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-1000 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-20">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-6">
                        <p className="tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-slate-400">Visual Journey</p>
                        <h2 className="text-6xl md:text-9xl font-light italic text-slate-900 dark:text-white lowercase tracking-tighter transition-colors">gallery</h2>
                        <div className="w-12 h-[1px] bg-slate-900 dark:bg-white opacity-10"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center max-w-4xl mx-auto px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-sm overflow-hidden transition-all duration-500 border-b-2 ${activeIndex === idx
                                        ? "border-slate-900 dark:border-white scale-105 shadow-lg grayscale-0 opacity-100"
                                        : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[400px] mx-auto rounded-sm overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group transition-all duration-1000">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                                alt="Gallery Highlight"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-x-8 bottom-12 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-700">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                            >
                                <Maximize2 size={24} />
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Premium Lightbox */}
            <AnimatePresence>
                {selectedImg !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-white/95 dark:bg-slate-950/98 backdrop-blur-sm p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[80px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[85vh] w-auto h-auto object-contain rounded-sm shadow-2xl"
                                        alt="Gallery Fullscreen"
                                    />

                                    <div className="absolute inset-x-0 -bottom-16 flex items-center justify-center">
                                        <p className="font-light italic text-lg text-slate-400">
                                            {selectedImg + 1} / {config.galleryImages.length}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={64} className="sm:size-[80px]" strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// --- Main Theme Component ---

const MinimalistTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    const { config } = useSettings();

    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpened]);

    return (
        <div className={`selection:bg-slate-200 bg-slate-50 dark:bg-slate-950 min-h-screen font-serif text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-1000 ${theme === 'dark' ? 'dark' : ''}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            {/* Simple Hero */}
            <section id="hero" className="h-screen flex flex-col items-center justify-center relative px-6 text-center">
                <div className="space-y-6 animate-fadeIn">
                    <p className="tracking-[0.5em] text-xs uppercase text-slate-400 dark:text-stone-500 transition-colors">The Wedding of</p>
                    <h1 className="text-5xl md:text-8xl font-light italic text-slate-900 dark:text-white">
                        {config.couple.groom.name} & {config.couple.bride.name}
                    </h1>
                    <div className="h-20 w-[1px] bg-slate-200 dark:bg-slate-800 mx-auto transition-colors"></div>
                    <p className="text-xl tracking-widest">{config.hero.date}</p>
                </div>
            </section>

            {/* Basic Content Sections */}
            <main className="max-w-4xl mx-auto px-6 space-y-32 py-32">
                {/* Couple */}
                <section id="couple" className="text-center space-y-12">
                    <Heart className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-700 transition-colors" />
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <img src={config.couple.groom.image} className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm shadow-sm" alt={config.couple.groom.fullName} />
                            <h3 className="text-2xl font-light text-slate-900 dark:text-white">{config.couple.groom.fullName}</h3>
                            <p className="text-sm text-slate-500 dark:text-stone-400 transition-colors">{config.couple.groom.parents}</p>
                        </div>
                        <div className="space-y-4">
                            <img src={config.couple.bride.image} className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm shadow-sm" alt={config.couple.bride.fullName} />
                            <h3 className="text-2xl font-light text-slate-900 dark:text-white">{config.couple.bride.fullName}</h3>
                            <p className="text-sm text-slate-500 dark:text-stone-400 transition-colors">{config.couple.bride.parents}</p>
                        </div>
                    </div>
                </section>

                {/* Detail Acara */}
                <section id="event" className="bg-white dark:bg-slate-900 p-12 text-center rounded-sm shadow-sm border border-slate-100 dark:border-white/5 transition-all duration-1000">
                    <h2 className="text-3xl font-light mb-8 italic text-slate-900 dark:text-white">Detail Acara</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {config.events.map((event, index) => (
                            <div key={index} className="space-y-4">
                                <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400 dark:text-stone-500 transition-colors">{event.title}</h4>
                                <p className="text-lg">{event.day}, {event.date}</p>
                                <p className="text-sm">{event.startTime} - {event.endTime}</p>
                                <div className="h-[1px] w-8 bg-slate-100 dark:bg-slate-800 mx-auto transition-colors"></div>
                                <p className="text-sm font-medium">{event.venue.name}</p>
                                <p className="text-xs text-slate-500 dark:text-stone-400 transition-colors">{event.venue.address}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Standardized Gallery */}
                <Gallery />
            </main>

            <MusicPlayer />

            {/* Standardized Floating Utilities */}
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4">
                <MusicController />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <footer className="py-20 text-center border-t border-slate-100 dark:border-white/5 transition-colors">
                <p className="text-xs tracking-widest uppercase text-slate-400 opacity-50">
                    Created with Vowly
                </p>
            </footer>
        </div>
    );
};

export default MinimalistTheme;
