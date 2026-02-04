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
    Sun,
    Moon,
    Mail,
    Star,
    Sparkles,
    Landmark,
    Copy,
    Check,
    Send,
    CheckCircle2,
    Clock,
    MapPin,
    Map,
    ChevronLeft,
    ChevronRight,
    Quote,
    Smile,
    X,
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdf5e6] overflow-hidden">
            {/* Terracotta and Sage Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e2725b] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8a9a5b] opacity-10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" />
                    <p className="tracking-[0.8em] text-[10px] font-bold text-[#c19a6b] uppercase">Invitation From Us</p>
                    <h1 className="font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight">
                        {config.couple.groom.name} <span className="text-[#e2725b]">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="relative py-12 px-8 border-[1.5px] border-[#c19a6b]/20 rounded-[3rem]">
                    <div className="space-y-6">
                        <p className="text-sm font-medium text-[#c19a6b] italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="font-serif text-3xl md:text-5xl text-[#4a4a4a] font-bold tracking-tight">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#e2725b] text-white rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-[#e2725b]/30"
                >
                    <span className="relative z-10 font-bold tracking-widest text-[11px] uppercase">Buka Undangan</span>
                    <Mail className="relative z-10 h-4 w-4" />
                </button>

                <p className="text-[10px] tracking-widest text-[#c19a6b] uppercase opacity-60">Save The Date</p>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#faf7f2] dark:bg-stone-950 transition-colors duration-1000">
            {/* Boho Textures and Patterns */}
            <div className="absolute inset-x-0 top-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert transition-all"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#c19a6b]/10 dark:border-white/5 rounded-full scale-0 animate-reveal transition-colors" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}></div>

            <div className="relative z-10 space-y-16 px-6 max-w-5xl">
                <div className="space-y-6 reveal-active">
                    <Sun className="text-[#c19a6b] dark:text-stone-500 h-10 w-10 mx-auto opacity-20 animate-spin-slow transition-colors" />
                    <p className="tracking-[1em] text-[10px] font-bold text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">The Wedding Journey of</p>
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors">
                            {config.couple.groom.name}
                        </h1>
                        <span className="font-serif text-5xl md:text-7xl text-[#e2725b] italic font-light transition-colors">&</span>
                        <h1 className="font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors">
                            {config.couple.bride.name}
                        </h1>
                    </div>
                </div>

                <div className="space-y-4 animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <div className="w-16 h-[1px] bg-[#c19a6b]/30 dark:bg-stone-800 mx-auto mb-6 transition-colors"></div>
                    <p className="font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.hero.date}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Heart className="h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" />
                        <p className="tracking-[0.5em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">At {config.hero.city}</p>
                        <Heart className="h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Terracotta Splash Decor */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#e2725b]/5 dark:bg-[#e2725b]/2 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors"></div>

            <div className="container mx-auto max-w-6xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Sun className="text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-20 transition-colors" />
                    <p className="font-serif text-2xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed max-w-3xl mx-auto transition-colors">
                        "Two souls, one heart. A journey that began with flowers and continues with stars."
                    </p>
                    <div className="w-20 h-[1px] bg-[#e2725b] mx-auto opacity-30"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-24 items-center">
                    {/* Groom */}
                    <div className="space-y-12 text-center group">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700"></div>
                            <div className="relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">The Groom</p>
                            <h3 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.groom.fullName}</h3>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors">Putra dari Pasangan</p>
                                <p className="font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride */}
                    <div className="space-y-12 text-center group md:mt-40">
                        <div className="relative inline-block mx-auto">
                            <div className="absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700"></div>
                            <div className="relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">The Bride</p>
                            <h3 className="font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{config.couple.bride.fullName}</h3>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors">Putri dari Pasangan</p>
                                <p className="font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors">{config.couple.bride.parents}</p>
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
        <section id="story" className="bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert rotate-12 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e2725b]/5 rounded-full blur-[120px]"></div>

            <div className="container mx-auto max-w-5xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Star className="text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Our Soul Connection</h2>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#e2725b] opacity-30"></div>
                        <p className="tracking-[0.8em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors">Timeline of Togetherness</p>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#e2725b] opacity-30 transition-colors"></div>
                    </div>
                </div>

                <div className="relative space-y-32 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-[#c19a6b]/10 dark:before:bg-white/5 transition-colors">
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            {/* Center Point */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-stone-800 border-2 border-[#e2725b] shadow-2xl flex items-center justify-center transition-colors">
                                <div className="w-2 h-2 rounded-full bg-[#e2725b] animate-ping"></div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-8 bg-[#faf7f2] dark:bg-stone-950 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-2xl transition-all duration-1000 hover:-translate-y-4 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="space-y-3">
                                    <p className="font-serif text-4xl md:text-5xl text-[#e2725b] italic tracking-tight transition-colors">{story.date}</p>
                                    <h3 className="font-serif text-3xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 font-black tracking-tight group-hover:text-[#e2725b] transition-colors">{story.title}</h3>
                                </div>
                                <div className={`w-12 h-1 bg-[#c19a6b] opacity-20 rounded-full ${idx % 2 === 0 ? 'ml-auto' : ''}`}></div>
                                <p className="text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">
                                    {story.desc}
                                </p>
                            </div>

                            {/* Spacer for desktop */}
                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-20">
                    <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-20 animate-spin-slow" />
                </div>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Abstract Geometric Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e2725b]/10 -rotate-12 translate-x-32 -translate-y-32"></div>

            <div className="container mx-auto max-w-6xl space-y-24 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">Sacred Union</h2>
                    <p className="tracking-[0.6em] text-[11px] font-black text-[#e2725b] uppercase transition-colors">Place & Time</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group">
                            {/* Organic Shaped Background */}
                            <div className="absolute inset-0 bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 rounded-[3rem] shadow-2xl transition-all group-hover:shadow-[#e2725b]/20 group-hover:-translate-y-2 duration-1000"></div>

                            <div className="relative p-12 md:p-20 space-y-12 text-center">
                                <div className="space-y-4">
                                    <div className="w-12 h-1 bg-[#e2725b] mx-auto opacity-40 rounded-full"></div>
                                    <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors">{event.title}</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <Calendar className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{event.day}, {event.date}</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <Clock className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <p className="text-[12px] font-black text-[#e2725b] tracking-[0.3em] uppercase">
                                            {event.startTime} — {event.endTime} WIB
                                        </p>
                                    </div>

                                    <div className="pt-10 border-t border-[#faf7f2] dark:border-white/5 flex flex-col items-center gap-4 transition-colors">
                                        <MapPin className="text-[#c19a6b] h-6 w-6 opacity-40" />
                                        <h4 className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">{event.venue.name}</h4>
                                        <p className="text-sm text-slate-400 dark:text-stone-500 max-w-[280px] mx-auto italic leading-relaxed transition-colors">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl shadow-[#4a4a4a]/20 duration-500"
                                    >
                                        <Map size={16} /> Open Location
                                    </a>
                                </div>
                            </div>
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
        <section id="gallery" className="bg-[#faf7f2] dark:bg-stone-900 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Pattern Accent */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 dark:invert pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="text-center space-y-6">
                        <Sun className="text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" />
                        <h2 className="font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Glimpses of Love</h2>
                        <p className="tracking-[0.8em] text-[10px] sm:text-xs font-bold text-[#e2725b] uppercase transition-colors">Visual Journey</p>
                        <div className="w-16 h-px bg-[#e2725b] mx-auto opacity-30"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 rounded-3xl bg-white dark:bg-stone-800 border-2 border-[#c19a6b]/20 dark:border-white/5 flex items-center justify-center text-[#e2725b] hover:bg-[#e2725b] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-[#e2725b] scale-110 shadow-2xl z-20"
                                        : "border-transparent opacity-40 grayscale-[0.4] hover:opacity-100 hover:grayscale-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 rounded-3xl bg-white dark:bg-stone-800 border-2 border-[#c19a6b]/20 dark:border-white/5 flex items-center justify-center text-[#e2725b] hover:bg-[#e2725b] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Image Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[4rem] sm:rounded-[5rem] overflow-hidden border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl group transition-all duration-1000">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: "anticipate" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer saturate-[0.8] group-hover:saturate-100"
                                alt="Boho Moment"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-[#e2725b]/5 opacity-50 pointer-events-none group-hover:opacity-0 transition-opacity"></div>

                        {/* Action Button */}
                        <div className="absolute bottom-12 right-12 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#e2725b]/80 shadow-2xl"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#faf7f2]/95 dark:bg-stone-950/98 backdrop-blur-2xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#e2725b] hover:scale-110 transition-all z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={40} className="sm:size-16" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-[#c19a6b] hover:text-[#e2725b] transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[100px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[85vh] w-auto h-auto object-contain rounded-[3rem] sm:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(226,114,91,0.2)] border-2 border-[#c19a6b]/10"
                                        alt="Boho Reel"
                                    />

                                    <div className="absolute inset-x-0 -bottom-20 flex items-center justify-center gap-6">
                                        <div className="px-8 py-3 bg-white/40 dark:bg-stone-800/40 backdrop-blur-xl rounded-full border border-[#c19a6b]/20">
                                            <p className="font-serif italic text-2xl text-[#e2725b] dark:text-stone-300">
                                                Page {selectedImg + 1} / {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-[#c19a6b] hover:text-[#e2725b] transition-colors z-[2030]"
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
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section id="gift" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Geometric Background Decor */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e2725b]/5 rotate-45 translate-x-32 translate-y-32"></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10 text-center">
                <div className="space-y-6">
                    <Sun className="text-[#c19a6b] h-12 w-12 mx-auto opacity-30 animate-spin-slow" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Gifts of Love</h2>
                    <p className="max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">
                        "Your prayers are the most precious gifts. Should you wish to share more, we provide these digital options."
                    </p>
                    <div className="w-16 h-1 bg-[#e2725b] mx-auto opacity-30 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-10 group hover:shadow-[#e2725b]/20 transition-all duration-1000">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-[#faf7f2] dark:bg-stone-950 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all">
                                    <Landmark className="text-[#e2725b] h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-[#c19a6b] tracking-[0.5em] uppercase">{account.bank}</p>
                                <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold tracking-tight transition-colors">{account.number}</h3>
                                <p className="font-serif text-xl italic text-slate-400 dark:text-stone-500 transition-colors">a.n {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl transition-all duration-500"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={16} className="text-green-400" /> Account Copied</>
                                ) : (
                                    <><Copy size={16} /> Copy Number</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => { const handleScroll = () => setIsVisible(window.scrollY > 400); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);
    const navItems = [{ icon: Home, label: "Home", href: "#hero" }, { icon: Heart, label: "Couple", href: "#couple" }, { icon: Calendar, label: "Dates", href: "#event" }, { icon: Camera, label: "Gallery", href: "#gallery" }, { icon: Gift, label: "Gifts", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-[1.5s] ease-in-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}>
            <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-[#c19a6b]/10 dark:border-white/5 px-8 py-5 rounded-full shadow-2xl flex items-center gap-6 sm:gap-10">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-[#c19a6b]/60 hover:text-[#e2725b] transition-all"><item.icon size={22} /><span className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-[#4a4a4a] text-white text-[9px] font-black tracking-widest px-5 py-3 rounded-full hidden group-hover:block whitespace-nowrap">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-[#c19a6b]/60 hover:text-[#e2725b] transition-all">{theme === "light" ? <Moon size={22} /> : <Sun size={22} />}</button>
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
    const rsvpsPerPage = 6;
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

    const stats = {
        hadir: rsvps
            .filter((r) => r.attendance === AttendanceStatus.HADIR)
            .reduce((total, r) => total + (r.guest_count || 1), 0),
        ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
        tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR)
            .length,
    };

    const currentRSVPs = useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        const sorted = [...rsvps].sort(
            (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
        );
        return sorted.slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    return (
        <section id="rsvp" className="bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Boho Decor Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#8a9a5b]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/30 dark:border-white/5 shadow-2xl space-y-14 relative group overflow-hidden transition-all duration-1000">
                            <div className="space-y-4">
                                <Sun className="text-[#c19a6b] h-6 w-6 opacity-30 animate-spin-slow" />
                                <h2 className="font-serif text-5xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Will You Join Us?</h2>
                                <p className="text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors">RSVP Online</p>
                            </div>

                            {submitted ? (
                                <div className="text-center py-10 space-y-8 animate-reveal">
                                    <CheckCircle2 className="text-[#e2725b] h-20 w-20 mx-auto opacity-30" />
                                    <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors">Wonderful!</h3>
                                    <p className="text-slate-400 dark:text-stone-400 italic transition-colors">Your presence will fill our hearts with joy.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[#e2725b] text-[10px] font-black tracking-widest uppercase border-b-2 border-[#e2725b]/20 pb-1">Reset Form</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Full Name</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                className="w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-3xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all shadow-inner"
                                                value={formData.guest_name}
                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Prayer or Message</label>
                                            <textarea
                                                rows={4}
                                                className="w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all resize-none shadow-inner"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Pilih Sticker</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowStickerPicker(true)}
                                                className="text-[#c19a6b] hover:text-[#e2725b] transition-colors"
                                            >
                                                <Smile className="w-6 h-6" />
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

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Are you joining?</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, attendance: status })}
                                                    className={`flex items-center justify-between px-10 py-5 rounded-3xl border transition-all duration-500 ${formData.attendance === status
                                                        ? 'bg-[#e2725b] border-[#e2725b] text-white shadow-xl translate-x-2'
                                                        : 'bg-white dark:bg-stone-800 border-[#c19a6b]/20 dark:border-white/5 text-[#c19a6b] dark:text-stone-400 hover:bg-[#faf7f2] dark:hover:bg-stone-700'
                                                        }`}
                                                >
                                                    <span className="text-[10px] font-black tracking-widest uppercase">{status.replace('TIDAK_HADIR', 'Cannot Attend').replace('HADIR', 'Confirm Presence').replace('RAGU', 'Maybe Later')}</span>
                                                    {formData.attendance === status && <Heart size={16} className="fill-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase hover:bg-[#e2725b] transition-all shadow-2xl flex items-center justify-center gap-4 duration-500"
                                    >
                                        {isSubmitting ? "Sending..." : "Submit Reservation"}
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-16">
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: "Joined", count: stats.hadir, color: "text-[#e2725b]" },
                                { label: "Uncertain", count: stats.ragu, color: "text-[#c19a6b]" },
                                { label: "Absent", count: stats.tidak, color: "text-slate-300" }
                            ].map((stat, i) => (
                                <div key={i} className="p-12 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 text-center space-y-2 shadow-2xl transition-all duration-1000">
                                    <p className={`font-serif text-5xl md:text-8xl font-black tracking-tighter ${stat.color}`}>{stat.count}</p>
                                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-6 px-4">
                                <p className="text-[11px] font-black text-[#e2725b] tracking-widest uppercase">Community Attendance</p>
                                <div className="h-px flex-grow bg-gradient-to-r from-[#e2725b]/40 to-transparent"></div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {currentRSVPs.map(rsvp => (
                                    <div key={rsvp.id} className="p-10 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-lg space-y-5 hover:scale-[1.02] transition-all duration-500">
                                        <div className="flex items-center justify-between">
                                            <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{rsvp.guest_name}</p>
                                            <div className={`w-3 h-3 rounded-full ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-[#e2725b]' : 'bg-slate-200'}`}></div>
                                        </div>
                                        <p className="text-slate-400 dark:text-stone-400 text-lg font-serif italic leading-relaxed transition-colors">"{rsvp.message || "Blessings..."}"</p>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-4 pt-10">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-14 h-14 rounded-2xl font-serif text-2xl transition-all duration-500 ${currentPage === i + 1 ? 'bg-[#e2725b] text-white shadow-2xl -translate-y-2' : 'text-[#c19a6b] dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 border border-[#c19a6b]/20 dark:border-white/5'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
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
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 6;
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

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
            setPostSuccess(true);
            setTimeout(() => setPostSuccess(false), 3000);
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
        <section id="wishes" className="bg-white dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert pointer-events-none transition-all"></div>

            <div className="container mx-auto max-w-6xl relative z-10 space-y-32">
                <div className="text-center space-y-8">
                    <Sun className="text-[#c19a6b] h-10 w-10 mx-auto opacity-20 animate-spin-slow" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Blessing Tree</h2>
                    <div className="flex flex-col items-center gap-4">
                        <p className="max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors">"Your words are the seeds of our future garden. Thank you for being part of our story."</p>
                        <div className="w-20 h-px bg-[#e2725b] opacity-40"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Wrapper */}
                    <div className="lg:col-span-5 bg-[#faf7f2] dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000">
                        <div className="space-y-4">
                            <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">Write a Note</h3>
                            <p className="text-[10px] font-black text-[#e2725b] tracking-[0.4em] uppercase">Digital Guestbook</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Your Name</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Beautiful name here"
                                        className="w-full bg-white dark:bg-stone-800 rounded-2xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4">Warm Wishes</label>
                                    <textarea
                                        required
                                        placeholder="Pour your heart out..."
                                        rows={5}
                                        className="w-full bg-white dark:bg-stone-800 rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700 resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${postSuccess ? 'bg-green-600 text-white' : 'bg-[#e2725b] text-white dark:text-slate-950 hover:bg-[#4a4a4a] dark:hover:bg-white transition-colors duration-500'
                                    }`}
                            >
                                {isSending ? "Sending Wish..." : postSuccess ? "Wish Received!" : "Post Message"}
                                {!postSuccess && <Send size={18} />}
                                {postSuccess && <Check size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* List Wrapper */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {currentWishes.map(wish => (
                                <div key={wish.id} className="relative group p-12 bg-white dark:bg-stone-900 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-xl hover:shadow-[#e2725b]/20 transition-all duration-1000 flex flex-col gap-6">
                                    <Quote className="text-[#e2725b] h-10 w-10 opacity-10 -ml-2" />
                                    <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors">"{wish.message}"</p>
                                    <div className="pt-8 border-t border-[#faf7f2] dark:border-white/5 flex items-center justify-between transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black tracking-[0.3em] text-[#e2725b] uppercase italic transition-colors">{wish.name}</p>
                                            <p className="text-[10px] text-slate-300 dark:text-stone-500 italic transition-colors">
                                                {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <Heart className="text-[#e2725b] h-4 w-4 opacity-20 fill-[#e2725b]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="flex items-center gap-8 px-12 bg-[#faf7f2] dark:bg-stone-800 rounded-2xl text-[#c19a6b] dark:text-stone-400 font-serif text-2xl italic shadow-inner transition-colors">
                                    <span>{currentPage}</span>
                                    <span className="opacity-10">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main Theme Component ---

const BohoTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`boho-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-1000 ${isOpened ? "opacity-100" : "opacity-0 blur-xl scale-110 pointer-events-none"}`}>
                <Hero />
                <CoupleProfile />
                <LoveStory />
                <EventDetails />
                <Gallery />
                <GiftInfo />
                <RSVPForm />
                <Wishes />
            </main>

            {/* Standardized Floating Utilities */}
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4">
                <MusicController isOpened={isOpened} />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <MusicPlayer />
            <InstallPrompt />
        </div>
    );
};

export default BohoTheme;
