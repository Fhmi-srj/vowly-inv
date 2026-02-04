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
    PartyPopper,
    Sun,
    Moon,
    Star,
    Smile,
    Sparkles,
    Zap,
    MapPin,
    Clock,
    ArrowRight,
    Landmark,
    Copy,
    Check,
    Send,
    CheckCircle2,
    Users,
    MoveRight,
    Quote,
    MoveLeft,
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f0f9ff] overflow-hidden">
            {/* Playful Geometric Shapes */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 right-40 w-24 h-24 bg-blue-500 -skew-x-12 hidden md:block"></div>

            <div className="relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal">
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <PartyPopper className="text-pink-500 h-8 w-8" />
                        <span className="bg-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-black">You're Invited!</span>
                        <PartyPopper className="text-pink-500 h-8 w-8 -scale-x-100" />
                    </div>
                    <h1 className="font-sans text-6xl md:text-8xl font-black text-blue-600 tracking-tighter uppercase leading-none italic">
                        {config.couple.groom.name} <br />
                        <span className="text-pink-500">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] border-4 border-black space-y-4 text-black">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Special Guest</p>
                    <h2 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tight">
                        {guestName || "Awesome Person"}
                    </h2>
                </div>

                <button
                    onClick={onOpen}
                    className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-pink-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-[8px_8px_0_#000]"
                >
                    <span className="relative z-10 font-black tracking-widest text-xs uppercase">Join The Party</span>
                    <PartyPopper className="relative z-10 h-5 w-5" />
                    <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 transition-transform group-hover:scale-100"></div>
                </button>

                <p className="text-[10px] tracking-[0.6em] text-blue-600 font-bold uppercase opacity-60">Let's Celebrate Together!</p>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fafafa] dark:bg-slate-950 transition-colors duration-1000">
            {/* Comic Style Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Star className="text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" />
                <p className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[1em]">The Big Day is Coming</p>
                <Star className="text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" />
            </div>

            <div className="relative z-10 space-y-12 px-6 max-w-5xl">
                <div className="space-y-4">
                    <h1 className="font-sans text-[10rem] md:text-[18rem] font-black text-black dark:text-white leading-[0.75] tracking-tighter uppercase italic select-none">
                        <span className="text-blue-600">{config.couple.groom.name.substring(0, 1)}</span>
                        {config.couple.groom.name.substring(1)}
                    </h1>
                    <div className="flex items-center justify-center gap-8 -my-4 md:-my-12">
                        <div className="h-4 w-32 bg-yellow-400 -rotate-3 rounded-full"></div>
                        <Smile className="h-16 w-16 text-pink-500 animate-bounce" />
                        <div className="h-4 w-32 bg-blue-500 rotate-3 rounded-full"></div>
                    </div>
                    <h1 className="font-sans text-[10rem] md:text-[18rem] font-black text-black dark:text-white leading-[0.75] tracking-tighter uppercase italic select-none">
                        <span className="text-pink-500">{config.couple.bride.name.substring(0, 1)}</span>
                        {config.couple.bride.name.substring(1)}
                    </h1>
                </div>

                <div className="pt-12 animate-reveal" style={{ animationDelay: '0.8s' }}>
                    <div className="inline-block bg-black dark:bg-slate-900 text-white px-12 py-6 rounded-3xl -rotate-2 shadow-[12px_12px_0_#fbd38d] dark:shadow-[12px_12px_0_#3b82f6] transition-all">
                        <p className="font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{config.hero.date}</p>
                        <p className="text-xs font-black uppercase tracking-[0.4em] mt-3 text-yellow-400">Save our union in {config.hero.city}</p>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="w-20 h-20 border-8 border-blue-600 rounded-full opacity-20"></div>
            </div>
            <div className="absolute top-10 right-10 hidden md:block">
                <div className="w-24 h-24 bg-pink-500 rotate-45 opacity-20"></div>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-slate-900 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white relative overflow-hidden transition-colors duration-1000">
            {/* Pop Art Dots */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ backgroundImage: 'radial-gradient(#ec4899 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="grid md:grid-cols-2 gap-20 md:gap-32 items-center">
                    {/* Groom Section */}
                    <div className="space-y-12 text-left">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-yellow-400 -rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500"></div>
                            <div className="relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl">
                                <img
                                    src={config.couple.groom.image}
                                    className="w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110"
                                    alt={config.couple.groom.fullName}
                                />
                            </div>
                            <div className="absolute -top-10 -right-10 bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 rotate-12 z-20 transition-all">
                                <Smile className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">{config.couple.groom.fullName}</h2>
                            <div className="flex items-center gap-4">
                                <div className="h-1.5 w-12 bg-pink-500 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">The Groom</p>
                            </div>
                            <div className="pt-6 space-y-1">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic font-sans text-left">Son of</p>
                                <p className="text-3xl font-black uppercase tracking-tighter text-blue-600">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bride Section */}
                    <div className="space-y-12 md:mt-48 text-left">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-500 rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500"></div>
                            <div className="relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl">
                                <img
                                    src={config.couple.bride.image}
                                    className="w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110"
                                    alt={config.couple.bride.fullName}
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-yellow-400 text-black w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 -rotate-12 z-20 transition-all">
                                <Sparkles className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">{config.couple.bride.fullName}</h2>
                            <div className="flex items-center gap-4">
                                <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">The Bride</p>
                            </div>
                            <div className="pt-6 space-y-1">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic font-sans text-left">Daughter of</p>
                                <p className="text-3xl font-black uppercase tracking-tighter text-pink-500">{config.couple.bride.parents}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-block bg-zinc-100 dark:bg-slate-800 p-12 rounded-[3.5rem] rotate-1 transition-colors">
                        <p className="text-3xl font-black uppercase italic tracking-tighter max-w-2xl">
                            "When our worlds collided, it was a explosion of colors and joy!"
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LoveStory: FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-white dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000">
            {/* Geometric Accents */}
            <div className="absolute top-20 right-20 w-40 h-40 border-[1.5rem] border-blue-600 rounded-full opacity-5"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500 rotate-12 opacity-5"></div>

            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="text-center space-y-8 flex flex-col items-center">
                    <div className="bg-blue-600 text-white px-10 py-4 rounded-full border-4 border-black dark:border-white/20 rotate-1 shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] transition-all">
                        <h2 className="text-5xl md:text-[7rem] font-black uppercase tracking-tighter italic leading-none">Fun Timeline</h2>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <Zap className="text-yellow-400 fill-yellow-400 h-8 w-8" />
                        <p className="tracking-[0.8em] text-[10px] font-black text-zinc-400 uppercase italic">How it all exploded!</p>
                        <Zap className="text-yellow-400 fill-yellow-400 h-8 w-8" />
                    </div>
                </div>

                <div className="relative space-y-40">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-black hidden md:block opacity-[0.05]"></div>

                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 flex items-center justify-center shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] rotate-12 transition-all">
                                    {idx % 2 === 0 ? <Smile className="text-blue-600" /> : <Sparkles className="text-pink-500" />}
                                </div>
                            </div>

                            <div className={`w-full md:w-1/2 space-y-10 group transition-all duration-700 hover:-translate-y-4 ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className={`p-12 md:p-16 rounded-[4rem] border-4 border-black dark:border-white/20 bg-zinc-50 dark:bg-slate-900 shadow-[15px_15px_0_#000] dark:shadow-[15px_15px_0_rgba(255,255,255,0.05)] group-hover:shadow-[15px_15px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                                    <div className="space-y-4 text-left">
                                        <p className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-blue-600 leading-none">{story.date}</p>
                                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none">{story.title}</h3>
                                    </div>
                                    <div className={`w-12 h-2 bg-pink-500 my-8 rounded-full ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                    <p className="text-zinc-500 font-bold uppercase text-sm tracking-tight leading-relaxed italic text-left">
                                        {story.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:block w-1/2"></div>
                        </div>
                    ))}
                </div>

                <div className="pt-24 text-center">
                    <div className="inline-flex items-center gap-6 bg-black dark:bg-slate-900 text-white px-12 py-8 rounded-[3rem] shadow-[15px_15px_0_#fbd38d] dark:shadow-[15px_15px_0_#3b82f6] -rotate-1 transition-all">
                        <Heart className="text-pink-500 fill-pink-500 animate-pulse h-10 w-10" />
                        <p className="text-4xl font-black uppercase italic tracking-tighter">Stay Tuned!</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();

    return (
        <section id="event" className="bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white">
            <div className="absolute top-0 right-0 w-full h-[2px] bg-blue-600 opacity-20 rotate-12 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-500/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-7xl space-y-32 relative z-10">
                <div className="text-center space-y-4">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-[1em]">The Big Occasions</p>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">Schedule</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="group relative">
                            <div className={`absolute inset-0 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] transition-all group-hover:translate-x-4 group-hover:translate-y-4 duration-500`}></div>

                            <div className="relative p-12 md:p-20 space-y-12 text-center flex flex-col items-center">
                                <div className={`w-24 h-24 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${idx === 0 ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                                    <Calendar size={40} strokeWidth={2.5} />
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-black text-pink-500 uppercase tracking-widest italic">{idx === 0 ? "Initial Toast" : "The Main Bash"}</p>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{event.title}</h3>
                                </div>

                                <div className="space-y-10 w-full">
                                    <div className="bg-zinc-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-black dark:border-white/20 rotate-1 transition-colors">
                                        <p className="text-xl font-black uppercase tracking-tight">{event.day}, {event.date}</p>
                                        <div className="flex items-center justify-center gap-3 mt-2 text-zinc-500">
                                            <Clock size={16} strokeWidth={3} />
                                            <p className="text-xs font-black uppercase tracking-widest">{event.startTime} — {event.endTime} WIB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <MapPin className="text-blue-600" size={24} strokeWidth={3} />
                                            <h4 className="text-2xl font-black uppercase tracking-tight">{event.venue.name}</h4>
                                        </div>
                                        <p className="text-sm text-zinc-400 max-w-[280px] mx-auto font-medium leading-relaxed italic">{event.venue.address}</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        className="group inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-slate-800 text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:bg-blue-600 hover:shadow-[10px_10px_0_#fbd38d] dark:hover:shadow-[10px_10px_0_#3b82f6]"
                                    >
                                        Google Maps <ArrowRight size={16} />
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
        <section id="gallery" className="bg-white dark:bg-slate-950 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white">
            {/* Pop Art Patterns */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ec4899 4px, transparent 4px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-20 right-20 w-40 h-40 bg-yellow-400 rotate-12 opacity-10 animate-pulse pointer-events-none"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="bg-yellow-400 text-black px-10 py-4 rounded-full border-4 border-black dark:border-white/20 -rotate-2 shadow-[10px_10px_0_#000] transition-all">
                            <p className="text-xl font-black uppercase tracking-tighter italic">Captured Moments!</p>
                        </div>
                        <h2 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter italic leading-none text-blue-600 drop-shadow-[8px_8px_0_#ec4899]">Gallery</h2>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 bg-blue-600 text-white rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-900 border-4 border-black transition-all duration-500 overflow-hidden rounded-[2rem] ${activeIndex === idx
                                        ? "scale-110 shadow-[10px_10px_0_#ec4899] z-20 grayscale-0 rotate-3"
                                        : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105 shadow-[6px_6px_0_#3b82f6] -rotate-3"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 bg-blue-600 text-white rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-slate-900 p-4 border-4 border-black rounded-[4rem] shadow-[25px_25px_0_#3b82f6] group transition-all duration-1000 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.2, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer saturate-[1.2] group-hover:saturate-[1.5] transition-all duration-1000 rounded-[3.5rem]"
                                alt="Vibrant Memory"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Fun Overlays */}
                        <div className="absolute top-8 right-8 bg-yellow-400 text-black px-6 py-2 rounded-full border-4 border-black rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                            <p className="font-black uppercase text-[10px] tracking-widest">WOW! 🎉</p>
                        </div>

                        <div className="absolute bottom-12 left-12 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 bg-pink-500 text-white rounded-full border-4 border-black flex items-center justify-center shadow-[6px_6px_0_#000] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-yellow-400 hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-blue-600/95 backdrop-blur-xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        {/* Close button - Bouncy style */}
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 bg-pink-500 text-white rounded-full border-4 border-black flex items-center justify-center shadow-[8px_8px_0_#000] z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={32} strokeWidth={4} />
                        </motion.button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.3, x: -10 }}
                                whileTap={{ scale: 0.8 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-yellow-400 hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={80} className="sm:size-[140px]" strokeWidth={6} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.5, rotate: 20 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-6 bg-white dark:bg-slate-900 border-8 border-black rounded-[5rem] shadow-[30px_30px_0_#000]"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[75vh] w-auto h-auto object-contain rounded-[3.5rem] border-4 border-black"
                                        alt="Vibrant Fullscreen"
                                    />

                                    <div className="absolute inset-x-0 -bottom-24 flex items-center justify-center">
                                        <div className="bg-yellow-400 px-12 py-5 rounded-full border-4 border-black shadow-[8px_8px_0_#000] -rotate-2">
                                            <p className="font-black italic text-3xl text-black uppercase tracking-tighter">
                                                Moment #{selectedImg + 1}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.3, x: 10 }}
                                whileTap={{ scale: 0.8 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-yellow-400 hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={80} className="sm:size-[140px]" strokeWidth={6} />
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
        <section id="gift" className="bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400 rotate-45 translate-x-32 -translate-y-32 opacity-20"></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10 text-center">
                <div className="space-y-8 flex flex-col items-center">
                    <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-10 rounded-full shadow-[10px_10px_0_#3b82f6] -rotate-3 mb-4 transition-all">
                        <Gift className="text-pink-500 h-16 w-16" strokeWidth={3} />
                    </div>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-none">Wedding Gift</h2>
                    <div className="flex gap-4 items-center">
                        <PartyPopper className="text-yellow-400" />
                        <p className="max-w-xl mx-auto text-zinc-400 font-bold uppercase tracking-tight text-xl leading-relaxed italic">"Your presence is our ultimate gift. But if you're feeling extra generous, here are our digital accounts!"</p>
                        <PartyPopper className="text-yellow-400 -scale-x-100" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className={`bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 group hover:shadow-[20px_20px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                            <div className="space-y-6">
                                <div className="w-24 h-24 bg-[#f0f9ff] dark:bg-slate-800 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all">
                                    <Landmark className="text-blue-600 h-10 w-10" strokeWidth={3} />
                                </div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.5em] italic">{account.bank}</p>
                                <h3 className="text-5xl font-black tracking-tighter uppercase italic">{account.number}</h3>
                                <p className="text-sm font-black uppercase tracking-widest text-blue-600">A.N {account.name}</p>
                            </div>

                            <button
                                onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                className="w-full py-6 rounded-full font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-4 bg-black text-white hover:bg-pink-500 active:scale-95 shadow-[8px_8px_0_#3b82f6]"
                            >
                                {copiedId === `bank-${idx}` ? (
                                    <><Check size={18} className="text-yellow-400" /> NUMBER COPIED!</>
                                ) : (
                                    <><Copy size={18} /> COPY ACCOUNT NO</>
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
    const navItems = [{ icon: Home, label: "INFO", href: "#hero" }, { icon: Heart, label: "COUPLE", href: "#couple" }, { icon: Sparkles, label: "STORY", href: "#story" }, { icon: Calendar, label: "DATES", href: "#event" }, { icon: Camera, label: "SHOTS", href: "#gallery" }, { icon: Gift, label: "TOKEN", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75 pointer-events-none'}`}>
            <div className="bg-black/95 dark:bg-white/95 backdrop-blur-2xl border-4 border-black dark:border-white/20 px-8 py-5 rounded-full shadow-[12px_12px_0_rgba(0,0,0,0.1)] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-white/40 dark:text-black/30 hover:text-yellow-400 dark:hover:text-blue-600 transition-all hover:scale-125"><item.icon size={22} strokeWidth={3} /><span className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest px-5 py-3 rounded-xl border-4 border-current hidden group-hover:block whitespace-nowrap">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-white/40 dark:text-black/30 hover:text-yellow-400 dark:hover:text-blue-600 transition-all hover:scale-125">{theme === "light" ? <Moon size={22} strokeWidth={3} /> : <Sun size={22} strokeWidth={3} />}</button>
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

    const currentRSVPs = useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        return [...rsvps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    return (
        <section id="rsvp" className="bg-[#fafafa] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white">
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-yellow-400 -translate-x-1/2 rotate-45 opacity-20"></div>

            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-16">
                        <div className="space-y-6 text-left">
                            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest -rotate-2">
                                <Smile size={18} /> Let's RSVP!
                            </div>
                            <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.8]">Join <br /> The Bash</h2>
                            <p className="text-xl font-bold uppercase tracking-tight text-zinc-400">Confirm your presence for the most exciting night of our lives.</p>
                        </div>

                        {submitted ? (
                            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[3.5rem] shadow-[20px_20px_0_#ec4899] space-y-10 animate-reveal transition-all">
                                <CheckCircle2 className="text-blue-600 h-20 w-20 mx-auto" strokeWidth={3} />
                                <div className="text-center space-y-4">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">Total Success!</h3>
                                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-8">Your response has been added to our guest list. We are thrilled to see you!</p>
                                </div>
                                <button onClick={() => setSubmitted(false)} className="w-full bg-black dark:bg-slate-800 text-white py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="space-y-10 group">
                                    <div className="space-y-4 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic">Who are you?</label>
                                        <input
                                            required
                                            disabled={isNameLocked}
                                            placeholder="INPUT YOUR AWESOME NAME"
                                            className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#3b82f6] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] text-black dark:text-white"
                                            value={formData.guest_name}
                                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic">Any words?</label>
                                        <textarea
                                            rows={2}
                                            placeholder="SEND A FUN MESSAGE!"
                                            className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#ec4899] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] resize-none text-black dark:text-white"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <div className="flex items-center justify-between px-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Pilih Sticker</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowStickerPicker(true)}
                                            className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <Smile size={24} />
                                        </button>
                                    </div>
                                    {formData.sticker && (
                                        <div className="relative inline-block mt-2 ml-6">
                                            <img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" />
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

                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, attendance: status })}
                                            className={`py-8 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-4 border-black dark:border-white/20 transition-all shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] active:translate-y-1 active:shadow-none ${formData.attendance === status
                                                ? 'bg-yellow-400 text-black shadow-[6px_6px_0_#3b82f6]'
                                                : 'bg-white dark:bg-slate-800 text-zinc-400'
                                                }`}
                                        >
                                            {status.replace('TIDAK_HADIR', 'Cannot Come').replace('HADIR', 'Confirming!')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-8 rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-black dark:hover:bg-slate-800 transition-all shadow-[12px_12px_0_#fbd38d] hover:shadow-[12px_12px_0_#ec4899] flex items-center justify-center gap-6 group active:scale-95"
                                >
                                    {isSubmitting ? "PROCESSING..." : "SUBMIT TICKET"}
                                    <MoveRight className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="space-y-16">
                        <div className="flex md:justify-end">
                            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-8 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] flex items-center gap-8 -rotate-1 transition-all">
                                <div className="text-right">
                                    <p className="text-6xl font-black tracking-tighter leading-none">{rsvps.length}</p>
                                    <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Confirmed Guests</p>
                                </div>
                                <Users className="text-blue-600 h-14 w-14" strokeWidth={3} />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {currentRSVPs.map(rsvp => (
                                <div key={rsvp.id} className={`p-8 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2.5rem] shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] space-y-5 group hover:-translate-y-2 transition-all ${Math.random() > 0.5 ? 'rotate-1' : '-rotate-1'} text-left`}>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-2xl font-black uppercase tracking-tighter truncate max-w-[150px]">{rsvp.guest_name}</h4>
                                        <div className={`w-8 h-8 rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-pink-500' : 'bg-zinc-100 dark:bg-slate-800'}`}>
                                            <Heart size={14} className="text-white fill-white" />
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-xs font-black uppercase tracking-tight line-clamp-2 leading-relaxed italic">"{rsvp.message || "Sending hugs!"}"</p>
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
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 4;
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
        <section id="wishes" className="bg-white dark:bg-slate-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden relative transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-32">
                <div className="text-center space-y-8 flex flex-col items-center">
                    <div className="bg-pink-500 p-8 border-4 border-black dark:border-white/20 rotate-2 shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] transition-all">
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-white">Guest Notes</h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-5 bg-zinc-50 dark:bg-slate-900 p-12 md:p-16 border-4 border-black dark:border-white/20 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 transition-all">
                        <div className="space-y-4 text-left">
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.5em] italic">Post your wish</p>
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Drop a Line!</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 group">
                            <div className="space-y-10">
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 italic">Name</label>
                                    <input
                                        required
                                        disabled={isNameLocked}
                                        placeholder="Your Awesome Name"
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-full px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#3b82f6] transition-all text-black dark:text-white placeholder:dark:text-slate-600"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 italic">Wish</label>
                                    <textarea
                                        required
                                        placeholder="Write something cool..."
                                        rows={4}
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-[2.5rem] px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#ec4899] transition-all resize-none text-black dark:text-white placeholder:dark:text-slate-600"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSending || postSuccess}
                                className={`w-full py-6 rounded-full font-black uppercase tracking-[0.5em] text-xs transition-all shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 group active:scale-95 ${postSuccess ? 'bg-green-500 text-white' : 'bg-black dark:bg-slate-800 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isSending ? "POSTING..." : postSuccess ? "POSTED!" : "SEND WISH"}
                                {!postSuccess && <Send size={18} className="group-hover:translate-x-1" />}
                                {postSuccess && <Check size={18} />}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-7 space-y-12">
                        <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-8 transition-colors">
                            <div className="flex items-center gap-4">
                                <Quote className="text-blue-600 h-10 w-10 rotate-180" strokeWidth={3} />
                                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-zinc-300">Archives — {wishes.length}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 border-4 border-black dark:border-white/20 rounded-2xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-blue-600 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.1)] dark:text-white"
                                >
                                    <MoveLeft size={28} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 border-4 border-black dark:border-white/20 rounded-2xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-blue-600 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.1)] dark:text-white"
                                >
                                    <MoveRight size={28} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-12">
                            {currentWishes.map((wish, idx) => (
                                <div key={wish.id} className={`p-10 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[12px_12px_0_#3b82f6] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] space-y-8 animate-reveal transition-all hover:-translate-y-2 ${idx % 2 === 0 ? 'rotate-1 hover:shadow-[12px_12px_0_#ec4899]' : '-rotate-1 hover:shadow-[12px_12px_0_#fbd38d]'} text-left`}>
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic">"{wish.message}"</p>
                                        <div className="pt-6 border-t-2 border-zinc-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xl font-black uppercase tracking-tight text-blue-600">{wish.name}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">
                                                    {new Date(wish.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <Smile className="text-pink-500 opacity-20 h-10 w-10" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main Theme Component ---

const VibrantTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`vibrant-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpened ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-50 pointer-events-none"}`}>
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

export default VibrantTheme;
