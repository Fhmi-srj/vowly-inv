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
    ChevronDown,
    ChevronUp,
    Smile,
    X,
    Quote,
    ExternalLink,
    CalendarPlus,
    Maximize2,
    Image as ImageIcon,
    RefreshCcw,
    Minus,
    Plus,
    MailOpen,
    CreditCard,
    XCircle,
    User,
    Star
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { dbService } from "../services/dbService";
import { generateGoogleCalendarUrl, downloadICS } from "../utils/calendarUtils";
import { AttendanceStatus, type RSVP, type Wish } from "../types";
import { MAX_GUESTS } from "../constants";
import { STICKERS } from "./Shared/StickerPicker";

// Shared Components
import MusicPlayer from "./Shared/MusicPlayer";
import MusicController from "./Shared/MusicController";
import AutoScrollController from "./Shared/AutoScrollController";
import FloatingPetals from "./Shared/FloatingPetals";
import InstallPrompt from "./Shared/InstallPrompt";
import StickerPicker from "./Shared/StickerPicker";

import type { ThemeProps } from "./types";
import React from "react";

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
    const [side, setSide] = useState<"pria" | "wanita" | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) setGuestName(to);
        const sideParam = params.get("side") as "pria" | "wanita";
        setSide(sideParam || "pria");
    }, []);

    const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
    const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

    const handleOpenClick = () => {
        setIsExiting(true);
        window.dispatchEvent(new CustomEvent("play-wedding-music"));
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
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ebe1] overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

                    <div className="relative w-full max-w-lg px-4 sm:px-8 text-center space-y-8 sm:space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="space-y-4"
                        >
                            <p className="tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold text-[#8c7851] uppercase transition-colors">Undangan Pernikahan</p>
                            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#4a3f35] italic leading-tight transition-colors">
                                {firstName} <span className="text-[#c5a386]">&</span> {secondName}
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="relative py-8 sm:py-12 px-4 sm:px-8 border-y border-[#d9c5b2]"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4ebe1] px-3 sm:px-4">
                                <Heart className="text-[#c5a386] fill-[#c5a386] h-5 w-5 sm:h-6 sm:w-6" />
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-xs sm:text-sm font-medium text-[#8c7851] italic transition-colors">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#4a3f35] font-bold transition-colors">
                                    {guestName || "Tamu Undangan"}
                                </h2>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            onClick={handleOpenClick}
                            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-[#4a3f35] text-[#f4ebe1] rounded-full overflow-hidden transition-all hover:pr-12 sm:hover:pr-14 active:scale-95 shadow-xl shadow-[#4a3f35]/20 text-xs sm:text-[11px]"
                        >
                            <span className="relative z-10 font-bold tracking-widest uppercase">Buka Undangan</span>
                            <MailOpen className="relative z-10 h-3 w-3 sm:h-4 sm:w-4 transition-all group-hover:translate-x-1 sm:group-hover:translate-x-2" />
                            <div className="absolute inset-0 bg-[#5d5043] translate-y-full transition-transform group-hover:translate-y-0"></div>
                        </motion.button>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="text-[9px] sm:text-[10px] tracking-widest text-[#8c7851] uppercase"
                        >
                            Tanpa Mengurangi Rasa Hormat
                        </motion.p>
                    </div>

                    <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-[1rem] sm:rounded-[2rem] border border-[#4a3f35]/5 md:inset-8 md:rounded-[4rem]"></div>
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
        seconds: 0
    });
    const [guestName, setGuestName] = useState<string | null>(null);
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setGuestName(params.get("to"));
        const sideParam = params.get("side") as "pria" | "wanita";
        if (sideParam === "wanita") setSide("wanita");

        const timer = setInterval(() => {
            const targetDateStr = config.hero.heroDateRaw;
            if (!targetDateStr) {
                const firstEvent = config.events[0];
                if (!firstEvent) return;
                const distance = new Date(firstEvent.startDateTime).getTime() - new Date().getTime();
                updateTimeLeft(distance);
                return;
            }

            const targetDate = new Date(`${targetDateStr}T08:00:00+07:00`);
            const distance = targetDate.getTime() - new Date().getTime();
            updateTimeLeft(distance);
        }, 1000);

        const updateTimeLeft = (distance: number) => {
            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        return () => clearInterval(timer);
    }, [config.hero.heroDateRaw, config.events]);

    const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
    const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

    const handleScrollToContent = () => {
        document.getElementById("couple")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fdfaf7] dark:bg-slate-950 transition-colors duration-1000">
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                    src={config.hero.image}
                    className="w-full h-full object-cover grayscale opacity-20 dark:opacity-10"
                    alt="Rustic Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf7]/40 via-transparent to-[#fdfaf7]/80 dark:from-slate-950/40 dark:to-slate-950/80 pointer-events-none transition-colors duration-1000"></div>
                <div className="absolute inset-0 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 space-y-6 sm:space-y-10 px-4 sm:px-6 max-w-7xl pt-8 sm:pt-12 pb-6 sm:pb-10 md:pt-16 md:pb-12">
                <Reveal>
                    <div className="space-y-4">
                        <p className="tracking-[0.4em] sm:tracking-[0.8em] text-[8px] sm:text-[10px] font-bold text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">The Wedding Celebration of</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 lg:gap-16">
                            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#4a3f35] dark:text-stone-200 leading-[0.8] transition-colors drop-shadow-sm">
                                {firstName}
                            </h1>
                            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center relative">
                                <div className="h-[1px] flex-1 md:hidden bg-gradient-to-r from-transparent to-[#c5a386]/30"></div>
                                <span className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-[#c5a386] italic tracking-widest">&</span>
                                <div className="h-[1px] flex-1 md:hidden bg-gradient-to-l from-transparent to-[#c5a386]/30"></div>
                            </div>
                            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#4a3f35] dark:text-stone-200 leading-[0.8] transition-colors drop-shadow-sm">
                                {secondName}
                            </h1>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="space-y-3">
                        <p className="font-serif text-lg sm:text-2xl md:text-3xl text-slate-500 dark:text-stone-400 italic transition-colors">
                            {guestName ? `Kepada Yth. ${guestName}` : "Special Celebration"}
                        </p>
                        <p className="font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-300 italic transition-colors drop-shadow-sm">{config.hero.date}</p>
                        <p className="tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">#ThePerfectMatch • {config.hero.city}</p>
                    </div>
                </Reveal>

                <Reveal delay={0.6}>
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 max-w-2xl mx-auto py-4 sm:py-8 border-y border-[#d9c5b2]/30 dark:border-white/5">
                        {[
                            { label: "Days", value: timeLeft.days },
                            { label: "Hours", value: timeLeft.hours },
                            { label: "Mins", value: timeLeft.minutes },
                            { label: "Secs", value: timeLeft.seconds }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-300 font-bold">{stat.value.toString().padStart(2, '0')}</p>
                                <p className="text-[7px] sm:text-[8px] font-black tracking-widest text-[#8c7851] dark:text-[#c5a386] uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>

                <Reveal delay={1.0}>
                    <button
                        onClick={handleScrollToContent}
                        className="group flex flex-col items-center gap-2 sm:gap-4 mx-auto"
                    >
                        <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-[#c5a386] to-transparent animate-bounce-slow"></div>
                        <p className="text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">Scroll to Explore</p>
                    </button>
                </Reveal>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config, text } = useSettings();
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
    }, []);

    const firstPerson = side === "wanita" ? config.couple.bride : config.couple.groom;
    const secondPerson = side === "wanita" ? config.couple.groom : config.couple.bride;

    return (
        <section id="couple" className="bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-6xl space-y-16 sm:space-y-24 relative z-10">
                <Reveal>
                    <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto mb-12 sm:mb-20">
                        <Heart className="text-[#c5a386] dark:text-[#d9c5b2] h-6 w-6 sm:h-8 sm:w-8 mx-auto animate-pulse transition-colors" />
                        <span className="font-serif text-base sm:text-xl md:text-2xl text-[#8c7851] dark:text-[#c5a386] italic">{text.opening.salam}</span>
                        <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">
                            Bismillahirrahmanirrahim
                        </h2>
                        <div className="w-16 sm:w-20 h-px bg-[#c5a386]/30 mx-auto"></div>
                        <p className="font-serif text-sm sm:text-lg md:text-xl text-slate-500 dark:text-stone-300 italic leading-relaxed transition-colors">
                            {text.quote.ar_rum}
                        </p>
                        <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black text-[#8c7851] dark:text-[#c5a386] uppercase opacity-60 transition-colors">
                            {text.quote.source}
                        </p>
                    </div>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-12 sm:gap-20 md:gap-32 items-start relative">
                    {/* Decorative Center Element for Desktop */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block">
                        <Heart size={150} className="text-[#c5a386]/5 rotate-12" />
                    </div>

                    <Reveal delay={0.2}>
                        <div className="space-y-6 sm:space-y-10 text-center group relative z-10">
                            <div className="relative inline-block mx-auto">
                                <div className="absolute -inset-2 sm:-inset-4 border border-[#c5a386]/20 rounded-full scale-105 transition-transform duration-1000 group-hover:scale-100"></div>
                                <div className="absolute inset-0 border-2 border-[#d9c5b2] rounded-full translate-x-2 sm:translate-x-3 translate-y-2 sm:translate-y-3 transition-transform duration-1000 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                                <img
                                    src={firstPerson.image}
                                    className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]"
                                    alt={firstPerson.fullName}
                                />
                                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-full shadow-lg border border-[#c5a386]/20">
                                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-[#c5a386] fill-[#c5a386]" />
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-4">
                                <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]">{firstPerson.fullName}</h3>
                                <div className="h-[1px] w-8 sm:w-12 bg-[#c5a386] mx-auto opacity-50"></div>
                                <div className="space-y-1">
                                    <p className="text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors opacity-60">Putra/Putri dari Pasangan</p>
                                    <p className="font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors leading-relaxed">{firstPerson.parents}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="space-y-6 sm:space-y-10 text-center group relative z-10 md:mt-24">
                            <div className="relative inline-block mx-auto">
                                <div className="absolute -inset-2 sm:-inset-4 border border-[#c5a386]/20 rounded-full scale-105 transition-transform duration-1000 group-hover:scale-100"></div>
                                <div className="absolute inset-0 border-2 border-[#d9c5b2] rounded-full -translate-x-2 sm:-translate-x-3 translate-y-2 sm:translate-y-3 transition-transform duration-1000 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                                <img
                                    src={secondPerson.image}
                                    className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]"
                                    alt={secondPerson.fullName}
                                />
                                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-full shadow-lg border border-[#c5a386]/20">
                                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-[#c5a386] fill-[#c5a386]" />
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-4">
                                <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]">{secondPerson.fullName}</h3>
                                <div className="h-[1px] w-8 sm:w-12 bg-[#c5a386] mx-auto opacity-50"></div>
                                <div className="space-y-1">
                                    <p className="text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors opacity-60">Putra/Putri dari Pasangan</p>
                                    <p className="font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors leading-relaxed">{secondPerson.parents}</p>
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
        <section id="story" className="bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-4xl space-y-16 sm:space-y-24 relative z-10">
                <Reveal>
                    <div className="text-center space-y-4">
                        <Heart className="text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-20" />
                        <h2 className="font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">Kisah Cinta</h2>
                        <div className="w-16 sm:w-24 h-[1px] bg-[#d9c5b2] mx-auto"></div>
                    </div>
                </Reveal>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-3 sm:left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#d9c5b2] via-[#c5a386] to-[#d9c5b2] -translate-x-1/2 hidden md:block opacity-30"></div>

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <span className="text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-bold text-[#c5a386]/5 -rotate-12 transition-colors whitespace-nowrap">Our Story</span>
                    </div>

                    <div className="space-y-12 sm:space-y-16 md:space-y-32">
                        {config.loveStory.map((story, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <div className={`relative flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                    {/* Line for Mobile */}
                                    <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-[1px] bg-[#d9c5b2]/30 md:hidden"></div>

                                    {/* Content Card */}
                                    <div className="w-full md:w-[45%]">
                                        <div className={`bg-[#f9f5f0] dark:bg-slate-900 p-6 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] border border-[#d9c5b2] dark:border-white/5 relative group transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                            <div className={`absolute -top-3 sm:-top-4 ${index % 2 === 0 ? "left-6 sm:left-10" : "right-6 sm:right-10 md:left-auto md:right-10"} bg-[#4a3f35] dark:bg-stone-200 px-4 py-1 sm:px-6 sm:py-2 rounded-full shadow-lg transition-colors`}>
                                                <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#f4ebe1] dark:text-slate-900 uppercase">{story.date}</p>
                                            </div>

                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="font-serif text-xl sm:text-3xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">{story.title}</h3>
                                                <p className="font-serif text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic leading-relaxed transition-colors">{story.desc}</p>
                                            </div>

                                            {/* Decorative Corner */}
                                            <div className={`absolute bottom-4 sm:bottom-6 ${index % 2 === 0 ? "right-4 sm:right-6" : "left-4 sm:left-6"} opacity-0 group-hover:opacity-20 transition-opacity duration-1000`}>
                                                <Heart className="text-[#c5a386] h-8 w-8 sm:h-12 sm:w-12" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Icon Node */}
                                    <div className="absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 z-20">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-950 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center shadow-xl transition-all duration-700 hover:scale-110 hover:rotate-12 group">
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-[#c5a386] group-hover:animate-spin-slow transition-colors" />
                                        </div>
                                    </div>

                                    {/* Empty Spacer for Desktop */}
                                    <div className="hidden md:block md:w-[45%]"></div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config } = useSettings();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [copiedEvent, setCopiedEvent] = useState<string | null>(null);

    const handleCalendarAction = (type: "google" | "ics", event: any) => {
        if (type === "google") {
            window.open(generateGoogleCalendarUrl(event), "_blank");
        } else {
            downloadICS(event);
        }
        setActiveDropdown(null);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEvent(id);
        setTimeout(() => setCopiedEvent(null), 2000);
    };

    return (
        <section id="event" className="bg-[#f9f5f0] dark:bg-slate-900 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-6xl space-y-16 sm:space-y-24 relative z-10">
                <Reveal>
                    <div className="text-center space-y-4">
                        <MapPin className="text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-30 animate-bounce" />
                        <h2 className="font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">Waktu & Tempat</h2>
                        <p className="tracking-[0.3em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">Undangan Pernikahan</p>
                    </div>
                </Reveal>

                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-20">
                    {config.events.map((ev) => (
                        <Reveal key={ev.id} delay={0.2}>
                            <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden border border-[#d9c5b2] dark:border-white/5 shadow-2xl transition-all duration-1000 group">
                                <div className="p-6 sm:p-10 md:p-14 space-y-8 sm:space-y-12">
                                    <div className="text-center space-y-4 sm:space-y-6">
                                        <div className="inline-block px-4 sm:px-8 py-2 sm:py-3 bg-[#4a3f35] dark:bg-stone-200 rounded-full shadow-lg transition-colors">
                                            <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#f4ebe1] dark:text-slate-900 uppercase">{ev.title}</p>
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]">{ev.day}</h3>
                                            <p className="font-serif text-lg sm:text-2xl text-[#c5a386] italic tracking-wide">{ev.date}</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[#8c7851] dark:text-[#c5a386] transition-colors">
                                            <Clock size={14} className="sm:size-4" />
                                            <p className="text-xs sm:text-sm font-black tracking-widest uppercase">{ev.startTime} — {ev.endTime} WIB</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === ev.id ? null : ev.id)}
                                            className="w-full py-3 sm:py-5 bg-[#4a3f35] dark:bg-white text-white dark:text-slate-900 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-xl transition-all hover:bg-[#8c7851] flex items-center justify-center gap-2 sm:gap-3 active:scale-95"
                                        >
                                            <CalendarPlus size={14} className="sm:size-4" />
                                            Ingatkan Saya
                                            <ChevronDown size={12} className={`sm:size-4 transition-transform duration-500 ${activeDropdown === ev.id ? 'rotate-180' : ''}`} />
                                        </button>

                                        {activeDropdown === ev.id && (
                                            <div className="absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-white dark:bg-slate-900 border border-[#d9c5b2] dark:border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-[50]">
                                                <button
                                                    onClick={() => handleCalendarAction("google", ev)}
                                                    className="w-full px-4 sm:px-8 py-3 sm:py-5 text-left flex items-center gap-2 sm:gap-4 hover:bg-[#f9f5f0] dark:hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c5a386] rounded-full animate-pulse"></div>
                                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300">Google Calendar</span>
                                                </button>
                                                <button
                                                    onClick={() => handleCalendarAction("ics", ev)}
                                                    className="w-full px-4 sm:px-8 py-3 sm:py-5 text-left flex items-center gap-2 sm:gap-4 hover:bg-[#f9f5f0] dark:hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-300 rounded-full"></div>
                                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300">Apple / Outlook</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-[#f9f5f0] dark:border-white/5 p-6 sm:p-10 md:p-14 space-y-6 sm:space-y-10">
                                    <div className="flex items-start gap-4 sm:gap-6">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#f9f5f0] dark:bg-white/5 border border-[#d9c5b2]/40 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <MapPin className="text-[#c5a386] w-5 h-5 sm:w-7 sm:h-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-tight">{ev.venue.name}</h4>
                                            <p className="font-serif text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic transition-colors leading-snug">{ev.venue.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button
                                            onClick={() => copyToClipboard(ev.venue.address, ev.id)}
                                            className="flex-1 py-3 sm:py-4 border border-[#d9c5b2] dark:border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300 transition-all hover:bg-[#f9f5f0] dark:hover:bg-white/5 flex items-center justify-center gap-2"
                                        >
                                            {copiedEvent === ev.id ? <Check size={14} className="sm:size-4 text-green-500" /> : <Copy size={14} className="sm:size-4 text-[#c5a386]" />}
                                            {copiedEvent === ev.id ? "Berhasil!" : "Salin Alamat"}
                                        </button>
                                        <a
                                            href={ev.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-3 sm:py-4 bg-[#c5a386] rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-white shadow-lg transition-all hover:bg-[#8c7851] flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={14} className="sm:size-4" />
                                            Petunjuk Jalan
                                        </a>
                                    </div>

                                    <div className="relative h-48 sm:h-64 md:h-80 rounded-xl sm:rounded-3xl overflow-hidden border border-[#d9c5b2]/40 shadow-xl">
                                        <iframe
                                            src={ev.venue.mapsEmbedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            className="grayscale-[0.5] contrast-[1.1] transition-all duration-1000 group-hover:grayscale-0 dark:opacity-80"
                                        ></iframe>
                                    </div>
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

    // Auto-play logic as requested: "berganti setiap 3 detik"
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
            // Lightbox navigation
            if (direction === "prev") {
                setSelectedImg(selectedImg === 0 ? config.galleryImages.length - 1 : selectedImg - 1);
            } else {
                setSelectedImg(selectedImg === config.galleryImages.length - 1 ? 0 : selectedImg + 1);
            }
        } else {
            // Main gallery navigation
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
        <section id="gallery" className="bg-[#f9f5f0] dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Decorative Background shapes similar to the prompt image but Rustic-themed */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#c5a386]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c7851]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto max-w-4xl space-y-8 sm:space-y-12 relative z-10">
                <Reveal>
                    <div className="text-center space-y-2">
                        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors">Galeri</h2>
                        <div className="w-12 h-[1px] bg-[#d9c5b2] mx-auto opacity-50"></div>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-2 sm:gap-4 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] hover:bg-[#c5a386] hover:text-white transition-all shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-[#c5a386] scale-105 shadow-md"
                                        : "border-transparent opacity-50 grayscale hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] hover:bg-[#c5a386] hover:text-white transition-all shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Image Area */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-[#d9c5b2] dark:border-white/5 shadow-2xl group">
                        <AnimatePresence>
                            <motion.img
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                src={config.galleryImages[activeIndex]}
                                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                                alt="Featured Gallery"
                                onClick={() => openLightbox(activeIndex)}
                            />
                        </AnimatePresence>

                        {/* Action Button */}
                        <div className="absolute bottom-6 right-6 z-20">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                            >
                                <Maximize2 size={20} />
                            </button>
                        </div>

                        {/* Side Decorations similar to the image's "ink" or "marble" feel */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </Reveal>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImg !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-[2010]"
                            onClick={closeLightbox}
                        >
                            <X size={24} className="sm:size-10" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-2 sm:left-4 md:left-12 text-white/50 hover:text-white transition-colors z-[2010]"
                                onClick={(e) => navigate("prev", e)}
                            >
                                <ChevronLeft size={32} className="sm:size-16" strokeWidth={1} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImg}
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, x: -20 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    src={config.galleryImages[selectedImg]}
                                    className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain shadow-2xl rounded-sm"
                                    alt={`Gallery detail ${selectedImg + 1}`}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-2 sm:right-4 md:right-12 text-white/50 hover:text-white transition-colors z-[2010]"
                                onClick={(e) => navigate("next", e)}
                            >
                                <ChevronRight size={32} className="sm:size-16" strokeWidth={1} />
                            </motion.button>

                            <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 sm:px-6 sm:py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                                <p className="text-white/40 text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase">
                                    {selectedImg + 1} <span className="mx-1 sm:mx-2 opacity-20">/</span> {config.galleryImages.length}
                                </p>
                            </div>
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
        <section id="gift" className="bg-[#f9f5f0] dark:bg-slate-900 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative transition-colors duration-1000">
            <div className="container mx-auto max-w-4xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="text-center space-y-4">
                        <Gift className="text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-40 mb-2 sm:mb-4" />
                        <h2 className="font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Kado Kasih</h2>
                        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 dark:text-stone-400 italic transition-colors">Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:</p>
                    </div>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                    {config.bankAccounts?.map((account, idx) => (
                        <Reveal key={idx} delay={idx * 0.2}>
                            <div className="h-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] shadow-xl space-y-6 sm:space-y-8 flex flex-col justify-center text-center group transition-all hover:scale-[1.02] duration-1000">
                                <div className="space-y-1 sm:space-y-2">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f9f5f0] dark:bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 transition-colors">
                                        <Landmark className="text-[#8c7851] h-5 w-5 sm:h-8 sm:w-8" />
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] font-black text-[#c5a386] tracking-[0.2em] sm:tracking-[0.3em] uppercase">{account.bank}</p>
                                    <h3 className="font-serif text-xl sm:text-3xl text-[#4a3f35] dark:text-stone-200 italic font-bold transition-colors">{account.number}</h3>
                                    <p className="font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors">a.n {account.name}</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(account.number, `bank-${idx}`)}
                                    className="inline-flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#8c7851] dark:text-[#c5a386] hover:text-[#4a3f35] dark:hover:text-[#d9c5b2] transition-colors"
                                >
                                    {copiedId === `bank-${idx}` ? (
                                        <><Check size={12} className="sm:size-4 text-green-500" /> Tersalin</>
                                    ) : (
                                        <><Copy size={12} className="sm:size-4" /> Salin Nomor Rekening</>
                                    )}
                                </button>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.4}>
                    <div className="bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3.5rem] shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-14 text-center md:text-left group transition-all duration-1000 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#c5a386]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#f9f5f0] dark:bg-slate-900 rounded-2xl md:rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-float">
                            <MapPin className="text-[#8c7851] h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>

                        <div className="relative z-10 flex-grow space-y-2 sm:space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-[#c5a386]">
                                <Sparkles size={14} className="sm:size-5" />
                                <h3 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-200 italic font-bold">Kirim Kado Fisik</h3>
                            </div>
                            <p className="text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic transition-colors leading-relaxed">
                                {config.giftAddress || "Alamat belum diatur secara lengkap oleh mempelai."}
                            </p>
                        </div>

                        <button
                            onClick={() => copyToClipboard(config.giftAddress || "", 'gift-address')}
                            className={`relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-lg text-[9px] sm:text-[11px] font-black tracking-widest uppercase ${copiedId === 'gift-address'
                                ? "bg-green-500 text-white"
                                : "bg-[#4a3f35] text-[#f4ebe1] hover:scale-105"
                                }`}
                        >
                            {copiedId === 'gift-address' ? (
                                <><Check size={14} className="sm:size-5" /> Tersalin</>
                            ) : (
                                <><Copy size={14} className="sm:size-5" /> Salin Alamat</>
                            )}
                        </button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const Navbar: FC<{ theme: "light" | "dark"; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { icon: Home, label: "Home", href: "#hero" },
        { icon: Heart, label: "Couple", href: "#couple" },
        { icon: Calendar, label: "Event", href: "#event" },
        { icon: Camera, label: "Gallery", href: "#gallery" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
        { icon: Gift, label: "Gift", href: "#gift" },
    ];

    return (
        <nav className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="bg-[#4a3f35]/95 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 sm:gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-0.5 sm:gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    >
                        <item.icon size={14} className="sm:size-5 transition-transform group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" />
                        <span className="text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 sm:-top-8 bg-[#4a3f35] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-white whitespace-nowrap">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-0.5 sm:gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={14} className="sm:size-5" /> : <Sun size={14} className="sm:size-5" />}
                    <span className="text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 sm:-top-8 bg-[#4a3f35] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md whitespace-nowrap text-white">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>
            </div>
        </nav>
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
    const rsvpsPerPage = 10;
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

    const stats = useMemo(() => {
        const hadir = rsvps.filter(r => r.attendance === AttendanceStatus.HADIR).reduce((total, r) => total + (r.guest_count || 1), 0);
        const ragu = rsvps.filter(r => r.attendance === AttendanceStatus.RAGU).length;
        const tidak = rsvps.filter(r => r.attendance === AttendanceStatus.TIDAK_HADIR).length;
        return { hadir, ragu, tidak };
    }, [rsvps]);

    const currentRSVPs = useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        const sorted = [...rsvps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        return sorted.slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);

    return (
        <section id="rsvp" className="bg-[#fdfaf7] dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-white dark:from-slate-950 to-transparent transition-colors"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 sm:gap-16 items-start">
                    <div className="lg:col-span-12 xl:col-span-5">
                        <Reveal>
                            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-14 rounded-[1.5rem] sm:rounded-[3.5rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 relative overflow-hidden transition-all duration-1000">
                                <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-[#c5a386]/5 rounded-bl-full pointer-events-none"></div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f9f5f0] dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors">
                                        <MessageCircle className="text-[#c5a386] h-4 w-4 sm:h-6 sm:w-6" />
                                    </div>
                                    <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Konfirmasi Kehadiran</h2>
                                    <p className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors leading-relaxed">Harap isi form di bawah ini untuk mengonfirmasi kehadiran Anda</p>
                                </div>

                                {submitted ? (
                                    <div className="text-center py-8 sm:py-12 space-y-6 sm:space-y-8 animate-reveal">
                                        <div className="relative inline-block">
                                            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto transition-colors">
                                                <CheckCircle2 size={32} className="sm:size-12" />
                                            </div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-green-500"
                                            >
                                                <Sparkles size={16} className="sm:size-6" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4">
                                            <h3 className="font-serif text-2xl sm:text-4xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Terima Kasih!</h3>
                                            <p className="text-sm sm:text-base text-slate-500 dark:text-stone-400 italic transition-colors max-w-xs mx-auto">Konfirmasi Anda telah berhasil kami terima. Sampai jumpa di hari bahagia kami!</p>
                                        </div>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-6 py-3 sm:px-10 sm:py-4 bg-[#8c7851] text-white rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-[#4a3f35] transition-all"
                                        >
                                            Update Konfirmasi
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="group relative">
                                                <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-1 sm:mb-2">Nama Lengkap</label>
                                                <input
                                                    required
                                                    disabled={isNameLocked}
                                                    placeholder="Nama Anda"
                                                    className="w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all disabled:opacity-50"
                                                    value={formData.guest_name}
                                                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                                />
                                            </div>

                                            <div className="group relative">
                                                <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-1 sm:mb-2">Pesan Untuk Mempelai</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Tulis pesan Anda..."
                                                    className="w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all resize-none"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Tambah Sticker</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowStickerPicker(true)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f9f5f0] dark:bg-slate-800 text-[#c5a386] flex items-center justify-center hover:bg-[#c5a386] hover:text-white transition-all shadow-md active:scale-90"
                                                    >
                                                        <Smile size={16} className="sm:size-5" />
                                                    </button>
                                                </div>
                                                {formData.sticker && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="relative inline-block bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#d9c5b2] shadow-xl"
                                                    >
                                                        <img src={formData.sticker.src} alt="Sticker" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, sticker: null })}
                                                            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                                        >
                                                            <X size={12} className="sm:size-4" />
                                                        </button>
                                                    </motion.div>
                                                )}
                                                <StickerPicker
                                                    isOpen={showStickerPicker}
                                                    selectedSticker={formData.sticker?.id || null}
                                                    onSelect={(sticker) => {
                                                        setFormData({ ...formData, sticker });
                                                        setShowStickerPicker(false);
                                                    }}
                                                    onClose={() => setShowStickerPicker(false)}
                                                />
                                            </div>

                                            <div className="space-y-3 sm:space-y-4">
                                                <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Status Kehadiran</label>
                                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                                    {[AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map(status => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, attendance: status })}
                                                            className={`flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${formData.attendance === status
                                                                ? 'bg-[#4a3f35] dark:bg-stone-200 border-[#4a3f35] dark:border-stone-200 text-white dark:text-slate-900 shadow-xl'
                                                                : 'bg-white dark:bg-slate-800 border-[#d9c5b2] dark:border-white/5 text-[#8c7851] dark:text-stone-400 hover:bg-[#f9f5f0] dark:hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <span className="text-xs font-black tracking-widest uppercase">{status.replace('_', ' ')}</span>
                                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.attendance === status ? 'bg-[#c5a386] border-[#c5a386]' : 'border-[#d9c5b2] opacity-30'}`}>
                                                                {formData.attendance === status && <Check size={12} className="sm:size-4 text-white" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {formData.attendance === AttendanceStatus.HADIR && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 overflow-hidden"
                                                >
                                                    <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors">Jumlah Tamu</label>
                                                    <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[#f9f5f0] dark:bg-slate-800 rounded-2xl sm:rounded-3xl transition-colors">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, guest_count: Math.max(1, p.guest_count - 1) }))}
                                                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-[#d9c5b2] flex items-center justify-center text-[#4a3f35] dark:text-stone-200 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                                                            disabled={formData.guest_count <= 1}
                                                        >
                                                            <Minus size={18} className="sm:size-6" />
                                                        </button>
                                                        <div className="flex-1 text-center font-serif text-xl sm:text-3xl italic text-[#4a3f35] dark:text-stone-200 transition-colors">
                                                            {formData.guest_count} <span className="text-sm sm:text-lg opacity-50">Orang</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, guest_count: Math.min(MAX_GUESTS, p.guest_count + 1) }))}
                                                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-[#d9c5b2] flex items-center justify-center text-[#4a3f35] dark:text-stone-200 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                                                            disabled={formData.guest_count >= MAX_GUESTS}
                                                        >
                                                            <Plus size={18} className="sm:size-6" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <button
                                            disabled={isSubmitting}
                                            className="w-full bg-[#8c7851] text-white py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-[#4a3f35] transition-all shadow-xl shadow-[#8c7851]/30 flex items-center justify-center gap-2 sm:gap-4 group disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Processing..." : "Konfirmasi Sekarang"}
                                            <Send size={14} className="sm:size-5 transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-7">
                        <Reveal delay={0.4}>
                            <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[4rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 transition-all duration-1000">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#f4ebe1] dark:border-white/5 pb-8 transition-colors">
                                    <div className="flex items-center justify-between sm:justify-start gap-4">
                                        <h3 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-200 italic transition-colors">Daftar Kehadiran</h3>
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f9f5f0] dark:bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center">
                                            <Users className="text-[#c5a386] h-4 w-4 sm:h-6 sm:w-6" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-4 flex-1 sm:flex-none">
                                        {[
                                            { label: "Hadir", count: stats.hadir, color: "text-[#4a3f35] dark:text-stone-200", bg: "bg-[#f9f5f0] dark:bg-white/5", icon: CheckCircle2 },
                                            { label: "Ragu", count: stats.ragu, color: "text-[#8c7851] dark:text-stone-400", bg: "bg-white dark:bg-slate-800/50", icon: Clock },
                                            { label: "Absen", count: stats.tidak, color: "text-red-400 dark:text-red-500", bg: "bg-white dark:bg-slate-800/50", icon: XCircle }
                                        ].map((stat, i) => (
                                            <div key={i} className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-[#d9c5b2]/30 dark:border-white/5 text-center transition-all ${stat.bg}`}>
                                                <div className="flex flex-col items-center">
                                                    <stat.icon size={12} className={`opacity-40 mb-1 ${stat.color}`} />
                                                    <p className={`font-serif text-sm sm:text-lg font-bold ${stat.color}`}>{stat.count}</p>
                                                    <p className="text-[7px] sm:text-[9px] font-black tracking-widest uppercase opacity-40 leading-tight">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {rsvps.length === 0 ? (
                                    <div className="text-center py-12 sm:py-20 opacity-30 space-y-3 sm:space-y-4">
                                        <Users size={40} className="sm:size-16 mx-auto" strokeWidth={1} />
                                        <p className="font-serif text-lg sm:text-2xl italic">Belum ada tamu terdaftar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                            {currentRSVPs.map(rsvp => (
                                                <div key={rsvp.id} className="p-4 sm:p-8 bg-[#fdfaf7] dark:bg-slate-800/50 rounded-xl sm:rounded-[2.5rem] border border-white dark:border-white/5 space-y-4 sm:space-y-6 transition-all hover:bg-[#f9f5f0] dark:hover:bg-slate-800 shadow-sm">
                                                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                                                        <div className="space-y-1 min-w-0">
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                <p className="font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic truncate transition-colors capitalize">{rsvp.guest_name}</p>
                                                                {rsvp.sticker && (
                                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 animate-bounce">
                                                                        <img src={STICKERS.find(s => s.id === rsvp.sticker)?.src || ""} className="w-full h-full object-contain" alt="sticker" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[7px] sm:text-[8px] font-black tracking-widest uppercase transition-colors ${rsvp.attendance === AttendanceStatus.HADIR ? 'bg-green-100 dark:bg-green-500/20 text-green-700' : rsvp.attendance === AttendanceStatus.RAGU ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700' : 'bg-red-100 dark:bg-red-500/20 text-red-700'}`}>
                                                                {rsvp.attendance.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        {rsvp.attendance === AttendanceStatus.HADIR && (
                                                            <div className="flex flex-col items-end opacity-40">
                                                                <Users size={12} className="sm:size-4" />
                                                                <span className="text-[9px] sm:text-[10px] font-bold">{rsvp.guest_count}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <Quote className="absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-3 h-3 sm:w-4 sm:h-4 text-[#c5a386] opacity-10" />
                                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400 italic leading-relaxed transition-colors pl-3 sm:pl-4">
                                                            {rsvp.message || "Eshari bersama dalam doa..."}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-3 sm:gap-4 pt-6 sm:pt-10">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]"
                                                >
                                                    <ChevronLeft size={16} className="sm:size-5" />
                                                </button>
                                                <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-1.5 sm:py-3 bg-[#fdfaf7] dark:bg-slate-800 rounded-full text-[#8c7851] dark:text-[#c5a386] font-serif text-base sm:text-lg italic transition-colors">
                                                    <span>{currentPage}</span>
                                                    <span className="opacity-20">/</span>
                                                    <span>{totalPages}</span>
                                                </div>
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]"
                                                >
                                                    <ChevronRight size={16} className="sm:size-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Wishes: FC = () => {
    const { invitationId, config } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 6;
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState<{ id: string; src: string } | null>(null);
    const [showStickerPicker, setShowStickerPicker] = useState(false);

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
            await dbService.saveWish(invitationId, {
                name,
                message,
                sticker: selectedSticker?.id
            });
            setMessage("");
            setSelectedSticker(null);
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
        const sorted = [...wishes].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        return sorted.slice(start, start + wishesPerPage);
    }, [wishes, currentPage]);

    return (
        <section id="wishes" className="bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 sm:gap-16 items-start">
                    <div className="lg:col-span-12 xl:col-span-5">
                        <Reveal>
                            <div className="bg-[#f9f5f0] dark:bg-slate-900 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[4rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 transition-all duration-1000 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#c5a386]/5 rounded-br-full pointer-events-none"></div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-xl sm:rounded-[2rem] flex items-center justify-center shadow-sm">
                                        <Sparkles className="text-[#c5a386] h-4 w-4 sm:h-7 sm:w-7" />
                                    </div>
                                    <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-tight">Untaian Doa</h2>
                                    <p className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-[0.3em] sm:tracking-[0.4em] uppercase transition-colors">Digital Guestbook</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="group relative">
                                            <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-2 sm:mb-3">Nama Anda</label>
                                            <input
                                                required
                                                disabled={isNameLocked}
                                                placeholder="Siapa nama Anda?"
                                                className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all disabled:opacity-50"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="group relative">
                                            <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-2 sm:mb-3">Ucapan & Doa Restu</label>
                                            <textarea
                                                required
                                                placeholder="Tuliskan ucapan terbaik Anda..."
                                                rows={4}
                                                className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all resize-none"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase">Kirim Sticker</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowStickerPicker(true)}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 text-[#c5a386] flex items-center justify-center hover:bg-[#c5a386] hover:text-white transition-all shadow-md active:scale-90"
                                                >
                                                    <Smile size={18} className="sm:size-6" />
                                                </button>
                                            </div>
                                            {selectedSticker && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="relative inline-block bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#d9c5b2] shadow-xl"
                                                >
                                                    <img src={selectedSticker.src} alt="Sticker" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedSticker(null)}
                                                        className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                                    >
                                                        <X size={12} className="sm:size-4" />
                                                    </button>
                                                </motion.div>
                                            )}
                                            <StickerPicker
                                                isOpen={showStickerPicker}
                                                selectedSticker={selectedSticker?.id || null}
                                                onSelect={(sticker) => {
                                                    setSelectedSticker(sticker);
                                                    setShowStickerPicker(false);
                                                }}
                                                onClose={() => setShowStickerPicker(false)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSending || postSuccess}
                                        className={`w-full py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-4 group ${postSuccess ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-[#4a3f35] dark:bg-stone-200 text-white dark:text-slate-900'} hover:translate-y-[-1px] sm:hover:translate-y-[-2px] active:scale-95 disabled:opacity-50`}
                                    >
                                        {isSending ? "Mengirim..." : postSuccess ? "Pesan Terkirim!" : "Kirim Doa Restu"}
                                        {postSuccess ? <CheckCircle2 size={16} className="sm:size-5" /> : <Send size={16} className="sm:size-5 transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" />}
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-7 space-y-8 sm:space-y-12">
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                            {currentWishes.map((wish, idx) => (
                                <Reveal key={wish.id} delay={idx * 0.1}>
                                    <div className="bg-[#f9f5f0] dark:bg-slate-900/50 p-6 sm:p-10 rounded-xl sm:rounded-[3.5rem] border border-white dark:border-white/5 shadow-xl relative group transition-all duration-700 hover:shadow-2xl hover:bg-[#f9f5f0] dark:hover:bg-slate-800">
                                        <div className="space-y-6 sm:space-y-8 relative z-10 h-full flex flex-col">
                                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-slate-800 flex items-center justify-center text-[#c5a386] font-serif text-lg sm:text-2xl border border-[#d9c5b2] dark:border-white/10 transition-colors shadow-sm">
                                                        {wish.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors">{wish.name}</p>
                                                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-widest italic">{new Date(wish.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <Quote className="h-5 w-5 sm:h-8 sm:w-8 text-[#c5a386] opacity-5 group-hover:opacity-20 transition-opacity" />
                                            </div>

                                            <div className="flex-grow space-y-4 sm:space-y-6">
                                                <p className="font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic leading-relaxed transition-colors">"{wish.message}"</p>
                                                {wish.sticker && (
                                                    <div className="w-16 h-16 sm:w-24 sm:h-24 relative">
                                                        <div className="absolute inset-0 bg-[#c5a386]/5 blur-xl sm:blur-2xl rounded-full"></div>
                                                        <img
                                                            src={STICKERS.find(s => s.id === wish.sticker)?.src || ""}
                                                            className="w-full h-full object-contain relative z-10 animate-bounce-slow"
                                                            alt="wish sticker"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4 sm:pt-6 border-t border-[#f4ebe1] dark:border-white/5 flex items-center justify-end">
                                                <div className="flex gap-0.5 sm:gap-1">
                                                    {[1, 2, 3].map(i => <Heart key={i} size={8} className="sm:size-3 text-[#c5a386] opacity-20" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 sm:gap-4 pt-6 sm:pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0] shadow-md bg-white dark:bg-slate-900"
                                >
                                    <ChevronLeft size={18} className="sm:size-6" />
                                </button>
                                <div className="flex items-center gap-4 sm:gap-6 px-6 sm:px-12 py-2 sm:py-4 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 shadow-xl font-serif text-lg sm:text-2xl italic text-[#4a3f35] dark:text-stone-300">
                                    <span>{currentPage}</span>
                                    <span className="opacity-20 text-xl sm:text-3xl">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0] shadow-md bg-white dark:bg-slate-900"
                                >
                                    <ChevronRight size={18} className="sm:size-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer: FC = () => {
    const { config, text } = useSettings();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const footerDate = useMemo(() => {
        const firstEvent = config.events[0];
        if (!firstEvent) return "";
        const d = firstEvent.startDateTime;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} • ${month} • ${year}`;
    }, [config.events]);

    return (
        <footer className="bg-[#f9f5f0] dark:bg-slate-900 border-t border-[#d9c5b2] dark:border-white/5 py-24 sm:py-40 px-6 relative overflow-hidden transition-colors duration-1000">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 dark:opacity-[0.03]">
                <Heart className="animate-pulse-soft h-[80vw] w-[80vw] stroke-[0.3] text-[#c5a386]" />
            </div>

            <div className="container mx-auto max-w-4xl flex flex-col items-center gap-16 md:gap-24 relative z-10">
                <Reveal>
                    <button
                        onClick={scrollToTop}
                        className="group flex flex-col items-center gap-4 transition-transform duration-500 hover:scale-105"
                    >
                        <div className="border-[#c5a386]/40 text-[#8c7851] dark:text-[#c5a386] group-hover:bg-[#c5a386]/10 flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-colors md:h-20 md:w-20">
                            <ChevronUp className="h-8 w-8 animate-bounce md:h-10 md:w-10" />
                        </div>
                        <span className="tracking-[0.4em] text-[10px] font-black uppercase opacity-40 transition-opacity group-hover:opacity-100 text-[#8c7851] dark:text-[#c5a386]">
                            Sampai Jumpa di Hari Bahagia Kami
                        </span>
                    </button>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="space-y-8 text-center md:space-y-12">
                        <Heart className="text-[#c5a386]/60 mx-auto h-10 w-10 animate-pulse fill-current md:h-14 md:w-14" />
                        <h2 className="font-serif text-5xl sm:text-7xl md:text-[10rem] leading-[0.85] tracking-tighter text-[#4a3f35] dark:text-stone-200 italic drop-shadow-xl transition-colors">
                            {config.couple.groom.name}{" "}
                            <span className="text-[#c5a386]/30 text-4xl sm:text-6xl md:text-8xl">&</span>{" "}
                            {config.couple.bride.name}
                        </h2>
                        <div className="flex items-center justify-center gap-4 md:gap-8">
                            <div className="bg-[#c5a386]/30 h-[1px] w-12 md:w-24"></div>
                            <p className="text-[#8c7851] dark:text-[#c5a386] text-[14px] font-black tracking-[0.5em] uppercase italic md:text-[22px] transition-colors">
                                {footerDate}
                            </p>
                            <div className="bg-[#c5a386]/30 h-[1px] w-12 md:w-24"></div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="space-y-16 text-center md:space-y-24">
                        <div className="group relative inline-block px-8 py-4">
                            <Quote className="text-[#c5a386] absolute -top-8 -left-2 h-16 w-16 rotate-180 opacity-10 transition-transform duration-1000 md:-top-16 md:-left-12 md:h-24 md:w-24 dark:opacity-20" />

                            <div className="space-y-8 relative z-10">
                                <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-balance text-[#4a3f35] dark:text-stone-400 italic md:text-3xl transition-colors">
                                    "{text.closing.text}"
                                </p>
                                <p className="font-serif text-2xl font-bold text-[#8c7851] dark:text-stone-200 transition-colors">
                                    {text.closing.salam}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8 border-t border-[#d9c5b2]/30 pt-16 md:gap-12 md:pt-24 dark:border-white/5">
                            <p className="tracking-[0.4em] text-[11px] font-black uppercase text-[#c5a386] md:text-[14px]">
                                {text.closing.signature}
                            </p>
                            <div className="space-y-2">
                                <p className="font-serif text-2xl italic text-[#4a3f35] dark:text-stone-200 md:text-4xl">
                                    {config.couple.groom.name} & {config.couple.bride.name}
                                </p>
                                <p className="text-[10px] md:text-[12px] font-medium text-slate-400 dark:text-stone-500 tracking-widest uppercase">
                                    {config.closingFamily}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
};

export default function Rustic({ theme, toggleTheme, isOpened, onOpen }: ThemeProps) {
    return (
        <div className={`overflow-x-hidden selection:bg-[#c5a386] selection:text-white ${theme}`}>
            <AnimatePresence mode="wait">
                {!isOpened && (
                    <Envelope onOpen={onOpen} />
                )}
            </AnimatePresence>

            <MusicPlayer />
            <div className="fixed inset-y-0 right-4 z-[1000] flex flex-col items-center justify-center gap-4 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-4">
                    <MusicController />
                    <AutoScrollController isOpened={isOpened} />
                </div>
            </div>

            {isOpened && (
                <main className="relative">
                    <Hero />
                    <CoupleProfile />
                    <LoveStory />
                    <EventDetails />
                    <Gallery />
                    <RSVPForm />
                    <Wishes />
                    <GiftInfo />
                    <Footer />
                    <Navbar theme={theme} toggleTheme={toggleTheme} />

                    <FloatingPetals />
                    <InstallPrompt />
                </main>
            )}
        </div>
    );
}