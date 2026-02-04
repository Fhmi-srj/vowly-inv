import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FC } from "react";
import {
    Heart,
    Mail,
    Calendar,
    Clock,
    MapPin,
    Map,
    Camera,
    Sparkles,
    Gift,
    Copy,
    Check,
    Landmark,
    Home,
    MessageCircle,
    Sun,
    Moon,
    Send,
    CheckCircle2,
    Users,
    ChevronLeft,
    ChevronRight,
    Star,
    ExternalLink,
    Smile,
    X,
    Quote,
    CalendarPlus,
    Plus,
    Minus,
    Maximize2,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { dbService } from "../services/dbService";
import { generateGoogleCalendarUrl, downloadICS } from "../utils/calendarUtils";
import { AttendanceStatus, type RSVP, type Wish } from "../types";
import { MAX_GUESTS } from "../constants";
import React from "react";

// Shared Components
import MusicPlayer from "./Shared/MusicPlayer";
import MusicController from "./Shared/MusicController";
import AutoScrollController from "./Shared/AutoScrollController";
import InstallPrompt from "./Shared/InstallPrompt";

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
    const [guestName, setGuestName] = useState<string>("");
    const [isExiting, setIsExiting] = useState(false);
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) setGuestName(to);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
    }, []);

    const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
    const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

    const handleOpenClick = () => {
        setIsExiting(true);
        setTimeout(() => {
            onOpen();
        }, 800);
    };

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fffafa] overflow-hidden"
                >
                    {/* Soft Pink Watercolor Splashes */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ffe4e1] opacity-30 rounded-full blur-[100px] animate-pulse-soft"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#fdf5e6] opacity-30 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
                        }}
                        className="relative w-full max-w-lg px-8 text-center space-y-12"
                    >
                        <div className="space-y-4">
                            <p className="tracking-[0.6em] text-[10px] font-bold text-[#db7093] uppercase">Dear Beloved Guests</p>
                            <h1 className="font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight">
                                {firstName} <span className="text-[#db7093]">&</span> {secondName}
                            </h1>
                        </div>

                        <div className="relative py-12 px-8">
                            {/* Decorative Border */}
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent"></div>

                            <div className="space-y-6">
                                <p className="text-sm font-medium text-[#db7093] italic">Yth. Bapak/Ibu/Saudara/i</p>
                                <h2 className="font-serif text-3xl md:text-4xl text-[#4a4a4a] font-bold">
                                    {guestName || "Tamu Undangan"}
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenClick}
                            className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#db7093] text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#db7093]/20"
                        >
                            <span className="relative z-10 font-bold tracking-widest text-[11px] uppercase">Open Invitation</span>
                            <Heart className="relative z-10 h-4 w-4 fill-white" />
                            <div className="absolute inset-0 bg-[#c71585] rounded-full scale-0 transition-transform group-hover:scale-100 origin-center"></div>
                        </button>

                        <p className="text-[10px] tracking-widest text-[#db7093] uppercase opacity-60">We are getting married!</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Hero: FC = () => {
    const { config } = useSettings();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [guestName, setGuestName] = useState<string | null>(null);
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setGuestName(params.get("to"));
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");

        const timer = setInterval(() => {
            const targetDateStr = config.hero.heroDateRaw;
            if (!targetDateStr) return;

            const target = new Date(targetDateStr).getTime();
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [config.hero.heroDateRaw]);

    const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
    const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fffafa] dark:bg-slate-950 transition-colors duration-1000">
            {/* Background Image with Watercolor Bloom effect */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    src={config.hero.image}
                    className="w-full h-full object-cover opacity-20 dark:opacity-10"
                    alt="Floral Wedding Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fffafa]/80 via-[#fffafa]/40 to-[#fffafa] dark:from-slate-950/90 dark:via-slate-950/60 dark:to-slate-950"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 space-y-16">
                <Reveal delay={0.2}>
                    <div className="space-y-6">
                        <p className="tracking-[0.8em] text-[10px] md:text-xs font-black text-[#db7093] dark:text-[#ff8da1] uppercase">Save the Date</p>
                        <h1 className="font-serif text-7xl md:text-9xl text-[#4a4a4a] dark:text-stone-100 italic leading-none transition-colors">
                            {firstName} <span className="text-[#db7093] dark:text-[#ff8da1] not-italic">&</span> {secondName}
                        </h1>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {Object.entries(timeLeft).map(([label, value], i) => (
                            <div key={label} className="group relative">
                                <div className="absolute -inset-4 bg-[#ffd1dc]/20 dark:bg-white/5 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform"></div>
                                <div className="relative text-center min-w-[80px]">
                                    <p className="font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 transition-colors">{value}</p>
                                    <p className="text-[9px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>

                <Reveal delay={0.6}>
                    <div className="space-y-4">
                        <p className="font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-300 italic transition-colors">
                            {config.hero.date}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-[#db7093] dark:text-[#ff8da1]">
                            <div className="h-[1px] w-12 bg-current opacity-30"></div>
                            <p className="text-xs font-bold tracking-[0.4em] uppercase">{config.hero.city}</p>
                            <div className="h-[1px] w-12 bg-current opacity-30"></div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config } = useSettings();
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
    }, []);

    const firstCouple = side === "wanita" ? config.couple.bride : config.couple.groom;
    const secondCouple = side === "wanita" ? config.couple.groom : config.couple.bride;

    return (
        <section id="couple" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Soft Floral Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fffafa]/50 dark:bg-slate-900/20 rotate-45 opacity-50 pointer-events-none transition-colors">
                <img src="https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-5xl space-y-24 relative z-10">
                <div className="text-center space-y-8 max-w-3xl mx-auto">
                    <Reveal>
                        <div className="space-y-6">
                            <Heart className="text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto animate-pulse fill-[#db7093] dark:fill-[#ff8da1] opacity-20 transition-colors" />
                            <p className="font-serif text-lg md:text-xl text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase mb-4">The Holy Matrimony</p>
                            <h3 className="font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed transition-colors">
                                "And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them, and He has put love and mercy between your (hearts): verily in that are Signs for those who reflect."
                            </h3>
                            <p className="text-[10px] tracking-[0.4em] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">— QS. AR-RUM: 21 —</p>
                        </div>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-2 gap-20 items-center">
                    {/* First Couple */}
                    <Reveal delay={0.2}>
                        <div className="space-y-10 text-center group">
                            <div className="relative inline-block mx-auto">
                                <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                                <div className="relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl overflow-hidden">
                                    <img
                                        src={firstCouple.image}
                                        className="w-full h-full object-cover rounded-full saturate-[0.8] hover:scale-105 transition-transform duration-1000"
                                        alt={firstCouple.fullName}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-100 italic transition-colors">
                                    {firstCouple.fullName}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">Putra Kedua Dari:</p>
                                    <p className="text-slate-400 dark:text-stone-400 italic text-sm transition-colors">{firstCouple.parents}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Second Couple */}
                    <Reveal delay={0.4}>
                        <div className="space-y-10 text-center group">
                            <div className="relative inline-block mx-auto">
                                <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                                <div className="relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl overflow-hidden">
                                    <img
                                        src={secondCouple.image}
                                        className="w-full h-full object-cover rounded-full saturate-[0.8] hover:scale-105 transition-transform duration-1000"
                                        alt={secondCouple.fullName}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-100 italic transition-colors">
                                    {secondCouple.fullName}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">Putri Pertama Dari:</p>
                                    <p className="text-slate-400 dark:text-stone-400 italic text-sm transition-colors">{secondCouple.parents}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

const LoveStory: FC = () => {
    const { config } = useSettings();

    return (
        <section id="story" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Watercolor Accents */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white dark:from-slate-900 to-transparent transition-colors"></div>
            <div className="absolute -left-32 top-1/2 w-96 h-96 bg-[#ffd1dc] opacity-10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto max-w-5xl space-y-32 relative z-10">
                <div className="text-center space-y-6">
                    <Star className="text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" />
                    <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Our Love Story</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#db7093] opacity-30"></div>
                        <p className="tracking-[0.6em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">A Beautiful Journey</p>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#db7093] dark:to-[#ff8da1] opacity-30 transition-colors"></div>
                    </div>
                </div>

                <div className="space-y-24 relative before:absolute before:inset-y-0 before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#db7093]/20 before:to-transparent">
                    {config.loveStory.map((story, idx) => (
                        <Reveal key={idx} delay={idx * 0.1}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 items-center relative">
                                {/* Elegant Center Icon */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-[#db7093] dark:border-[#ff8da1] shadow-lg shadow-[#db7093]/20"></div>
                                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#db7093]/30 to-transparent"></div>
                                </div>

                                <div className={`pl-20 md:pl-0 ${idx % 2 === 1 ? 'md:col-start-2 md:text-left' : 'md:col-start-1 md:text-right'} text-left`}>
                                    <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-[#ffd1dc]/10 shadow-2xl transition-all hover:-translate-y-2 duration-1000">
                                        <div className="space-y-1">
                                            <p className="font-serif text-3xl md:text-4xl text-[#db7093] dark:text-[#ff8da1] italic tracking-tight transition-colors">{story.date}</p>
                                            <h3 className="font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors">{story.title}</h3>
                                        </div>
                                        <div className={`w-12 h-0.5 bg-[#db7093] opacity-20 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                        <p className="text-slate-400 dark:text-stone-400 font-serif text-lg md:text-xl italic leading-relaxed transition-colors">
                                            {story.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <div className="text-center pt-20">
                    <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-900 px-10 py-6 rounded-full border border-[#ffd1dc]/20 dark:border-white/5 shadow-xl transition-all">
                        <Heart className="text-[#db7093] dark:text-[#ff8da1] h-6 w-6 fill-[#db7093] dark:fill-[#ff8da1] animate-pulse transition-colors" />
                        <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">To be continued...</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState<string | null>(null);

    const copyAddress = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section id="event" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative transition-colors duration-1000">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-slate-900 to-transparent opacity-50 transition-colors"></div>

            <div className="container mx-auto max-w-6xl space-y-24 relative z-10">
                <div className="text-center space-y-4">
                    <Reveal>
                        <div className="space-y-4">
                            <Sparkles className="text-[#db7093] h-6 w-6 mx-auto opacity-40 animate-pulse" />
                            <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">The Wedding Event</h2>
                            <p className="tracking-[0.5em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Blessing & Reception</p>
                        </div>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {config.events.map((event, idx) => (
                        <Reveal key={event.id} delay={idx * 0.2}>
                            <div className="group relative">
                                {/* Floral Card Background */}
                                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl transition-all group-hover:shadow-[#ffd1dc]/40 group-hover:-translate-y-2 duration-1000 overflow-hidden border border-[#ffd1dc]/20 dark:border-white/5">
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd1dc] opacity-10 rounded-full blur-[50px]"></div>
                                </div>

                                <div className="relative p-12 md:p-20 space-y-12 text-center">
                                    <div className="space-y-4">
                                        <p className="text-xs font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.4em] uppercase transition-colors">{idx === 0 ? "Holy Matrimony" : "Grand Reception"}</p>
                                        <h3 className="font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">{event.title}</h3>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <Calendar className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                            <p className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-none transition-colors">{event.day}, {event.date}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <Clock className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                            <p className="text-[12px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.2em] uppercase transition-colors">
                                                {event.startTime} — {event.endTime} WIB
                                            </p>
                                        </div>

                                        <div className="pt-10 border-t border-[#ffd1dc]/30 dark:border-white/5 space-y-4 transition-colors">
                                            <MapPin className="text-[#db7093] h-6 w-6 mx-auto opacity-40" />
                                            <h4 className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">{event.venue.name}</h4>
                                            <p className="text-sm text-slate-400 dark:text-stone-400 max-w-[250px] mx-auto italic leading-relaxed transition-colors">{event.venue.address}</p>
                                        </div>
                                    </div>

                                    {/* Interactive Map Embed */}
                                    <div className="rounded-[2.5rem] overflow-hidden border border-[#ffd1dc]/20 dark:border-white/5 h-64 relative group/map">
                                        <iframe
                                            src={event.venue.mapsEmbedUrl}
                                            className="w-full h-full grayscale-[0.5] contrast-[0.8] brightness-[1.1] group-hover/map:grayscale-0 group-hover/map:contrast-100 transition-all duration-1000"
                                            loading="lazy"
                                        ></iframe>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowCalendar(showCalendar === event.id ? null : event.id)}
                                                className="w-full py-5 px-4 bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 text-[#db7093] dark:text-[#ff8da1] rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#db7093] hover:text-white transition-all active:scale-95"
                                            >
                                                <CalendarPlus size={14} /> Save Date
                                            </button>

                                            <AnimatePresence>
                                                {showCalendar === event.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 right-0 mb-4 bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[50]"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                window.open(generateGoogleCalendarUrl({
                                                                    title: event.title,
                                                                    description: `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}`,
                                                                    location: `${event.venue.name}, ${event.venue.address}`,
                                                                    startTime: event.startDateTime,
                                                                    endTime: event.endDateTime,
                                                                }), '_blank');
                                                                setShowCalendar(null);
                                                            }}
                                                            className="w-full p-6 text-left hover:bg-[#fffafa] dark:hover:bg-white/5 flex items-center gap-4 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-[#db7093]/10 flex items-center justify-center">
                                                                <Star size={14} className="text-[#db7093]" />
                                                            </div>
                                                            <span className="text-[10px] font-black tracking-widest uppercase">Google Calendar</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                downloadICS({
                                                                    title: event.title,
                                                                    description: `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}`,
                                                                    location: `${event.venue.name}, ${event.venue.address}`,
                                                                    startTime: event.startDateTime,
                                                                    endTime: event.endDateTime,
                                                                });
                                                                setShowCalendar(null);
                                                            }}
                                                            className="w-full p-6 text-left hover:bg-[#fffafa] dark:hover:bg-white/5 flex items-center gap-4 border-t border-[#ffd1dc]/10 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-[#db7093]/10 flex items-center justify-center">
                                                                <Clock size={14} className="text-[#db7093]" />
                                                            </div>
                                                            <span className="text-[10px] font-black tracking-widest uppercase">iCal / Outlook</span>
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <button
                                            onClick={() => copyAddress(event.venue.address, event.id)}
                                            className="w-full py-5 px-4 bg-[#db7093] text-white rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 active:scale-95"
                                        >
                                            {copiedId === event.id ? (
                                                <><Check size={14} /> COPIED</>
                                            ) : (
                                                <><Copy size={14} /> COPY ADDRESS</>
                                            )}
                                        </button>
                                    </div>

                                    <a
                                        href={event.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all hover:shadow-2xl active:scale-95"
                                    >
                                        <Map size={18} /> OPEN IN GOOGLE MAPS
                                    </a>
                                </div>
                            </div>
                        </Reveal>
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
        <section id="gallery" className="bg-[#fffafa] dark:bg-slate-950 py-24 sm:py-32 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd1dc]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#db7093]/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-16 relative z-10">
                <Reveal>
                    <div className="text-center space-y-6">
                        <Heart className="text-[#db7093] h-8 w-8 mx-auto opacity-20 animate-pulse" />
                        <h2 className="font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Sweet Memories</h2>
                        <p className="tracking-[0.6em] text-[10px] sm:text-xs font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Our Journey Captured</p>
                        <div className="w-24 h-[1px] bg-[#ffd1dc] mx-auto opacity-50"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-3 sm:gap-6 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-[#db7093] scale-110 shadow-xl z-20"
                                        : "border-transparent opacity-40 grayscale hover:opacity-100 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Image Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-[#ffd1dc]/30 dark:border-white/5 shadow-2xl group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                                alt="Featured Moment"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-[#db7093]/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>

                        {/* Action Button */}
                        <div className="absolute bottom-8 right-8 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#db7093]/80"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#fffafa]/90 dark:bg-slate-950/95 backdrop-blur-xl p-4 sm:p-10"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#db7093] dark:text-white/50 hover:scale-110 transition-all z-[2030]"
                            onClick={closeLightbox}
                        >
                            <X size={32} className="sm:size-12" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-[#db7093] dark:text-white/30 hover:text-[#db7093] dark:hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={48} className="sm:size-20" strokeWidth={1} />
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
                                        className="max-h-[80vh] w-auto h-auto object-contain rounded-3xl sm:rounded-[4rem] shadow-2xl border border-[#ffd1dc]/20"
                                        alt="Full Moment"
                                    />

                                    <div className="absolute inset-x-0 -bottom-16 flex items-center justify-center gap-4">
                                        <div className="bg-[#db7093]/10 dark:bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-[#db7093]/20 dark:border-white/10">
                                            <p className="font-serif italic text-[#db7093] dark:text-stone-300">
                                                Moment {selectedImg + 1} of {config.galleryImages.length}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-[#db7093] dark:text-white/30 hover:text-[#db7093] dark:hover:text-white transition-colors z-[2030]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={48} className="sm:size-20" strokeWidth={1} />
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
        <section id="gift" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Soft Background Decor */}
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#db7093 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto max-w-4xl space-y-24 relative z-10">
                <div className="text-center space-y-6">
                    <Reveal>
                        <div className="space-y-6 text-center">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-[#ffd1dc] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <Gift className="text-[#db7093] h-14 w-14 relative z-10 mx-auto" />
                            </div>
                            <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Digital Envelope</h2>
                            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#db7093] to-transparent mx-auto opacity-30"></div>
                            <p className="max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl leading-relaxed transition-colors">
                                "Your presence is enough for us, but if you wish to give a gift, we provide the digital envelope below."
                            </p>
                        </div>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <Reveal key={idx} delay={idx * 0.2}>
                            <div className="h-full bg-white dark:bg-slate-900 border border-[#ffd1dc]/40 dark:border-white/5 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-center text-center space-y-10 group hover:shadow-[#ffd1dc]/30 dark:hover:shadow-white/5 transition-all duration-1000">
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-[#fffafa] dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all shadow-inner">
                                        <Landmark className="text-[#db7093] h-8 w-8" />
                                    </div>
                                    <p className="text-[10px] font-black text-[#db7093] tracking-[0.4em] uppercase">{account.bank}</p>
                                    <h3 className="font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">{account.number}</h3>
                                    <p className="text-sm text-slate-400 dark:text-stone-400 italic transition-colors">a.n {account.name}</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                    className="group relative inline-flex items-center justify-center gap-3 py-5 bg-[#db7093] text-white rounded-full text-[11px] font-black tracking-widest uppercase transition-all hover:pr-14 hover:shadow-xl active:scale-95 shadow-lg shadow-[#db7093]/20"
                                >
                                    {copiedId === `bank-${idx}` ? (
                                        <><Check size={14} strokeWidth={3} /> Copied!</>
                                    ) : (
                                        <><Copy size={14} /> Copy Number</>
                                    )}
                                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all">
                                        <ExternalLink size={12} />
                                    </div>
                                </button>
                            </div>
                        </Reveal>
                    ))}

                    {config.giftAddress && (
                        <Reveal delay={0.4}>
                            <div className="h-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-white/10 dark:border-black/5 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-center text-center space-y-10 group hover:shadow-2xl transition-all duration-1000">
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-white/10 dark:bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all shadow-inner">
                                        <Home className="text-[#db7093] h-8 w-8" />
                                    </div>
                                    <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Physical Gift Address</p>
                                    <h3 className="font-serif text-2xl font-bold leading-snug">{config.couple.bride.name} & {config.couple.groom.name}</h3>
                                    <p className="text-sm opacity-60 max-w-[250px] mx-auto italic leading-relaxed">{config.giftAddress}</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(config.giftAddress, 'physical')}
                                    className="group relative inline-flex items-center justify-center gap-3 py-5 bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-full text-[11px] font-black tracking-widest uppercase transition-all hover:pr-14 hover:shadow-xl active:scale-95"
                                >
                                    {copiedId === 'physical' ? (
                                        <><Check size={14} strokeWidth={3} /> Address Copied!</>
                                    ) : (
                                        <><Copy size={14} /> Copy Address</>
                                    )}
                                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all">
                                        <ExternalLink size={12} />
                                    </div>
                                </button>
                            </div>
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const navItems = [
        { id: "hero", icon: Home, label: "Home" },
        { id: "couple", icon: Heart, label: "Couple" },
        { id: "event", icon: Calendar, label: "Event" },
        { id: "gallery", icon: Camera, label: "Gallery" },
        { id: "gift", icon: Gift, label: "Gift" },
        { id: "rsvp", icon: MessageCircle, label: "RSVP" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 400);

            const sections = navItems.map((item) => item.id);
            for (const sectionId of sections.reverse()) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[1100] transition-all duration-1000 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 py-3 rounded-full border border-[#ffd1dc]/40 dark:border-white/10 shadow-2xl flex items-center gap-2 md:gap-6">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.id);
                            }}
                            className={`group relative flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive ? 'text-[#db7093] scale-110' : 'text-slate-400 dark:text-stone-500 hover:text-[#db7093]'}`}
                        >
                            <Icon size={18} className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:-translate-y-1'}`} />
                            <span className="text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-[#db7093] text-white px-3 py-2 rounded-full whitespace-nowrap shadow-lg pointer-events-none">
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div layoutId="nav-active" className="absolute -bottom-1 w-1 h-1 bg-[#db7093] rounded-full" />
                            )}
                        </a>
                    );
                })}

                <div className="w-[1px] h-6 bg-[#ffd1dc]/40 dark:bg-white/10 mx-1 md:mx-2"></div>

                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 p-2 text-slate-400 dark:text-stone-500 hover:text-[#db7093] transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    <span className="text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-[#db7093] text-white px-3 py-2 rounded-full whitespace-nowrap shadow-lg pointer-events-none">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

const Footer: FC = () => {
    const { config, text } = useSettings();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const footerDate = (() => {
        const firstEvent = config.events[0];
        if (!firstEvent) return "";
        const d = firstEvent.startDateTime;
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    })();

    return (
        <footer className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000 border-t border-[#ffd1dc]/20">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#db7093 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center text-center space-y-20">
                <button
                    onClick={scrollToTop}
                    className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
                >
                    <div className="w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] group-hover:bg-[#db7093] group-hover:text-white transition-all shadow-xl shadow-[#ffd1dc]/20">
                        <ChevronLeft className="rotate-90" size={24} />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.4em] text-[#db7093] uppercase opacity-40 group-hover:opacity-100">Back to Top</span>
                </button>

                <div className="space-y-8">
                    <Reveal>
                        <div className="space-y-8">
                            <Heart className="text-[#db7093] h-10 w-10 mx-auto fill-[#db7093] opacity-20 animate-pulse" />
                            <h2 className="font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-[0.8] transition-colors">
                                {config.couple.groom.name.split(' ')[0]} <span className="text-[#db7093]/30">&</span> {config.couple.bride.name.split(' ')[0]}
                            </h2>
                            <div className="flex items-center justify-center gap-6">
                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#ffd1dc]"></div>
                                <p className="text-[14px] font-black tracking-[0.6em] text-[#db7093] uppercase italic">{footerDate}</p>
                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#ffd1dc]"></div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="space-y-12 max-w-2xl">
                    <Reveal>
                        <div className="space-y-8 p-12 bg-[#fffafa]/50 dark:bg-slate-900/50 rounded-[3rem] border border-[#ffd1dc]/10 backdrop-blur-sm">
                            <Quote className="text-[#db7093] h-12 w-12 opacity-[0.05] mx-auto -mb-16 rotate-180" />
                            <p className="font-serif text-xl md:text-2xl text-slate-400 dark:text-stone-400 italic leading-relaxed transition-colors">
                                "{text.closing.text}"
                            </p>
                            <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold">
                                {text.closing.salam}
                            </p>
                        </div>
                    </Reveal>

                    <div className="pt-12 border-t border-[#ffd1dc]/20 space-y-4">
                        <p className="text-[10px] font-black tracking-[0.4em] text-[#db7093] uppercase italic">{text.closing.signature}</p>
                        <p className="font-serif text-lg text-slate-400 italic">Kami yang berbahagia,</p>
                        <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors">
                            Keluarga Besar {config.couple.groom.name} & {config.couple.bride.name}
                        </p>
                        {config.closingFamily && (
                            <p className="text-xs text-slate-300 italic max-w-sm mx-auto mt-6">{config.closingFamily}</p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

const RSVPForm: FC = () => {
    const { invitationId, config } = useSettings();
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
    const [step, setStep] = useState(1);

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
        tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR).length,
    };

    const currentRSVPs = useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        const sorted = [...rsvps].sort(
            (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        return sorted.slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    const formSteps = [
        { title: "Introduction", icon: Mail },
        { title: "Attendance", icon: CheckCircle2 },
        { title: "Personal Note", icon: MessageCircle }
    ];

    return (
        <section id="rsvp" className="bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd1dc] opacity-20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffe4e1] opacity-20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-12 text-center mb-16">
                        <Reveal>
                            <div className="space-y-4">
                                <Heart className="text-[#db7093] h-10 w-10 mx-auto opacity-20" />
                                <h2 className="font-serif text-5xl md:text-8xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">RSVP & Wishes</h2>
                                <p className="tracking-[0.6em] text-[10px] font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors">Join our celebration</p>
                            </div>
                        </Reveal>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <Reveal>
                            <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-14 relative overflow-hidden transition-all duration-1000 min-h-[600px] flex flex-col justify-between">
                                {submitted ? (
                                    <div className="text-center py-20 space-y-8 animate-reveal flex flex-col items-center justify-center flex-grow">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#db7093]/20 rounded-full blur-2xl animate-pulse"></div>
                                            <CheckCircle2 className="text-[#db7093] h-24 w-24 relative z-10" />
                                        </div>
                                        <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">See You There!</h3>
                                        <p className="text-slate-400 dark:text-stone-400 italic text-xl transition-colors">Your presence will make our day complete.</p>
                                        <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-[#db7093] text-white rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20">SEND ANOTHER RESPONSE</button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Step Indicator */}
                                        <div className="flex items-center justify-between px-4 pb-10 border-b border-[#ffd1dc]/20">
                                            {formSteps.map((s, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step > i + 1 ? 'bg-[#db7093] text-white' : step === i + 1 ? 'bg-[#db7093] text-white shadow-lg scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                                                        {step > i + 1 ? <Check size={16} strokeWidth={3} /> : <s.icon size={16} />}
                                                    </div>
                                                    {i < 2 && <div className={`w-8 h-[1px] ${step > i + 1 ? 'bg-[#db7093]' : 'bg-slate-200'}`}></div>}
                                                </div>
                                            ))}
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-10 flex-grow pt-10">
                                            <AnimatePresence mode="wait">
                                                {step === 1 && (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="space-y-8"
                                                    >
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Your Name</label>
                                                            <input
                                                                required
                                                                disabled={isNameLocked}
                                                                placeholder="Type your name..."
                                                                className="w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-full px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#db7093]/20 outline-none transition-all"
                                                                value={formData.guest_name}
                                                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Phone Number (Optional)</label>
                                                            <input
                                                                placeholder="0812..."
                                                                className="w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-full px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#db7093]/20 outline-none transition-all"
                                                                value={formData.phone}
                                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {step === 2 && (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="space-y-12"
                                                    >
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Will you attend?</label>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map(status => (
                                                                    <button
                                                                        key={status}
                                                                        type="button"
                                                                        onClick={() => setFormData({ ...formData, attendance: status })}
                                                                        className={`py-6 rounded-3xl border text-[10px] font-black tracking-widest uppercase transition-all ${formData.attendance === status ? 'bg-[#db7093] border-[#db7093] text-white shadow-xl shadow-[#db7093]/20 scale-[1.02]' : 'bg-white dark:bg-slate-800 border-[#ffd1dc]/20 text-[#db7093]'}`}
                                                                    >
                                                                        {status === AttendanceStatus.HADIR ? "YES, I WILL" : "NO, I CAN'T"}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {formData.attendance === AttendanceStatus.HADIR && (
                                                            <div className="space-y-6">
                                                                <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase flex items-center justify-between">
                                                                    Guest Count <span>{formData.guest_count} Person</span>
                                                                </label>
                                                                <div className="flex items-center gap-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData(prev => ({ ...prev, guest_count: Math.max(1, prev.guest_count - 1) }))}
                                                                        className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all"
                                                                    >
                                                                        <Minus size={20} />
                                                                    </button>
                                                                    <div className="flex-grow h-2 bg-[#ffd1dc]/30 rounded-full relative overflow-hidden">
                                                                        <motion.div
                                                                            className="absolute left-0 top-0 bottom-0 bg-[#db7093]"
                                                                            animate={{ width: `${(formData.guest_count / config.maxGuests) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData(prev => ({ ...prev, guest_count: Math.min(config.maxGuests, prev.guest_count + 1) }))}
                                                                        className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all"
                                                                    >
                                                                        <Plus size={20} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {step === 3 && (
                                                    <motion.div
                                                        key="step3"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="space-y-8"
                                                    >
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase italic">Add a Sticker</label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowStickerPicker(true)}
                                                                    className="text-[#db7093] hover:rotate-12 transition-transform"
                                                                >
                                                                    <Smile size={24} />
                                                                </button>
                                                            </div>
                                                            {formData.sticker ? (
                                                                <div className="relative inline-block group">
                                                                    <img src={formData.sticker.src} className="w-24 h-24 object-contain animate-bounce-slow" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData({ ...formData, sticker: null })}
                                                                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onClick={() => setShowStickerPicker(true)}
                                                                    className="w-full h-32 border-2 border-dashed border-[#ffd1dc] rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-300 cursor-pointer hover:border-[#db7093] hover:text-[#db7093] transition-all"
                                                                >
                                                                    <Smile size={32} />
                                                                    <span className="text-[10px] font-black tracking-widest uppercase">Pick a Sticker</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-[#db7093] tracking-widest uppercase">Message</label>
                                                            <textarea
                                                                rows={4}
                                                                placeholder="Write a beautiful message..."
                                                                className="w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none focus:ring-4 focus:ring-[#db7093]/20 transition-all resize-none"
                                                                value={formData.message}
                                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="flex gap-4 pt-10">
                                                {step > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(step - 1)}
                                                        className="w-20 py-2 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] hover:bg-slate-50 active:scale-95 transition-all"
                                                    >
                                                        <ChevronLeft size={24} />
                                                    </button>
                                                )}
                                                {step < 3 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(step + 1)}
                                                        disabled={step === 1 && !formData.guest_name}
                                                        className="flex-grow bg-[#db7093] text-white py-6 rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 disabled:opacity-30 flex items-center justify-center gap-4 active:scale-95"
                                                    >
                                                        NEXT STEP <ChevronRight size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-grow bg-[#db7093] text-white py-6 rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 flex items-center justify-center gap-4 active:scale-95"
                                                    >
                                                        {isSubmitting ? "SENDING..." : "CONFIRM RSVP"}
                                                        <Send size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </Reveal>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid grid-cols-3 gap-4 md:gap-8">
                            {[
                                { label: "Attending", count: stats.hadir, color: "text-[#db7093]", bg: "bg-white" },
                                { label: "Unsure", count: stats.ragu, color: "text-slate-400", bg: "bg-white/50" },
                                { label: "Absent", count: stats.tidak, color: "text-[#ffd1dc]", bg: "bg-white/30" }
                            ].map((stat, i) => (
                                <Reveal key={i} delay={i * 0.1}>
                                    <div className={`${stat.bg} dark:bg-slate-900 border border-[#ffd1dc]/20 dark:border-white/5 p-8 rounded-[3rem] text-center space-y-2 shadow-xl hover:-translate-y-2 transition-all duration-500`}>
                                        <p className={`font-serif text-4xl md:text-6xl font-bold ${stat.color}`}>{stat.count}</p>
                                        <p className="text-[9px] font-black tracking-widest text-[#db7093] uppercase italic">{stat.label}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-6">
                                {currentRSVPs.map((rsvp, idx) => (
                                    <Reveal key={rsvp.id} delay={idx * 0.05}>
                                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg group hover:shadow-2xl transition-all duration-500 min-h-[160px] flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic leading-none">{rsvp.guest_name}</p>
                                                        <p className="text-[10px] font-black tracking-widest text-[#db7093] uppercase opacity-40">
                                                            {rsvp.attendance === AttendanceStatus.HADIR ? `Hadir • ${rsvp.guest_count} Orang` : 'Tidak Hadir'}
                                                        </p>
                                                    </div>
                                                    {rsvp.sticker && (
                                                        <img src={`/stickers/${rsvp.sticker}.webp`} className="w-12 h-12 object-contain" />
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-sm italic leading-relaxed line-clamp-3">"{rsvp.message || "Sending love and prayers..."}"</p>
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <p className="text-[9px] text-slate-200 dark:text-stone-700 font-bold uppercase tracking-widest">
                                                    {new Date(rsvp.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-6 pt-10">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="font-serif text-xl italic text-[#db7093]">{currentPage} / {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <StickerPicker
                isOpen={showStickerPicker}
                selectedSticker={formData.sticker?.id || null}
                onSelect={(sticker) => {
                    setFormData({ ...formData, sticker });
                    setShowStickerPicker(false);
                }}
                onClose={() => setShowStickerPicker(false)}
            />
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
        const sorted = [...wishes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return sorted.slice(start, start + wishesPerPage);
    }, [wishes, currentPage]);

    return (
        <section id="wishes" className="bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent opacity-30"></div>

            <div className="container mx-auto max-w-6xl relative z-10 space-y-24">
                <div className="text-center space-y-6">
                    <Reveal>
                        <div className="space-y-6">
                            <Sparkles className="text-[#db7093] h-10 w-10 mx-auto opacity-30 animate-pulse" />
                            <h2 className="font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors">Digital Guestbook</h2>
                            <p className="max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl transition-colors">
                                "Your prayers and warm wishes mean the world to us as we begin this new journey together."
                            </p>
                        </div>
                    </Reveal>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <Reveal>
                            <div className="bg-[#fffafa] dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000">
                                <div className="space-y-4 text-center">
                                    <h3 className="font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors">Send a Wish</h3>
                                    <div className="h-[1px] w-12 bg-[#db7093] opacity-30 mx-auto"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="space-y-8">
                                        <div className="relative">
                                            <label className="absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">From</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                placeholder="Your lovely name"
                                                className="w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-800 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors">Message</label>
                                            <textarea
                                                required
                                                placeholder="Write your beautiful message..."
                                                rows={4}
                                                className="w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-800 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors resize-none"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSending || postSuccess}
                                        className={`w-full py-6 rounded-full text-[11px] font-black tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-4 ${postSuccess ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-[#db7093] dark:bg-[#ff8da1] text-white dark:text-slate-950 hover:bg-[#c71585] dark:hover:bg-white active:scale-95 transition-all shadow-lg shadow-[#db7093]/20'}`}
                                    >
                                        {isSending ? "SENDING..." : postSuccess ? "SENT WITH LOVE!" : "POST MESSAGE"}
                                        {!postSuccess && <Heart size={18} />}
                                        {postSuccess && <Check size={18} />}
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>

                    {/* List Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {currentWishes.map((wish, idx) => (
                                <Reveal key={wish.id} delay={idx * 0.1}>
                                    <div className="relative group p-10 bg-[#fffafa] dark:bg-slate-900 rounded-[3.5rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-1000 flex flex-col gap-6 min-h-[240px]">
                                        <div className="absolute top-8 right-8 text-[#db7093]/10 dark:text-white/5 group-hover:text-[#db7093] transition-colors">
                                            <Quote size={40} />
                                        </div>
                                        <p className="font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors">"{wish.message}"</p>
                                        <div className="pt-6 border-t border-[#fffafa] dark:border-white/5">
                                            <p className="text-[11px] font-black tracking-[0.3em] text-[#db7093] dark:text-[#ff8da1] uppercase italic transition-colors truncate">{wish.name}</p>
                                            <p className="text-[9px] text-slate-300 dark:text-stone-600 font-bold uppercase tracking-widest mt-1">
                                                {new Date(wish.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-8 pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white shadow-lg active:scale-90"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <div className="flex items-center gap-6 px-10 py-4 bg-[#fffafa] dark:bg-slate-900 rounded-full border border-[#ffd1dc]/20 shadow-xl">
                                    <span className="font-serif text-3xl italic text-[#db7093]">{currentPage}</span>
                                    <span className="opacity-20 text-[#db7093] text-xl">/</span>
                                    <span className="font-serif text-3xl italic text-[#db7093] opacity-50">{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white shadow-lg active:scale-90"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Helper Components ---

const StickerPicker: FC<{ isOpen: boolean; onClose: () => void; onSelect: (sticker: { id: string; src: string }) => void; selectedSticker: string | null }> = ({ isOpen, onClose, onSelect, selectedSticker }) => {
    const stickers = Array.from({ length: 40 }, (_, i) => ({
        id: `sticker-${i + 1}`,
        src: `/stickers/sticker-${i + 1}.webp`
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Reveal>
                                    <Smile className="text-[#db7093] h-6 w-6" />
                                </Reveal>
                                <h3 className="font-serif text-2xl text-slate-800 dark:text-white italic">Express with Stickers</h3>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-6 custom-scrollbar">
                            {stickers.map((sticker) => (
                                <button
                                    key={sticker.id}
                                    onClick={() => onSelect(sticker)}
                                    className={`relative aspect-square p-2 rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${selectedSticker === sticker.id ? 'border-[#db7093] bg-[#db7093]/5 p-0 scale-110' : 'border-transparent hover:border-slate-100 dark:hover:border-white/10'}`}
                                >
                                    <img src={sticker.src} className="w-full h-full object-contain" alt="Sticker" />
                                    {selectedSticker === sticker.id && (
                                        <div className="absolute -top-2 -right-2 bg-[#db7093] text-white rounded-full p-1 shadow-lg">
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 text-center">
                            <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">Scroll for more</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- Main Theme Component ---

const FloralTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`floral-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-1000 ${isOpened ? "opacity-100" : "opacity-0 blur-lg scale-95 pointer-events-none"}`}>
                <Hero />
                <CoupleProfile />
                <LoveStory />
                <EventDetails />
                <Gallery />
                <RSVPForm />
                <Wishes />
                <GiftInfo />
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

export default FloralTheme;
