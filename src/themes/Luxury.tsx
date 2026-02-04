import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FC } from "react";
import {
    Heart,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Quote,
    Calendar,
    Clock,
    MapPin,
    ExternalLink,
    CalendarPlus,
    Copy,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Image as ImageIcon,
    Send,
    CheckCircle2,
    Users,
    RefreshCcw,
    Minus,
    Plus,
    Smile,
    MailOpen,
    CreditCard,
    Moon,
    Sun,
    User,
    Home,
    Gift,
    Star,
    Camera,
    MessageCircle
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { generateGoogleCalendarUrl, downloadICS } from "../utils/calendarUtils";
import { dbService } from "../services/dbService";
import { AttendanceStatus, type RSVP, type Wish } from "../types";

// Shared Components
import MusicPlayer from "./Shared/MusicPlayer";
import MusicController from "./Shared/MusicController";
import AutoScrollController from "./Shared/AutoScrollController";
import FloatingPetals from "./Shared/FloatingPetals";
import InstallPrompt from "./Shared/InstallPrompt";
import StickerPicker from "./Shared/StickerPicker";

import type { ThemeProps } from "./types";
import React from "react";
import { MAX_GUESTS } from "../constants";

// --- Animation Components ---

const Reveal: FC<{ children: React.ReactNode; delay?: number; width?: "fit-content" | "100%" }> = ({ children, delay = 0, width = "100%" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

// --- Sub-components ---

const Envelope: FC<{ onOpen: () => void }> = ({ onOpen }) => {
    const { config } = useSettings();
    const [guestName, setGuestName] = useState<string>("");
    const [isAnimate, setIsAnimate] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to");
        if (to) setGuestName(to);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
        setTimeout(() => setIsAnimate(true), 300);
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
                    className="bg-darkBg fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 scale-110">
                        <motion.img
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 0.3,
                                transition: { duration: 2, ease: "easeOut" }
                            }}
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
                            className="h-full w-full object-cover"
                            alt="Wedding Backdrop"
                        />
                        <div className="from-darkBg/80 via-darkBg/20 to-darkBg/90 absolute inset-0 bg-gradient-to-b"></div>
                        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="bg-accent/5 animate-pulse-soft absolute top-[10%] left-[5%] h-32 w-32 rounded-full blur-3xl"></div>
                        <div className="bg-accentDark/10 animate-pulse-soft absolute right-[5%] bottom-[10%] h-48 w-48 rounded-full blur-3xl [animation-delay:2s]"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
                        }}
                        className="relative z-10 w-full max-w-2xl px-6 text-center"
                    >
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.8 } }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <div className="to-accent/40 h-[1px] w-12 bg-gradient-to-r from-transparent md:w-24"></div>
                                    <Sparkles className="text-accent/60 animate-spin-slow h-5 w-5" />
                                    <div className="to-accent/40 h-[1px] w-12 bg-gradient-to-l from-transparent md:w-24"></div>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-light tracking-[0.5em] text-white/40 uppercase md:text-[12px]">
                                        The Wedding of
                                    </span>
                                    <h1 className="font-serif text-6xl leading-none tracking-tighter text-white italic md:text-9xl">
                                        {firstName}
                                        <span className="text-accent/30 mx-4 font-sans not-italic md:mx-8">
                                            &
                                        </span>
                                        {secondName}
                                    </h1>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 1.2 } }}
                                className="group relative"
                            >
                                <div className="from-accent/20 to-accentDark/20 absolute -inset-1 rounded-[3rem] bg-gradient-to-r opacity-30 blur transition duration-1000 group-hover:opacity-60"></div>
                                <div className="frosted-glass relative space-y-8 overflow-hidden rounded-[2.8rem] border border-white/20 p-10 shadow-2xl md:p-16 dark:border-white/10">
                                    <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
                                        <img
                                            src="https://www.transparenttextures.com/patterns/paper-fibers.png"
                                            className="h-full w-full object-cover"
                                            alt="texture"
                                        />
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <p className="text-accentDark dark:text-accent text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 md:text-[13px]">
                                            Kepada Yth. Bapak/Ibu/Sdr/i:
                                        </p>
                                        <div className="dark:via-accent/30 mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-50"></div>
                                    </div>
                                    <div className="relative z-10 py-2">
                                        <h2 className="font-serif text-4xl tracking-tight break-words text-slate-900 italic drop-shadow-sm transition-colors duration-500 md:text-6xl dark:text-white">
                                            {guestName || "Tamu Undangan"}
                                        </h2>
                                    </div>
                                    <div className="relative z-10 pt-2">
                                        <p className="mx-auto max-w-xs text-[10px] leading-relaxed font-light text-slate-600 italic transition-colors duration-500 md:text-[12px] dark:text-slate-400">
                                            Kami mengundang Anda untuk merayakan kebahagiaan kami dalam
                                            ikatan suci pernikahan.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 1, delay: 1.8 } }}
                                className="flex flex-col items-center gap-6"
                            >
                                <button
                                    onClick={handleOpenClick}
                                    className="group text-primary hover:bg-accent hover:text-darkBg relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-white px-12 py-6 text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_15px_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-700 active:scale-95 md:text-[13px]"
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        <MailOpen className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                                        Buka Undangan
                                    </div>
                                    <div className="bg-accent absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0"></div>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                    <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5 md:inset-8 md:rounded-[4rem]"></div>
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
            if (!targetDateStr) {
                const firstEvent = config.events[0];
                if (!firstEvent) return;
                const distance = firstEvent.startDateTime.getTime() - new Date().getTime();
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
                    hours: Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
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
        <section id="hero" className="relative flex h-screen w-full items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                    src={config.hero.image}
                    className="h-full w-full object-cover"
                    alt="Wedding Backdrop"
                />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px] dark:bg-slate-950/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80"></div>
            </div>

            <div className="z-10 container mx-auto flex flex-col items-center px-6 text-center">
                <div className="w-full space-y-4 md:space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="flex items-center justify-center gap-3 md:gap-4"
                    >
                        <div className="h-[1px] w-6 bg-white/30 md:w-20"></div>
                        <span className="tracking-luxury text-[8px] font-light text-white/80 uppercase md:text-[12px]">
                            The Wedding Celebration
                        </span>
                        <div className="h-[1px] w-6 bg-white/30 md:w-20"></div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="font-serif text-5xl leading-tight tracking-tight break-words text-white italic sm:text-7xl md:text-[9rem] md:leading-none"
                    >
                        {firstName}
                        <span className="text-accent/30 mx-2 md:mx-6">&</span>
                        {secondName}
                    </motion.h1>

                    {guestName && (
                        <motion.p
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 1.2, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="mt-4 font-serif text-xl text-white/80 italic"
                        >
                            Kepada Yth. {guestName}
                        </motion.p>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="space-y-3 md:space-y-6"
                    >
                        <p className="font-serif text-xl tracking-widest text-white italic opacity-90 sm:text-2xl md:text-5xl">
                            {config.hero.date}
                        </p>
                        <div className="flex items-center justify-center gap-3 md:gap-4">
                            <Sparkles className="text-accent/40 h-3 w-3 animate-pulse md:h-4 md:w-4" />
                            <p className="text-accent/70 text-[9px] font-medium tracking-widest uppercase md:text-[13px]">
                                {config.hero.city}
                            </p>
                            <Sparkles className="text-accent/40 h-3 w-3 animate-pulse md:h-4 md:w-4" />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 1.2, delay: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="mt-8 flex items-center justify-center gap-6 md:mt-16 md:gap-14"
                >
                    {Object.entries(timeLeft).map(([label, value]) => (
                        <div
                            key={label}
                            className="flex min-w-[50px] flex-col items-center md:min-w-[80px]"
                        >
                            <span className="font-serif text-2xl leading-none font-bold tracking-tighter text-white md:text-6xl">
                                {String(value).padStart(2, "0")}
                            </span>
                            <span className="text-accent/60 mt-1 text-[7px] font-black tracking-[0.2em] uppercase md:mt-3 md:text-[11px]">
                                {label}
                            </span>
                        </div>
                    ))}
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 1.2, delay: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    onClick={handleScrollToContent}
                    className="group mt-12 flex flex-col items-center gap-3 text-white/40 transition-all duration-500 hover:text-white md:mt-20 md:gap-4"
                >
                    <div className="group-hover:border-accent group-hover:bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-all md:h-12 md:w-12">
                        <ChevronDown className="h-4 w-4 animate-bounce md:h-5 md:w-5" />
                    </div>
                    <span className="tracking-luxury text-[8px] font-bold uppercase opacity-50 group-hover:opacity-100 md:text-[9px]">
                        Lihat Detail
                    </span>
                </motion.button>
            </div>
        </section>
    );
};

