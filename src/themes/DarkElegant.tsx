import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FC } from "react";
import {
    Home,
    Heart,
    Calendar,
    Camera,
    Gift,
    MessageCircle,
    Star,
    Sun,
    Moon,
    MoveRight,
    Quote,
    Copy,
    Check,
    CheckCircle2,
    Users,
    X,
    Smile,
    ChevronLeft,
    ChevronRight,
    Maximize2,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { dbService } from "../services/dbService";
import { AttendanceStatus, type RSVP, type Wish } from "../types";

// Shared Components
import MusicPlayer from "./Shared/MusicPlayer";
import MusicController from "./Shared/MusicController";
import AutoScrollController from "./Shared/AutoScrollController";
import InstallPrompt from "./Shared/InstallPrompt";
import StickerPicker from "./Shared/StickerPicker";

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
    const guestName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0b] overflow-hidden text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-16 animate-reveal">
                <div className="space-y-6 text-center">
                    <p className="tracking-[1em] text-[10px] font-black uppercase text-emerald-500/60 font-sans">The Wedding Invitation of</p>
                    <h1 className="text-7xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
                        {config.couple.groom.name} <span className="font-sans not-italic text-emerald-500 mx-4">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-left space-y-4">
                        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.5em]">Dear Distinguished Guest</p>
                        <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white">
                            {guestName || "Distinguished Guest"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/50"
                    >
                        Enter Ceremony
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col justify-end bg-white dark:bg-[#0a0a0b] text-black dark:text-white transition-colors duration-1000 overflow-hidden p-8 md:p-24 text-left">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,white_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0b_100%)] z-10 transition-colors duration-1000"></div>
            <div className="relative z-20 flex flex-col md:flex-row items-end justify-between gap-16 border-t border-black/5 dark:border-white/5 pt-16 transition-colors duration-1000">
                <div className="space-y-8 max-w-4xl text-left animate-reveal">
                    <div className="flex items-center gap-6">
                        <div className="h-px w-12 bg-emerald-500"></div>
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500">Official Union</p>
                    </div>
                    <h1 className="text-8xl md:text-[15rem] font-serif italic tracking-tighter text-black dark:text-white leading-[0.8] transition-colors duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="font-sans not-italic text-emerald-500/50">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-start md:items-end gap-6 text-left md:text-right animate-reveal">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 dark:text-white/40">The Calendar Event</p>
                    <p className="text-5xl md:text-8xl font-serif italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000">
                        {config.hero.date}
                    </p>
                    <p className="text-sm font-medium text-black/30 dark:text-white/30 max-w-[280px] leading-relaxed italic border-r-2 border-emerald-500/30 pr-6 hidden md:block">
                        "Two paths converge under the midnight sky to form a constellation of eternal love."
                    </p>
                </div>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 text-black dark:text-white relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    <div className="space-y-16 group text-left">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000 text-left">
                            <div className="w-full h-full overflow-hidden rounded-[2rem]">
                                <img src={config.couple.groom.image} className="w-full h-full object-cover transition-all" alt={config.couple.groom.fullName} />
                            </div>
                            <span className="absolute top-12 left-12 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">The Groom</span>
                        </div>
                        <div className="space-y-8 pl-6 text-left">
                            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000">{config.couple.groom.fullName}</h2>
                            <div className="h-[2px] w-20 bg-emerald-500/50"></div>
                            <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60">{config.couple.groom.parents}</p>
                        </div>
                    </div>

                    <div className="space-y-16 group md:mt-64 text-left">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000 text-left">
                            <div className="w-full h-full overflow-hidden rounded-[2rem]">
                                <img src={config.couple.bride.image} className="w-full h-full object-cover transition-all" alt={config.couple.bride.fullName} />
                            </div>
                            <span className="absolute top-12 right-12 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">The Bride</span>
                        </div>
                        <div className="space-y-8 md:text-right flex flex-col md:items-end pr-6">
                            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000">{config.couple.bride.fullName}</h2>
                            <div className="h-[2px] w-20 bg-emerald-500/50"></div>
                            <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60">{config.couple.bride.parents}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LoveStory: FC = () => {
    const { config } = useSettings();
    return (
        <section id="story" className="bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-12 text-left">
                    <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Timeline</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className="group relative text-left">
                            <div className="absolute inset-0 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all duration-700 shadow-xl"></div>
                            <div className="relative p-12 md:p-16 space-y-12 h-full text-left">
                                <p className="text-5xl md:text-7xl font-serif italic tracking-tighter text-black/10 dark:text-white/20">{story.date}</p>
                                <h3 className="text-4xl md:text-5xl font-serif italic tracking-tighter leading-tight text-black/80 dark:text-white/80">{story.title}</h3>
                                <p className="text-sm font-medium text-black/30 dark:text-white/30 uppercase tracking-tight italic">{story.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();
    return (
        <section id="event" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Ceremony</h2>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event) => (
                        <div key={event.id} className="relative p-12 md:p-20 space-y-16 text-left bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all shadow-2xl">
                            <h3 className="text-5xl md:text-6xl font-serif italic tracking-tighter leading-none">{event.title}</h3>
                            <div className="space-y-4">
                                <p className="text-4xl font-serif italic tracking-tight">{event.day}, {event.date}</p>
                                <p className="text-xl font-black uppercase tracking-tight text-emerald-500/60">{event.startTime} — {event.endTime} WIB</p>
                                <h4 className="text-2xl font-serif italic tracking-tight text-black/80 dark:text-white/80">{event.venue.name}</h4>
                                <p className="text-sm text-black/30 dark:text-white/30 max-w-[300px] leading-relaxed italic">{event.venue.address}</p>
                            </div>
                            <a href={event.venue.mapsEmbedUrl.replace('&output=embed', '')} target="_blank" className="text-[10px] font-black tracking-widest uppercase text-emerald-400">View Coordinate</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
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
        <section id="gallery" className="bg-white dark:bg-[#0a0a0b] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Ambient Background Accents */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-1/2 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto max-w-5xl space-y-16 sm:space-y-24 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-8">
                        <p className="tracking-[1em] text-[10px] font-black uppercase text-emerald-500/60 font-sans">Frames of Infinite Love</p>
                        <h2 className="text-8xl md:text-[14rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000">Celestial</h2>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-8 justify-center max-w-4xl mx-auto px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-emerald-500 transition-all active:scale-95 flex-shrink-0 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-xl"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-700 bg-white/5 p-1 border ${activeIndex === idx
                                        ? "border-emerald-500/50 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-20 grayscale-0"
                                        : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover rounded-xl sm:rounded-[1.8rem]" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-emerald-500 transition-all active:scale-95 flex-shrink-0 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-xl"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl group transition-all duration-1000 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, filter: "blur(10px) brightness(0.5)" }}
                                animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
                                exit={{ opacity: 0, filter: "blur(10px) brightness(0.5)" }}
                                transition={{ duration: 1.2, ease: "anticipate" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer rounded-[2.5rem] brightness-90 group-hover:brightness-100 transition-all duration-1000"
                                alt="Celestial Frame"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Enhanced Overlay */}
                        <div className="absolute inset-x-8 bottom-12 flex justify-between items-end">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-emerald-500 hover:text-white"
                            >
                                <Maximize2 size={24} />
                            </button>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Fullscreen View</p>
                            </div>
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0a0a0b]/95 backdrop-blur-2xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-500 hover:border-emerald-500/30 transition-all z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-white/20 hover:text-emerald-500 transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[120px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                                    transition={{ duration: 0.6, ease: "circOut" }}
                                    className="relative max-h-full max-w-full flex items-center justify-center p-2 sm:p-4 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[80vh] w-auto h-auto object-contain rounded-[2rem] border border-white/5 shadow-2xl"
                                        alt="Celestial Fullscreen"
                                    />

                                    <div className="absolute inset-x-0 -bottom-20 flex items-center justify-center">
                                        <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 px-10 py-4 rounded-full">
                                            <p className="font-serif italic text-2xl text-emerald-400">
                                                Frame {selectedImg + 1} // {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1, x: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-white/20 hover:text-emerald-500 transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={64} className="sm:size-[120px]" strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const GiftInfo: FC = () => {
    const { config } = useSettings();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text || "");
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    return (
        <section id="gift" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <h2 className="text-8xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000 text-left">Presence</h2>
                <div className="grid grid-cols-1 gap-6 text-left lg:w-1/2">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl space-y-10 group hover:border-emerald-500/20 shadow-xl transition-all text-left">
                            <p className="text-[9px] font-black uppercase text-emerald-500/40 italic">{account.bank}</p>
                            <h3 className="text-5xl font-serif italic tracking-tight font-black">{account.number}</h3>
                            <p className="text-sm font-black uppercase text-black/20 dark:text-white/20">Holder: {account.name}</p>
                            <button onClick={() => copyToClipboard(account.number, `bank-${idx}`)} className="w-full py-6 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-black dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all active:scale-95 shadow-2xl">
                                {copiedId === `bank-${idx}` ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const RSVPForm: FC = () => {
    const { invitationId } = useSettings();
    const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null as { id: string; src: string } | null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [showStickerPicker, setShowStickerPicker] = useState(false);

    useEffect(() => {
        if (!invitationId) return;
        const to = new URLSearchParams(window.location.search).get("to");
        if (to) setFormData((prev) => ({ ...prev, guest_name: to }));
        loadRSVPs();
    }, [invitationId]);

    const loadRSVPs = async () => {
        if (!invitationId) return;
        const data = await dbService.getRSVPs(invitationId);
        setRsvps(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !invitationId) return;
        setIsSubmitting(true);
        try {
            await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || undefined });
            setSubmitted(true);
            await loadRSVPs();
        } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
    };

    return (
        <section id="rsvp" className="bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start text-left">
                    <div className="space-y-20 text-left">
                        <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000 text-left">Reception</h2>
                        {submitted ? (
                            <div className="p-16 border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] rounded-[4rem] text-center">
                                <CheckCircle2 className="text-emerald-500 h-24 w-24 mx-auto" strokeWidth={1} />
                                <h3 className="text-4xl font-serif italic tracking-tight mt-4">Entry Recorded</h3>
                                <button onClick={() => setSubmitted(false)} className="text-emerald-500 mt-8 uppercase text-xs">Request Correction</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16 text-left">
                                <input required placeholder="INPUT FULL NAME" className="w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all" value={formData.guest_name} onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                                <textarea rows={2} placeholder="A SHORT SENTIMENT..." className="w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-[2.5rem] px-12 py-8 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                <div className="flex items-center justify-between px-8">
                                    <label className="text-[10px] uppercase text-black/30 dark:text-white/30 italic">Sticker</label>
                                    <button type="button" onClick={() => setShowStickerPicker(true)} className="text-emerald-500"><Smile size={24} /></button>
                                </div>
                                {formData.sticker && <div className="relative inline-block mt-2 ml-8 text-left"><img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" /><button type="button" onClick={() => setFormData({ ...formData, sticker: null })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
                                {showStickerPicker && <StickerPicker isOpen={showStickerPicker} selectedSticker={formData.sticker?.id || null} onSelect={(sticker) => { setFormData({ ...formData, sticker }); setShowStickerPicker(false); }} onClose={() => setShowStickerPicker(false)} />}
                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button key={status} type="button" onClick={() => setFormData({ ...formData, attendance: status })} className={`py-8 rounded-full font-black uppercase tracking-widest text-[10px] border transition-all ${formData.attendance === status ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border-black/5 dark:border-white/5'}`}>{status.replace('TIDAK_HADIR', 'Distantly Notified').replace('HADIR', 'Confirming Presence')}</button>
                                    ))}
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-emerald-500 text-white py-8 rounded-full font-black uppercase text-xs hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95">{isSubmitting ? "PROCESSING..." : "CONFIRM RECEIPT"}</button>
                            </form>
                        )}
                    </div>
                    <div className="space-y-20 lg:pl-24 text-left">
                        <div className="flex flex-col items-end gap-3 text-right">
                            <p className="text-8xl font-serif italic text-black dark:text-white">{rsvps.length}</p>
                            <div className="flex items-center gap-4 text-emerald-500"><Users size={16} /><p className="text-[10px] uppercase tracking-widest font-black">Enrolled Guests</p></div>
                        </div>
                        <div className="space-y-6">
                            {rsvps.slice(0, 5).map(rsvp => (
                                <div key={rsvp.id} className="p-10 bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[3rem] space-y-6 group hover:border-emerald-500/20 transition-all text-left">
                                    <div className="flex justify-between items-center text-left">
                                        <h4 className="text-3xl font-serif italic text-black/80 dark:text-white/80">{rsvp.guest_name}</h4>
                                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${rsvp.attendance === AttendanceStatus.HADIR ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-black/5 dark:border-white/5'}`}><Heart size={16} {... (rsvp.attendance === AttendanceStatus.HADIR ? { fill: 'currentColor' } : {})} /></div>
                                    </div>
                                    <p className="text-black/30 dark:text-white/30 text-sm italic">"{rsvp.message || "A silent wish."}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Wishes: FC = () => {
    const { invitationId } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const loadWishes = async () => { if (!invitationId) return; const data = await dbService.getWishes(invitationId); setWishes(data); };
    useEffect(() => { if (!invitationId) return; const to = new URLSearchParams(window.location.search).get("to"); if (to) setName(to); loadWishes(); }, [invitationId]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!name.trim() || !message.trim() || !invitationId) return;
        try { await dbService.saveWish(invitationId, { name, message }); setMessage(""); loadWishes(); } catch (err) { console.error(err); }
    };
    return (
        <section id="wishes" className="bg-white dark:bg-[#0a0a0b] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <div className="grid lg:grid-cols-12 gap-24 items-start text-left">
                    <div className="lg:col-span-5 space-y-20 text-left text-black dark:text-white">
                        <h2 className="text-7xl md:text-8xl font-serif italic text-black dark:text-white text-left">Sentiments</h2>
                        <form onSubmit={handleSubmit} className="space-y-12 bg-black/[0.01] dark:bg-white/[0.02] p-12 md:p-16 border border-black/5 dark:border-white/5 rounded-[4rem] text-left">
                            <input required placeholder="YOUR NAME" className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic outline-none text-black dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
                            <textarea required placeholder="TYPE MESSAGE..." rows={4} className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic outline-none resize-none text-black dark:text-white" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-full font-black uppercase text-xs hover:bg-emerald-500 hover:text-white active:scale-95 shadow-xl">POST SENTIMENT</button>
                        </form>
                    </div>
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 text-left">
                        <div className="flex items-center gap-6 border-b border-black/5 dark:border-white/5 pb-12 text-left">
                            <Quote className="text-emerald-500 h-10 w-10 rotate-180" /><p className="text-[10px] uppercase tracking-[1em] text-black/20 dark:text-white/20">Archive — {wishes.length}</p>
                        </div>
                        <div className="grid md:grid-cols-1 gap-16 text-left">
                            {wishes.slice(0, 4).map(wish => (
                                <div key={wish.id} className="space-y-6 text-left group">
                                    <p className="text-5xl md:text-6xl font-serif italic text-black/90 dark:text-white/90 group-hover:text-emerald-400 transition-colors">"{wish.message}"</p>
                                    <div className="flex items-center gap-12 pt-4 text-left"><div className="h-[1px] w-12 bg-emerald-500/30"></div><p className="text-2xl font-serif italic text-black/60 dark:text-white/60">{wish.name}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const navItems = [{ icon: Home, label: "Aura", href: "#hero" }, { icon: Heart, label: "Ones", href: "#couple" }, { icon: Star, label: "Log", href: "#story" }, { icon: Calendar, label: "Time", href: "#event" }, { icon: Camera, label: "Frames", href: "#gallery" }, { icon: Gift, label: "Token", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32 pointer-events-none'}`}>
            <div className="bg-[#0f0f11]/80 backdrop-blur-3xl border border-white/10 px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-white/40 hover:text-emerald-400 transition-all"><item.icon size={20} /><span className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] px-4 py-2 rounded-full hidden group-hover:block">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-white/40 hover:text-emerald-400 transition-all">{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}</button>
            </div>
        </nav>
    );
};

const DarkElegantTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => { document.body.style.overflow = isOpened ? "auto" : "hidden"; }, [isOpened]);
    return (
        <div className={`dark-elegant-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}
            <main className={`transition-all duration-[2s] ease-in-out ${isOpened ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-3xl scale-125 pointer-events-none"}`}>
                <Hero /><CoupleProfile /><LoveStory /><EventDetails /><Gallery /><GiftInfo /><RSVPForm /><Wishes />
            </main>
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4"><MusicController /><AutoScrollController isOpened={isOpened} /></div>
            <Navbar theme={theme} toggleTheme={toggleTheme} /><MusicPlayer /><InstallPrompt />
        </div>
    );
};
export default DarkElegantTheme;
