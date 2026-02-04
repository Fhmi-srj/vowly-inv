import { useState, useEffect, useMemo } from "react";
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
    Film,
    Mail,
    MapPin,
    Clock,
    ArrowUpRight,
    Landmark,
    Copy,
    Check,
    CheckCircle2,
    Users,
    Type,
    Send,
    Smile,
    X,
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ecd8] overflow-hidden text-[#5c4033]">
            {/* Old Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]"></div>
            <div className="absolute inset-0 bg-[#704214]/5 mix-blend-multiply"></div>

            {/* Distressed Border */}
            <div className="absolute inset-8 md:inset-16 border-[12px] border-[#5c4033]/10 border-double pointer-events-none"></div>

            {/* Vintage Stamps / Philately Accents */}
            <div className="absolute top-12 right-12 md:top-24 md:right-24 rotate-12 opacity-40 group hover:grayscale-0 transition-all duration-700">
                <div className="w-24 h-32 md:w-32 md:h-40 bg-white p-2 border-2 border-dashed border-[#5c4033]/30 shadow-lg flex flex-col items-center justify-center text-center">
                    <div className="w-full h-2/3 bg-[#5c4033]/5 mb-2 border border-[#5c4033]/10"></div>
                    <p className="text-[8px] font-black uppercase tracking-tighter">Postage Paid</p>
                    <p className="text-[12px] font-serif italic text-[#c5a059]">1970s</p>
                </div>
            </div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-10 text-center animate-reveal">
                <div className="space-y-4">
                    <p className="tracking-[0.6em] text-[10px] md:text-sm font-bold uppercase text-[#5c4033]/60 font-mono">Top Secret & Exclusive</p>
                    <div className="w-16 h-[2px] bg-[#5c4033]/20 mx-auto"></div>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] font-mono">The Union of Two Souls</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#5c4033]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-[1px] bg-[#5c4033]/10"></div>

                <div className="space-y-8 bg-white/40 backdrop-blur-sm p-12 md:p-20 border-x-4 border-[#5c4033]/20 relative shadow-2xl">
                    <div className="space-y-3 relative z-10">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#5c4033]/40 italic font-mono">Kepada Yth. Kolega & Kerabat</p>
                        <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight text-[#5c4033]/80">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-[#5c4033] text-[#f4ecd8] font-mono font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#3d2b22] transition-all shadow-xl active:scale-95 mx-auto"
                    >
                        Open Telegram
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1.5em] font-bold text-[#5c4033]/20 uppercase font-mono">Classified Information</p>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] overflow-hidden px-8 py-20 font-serif transition-colors duration-1000">
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-fixed transition-opacity duration-1000"></div>
            <div className="absolute inset-x-0 top-0 h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20">
                {[...Array(20)].map((_, i) => <div key={i} className="w-6 h-6 border-x-2 border-black/20 dark:border-white/10"></div>)}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20">
                {[...Array(20)].map((_, i) => <div key={i} className="w-6 h-6 border-x-2 border-black/20 dark:border-white/10"></div>)}
            </div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal">
                <div className="text-center space-y-6">
                    <div className="flex items-center gap-6 justify-center text-[#c5a059]">
                        <div className="h-px w-12 bg-[#c5a059]/40"></div>
                        <p className="tracking-[0.8em] text-[10px] md:text-sm font-bold uppercase font-mono">A Nostalgic Chronicle</p>
                        <div className="h-px w-12 bg-[#c5a059]/40"></div>
                    </div>
                </div>

                <h1 className="text-[5.5rem] md:text-[14rem] italic tracking-tighter leading-none text-[#5c4033]/90 dark:text-[#d4c3a1]/90 transition-colors duration-1000">
                    {config.couple.groom.name} <br />
                    <span className="text-4xl md:text-9xl font-sans not-italic text-[#c5a059] opacity-30">&</span> <br />
                    {config.couple.bride.name}
                </h1>

                <div className="flex flex-col items-center gap-12 text-center pt-8">
                    <div className="space-y-4">
                        <p className="text-[9px] font-bold uppercase tracking-[1em] text-[#5c4033]/40 dark:text-[#d4c3a1]/30 font-mono italic">Documented on</p>
                        <p className="text-5xl md:text-8xl italic tracking-tight text-[#5c4033]/70 dark:text-[#d4c3a1]/80 font-black">{config.hero.date}</p>
                    </div>
                    <div className="py-6 px-12 border-y-2 border-[#5c4033]/10 dark:border-white/10">
                        <p className="text-xs md:text-sm font-medium text-[#c5a059] uppercase tracking-[0.4em] font-mono">— ESTABLISHED FOR ETERNITY —</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40 animate-pulse">
                <span className="text-[9px] font-black uppercase tracking-[0.8em] font-mono rotate-90 dark:text-[#d4c3a1]/60">Rewind</span>
                <div className="w-[2px] h-12 bg-[#5c4033]/30 dark:bg-[#d4c3a1]/20"></div>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-[#f4ecd8] dark:bg-[#121212] py-24 md:py-48 px-6 md:px-24 text-[#5c4033] dark:text-[#d4c3a1] relative overflow-hidden font-serif transition-colors duration-1000">
            <div className="absolute inset-0 opacity-20 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-10 animate-reveal">
                    <h2 className="text-6xl md:text-9xl italic tracking-tighter leading-none dark:text-[#d4c3a1]/90">The Protagonists</h2>
                    <p className="text-sm md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 max-w-2xl mx-auto font-mono uppercase tracking-widest leading-relaxed py-4 px-8 bg-[#5c4033]/5 dark:bg-white/5 transition-colors duration-1000">
                        "A cinematic journey of two souls, captured in the grain of time."
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 md:gap-40 items-center">
                    <div className="space-y-16 group flex flex-col items-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl -rotate-3 group-hover:rotate-0 transition-all duration-700">
                            <div className="w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6">
                                <img src={config.couple.groom.image} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000" alt={config.couple.groom.fullName} />
                            </div>
                            <p className="text-2xl font-mono tracking-tighter opacity-70 italic">{config.couple.groom.name} — '70</p>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="text-5xl md:text-7xl italic dark:text-[#d4c3a1]">{config.couple.groom.fullName}</h3>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono">Legacy of</p>
                                <p className="text-2xl italic tracking-tight opacity-60">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16 group flex flex-col items-center md:mt-32">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                            <div className="w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6">
                                <img src={config.couple.bride.image} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000" alt={config.couple.bride.fullName} />
                            </div>
                            <p className="text-2xl font-mono tracking-tighter opacity-70 italic">{config.couple.bride.name} — '72</p>
                        </div>
                        <div className="space-y-6 text-center">
                            <h3 className="text-5xl md:text-7xl italic dark:text-[#d4c3a1]">{config.couple.bride.fullName}</h3>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono">Heritage of</p>
                                <p className="text-2xl italic tracking-tight opacity-60">{config.couple.bride.parents}</p>
                            </div>
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
        <section id="story" className="bg-[#3d2b22] dark:bg-[#0a0a0a] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            <div className="absolute inset-x-0 top-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10">
                {[...Array(30)].map((_, i) => <div key={i} className="w-4 h-8 border-x border-white/20"></div>)}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10">
                {[...Array(30)].map((_, i) => <div key={i} className="w-4 h-8 border-x border-white/20"></div>)}
            </div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[11rem] italic tracking-tighter leading-none text-[#f4ecd8] opacity-90 drop-shadow-2xl">The Archives</h2>
                    <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono">Our History Logged</p>
                </div>

                <div className="relative space-y-24 max-w-5xl mx-auto">
                    <div className="absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-4 bg-black/10 border-x border-white/5 hidden md:block"></div>
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-12 h-8 bg-[#3d2b22] border-y-2 border-[#c5a059]/40 flex shadow-lg"></div>
                            </div>
                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 rounded-sm hover:bg-[#f4ecd8]/10 transition-all duration-700 shadow-2xl">
                                    <p className="text-4xl md:text-5xl italic text-[#c5a059] font-black italic">{story.date}</p>
                                    <h3 className="text-2xl md:text-3xl italic text-[#f4ecd8]/80 font-mono uppercase tracking-widest mt-6">{story.title}</h3>
                                    <p className="text-[#f4ecd8]/30 font-mono text-xs uppercase tracking-[0.1em] leading-relaxed italic mt-10">{story.desc}</p>
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
        <section id="event" className="bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <h2 className="text-7xl md:text-[11rem] italic tracking-tighter text-[#f4ecd8]/90 drop-shadow-xl">The Docket</h2>
                    <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono">Confidential Schedule</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 p-12 md:p-24 flex flex-col items-center text-center hover:bg-[#f4ecd8]/10 transition-all duration-700">
                            <div className="inline-block px-12 py-3 border-2 border-[#c5a059]/40 text-[#c5a059] font-mono mb-12 uppercase tracking-widest">{event.title}</div>
                            <div className="space-y-12 w-full">
                                <div className="space-y-4">
                                    <p className="text-4xl md:text-6xl italic font-black">{event.day}, {event.date}</p>
                                    <p className="text-xl font-mono tracking-widest text-[#c5a059] opacity-80">{event.startTime} — {event.endTime} HRS</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-3xl md:text-4xl italic">{event.venue.name}</h4>
                                    <p className="text-xs md:text-sm text-[#f4ecd8]/40 border-l-2 border-[#c5a059]/30 pl-6 text-left font-mono italic">{event.venue.address}</p>
                                </div>
                            </div>
                            <a href={event.venue.mapsEmbedUrl.replace('&output=embed', '')} target="_blank" className="mt-12 group/btn flex items-center gap-6 px-12 py-5 bg-[#f4ecd8] dark:bg-[#d4c3a1] text-[#333] hover:bg-[#c5a059] transition-all font-mono">Locate Signal</a>
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
        <section id="gallery" className="bg-[#f4ecd8] dark:bg-[#121212] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Film Grain / Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-6">
                        <p className="tracking-[1em] text-[10px] font-bold uppercase text-[#5c4033]/40 dark:text-[#d4c3a1]/40 font-mono italic">Negative Film #001</p>
                        <h2 className="text-7xl md:text-[11rem] font-serif italic text-[#5c4033] dark:text-[#d4c3a1] leading-none">The Reels</h2>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-10 h-10 border-2 border-[#5c4033]/20 dark:border-[#d4c3a1]/20 text-[#5c4033] dark:text-[#d4c3a1] flex items-center justify-center hover:bg-[#5c4033] hover:text-[#f4ecd8] transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 sepia-[0.5] ${activeIndex === idx
                                        ? "border-[#5c4033] dark:border-[#d4c3a1] scale-110 shadow-2xl z-20 sepia-0"
                                        : "border-transparent opacity-40 hover:opacity-100 hover:sepia-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-10 h-10 border-2 border-[#5c4033]/20 dark:border-[#d4c3a1]/20 text-[#5c4033] dark:text-[#d4c3a1] flex items-center justify-center hover:bg-[#5c4033] hover:text-[#f4ecd8] transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-[#1a1a1a] p-3 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group transform rotate-[-1deg] hover:rotate-0 transition-transform duration-700">
                        {/* Film Border Aesthetic */}
                        <div className="absolute inset-y-0 left-1 w-2 flex flex-col justify-around py-10 opacity-20 hidden sm:flex">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full"></div>)}
                        </div>
                        <div className="absolute inset-y-0 right-1 w-2 flex flex-col justify-around py-10 opacity-20 hidden sm:flex">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full"></div>)}
                        </div>

                        <div className="relative w-full h-full overflow-hidden bg-zinc-200">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 1.1, filter: "sepia(1) brightness(0.8)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "sepia(0.3) brightness(1)" }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "sepia(1) brightness(0.8)" }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                    src={config.galleryImages[activeIndex]}
                                    className="w-full h-full object-cover cursor-pointer"
                                    alt="Selected Reel"
                                    onClick={() => openLightbox(activeIndex)}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-8 left-8 z-20 pointer-events-none">
                            <p className="text-[10px] font-mono text-white/50 bg-black/40 px-2 py-1 backdrop-blur-sm">FR — {activeIndex + 1}</p>
                        </div>

                        {/* Action Button */}
                        <div className="absolute bottom-10 right-10 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-14 h-14 bg-[#5c4033]/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#5c4033]"
                            >
                                <Maximize2 size={24} />
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Premium Lightbox Overlay */}
            <AnimatePresence>
                {selectedImg !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#121212]/98 backdrop-blur-2xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/30 hover:text-white hover:rotate-90 transition-all duration-500 z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={40} className="sm:size-16" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center py-10 sm:py-20">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-white/20 hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[100px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                                    transition={{ duration: 0.6 }}
                                    className="relative flex items-center justify-center bg-white p-2 sm:p-4 shadow-2xl"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[80vh] w-auto h-auto object-contain brightness-95"
                                        alt="Reel Fullscreen"
                                    />

                                    <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6">
                                        <div className="h-[1px] w-12 bg-white/20"></div>
                                        <p className="font-serif italic text-white/60 text-xl sm:text-3xl">Frame {selectedImg + 1} / {config.galleryImages.length}</p>
                                        <div className="h-[1px] w-12 bg-white/20"></div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1, x: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-white/20 hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={64} className="sm:size-[100px]" strokeWidth={1} />
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
        <section id="gift" className="bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[11rem] italic text-[#5c4033]/80 drop-shadow-xl">The Tokens</h2>
                    <p className="text-lg md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 leading-relaxed font-mono uppercase tracking-widest italic max-w-xl mx-auto">"Your presence is the greatest gift of all. However, should you wish to send a token of affection, we've provided our bank coordinates below."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white/40 dark:bg-white/5 border-2 border-[#5c4033]/10 p-12 backdrop-blur-md space-y-12 transition-all duration-700 hover:shadow-2xl hover:border-[#c5a059]/30 group relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-6">
                                    <p className="text-[12px] font-bold uppercase text-[#c5a059] font-mono italic">{account.bank} — ACCOUNT</p>
                                    <h3 className="text-4xl md:text-5xl italic font-mono tracking-tighter">{account.number}</h3>
                                    <p className="text-2xl italic text-[#5c4033]/80 uppercase">{account.name}</p>
                                </div>
                                <Landmark size={24} className="text-[#c5a059]/40 group-hover:text-[#c5a059] transition-colors" />
                            </div>
                            <button onClick={() => copyToClipboard(account.number, `bank-${idx}`)} className="w-full py-6 bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] font-mono font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] transition-all active:scale-95 shadow-xl">
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

    const loadRSVPs = async () => { if (!invitationId) return; const data = await dbService.getRSVPs(invitationId); setRsvps(data); };
    useEffect(() => { if (!invitationId) return; const to = new URLSearchParams(window.location.search).get("to"); if (to) setFormData(p => ({ ...p, guest_name: to })); loadRSVPs(); }, [invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!formData.guest_name || !invitationId) return; setIsSubmitting(true);
        try { await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || undefined }); setSubmitted(true); loadRSVPs(); } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
    };

    return (
        <section id="rsvp" className="bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-mono transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start text-left">
                    <div className="space-y-20 animate-reveal text-left">
                        <h2 className="text-7xl md:text-9xl font-serif italic text-white/90 drop-shadow-2xl">Confirm</h2>
                        {submitted ? (
                            <div className="p-16 border-4 border-dashed border-[#f4ecd8]/10 bg-black/10 text-center">
                                <CheckCircle2 className="text-[#c5a059] h-24 w-24 mx-auto opacity-60" />
                                <h3 className="text-4xl font-serif italic text-white/90 mt-8">Signal Received</h3>
                                <button onClick={() => setSubmitted(false)} className="text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold mt-8 uppercase tracking-widest">Re-Transmit</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16 text-left">
                                <input required placeholder="IDENTIFY YOURSELF..." className="w-full bg-black/20 border-b-2 border-[#f4ecd8]/10 px-8 py-6 text-2xl font-mono italic tracking-tighter outline-none text-[#f4ecd8]" value={formData.guest_name} onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                                <textarea rows={2} placeholder="WRITE MESSAGE..." className="w-full bg-black/20 border-b-2 border-[#f4ecd8]/10 px-8 py-6 text-2xl font-mono italic tracking-tighter outline-none resize-none text-[#f4ecd8]" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />

                                <div className="flex items-center justify-between px-4 text-left">
                                    <label className="text-[10px] uppercase text-[#c5a059]">Pilih Sticker</label>
                                    <button type="button" onClick={() => setShowStickerPicker(true)} className="text-[#c5a059] transition-colors"><Smile size={24} /></button>
                                </div>
                                {formData.sticker && <div className="relative inline-block mt-2 ml-4 text-left"><img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" /><button type="button" onClick={() => setFormData(p => ({ ...p, sticker: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
                                {showStickerPicker && <StickerPicker isOpen={showStickerPicker} selectedSticker={formData.sticker?.id || null} onSelect={(sticker) => { setFormData(p => ({ ...p, sticker })); setShowStickerPicker(false); }} onClose={() => setShowStickerPicker(false)} />}

                                <div className="grid grid-cols-2 gap-6 text-left">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button key={status} type="button" onClick={() => setFormData({ ...formData, attendance: status })} className={`py-8 font-bold uppercase text-[9px] border-2 transition-all ${formData.attendance === status ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-xl' : 'bg-black/10 text-[#f4ecd8]/20 border-[#f4ecd8]/5'}`}>{status.replace('TIDAK_HADIR', 'Negative').replace('HADIR', 'Positive')}</button>
                                    ))}
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-[#f4ecd8] dark:bg-[#d4c3a1] text-[#333] py-8 font-bold uppercase text-[10px] shadow-2xl hover:bg-white transition-all">{isSubmitting ? "TRANSMITTING..." : "SEND SIGNAL"}</button>
                            </form>
                        )}
                    </div>
                    <div className="space-y-20 lg:pl-24 animate-reveal text-left">
                        <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right border-x-4 border-[#f4ecd8]/5 px-8 py-12">
                            <p className="text-8xl font-serif italic text-[#f4ecd8]/20">{rsvps.length}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]/60">Operators Checked-In</p>
                        </div>
                        <div className="space-y-6 text-left">
                            {rsvps.slice(0, 5).map(rsvp => (
                                <div key={rsvp.id} className="p-10 border border-[#f4ecd8]/5 bg-black/5 flex flex-col gap-4 text-left">
                                    <div className="flex justify-between items-center text-left"><h4 className="text-2xl font-serif italic text-white/50">{rsvp.guest_name}</h4><Heart size={14} className="text-[#c5a059]/20" /></div>
                                    <p className="text-[#f4ecd8]/20 text-[11px] font-mono italic uppercase">— "{rsvp.message || "Message not provided."}"</p>
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
        <section id="wishes" className="bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-serif transition-colors duration-1000 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <div className="grid lg:grid-cols-12 gap-24 items-start text-left">
                    <div className="lg:col-span-5 space-y-20 animate-reveal text-left">
                        <h2 className="text-7xl md:text-8xl italic text-[#5c4033]/90">Telegrams</h2>
                        <form onSubmit={handleSubmit} className="space-y-12 bg-white/40 p-12 md:p-16 border-y-4 border-[#5c4033]/10 backdrop-blur-md shadow-2xl text-left">
                            <input required placeholder="NAMA ANDA..." className="w-full bg-transparent border-b-2 border-[#5c4033]/10 py-6 text-2xl font-mono italic tracking-tighter outline-none text-[#5c4033]" value={name} onChange={(e) => setName(e.target.value)} />
                            <textarea required placeholder="TULIS PESAN..." rows={4} className="w-full bg-transparent border-b-2 border-[#5c4033]/10 py-6 text-2xl font-mono italic tracking-tighter outline-none resize-none text-[#5c4033]" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="w-full bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] py-8 font-mono font-bold uppercase text-[10px] shadow-xl hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] transition-all">DISPATCH TELEGRAM</button>
                        </form>
                    </div>
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left">
                        <div className="flex items-center justify-between border-b-2 border-[#5c4033]/5 pb-10 text-left"><Quote size={32} className="text-[#c5a059] opacity-30" /><p className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#5c4033]/20">ARCHIVE LOG — {wishes.length}</p></div>
                        <div className="grid grid-cols-1 gap-16 text-left">
                            {wishes.slice(0, 4).map(wish => (
                                <div key={wish.id} className="relative space-y-8 text-left">
                                    <p className="text-4xl md:text-5xl italic text-[#5c4033]/70 font-black transition-colors">— "{wish.message}"</p>
                                    <div className="flex items-center gap-12 text-left"><div className="h-[2px] w-16 bg-[#c5a059]/20"></div><p className="text-2xl italic text-[#5c4033]/60 font-mono uppercase transition-colors">{wish.name}</p></div>
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
    const navItems = [{ icon: Home, label: "Rewind", href: "#hero" }, { icon: Heart, label: "Couples", href: "#couple" }, { icon: Star, label: "History", href: "#story" }, { icon: Calendar, label: "Dockets", href: "#event" }, { icon: Camera, label: "Archives", href: "#gallery" }, { icon: Gift, label: "Tokens", href: "#gift" }, { icon: MessageCircle, label: "Signals", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'}`}>
            <div className="bg-[#f4ecd8]/90 backdrop-blur-md border-x-4 border-[#5c4033]/20 px-8 py-5 shadow-2xl flex items-center gap-6 sm:gap-10">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-[#5c4033]/40 hover:text-[#5c4033] transition-all"><item.icon size={22} /><span className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-[#5c4033] text-[#f4ecd8] text-[9px] font-mono px-5 py-3 hidden group-hover:block whitespace-nowrap">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-[#5c4033]/40 hover:text-[#5c4033] transition-all">{theme === "light" ? <Moon size={22} /> : <Sun size={22} />}</button>
            </div>
        </nav>
    );
};

const VintageTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => { document.body.style.overflow = isOpened ? "auto" : "hidden"; }, [isOpened]);
    return (
        <div className={`vintage-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}
            <main className={`transition-all duration-[2.5s] ease-in-out ${isOpened ? "opacity-100 scale-100 grayscale-0 blur-0" : "opacity-0 scale-110 grayscale blur-xl pointer-events-none"}`}>
                <Hero /><CoupleProfile /><LoveStory /><EventDetails /><Gallery /><GiftInfo /><RSVPForm /><Wishes />
            </main>
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4"><MusicController isOpened={isOpened} /><AutoScrollController isOpened={isOpened} /></div>
            <Navbar theme={theme} toggleTheme={toggleTheme} /><MusicPlayer /><InstallPrompt />
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9999] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
        </div>
    );
};

export default VintageTheme;
