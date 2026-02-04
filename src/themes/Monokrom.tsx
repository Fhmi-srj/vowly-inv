import { useState, useEffect, useMemo, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Heart,
    Calendar,
    Camera,
    Gift,
    MessageCircle,
    Sun,
    Moon,
    ArrowUpRight,
    MoveRight,
    MoveLeft,
    Quote,
    CheckCircle2,
    Users,
    Smile,
    X,
    Landmark,
    Copy,
    MapPin,
    Check,
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
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ position: "relative", width }}
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
    const [isExiting, setIsExiting] = useState(false);

    const handleOpen = () => {
        setIsExiting(true);
        setTimeout(onOpen, 1500);
    };

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-950 overflow-hidden text-white"
                >
                    {/* Geometric Background Elements */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 12, y: -100 }}
                        animate={{ opacity: 0.05, rotate: 12, y: -200 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-white skew-y-12"
                    ></motion.div>
                    <motion.div
                        initial={{ opacity: 0, rotate: 12, y: 100 }}
                        animate={{ opacity: 0.05, rotate: 12, y: 200 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute bottom-0 right-0 w-full h-1/2 bg-white skew-y-12"
                    ></motion.div>

                    <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="space-y-6 text-center"
                        >
                            <p className="tracking-[1em] text-[10px] font-black uppercase text-zinc-500">The Wedding Invitation of</p>
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                                {config.couple.groom.name} <span className="text-zinc-600">&</span> {config.couple.bride.name}
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="w-full h-px bg-zinc-800 origin-left"
                        ></motion.div>

                        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="text-left space-y-4"
                            >
                                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Inviting You</p>
                                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
                                    {guestName || "Distinguished Guest"}
                                </h2>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 1.4 }}
                                onClick={handleOpen}
                                className="group relative flex items-center gap-6 px-10 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-[10px_10px_0_rgba(255,255,255,0.2)]"
                            >
                                Enter Experience
                                <MoveRight className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.6 }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.8em] font-black text-zinc-700 uppercase"
                        >
                            Est. {new Date().getFullYear()}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col justify-end bg-zinc-950 text-white overflow-hidden p-8 md:p-20">
            {/* Massive Background Typography */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
                <motion.h1
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.03 }}
                    transition={{ duration: 2 }}
                    className="text-[30rem] md:text-[50rem] font-black uppercase tracking-tighter leading-none whitespace-nowrap -rotate-6"
                >
                    Marr-ied
                </motion.h1>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-12 border-t border-zinc-800 pt-12">
                <Reveal>
                    <div className="space-y-6 max-w-2xl text-left">
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500">Official Ceremony</p>
                        <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter uppercase leading-[0.8]">
                            {config.couple.groom.name} <br />
                            <span className="text-zinc-700">&</span> {config.couple.bride.name}
                        </h1>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="flex flex-col items-start md:items-end gap-4 text-left md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Save the Date</p>
                        <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{config.hero.date}</p>
                        <p className="text-sm font-medium text-zinc-400 max-w-[200px] leading-relaxed">
                            Join us at {config.hero.city} for a night of celebration and joy.
                        </p>
                        <div className="w-12 h-px bg-zinc-700 mt-4"></div>
                    </div>
                </Reveal>
            </div>

            {/* Side Date Accent */}
            <div className="absolute top-20 right-8 md:right-20 vertical-text hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800 whitespace-nowrap">
                    CHAPTER TWO — {new Date().getFullYear()}
                </p>
            </div>

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            `}</style>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-zinc-950 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-start">
                    {/* Groom Section */}
                    <Reveal>
                        <div className="space-y-16 group">
                            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0_rgba(255,255,255,0.02)] transition-all">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                    alt={config.couple.groom.fullName}
                                />
                                <div className="absolute top-8 left-8 flex flex-col items-start gap-2">
                                    <span className="bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors">Groom</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{config.couple.groom.name}</h2>
                                <div className="w-12 h-2 bg-black dark:bg-white"></div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Parents</p>
                                    <p className="text-2xl font-bold uppercase tracking-tight transition-colors">{config.couple.groom.parents}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Bride Section */}
                    <Reveal delay={0.2}>
                        <div className="space-y-16 group md:mt-64">
                            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[-20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[-20px_20px_0_rgba(255,255,255,0.02)] transition-all">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                    alt={config.couple.bride.fullName}
                                />
                                <div className="absolute top-8 right-8 flex flex-col items-end gap-2 text-right">
                                    <span className="bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors">Bride</span>
                                </div>
                            </div>
                            <div className="space-y-6 md:text-right flex flex-col md:items-end">
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{config.couple.bride.name}</h2>
                                <div className="w-12 h-2 bg-black dark:bg-white"></div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Parents</p>
                                    <p className="text-2xl font-bold uppercase tracking-tight transition-colors">{config.couple.bride.parents}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Narrative Divider */}
                <Reveal delay={0.4}>
                    <div className="mt-40 grid md:grid-cols-2 items-center gap-12 border-t border-zinc-100 dark:border-zinc-800 pt-12 transition-colors">
                        <p className="text-3xl font-black uppercase tracking-tighter italic">"A monochromatic bond, etched in time and love."</p>
                        <div className="flex md:justify-end">
                            <p className="text-xs font-medium text-zinc-400 max-w-sm leading-relaxed">
                                Witness the union of two souls that complete each other's shades. A journey of depth, contrast, and infinite connection.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const LoveStory: FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -rotate-12"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40">
                <Reveal>
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-12">
                        <h2 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-none">The <br /> Log</h2>
                        <div className="text-left md:text-right space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Sequential Connection</p>
                            <p className="text-2xl font-bold uppercase tracking-tight max-w-md ml-auto">A documentation of significant milestones that led us to this union.</p>
                        </div>
                    </div>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-px bg-zinc-800 border-[1px] border-zinc-800">
                    {config.loveStory.map((story, idx) => (
                        <Reveal key={idx} delay={idx * 0.1}>
                            <div className="bg-zinc-950 p-12 md:p-20 space-y-12 group hover:bg-zinc-900 transition-all duration-700 h-full">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-black text-zinc-700">STORY_{idx + 1}</span>
                                    <p className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white/20 group-hover:text-white transition-colors">
                                        {story.date}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{story.title}</h3>
                                    <div className="w-12 h-2 bg-white"></div>
                                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-tight leading-relaxed line-clamp-4">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.4}>
                    <div className="pt-20 border-t border-zinc-800 flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Status: Evolving</p>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-[1px] bg-zinc-800"></div>

            <div className="container mx-auto max-w-7xl space-y-32">
                <Reveal>
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-8">
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">Schedule</h2>
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">The Grand Occasions</p>
                    </div>
                </Reveal>

                <div className="space-y-px bg-zinc-800">
                    {config.events.map((event, idx) => (
                        <Reveal key={event.id} delay={idx * 0.1}>
                            <div className="grid md:grid-cols-12 bg-zinc-950 py-20 px-4 md:px-12 group hover:bg-zinc-900 transition-all duration-700 items-center gap-12 border-b border-zinc-800">
                                <div className="md:col-span-3 space-y-4">
                                    <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{idx === 0 ? "Part One" : "Part Two"}</span>
                                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{event.title}</p>
                                </div>

                                <div className="md:col-span-4 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">{event.date}</p>
                                        <p className="text-xl font-bold uppercase tracking-tight text-white/50">{event.startTime} — {event.endTime} WIB</p>
                                    </div>
                                </div>

                                <div className="md:col-span-3 space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Venue</p>
                                        <h4 className="text-xl font-black uppercase leading-tight">{event.venue.name}</h4>
                                        <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex md:justify-end">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:scale-110 active:scale-95"
                                    >
                                        <ArrowUpRight size={32} strokeWidth={2.5} />
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.4}>
                    <div className="pt-20 text-center">
                        <div className="inline-block px-12 py-8 bg-zinc-900 border border-zinc-800">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Dresscode Policy</p>
                            <p className="text-2xl font-black uppercase tracking-tighter mt-2">Monochromatic Attire Recommended</p>
                        </div>
                    </div>
                </Reveal>
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
        <section id="gallery" className="bg-white dark:bg-zinc-950 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Minimalist Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="space-y-8 flex flex-col items-center text-center">
                        <h2 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none dark:text-white transition-colors">Frames</h2>
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-[2px] bg-black dark:bg-white transition-colors"></div>
                            <p className="text-[10px] font-black uppercase tracking-[1em] dark:text-white transition-colors">Static Motion</p>
                            <div className="w-20 h-[2px] bg-black dark:bg-white transition-colors"></div>
                        </div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 grayscale ${activeIndex === idx
                                        ? "border-black dark:border-white scale-110 grayscale-0 z-20"
                                        : "border-transparent opacity-40 hover:opacity-80 hover:grayscale-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-all active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={24} strokeWidth={3} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Image Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[500px] mx-auto overflow-hidden border-4 border-black dark:border-white transition-colors shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.8, ease: "anticipate" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-1000"
                                alt="Featured Frame"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Caption Overlay */}
                        <div className="absolute inset-x-8 bottom-8 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black px-4 py-2 border border-white/20">Frame #{activeIndex + 1}</span>
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-white dark:bg-zinc-950 px-4 sm:px-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-black dark:text-white hover:rotate-90 transition-all duration-500 z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={40} className="sm:size-16" strokeWidth={3} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center py-10 sm:py-20">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-black dark:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[120px]" strokeWidth={3} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative h-full w-full flex items-center justify-center"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-full max-w-full object-contain border-8 border-black dark:border-white shadow-2xl"
                                        alt="Fullscreen Frame"
                                    />

                                    <div className="absolute top-8 left-8 hidden md:block">
                                        <p className="text-[200px] font-black text-black/5 dark:text-white/5 leading-none">#{selectedImg + 1}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1, x: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-black dark:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={64} className="sm:size-[120px]" strokeWidth={3} />
                            </motion.button>
                        </div>

                        {/* Info Overlay */}
                        <div className="absolute bottom-12 left-12 flex flex-col items-start gap-4">
                            <div className="h-[2px] w-24 bg-black dark:bg-white transition-colors"></div>
                            <p className="text-[10px] font-black uppercase tracking-[1em] text-black dark:text-white">Image {selectedImg + 1} / {config.galleryImages.length}</p>
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
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section id="gift" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-full bg-white opacity-[0.02] -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    <Reveal className="lg:col-span-5">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Contribution</p>
                                <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">Wedding <br /> Tokens</h2>
                            </div>
                            <p className="text-xl text-zinc-500 font-bold uppercase tracking-tight leading-relaxed italic">
                                Your presence is the priority, but should you wish to share a token of love, we provide these simple digital and physical channels.
                            </p>
                        </div>
                    </Reveal>

                    <div className="lg:col-span-7 w-full space-y-12">
                        <div className="grid md:grid-cols-2 gap-1">
                            {config.bankAccounts?.map((account, idx) => (
                                <Reveal key={idx} delay={idx * 0.1}>
                                    <div className="bg-zinc-900 border border-zinc-800 p-10 space-y-8 group h-full flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{account.bank}</p>
                                                <Landmark size={16} className="text-zinc-700" />
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase break-all">{account.number}</h3>
                                            <p className="text-sm font-bold uppercase tracking-tight text-white/50 italic">A.N {account.name}</p>
                                        </div>

                                        <button
                                            onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                            className="w-full py-5 border border-zinc-700 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95"
                                        >
                                            {copiedId === `bank-${idx}` ? (
                                                <><Check size={14} /> COPIED</>
                                            ) : (
                                                <><Copy size={14} /> COPY NUMBER</>
                                            )}
                                        </button>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {config.giftAddress && (
                            <Reveal delay={0.4}>
                                <div className="bg-zinc-900 border border-zinc-800 p-10 space-y-8 group">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Physical Gift</p>
                                            <MapPin size={16} className="text-zinc-700" />
                                        </div>
                                        <p className="text-lg font-bold uppercase tracking-tight text-white/50 leading-relaxed italic">
                                            {config.giftAddress}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(config.giftAddress, 'physical-gift')}
                                        className="w-full py-5 border border-zinc-700 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95"
                                    >
                                        {copiedId === 'physical-gift' ? (
                                            <><Check size={14} /> ADDRESS COPIED</>
                                        ) : (
                                            <><Copy size={14} /> COPY ADDRESS</>
                                        )}
                                    </button>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { icon: Home, label: "Intro", href: "#hero" },
        { icon: Heart, label: "Couple", href: "#couple" },
        { icon: Calendar, label: "Time", href: "#event" },
        { icon: Camera, label: "Frames", href: "#gallery" },
        { icon: Gift, label: "Token", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center gap-6 md:gap-10 transition-colors duration-1000">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300"
                    >
                        <item.icon size={20} className="transition-transform group-hover:-translate-y-1" />
                        <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2">
                            {item.label}
                        </span>
                    </a>
                ))}

                <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

const RSVPForm: FC = () => {
    const { invitationId } = useSettings();
    const [formData, setFormData] = useState({
        guest_name: "",
        phone: "",
        attendance: AttendanceStatus.HADIR,
        guest_count: 1,
        message: "",
        sticker: null as { id: string; src: string } | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rsvpsPerPage = 5;
    const [showStickerPicker, setShowStickerPicker] = useState(false);

    const loadRSVPs = async () => {
        if (!invitationId) return;
        const data = await dbService.getRSVPs(invitationId);
        setRsvps(data);
    };

    useEffect(() => {
        if (!invitationId) return;

        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) {
            setFormData((prev) => ({ ...prev, guest_name: to }));
            setIsNameLocked(true);
        }
        loadRSVPs();
    }, [invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !invitationId) return;

        setIsSubmitting(true);
        try {
            await dbService.saveRSVP(invitationId, {
                ...formData,
                sticker: formData.sticker?.id || undefined,
            });
            setSubmitted(true);
            await loadRSVPs();
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentRSVPs = useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        return [...rsvps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    return (
        <section id="rsvp" className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-800"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Form Side */}
                    <Reveal className="w-full">
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Confirmation</p>
                                <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">Are You <br /> Coming?</h2>
                            </div>

                            {submitted ? (
                                <div className="p-12 border border-zinc-800 bg-zinc-900/50 space-y-8 animate-reveal text-center">
                                    <CheckCircle2 className="text-white h-16 w-16 mx-auto" />
                                    <h3 className="text-4xl font-black uppercase tracking-tighter">Response Recorded</h3>
                                    <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest leading-loose">Thank you for your response. We have added your name to our guest list session.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-white border-b-2 border-white pb-1 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400 hover:border-zinc-400 transition-all">Send another response</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                placeholder="INPUT FULL NAME"
                                                className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Statement</label>
                                            <textarea
                                                rows={2}
                                                placeholder="LEAVE A SHORT MESSAGE"
                                                className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none resize-none"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pilih Sticker</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowStickerPicker(true)}
                                                className="text-zinc-500 hover:text-white transition-colors"
                                            >
                                                <Smile size={24} />
                                            </button>
                                        </div>
                                        {formData.sticker && (
                                            <div className="relative inline-block mt-2">
                                                <img src={formData.sticker.src} alt="Selected Sticker" className="w-16 h-16 object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, sticker: null })}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                        {showStickerPicker && (
                                            <StickerPicker
                                                isOpen={showStickerPicker}
                                                selectedSticker={formData.sticker?.id || null}
                                                onSelect={(sticker) => {
                                                    setFormData({ ...formData, sticker });
                                                    setShowStickerPicker(false);
                                                }}
                                                onClose={() => setShowStickerPicker(false)}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, attendance: status })}
                                                className={`py-8 font-black uppercase tracking-widest text-[10px] border-2 transition-all ${formData.attendance === status
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {status.replace('TIDAK_HADIR', 'Absent').replace('HADIR', 'Attending')}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black py-8 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-6 group active:scale-95"
                                    >
                                        {isSubmitting ? "PROCESSING..." : "SUBMIT RESPONSE"}
                                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </Reveal>

                    {/* List Side */}
                    <div className="space-y-16">
                        <Reveal delay={0.2}>
                            <div className="flex md:justify-end">
                                <div className="flex items-center gap-12">
                                    <div className="space-y-1 text-right">
                                        <p className="text-4xl font-black tracking-tighter">{rsvps.length}</p>
                                        <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Responses</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-4xl font-black tracking-tighter">{rsvps.filter(r => r.attendance === AttendanceStatus.HADIR).length}</p>
                                        <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Attending</p>
                                    </div>
                                    <Users className="text-zinc-800 h-12 w-12" />
                                </div>
                            </div>
                        </Reveal>

                        <div className="space-y-4">
                            {currentRSVPs.map((rsvp: RSVP, idx: number) => (
                                <Reveal key={rsvp.id} delay={idx * 0.05}>
                                    <div className="p-10 border border-zinc-800 hover:border-zinc-500 transition-all space-y-6 group bg-zinc-900/10 h-full">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-2xl font-black uppercase tracking-tighter">{rsvp.guest_name}</h4>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {rsvp.attendance.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-tight leading-relaxed">"{rsvp.message || "No message provided."}"</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Reveal delay={0.4}>
                                <div className="flex justify-center md:justify-end gap-2 pt-8">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-20"
                                    >
                                        <MoveLeft size={16} />
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 font-black uppercase text-[10px] transition-all border ${currentPage === i + 1 ? 'bg-white text-black border-white' : 'text-zinc-600 border-zinc-800 hover:border-zinc-600'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-20"
                                    >
                                        <MoveRight size={16} />
                                    </button>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Wishes: FC = () => {
    const { invitationId } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 4;
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);

    useEffect(() => {
        if (!invitationId) return;
        loadWishes();
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) {
            setName(to);
            setIsNameLocked(true);
        }
    }, [invitationId]);

    const loadWishes = async () => {
        if (!invitationId) return;
        const data = await dbService.getWishes(invitationId);
        setWishes(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim() || !invitationId) return;
        setIsSending(true);
        try {
            await dbService.saveWish(invitationId, { name, message });
            setMessage("");
            if (!isNameLocked) setName("");
            await loadWishes();
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    const totalPages = Math.ceil(wishes.length / wishesPerPage);
    const currentWishes = useMemo(() => {
        const start = (currentPage - 1) * wishesPerPage;
        return wishes.slice(start, start + wishesPerPage);
    }, [wishes, currentPage]);

    return (
        <section id="wishes" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
                    {/* Form Side */}
                    <Reveal className="lg:col-span-5 w-full">
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Journal of Prayers</h2>
                                <div className="w-16 h-2 bg-black dark:bg-white transition-colors"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Leave your mark</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12 bg-zinc-50 dark:bg-zinc-900 p-12 border border-zinc-100 dark:border-zinc-800 transition-colors shadow-[20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0_rgba(255,255,255,0.02)]">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contributor</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="YOUR NAME"
                                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                                        <textarea
                                            required
                                            placeholder="TYPE YOUR MESSAGE"
                                            rows={4}
                                            className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all resize-none text-black dark:text-white"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSending}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black py-6 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group active:scale-95"
                                >
                                    {isSending ? "POSTING..." : "POST MESSAGE"}
                                    <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </Reveal>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <Reveal>
                            <div className="flex items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-8 transition-colors">
                                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-300">Archives — {wishes.length}</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-20"
                                    >
                                        <MoveLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-20"
                                    >
                                        <MoveRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-1 gap-12">
                            {currentWishes.map((wish: Wish, idx: number) => (
                                <Reveal key={wish.id} delay={idx * 0.05}>
                                    <div className="relative space-y-8 animate-reveal group">
                                        <div className="space-y-4">
                                            <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic group-hover:translate-x-2 transition-transform duration-700">"{wish.message}"</p>
                                            <div className="flex items-center gap-12">
                                                <div className="h-px w-12 bg-black dark:bg-white transition-colors"></div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black uppercase tracking-tight">{wish.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                        {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer: FC = () => {
    const { config } = useSettings();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden border-t border-zinc-800">
            <div className="container mx-auto max-w-7xl space-y-32">
                <div className="grid md:grid-cols-2 gap-24 items-end">
                    <Reveal>
                        <div className="space-y-12">
                            <h2 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none">
                                Thank <br /> You
                            </h2>
                            <p className="text-2xl font-bold uppercase tracking-tight max-w-md italic">
                                "Our joy is incomplete without your presence and blessing."
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className="flex flex-col items-start md:items-end gap-12 text-left md:text-right">
                            <button
                                onClick={scrollToTop}
                                className="group flex items-center gap-6 px-10 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-[10px_10px_0_rgba(255,255,255,0.1)]"
                            >
                                Back to Top
                                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Turut Mengundang</p>
                                <p className="text-xl font-bold uppercase tracking-tight italic">Segenap Keluarga Besar</p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-t border-zinc-800 pt-12">
                    <div className="flex items-center gap-6">
                        <Heart className="text-white h-6 w-6 fill-white" />
                        <p className="text-2xl font-black uppercase tracking-tighter italic">
                            {config.couple.groom.name} <span className="text-zinc-600">&</span> {config.couple.bride.name}
                        </p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">Design for Eternity — {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
};

// --- Main Theme Component ---

const MonokromTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`monokrom-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                <Hero />
                <CoupleProfile />
                <LoveStory />
                <EventDetails />
                <Gallery />
                <GiftInfo />
                <RSVPForm />
                <Wishes />
                <Footer />
            </main>

            {/* Standardized Floating Utilities */}
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4">
                <MusicController />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <MusicPlayer />
            <InstallPrompt />
        </div>
    );
};

export default MonokromTheme;
