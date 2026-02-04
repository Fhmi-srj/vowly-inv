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
    MoveLeft,
    Quote,
    Sparkles,
    Zap,
    MapPin,
    Clock,
    ArrowUpRight,
    Landmark,
    Copy,
    Check,
    CheckCircle2,
    Users,
    X,
    Smile,
    Mail,
    Sparkle,
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#4a0404] overflow-hidden text-[#d4af37]">
            {/* Traditional Batik Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')]"></div>

            {/* Elegant Gold Borders */}
            <div className="absolute inset-4 md:inset-8 border-[1px] border-[#d4af37]/30 pointer-events-none"></div>
            <div className="absolute inset-6 md:inset-12 border-[3px] border-[#d4af37]/20 pointer-events-none"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                {/* Royal Crest / Logo Area */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-[#d4af37]/20 animate-pulse"></div>
                    <span className="text-4xl md:text-5xl font-serif italic">{config.couple.groom.name[0]}{config.couple.bride.name[0]}</span>
                </div>

                <div className="space-y-6">
                    <p className="tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#d4af37]/80">The Honorable Wedding of</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#f9d976] via-[#d4af37] to-[#8d6e1c]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/60 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="text-3xl md:text-5xl font-serif italic tracking-tight text-white/90">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-4 px-12 py-5 bg-gradient-to-b from-[#d4af37] to-[#8d6e1c] text-maroon-900 font-bold uppercase text-[10px] tracking-[0.3em] rounded-md hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all active:scale-95 text-black"
                    >
                        <Mail size={16} />
                        Buka Undangan
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#d4af37]/40 uppercase">Exclusive Invitation</p>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] transition-colors duration-1000 overflow-hidden px-8 py-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] opacity-[0.03] dark:opacity-10 bg-fixed transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#2a0202] via-transparent to-white dark:to-[#2a0202] opacity-60 transition-colors duration-1000"></div>

            <div className="absolute top-0 left-0 w-48 h-48 border-t-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute top-0 right-0 w-48 h-48 border-t-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 border-b-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 border-b-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-16 animate-reveal">
                <div className="text-center space-y-6">
                    <p className="tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#d4af37]/80 leading-relaxed max-w-2xl mx-auto">
                        Mengarungi Samudera Kehidupan Dalam Ikatan Suci
                    </p>
                    <div className="h-px w-24 bg-[#d4af37] mx-auto opacity-50"></div>
                </div>

                <div className="text-center">
                    <h1 className="text-[5rem] md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white via-[#d4af37] to-[#4a3a0a] transition-all duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl font-sans not-italic text-[#d4af37]/40">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-8 text-center pt-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37]/60">Saturdays | Premiere</p>
                        <p className="text-4xl md:text-6xl font-serif italic tracking-tight text-black/80 dark:text-white/90 transition-colors duration-1000">
                            {config.hero.date}
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce opacity-30">
                <div className="w-[1px] h-12 bg-[#d4af37]"></div>
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 text-[#8d6e1c] dark:text-[#d4af37] relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')]"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-8">
                    <h2 className="text-5xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/40 dark:to-white/40 transition-all duration-1000">Sang Mempelai</h2>
                    <div className="w-24 h-[1px] bg-[#d4af37] mx-auto opacity-30"></div>
                    <p className="text-sm md:text-lg font-serif italic text-[#d4af37]/60 max-w-2xl mx-auto leading-relaxed">
                        "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, binalah rumah tangga kami dengan ikatan pusaka-Mu."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    <div className="space-y-16 group flex flex-col items-center md:items-start">
                        <div className="relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]">
                            <div className="w-full h-full overflow-hidden rounded-t-[9.5rem]">
                                <img src={config.couple.groom.image} className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" alt={config.couple.groom.fullName} />
                            </div>
                            <div className="absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none"></div>
                        </div>
                        <div className="space-y-8 text-center md:text-left">
                            <h3 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">{config.couple.groom.fullName}</h3>
                            <div className="h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:mx-0"></div>
                            <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.groom.parents}</p>
                        </div>
                    </div>

                    <div className="space-y-16 group flex flex-col items-center md:items-end md:mt-32">
                        <div className="relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]">
                            <div className="w-full h-full overflow-hidden rounded-t-[9.5rem]">
                                <img src={config.couple.bride.image} className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" alt={config.couple.bride.fullName} />
                            </div>
                            <div className="absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none"></div>
                        </div>
                        <div className="space-y-8 text-center md:text-right">
                            <h3 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000">{config.couple.bride.fullName}</h3>
                            <div className="h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:ml-auto md:mr-0"></div>
                            <p className="text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000">{config.couple.bride.parents}</p>
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
        <section id="story" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8d6e1c]/10 dark:via-[#d4af37]/20 to-transparent transition-colors duration-1000"></div>
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] transition-opacity duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-center">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center">Romansa</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000 text-center">Sekelumit Kisah Cinta Kami</p>
                </div>

                <div className="relative space-y-24 max-w-5xl mx-auto">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#d4af37]/10 hidden md:block"></div>
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-[#fdfcf0] dark:bg-[#2a0202] border border-[#8d6e1c]/30 dark:border-[#d4af37]/50 flex items-center justify-center transition-colors duration-1000">
                                    <div className="w-1 h-1 rounded-full bg-[#8d6e1c] dark:bg-[#d4af37] animate-ping transition-colors duration-1000"></div>
                                </div>
                            </div>
                            <div className={`w-full md:w-1/2 space-y-8 group transition-all duration-700 hover:-translate-y-2 ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white/50 dark:bg-black/10 backdrop-blur-xl relative overflow-hidden transition-all duration-700 group-hover:border-[#8d6e1c]/40 dark:group-hover:border-[#d4af37]/40 shadow-2xl">
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#d4af37]/30"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#d4af37]/30"></div>
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-serif italic tracking-tighter text-[#8d6e1c] dark:text-[#d4af37]/80 leading-none transition-colors duration-1000">{story.date}</p>
                                        <h3 className="text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90 leading-none transition-colors duration-1000">{story.title}</h3>
                                    </div>
                                    <div className={`w-12 h-[1px] bg-[#d4af37]/40 my-8 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                    <p className="text-[#8d6e1c]/40 dark:text-[#d4af37]/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase transition-colors duration-1000">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:block w-1/2"></div>
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
        <section id="event" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-40 relative z-10 text-center">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center">Momentum</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000 text-center">Agenda Perayaan Suci</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group p-12 md:p-20 space-y-16 flex flex-col items-center text-center bg-white dark:bg-black/20 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 backdrop-blur-xl rounded-lg shadow-2xl transition-all duration-700">
                            <div className="inline-block px-8 py-2 border border-[#8d6e1c]/30 dark:border-[#d4af37]/30 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-4">{event.title}</div>
                            <div className="space-y-12 w-full">
                                <div className="space-y-4">
                                    <p className="text-3xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90">{event.day}, {event.date}</p>
                                    <div className="flex items-center justify-center gap-3 text-xl font-bold uppercase tracking-widest"><Clock size={20} /><span>{event.startTime} — {event.endTime} WIB</span></div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90">{event.venue.name}</h4>
                                    <p className="text-xs md:text-sm text-[#8d6e1c]/40 dark:text-[#d4af37]/40 max-w-[350px] mx-auto leading-relaxed italic uppercase tracking-wider">{event.venue.address}</p>
                                </div>
                            </div>
                            <a href={event.venue.mapsEmbedUrl.replace('&output=embed', '')} target="_blank" className="px-10 py-4 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 rounded-md text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8d6e1c] hover:text-white transition-all">Petunjuk Peta</a>
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
        <section id="gallery" className="bg-[#f9f8f0] dark:bg-[#2a0202] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Batik Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-8">
                        <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white via-[#d4af37] to-[#4a3a0a]">Galeri</h2>
                        <p className="tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60">Dokumentasi Moment</p>
                        <div className="w-24 h-[1px] bg-[#d4af37] opacity-30"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 bg-[#4a0404] dark:bg-black/40 border-2 border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#4a0404] transition-all shadow-xl active:scale-95 flex-shrink-0 rounded-none transform rotate-45"
                        >
                            <ChevronLeft size={24} className="-rotate-45" />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-[#d4af37] scale-110 shadow-2xl z-20 grayscale-0"
                                        : "border-[#d4af37]/10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 bg-[#4a0404] dark:bg-black/40 border-2 border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#4a0404] transition-all shadow-xl active:scale-95 flex-shrink-0 rounded-none transform rotate-45"
                        >
                            <ChevronRight size={24} className="-rotate-45" />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white/50 dark:bg-[#4a0404]/20 p-2 sm:p-4 border border-[#d4af37]/30 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] group transition-all duration-1000 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.1, filter: "grayscale(1)" }}
                                animate={{ opacity: 1, scale: 1, filter: "grayscale(0.2)" }}
                                exit={{ opacity: 0, scale: 0.9, filter: "grayscale(1)" }}
                                transition={{ duration: 1.2, ease: "anticipate" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:grayscale-0 transition-all duration-1000"
                                alt="Royal Moment"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Royal Frames / Borders */}
                        <div className="absolute inset-4 border border-[#d4af37]/20 pointer-events-none group-hover:inset-6 transition-all duration-700"></div>

                        {/* Action Button */}
                        <div className="absolute bottom-12 right-12 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 bg-[#4a0404]/80 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#d4af37] hover:text-[#4a0404] shadow-2xl"
                            >
                                <Maximize2 size={28} />
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#4a0404]/98 backdrop-blur-3xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#d4af37] hover:scale-110 hover:rotate-90 transition-all duration-500 z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={40} className="sm:size-16" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.2, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[120px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-6 bg-white shadow-2xl rounded-none"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[85vh] w-auto h-auto object-contain border border-[#d4af37]/20"
                                        alt="Fullscreen Moment"
                                    />

                                    <div className="absolute inset-x-0 -bottom-24 flex items-center justify-center">
                                        <div className="px-10 py-4 bg-black/40 backdrop-blur-3xl border border-[#d4af37]/30">
                                            <p className="font-serif italic text-2xl text-[#d4af37] uppercase tracking-widest leading-none">
                                                Archive {selectedImg + 1} / {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.2, x: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors z-[2030]"
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
        <section id="gift" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-center">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-center">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center">Kado Kasih</h2>
                    <p className="text-xl md:text-2xl font-serif italic tracking-tight text-[#8d6e1c]/60 dark:text-[#d4af37]/60 mt-8 leading-relaxed max-w-2xl italic transition-colors duration-1000 text-center">"Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white/50 dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 p-12 rounded-none backdrop-blur-3xl space-y-10 group relative transition-all duration-700 hover:border-[#8d6e1c]/60 dark:hover:border-[#d4af37]/60 text-left">
                            <div className="flex justify-between items-start text-left">
                                <div className="space-y-4 text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] italic">{account.bank}</p>
                                    <h3 className="text-4xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90 font-black">{account.number}</h3>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.3em]">A.N {account.name}</p>
                                </div>
                                <Landmark size={24} className="opacity-20" />
                            </div>
                            <button onClick={() => copyToClipboard(account.number, `bank-${idx}`)} className="w-full py-5 border border-[#8d6e1c]/20 dark:border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8d6e1c] hover:text-white transition-all shadow-xl active:scale-95">
                                {copiedId === `bank-${idx}` ? <Check size={14} /> : <Copy size={14} />}
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

    const loadRSVPs = async () => { if (!invitationId) return; const data = await dbService.getRSVPs(invitationId); setRsvps(data); };
    useEffect(() => { if (!invitationId) return; const to = new URLSearchParams(window.location.search).get("to"); if (to) setFormData(p => ({ ...p, guest_name: to })); loadRSVPs(); }, [invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!formData.guest_name || !invitationId) return; setIsSubmitting(true);
        try { await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || undefined }); setSubmitted(true); loadRSVPs(); } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
    };

    return (
        <section id="rsvp" className="bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start text-left">
                    <div className="space-y-20 text-left">
                        <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/20 dark:to-white/20 transition-all duration-1000 text-left">RSVP</h2>
                        {submitted ? (
                            <div className="p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 bg-white/50 dark:bg-black/20 text-center">
                                <CheckCircle2 className="text-[#d4af37] h-24 w-24 mx-auto" />
                                <h3 className="text-3xl font-serif italic mt-4">Terima Kasih</h3>
                                <button onClick={() => setSubmitted(false)} className="text-[#8d6e1c] dark:text-[#d4af37] mt-8 uppercase text-xs">Kirim Ulang</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16 text-left">
                                <input required placeholder="NAMA LENGKAP" className="w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic outline-none focus:border-[#d4af37]/60" value={formData.guest_name} onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                                <textarea rows={2} placeholder="TULIS PESAN ANDA..." className="w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic outline-none resize-none focus:border-[#d4af37]/60" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                <div className="flex items-center justify-between px-8 text-left">
                                    <label className="text-[10px] uppercase text-[#d4af37]/40">Sticker</label>
                                    <button type="button" onClick={() => setShowStickerPicker(true)} className="text-[#d4af37] transition-colors"><Smile size={24} /></button>
                                </div>
                                {formData.sticker && <div className="relative inline-block mt-2 ml-8 text-left"><img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" /><button type="button" onClick={() => setFormData(p => ({ ...p, sticker: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
                                {showStickerPicker && <StickerPicker isOpen={showStickerPicker} selectedSticker={formData.sticker?.id || null} onSelect={(sticker) => { setFormData(p => ({ ...p, sticker })); setShowStickerPicker(false); }} onClose={() => setShowStickerPicker(false)} />}
                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button key={status} type="button" onClick={() => setFormData({ ...formData, attendance: status })} className={`py-8 font-bold uppercase tracking-widest text-[9px] border transition-all ${formData.attendance === status ? 'bg-[#8d6e1c] dark:bg-[#d4af37] text-white dark:text-maroon-900 border-[#8d6e1c] dark:border-[#d4af37]' : 'bg-white dark:bg-black/20 text-[#8d6e1c]/40 dark:text-[#d4af37]/40 border-[#8d6e1c]/10 dark:border-[#d4af37]/10'}`}>{status.replace('TIDAK_HADIR', 'Berhalangan').replace('HADIR', 'Akan Hadir')}</button>
                                    ))}
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-gradient-to-b from-[#8d6e1c] dark:from-[#d4af37] to-[#4a3a0a] dark:to-[#8d6e1c] text-white dark:text-maroon-900 py-8 font-bold uppercase tracking-[0.4em] text-[10px] active:scale-95 transition-all">{isSubmitting ? "MEMPROSES..." : "KONFIRMASI KEHADIRAN"}</button>
                            </form>
                        )}
                    </div>
                    <div className="space-y-20 lg:pl-24 text-left">
                        <div className="flex flex-col items-end gap-3 text-right">
                            <p className="text-7xl md:text-8xl font-serif italic text-black/80 dark:text-white/90">{rsvps.length}</p>
                            <div className="flex items-center gap-4 text-[#d4af37]"><Users size={16} /><p className="text-[10px] uppercase tracking-widest font-bold">Total Konfirmasi</p></div>
                        </div>
                        <div className="space-y-4">
                            {rsvps.slice(0, 5).map(rsvp => (
                                <div key={rsvp.id} className="p-10 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white dark:bg-black/10 text-left">
                                    <div className="flex justify-between items-center text-left"><h4 className="text-2xl md:text-3xl font-serif italic text-black/80 dark:text-white/80">{rsvp.guest_name}</h4><Heart size={16} className={rsvp.attendance === AttendanceStatus.HADIR ? "text-[#d4af37] fill-[#d4af37]" : "text-black/10"} /></div>
                                    <p className="text-[#d4af37]/40 text-sm italic mt-4">"{rsvp.message || "Hadir."}"</p>
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
        <section id="wishes" className="bg-[#f9f8f0] dark:bg-[#2a0202] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <div className="grid lg:grid-cols-12 gap-24 items-start text-left">
                    <div className="lg:col-span-5 space-y-20 text-left">
                        <h2 className="text-7xl md:text-8xl font-serif italic text-left">Untaian Doa</h2>
                        <form onSubmit={handleSubmit} className="space-y-12 bg-white dark:bg-black/20 p-12 md:p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 text-left">
                            <input required placeholder="NAMA ANDA" className="w-full bg-transparent border-b border-[#d4af37]/20 py-4 text-2xl font-serif italic outline-none text-black dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
                            <textarea required placeholder="TULIS DOA ANDA..." rows={4} className="w-full bg-transparent border-b border-[#d4af37]/20 py-4 text-2xl font-serif italic outline-none text-black dark:text-white resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="w-full bg-gradient-to-b from-[#8d6e1c] to-[#4a3a0a] text-white py-8 font-bold uppercase text-[10px] transition-all active:scale-95">KIRIM DOA RESTU</button>
                        </form>
                    </div>
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 text-left">
                        <div className="flex items-center gap-6 border-b border-[#d4af37]/10 pb-12 text-left"><Quote className="text-[#d4af37] h-10 w-10 rotate-180 opacity-40" /><p className="text-[10px] uppercase tracking-[1em] text-[#d4af37]/20 text-left">GUESTBOOK — {wishes.length}</p></div>
                        <div className="space-y-12 text-left">
                            {wishes.slice(0, 4).map(wish => (
                                <div key={wish.id} className="space-y-6 text-left group">
                                    <p className="text-4xl md:text-5xl font-serif italic text-black/80 dark:text-white/80 transition-colors group-hover:text-[#d4af37] text-left italic">"{wish.message}"</p>
                                    <div className="flex items-center gap-12 pt-4 text-left"><div className="h-[1px] w-24 bg-[#d4af37]/20"></div><p className="text-2xl font-serif italic text-[#d4af37]/80">{wish.name}</p></div>
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
    useEffect(() => { const handleScroll = () => setIsVisible(window.scrollY > 400); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);
    const navItems = [{ icon: Home, label: "Home", href: "#hero" }, { icon: Heart, label: "Mempelai", href: "#couple" }, { icon: Star, label: "Kisah", href: "#story" }, { icon: Calendar, label: "Acara", href: "#event" }, { icon: Camera, label: "Galeri", href: "#gallery" }, { icon: Gift, label: "Kado", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'}`}>
            <div className="bg-[#4a0404]/80 backdrop-blur-3xl border border-[#d4af37]/30 px-8 py-5 rounded-full flex items-center gap-6 sm:gap-10 shadow-2xl">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-[#d4af37]/40 hover:text-[#d4af37] transition-all"><item.icon size={22} /><span className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-[#d4af37] text-maroon-900 text-[9px] font-black px-5 py-3 rounded-md hidden group-hover:block whitespace-nowrap">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-[#d4af37]/40 hover:text-[#d4af37] transition-all">{theme === "light" ? <Moon size={22} /> : <Sun size={22} />}</button>
            </div>
        </nav>
    );
};

const RoyalTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => { document.body.style.overflow = isOpened ? "auto" : "hidden"; }, [isOpened]);
    return (
        <div className={`royal-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}
            <main className={`transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`}>
                <Hero /><CoupleProfile /><LoveStory /><EventDetails /><Gallery /><GiftInfo /><RSVPForm /><Wishes />
            </main>
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4"><MusicController isOpened={isOpened} /><AutoScrollController isOpened={isOpened} /></div>
            <Navbar theme={theme} toggleTheme={toggleTheme} /><MusicPlayer /><InstallPrompt />
        </div>
    );
};

export default RoyalTheme;
