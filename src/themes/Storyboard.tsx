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
    Zap,
    Sun,
    Moon,
    MoveRight,
    MoveLeft,
    Quote,
    Mail,
    MapPin,
    Clock,
    ArrowUpRight,
    Landmark,
    Copy,
    Check,
    CheckCircle2,
    Users,
    MessageSquare,
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfaf0] dark:bg-slate-950 overflow-hidden text-[#2d2d2d] dark:text-slate-100 font-sans transition-colors duration-1000">
            {/* Halftone Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

            {/* Ink Border */}
            <div className="absolute inset-8 md:inset-16 border-[4px] border-[#2d2d2d] dark:border-blue-500 rounded-[2rem] pointer-events-none shadow-[10px_10px_0_rgba(0,0,0,0.1)] transition-all duration-1000"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                {/* Speech Bubble Greeting */}
                <div className="relative bg-white dark:bg-slate-900 border-[3px] border-[#2d2d2d] dark:border-blue-400 px-10 py-5 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">NEW ISSUE: THE BIG DAY!</p>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-900 border-r-[3px] border-b-[3px] border-[#2d2d2d] dark:border-blue-400 rotate-45"></div>
                </div>

                <div className="space-y-6">
                    <p className="text-sm font-black uppercase tracking-[0.5em] text-[#ff4081] dark:text-pink-500">Starring</p>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-6">
                        {config.couple.groom.name} <span className="not-italic text-2xl md:text-5xl text-[#2196f3] dark:text-blue-400 mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-[4px] bg-[#2d2d2d] dark:bg-blue-500 rounded-full"></div>

                <div className="space-y-8 bg-white dark:bg-slate-900 border-[4px] border-[#2d2d2d] dark:border-blue-600 p-12 md:p-20 rounded-[3rem] shadow-[15px_15px_0_rgba(33,150,243,0.3)] relative group overflow-hidden transition-all duration-1000">
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/40 dark:text-slate-500 italic">Exclusive Access For:</p>
                        <h2 className="text-4xl md:text-7xl font-black italic tracking-tight text-[#2d2d2d] dark:text-white uppercase transition-colors duration-1000">
                            {guestName || "VIP GUEST"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-[#2196f3] dark:bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] border-[4px] border-[#2d2d2d] dark:border-white shadow-[8px_8px_0_#2d2d2d] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 mx-auto"
                    >
                        START THE STORY
                        <Zap className="fill-white group-hover:animate-bounce" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white overflow-hidden px-8 py-20 font-sans transition-colors duration-700">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(#2d2d2d_1px,transparent_1px),linear-gradient(90deg,#2d2d2d_1px,transparent_1px)] [background-size:100px_100px]"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-24 animate-reveal">
                <div className="bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-12 py-3 shadow-[8px_8px_0_#2d2d2d] transform -rotate-1">
                    <p className="tracking-[0.8em] text-[10px] md:text-sm font-black uppercase text-[#2d2d2d]">VOLUME ONE: ETERNAL LOVE</p>
                </div>

                <div className="text-center relative">
                    <h1 className="text-[5.5rem] md:text-[15rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#2196f3] dark:drop-shadow-[5px_5px_0_#ff4081]">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl not-skew-x-0 inline-block text-[#ff4081] dark:text-[#00e5ff] -rotate-12">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-12 text-center pt-8">
                    <div className="space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2d2d2d]/30 dark:text-white/30 italic transition-colors">— THE PREMIERE —</p>
                        <p className="text-5xl md:text-9xl font-black italic tracking-tighter text-[#2196f3] dark:text-[#00e5ff] uppercase transform -rotate-1">{config.hero.date}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] [writing-mode:vertical-rl] rotate-180">Scroll Down</span>
                <div className="w-[4px] h-12 bg-[#2d2d2d] dark:bg-[#ff4081] rounded-full"></div>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#0a0a1a] py-24 md:py-48 px-6 md:px-24 text-[#2d2d2d] dark:text-white relative overflow-hidden font-sans transition-colors duration-700">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:40px_40px]"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-12 animate-reveal">
                    <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#ffeb3b] dark:drop-shadow-[5px_5px_0_#ff4081]">Meet The Cast</h2>
                    <div className="relative inline-block px-12 py-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[10px_10px_0_#2196f3] transform rotate-1">
                        <p className="text-sm md:text-xl font-bold italic text-[#2d2d2d] uppercase tracking-widest leading-relaxed">"Every great story needs its heroes."</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 md:gap-40 items-center">
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] group-hover:shadow-[20px_20px_0_#2196f3] transition-all duration-700">
                            <div className="w-full h-full overflow-hidden bg-gray-100 border-[3px] border-[#2d2d2d]">
                                <img src={config.couple.groom.image} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={config.couple.groom.fullName} />
                            </div>
                            <div className="absolute -bottom-6 -right-6 px-10 py-3 bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] rotate-6 group-hover:rotate-0 transition-all">Groom</div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black italic uppercase text-[#2196f3] dark:text-[#00e5ff]">{config.couple.groom.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10">
                                <p className="text-[11px] font-black uppercase text-[#2d2d2d]/30 dark:text-white/30 italic">Son of</p>
                                <p className="text-xl md:text-3xl font-bold italic opacity-70">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] group-hover:shadow-[20px_20px_0_#ff4081] transition-all duration-700">
                            <div className="w-full h-full overflow-hidden bg-gray-100 border-[3px] border-[#2d2d2d]">
                                <img src={config.couple.bride.image} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={config.couple.bride.fullName} />
                            </div>
                            <div className="absolute -bottom-6 -right-6 px-10 py-3 bg-[#2196f3] dark:bg-[#ff4081] text-white font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] -rotate-6 group-hover:rotate-0 transition-all">Bride</div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black italic uppercase text-[#ff4081] dark:text-[#ff4081]">{config.couple.bride.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10">
                                <p className="text-[11px] font-black uppercase text-[#2d2d2d]/30 dark:text-white/30 italic">Daughter of</p>
                                <p className="text-xl md:text-3xl font-bold italic opacity-70">{config.couple.bride.parents}</p>
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
        <section id="story" className="bg-white dark:bg-[#050510] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-12 py-2 shadow-[8px_8px_0_#ff4081] transform -rotate-1">
                        <p className="tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]">THE BACKSTORY</p>
                    </div>
                    <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[10px_10px_0_#2196f3]">Chronicles</h2>
                </div>

                <div className="relative space-y-32 max-w-5xl mx-auto">
                    <div className="absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-[6px] bg-[#2d2d2d]/10 dark:bg-[#00e5ff]/20 rounded-full hidden md:block"></div>
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white dark:bg-[#0a0a1a] border-[4px] border-[#2d2d2d] rounded-full flex items-center justify-center shadow-[6px_6px_0_#ffeb3b] dark:shadow-[6px_6px_0_#ff4081] group hover:scale-125 transition-all">
                                    <Zap size={24} className="text-[#2d2d2d] fill-[#ffeb3b]" />
                                </div>
                            </div>
                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] rounded-none hover:shadow-[15px_15px_0_#2196f3] hover:-translate-y-2 transition-all duration-700">
                                    <div className="inline-block px-10 py-1 bg-[#ff4081] text-white font-black italic text-4xl leading-none shadow-[6px_6px_0_#2d2d2d] transform -rotate-1">{story.date}</div>
                                    <h3 className="text-3xl md:text-5xl font-black italic uppercase text-[#2d2d2d] dark:text-white transform -skew-x-12 mt-6">{story.title}</h3>
                                    <div className="mt-8 p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 rounded-xl font-black italic text-xs uppercase text-[#2d2d2d]/60 dark:text-white/60">{story.desc}</div>
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
        <section id="event" className="bg-[#fdfaf0] dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ffeb3b] dark:drop-shadow-[8px_8px_0_#ff4081]">Plan It</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-12 md:p-24 flex flex-col items-center text-center font-black shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] hover:shadow-[20px_20px_0_#2196f3] transition-all duration-700">
                            <div className="inline-block px-12 py-3 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] text-[#2d2d2d] mb-12 transform -rotate-2 uppercase tracking-widest">{event.title}</div>
                            <div className="space-y-12 w-full">
                                <div className="space-y-4">
                                    <p className="text-4xl md:text-6xl italic text-[#2196f3] dark:text-[#00e5ff]">{event.day}, {event.date}</p>
                                    <p className="text-xl tracking-widest text-[#ff4081] italic">{event.startTime} — {event.endTime} PM</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-3xl md:text-5xl italic text-[#2d2d2d]/80 dark:text-white/80 uppercase">{event.venue.name}</h4>
                                    <p className="text-xs md:text-sm text-[#2d2d2d]/60 p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 rounded-xl italic uppercase font-bold">{event.venue.address}</p>
                                </div>
                            </div>
                            <a href={event.venue.mapsEmbedUrl.replace('&output=embed', '')} target="_blank" className="mt-12 group/btn flex items-center gap-6 px-12 py-5 bg-[#2d2d2d] dark:bg-[#ff4081] text-white hover:bg-[#ff4081] transition-all shadow-[8px_8px_0_#ffeb3b]">OPEN MISSION MAP</a>
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
        <section id="gallery" className="bg-white dark:bg-[#050510] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-700">
            {/* Halftone Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="inline-block px-10 py-2 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] shadow-[8px_8px_0_#2d2d2d] transform rotate-2">
                            <p className="tracking-[0.6em] text-[10px] sm:text-xs font-black uppercase text-[#2d2d2d]">EPISODE: MOMENTS</p>
                        </div>
                        <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#2196f3]">The Panels</h2>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 bg-[#2d2d2d] dark:bg-[#ff4081] text-white border-[3px] border-[#2d2d2d] flex items-center justify-center hover:bg-[#ffeb3b] hover:text-[#2d2d2d] transition-all shadow-[6px_6px_0_#2196f3] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-6 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] transition-all duration-500 overflow-hidden ${activeIndex === idx
                                        ? "scale-110 shadow-[8px_8px_0_#ff4081] z-20 grayscale-0"
                                        : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105 shadow-[4px_4px_0_#2196f3]"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 bg-[#2d2d2d] dark:bg-[#ff4081] text-white border-[3px] border-[#2d2d2d] flex items-center justify-center hover:bg-[#ffeb3b] hover:text-[#2d2d2d] transition-all shadow-[6px_6px_0_#2196f3] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-[#1a1a2e] p-3 sm:p-5 border-[6px] border-[#2d2d2d] shadow-[25px_25px_0_rgba(33,150,243,0.3)] dark:shadow-[25px_25px_0_rgba(255,64,129,0.3)] group transition-all duration-1000 overflow-hidden transform -rotate-1">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.2, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-1000"
                                alt="Comic Panel"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Action Button */}
                        <div className="absolute bottom-12 right-12 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 bg-[#ff4081] text-white border-[4px] border-[#2d2d2d] flex items-center justify-center shadow-[6px_6px_0_#2d2d2d] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#ffeb3b] hover:text-[#2d2d2d] active:shadow-none active:translate-x-1 active:translate-y-1"
                            >
                                <Maximize2 size={28} />
                            </button>
                        </div>

                        {/* Speech Bubble Accent */}
                        <div className="absolute top-8 left-8 bg-white dark:bg-slate-900 border-[3px] border-[#2d2d2d] px-6 py-2 shadow-[4px_4px_0_#2d2d2d] transform -rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100">
                            <p className="text-[10px] font-black uppercase text-[#2d2d2d] dark:text-white">WOW!</p>
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#fdfaf0]/95 dark:bg-[#050510]/98 backdrop-blur-xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        {/* Close button - comic style */}
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 bg-[#ff4081] text-white border-[4px] border-[#2d2d2d] p-3 shadow-[8px_8px_0_#2d2d2d] hover:bg-[#ffeb3b] hover:text-[#2d2d2d] hover:rotate-90 transition-all duration-550 z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={32} strokeWidth={4} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.2, x: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-[#2d2d2d] dark:text-blue-400 hover:text-[#ff4081] transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[120px]" strokeWidth={4} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, x: 100, rotate: 10 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    exit={{ opacity: 0, x: -100, rotate: -10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-8 bg-white dark:bg-[#1a1a2e] border-[8px] border-[#2d2d2d] shadow-[30px_30px_0_rgba(33,150,243,0.5)] transform -rotate-1"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[80vh] w-auto h-auto object-contain border-[2px] border-[#2d2d2d]"
                                        alt="Comic Fullscreen"
                                    />

                                    <div className="absolute inset-x-0 -bottom-24 flex items-center justify-center">
                                        <div className="px-12 py-5 bg-[#ffeb3b] border-[4px] border-[#2d2d2d] shadow-[8px_8px_0_#2d2d2d] rotate-2">
                                            <p className="font-black italic text-3xl text-[#2d2d2d] uppercase tracking-tighter">
                                                Page {selectedImg + 1} // {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.2, x: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-[#2d2d2d] dark:text-blue-400 hover:text-[#ff4081] transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={64} className="sm:size-[120px]" strokeWidth={4} />
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
        <section id="gift" className="bg-white dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-12 py-3 shadow-[8px_8px_0_#2d2d2d] transform rotate-1">
                        <p className="tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]">THE BONUS STAGE</p>
                    </div>
                    <h2 className="text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ff4081]">Tokens</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] p-12 shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] space-y-12 transition-all duration-700 hover:shadow-[20px_20px_0_#2196f3] group relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-6">
                                    <div className="inline-block px-4 py-1 bg-[#2196f3] text-white font-black text-[10px] uppercase border-[2px] border-[#2d2d2d] shadow-[4px_4px_0_#2d2d2d] transform -rotate-3">{account.bank}</div>
                                    <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">{account.number}</h3>
                                    <p className="text-2xl font-black italic tracking-tight text-[#2d2d2d]/80 uppercase transform -skew-x-12">{account.name}</p>
                                </div>
                                <Landmark size={24} className="text-[#2d2d2d] group-hover:scale-125 transition-all rotate-12" />
                            </div>
                            <button onClick={() => copyToClipboard(account.number, `bank-${idx}`)} className="w-full py-8 bg-[#2d2d2d] dark:bg-[#ff4081] text-white font-black uppercase text-[12px] shadow-[8px_8px_0_#ffeb3b] hover:bg-[#ff4081] transition-all active:scale-95">
                                {copiedId === `bank-${idx}` ? <Check size={20} /> : <Copy size={20} />}
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
        <section id="rsvp" className="bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700 text-left">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start text-left">
                    <div className="space-y-20 animate-reveal text-left">
                        <div className="inline-block bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] px-8 py-2 border-[3px] border-[#2d2d2d] shadow-[6px_6px_0_#2d2d2d] transform -rotate-2">
                            <p className="tracking-[0.6em] text-[10px] font-black uppercase">ACTION REQUIRED</p>
                        </div>
                        <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12">RSVP!</h2>
                        {submitted ? (
                            <div className="p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] text-center shadow-[15px_15px_0_#2196f3]">
                                <CheckCircle2 className="text-[#2196f3] h-24 w-24 mx-auto" />
                                <h3 className="text-4xl font-black italic uppercase mt-8">Signal Received!</h3>
                                <button onClick={() => setSubmitted(false)} className="text-[#ff4081] border-b-2 border-[#ff4081] pb-1 text-[10px] font-black mt-8 uppercase tracking-widest transition-all">TRY AGAIN?</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16 text-left">
                                <input required placeholder="WHO ARE YOU?" className="w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter outline-none uppercase text-[#2d2d2d] dark:text-white" value={formData.guest_name} onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                                <textarea rows={2} placeholder="SPEAK YOUR MIND..." className="w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter outline-none resize-none uppercase text-[#2d2d2d] dark:text-white" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />

                                <div className="flex items-center justify-between px-4 text-left">
                                    <label className="text-[10px] font-black uppercase text-[#ff4081]">Pilih Sticker</label>
                                    <button type="button" onClick={() => setShowStickerPicker(true)} className="text-[#2196f3]"><Smile size={24} /></button>
                                </div>
                                {formData.sticker && <div className="relative inline-block mt-2 ml-4 text-left"><img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" /><button type="button" onClick={() => setFormData(p => ({ ...p, sticker: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
                                {showStickerPicker && <StickerPicker isOpen={showStickerPicker} selectedSticker={formData.sticker?.id || null} onSelect={(sticker) => { setFormData(p => ({ ...p, sticker })); setShowStickerPicker(false); }} onClose={() => setShowStickerPicker(false)} />}

                                <div className="grid grid-cols-2 gap-6 text-left">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button key={status} type="button" onClick={() => setFormData({ ...formData, attendance: status })} className={`py-8 font-black uppercase text-[10px] border-[4px] border-[#2d2d2d] transition-all transform ${formData.attendance === status ? 'bg-[#ffeb3b] dark:bg-[#00e5ff] text-[#2d2d2d] shadow-[10px_10px_0_#2d2d2d] -translate-x-1 -translate-y-1' : 'bg-white dark:bg-transparent text-[#2d2d2d]/30'}`}>{status.replace('TIDAK_HADIR', 'SORRY!').replace('HADIR', "YES!")}</button>
                                    ))}
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-[#ff4081] text-white py-8 font-black uppercase text-[12px] shadow-[12px_12px_0_#2d2d2d] hover:shadow-none transition-all">{isSubmitting ? "TRANSMITTING..." : "SUBMIT LOG"}</button>
                            </form>
                        )}
                    </div>
                    <div className="space-y-20 lg:pl-24 animate-reveal text-left">
                        <div className="flex flex-col items-center lg:items-end text-right">
                            <p className="text-9xl font-black italic tracking-tighter text-[#2196f3] transform -skew-x-12 drop-shadow-[10px_10px_0_#ffeb3b]">{rsvps.length}</p>
                            <div className="bg-[#ff4081] text-white px-6 py-2 border-[3px] border-[#2d2d2d] rotate-[-15deg] font-black text-xs uppercase shadow-[4px_4px_0_#2d2d2d]">JOINED!</div>
                        </div>
                        <div className="space-y-8 text-left">
                            {rsvps.slice(0, 5).map(rsvp => (
                                <div key={rsvp.id} className="relative p-10 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] group hover:shadow-[10px_10px_0_#ffeb3b] transition-all duration-700 text-left">
                                    <h4 className="text-3xl font-black italic text-[#2d2d2d] dark:text-white uppercase transform -skew-x-6">{rsvp.guest_name}</h4>
                                    <div className="mt-6 p-6 bg-[#fdfaf0] dark:bg-black/20 border-[2px] border-[#2d2d2d] text-sm font-black italic uppercase text-[#2d2d2d]/60 dark:text-white/60">— "{rsvp.message || "NO QUOTES."}"</div>
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
        <section id="wishes" className="bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-sans transition-colors duration-700 text-left">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <div className="grid lg:grid-cols-12 gap-24 items-start text-left">
                    <div className="lg:col-span-5 space-y-20 animate-reveal text-left">
                        <div className="inline-block bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-10 py-2 rotate-2 shadow-[8px_8px_0_#2d2d2d]">
                            <p className="tracking-[0.6em] text-[10px] font-black uppercase text-[#2d2d2d]">FAN GREETINGS</p>
                        </div>
                        <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter uppercase transform -skew-x-12">The Dialogue</h2>
                        <form onSubmit={handleSubmit} className="space-y-12 bg-white dark:bg-[#1a1a2e] p-12 md:p-16 border-[4px] border-[#2d2d2d] shadow-[15px_15px_0_#2196f3] group text-left">
                            <input required placeholder="WHO ARE YOU?" className="w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                            <textarea required placeholder="TYPE YOUR MESSAGE..." rows={4} className="w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase outline-none resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="w-full bg-[#2d2d2d] dark:bg-[#ff4081] text-white py-8 font-black uppercase tracking-[0.6em] shadow-[10px_10px_0_#ffeb3b] hover:bg-[#ff4081] transition-all">SEND TO LOG</button>
                        </form>
                    </div>
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left">
                        <div className="flex items-center justify-between border-b-[4px] border-[#2d2d2d]/10 pb-10 text-left">
                            <div className="p-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] shadow-[5px_5px_0_#2d2d2d] -rotate-3 text-left"><Quote size={28} className="text-[#2d2d2d]" fill="currentColor" /></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#2d2d2d]/30 italic transition-colors">CHAPTER ARCHIVE — {wishes.length}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-16 text-left">
                            {wishes.slice(0, 4).map(wish => (
                                <div key={wish.id} className="relative space-y-8 group text-left">
                                    <div className="p-10 bg-white dark:bg-[#1a1a2e] border-[3px] border-[#2d2d2d] shadow-[10px_10px_0_rgba(0,0,0,0.05)] transition-all text-left">
                                        <p className="text-4xl md:text-5xl italic tracking-tighter text-[#2d2d2d] dark:text-white font-black uppercase transform -skew-x-6">" {wish.message} "</p>
                                    </div>
                                    <div className="flex items-center gap-12 px-8 text-left"><div className="h-[4px] w-20 bg-[#ff4081]/30"></div><p className="text-2xl font-black italic tracking-tighter text-[#2d2d2d]/60 uppercase transform -skew-x-12">{wish.name}</p></div>
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
    const navItems = [{ icon: Home, label: "Intro", href: "#hero" }, { icon: Heart, label: "Heroes", href: "#couple" }, { icon: Star, label: "History", href: "#story" }, { icon: Calendar, label: "Agenda", href: "#event" }, { icon: Camera, label: "Panels", href: "#gallery" }, { icon: Gift, label: "Tokens", href: "#gift" }, { icon: MessageCircle, label: "Log", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75 pointer-events-none'}`}>
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-[4px] border-[#2d2d2d] dark:border-blue-500 px-8 py-5 shadow-2xl flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-[#2d2d2d]/30 hover:text-[#2196f3] transition-all"><item.icon size={22} /><span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all bg-[#ffeb3b] text-[#2d2d2d] text-[10px] font-black px-5 py-3 border-[3px] border-[#2d2d2d] hidden group-hover:block whitespace-nowrap italic">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-[#2d2d2d]/30 hover:text-[#2196f3] transition-all">{theme === "light" ? <Moon size={22} /> : <Sun size={22} />}</button>
            </div>
        </nav>
    );
};

const StoryboardTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => { document.body.style.overflow = isOpened ? "auto" : "hidden"; }, [isOpened]);
    return (
        <div className={`storyboard-theme ${theme === "dark" ? "dark" : ""}`}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-[9999] bg-[radial-gradient(#000_2px,transparent_2px)] dark:bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:25px_25px] transition-all duration-1000"></div>
            {!isOpened && <Envelope onOpen={onOpen} />}
            <main className={`transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpened ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"}`}>
                <Hero /><CoupleProfile /><LoveStory /><EventDetails /><Gallery /><GiftInfo /><RSVPForm /><Wishes />
            </main>
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4"><MusicController /><AutoScrollController isOpened={isOpened} /></div>
            <Navbar theme={theme} toggleTheme={toggleTheme} /><MusicPlayer /><InstallPrompt />
        </div>
    );
};

export default StoryboardTheme;
