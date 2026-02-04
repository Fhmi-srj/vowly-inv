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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfbf7] overflow-hidden text-[#2d4a3e]">
            {/* Islamic Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Ornamental Frame */}
            <div className="absolute inset-8 md:inset-16 border border-[#2d4a3e]/10 pointer-events-none"></div>
            <div className="absolute inset-10 md:inset-20 border-2 border-[#c5a059]/20 pointer-events-none"></div>

            <div className="relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal">
                <div className="space-y-4">
                    <Star className="text-[#c5a059] mx-auto opacity-40" size={32} strokeWidth={1} />
                    <p className="tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#2d4a3e]/60">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059]">The Sacred Union of</p>
                    <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#2d4a3e]">
                        {config.couple.groom.name} <span className="font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2">&</span> {config.couple.bride.name}
                    </h1>
                </div>

                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent"></div>

                <div className="space-y-8 bg-white/50 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-[#2d4a3e]/5 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e]">
                            {guestName || "Tamu Undangan"}
                        </h2>
                    </div>

                    <button
                        onClick={onOpen}
                        className="group relative flex items-center gap-6 px-12 py-5 bg-[#2d4a3e] text-white font-bold uppercase text-[10px] tracking-[0.4em] rounded-full hover:bg-[#1e332a] transition-all shadow-xl active:scale-95"
                    >
                        Buka Undangan
                        <MoveRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#2d4a3e]/20 uppercase">Walimatul 'Ursy</p>
            </div>
        </div>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 transition-colors duration-1000 overflow-hidden px-8 py-20">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-fixed transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,#0c2c1e_0%,transparent_100%)] opacity-60 transition-colors duration-1000"></div>

            <div className="relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal">
                <div className="text-center space-y-6">
                    <div className="w-16 h-px bg-[#c5a059]/30 mx-auto"></div>
                    <p className="tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#c5a059] leading-relaxed">
                        Maha Suci Allah Yang Menciptakan Makhluk-Nya Berpasang-pasangan
                    </p>
                    <div className="w-16 h-px bg-[#c5a059]/30 mx-auto"></div>
                </div>

                <div className="text-center space-y-8">
                    <h1 className="text-[5.5rem] md:text-[13rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white/95 transition-colors duration-1000">
                        {config.couple.groom.name} <br />
                        <span className="text-4xl md:text-8xl font-sans not-italic text-[#c5a059] opacity-40">&</span> <br />
                        {config.couple.bride.name}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-10 text-center">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#2d4a3e]/40 dark:text-white/30 italic">— The Celebration —</p>
                        <p className="text-4xl md:text-7xl font-serif italic tracking-tight text-[#c5a059]">
                            {config.hero.date}
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-20 transition-opacity duration-1000">
                <div className="w-[1px] h-16 bg-[#2d4a3e] dark:bg-[#c5a059]"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.8em] [writing-mode:vertical-rl] rotate-180 dark:text-white/50">Discovery</span>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();

    return (
        <section id="couple" className="bg-white dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 text-[#2d4a3e] dark:text-white/90 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fdfbf7] dark:bg-[#0c2c1e] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 transition-colors duration-1000"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-32 space-y-10 animate-reveal">
                    <h2 className="text-5xl md:text-8xl font-serif italic tracking-tight leading-none dark:text-white transition-colors duration-1000">The Mempelai</h2>
                    <p className="text-sm md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed border-y border-[#2d4a3e]/5 dark:border-white/5 py-10 transition-colors duration-1000">
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." <br />
                        <span className="text-[#c5a059] mt-4 block text-xs md:text-sm font-bold uppercase tracking-widest">( QS. Ar-Rum: 21 )</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-24 md:gap-40 items-center">
                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700">
                            <div className="absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem]"></div>
                            <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative z-10">
                                <img src={config.couple.groom.image} className="w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100" alt={config.couple.groom.fullName} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]">The Groom</span>
                            <h3 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white">{config.couple.groom.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40">Putra Dari</p>
                                <p className="text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all">{config.couple.groom.parents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16 group flex flex-col items-center text-center">
                        <div className="relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700">
                            <div className="absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem]"></div>
                            <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative z-10">
                                <img src={config.couple.bride.image} className="w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100" alt={config.couple.bride.fullName} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]">The Bride</span>
                            <h3 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white">{config.couple.bride.fullName}</h3>
                            <div className="space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40">Putri Dari</p>
                                <p className="text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all">{config.couple.bride.parents}</p>
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
        <section id="story" className="bg-[#fdfbf7] dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] transition-opacity duration-1000"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent"></div>

            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white">The Hikayat</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic">Sekelumit Perjalanan Kasih</p>
                </div>

                <div className="relative space-y-20 max-w-4xl mx-auto">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent hidden md:block"></div>
                    {config.loveStory.map((story, idx) => (
                        <div key={idx} className={`relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
                                <div className="w-10 h-10 bg-white dark:bg-[#0c2c1e] rounded-full border border-[#2d4a3e]/5 dark:border-white/5 flex items-center justify-center shadow-sm">
                                    <Star size={12} className="text-[#c5a059]" />
                                </div>
                            </div>
                            <div className={`w-full md:w-1/2 group ${idx % 2 === 1 ? 'text-left' : 'md:text-right text-left'}`}>
                                <div className="p-12 md:p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 shadow-sm">
                                    <div className="space-y-4">
                                        <p className="text-4xl md:text-5xl font-serif italic tracking-tighter text-[#c5a059] leading-none">{story.date}</p>
                                        <h3 className="text-2xl md:text-3xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 leading-none">{story.title}</h3>
                                    </div>
                                    <p className="text-[#2d4a3e]/40 dark:text-white/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase mt-10">
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
        <section id="event" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl space-y-40 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 animate-reveal">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000">The Rangkaian</h2>
                    <p className="tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic">Acara Kebahagiaan</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {config.events.map((event, idx) => (
                        <div key={event.id} className="relative group p-12 md:p-20 flex flex-col items-center text-center bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] shadow-sm transition-all duration-700 hover:shadow-xl hover:border-[#c5a059]/20">
                            <div className="inline-block px-10 py-3 bg-[#fdfbf7] dark:bg-[#061a12] border border-[#c5a059]/20 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] mb-12">{event.title}</div>
                            <div className="space-y-12 w-full">
                                <div className="space-y-4">
                                    <p className="text-3xl md:text-5xl font-serif italic text-[#2d4a3e] dark:text-white">{event.day}, {event.date}</p>
                                    <div className="flex items-center justify-center gap-3 text-lg font-bold uppercase text-[#c5a059]"><Clock size={18} /><span>{event.startTime} — {event.endTime} WIB</span></div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl md:text-3xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80">{event.venue.name}</h4>
                                    <p className="text-xs md:text-sm text-[#2d4a3e]/40 dark:text-white/40 max-w-[320px] mx-auto leading-relaxed italic uppercase tracking-wider">{event.venue.address}</p>
                                </div>
                            </div>
                            <a href={event.venue.mapsEmbedUrl.replace('&output=embed', '')} target="_blank" className="mt-12 group/btn flex items-center gap-4 px-10 py-5 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-[10px] font-bold uppercase text-white shadow-md">Petunjuk Peta</a>
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
        <section id="gallery" className="bg-[#fefcf8] dark:bg-[#061a12] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Islamic Pattern Accent */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-all" style={{ backgroundImage: 'radial-gradient(#c5a059 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center space-y-6">
                        <p className="tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-[#c5a059]">Kisah Visual</p>
                        <h2 className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors">Archives</h2>
                        <div className="w-24 h-[1px] bg-[#c5a059] opacity-30"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-12 h-12 rounded-full bg-white dark:bg-[#0c2c1e]/60 border-2 border-[#c5a059]/20 dark:border-white/5 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-[#c5a059] scale-110 shadow-2xl z-20"
                                        : "border-transparent opacity-40 grayscale-[0.3] hover:opacity-100 hover:grayscale-0 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-12 h-12 rounded-full bg-white dark:bg-[#0c2c1e]/60 border-2 border-[#c5a059]/20 dark:border-white/5 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[4rem] sm:rounded-[6rem] overflow-hidden border border-[#c5a059]/20 dark:border-white/5 shadow-2xl group transition-all duration-1000">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, filter: "brightness(0.8) sepia(0.2)" }}
                                animate={{ opacity: 1, filter: "brightness(1) sepia(0)" }}
                                exit={{ opacity: 0, filter: "brightness(0.8) sepia(0.2)" }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                                alt="Featured Archives"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-[#2d4a3e]/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>

                        {/* Action Button */}
                        <div className="absolute bottom-12 right-12 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#c5a059]"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#fefcf8]/95 dark:bg-[#061a12]/98 backdrop-blur-2xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#c5a059] hover:rotate-90 transition-all duration-500 z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={40} className="sm:size-16" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-[#2d4a3e]/30 dark:text-white/30 hover:text-[#c5a059] transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={64} className="sm:size-[120px]" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative max-h-full max-w-full flex items-center justify-center"
                                >
                                    <img
                                        src={config.galleryImages[selectedImg]}
                                        className="max-h-[85vh] w-auto h-auto object-contain rounded-[3rem] sm:rounded-[6rem] shadow-2xl border border-[#c5a059]/10"
                                        alt="Fullscreen Archives"
                                    />

                                    <div className="absolute inset-x-0 -bottom-20 flex items-center justify-center gap-6">
                                        <div className="px-8 py-3 bg-white/40 dark:bg-[#0c2c1e]/40 backdrop-blur-xl rounded-full border border-[#c5a059]/20">
                                            <p className="font-serif italic text-2xl text-[#2d4a3e] dark:text-stone-300">
                                                Moment {selectedImg + 1} of {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-[#2d4a3e]/30 dark:text-white/30 hover:text-[#c5a059] transition-colors z-[2030]"
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
        <section id="gift" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h2 className="text-7xl md:text-[10rem] font-serif italic text-[#2d4a3e] dark:text-white">Kado Kasih</h2>
                    <p className="text-lg md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 leading-relaxed italic max-w-xl mx-auto">"Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {config.bankAccounts?.map((account, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 p-12 rounded-[4rem] shadow-sm space-y-12 transition-all duration-700 hover:shadow-2xl hover:border-[#c5a059]/20 group relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="space-y-6 text-left">
                                    <p className="text-[12px] font-bold uppercase text-[#c5a059] tracking-[0.4em] italic">{account.bank}</p>
                                    <h3 className="text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white font-black">{account.number}</h3>
                                    <p className="text-xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80">{account.name}</p>
                                </div>
                                <Landmark size={24} className="text-[#c5a059] opacity-40" />
                            </div>
                            <button onClick={() => copyToClipboard(account.number, `bank-${idx}`)} className="w-full py-6 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-white dark:text-[#061a12] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all shadow-xl active:scale-95">
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
        <section id="rsvp" className="bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-20 animate-reveal text-left">
                        <h2 className="text-7xl md:text-9xl font-serif italic text-[#2d4a3e] dark:text-white">Reservasi</h2>
                        {submitted ? (
                            <div className="p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] text-center shadow-sm">
                                <CheckCircle2 className="text-[#2d4a3e] dark:text-white h-24 w-24 mx-auto opacity-80" />
                                <h3 className="text-4xl font-serif italic text-[#2d4a3e] dark:text-white mt-8">Terima Kasih</h3>
                                <button onClick={() => setSubmitted(false)} className="text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold mt-8 uppercase">Kirim Ulang</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-16 text-left">
                                <input required placeholder="NAMA LENGKAP" className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30" value={formData.guest_name} onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })} />
                                <textarea rows={2} placeholder="PESAN SINGKAT..." className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />

                                <div className="flex items-center justify-between px-8 text-left">
                                    <label className="text-[10px] uppercase text-[#c5a059]">Pilih Sticker</label>
                                    <button type="button" onClick={() => setShowStickerPicker(true)} className="text-[#c5a059] transition-colors"><Smile size={24} /></button>
                                </div>
                                {formData.sticker && <div className="relative inline-block mt-2 ml-8 text-left"><img src={formData.sticker.src} alt="Selected Sticker" className="w-20 h-20 object-contain" /><button type="button" onClick={() => setFormData(p => ({ ...p, sticker: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
                                {showStickerPicker && <StickerPicker isOpen={showStickerPicker} selectedSticker={formData.sticker?.id || null} onSelect={(sticker) => { setFormData(p => ({ ...p, sticker })); setShowStickerPicker(false); }} onClose={() => setShowStickerPicker(false)} />}

                                <div className="grid grid-cols-2 gap-6">
                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                        <button key={status} type="button" onClick={() => setFormData({ ...formData, attendance: status })} className={`py-8 rounded-full font-bold uppercase tracking-widest text-[9px] border transition-all ${formData.attendance === status ? 'bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] border-[#2d4a3e] dark:border-[#c5a059] shadow-lg scale-105' : 'bg-white dark:bg-[#0c2c1e]/40 text-[#2d4a3e]/40 dark:text-white/30 border-[#2d4a3e]/5 dark:border-white/5 hover:border-[#c5a059]/30'}`}>{status.replace('TIDAK_HADIR', 'Insyaallah Berhalangan').replace('HADIR', 'Insyaallah Hadir')}</button>
                                    ))}
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-[#c5a059] text-white py-8 rounded-full font-bold uppercase text-[10px] transition-all hover:bg-[#b08b45] active:scale-95 shadow-xl">{isSubmitting ? "MENGIRIM..." : "KONFIRMASI KEHADIRAN"}</button>
                            </form>
                        )}
                    </div>
                    <div className="space-y-20 lg:pl-24 animate-reveal text-left">
                        <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
                            <p className="text-8xl font-serif italic text-[#2d4a3e]/40 dark:text-white/20">{rsvps.length}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">Tamu Terdaftar</p>
                        </div>
                        <div className="space-y-4">
                            {rsvps.slice(0, 5).map(rsvp => (
                                <div key={rsvp.id} className="p-10 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3.5rem] shadow-sm relative group hover:border-[#c5a059]/20 transition-all text-left">
                                    <div className="flex justify-between items-center text-left"><h4 className="text-3xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80">{rsvp.guest_name}</h4><Heart size={16} className={rsvp.attendance === AttendanceStatus.HADIR ? "text-[#c5a059] fill-[#c5a059]" : "text-[#2d4a3e]/10"} /></div>
                                    <p className="text-[#2d4a3e]/40 dark:text-white/40 text-sm font-medium italic mt-4">"{rsvp.message || "Barakallahu lakum wa baraka 'alaikum."}"</p>
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
        <section id="wishes" className="bg-white dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl relative z-10 space-y-40 text-left">
                <div className="grid lg:grid-cols-12 gap-24 items-start text-left">
                    <div className="lg:col-span-5 space-y-20 animate-reveal text-left">
                        <h2 className="text-7xl md:text-8xl font-serif italic text-[#2d4a3e] dark:text-white">Doa & Restu</h2>
                        <form onSubmit={handleSubmit} className="space-y-12 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 p-12 md:p-16 rounded-[4rem] border border-[#2d4a3e]/5 dark:border-white/5 shadow-sm text-left transition-all hover:shadow-xl">
                            <input required placeholder="NAMA ANDA" className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-6 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30" value={name} onChange={(e) => setName(e.target.value)} />
                            <textarea required placeholder="DOA TERBAIK ANDA..." rows={4} className="w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="w-full bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] py-8 rounded-full font-bold uppercase text-[10px] transition-all hover:bg-[#1e332a] active:scale-95 shadow-xl">KIRIM DOA RESTU</button>
                        </form>
                    </div>
                    <div className="lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left">
                        <div className="flex items-center gap-6 border-b border-[#2d4a3e]/5 dark:border-white/5 pb-12 text-left"><Quote size={40} className="text-[#c5a059] opacity-40" /><p className="text-[11px] font-bold uppercase tracking-[0.8em] text-[#2d4a3e]/20 dark:text-white/20">GUESTBOOK ARCHIVE</p></div>
                        <div className="grid grid-cols-1 gap-12 text-left">
                            {wishes.slice(0, 4).map(wish => (
                                <div key={wish.id} className="relative space-y-10 group text-left">
                                    <p className="text-4xl md:text-5xl font-serif italic text-[#2d4a3e]/90 dark:text-white/90 group-hover:text-[#2d4a3e] dark:group-hover:text-white transition-colors">"{wish.message}"</p>
                                    <div className="flex items-center gap-10 text-left"><div className="h-px w-20 bg-[#c5a059]/30"></div><p className="text-2xl font-serif italic text-[#2d4a3e]/70 dark:text-white/70">{wish.name}</p></div>
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
    const navItems = [{ icon: Home, label: "Awal", href: "#hero" }, { icon: Heart, label: "Mempelai", href: "#couple" }, { icon: Star, label: "Kisah", href: "#story" }, { icon: Calendar, label: "Agenda", href: "#event" }, { icon: Camera, label: "Galeri", href: "#gallery" }, { icon: Gift, label: "Kado", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75 pointer-events-none'}`}>
            <div className="bg-white/80 backdrop-blur-2xl border border-[#2d4a3e]/5 px-10 py-6 rounded-full shadow-2xl flex items-center gap-8 md:gap-12">
                {navItems.map((item, idx) => (<a key={idx} href={item.href} className="group relative text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all"><item.icon size={20} /><span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all bg-[#2d4a3e] text-white text-[9px] font-black px-5 py-3 rounded-full hidden group-hover:block whitespace-nowrap">{item.label}</span></a>))}
                <button onClick={toggleTheme} className="text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all">{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}</button>
            </div>
        </nav>
    );
};

const IslamicTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => { document.body.style.overflow = isOpened ? "auto" : "hidden"; }, [isOpened]);
    return (
        <div className={`islamic-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}
            <main className={`transition-all duration-1000 ${isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`}>
                <Hero /><CoupleProfile /><LoveStory /><EventDetails /><Gallery /><GiftInfo /><RSVPForm /><Wishes />
            </main>
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4"><MusicController /><AutoScrollController isOpened={isOpened} /></div>
            <Navbar theme={theme} toggleTheme={toggleTheme} /><MusicPlayer /><InstallPrompt />
        </div>
    );
};

export default IslamicTheme;