const CoupleProfile: FC = () => {
    const { config, text } = useSettings();
    const { bride, groom } = config.couple;
    const [side, setSide] = useState<"pria" | "wanita">("pria");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
    }, []);

    const firstPerson = side === "wanita" ? bride : groom;
    const secondPerson = side === "wanita" ? groom : bride;

    return (
        <section
            id="couple"
            className="dark:bg-darkBg relative bg-white py-24 transition-colors duration-1000 md:py-40"
        >
            <div className="relative z-10 container mx-auto max-w-6xl px-6">
                <Reveal>
                    <div className="mb-24 space-y-6 text-center md:mb-32">
                        <Heart className="text-accentDark/30 dark:text-accent/20 mx-auto mb-6 h-6 w-6 animate-pulse" />
                        <span className="text-accentDark dark:text-accent font-serif text-lg italic">
                            {text.opening.salam}
                        </span>

                        <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-7xl dark:text-white">
                            Bismillahirrahmanirrahim
                        </h2>
                        <div className="bg-accent/30 mx-auto h-[1px] w-20"></div>

                        <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-balance text-slate-600 italic md:text-xl dark:text-slate-300">
                            {text.quote.ar_rum}
                        </p>

                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            {text.quote.source}
                        </p>
                    </div>
                </Reveal>

                <div className="grid items-start gap-20 md:grid-cols-2 md:gap-24">
                    <Reveal delay={0.2}>
                        <div className="group flex flex-col items-center space-y-10 text-center md:items-end md:text-right">
                            <div className="relative">
                                <div className="border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
                                <img
                                    src={firstPerson.image}
                                    className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]"
                                    alt={firstPerson.name}
                                />
                            </div>
                            <div className="space-y-6">
                                <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white">
                                    {firstPerson.fullName}
                                </h3>
                                <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400">
                                    {firstPerson.parents}
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="group flex flex-col items-center space-y-10 text-center md:items-start md:text-left">
                            <div className="relative">
                                <div className="border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
                                <img
                                    src={secondPerson.image}
                                    className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]"
                                    alt={secondPerson.name}
                                />
                            </div>
                            <div className="space-y-6">
                                <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white">
                                    {secondPerson.fullName}
                                </h3>
                                <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400">
                                    {secondPerson.parents}
                                </p>
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
        <section
            id="story"
            className="dark:bg-darkBg relative overflow-hidden bg-slate-50 py-24 transition-colors duration-1000 md:py-40"
        >
            <div className="relative z-10 container mx-auto max-w-5xl px-6">
                <Reveal>
                    <div className="mb-24 space-y-6 text-center md:mb-32">
                        <Sparkles className="text-accentDark dark:text-accent/30 mx-auto mb-4 h-6 w-6 animate-pulse" />
                        <h2 className="font-serif text-5xl tracking-tight text-slate-900 italic md:text-8xl dark:text-white">
                            Kisah Kami
                        </h2>
                        <div className="bg-accent/20 mx-auto h-[1px] w-20"></div>
                        <p className="text-[11px] font-bold tracking-[0.5em] text-slate-500 uppercase dark:text-slate-400">
                            Perjalanan dua hati menjadi satu tujuan
                        </p>
                    </div>
                </Reveal>
                <div className="relative">
                    <div className="absolute left-1/2 hidden h-full w-[1px] -translate-x-1/2 bg-slate-200 md:block dark:bg-white/10"></div>
                    <div className="space-y-16 md:space-y-24">
                        {config.loveStory.map((story, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <div
                                    className={`relative flex flex-col items-center gap-12 md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    <div className="dark:bg-darkSurface border-accent/20 dark:border-accent absolute left-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-colors duration-1000 md:flex">
                                        <div className="bg-accentDark dark:bg-accent h-1.5 w-1.5 animate-pulse rounded-full"></div>
                                    </div>
                                    <div
                                        className={`editorial-card w-full rounded-[3rem] p-10 shadow-2xl md:w-[42%] md:p-14 ${index % 2 === 0 ? "md:text-right" : "md:text-left"
                                            }`}
                                    >
                                        <span className="text-accentDark dark:text-accent mb-6 block text-[11px] font-bold tracking-[0.4em] uppercase">
                                            {story.date}
                                        </span>
                                        <h3 className="mb-5 font-serif text-3xl font-bold tracking-tight text-slate-800 italic md:text-4xl dark:text-slate-100">
                                            {story.title}
                                        </h3>
                                        <p className="text-base leading-relaxed font-light text-slate-500 italic md:text-lg dark:text-slate-400">
                                            {story.desc}
                                        </p>
                                        <div
                                            className={`mt-8 flex ${index % 2 === 0 ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <Heart className="text-accent/20 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-primary/5 pointer-events-none absolute top-1/2 left-0 -z-0 translate-x-[-20%] -translate-y-1/2 -rotate-12 font-serif text-[20rem] whitespace-nowrap italic dark:text-white/5">
                Our Story Our Story Our Story
            </div>
        </section>
    );
};

const EventDetails: FC = () => {
    const { config, text } = useSettings();
    const [copiedEvent, setCopiedEvent] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const filteredEvents = config.events;

    const firstName = config.couple.groom.name;
    const secondName = config.couple.bride.name;

    const copyToClipboard = (address: string, eventId: string) => {
        navigator.clipboard.writeText(address);
        setCopiedEvent(eventId);
        setTimeout(() => setCopiedEvent(null), 2000);
    };

    const handleCalendarAction = (
        type: "google" | "ics",
        ev: (typeof config.events)[number]
    ) => {
        const event = {
            title: `${ev.title} ${firstName} & ${secondName}`,
            description: `Menghadiri ${ev.title} pernikahan ${firstName} & ${secondName}.`,
            location: ev.venue.address,
            startTime: ev.startDateTime,
            endTime: ev.endDateTime,
        };
        if (type === "google") {
            window.open(generateGoogleCalendarUrl(event), "_blank");
        } else {
            downloadICS(event);
        }
        setActiveDropdown(null);
    };

    return (
        <section
            id="event"
            className="bg-secondary/30 dark:bg-darkBg px-4 py-20 transition-colors duration-1000 md:px-6 md:py-40"
        >
            <div className="container mx-auto max-w-6xl">
                <Reveal>
                    <div className="mb-12 space-y-3 text-center md:mb-24 md:space-y-6">
                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12"></div>
                            <Sparkles className="text-accentDark dark:text-accent h-5 w-5 animate-pulse md:h-6 md:w-6" />
                            <div className="bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12"></div>
                        </div>

                        <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white">
                            Waktu & Tempat
                        </h2>
                        <p className="mx-auto max-w-2xl px-4 text-base font-light text-balance text-slate-500 italic md:text-xl dark:text-slate-400">
                            {text.invitation}
                        </p>
                    </div>
                </Reveal>

                {/* LAYOUT 2 KOLOM HORIZONTAL untuk semua ukuran layar */}
                <div className={`grid gap-3 sm:gap-6 md:gap-10 ${filteredEvents.length === 1 ? 'max-w-lg mx-auto' : 'grid-cols-2'}`}>
                    {filteredEvents.map((ev, index) => {
                        const mapUrl = ev.venue.mapsEmbedUrl;

                        return (
                            <Reveal key={ev.id} delay={index * 0.2}>
                                <div
                                    className="editorial-card dark:bg-darkSurface group relative flex flex-col overflow-visible rounded-2xl bg-white sm:rounded-[2.5rem] md:rounded-[4rem]"
                                >
                                    {/* Icon Badge - Lebih kecil di mobile */}
                                    <div className="bg-accentDark/10 dark:bg-accent/10 text-accentDark dark:text-accent animate-float absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 backdrop-blur-md sm:-top-4 sm:-right-4 sm:h-12 sm:w-12 md:-top-6 md:-right-6 md:h-16 md:w-16 dark:border-white/5">
                                        {index === 0 ? (
                                            <Heart className="h-3 w-3 fill-current sm:h-5 sm:w-5 md:h-7 md:w-7" />
                                        ) : (
                                            <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 md:h-7 md:w-7" />
                                        )}
                                    </div>

                                    {/* Header Section - Compact */}
                                    <div className="space-y-3 p-3 text-center sm:space-y-4 sm:p-6 md:space-y-6 md:p-8">
                                        <span className="tracking-luxury text-accentDark dark:text-accent block text-[7px] font-bold uppercase sm:text-[9px] md:text-[10px]">
                                            Our Sacred Day
                                        </span>
                                        <h3 className="font-serif text-base leading-tight text-slate-900 italic sm:text-xl md:text-3xl dark:text-white">
                                            {ev.title}
                                        </h3>
                                    </div>

                                    {/* Date & Time - Layout Horizontal di Mobile */}
                                    <div className="space-y-2 border-y border-slate-100 px-3 py-3 sm:space-y-3 sm:px-6 sm:py-4 md:space-y-4 md:px-8 md:py-6 dark:border-white/5">
                                        {/* Date */}
                                        <div className="flex items-center justify-center gap-2">
                                            <Calendar className="text-accentDark dark:text-accent h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                            <span className="font-serif text-[10px] text-slate-700 italic sm:text-xs md:text-base dark:text-slate-100">
                                                {ev.day}, {ev.date}
                                            </span>
                                        </div>
                                        {/* Time */}
                                        <div className="flex items-center justify-center gap-2">
                                            <Clock className="text-accentDark dark:text-accent h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                            <span className="tracking-editorial text-[9px] font-bold text-slate-400 uppercase sm:text-[10px] md:text-[11px] dark:text-slate-500">
                                                {ev.startTime} — {ev.endTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Save The Date Button - Compact */}
                                    <div className="relative px-3 pt-3 sm:px-6 sm:pt-4 md:px-8 md:pt-6">
                                        <button
                                            onClick={() =>
                                                setActiveDropdown(activeDropdown === ev.id ? null : ev.id)
                                            }
                                            className="bg-primary dark:bg-accentDark tracking-editorial flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[8px] font-bold text-white uppercase transition-all hover:shadow-2xl active:scale-95 sm:gap-2 sm:rounded-2xl sm:py-3 sm:text-[9px] md:gap-3 md:rounded-3xl md:py-4 md:text-[10px]"
                                        >
                                            <CalendarPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                                            Save Date
                                            <ChevronDown
                                                className={`h-2 w-2 transition-transform duration-500 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 ${activeDropdown === ev.id ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {activeDropdown === ev.id && (
                                            <div className="frosted-glass animate-reveal absolute top-full right-0 left-0 z-[50] mt-2 overflow-hidden rounded-xl border border-slate-200 p-1.5 shadow-2xl sm:mt-3 sm:rounded-[1.5rem] sm:p-2 md:mt-4 md:rounded-[2rem] md:p-3 dark:border-white/10">
                                                <button
                                                    onClick={() => handleCalendarAction("google", ev)}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-slate-50 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 md:gap-4 md:rounded-2xl md:px-6 md:py-4 dark:text-white dark:hover:bg-white/5"
                                                >
                                                    <div className="bg-accentDark dark:bg-accent h-1.5 w-1.5 animate-pulse rounded-full sm:h-2 sm:w-2 md:h-2.5 md:w-2.5"></div>
                                                    <span className="tracking-luxury text-[8px] font-bold uppercase sm:text-[9px] md:text-[10px]">
                                                        Google Calendar
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleCalendarAction("ics", ev)}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-slate-50 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 md:gap-4 md:rounded-2xl md:px-6 md:py-4 dark:text-white dark:hover:bg-white/5"
                                                >
                                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 dark:bg-slate-600"></div>
                                                    <span className="tracking-luxury text-[8px] font-bold uppercase sm:text-[9px] md:text-[10px]">
                                                        Apple / Outlook
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Venue Section - Layout Horizontal */}
                                    <div className="space-y-2 border-t border-slate-100 p-3 sm:space-y-3 sm:p-6 md:space-y-4 md:p-8 dark:border-white/5">
                                        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                            <div className="text-accentDark dark:text-accent flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-lg sm:h-10 sm:w-10 md:h-12 md:w-12 md:rounded-2xl dark:border-white/10 dark:bg-white/5">
                                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-serif text-xs leading-tight tracking-tight text-slate-900 italic sm:text-sm md:text-lg dark:text-white">
                                                    {ev.venue.name}
                                                </h4>
                                                <p className="mt-0.5 text-[9px] leading-snug font-light text-slate-500 italic sm:text-[10px] md:text-sm dark:text-slate-400">
                                                    {ev.venue.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Buttons - Horizontal Layout */}
                                        <div className="flex gap-1.5 sm:gap-2 md:gap-3">
                                            <button
                                                onClick={() => copyToClipboard(ev.venue.address, ev.id)}
                                                className="tracking-editorial flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[7px] font-bold text-slate-700 uppercase transition-all hover:bg-slate-50 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-[8px] md:gap-2 md:rounded-2xl md:py-3 md:text-[9px] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                            >
                                                {copiedEvent === ev.id ? (
                                                    <Check className="h-3 w-3 text-green-500 sm:h-3.5 sm:w-3.5" />
                                                ) : (
                                                    <Copy className="text-accentDark dark:text-accent h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                )}
                                                {copiedEvent === ev.id ? "OK" : "Copy"}
                                            </button>
                                            <a
                                                href={ev.venue.mapsEmbedUrl.replace('&output=embed', '')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-primary dark:text-primary tracking-editorial flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[7px] font-bold text-white uppercase transition-all hover:shadow-2xl sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-[8px] md:gap-2 md:rounded-2xl md:py-3 md:text-[9px] dark:bg-white"
                                            >
                                                <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                Maps
                                            </a>
                                        </div>

                                        {/* Map - Compact */}
                                        <div className="relative h-[120px] overflow-hidden rounded-xl border border-slate-100 shadow-lg sm:h-[160px] sm:rounded-2xl md:h-[200px] md:rounded-3xl dark:border-white/10">
                                            <iframe
                                                src={mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                className="contrast-125 grayscale-[0.3] transition-all hover:grayscale-0 dark:opacity-80"
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                            <div className="dark:border-darkSurface/5 pointer-events-none absolute inset-0 border-[2px] border-white/5 sm:border-[3px] md:border-[4px]"></div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
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
    const [side, setSide] = useState<"pria" | "wanita">("pria");
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sideParam = params.get("side");
        if (sideParam === "wanita") setSide("wanita");
    }, []);

    const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
    const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

    // Auto-play logic: berganti setiap 5 detik dengan crossfade
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveIndex((current) => (current + 1) % config.galleryImages.length);
                setIsTransitioning(false);
            }, 400);
        }, 5000);
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
            setIsTransitioning(true);
            setTimeout(() => {
                if (direction === "prev") {
                    setActiveIndex(activeIndex === 0 ? config.galleryImages.length - 1 : activeIndex - 1);
                } else {
                    setActiveIndex((activeIndex + 1) % config.galleryImages.length);
                }
                setIsTransitioning(false);
            }, 400);
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
        <section id="gallery" className="dark:bg-darkBg bg-white py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-accentDark/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10">
                <Reveal>
                    <div className="text-center space-y-6 md:space-y-10">
                        <div className="flex items-center justify-center gap-4 opacity-30">
                            <div className="bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16"></div>
                            <ImageIcon className="h-5 w-5 md:h-8 md:w-8" />
                            <div className="bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16"></div>
                        </div>
                        <h2 className="font-serif text-5xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white leading-none capitalize">Our Gallery</h2>
                        <p className="tracking-luxury text-[10px] font-black text-balance text-slate-400 uppercase italic md:text-[13px] dark:text-slate-500">
                            Momen-momen indah yang terpatri abadi dalam perjalanan cinta kami
                        </p>
                    </div>
                </Reveal>

                {/* Thumbnail Strip with Navigation - MADE SMALLER */}
                <Reveal delay={0.2}>
                    <div className="flex items-center gap-2 sm:gap-4 justify-center px-4">
                        <button
                            onClick={() => navigate("prev")}
                            className="w-8 h-8 rounded-full bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-accent hover:text-white dark:hover:bg-accent transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
                            {config.galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setTimeout(() => {
                                            setActiveIndex(idx);
                                            setIsTransitioning(false);
                                        }, 400);
                                    }}
                                    className={`relative flex-shrink-0 w-12 h-10 sm:w-16 sm:h-12 rounded-xl overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                        ? "border-accent scale-105 shadow-xl z-20"
                                        : "border-transparent opacity-40 grayscale hover:opacity-80 hover:scale-105"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("next")}
                            className="w-8 h-8 rounded-full bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-accent hover:text-white dark:hover:bg-accent transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </Reveal>

                {/* Featured Image Area - WITH CROSSFADE ANIMATION */}
                <Reveal delay={0.4}>
                    <div className="relative aspect-[9/16] w-full max-w-[500px] mx-auto rounded-[3rem] sm:rounded-[4.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group">
                        {/* Multiple images for crossfade effect */}
                        {config.galleryImages.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-[800ms] ease-in-out ${idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                alt={`Gallery ${idx}`}
                                onClick={() => openLightbox(activeIndex)}
                                style={{
                                    transitionDelay: idx === activeIndex ? '0ms' : '0ms'
                                }}
                            />
                        ))}

                        {/* Overlays */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"></div>

                        {/* Action Button */}
                        <div className="absolute bottom-10 right-10 z-30">
                            <button
                                onClick={() => openLightbox(activeIndex)}
                                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-white/20"
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
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl px-4 sm:px-10"
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
                                    className="max-h-[85vh] w-auto h-auto object-contain rounded-2xl md:rounded-[4rem] shadow-2xl border border-white/10"
                                    alt="Fullscreen Moment"
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
                        </div>

                        {/* Info Overlay */}
                        <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full">
                                <p className="font-serif text-white italic text-sm sm:text-lg">
                                    Moment {selectedImg + 1} / {config.galleryImages.length}
                                </p>
                            </div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest">The Wedding of {firstName} & {secondName}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
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
    const rsvpsPerPage = 10;
    const [showStickerPicker, setShowStickerPicker] = useState(false);

    const loadRSVPsData = async () => {
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
        loadRSVPsData();
    }, [invitationId]);

    const handleSubmitRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !invitationId) return;

        setIsSubmitting(true);
        try {
            await dbService.saveRSVP(invitationId, {
                ...formData,
                sticker: formData.sticker?.id || undefined,
            });
            setSubmitted(true);
            await loadRSVPsData();
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGuestCountChange = (operation: "inc" | "dec") => {
        setFormData((prev) => {
            const current = prev.guest_count;
            let next = current;
            if (operation === "inc" && current < MAX_GUESTS) next = current + 1;
            if (operation === "dec" && current > 1) next = current - 1;
            return { ...prev, guest_count: next };
        });
    };

    const rsvpStats = {
        hadir: rsvps
            .filter((r) => r.attendance === AttendanceStatus.HADIR)
            .reduce((total, r) => total + (r.guest_count || 1), 0),
        ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
        tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR)
            .length,
    };

    const getStatusColorClass = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.HADIR:
                return "text-green-600 dark:text-green-400";
            case AttendanceStatus.TIDAK_HADIR:
                return "text-red-500 dark:text-red-400";
            default:
                return "text-slate-500 dark:text-slate-400";
        }
    };

    const totalRSVPPages = Math.ceil(rsvps.length / rsvpsPerPage);
    const currentRSVPsList = React.useMemo(() => {
        const start = (currentPage - 1) * rsvpsPerPage;
        const sorted = [...rsvps].sort(
            (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
        );
        return sorted.slice(start, start + rsvpsPerPage);
    }, [rsvps, currentPage]);

    const handleRSVPPaginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const element = document.getElementById("guest-list-header");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const getRSVPPaneNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalRSVPPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    return (
        <section
            id="rsvp"
            className="dark:bg-darkBg bg-white py-16 transition-colors duration-1000 md:py-40"
        >
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <Reveal>
                    <div className="mb-12 space-y-3 text-center md:mb-24">
                        <Heart className="text-accentDark dark:text-accent/30 mx-auto mb-2 h-5 w-5 animate-pulse" />
                        <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-8xl dark:text-white">
                            Reservasi
                        </h2>
                        <p className="tracking-luxury text-[9px] font-bold text-slate-400 uppercase md:text-[10px] dark:text-slate-500">
                            Mohon konfirmasi kehadiran Anda
                        </p>
                    </div>
                </Reveal>

                <div className="grid items-stretch gap-8 md:gap-14 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-5">
                        <div className="editorial-card group relative flex h-full flex-col justify-center overflow-hidden rounded-[1.5rem] p-6 shadow-lg md:rounded-[3.5rem] md:p-14">
                            {submitted ? (
                                <div className="animate-reveal space-y-6 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-serif text-2xl text-slate-900 italic md:text-4xl dark:text-white">
                                            Terima Kasih!
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-500 md:text-base dark:text-slate-400">
                                            Konfirmasi kehadiran Anda telah berhasil kami simpan.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10"
                                    >
                                        <RefreshCcw className="h-3 w-3" />
                                        Edit Kembali
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-accentDark/5 dark:bg-accent/5 pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full transition-transform duration-1000 group-hover:scale-110"></div>
                                    <div className="relative z-10 space-y-8 md:space-y-12">
                                        <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-10 dark:border-white/5">
                                            <div className="text-accentDark dark:text-accent flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 md:h-16 md:w-16 md:rounded-2xl dark:border-white/10 dark:bg-white/5">
                                                <Users className="h-5 w-5 md:h-8 md:w-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-lg leading-none text-slate-900 italic md:text-2xl dark:text-white">
                                                    Konfirmasi
                                                </h3>
                                                <p className="tracking-editorial mt-1.5 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                                                    Lengkapi data Anda
                                                </p>
                                            </div>
                                        </div>
                                        <form
                                            onSubmit={handleSubmitRSVP}
                                            className="space-y-6 md:space-y-10"
                                        >
                                            <div className="space-y-6 md:space-y-8">
                                                <div className="group/input relative">
                                                    <input
                                                        required
                                                        type="text"
                                                        disabled={isNameLocked}
                                                        className={`focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white ${isNameLocked
                                                            ? "cursor-not-allowed text-slate-500 opacity-60"
                                                            : ""
                                                            }`}
                                                        placeholder="Nama Tamu"
                                                        value={formData.guest_name}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                guest_name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                                                        Nama {isNameLocked && "(Locked)"}
                                                    </label>
                                                </div>
                                                <div className="group/input relative">
                                                    <input
                                                        type="text"
                                                        className="focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white"
                                                        placeholder="WhatsApp / Phone"
                                                        value={formData.phone}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                phone: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                                                        Kontak
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="group/input relative mt-8">
                                                <textarea
                                                    className="focus:border-accentDark dark:focus:border-accent w-full resize-none border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white"
                                                    placeholder="Pesan untuk mempelai (Opsional)"
                                                    rows={2}
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            message: e.target.value,
                                                        })
                                                    }
                                                />
                                                <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                                                    Pesan
                                                </label>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="tracking-editorial text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                                                    Stiker (Opsional)
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowStickerPicker(true)}
                                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                                    >
                                                        <Smile className="h-5 w-5" />
                                                        <span className="text-xs">Pilih Stiker</span>
                                                    </button>
                                                    {formData.sticker && (
                                                        <div className="relative animate-reveal">
                                                            <img
                                                                src={formData.sticker.src}
                                                                alt="Selected sticker"
                                                                className="h-14 w-14 rounded-lg object-contain"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData({ ...formData, sticker: null })
                                                                }
                                                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3 md:space-y-6">
                                                <p className="tracking-editorial mb-1 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                                                    Status Kehadiran
                                                </p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {[
                                                        AttendanceStatus.HADIR,
                                                        AttendanceStatus.TIDAK_HADIR,
                                                        AttendanceStatus.RAGU,
                                                    ].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData({ ...formData, attendance: status })
                                                            }
                                                            className={`tracking-editorial group flex items-center justify-between rounded-lg border px-5 py-3.5 text-[9px] font-bold uppercase transition-all md:rounded-2xl md:py-5 md:text-[11px] ${formData.attendance === status
                                                                ? "bg-primary dark:text-primary border-primary text-white shadow-md dark:border-white dark:bg-white"
                                                                : "border-slate-100 text-slate-400 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5"
                                                                }`}
                                                        >
                                                            {status.replace("_", " ")}
                                                            {formData.attendance === status && (
                                                                <CheckCircle2 className="h-3.5 w-3.5 md:h-5 md:w-5" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {formData.attendance === AttendanceStatus.HADIR && (
                                                <div className="animate-reveal space-y-3">
                                                    <p className="tracking-editorial mb-1 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                                                        Jumlah Tamu (Max {MAX_GUESTS})
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleGuestCountChange("dec")}
                                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                                                            disabled={formData.guest_count <= 1}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <div className="flex-1 border-b border-slate-100 pb-1 text-center font-serif text-xl italic md:text-2xl dark:border-white/5">
                                                            {formData.guest_count} Orang
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleGuestCountChange("inc")}
                                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                                                            disabled={formData.guest_count >= MAX_GUESTS}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                disabled={isSubmitting}
                                                type="submit"
                                                className="bg-primary dark:bg-accentDark tracking-luxury group flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-[9px] font-bold text-white uppercase shadow-sm transition-all duration-700 hover:shadow-xl active:scale-95 disabled:opacity-50 md:rounded-3xl md:py-6 md:text-[11px]"
                                            >
                                                {isSubmitting
                                                    ? "Sending..."
                                                    : isNameLocked
                                                        ? "Update RSVP"
                                                        : "Send RSVP"}
                                                <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-5 md:w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-7">
                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                            {[
                                {
                                    label: "Hadir",
                                    count: rsvpStats.hadir,
                                    color: "text-green-600 dark:text-green-400",
                                },
                                {
                                    label: "Ragu",
                                    count: rsvpStats.ragu,
                                    color: "text-slate-500 dark:text-slate-400",
                                },
                                {
                                    label: "Maaf",
                                    count: rsvpStats.tidak,
                                    color: "text-red-500 dark:text-red-400",
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="editorial-card flex flex-col items-center justify-center space-y-2 rounded-[1.5rem] border border-slate-100 p-4 text-center md:rounded-[2.5rem] md:p-8 dark:border-white/5"
                                >
                                    <span
                                        className={`font-serif text-2xl font-bold md:text-5xl ${item.color}`}
                                    >
                                        {item.count}
                                    </span>
                                    <span className="text-[9px] font-bold tracking-widest uppercase opacity-60 md:text-[10px]">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="editorial-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 p-6 shadow-lg md:rounded-[4rem] md:p-14 dark:border-white/5">
                            <div className="from-accent/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50"></div>
                            <div className="relative z-10 flex h-full flex-col">
                                <div className="mb-8 flex flex-shrink-0 items-center justify-between">
                                    <h3 id="guest-list-header" className="font-serif text-xl text-slate-900 italic md:text-3xl dark:text-white">
                                        Daftar Tamu
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-50">
                                        <Clock className="h-3 w-3" />
                                        <span>Terbaru</span>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    {rsvps.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center opacity-40">
                                            <Users className="mb-2 h-8 w-8" />
                                            <span className="text-xs tracking-widest uppercase">
                                                Belum ada data
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {currentRSVPsList.map((rsvp) => (
                                                    <div
                                                        key={rsvp.id}
                                                        className="editorial-card animate-reveal space-y-4 rounded-2xl p-5"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                                                    {rsvp.guest_name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="truncate font-serif text-base text-slate-800 italic dark:text-slate-200">
                                                                    {rsvp.guest_name}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs font-bold uppercase ${getStatusColorClass(
                                                                    rsvp.attendance
                                                                )}`}
                                                            >
                                                                {rsvp.attendance.replace("_", " ")}
                                                            </span>
                                                        </div>
                                                        {rsvp.attendance === AttendanceStatus.HADIR && (
                                                            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/5 dark:text-slate-500">
                                                                <Users className="h-4 w-4" />
                                                                <span>Datang ber-{rsvp.guest_count}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {totalRSVPPages > 1 && (
                                                <div className="mt-4 flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleRSVPPaginate(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </button>
                                                    <div className="flex gap-1">
                                                        {getRSVPPaneNumbers().map((pageNum) => (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handleRSVPPaginate(pageNum)}
                                                                className={`h-8 w-8 rounded-full text-xs transition-all ${currentPage === pageNum
                                                                    ? "bg-primary text-white shadow-md dark:bg-white dark:text-slate-900"
                                                                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRSVPPaginate(Math.min(totalRSVPPages, currentPage + 1))}
                                                        disabled={currentPage === totalRSVPPages}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StickerPicker
                isOpen={showStickerPicker}
                onClose={() => setShowStickerPicker(false)}
                onSelect={(sticker) => setFormData({ ...formData, sticker })}
                selectedSticker={formData.sticker?.id || null}
            />
        </section>
    );
};

const Wishes: FC = () => {
    const { invitationId } = useSettings();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const wishesPerPage = 10;
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

    const handleSubmitWish = async (e: React.FormEvent) => {
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
    const totalWishesPages = Math.ceil(wishes.length / wishesPerPage);
    const currentWishesList = useMemo(() => {
        const start = (currentPage - 1) * wishesPerPage;
        return wishes.slice(start, start + wishesPerPage);
    }, [wishes, currentPage]);

    const handleWishPaginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const header = document.getElementById("wishes-header");
        if (header) {
            header.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const getWishPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalWishesPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    return (
        <section
            id="wishes"
            className="bg-secondary/30 dark:bg-darkBg py-24 transition-colors duration-1000 md:py-48"
        >
            <div className="container mx-auto max-w-7xl px-6">
                <Reveal>
                    <div
                        id="wishes-header"
                        className="mb-20 space-y-6 text-center md:mb-32 md:space-y-10"
                    >
                        <div className="flex items-center justify-center gap-4 opacity-40">
                            <div className="bg-accentDark dark:bg-accent h-[1px] w-12 md:w-24"></div>
                            <Sparkles className="text-accentDark dark:text-accent h-6 w-6 animate-pulse md:h-10 md:w-10" />
                            <div className="bg-accentDark dark:bg-accent h-[1px] w-12 md:w-24"></div>
                        </div>
                        <h2 className="font-serif text-5xl leading-none tracking-tighter text-slate-900 italic md:text-[10rem] dark:text-white">
                            Prayers & Wishes
                        </h2>
                        <p className="tracking-luxury text-[10px] font-black text-balance text-slate-400 uppercase italic md:text-[14px] dark:text-slate-500">
                            Untaian doa dan harapan tulus dari orang-orang tersayang
                        </p>
                    </div>
                </Reveal>
                <div className="grid items-start gap-10 md:gap-24 lg:grid-cols-12">
                    <div className="lg:sticky lg:top-32 lg:col-span-4">
                        <div className="frosted-glass group relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 p-8 shadow-2xl md:rounded-[4rem] md:p-14 dark:border-white/5">
                            <div className="bg-accent/5 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl transition-transform duration-[3s] group-hover:scale-125"></div>
                            <div className="relative z-10 space-y-10 md:space-y-16">
                                <div className="space-y-4">
                                    <span className="tracking-luxury text-accentDark dark:text-accent text-[10px] font-black uppercase md:text-[12px]">
                                        Guest Book
                                    </span>
                                    <h3 className="font-serif text-3xl text-slate-900 italic md:text-5xl dark:text-white">
                                        Kirim Ucapan
                                    </h3>
                                </div>
                                <form
                                    onSubmit={handleSubmitWish}
                                    className="space-y-8 md:space-y-14"
                                >
                                    <div className="space-y-8 md:space-y-12">
                                        <div className="group/input relative">
                                            <input
                                                required
                                                type="text"
                                                disabled={isNameLocked}
                                                className={`focus:border-accentDark dark:focus:border-accent w-full border-b-2 border-slate-100 bg-transparent py-3 font-serif text-lg text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-6 md:text-2xl dark:border-white/5 dark:text-white dark:placeholder:text-slate-800 ${isNameLocked ? "cursor-not-allowed opacity-60" : ""
                                                    }`}
                                                placeholder="Nama Lengkap"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <label className="absolute -top-4 left-0 text-[8px] font-black tracking-widest text-slate-400 uppercase md:text-[10px]">
                                                Your Name {isNameLocked && "(Locked)"}
                                            </label>
                                        </div>
                                        <div className="group/input relative">
                                            <textarea
                                                required
                                                className="focus:border-accentDark dark:focus:border-accent h-32 w-full resize-none border-b-2 border-slate-100 bg-transparent py-3 font-serif text-lg leading-relaxed text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:h-52 md:py-6 md:text-2xl dark:border-white/5 dark:text-white dark:placeholder:text-slate-800"
                                                placeholder="Tuliskan harapan terbaik Anda..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            <label className="absolute -top-4 left-0 text-[8px] font-black tracking-widest text-slate-400 uppercase md:text-[10px]">
                                                Your Message
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        disabled={isSending || postSuccess}
                                        type="submit"
                                        className={`tracking-luxury group/btn flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-[9px] font-bold text-white uppercase shadow-sm transition-all duration-700 hover:shadow-xl active:scale-95 disabled:opacity-50 md:rounded-3xl md:py-6 md:text-[11px] ${postSuccess
                                            ? "cursor-default bg-green-500"
                                            : "bg-primary dark:bg-accentDark"
                                            }`}
                                    >
                                        {isSending ? (
                                            "Sending..."
                                        ) : postSuccess ? (
                                            <>
                                                Success <Check className="h-3.5 w-3.5 md:h-5 md:w-5" />
                                            </>
                                        ) : isNameLocked ? (
                                            "Update Message"
                                        ) : (
                                            "Send Message"
                                        )}
                                        {!isSending && !postSuccess && (
                                            <Send className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 md:h-5 md:w-5" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-12 md:space-y-20 lg:col-span-8">
                        {currentWishesList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-12 text-center md:rounded-[4rem] md:p-20 dark:border-white/10 dark:bg-white/5">
                                <div className="text-accent/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 md:h-28 md:w-28 dark:bg-white/5">
                                    <Quote className="h-10 w-10 md:h-14 md:w-14" />
                                </div>
                                <h4 className="mb-2 font-serif text-2xl text-slate-400 italic md:text-4xl dark:text-slate-500">
                                    Belum Ada Ucapan
                                </h4>
                                <p className="max-w-sm text-sm text-slate-400 md:text-base dark:text-slate-500">
                                    Jadilah yang pertama mengirimkan doa dan harapan terbaik untuk kedua mempelai
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10">
                                {currentWishesList.map((wish) => (
                                    <div
                                        key={wish.id}
                                        className="editorial-card group dark:bg-darkSurface animate-reveal flex flex-col rounded-[2.5rem] border border-slate-50 bg-white p-8 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl md:rounded-[4rem] md:p-14 dark:border-white/5"
                                    >
                                        <div className="flex-grow space-y-6 md:space-y-10">
                                            <div className="flex items-start justify-between">
                                                <div className="text-accentDark/20 dark:text-accent/20 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 md:h-16 md:w-16 md:rounded-3xl dark:border-white/10 dark:bg-white/5">
                                                    <Quote className="h-6 w-6 md:h-8 md:w-8" />
                                                </div>
                                                <Heart className="text-accent/10 dark:text-accent/20 h-4 w-4 transition-transform duration-700 group-hover:scale-125 md:h-6 md:w-6" />
                                            </div>
                                            <p className="font-serif text-lg leading-[1.4] text-balance text-slate-700 italic md:text-3xl dark:text-slate-200">
                                                "{wish.message}"
                                            </p>
                                        </div>
                                        <div className="mt-8 flex items-center gap-4 border-t border-slate-50 pt-6 md:mt-16 md:gap-6 md:pt-10 dark:border-white/5">
                                            <div className="text-accentDark dark:text-accent flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 text-[12px] font-black shadow-inner md:h-16 md:w-16 md:rounded-3xl md:text-[18px] dark:border-white/10 dark:from-white/5 dark:to-white/10">
                                                {wish.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-[10px] font-black tracking-widest text-slate-900 uppercase md:text-[14px] dark:text-slate-100">
                                                    {wish.name}
                                                </span>
                                                <span className="mt-1 text-[8px] font-bold tracking-widest text-slate-400 uppercase md:text-[10px] dark:text-slate-500">
                                                    {new Date(wish.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {totalWishesPages > 1 && (
                            <div className="flex flex-col items-center gap-8 md:gap-12">
                                <div className="flex items-center justify-center gap-3 md:gap-6">
                                    <button
                                        onClick={() => handleWishPaginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="hover:border-accentDark hover:text-accentDark flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 shadow-lg transition-all hover:bg-white active:scale-90 disabled:opacity-10 md:h-20 md:w-20 dark:border-white/10 dark:hover:bg-white/5"
                                    >
                                        <ChevronLeft className="h-6 w-6 md:h-10 md:w-10" />
                                    </button>
                                    <div className="flex gap-2 rounded-full border border-white/20 bg-white/50 px-4 py-2 shadow-inner backdrop-blur-xl md:gap-4 dark:border-white/10 dark:bg-white/5">
                                        {getWishPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handleWishPaginate(pageNum)}
                                                className={`h-10 w-10 rounded-full font-serif text-lg transition-all duration-700 md:h-16 md:w-16 md:text-3xl ${currentPage === pageNum
                                                    ? "bg-primary dark:bg-accentDark z-10 scale-110 text-white shadow-2xl"
                                                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleWishPaginate(Math.min(totalWishesPages, currentPage + 1))
                                        }
                                        disabled={currentPage === totalWishesPages}
                                        className="hover:border-accentDark hover:text-accentDark flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 shadow-lg transition-all hover:bg-white active:scale-90 disabled:opacity-10 md:h-20 md:w-20 dark:border-white/10 dark:hover:bg-white/5"
                                    >
                                        <ChevronRight className="h-6 w-6 md:h-10 md:w-10" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const GiftInfo: FC = () => {
    const { config, text } = useSettings();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyAction = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section
            id="gift"
            className="dark:bg-darkBg bg-white py-16 transition-colors duration-1000 md:py-40"
        >
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <Reveal>
                    <div className="mb-12 space-y-4 text-center md:mb-24 md:space-y-6">
                        <div className="text-accentDark dark:text-accent mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-md md:mb-12 md:h-20 md:w-20 md:rounded-[2rem] dark:border-white/5 dark:bg-white/5">
                            <Gift className="h-6 w-6 md:h-10 md:w-10" />
                        </div>

                        <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white">
                            {text.gift.title}
                        </h2>
                        <div className="bg-accent/30 mx-auto h-[1px] w-16"></div>

                        <p className="mx-auto max-w-xl text-base leading-relaxed font-light text-balance text-slate-500 italic md:text-2xl dark:text-slate-400">
                            {text.gift.desc}
                        </p>
                    </div>
                </Reveal>
                <div className="mb-10 grid grid-cols-1 gap-5 md:mb-20 md:grid-cols-2 md:gap-14">
                    {config.bankAccounts.map((acc, idx) => (
                        <div
                            key={idx}
                            className="editorial-card group relative space-y-6 overflow-hidden rounded-[1.5rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-lg md:space-y-12 md:rounded-[4.5rem] md:p-20 dark:border-white/5"
                        >
                            <CreditCard className="text-accentDark/5 dark:text-accent/5 pointer-events-none absolute -top-10 -right-10 h-32 w-32 rotate-12 transition-transform duration-[3s] group-hover:scale-110 md:-top-16 md:-right-16 md:h-64 md:w-64" />
                            <div className="relative z-10 space-y-6 text-center md:space-y-12 md:text-left">
                                <div className="space-y-3 md:space-y-6">
                                    <div className="flex items-center justify-center gap-2.5 md:justify-start">
                                        <div className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full"></div>
                                        <p className="text-accentDark dark:text-accent tracking-luxury text-[9px] font-bold uppercase md:text-[12px]">
                                            {acc.bank}
                                        </p>
                                    </div>
                                    <p className="font-serif text-2xl leading-none tracking-tighter break-all text-slate-900 md:text-7xl dark:text-white">
                                        {acc.number}
                                    </p>
                                    <p className="tracking-editorial text-[10px] font-medium text-slate-400 uppercase italic md:text-[14px] dark:text-slate-500">
                                        A/N {acc.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopyAction(acc.number, `bank-${idx}`)}
                                    className={`tracking-editorial inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[9px] font-bold uppercase shadow-md transition-all md:w-auto md:gap-5 md:px-12 md:py-6 md:text-[12px] ${copiedId === `bank-${idx}`
                                        ? "bg-green-500 text-white"
                                        : "bg-primary dark:text-primary text-white active:scale-95 dark:bg-white"
                                        }`}
                                >
                                    {copiedId === `bank-${idx}` ? (
                                        <Check className="h-3.5 w-3.5 md:h-5 md:w-5" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5 md:h-5 md:w-5" />
                                    )}
                                    {copiedId === `bank-${idx}` ? "Berhasil" : "Salin Nomor"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="editorial-card group relative flex flex-col items-center gap-6 overflow-hidden rounded-[1.5rem] border border-slate-100 p-6 text-center shadow-md transition-all duration-1000 md:flex-row md:gap-14 md:rounded-[5rem] md:p-20 md:text-left dark:border-white/5">
                    <div className="from-accent/5 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="text-accentDark dark:text-accent animate-float flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 shadow-sm md:h-28 md:w-28 dark:border-white/10 dark:bg-white/5">
                        <MapPin className="h-6 w-6 md:h-12 md:w-12" />
                    </div>
                    <div className="relative z-10 flex-grow space-y-1.5 md:space-y-4">
                        <div className="text-accentDark dark:text-accent flex items-center justify-center gap-2.5 md:justify-start">
                            <Sparkles className="h-3.5 w-3.5 md:h-5 md:w-5" />
                            <h4 className="font-serif text-xl tracking-tight italic md:text-5xl">
                                Kirim Kado Fisik
                            </h4>
                        </div>
                        <p className="text-sm leading-relaxed font-light text-balance text-slate-500 italic md:text-2xl dark:text-slate-400">
                            {config.giftAddress || "Alamat belum diatur"}
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            handleCopyAction(config.giftAddress, "address-gift")
                        }
                        className={`tracking-luxury relative z-10 inline-flex w-full items-center justify-center gap-3 rounded-xl px-8 py-3.5 text-[9px] font-bold uppercase shadow-md transition-all md:w-auto md:rounded-[2.5rem] md:px-14 md:py-6 md:text-[12px] ${copiedId === "address-gift"
                            ? "bg-green-500 text-white"
                            : "bg-primary dark:text-primary text-white active:scale-95 dark:bg-white"
                            }`}
                    >
                        {copiedId === "address-gift" ? (
                            <Check className="h-4 w-4 md:h-6 md:w-6" />
                        ) : (
                            <Copy className="h-4 w-4 md:h-6 md:w-6" />
                        )}
                        Salin Alamat
                    </button>
                </div>
            </div>
        </section>
    );
};

interface NavbarProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const Navbar: FC<NavbarProps> = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const navItems = [
        { id: "hero", icon: Home, label: "Home" },
        { id: "couple", icon: Heart, label: "Couple" },
        { id: "event", icon: Calendar, label: "Event" },
        { id: "gallery", icon: Camera, label: "Gallery" },
        { id: "rsvp", icon: MessageCircle, label: "RSVP" },
        { id: "gift", icon: Gift, label: "Gift" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 500);

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
        <nav
            className={`fixed bottom-6 left-1/2 z-[1100] -translate-x-1/2 transition-all duration-700 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
            {/* NAVBAR LEBIH KECIL - padding & gap dikurangi */}
            <div className="bg-white/80 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-2 sm:px-4 sm:py-2.5 sm:gap-3 md:px-5 md:py-3 md:gap-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.id);
                            }}
                            className={`group relative flex flex-col items-center gap-0.5 px-1.5 py-1 transition-all duration-300 sm:px-2 md:gap-1 ${isActive ? 'text-accentDark dark:text-accent scale-110' : 'text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {/* Icon lebih kecil */}
                            <Icon size={16} className={`transition-transform duration-300 sm:size-[18px] md:size-[20px] ${isActive ? '' : 'group-hover:-translate-y-1'}`} />
                            
                            {/* Tooltip */}
                            <span className="text-[7px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-8 bg-white dark:bg-slate-900 px-2 py-1 rounded-full whitespace-nowrap text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 shadow-xl pointer-events-none sm:-top-9 sm:text-[8px] sm:px-2.5 sm:py-1.5">
                                {item.label}
                            </span>
                            
                            {/* Active indicator */}
                            {isActive && (
                                <div className="bg-accentDark dark:bg-accent absolute -bottom-0.5 h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"></div>
                            )}
                        </a>
                    );
                })}

                {/* Divider lebih kecil */}
                <div className="mx-0.5 h-4 w-[1px] bg-slate-200 dark:bg-white/10 sm:mx-1 sm:h-5 md:h-6"></div>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-0.5 px-1.5 py-1 text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all duration-300 sm:px-2 md:gap-1"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? 
                        <Moon size={16} className="transition-transform duration-500 group-hover:rotate-12 sm:size-[18px] md:size-[20px]" /> : 
                        <Sun size={16} className="transition-transform duration-500 group-hover:rotate-90 sm:size-[18px] md:size-[20px]" />
                    }
                    <span className="text-[7px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-8 bg-white dark:bg-slate-900 px-2 py-1 rounded-full whitespace-nowrap text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 shadow-xl pointer-events-none sm:-top-9 sm:text-[8px] sm:px-2.5 sm:py-1.5">
                        {theme === "light" ? "Dark" : "Light"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

const LuxuryTheme: FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    const { config, text } = useSettings();

    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpened]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const footerDate = (() => {
        const firstEvent = config.events[0];
        if (!firstEvent) return "";
        const d = firstEvent.startDateTime;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} • ${month} • ${year}`;
    })();

    return (
        <div className="selection:bg-accent/30 selection:text-primary relative min-h-screen overflow-x-hidden">
            {!isOpened && <Envelope onOpen={onOpen} />}

            <InstallPrompt />
            <FloatingPetals />
            <Hero />

            <main className="relative z-10 space-y-0">
                <CoupleProfile />
                <LoveStory />
                <EventDetails />
                <Gallery />
                <RSVPForm />
                <Wishes />
                <GiftInfo />
            </main>

            <MusicPlayer />

            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4">
                <MusicController isOpened={isOpened} />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <footer className="dark:bg-darkSurface relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 transition-colors duration-1000">
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10 dark:opacity-[0.05]">
                    <Heart className="animate-pulse-soft h-[85vw] w-[85vw] stroke-[0.3]" />
                </div>

                <div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center gap-12 md:gap-24">
                    <button
                        onClick={scrollToTop}
                        className="group flex flex-col items-center gap-4 transition-transform duration-500 hover:scale-105"
                    >
                        <div className="border-accent/40 text-accentDark dark:text-accent group-hover:bg-accent/10 flex h-12 w-12 items-center justify-center rounded-full border shadow-2xl transition-colors md:h-16 md:w-16">
                            <ChevronUp className="h-6 w-6 animate-bounce md:h-8 md:w-8" />
                        </div>
                        <span className="tracking-luxury text-[10px] font-bold uppercase opacity-40 transition-opacity group-hover:opacity-100">
                            Sampai Jumpa di Hari Bahagia Kami
                        </span>
                    </button>

                    <div className="space-y-8 text-center md:space-y-12">
                        <Heart className="text-accent/60 mx-auto h-8 w-8 animate-pulse fill-current md:h-12 md:w-12" />
                        <h2 className="font-serif text-6xl leading-[0.85] tracking-tighter text-slate-900 italic drop-shadow-xl sm:text-8xl md:text-[12rem] dark:text-white">
                            {config.couple.groom.name}{" "}
                            <span className="text-accent/30">&</span>{" "}
                            {config.couple.bride.name}
                        </h2>
                        <div className="flex items-center justify-center gap-4 md:gap-6">
                            <div className="bg-accent/30 h-[1px] w-10 md:w-20"></div>
                            <p className="text-accentDark dark:text-accent text-[12px] font-black tracking-[0.4em] uppercase italic md:text-[20px]">
                                {footerDate}
                            </p>
                            <div className="bg-accent/30 h-[1px] w-10 md:w-20"></div>
                        </div>
                    </div>

                    <div className="space-y-12 text-center md:space-y-16">
                        <div className="group relative inline-block px-4">
                            <Quote className="text-accentDark absolute -top-10 -left-2 h-12 w-12 rotate-180 opacity-[0.06] transition-transform duration-1000 md:-top-16 md:-left-12 md:h-24 md:w-24 dark:opacity-[0.12]" />

                            <div className="space-y-6">
                                <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-balance text-slate-500 italic md:text-3xl dark:text-slate-400">
                                    "{text.closing.text}"
                                </p>
                                <p className="font-serif text-xl font-bold text-slate-800 dark:text-white">
                                    {text.closing.salam}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 border-t border-slate-100 pt-16 md:gap-10 md:pt-28 dark:border-white/5">
                            <p className="tracking-luxury text-[9px] font-black uppercase md:text-[13px]">
                                {text.closing.signature}
                            </p>
                            <p className="font-serif text-lg italic">
                                {config.couple.groom.name} & {config.couple.bride.name}
                            </p>
                            <p className="mt-2 text-[10px]">{config.closingFamily}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LuxuryTheme;
