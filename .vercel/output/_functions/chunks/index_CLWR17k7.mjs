import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React__default, { createContext, useContext, useRef, useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, Play, RefreshCw, ChevronDown, X, Smartphone, Download, Smile, Heart, ChevronUp, Quote, Sparkles, MailOpen, Calendar, Clock, CalendarPlus, MapPin, Check, Copy, ExternalLink, Image, ChevronLeft, ChevronRight, Maximize2, CheckCircle2, RefreshCcw, Users, Minus, Plus, Send, Gift, CreditCard, Home, Camera, MessageCircle, Moon, Sun, XCircle, Landmark, Star, Map, Mail, MoveRight, ArrowUpRight, MoveLeft, PartyPopper, Zap, ArrowRight } from 'lucide-react';
import { a as WEDDING_TEXT, G as GALLERY_IMAGES, L as LOVE_STORY, B as BANK_ACCOUNTS, b as MAX_GUESTS, M as MUSIC_URL, W as WEDDING_CONFIG } from './constants_DNnL6zYp.mjs';

const defaultConfig = {
  couple: WEDDING_CONFIG.couple,
  events: [
    {
      id: "akad",
      title: WEDDING_CONFIG.events.akad.title,
      day: WEDDING_CONFIG.events.akad.day,
      date: WEDDING_CONFIG.events.akad.date,
      startTime: WEDDING_CONFIG.events.akad.startTime,
      endTime: WEDDING_CONFIG.events.akad.endTime,
      startDateTime: WEDDING_CONFIG.events.akad.startDateTime,
      endDateTime: WEDDING_CONFIG.events.akad.endDateTime,
      side: "both",
      venue: WEDDING_CONFIG.events.akad.venue
    },
    {
      id: "resepsi",
      title: WEDDING_CONFIG.events.resepsi.title,
      day: WEDDING_CONFIG.events.resepsi.day,
      date: WEDDING_CONFIG.events.resepsi.date,
      startTime: WEDDING_CONFIG.events.resepsi.startTime,
      endTime: WEDDING_CONFIG.events.resepsi.endTime,
      startDateTime: WEDDING_CONFIG.events.resepsi.startDateTime,
      endDateTime: WEDDING_CONFIG.events.resepsi.endDateTime,
      side: "both",
      venue: WEDDING_CONFIG.events.resepsi.venue
    }
  ],
  hero: {
    ...WEDDING_CONFIG.hero,
    date: WEDDING_CONFIG.events.akad.date,
    heroDateRaw: ""
  },
  musicUrl: MUSIC_URL,
  maxGuests: MAX_GUESTS,
  giftAddress: "",
  bankAccounts: BANK_ACCOUNTS,
  loveStory: LOVE_STORY,
  galleryImages: GALLERY_IMAGES,
  closingFamily: WEDDING_TEXT.closing.family,
  themeId: "luxury"
};
const SettingsContext = createContext({
  config: defaultConfig,
  isLoading: true,
  text: WEDDING_TEXT,
  invitationId: null
});
const useSettings = () => useContext(SettingsContext);

const generateGoogleCalendarUrl = (event) => {
  const formatDate = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startTime)}/${formatDate(event.endTime)}`,
    details: event.description,
    location: event.location,
    sf: "true",
    output: "xml"
  });
  return `${baseUrl}?${params.toString()}`;
};
const downloadICS = (event) => {
  const formatDate = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(event.startTime)}`,
    `DTEND:${formatDate(event.endTime)}`,
    `DTSTAMP:${formatDate(/* @__PURE__ */ new Date())}`,
    `UID:${Date.now()}@wedding-invitation.com`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

let rsvpCache = null;
let wishesCache = null;
const CACHE_DURATION = 30 * 1e3;
const dbService = {
  async initializeDemo() {
  },
  async getRSVPs(invitationId) {
    const now = Date.now();
    if (rsvpCache && now - rsvpCache.timestamp < CACHE_DURATION) {
      return rsvpCache.data;
    }
    try {
      const response = await fetch(`/api/rsvp?invitationId=${invitationId}`);
      if (!response.ok) throw new Error("Failed to fetch RSVPs");
      const data = await response.json();
      rsvpCache = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  async saveRSVP(invitationId, data) {
    rsvpCache = null;
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, invitationId })
    });
    if (!response.ok) throw new Error("Failed to save RSVP");
    return {
      ...data,
      id: Date.now(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  async getWishes(invitationId) {
    const now = Date.now();
    if (wishesCache && now - wishesCache.timestamp < CACHE_DURATION) {
      return wishesCache.data;
    }
    try {
      const response = await fetch(`/api/wishes?invitationId=${invitationId}`);
      if (!response.ok) throw new Error("Failed to fetch wishes");
      const data = await response.json();
      wishesCache = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  async saveWish(invitationId, data) {
    wishesCache = null;
    const response = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, invitationId })
    });
    if (!response.ok) throw new Error("Failed to save wish");
    return {
      ...data,
      id: Date.now(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

var AttendanceStatus = /* @__PURE__ */ ((AttendanceStatus2) => {
  AttendanceStatus2["HADIR"] = "hadir";
  AttendanceStatus2["TIDAK_HADIR"] = "tidak_hadir";
  AttendanceStatus2["RAGU"] = "ragu";
  return AttendanceStatus2;
})(AttendanceStatus || {});

const MusicPlayer = () => {
  const { config } = useSettings();
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => {
      audio.play().catch((err) => console.warn("Autoplay prevented", err));
    };
    const handlePause = () => {
      audio.pause();
    };
    const handleToggle = () => {
      if (audio.paused) {
        handlePlay();
      } else {
        handlePause();
      }
    };
    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("pause-wedding-music", handlePause);
    window.addEventListener("toggle-wedding-music", handleToggle);
    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("pause-wedding-music", handlePause);
      window.removeEventListener("toggle-wedding-music", handleToggle);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "audio",
    {
      ref: audioRef,
      src: config.musicUrl,
      preload: "auto",
      loop: true,
      className: "hidden"
    }
  );
};

const MusicController = ({ isOpened }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpened || false);
  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      setIsVisible(true);
    };
    const handlePause = () => setIsPlaying(false);
    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("pause-wedding-music", handlePause);
    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("pause-wedding-music", handlePause);
    };
  }, []);
  const toggleMusic = () => {
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
    setIsPlaying(!isPlaying);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `transition-all duration-1000 transform ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`,
      children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: toggleMusic,
          className: "group relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-[#d9c5b2] dark:border-white/10 shadow-xl transition-all hover:scale-110",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute inset-1 rounded-full border border-[#d9c5b2]/30 dark:border-white/5 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`,
                children: /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#c5a386]" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 text-[#4a3f35] dark:text-stone-200", children: isPlaying ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Music, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-2 text-[7px] font-black", children: "ON" })
            ] }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 ml-0.5" }) })
          ]
        }
      )
    }
  );
};

const AutoScrollController = ({ isOpened }) => {
  const [isActive, setIsActive] = useState(false);
  const scrollRef = useRef(null);
  const startAutoScroll = () => {
    const scroll = () => {
      window.scrollBy({ top: 1, behavior: "auto" });
      scrollRef.current = requestAnimationFrame(scroll);
    };
    scrollRef.current = requestAnimationFrame(scroll);
  };
  const stopAutoScroll = () => {
    if (scrollRef.current) {
      cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
    }
  };
  useEffect(() => {
    if (isActive) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isActive]);
  const toggleScroll = () => {
    setIsActive(!isActive);
  };
  if (!isOpened) return null;
  return /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-right-4 duration-1000", children: /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: toggleScroll,
      className: `group flex h-16 w-10 flex-col items-center justify-center gap-1 rounded-tl-xl rounded-tr-sm rounded-bl-sm rounded-br-xl border border-white/20 shadow-xl transition-all duration-500 hover:scale-105 backdrop-blur-md ${isActive ? "bg-accent text-white" : "bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-white"}`,
      children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `h-5 w-5 ${isActive ? "animate-spin" : ""}` }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase", children: "Auto" }),
        /* @__PURE__ */ jsx(ChevronDown, { className: `h-3 w-3 opacity-50 transition-transform ${isActive ? "rotate-180" : ""}` })
      ]
    }
  ) });
};

const FloatingPetals = () => {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const petalCount = 15;
    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: `${10 + Math.random() * 20}px`,
      rotation: `${Math.random() * 360}deg`
    }));
    setPetals(newPetals);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 z-[1] overflow-hidden", children: [
    petals.map((p) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-accent/20 dark:bg-accent/10 absolute top-[-50px] rounded-full blur-[1px]",
        style: {
          left: p.left,
          width: p.size,
          height: p.size,
          opacity: 0.6,
          animation: `fall ${p.duration} linear infinite`,
          animationDelay: p.delay,
          transform: `rotate(${p.rotation})`
        },
        children: /* @__PURE__ */ jsx("div", { className: "bg-accent/10 h-full w-full rounded-[100%_0%_100%_0%_/_100%_0%_100%_0%] shadow-inner" })
      },
      p.id
    )),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(100px) rotate(720deg); opacity: 0; }
        }
      ` })
  ] });
};

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    if (isDismissed) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3e3);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };
  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };
  if (!showPrompt) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed right-4 bottom-24 left-4 z-[9999] flex justify-center md:right-8 md:bottom-8 md:left-auto md:w-96", children: /* @__PURE__ */ jsxs("div", { className: "frosted-glass animate-reveal relative w-full overflow-hidden rounded-3xl border border-white/20 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900/80", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-accent/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleDismiss,
        className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white",
        children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-accentDark/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl dark:bg-white/10", children: /* @__PURE__ */ jsx(Smartphone, { className: "text-accentDark dark:text-accent h-7 w-7 animate-pulse" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl font-bold text-slate-900 italic dark:text-white", children: "Install App" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed font-medium text-slate-500 dark:text-slate-400", children: "Pasang undangan ini di layar utama HP Anda untuk akses lebih cepat dan pengalaman yang lebih lancar." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleDismiss,
          className: "flex-1 rounded-xl border border-slate-200 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5",
          children: "Nanti Saja"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleInstallClick,
          className: "bg-primary dark:bg-accentDark flex-1 rounded-xl py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-transform active:scale-95",
          children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            "Install"
          ] })
        }
      )
    ] })
  ] }) });
};

const STICKERS = [
  { id: "love-envelope", src: "/stickers/love-envelope.png", alt: "Love Envelope" },
  { id: "heart-sparkle", src: "/stickers/heart-sparkle.png", alt: "Heart Sparkle" },
  { id: "celebration", src: "/stickers/celebration.png", alt: "Celebration" },
  { id: "flowers", src: "/stickers/flowers.png", alt: "Flowers" },
  { id: "wedding-rings", src: "/stickers/wedding-rings.png", alt: "Wedding Rings" },
  { id: "confetti", src: "/stickers/confetti.png", alt: "Confetti" },
  { id: "love-birds", src: "/stickers/love-birds.png", alt: "Love Birds" },
  { id: "champagne", src: "/stickers/champagne.png", alt: "Champagne" }
];
const StickerPicker$1 = ({
  isOpen,
  onClose,
  onSelect,
  selectedSticker
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  const handleSelect = (sticker) => {
    onSelect({ id: sticker.id, src: sticker.src });
    onClose();
  };
  const handleClear = () => {
    onSelect(null);
    onClose();
  };
  if (!shouldRender) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`,
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `relative max-h-[80vh] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 dark:bg-slate-800 ${isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"}`,
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Smile, { className: "text-accent h-5 w-5" }),
                  /* @__PURE__ */ jsx("h3", { className: "font-serif text-lg text-slate-900 italic dark:text-white", children: "Pilih Stiker" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white",
                    children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "custom-scrollbar max-h-[50vh] overflow-y-auto p-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3", children: STICKERS.map((sticker) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleSelect(sticker),
                  className: `group relative aspect-square overflow-hidden rounded-xl border-2 p-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${selectedSticker === sticker.id ? "border-accent bg-accent/10" : "border-transparent hover:border-slate-200 dark:hover:border-white/20"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: sticker.src,
                        alt: sticker.alt,
                        className: "h-full w-full object-contain",
                        loading: "lazy"
                      }
                    ),
                    selectedSticker === sticker.id && /* @__PURE__ */ jsx("div", { className: "bg-accent absolute top-1 right-1 h-3 w-3 rounded-full" })
                  ]
                },
                sticker.id
              )) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 border-t border-slate-100 p-4 dark:border-white/10", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleClear,
                    className: "flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5",
                    children: "Hapus Stiker"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "bg-primary flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90",
                    children: "Tutup"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};

const Reveal$b = ({ children, delay = 0, width = "100%" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30, filter: "blur(10px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: false, margin: "-100px" },
      transition: { duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] },
      style: { width },
      children
    }
  );
};
const Envelope$b = ({ onOpen }) => {
  const { config } = useSettings();
  const [guestName, setGuestName] = useState("");
  const [isAnimate, setIsAnimate] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [side, setSide] = useState("pria");
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
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !isExiting && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: {
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
      },
      className: "bg-darkBg fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 scale-110", children: [
          /* @__PURE__ */ jsx(
            motion.img,
            {
              initial: { scale: 1.2, opacity: 0 },
              animate: {
                scale: 1,
                opacity: 0.3,
                transition: { duration: 2, ease: "easeOut" }
              },
              src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
              className: "h-full w-full object-cover",
              alt: "Wedding Backdrop"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "from-darkBg/80 via-darkBg/20 to-darkBg/90 absolute inset-0 bg-gradient-to-b" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 backdrop-blur-[2px]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-accent/5 animate-pulse-soft absolute top-[10%] left-[5%] h-32 w-32 rounded-full blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "bg-accentDark/10 animate-pulse-soft absolute right-[5%] bottom-[10%] h-48 w-48 rounded-full blur-3xl [animation-delay:2s]" })
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            animate: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
            },
            className: "relative z-10 w-full max-w-2xl px-6 text-center",
            children: /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.8 } },
                  className: "space-y-6",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "to-accent/40 h-[1px] w-12 bg-gradient-to-r from-transparent md:w-24" }),
                      /* @__PURE__ */ jsx(Sparkles, { className: "text-accent/60 animate-spin-slow h-5 w-5" }),
                      /* @__PURE__ */ jsx("div", { className: "to-accent/40 h-[1px] w-12 bg-gradient-to-l from-transparent md:w-24" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-light tracking-[0.5em] text-white/40 uppercase md:text-[12px]", children: "The Wedding of" }),
                      /* @__PURE__ */ jsxs("h1", { className: "font-serif text-6xl leading-none tracking-tighter text-white italic md:text-9xl", children: [
                        firstName,
                        /* @__PURE__ */ jsx("span", { className: "text-accent/30 mx-4 font-sans not-italic md:mx-8", children: "&" }),
                        secondName
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 40 },
                  animate: { opacity: 1, y: 0, transition: { duration: 1.2, delay: 1.2 } },
                  className: "group relative",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "from-accent/20 to-accentDark/20 absolute -inset-1 rounded-[3rem] bg-gradient-to-r opacity-30 blur transition duration-1000 group-hover:opacity-60" }),
                    /* @__PURE__ */ jsxs("div", { className: "frosted-glass relative space-y-8 overflow-hidden rounded-[2.8rem] border border-white/20 p-10 shadow-2xl md:p-16 dark:border-white/10", children: [
                      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay", children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "https://www.transparenttextures.com/patterns/paper-fibers.png",
                          className: "h-full w-full object-cover",
                          alt: "texture"
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-3", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-accentDark dark:text-accent text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 md:text-[13px]", children: "Kepada Yth. Bapak/Ibu/Sdr/i:" }),
                        /* @__PURE__ */ jsx("div", { className: "dark:via-accent/30 mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-50" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 py-2", children: /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl tracking-tight break-words text-slate-900 italic drop-shadow-sm transition-colors duration-500 md:text-6xl dark:text-white", children: guestName || "Tamu Undangan" }) }),
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 pt-2", children: /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xs text-[10px] leading-relaxed font-light text-slate-600 italic transition-colors duration-500 md:text-[12px] dark:text-slate-400", children: "Kami mengundang Anda untuk merayakan kebahagiaan kami dalam ikatan suci pernikahan." }) })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { duration: 1, delay: 1.8 } },
                  className: "flex flex-col items-center gap-6",
                  children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleOpenClick,
                      className: "group text-primary hover:bg-accent hover:text-darkBg relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-white px-12 py-6 text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_15px_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-700 active:scale-95 md:text-[13px]",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(MailOpen, { className: "h-5 w-5 transition-transform duration-500 group-hover:scale-110" }),
                          "Buka Undangan"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "bg-accent absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0" })
                      ]
                    }
                  )
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5 md:inset-8 md:rounded-[4rem]" })
      ]
    }
  ) });
};
const Hero$a = () => {
  const { config } = useSettings();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [guestName, setGuestName] = useState(null);
  const [side, setSide] = useState("pria");
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
        const distance2 = firstEvent.startDateTime.getTime() - (/* @__PURE__ */ new Date()).getTime();
        updateTimeLeft(distance2);
        return;
      }
      const targetDate = /* @__PURE__ */ new Date(`${targetDateStr}T08:00:00+07:00`);
      const distance = targetDate.getTime() - (/* @__PURE__ */ new Date()).getTime();
      updateTimeLeft(distance);
    }, 1e3);
    const updateTimeLeft = (distance) => {
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1e3 * 60 * 60 * 24)),
          hours: Math.floor(
            distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
          ),
          minutes: Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60)),
          seconds: Math.floor(distance % (1e3 * 60) / 1e3)
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
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative flex h-screen w-full items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsx(
        motion.img,
        {
          initial: { scale: 1.2 },
          animate: { scale: 1 },
          transition: { duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" },
          src: config.hero.image,
          className: "h-full w-full object-cover",
          alt: "Wedding Backdrop"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px] dark:bg-slate-950/60" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "z-10 container mx-auto flex flex-col items-center px-6 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full space-y-4 md:space-y-10", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: false, margin: "-100px" },
            transition: { duration: 1.2, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] },
            className: "flex items-center justify-center gap-3 md:gap-4",
            children: [
              /* @__PURE__ */ jsx("div", { className: "h-[1px] w-6 bg-white/30 md:w-20" }),
              /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-[8px] font-light text-white/80 uppercase md:text-[12px]", children: "The Wedding Celebration" }),
              /* @__PURE__ */ jsx("div", { className: "h-[1px] w-6 bg-white/30 md:w-20" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: false, margin: "-100px" },
            transition: { duration: 1.2, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] },
            className: "font-serif text-5xl leading-tight tracking-tight break-words text-white italic sm:text-7xl md:text-[9rem] md:leading-none",
            children: [
              firstName,
              /* @__PURE__ */ jsx("span", { className: "text-accent/30 mx-2 md:mx-6", children: "&" }),
              secondName
            ]
          }
        ),
        guestName && /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: false, margin: "-100px" },
            transition: { duration: 1.2, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
            className: "mt-4 font-serif text-xl text-white/80 italic",
            children: [
              "Kepada Yth. ",
              guestName
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: false, margin: "-100px" },
            transition: { duration: 1.2, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
            className: "space-y-3 md:space-y-6",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-serif text-xl tracking-widest text-white italic opacity-90 sm:text-2xl md:text-5xl", children: config.hero.date }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 md:gap-4", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "text-accent/40 h-3 w-3 animate-pulse md:h-4 md:w-4" }),
                /* @__PURE__ */ jsx("p", { className: "text-accent/70 text-[9px] font-medium tracking-widest uppercase md:text-[13px]", children: config.hero.city }),
                /* @__PURE__ */ jsx(Sparkles, { className: "text-accent/40 h-3 w-3 animate-pulse md:h-4 md:w-4" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 30, filter: "blur(10px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: false, margin: "-100px" },
          transition: { duration: 1.2, delay: 0.9, ease: [0.21, 0.47, 0.32, 0.98] },
          className: "mt-8 flex items-center justify-center gap-6 md:mt-16 md:gap-14",
          children: Object.entries(timeLeft).map(([label, value]) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex min-w-[50px] flex-col items-center md:min-w-[80px]",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-serif text-2xl leading-none font-bold tracking-tighter text-white md:text-6xl", children: String(value).padStart(2, "0") }),
                /* @__PURE__ */ jsx("span", { className: "text-accent/60 mt-1 text-[7px] font-black tracking-[0.2em] uppercase md:mt-3 md:text-[11px]", children: label })
              ]
            },
            label
          ))
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.button,
        {
          initial: { opacity: 0, y: 30, filter: "blur(10px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: false, margin: "-100px" },
          transition: { duration: 1.2, delay: 1.1, ease: [0.21, 0.47, 0.32, 0.98] },
          onClick: handleScrollToContent,
          className: "group mt-12 flex flex-col items-center gap-3 text-white/40 transition-all duration-500 hover:text-white md:mt-20 md:gap-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "group-hover:border-accent group-hover:bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-all md:h-12 md:w-12", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 animate-bounce md:h-5 md:w-5" }) }),
            /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-[8px] font-bold uppercase opacity-50 group-hover:opacity-100 md:text-[9px]", children: "Lihat Detail" })
          ]
        }
      )
    ] })
  ] });
};
const CoupleProfile$a = () => {
  const { config, text } = useSettings();
  const { bride, groom } = config.couple;
  const [side, setSide] = useState("pria");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "wanita") setSide("wanita");
  }, []);
  const firstPerson = side === "wanita" ? bride : groom;
  const secondPerson = side === "wanita" ? groom : bride;
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "couple",
      className: "dark:bg-darkBg relative bg-white py-24 transition-colors duration-1000 md:py-40",
      children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto max-w-6xl px-6", children: [
        /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "mb-24 space-y-6 text-center md:mb-32", children: [
          /* @__PURE__ */ jsx(Heart, { className: "text-accentDark/30 dark:text-accent/20 mx-auto mb-6 h-6 w-6 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-accentDark dark:text-accent font-serif text-lg italic", children: text.opening.salam }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl tracking-tight text-slate-900 italic md:text-7xl dark:text-white", children: "Bismillahirrahmanirrahim" }),
          /* @__PURE__ */ jsx("div", { className: "bg-accent/30 mx-auto h-[1px] w-20" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-3xl text-lg leading-relaxed font-light text-balance text-slate-600 italic md:text-xl dark:text-slate-300", children: text.quote.ar_rum }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold tracking-widest text-slate-400 uppercase", children: text.quote.source })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-20 md:grid-cols-2 md:gap-24", children: [
          /* @__PURE__ */ jsx(Reveal$b, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "group flex flex-col items-center space-y-10 text-center md:items-end md:text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: firstPerson.image,
                  className: "dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]",
                  alt: firstPerson.name
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white", children: firstPerson.fullName }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400", children: firstPerson.parents })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Reveal$b, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "group flex flex-col items-center space-y-10 text-center md:items-start md:text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: secondPerson.image,
                  className: "dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]",
                  alt: secondPerson.name
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white", children: secondPerson.fullName }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400", children: secondPerson.parents })
            ] })
          ] }) })
        ] })
      ] })
    }
  );
};
const LoveStory$a = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "story",
      className: "dark:bg-darkBg relative overflow-hidden bg-slate-50 py-24 transition-colors duration-1000 md:py-40",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto max-w-5xl px-6", children: [
          /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "mb-24 space-y-6 text-center md:mb-32", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "text-accentDark dark:text-accent/30 mx-auto mb-4 h-6 w-6 animate-pulse" }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl tracking-tight text-slate-900 italic md:text-8xl dark:text-white", children: "Kisah Kami" }),
            /* @__PURE__ */ jsx("div", { className: "bg-accent/20 mx-auto h-[1px] w-20" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold tracking-[0.5em] text-slate-500 uppercase dark:text-slate-400", children: "Perjalanan dua hati menjadi satu tujuan" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 hidden h-full w-[1px] -translate-x-1/2 bg-slate-200 md:block dark:bg-white/10" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-16 md:space-y-24", children: config.loveStory.map((story, index) => /* @__PURE__ */ jsx(Reveal$b, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: `relative flex flex-col items-center gap-12 md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "dark:bg-darkSurface border-accent/20 dark:border-accent absolute left-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-colors duration-1000 md:flex", children: /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-1.5 w-1.5 animate-pulse rounded-full" }) }),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `editorial-card w-full rounded-[3rem] p-10 shadow-2xl md:w-[42%] md:p-14 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`,
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "text-accentDark dark:text-accent mb-6 block text-[11px] font-bold tracking-[0.4em] uppercase", children: story.date }),
                        /* @__PURE__ */ jsx("h3", { className: "mb-5 font-serif text-3xl font-bold tracking-tight text-slate-800 italic md:text-4xl dark:text-slate-100", children: story.title }),
                        /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed font-light text-slate-500 italic md:text-lg dark:text-slate-400", children: story.desc }),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `mt-8 flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`,
                            children: /* @__PURE__ */ jsx(Heart, { className: "text-accent/20 h-4 w-4" })
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            ) }, index)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-primary/5 pointer-events-none absolute top-1/2 left-0 -z-0 translate-x-[-20%] -translate-y-1/2 -rotate-12 font-serif text-[20rem] whitespace-nowrap italic dark:text-white/5", children: "Our Story Our Story Our Story" })
      ]
    }
  );
};
const EventDetails$a = () => {
  const { config, text } = useSettings();
  const [copiedEvent, setCopiedEvent] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const filteredEvents = config.events;
  const firstName = config.couple.groom.name;
  const secondName = config.couple.bride.name;
  const copyToClipboard = (address, eventId) => {
    navigator.clipboard.writeText(address);
    setCopiedEvent(eventId);
    setTimeout(() => setCopiedEvent(null), 2e3);
  };
  const handleCalendarAction = (type, ev) => {
    const event = {
      title: `${ev.title} ${firstName} & ${secondName}`,
      description: `Menghadiri ${ev.title} pernikahan ${firstName} & ${secondName}.`,
      location: ev.venue.address,
      startTime: ev.startDateTime,
      endTime: ev.endDateTime
    };
    if (type === "google") {
      window.open(generateGoogleCalendarUrl(event), "_blank");
    } else {
      downloadICS(event);
    }
    setActiveDropdown(null);
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "event",
      className: "bg-secondary/30 dark:bg-darkBg px-4 py-20 transition-colors duration-1000 md:px-6 md:py-40",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl", children: [
        /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "mb-16 space-y-4 text-center md:mb-24 md:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12" }),
            /* @__PURE__ */ jsx(Sparkles, { className: "text-accentDark dark:text-accent h-5 w-5 animate-pulse md:h-6 md:w-6" }),
            /* @__PURE__ */ jsx("div", { className: "bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12" })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white", children: "Waktu & Tempat" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl px-4 text-base font-light text-balance text-slate-500 italic md:text-xl dark:text-slate-400", children: text.invitation })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: `grid gap-8 md:gap-10 ${filteredEvents.length === 1 ? "max-w-lg mx-auto" : "md:grid-cols-2"}`, children: filteredEvents.map((ev, index) => {
          const mapUrl = ev.venue.mapsEmbedUrl;
          return /* @__PURE__ */ jsx(Reveal$b, { delay: index * 0.2, children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "editorial-card dark:bg-darkSurface group relative flex flex-col overflow-visible rounded-[2.5rem] bg-white md:rounded-[4rem]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "bg-accentDark/10 dark:bg-accent/10 text-accentDark dark:text-accent animate-float absolute -top-4 -right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 backdrop-blur-md md:-top-6 md:-right-6 md:h-16 md:w-16 dark:border-white/5", children: index === 0 ? /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5 fill-current md:h-7 md:w-7" }) : /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 md:h-7 md:w-7" }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-8 text-center md:space-y-12 md:p-12", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:space-y-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-accentDark dark:text-accent text-[9px] font-bold uppercase md:text-[10px]", children: "Our Sacred Day" }),
                    /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl leading-tight text-slate-900 italic md:text-5xl dark:text-white", children: ev.title })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full space-y-6 border-y border-slate-100 py-8 md:space-y-8 md:py-10 dark:border-white/5", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center gap-3 font-serif text-xl text-slate-700 italic md:text-2xl dark:text-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "text-accentDark dark:text-accent h-5 w-5 md:h-6 md:w-6" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        ev.day,
                        ", ",
                        ev.date
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "tracking-editorial flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400 uppercase md:gap-4 md:text-[12px] dark:text-slate-500", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "text-accentDark dark:text-accent h-4 w-4 md:h-5 md:w-5" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        ev.startTime,
                        " — ",
                        ev.endTime,
                        " WIB"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setActiveDropdown(activeDropdown === ev.id ? null : ev.id),
                        className: "bg-primary dark:bg-accentDark tracking-editorial flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[10px] font-bold text-white uppercase transition-all hover:shadow-2xl active:scale-95 md:gap-5 md:rounded-3xl md:py-5 md:text-[11px]",
                        children: [
                          /* @__PURE__ */ jsx(CalendarPlus, { className: "h-4 w-4 md:h-5 md:w-5" }),
                          "Save The Date",
                          /* @__PURE__ */ jsx(
                            ChevronDown,
                            {
                              className: `h-3 w-3 transition-transform duration-500 md:h-4 md:w-4 ${activeDropdown === ev.id ? "rotate-180" : ""}`
                            }
                          )
                        ]
                      }
                    ),
                    activeDropdown === ev.id && /* @__PURE__ */ jsxs("div", { className: "frosted-glass animate-reveal absolute top-full right-0 left-0 z-[50] mt-3 overflow-hidden rounded-[1.5rem] border border-slate-200 p-2 shadow-2xl md:mt-4 md:rounded-[2rem] md:p-3 dark:border-white/10", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => handleCalendarAction("google", ev),
                          className: "flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left text-slate-800 transition-colors hover:bg-slate-50 md:gap-5 md:rounded-2xl md:px-8 md:py-5 dark:text-white dark:hover:bg-white/5",
                          children: [
                            /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-2 w-2 animate-pulse rounded-full md:h-3 md:w-3" }),
                            /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-[10px] font-bold uppercase md:text-[11px]", children: "Google Calendar" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => handleCalendarAction("ics", ev),
                          className: "flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left text-slate-800 transition-colors hover:bg-slate-50 md:gap-5 md:rounded-2xl md:px-8 md:py-5 dark:text-white dark:hover:bg-white/5",
                          children: [
                            /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-slate-300 md:h-3 md:w-3 dark:bg-slate-600" }),
                            /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-[10px] font-bold uppercase md:text-[11px]", children: "Apple / Outlook" })
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-6 border-t border-slate-100 p-8 md:space-y-8 md:p-12 dark:border-white/5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 md:items-center md:gap-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-accentDark dark:text-accent flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-lg md:h-14 md:w-14 dark:border-white/10 dark:bg-white/5", children: /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 md:h-7 md:w-7" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-serif text-xl leading-tight tracking-tight text-slate-900 italic md:text-2xl dark:text-white", children: ev.venue.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm leading-snug font-light text-slate-500 italic md:text-base dark:text-slate-400", children: ev.venue.address })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => copyToClipboard(ev.venue.address, ev.id),
                        className: "tracking-editorial flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[9px] font-bold text-slate-700 uppercase transition-all hover:bg-slate-50 md:rounded-2xl md:py-4 md:text-[10px] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5",
                        children: [
                          copiedEvent === ev.id ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx(Copy, { className: "text-accentDark dark:text-accent h-4 w-4" }),
                          copiedEvent === ev.id ? "Copied" : "Copy"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: ev.venue.mapsEmbedUrl.replace("&output=embed", ""),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "bg-primary dark:text-primary tracking-editorial flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[9px] font-bold text-white uppercase transition-all hover:shadow-2xl md:rounded-2xl md:py-4 md:text-[10px] dark:bg-white",
                        children: [
                          /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }),
                          "Maps"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative h-[200px] overflow-hidden rounded-2xl border border-slate-100 shadow-lg md:h-[250px] md:rounded-3xl dark:border-white/10", children: [
                    /* @__PURE__ */ jsx(
                      "iframe",
                      {
                        src: mapUrl,
                        width: "100%",
                        height: "100%",
                        style: { border: 0 },
                        className: "contrast-125 grayscale-[0.3] transition-all hover:grayscale-0 dark:opacity-80",
                        allowFullScreen: true,
                        loading: "lazy",
                        referrerPolicy: "no-referrer-when-downgrade"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "dark:border-darkSurface/5 pointer-events-none absolute inset-0 border-[4px] border-white/5 md:border-[6px]" })
                  ] })
                ] })
              ]
            }
          ) }, ev.id);
        }) })
      ] })
    }
  );
};
const Gallery$b = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [side, setSide] = useState("pria");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "wanita") setSide("wanita");
  }, []);
  const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
  const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "dark:bg-darkBg bg-white py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-accentDark/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6 md:space-y-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 opacity-30", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16" }),
          /* @__PURE__ */ jsx(Image, { className: "h-5 w-5 md:h-8 md:w-8" }),
          /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white leading-none capitalize", children: "Our Gallery" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-luxury text-[10px] font-black text-balance text-slate-400 uppercase italic md:text-[13px] dark:text-slate-500", children: "Momen-momen indah yang terpatri abadi dalam perjalanan cinta kami" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$b, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-10 h-10 rounded-full bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-accent hover:text-white dark:hover:bg-accent transition-all shadow-lg active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-accent scale-110 shadow-xl z-20" : "border-transparent opacity-40 grayscale hover:opacity-80 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-10 h-10 rounded-full bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-accent hover:text-white dark:hover:bg-accent transition-all shadow-lg active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 20 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$b, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[500px] mx-auto rounded-[3rem] sm:rounded-[4.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.1 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { duration: 1.2, ease: "easeInOut" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer",
            alt: "Featured Gallery",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-white/20",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl px-4 sm:px-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-[2010]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 24, className: "sm:size-10", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center p-2 sm:p-4", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-white/50 hover:text-white transition-colors z-[2010]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 32, className: "sm:size-16", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
              motion.img,
              {
                initial: { opacity: 0, scale: 0.9, x: 20 },
                animate: { opacity: 1, scale: 1, x: 0 },
                exit: { opacity: 0, scale: 1.1, x: -20 },
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                src: config.galleryImages[selectedImg],
                className: "max-h-[85vh] w-auto h-auto object-contain rounded-2xl md:rounded-[4rem] shadow-2xl border border-white/10",
                alt: "Fullscreen Moment"
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-white/50 hover:text-white transition-colors z-[2010]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 32, className: "sm:size-16", strokeWidth: 1 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full", children: /* @__PURE__ */ jsxs("p", { className: "font-serif text-white italic text-sm sm:text-lg", children: [
              "Moment ",
              selectedImg + 1,
              " / ",
              config.galleryImages.length
            ] }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-white/40 text-[10px] uppercase tracking-widest", children: [
              "The Wedding of ",
              firstName,
              " & ",
              secondName
            ] })
          ] })
        ]
      }
    ) })
  ] });
};
const RSVPForm$a = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmitRSVP = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
  const handleGuestCountChange = (operation) => {
    setFormData((prev) => {
      const current = prev.guest_count;
      let next = current;
      if (operation === "inc" && current < MAX_GUESTS) next = current + 1;
      if (operation === "dec" && current > 1) next = current - 1;
      return { ...prev, guest_count: next };
    });
  };
  const rsvpStats = {
    hadir: rsvps.filter((r) => r.attendance === AttendanceStatus.HADIR).reduce((total, r) => total + (r.guest_count || 1), 0),
    ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
    tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR).length
  };
  const getStatusColorClass = (status) => {
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
  const currentRSVPsList = React__default.useMemo(() => {
    const start = (currentPage - 1) * rsvpsPerPage;
    const sorted = [...rsvps].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    return sorted.slice(start, start + rsvpsPerPage);
  }, [rsvps, currentPage]);
  const handleRSVPPaginate = (pageNumber) => {
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
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "rsvp",
      className: "dark:bg-darkBg bg-white py-16 transition-colors duration-1000 md:py-40",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl px-4 md:px-6", children: [
          /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "mb-12 space-y-3 text-center md:mb-24", children: [
            /* @__PURE__ */ jsx(Heart, { className: "text-accentDark dark:text-accent/30 mx-auto mb-2 h-5 w-5 animate-pulse" }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl tracking-tight text-slate-900 italic md:text-8xl dark:text-white", children: "Reservasi" }),
            /* @__PURE__ */ jsx("p", { className: "tracking-luxury text-[9px] font-bold text-slate-400 uppercase md:text-[10px] dark:text-slate-500", children: "Mohon konfirmasi kehadiran Anda" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid items-stretch gap-8 md:gap-14 lg:grid-cols-12", children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-6 lg:col-span-5", children: /* @__PURE__ */ jsx("div", { className: "editorial-card group relative flex h-full flex-col justify-center overflow-hidden rounded-[1.5rem] p-6 shadow-lg md:rounded-[3.5rem] md:p-14", children: submitted ? /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-6 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl text-slate-900 italic md:text-4xl dark:text-white", children: "Terima Kasih!" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-slate-500 md:text-base dark:text-slate-400", children: "Konfirmasi kehadiran Anda telah berhasil kami simpan." })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSubmitted(false),
                  className: "inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10",
                  children: [
                    /* @__PURE__ */ jsx(RefreshCcw, { className: "h-3 w-3" }),
                    "Edit Kembali"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "bg-accentDark/5 dark:bg-accent/5 pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full transition-transform duration-1000 group-hover:scale-110" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-8 md:space-y-12", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-10 dark:border-white/5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-accentDark dark:text-accent flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 md:h-16 md:w-16 md:rounded-2xl dark:border-white/10 dark:bg-white/5", children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 md:h-8 md:w-8" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-serif text-lg leading-none text-slate-900 italic md:text-2xl dark:text-white", children: "Konfirmasi" }),
                    /* @__PURE__ */ jsx("p", { className: "tracking-editorial mt-1.5 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]", children: "Lengkapi data Anda" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "form",
                  {
                    onSubmit: handleSubmitRSVP,
                    className: "space-y-6 md:space-y-10",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-6 md:space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "group/input relative", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              required: true,
                              type: "text",
                              disabled: isNameLocked,
                              className: `focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white ${isNameLocked ? "cursor-not-allowed text-slate-500 opacity-60" : ""}`,
                              placeholder: "Nama Tamu",
                              value: formData.guest_name,
                              onChange: (e) => setFormData({
                                ...formData,
                                guest_name: e.target.value
                              })
                            }
                          ),
                          /* @__PURE__ */ jsxs("label", { className: "tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]", children: [
                            "Nama ",
                            isNameLocked && "(Locked)"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "group/input relative", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              className: "focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white",
                              placeholder: "WhatsApp / Phone",
                              value: formData.phone,
                              onChange: (e) => setFormData({
                                ...formData,
                                phone: e.target.value
                              })
                            }
                          ),
                          /* @__PURE__ */ jsx("label", { className: "tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]", children: "Kontak" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "group/input relative mt-8", children: [
                        /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            className: "focus:border-accentDark dark:focus:border-accent w-full resize-none border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white",
                            placeholder: "Pesan untuk mempelai (Opsional)",
                            rows: 2,
                            value: formData.message,
                            onChange: (e) => setFormData({
                              ...formData,
                              message: e.target.value
                            })
                          }
                        ),
                        /* @__PURE__ */ jsx("label", { className: "tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]", children: "Pesan" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsx("p", { className: "tracking-editorial text-[8px] font-bold text-slate-400 uppercase md:text-[9px]", children: "Stiker (Opsional)" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => setShowStickerPicker(true),
                              className: "flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5",
                              children: [
                                /* @__PURE__ */ jsx(Smile, { className: "h-5 w-5" }),
                                /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Pilih Stiker" })
                              ]
                            }
                          ),
                          formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative animate-reveal", children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: formData.sticker.src,
                                alt: "Selected sticker",
                                className: "h-14 w-14 rounded-lg object-contain"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setFormData({ ...formData, sticker: null }),
                                className: "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110",
                                children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                              }
                            )
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:space-y-6", children: [
                        /* @__PURE__ */ jsx("p", { className: "tracking-editorial mb-1 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]", children: "Status Kehadiran" }),
                        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: [
                          AttendanceStatus.HADIR,
                          AttendanceStatus.TIDAK_HADIR,
                          AttendanceStatus.RAGU
                        ].map((status) => /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setFormData({ ...formData, attendance: status }),
                            className: `tracking-editorial group flex items-center justify-between rounded-lg border px-5 py-3.5 text-[9px] font-bold uppercase transition-all md:rounded-2xl md:py-5 md:text-[11px] ${formData.attendance === status ? "bg-primary dark:text-primary border-primary text-white shadow-md dark:border-white dark:bg-white" : "border-slate-100 text-slate-400 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5"}`,
                            children: [
                              status.replace("_", " "),
                              formData.attendance === status && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 md:h-5 md:w-5" })
                            ]
                          },
                          status
                        )) })
                      ] }),
                      formData.attendance === AttendanceStatus.HADIR && /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-3", children: [
                        /* @__PURE__ */ jsxs("p", { className: "tracking-editorial mb-1 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]", children: [
                          "Jumlah Tamu (Max ",
                          MAX_GUESTS,
                          ")"
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleGuestCountChange("dec"),
                              className: "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5",
                              disabled: formData.guest_count <= 1,
                              children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 border-b border-slate-100 pb-1 text-center font-serif text-xl italic md:text-2xl dark:border-white/5", children: [
                            formData.guest_count,
                            " Orang"
                          ] }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleGuestCountChange("inc"),
                              className: "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5",
                              disabled: formData.guest_count >= MAX_GUESTS,
                              children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          disabled: isSubmitting,
                          type: "submit",
                          className: "bg-primary dark:bg-accentDark tracking-luxury group flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-[9px] font-bold text-white uppercase shadow-sm transition-all duration-700 hover:shadow-xl active:scale-95 disabled:opacity-50 md:rounded-3xl md:py-6 md:text-[11px]",
                          children: [
                            isSubmitting ? "Sending..." : isNameLocked ? "Update RSVP" : "Send RSVP",
                            /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-5 md:w-5" })
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:col-span-7", children: [
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 md:gap-6", children: [
                {
                  label: "Hadir",
                  count: rsvpStats.hadir,
                  color: "text-green-600 dark:text-green-400"
                },
                {
                  label: "Ragu",
                  count: rsvpStats.ragu,
                  color: "text-slate-500 dark:text-slate-400"
                },
                {
                  label: "Maaf",
                  count: rsvpStats.tidak,
                  color: "text-red-500 dark:text-red-400"
                }
              ].map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "editorial-card flex flex-col items-center justify-center space-y-2 rounded-[1.5rem] border border-slate-100 p-4 text-center md:rounded-[2.5rem] md:p-8 dark:border-white/5",
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `font-serif text-2xl font-bold md:text-5xl ${item.color}`,
                        children: item.count
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold tracking-widest uppercase opacity-60 md:text-[10px]", children: item.label })
                  ]
                },
                idx
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "editorial-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 p-6 shadow-lg md:rounded-[4rem] md:p-14 dark:border-white/5", children: [
                /* @__PURE__ */ jsx("div", { className: "from-accent/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50" }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-shrink-0 items-center justify-between", children: [
                    /* @__PURE__ */ jsx("h3", { id: "guest-list-header", className: "font-serif text-xl text-slate-900 italic md:text-3xl dark:text-white", children: "Daftar Tamu" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-50", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                      /* @__PURE__ */ jsx("span", { children: "Terbaru" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-grow", children: rsvps.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center opacity-40", children: [
                    /* @__PURE__ */ jsx(Users, { className: "mb-2 h-8 w-8" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs tracking-widest uppercase", children: "Belum ada data" })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: currentRSVPsList.map((rsvp) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "editorial-card animate-reveal space-y-4 rounded-2xl p-5",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
                              /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300", children: rsvp.guest_name.charAt(0).toUpperCase() }),
                              /* @__PURE__ */ jsx("span", { className: "truncate font-serif text-base text-slate-800 italic dark:text-slate-200", children: rsvp.guest_name })
                            ] }),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `text-xs font-bold uppercase ${getStatusColorClass(
                                  rsvp.attendance
                                )}`,
                                children: rsvp.attendance.replace("_", " ")
                              }
                            )
                          ] }),
                          rsvp.attendance === AttendanceStatus.HADIR && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/5 dark:text-slate-500", children: [
                            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
                            /* @__PURE__ */ jsxs("span", { children: [
                              "Datang ber-",
                              rsvp.guest_count
                            ] })
                          ] })
                        ]
                      },
                      rsvp.id
                    )) }),
                    totalRSVPPages > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleRSVPPaginate(Math.max(1, currentPage - 1)),
                          disabled: currentPage === 1,
                          className: "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5",
                          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: getRSVPPaneNumbers().map((pageNum) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleRSVPPaginate(pageNum),
                          className: `h-8 w-8 rounded-full text-xs transition-all ${currentPage === pageNum ? "bg-primary text-white shadow-md dark:bg-white dark:text-slate-900" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
                          children: pageNum
                        },
                        pageNum
                      )) }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleRSVPPaginate(Math.min(totalRSVPPages, currentPage + 1)),
                          disabled: currentPage === totalRSVPPages,
                          className: "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5",
                          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                        }
                      )
                    ] })
                  ] }) })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          StickerPicker$1,
          {
            isOpen: showStickerPicker,
            onClose: () => setShowStickerPicker(false),
            onSelect: (sticker) => setFormData({ ...formData, sticker }),
            selectedSticker: formData.sticker?.id || null
          }
        )
      ]
    }
  );
};
const Wishes$a = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
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
  const handleSubmitWish = async (e) => {
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
      setTimeout(() => setPostSuccess(false), 3e3);
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
  const handleWishPaginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const header = document.getElementById("wishes-header");
    if (header) {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const getWishPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalWishesPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "wishes",
      className: "bg-secondary/30 dark:bg-darkBg py-24 transition-colors duration-1000 md:py-48",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl px-6", children: [
        /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs(
          "div",
          {
            id: "wishes-header",
            className: "mb-20 space-y-6 text-center md:mb-32 md:space-y-10",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 opacity-40", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-[1px] w-12 md:w-24" }),
                /* @__PURE__ */ jsx(Sparkles, { className: "text-accentDark dark:text-accent h-6 w-6 animate-pulse md:h-10 md:w-10" }),
                /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent h-[1px] w-12 md:w-24" })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl leading-none tracking-tighter text-slate-900 italic md:text-[10rem] dark:text-white", children: "Prayers & Wishes" }),
              /* @__PURE__ */ jsx("p", { className: "tracking-luxury text-[10px] font-black text-balance text-slate-400 uppercase italic md:text-[14px] dark:text-slate-500", children: "Untaian doa dan harapan tulus dari orang-orang tersayang" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-10 md:gap-24 lg:grid-cols-12", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:sticky lg:top-32 lg:col-span-4", children: /* @__PURE__ */ jsxs("div", { className: "frosted-glass group relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 p-8 shadow-2xl md:rounded-[4rem] md:p-14 dark:border-white/5", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-accent/5 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl transition-transform duration-[3s] group-hover:scale-125" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-10 md:space-y-16", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-accentDark dark:text-accent text-[10px] font-black uppercase md:text-[12px]", children: "Guest Book" }),
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl text-slate-900 italic md:text-5xl dark:text-white", children: "Kirim Ucapan" })
              ] }),
              /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSubmitWish,
                  className: "space-y-8 md:space-y-14",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-8 md:space-y-12", children: [
                      /* @__PURE__ */ jsxs("div", { className: "group/input relative", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            required: true,
                            type: "text",
                            disabled: isNameLocked,
                            className: `focus:border-accentDark dark:focus:border-accent w-full border-b-2 border-slate-100 bg-transparent py-3 font-serif text-lg text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-6 md:text-2xl dark:border-white/5 dark:text-white dark:placeholder:text-slate-800 ${isNameLocked ? "cursor-not-allowed opacity-60" : ""}`,
                            placeholder: "Nama Lengkap",
                            value: name,
                            onChange: (e) => setName(e.target.value)
                          }
                        ),
                        /* @__PURE__ */ jsxs("label", { className: "absolute -top-4 left-0 text-[8px] font-black tracking-widest text-slate-400 uppercase md:text-[10px]", children: [
                          "Your Name ",
                          isNameLocked && "(Locked)"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "group/input relative", children: [
                        /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            required: true,
                            className: "focus:border-accentDark dark:focus:border-accent h-32 w-full resize-none border-b-2 border-slate-100 bg-transparent py-3 font-serif text-lg leading-relaxed text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:h-52 md:py-6 md:text-2xl dark:border-white/5 dark:text-white dark:placeholder:text-slate-800",
                            placeholder: "Tuliskan harapan terbaik Anda...",
                            value: message,
                            onChange: (e) => setMessage(e.target.value)
                          }
                        ),
                        /* @__PURE__ */ jsx("label", { className: "absolute -top-4 left-0 text-[8px] font-black tracking-widest text-slate-400 uppercase md:text-[10px]", children: "Your Message" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        disabled: isSending || postSuccess,
                        type: "submit",
                        className: `tracking-luxury group/btn flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-[9px] font-bold text-white uppercase shadow-sm transition-all duration-700 hover:shadow-xl active:scale-95 disabled:opacity-50 md:rounded-3xl md:py-6 md:text-[11px] ${postSuccess ? "cursor-default bg-green-500" : "bg-primary dark:bg-accentDark"}`,
                        children: [
                          isSending ? "Sending..." : postSuccess ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            "Success ",
                            /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 md:h-5 md:w-5" })
                          ] }) : isNameLocked ? "Update Message" : "Send Message",
                          !isSending && !postSuccess && /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 md:h-5 md:w-5" })
                        ]
                      }
                    )
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-12 md:space-y-20 lg:col-span-8", children: [
            currentWishesList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-12 text-center md:rounded-[4rem] md:p-20 dark:border-white/10 dark:bg-white/5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-accent/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 md:h-28 md:w-28 dark:bg-white/5", children: /* @__PURE__ */ jsx(Quote, { className: "h-10 w-10 md:h-14 md:w-14" }) }),
              /* @__PURE__ */ jsx("h4", { className: "mb-2 font-serif text-2xl text-slate-400 italic md:text-4xl dark:text-slate-500", children: "Belum Ada Ucapan" }),
              /* @__PURE__ */ jsx("p", { className: "max-w-sm text-sm text-slate-400 md:text-base dark:text-slate-500", children: "Jadilah yang pertama mengirimkan doa dan harapan terbaik untuk kedua mempelai" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10", children: currentWishesList.map((wish) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "editorial-card group dark:bg-darkSurface animate-reveal flex flex-col rounded-[2.5rem] border border-slate-50 bg-white p-8 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl md:rounded-[4rem] md:p-14 dark:border-white/5",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-grow space-y-6 md:space-y-10", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-accentDark/20 dark:text-accent/20 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 md:h-16 md:w-16 md:rounded-3xl dark:border-white/10 dark:bg-white/5", children: /* @__PURE__ */ jsx(Quote, { className: "h-6 w-6 md:h-8 md:w-8" }) }),
                      /* @__PURE__ */ jsx(Heart, { className: "text-accent/10 dark:text-accent/20 h-4 w-4 transition-transform duration-700 group-hover:scale-125 md:h-6 md:w-6" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "font-serif text-lg leading-[1.4] text-balance text-slate-700 italic md:text-3xl dark:text-slate-200", children: [
                      '"',
                      wish.message,
                      '"'
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center gap-4 border-t border-slate-50 pt-6 md:mt-16 md:gap-6 md:pt-10 dark:border-white/5", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-accentDark dark:text-accent flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 text-[12px] font-black shadow-inner md:h-16 md:w-16 md:rounded-3xl md:text-[18px] dark:border-white/10 dark:from-white/5 dark:to-white/10", children: wish.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col", children: [
                      /* @__PURE__ */ jsx("span", { className: "truncate text-[10px] font-black tracking-widest text-slate-900 uppercase md:text-[14px] dark:text-slate-100", children: wish.name }),
                      /* @__PURE__ */ jsx("span", { className: "mt-1 text-[8px] font-bold tracking-widest text-slate-400 uppercase md:text-[10px] dark:text-slate-500", children: new Date(wish.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }) })
                    ] })
                  ] })
                ]
              },
              wish.id
            )) }),
            totalWishesPages > 1 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-8 md:gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 md:gap-6", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleWishPaginate(Math.max(1, currentPage - 1)),
                  disabled: currentPage === 1,
                  className: "hover:border-accentDark hover:text-accentDark flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 shadow-lg transition-all hover:bg-white active:scale-90 disabled:opacity-10 md:h-20 md:w-20 dark:border-white/10 dark:hover:bg-white/5",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6 md:h-10 md:w-10" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 rounded-full border border-white/20 bg-white/50 px-4 py-2 shadow-inner backdrop-blur-xl md:gap-4 dark:border-white/10 dark:bg-white/5", children: getWishPageNumbers().map((pageNum) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleWishPaginate(pageNum),
                  className: `h-10 w-10 rounded-full font-serif text-lg transition-all duration-700 md:h-16 md:w-16 md:text-3xl ${currentPage === pageNum ? "bg-primary dark:bg-accentDark z-10 scale-110 text-white shadow-2xl" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
                  children: pageNum
                },
                pageNum
              )) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleWishPaginate(Math.min(totalWishesPages, currentPage + 1)),
                  disabled: currentPage === totalWishesPages,
                  className: "hover:border-accentDark hover:text-accentDark flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 shadow-lg transition-all hover:bg-white active:scale-90 disabled:opacity-10 md:h-20 md:w-20 dark:border-white/10 dark:hover:bg-white/5",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 md:h-10 md:w-10" })
                }
              )
            ] }) })
          ] })
        ] })
      ] })
    }
  );
};
const GiftInfo$a = () => {
  const { config, text } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const handleCopyAction = (text2, id) => {
    navigator.clipboard.writeText(text2);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "gift",
      className: "dark:bg-darkBg bg-white py-16 transition-colors duration-1000 md:py-40",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl px-4 md:px-6", children: [
        /* @__PURE__ */ jsx(Reveal$b, { children: /* @__PURE__ */ jsxs("div", { className: "mb-12 space-y-4 text-center md:mb-24 md:space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-accentDark dark:text-accent mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-md md:mb-12 md:h-20 md:w-20 md:rounded-[2rem] dark:border-white/5 dark:bg-white/5", children: /* @__PURE__ */ jsx(Gift, { className: "h-6 w-6 md:h-10 md:w-10" }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white", children: text.gift.title }),
          /* @__PURE__ */ jsx("div", { className: "bg-accent/30 mx-auto h-[1px] w-16" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xl text-base leading-relaxed font-light text-balance text-slate-500 italic md:text-2xl dark:text-slate-400", children: text.gift.desc })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mb-10 grid grid-cols-1 gap-5 md:mb-20 md:grid-cols-2 md:gap-14", children: config.bankAccounts.map((acc, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "editorial-card group relative space-y-6 overflow-hidden rounded-[1.5rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-lg md:space-y-12 md:rounded-[4.5rem] md:p-20 dark:border-white/5",
            children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "text-accentDark/5 dark:text-accent/5 pointer-events-none absolute -top-10 -right-10 h-32 w-32 rotate-12 transition-transform duration-[3s] group-hover:scale-110 md:-top-16 md:-right-16 md:h-64 md:w-64" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-6 text-center md:space-y-12 md:text-left", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:space-y-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2.5 md:justify-start", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-accent h-1.5 w-1.5 animate-pulse rounded-full" }),
                    /* @__PURE__ */ jsx("p", { className: "text-accentDark dark:text-accent tracking-luxury text-[9px] font-bold uppercase md:text-[12px]", children: acc.bank })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl leading-none tracking-tighter break-all text-slate-900 md:text-7xl dark:text-white", children: acc.number }),
                  /* @__PURE__ */ jsxs("p", { className: "tracking-editorial text-[10px] font-medium text-slate-400 uppercase italic md:text-[14px] dark:text-slate-500", children: [
                    "A/N ",
                    acc.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleCopyAction(acc.number, `bank-${idx}`),
                    className: `tracking-editorial inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[9px] font-bold uppercase shadow-md transition-all md:w-auto md:gap-5 md:px-12 md:py-6 md:text-[12px] ${copiedId === `bank-${idx}` ? "bg-green-500 text-white" : "bg-primary dark:text-primary text-white active:scale-95 dark:bg-white"}`,
                    children: [
                      copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 md:h-5 md:w-5" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5 md:h-5 md:w-5" }),
                      copiedId === `bank-${idx}` ? "Berhasil" : "Salin Nomor"
                    ]
                  }
                )
              ] })
            ]
          },
          idx
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "editorial-card group relative flex flex-col items-center gap-6 overflow-hidden rounded-[1.5rem] border border-slate-100 p-6 text-center shadow-md transition-all duration-1000 md:flex-row md:gap-14 md:rounded-[5rem] md:p-20 md:text-left dark:border-white/5", children: [
          /* @__PURE__ */ jsx("div", { className: "from-accent/5 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100" }),
          /* @__PURE__ */ jsx("div", { className: "text-accentDark dark:text-accent animate-float flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 shadow-sm md:h-28 md:w-28 dark:border-white/10 dark:bg-white/5", children: /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 md:h-12 md:w-12" }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex-grow space-y-1.5 md:space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-accentDark dark:text-accent flex items-center justify-center gap-2.5 md:justify-start", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 md:h-5 md:w-5" }),
              /* @__PURE__ */ jsx("h4", { className: "font-serif text-xl tracking-tight italic md:text-5xl", children: "Kirim Kado Fisik" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed font-light text-balance text-slate-500 italic md:text-2xl dark:text-slate-400", children: config.giftAddress || "Alamat belum diatur" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleCopyAction(config.giftAddress, "address-gift"),
              className: `tracking-luxury relative z-10 inline-flex w-full items-center justify-center gap-3 rounded-xl px-8 py-3.5 text-[9px] font-bold uppercase shadow-md transition-all md:w-auto md:rounded-[2.5rem] md:px-14 md:py-6 md:text-[12px] ${copiedId === "address-gift" ? "bg-green-500 text-white" : "bg-primary dark:text-primary text-white active:scale-95 dark:bg-white"}`,
              children: [
                copiedId === "address-gift" ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 md:h-6 md:w-6" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4 md:h-6 md:w-6" }),
                "Salin Alamat"
              ]
            }
          )
        ] })
      ] })
    }
  );
};
const Navbar$b = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "couple", icon: Heart, label: "Couple" },
    { id: "event", icon: Calendar, label: "Event" },
    { id: "gallery", icon: Camera, label: "Gallery" },
    { id: "rsvp", icon: MessageCircle, label: "RSVP" },
    { id: "gift", icon: Gift, label: "Gift" }
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
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: `fixed bottom-8 left-1/2 z-[1100] -translate-x-1/2 transition-all duration-700 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`,
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 dark:bg-slate-900/95 backdrop-blur-md px-3 py-3 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-1 md:gap-8 md:px-6 md:py-4", children: [
        navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: `#${item.id}`,
              onClick: (e) => {
                e.preventDefault();
                scrollToSection(item.id);
              },
              className: `group relative flex flex-col items-center gap-1 px-2 py-1 transition-all duration-300 ${isActive ? "text-accentDark dark:text-accent scale-110" : "text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { size: 18, className: `transition-transform duration-300 ${isActive ? "" : "group-hover:-translate-y-1"}` }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full whitespace-nowrap text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 shadow-xl pointer-events-none", children: item.label }),
                isActive && /* @__PURE__ */ jsx("div", { className: "bg-accentDark dark:bg-accent absolute -bottom-1 h-1 w-1 rounded-full md:h-1.5 md:w-1.5" })
              ]
            },
            item.id
          );
        }),
        /* @__PURE__ */ jsx("div", { className: "mx-1 h-6 w-[1px] bg-slate-200 dark:bg-white/10 md:mx-2" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: toggleTheme,
            className: "group relative flex flex-col items-center gap-1 px-2 py-1 text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all duration-300",
            "aria-label": "Toggle theme",
            children: [
              theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 18, className: "transition-transform duration-500 group-hover:rotate-12" }) : /* @__PURE__ */ jsx(Sun, { size: 18, className: "transition-transform duration-500 group-hover:rotate-90" }),
              /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full whitespace-nowrap text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 shadow-xl pointer-events-none", children: theme === "light" ? "Dark Mode" : "Light Mode" })
            ]
          }
        )
      ] })
    }
  );
};
const LuxuryTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
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
  return /* @__PURE__ */ jsxs("div", { className: "selection:bg-accent/30 selection:text-primary relative min-h-screen overflow-x-hidden", children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$b, { onOpen }),
    /* @__PURE__ */ jsx(InstallPrompt, {}),
    /* @__PURE__ */ jsx(FloatingPetals, {}),
    /* @__PURE__ */ jsx(Hero$a, {}),
    /* @__PURE__ */ jsxs("main", { className: "relative z-10 space-y-0", children: [
      /* @__PURE__ */ jsx(CoupleProfile$a, {}),
      /* @__PURE__ */ jsx(LoveStory$a, {}),
      /* @__PURE__ */ jsx(EventDetails$a, {}),
      /* @__PURE__ */ jsx(Gallery$b, {}),
      /* @__PURE__ */ jsx(RSVPForm$a, {}),
      /* @__PURE__ */ jsx(Wishes$a, {}),
      /* @__PURE__ */ jsx(GiftInfo$a, {})
    ] }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$b, { theme, toggleTheme }),
    /* @__PURE__ */ jsxs("footer", { className: "dark:bg-darkSurface relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 transition-colors duration-1000", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10 dark:opacity-[0.05]", children: /* @__PURE__ */ jsx(Heart, { className: "animate-pulse-soft h-[85vw] w-[85vw] stroke-[0.3]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto flex max-w-4xl flex-col items-center gap-12 md:gap-24", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: scrollToTop,
            className: "group flex flex-col items-center gap-4 transition-transform duration-500 hover:scale-105",
            children: [
              /* @__PURE__ */ jsx("div", { className: "border-accent/40 text-accentDark dark:text-accent group-hover:bg-accent/10 flex h-12 w-12 items-center justify-center rounded-full border shadow-2xl transition-colors md:h-16 md:w-16", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-6 w-6 animate-bounce md:h-8 md:w-8" }) }),
              /* @__PURE__ */ jsx("span", { className: "tracking-luxury text-[10px] font-bold uppercase opacity-40 transition-opacity group-hover:opacity-100", children: "Sampai Jumpa di Hari Bahagia Kami" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center md:space-y-12", children: [
          /* @__PURE__ */ jsx(Heart, { className: "text-accent/60 mx-auto h-8 w-8 animate-pulse fill-current md:h-12 md:w-12" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-serif text-6xl leading-[0.85] tracking-tighter text-slate-900 italic drop-shadow-xl sm:text-8xl md:text-[12rem] dark:text-white", children: [
            config.couple.groom.name,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-accent/30", children: "&" }),
            " ",
            config.couple.bride.name
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 md:gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-accent/30 h-[1px] w-10 md:w-20" }),
            /* @__PURE__ */ jsx("p", { className: "text-accentDark dark:text-accent text-[12px] font-black tracking-[0.4em] uppercase italic md:text-[20px]", children: footerDate }),
            /* @__PURE__ */ jsx("div", { className: "bg-accent/30 h-[1px] w-10 md:w-20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 text-center md:space-y-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "group relative inline-block px-4", children: [
            /* @__PURE__ */ jsx(Quote, { className: "text-accentDark absolute -top-10 -left-2 h-12 w-12 rotate-180 opacity-[0.06] transition-transform duration-1000 md:-top-16 md:-left-12 md:h-24 md:w-24 dark:opacity-[0.12]" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("p", { className: "mx-auto max-w-2xl font-serif text-lg leading-relaxed text-balance text-slate-500 italic md:text-3xl dark:text-slate-400", children: [
                '"',
                text.closing.text,
                '"'
              ] }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-xl font-bold text-slate-800 dark:text-white", children: text.closing.salam })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 border-t border-slate-100 pt-16 md:gap-10 md:pt-28 dark:border-white/5", children: [
            /* @__PURE__ */ jsx("p", { className: "tracking-luxury text-[9px] font-black uppercase md:text-[13px]", children: text.closing.signature }),
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-lg italic", children: [
              config.couple.groom.name,
              " & ",
              config.couple.bride.name
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px]", children: config.closingFamily })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const Reveal$a = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$a = ({ onOpen }) => {
  const { config } = useSettings();
  const [guestName, setGuestName] = useState("");
  const [isAnimate, setIsAnimate] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);
    setTimeout(() => setIsAnimate(true), 300);
  }, []);
  const handleOpenClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 800);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `fixed inset-0 z-[2000] flex items-center justify-center bg-slate-50 transition-all duration-1000 ease-in-out dark:bg-slate-950 ${isExiting ? "pointer-events-none opacity-0 scale-110" : "opacity-100"}`,
      children: /* @__PURE__ */ jsx("div", { className: `max-w-md w-full px-8 text-center transition-all duration-1000 ${isAnimate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "tracking-[0.5em] text-xs uppercase text-slate-400", children: "The Wedding of" }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl font-light italic text-slate-900 dark:text-white", children: [
            config.couple.groom.name,
            " & ",
            config.couple.bride.name
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 border-y border-slate-100 dark:border-slate-800 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-slate-400", children: "Kepada Yth." }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-light dark:text-white", children: guestName || "Tamu Undangan" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleOpenClick,
            className: "inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-sm text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all group",
            children: [
              /* @__PURE__ */ jsx(MailOpen, { className: "w-4 h-4" }),
              "Buka Undangan"
            ]
          }
        )
      ] }) })
    }
  );
};
const Navbar$a = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-[1100] transition-all duration-500`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-xl", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        className: "p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors",
        children: /* @__PURE__ */ jsx(Home, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-[1px] h-4 bg-slate-200 dark:bg-slate-800" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleTheme,
        className: "p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors",
        children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" })
      }
    )
  ] }) });
};
const Gallery$a = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-1000 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-20", children: [
      /* @__PURE__ */ jsx(Reveal$a, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-slate-400", children: "Visual Journey" }),
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-9xl font-light italic text-slate-900 dark:text-white lowercase tracking-tighter transition-colors", children: "gallery" }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-[1px] bg-slate-900 dark:bg-white opacity-10" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$a, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center max-w-4xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-sm overflow-hidden transition-all duration-500 border-b-2 ${activeIndex === idx ? "border-slate-900 dark:border-white scale-105 shadow-lg grayscale-0 opacity-100" : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 20 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$a, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[400px] mx-auto rounded-sm overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group transition-all duration-1000", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 1.2, ease: "easeInOut" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer grayscale-[0.2] hover:grayscale-0 transition-all duration-1000",
            alt: "Gallery Highlight",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-8 bottom-12 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-700", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-white/95 dark:bg-slate-950/98 backdrop-blur-sm p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 32, strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[80px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.02 },
                transition: { duration: 0.4 },
                className: "relative max-h-full max-w-full flex items-center justify-center",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[85vh] w-auto h-auto object-contain rounded-sm shadow-2xl",
                      alt: "Gallery Fullscreen"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-16 flex items-center justify-center", children: /* @__PURE__ */ jsxs("p", { className: "font-light italic text-lg text-slate-400", children: [
                    selectedImg + 1,
                    " / ",
                    config.galleryImages.length
                  ] }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[80px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const MinimalistTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  const { config } = useSettings();
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `selection:bg-slate-200 bg-slate-50 dark:bg-slate-950 min-h-screen font-serif text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-1000 ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$a, { onOpen }),
    /* @__PURE__ */ jsx("section", { id: "hero", className: "h-screen flex flex-col items-center justify-center relative px-6 text-center", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-fadeIn", children: [
      /* @__PURE__ */ jsx("p", { className: "tracking-[0.5em] text-xs uppercase text-slate-400 dark:text-stone-500 transition-colors", children: "The Wedding of" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-8xl font-light italic text-slate-900 dark:text-white", children: [
        config.couple.groom.name,
        " & ",
        config.couple.bride.name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-20 w-[1px] bg-slate-200 dark:bg-slate-800 mx-auto transition-colors" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl tracking-widest", children: config.hero.date })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-4xl mx-auto px-6 space-y-32 py-32", children: [
      /* @__PURE__ */ jsxs("section", { id: "couple", className: "text-center space-y-12", children: [
        /* @__PURE__ */ jsx(Heart, { className: "mx-auto h-6 w-6 text-slate-300 dark:text-slate-700 transition-colors" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm shadow-sm", alt: config.couple.groom.fullName }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-light text-slate-900 dark:text-white", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-stone-400 transition-colors", children: config.couple.groom.parents })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm shadow-sm", alt: config.couple.bride.fullName }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-light text-slate-900 dark:text-white", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-stone-400 transition-colors", children: config.couple.bride.parents })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-white dark:bg-slate-900 p-12 text-center rounded-sm shadow-sm border border-slate-100 dark:border-white/5 transition-all duration-1000", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-light mb-8 italic text-slate-900 dark:text-white", children: "Detail Acara" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8", children: config.events.map((event, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "uppercase tracking-widest text-xs font-bold text-slate-400 dark:text-stone-500 transition-colors", children: event.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg", children: [
            event.day,
            ", ",
            event.date
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            event.startTime,
            " - ",
            event.endTime
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-8 bg-slate-100 dark:bg-slate-800 mx-auto transition-colors" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-stone-400 transition-colors", children: event.venue.address })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsx(Gallery$a, {})
    ] }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$a, { theme, toggleTheme }),
    /* @__PURE__ */ jsx("footer", { className: "py-20 text-center border-t border-slate-100 dark:border-white/5 transition-colors", children: /* @__PURE__ */ jsx("p", { className: "text-xs tracking-widest uppercase text-slate-400 opacity-50", children: "Created with Vowly" }) })
  ] });
};

const Reveal$9 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30, filter: "blur(10px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: false, margin: "-100px" },
      transition: { duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] },
      style: { position: "relative", width },
      className,
      children
    }
  );
};
const Envelope$9 = ({ onOpen }) => {
  const { config } = useSettings();
  const [guestName, setGuestName] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [side, setSide] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);
    const sideParam = params.get("side");
    setSide(sideParam || "pria");
  }, []);
  const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
  const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;
  const handleOpenClick = () => {
    setIsExiting(true);
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setTimeout(onOpen, 1500);
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !isExiting && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: {
        opacity: 0,
        transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }
      },
      className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ebe1] overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none", style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' } }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-lg px-4 sm:px-8 text-center space-y-8 sm:space-y-12", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 1, delay: 0.5 },
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsx("p", { className: "tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold text-[#8c7851] uppercase transition-colors", children: "Undangan Pernikahan" }),
                /* @__PURE__ */ jsxs("h1", { className: "font-serif text-4xl sm:text-6xl md:text-7xl text-[#4a3f35] italic leading-tight transition-colors", children: [
                  firstName,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[#c5a386]", children: "&" }),
                  " ",
                  secondName
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 1, delay: 0.8 },
              className: "relative py-8 sm:py-12 px-4 sm:px-8 border-y border-[#d9c5b2]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4ebe1] px-3 sm:px-4", children: /* @__PURE__ */ jsx(Heart, { className: "text-[#c5a386] fill-[#c5a386] h-5 w-5 sm:h-6 sm:w-6" }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-medium text-[#8c7851] italic transition-colors", children: "Kepada Yth. Bapak/Ibu/Saudara/i" }),
                  /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-3xl md:text-4xl text-[#4a3f35] font-bold transition-colors", children: guestName || "Tamu Undangan" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.button,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 1.2 },
              onClick: handleOpenClick,
              className: "group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-[#4a3f35] text-[#f4ebe1] rounded-full overflow-hidden transition-all hover:pr-12 sm:hover:pr-14 active:scale-95 shadow-xl shadow-[#4a3f35]/20 text-xs sm:text-[11px]",
              children: [
                /* @__PURE__ */ jsx("span", { className: "relative z-10 font-bold tracking-widest uppercase", children: "Buka Undangan" }),
                /* @__PURE__ */ jsx(MailOpen, { className: "relative z-10 h-3 w-3 sm:h-4 sm:w-4 transition-all group-hover:translate-x-1 sm:group-hover:translate-x-2" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#5d5043] translate-y-full transition-transform group-hover:translate-y-0" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 0.6 },
              transition: { duration: 1, delay: 1.5 },
              className: "text-[9px] sm:text-[10px] tracking-widest text-[#8c7851] uppercase",
              children: "Tanpa Mengurangi Rasa Hormat"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-2 sm:inset-4 rounded-[1rem] sm:rounded-[2rem] border border-[#4a3f35]/5 md:inset-8 md:rounded-[4rem]" })
      ]
    }
  ) });
};
const Hero$9 = () => {
  const { config } = useSettings();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [guestName, setGuestName] = useState(null);
  const [side, setSide] = useState("pria");
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
        const distance2 = new Date(firstEvent.startDateTime).getTime() - (/* @__PURE__ */ new Date()).getTime();
        updateTimeLeft(distance2);
        return;
      }
      const targetDate = /* @__PURE__ */ new Date(`${targetDateStr}T08:00:00+07:00`);
      const distance = targetDate.getTime() - (/* @__PURE__ */ new Date()).getTime();
      updateTimeLeft(distance);
    }, 1e3);
    const updateTimeLeft = (distance) => {
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1e3 * 60 * 60 * 24)),
          hours: Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)),
          minutes: Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60)),
          seconds: Math.floor(distance % (1e3 * 60) / 1e3)
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
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fdfaf7] dark:bg-slate-950 transition-colors duration-1000", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsx(
        motion.img,
        {
          initial: { scale: 1.15 },
          animate: { scale: 1 },
          transition: { duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" },
          src: config.hero.image,
          className: "w-full h-full object-cover grayscale opacity-20 dark:opacity-10",
          alt: "Rustic Background"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#fdfaf7]/40 via-transparent to-[#fdfaf7]/80 dark:from-slate-950/40 dark:to-slate-950/80 pointer-events-none transition-colors duration-1000" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 backdrop-blur-[1px]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-6 sm:space-y-10 px-4 sm:px-6 max-w-7xl pt-8 sm:pt-12 pb-6 sm:pb-10 md:pt-16 md:pb-12", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.4em] sm:tracking-[0.8em] text-[8px] sm:text-[10px] font-bold text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors", children: "The Wedding Celebration of" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 lg:gap-16", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#4a3f35] dark:text-stone-200 leading-[0.8] transition-colors drop-shadow-sm", children: firstName }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center relative", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 md:hidden bg-gradient-to-r from-transparent to-[#c5a386]/30" }),
            /* @__PURE__ */ jsx("span", { className: "font-serif text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-[#c5a386] italic tracking-widest", children: "&" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 md:hidden bg-gradient-to-l from-transparent to-[#c5a386]/30" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#4a3f35] dark:text-stone-200 leading-[0.8] transition-colors drop-shadow-sm", children: secondName })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-serif text-lg sm:text-2xl md:text-3xl text-slate-500 dark:text-stone-400 italic transition-colors", children: guestName ? `Kepada Yth. ${guestName}` : "Special Celebration" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-300 italic transition-colors drop-shadow-sm", children: config.hero.date }),
        /* @__PURE__ */ jsxs("p", { className: "tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors", children: [
          "#ThePerfectMatch • ",
          config.hero.city
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 max-w-2xl mx-auto py-4 sm:py-8 border-y border-[#d9c5b2]/30 dark:border-white/5", children: [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds }
      ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-300 font-bold", children: stat.value.toString().padStart(2, "0") }),
        /* @__PURE__ */ jsx("p", { className: "text-[7px] sm:text-[8px] font-black tracking-widest text-[#8c7851] dark:text-[#c5a386] uppercase", children: stat.label })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 1, children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleScrollToContent,
          className: "group flex flex-col items-center gap-2 sm:gap-4 mx-auto",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-[1px] h-12 sm:h-16 bg-gradient-to-b from-[#c5a386] to-transparent animate-bounce-slow" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity", children: "Scroll to Explore" })
          ]
        }
      ) })
    ] })
  ] });
};
const CoupleProfile$9 = () => {
  const { config, text } = useSettings();
  const [side, setSide] = useState("pria");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "wanita") setSide("wanita");
  }, []);
  const firstPerson = side === "wanita" ? config.couple.bride : config.couple.groom;
  const secondPerson = side === "wanita" ? config.couple.groom : config.couple.bride;
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.01] pointer-events-none", style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl space-y-16 sm:space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto mb-12 sm:mb-20", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#c5a386] dark:text-[#d9c5b2] h-6 w-6 sm:h-8 sm:w-8 mx-auto animate-pulse transition-colors" }),
        /* @__PURE__ */ jsx("span", { className: "font-serif text-base sm:text-xl md:text-2xl text-[#8c7851] dark:text-[#c5a386] italic", children: text.opening.salam }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-6xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors", children: "Bismillahirrahmanirrahim" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 sm:w-20 h-px bg-[#c5a386]/30 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-sm sm:text-lg md:text-xl text-slate-500 dark:text-stone-300 italic leading-relaxed transition-colors", children: text.quote.ar_rum }),
        /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black text-[#8c7851] dark:text-[#c5a386] uppercase opacity-60 transition-colors", children: text.quote.source })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 sm:gap-20 md:gap-32 items-start relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block", children: /* @__PURE__ */ jsx(Heart, { size: 150, className: "text-[#c5a386]/5 rotate-12" }) }),
        /* @__PURE__ */ jsx(Reveal$9, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-10 text-center group relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 sm:-inset-4 border border-[#c5a386]/20 rounded-full scale-105 transition-transform duration-1000 group-hover:scale-100" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-2 border-[#d9c5b2] rounded-full translate-x-2 sm:translate-x-3 translate-y-2 sm:translate-y-3 transition-transform duration-1000 group-hover:translate-x-0 group-hover:translate-y-0" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: firstPerson.image,
                className: "relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]",
                alt: firstPerson.fullName
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-full shadow-lg border border-[#c5a386]/20", children: /* @__PURE__ */ jsx(Heart, { className: "h-3 w-3 sm:h-4 sm:w-4 text-[#c5a386] fill-[#c5a386]" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]", children: firstPerson.fullName }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] w-8 sm:w-12 bg-[#c5a386] mx-auto opacity-50" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors opacity-60", children: "Putra/Putri dari Pasangan" }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors leading-relaxed", children: firstPerson.parents })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-10 text-center group relative z-10 md:mt-24", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 sm:-inset-4 border border-[#c5a386]/20 rounded-full scale-105 transition-transform duration-1000 group-hover:scale-100" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-2 border-[#d9c5b2] rounded-full -translate-x-2 sm:-translate-x-3 translate-y-2 sm:translate-y-3 transition-transform duration-1000 group-hover:translate-x-0 group-hover:translate-y-0" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: secondPerson.image,
                className: "relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]",
                alt: secondPerson.fullName
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-full shadow-lg border border-[#c5a386]/20", children: /* @__PURE__ */ jsx(Heart, { className: "h-3 w-3 sm:h-4 sm:w-4 text-[#c5a386] fill-[#c5a386]" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]", children: secondPerson.fullName }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] w-8 sm:w-12 bg-[#c5a386] mx-auto opacity-50" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] sm:text-[9px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors opacity-60", children: "Putra/Putri dari Pasangan" }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors leading-relaxed", children: secondPerson.parents })
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] });
};
const LoveStory$9 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] pointer-events-none", style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-16 sm:space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-20" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors", children: "Kisah Cinta" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 sm:w-24 h-[1px] bg-[#d9c5b2] mx-auto" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-3 sm:left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#d9c5b2] via-[#c5a386] to-[#d9c5b2] -translate-x-1/2 hidden md:block opacity-30" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsx("span", { className: "text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-bold text-[#c5a386]/5 -rotate-12 transition-colors whitespace-nowrap", children: "Our Story" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-12 sm:space-y-16 md:space-y-32", children: config.loveStory.map((story, index) => /* @__PURE__ */ jsx(Reveal$9, { delay: index * 0.1, children: /* @__PURE__ */ jsxs("div", { className: `relative flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-3 sm:left-4 top-0 bottom-0 w-[1px] bg-[#d9c5b2]/30 md:hidden" }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-[45%]", children: /* @__PURE__ */ jsxs("div", { className: `bg-[#f9f5f0] dark:bg-slate-900 p-6 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] border border-[#d9c5b2] dark:border-white/5 relative group transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `absolute -top-3 sm:-top-4 ${index % 2 === 0 ? "left-6 sm:left-10" : "right-6 sm:right-10 md:left-auto md:right-10"} bg-[#4a3f35] dark:bg-stone-200 px-4 py-1 sm:px-6 sm:py-2 rounded-full shadow-lg transition-colors`, children: /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black tracking-widest text-[#f4ebe1] dark:text-slate-900 uppercase", children: story.date }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl sm:text-3xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors", children: story.title }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic leading-relaxed transition-colors", children: story.desc })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `absolute bottom-4 sm:bottom-6 ${index % 2 === 0 ? "right-4 sm:right-6" : "left-4 sm:left-6"} opacity-0 group-hover:opacity-20 transition-opacity duration-1000`, children: /* @__PURE__ */ jsx(Heart, { className: "text-[#c5a386] h-8 w-8 sm:h-12 sm:w-12" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 z-20", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-950 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center shadow-xl transition-all duration-700 hover:scale-110 hover:rotate-12 group", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-[#c5a386] group-hover:animate-spin-slow transition-colors" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block md:w-[45%]" })
        ] }) }, index)) })
      ] })
    ] })
  ] });
};
const EventDetails$9 = () => {
  const { config } = useSettings();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [copiedEvent, setCopiedEvent] = useState(null);
  const handleCalendarAction = (type, event) => {
    if (type === "google") {
      window.open(generateGoogleCalendarUrl(event), "_blank");
    } else {
      downloadICS(event);
    }
    setActiveDropdown(null);
  };
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEvent(id);
    setTimeout(() => setCopiedEvent(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-[#f9f5f0] dark:bg-slate-900 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none", style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl space-y-16 sm:space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-30 animate-bounce" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors", children: "Waktu & Tempat" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.3em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors", children: "Undangan Pernikahan" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-20", children: config.events.map((ev) => /* @__PURE__ */ jsx(Reveal$9, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-950 rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden border border-[#d9c5b2] dark:border-white/5 shadow-2xl transition-all duration-1000 group", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-10 md:p-14 space-y-8 sm:space-y-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 sm:space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block px-4 sm:px-8 py-2 sm:py-3 bg-[#4a3f35] dark:bg-stone-200 rounded-full shadow-lg transition-colors", children: /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black tracking-widest text-[#f4ebe1] dark:text-slate-900 uppercase", children: ev.title }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 sm:space-y-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-[0.8]", children: ev.day }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-lg sm:text-2xl text-[#c5a386] italic tracking-wide", children: ev.date })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 sm:gap-4 text-[#8c7851] dark:text-[#c5a386] transition-colors", children: [
              /* @__PURE__ */ jsx(Clock, { size: 14, className: "sm:size-4" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-black tracking-widest uppercase", children: [
                ev.startTime,
                " — ",
                ev.endTime,
                " WIB"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveDropdown(activeDropdown === ev.id ? null : ev.id),
                className: "w-full py-3 sm:py-5 bg-[#4a3f35] dark:bg-white text-white dark:text-slate-900 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-xl transition-all hover:bg-[#8c7851] flex items-center justify-center gap-2 sm:gap-3 active:scale-95",
                children: [
                  /* @__PURE__ */ jsx(CalendarPlus, { size: 14, className: "sm:size-4" }),
                  "Ingatkan Saya",
                  /* @__PURE__ */ jsx(ChevronDown, { size: 12, className: `sm:size-4 transition-transform duration-500 ${activeDropdown === ev.id ? "rotate-180" : ""}` })
                ]
              }
            ),
            activeDropdown === ev.id && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-white dark:bg-slate-900 border border-[#d9c5b2] dark:border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-[50]", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleCalendarAction("google", ev),
                  className: "w-full px-4 sm:px-8 py-3 sm:py-5 text-left flex items-center gap-2 sm:gap-4 hover:bg-[#f9f5f0] dark:hover:bg-white/5 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c5a386] rounded-full animate-pulse" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300", children: "Google Calendar" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleCalendarAction("ics", ev),
                  className: "w-full px-4 sm:px-8 py-3 sm:py-5 text-left flex items-center gap-2 sm:gap-4 hover:bg-[#f9f5f0] dark:hover:bg-white/5 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-300 rounded-full" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300", children: "Apple / Outlook" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-[#f9f5f0] dark:border-white/5 p-6 sm:p-10 md:p-14 space-y-6 sm:space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 sm:gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-14 sm:h-14 bg-[#f9f5f0] dark:bg-white/5 border border-[#d9c5b2]/40 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "text-[#c5a386] w-5 h-5 sm:w-7 sm:h-7" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-tight", children: ev.venue.name }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic transition-colors leading-snug", children: ev.venue.address })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => copyToClipboard(ev.venue.address, ev.id),
                className: "flex-1 py-3 sm:py-4 border border-[#d9c5b2] dark:border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#4a3f35] dark:text-stone-300 transition-all hover:bg-[#f9f5f0] dark:hover:bg-white/5 flex items-center justify-center gap-2",
                children: [
                  copiedEvent === ev.id ? /* @__PURE__ */ jsx(Check, { size: 14, className: "sm:size-4 text-green-500" }) : /* @__PURE__ */ jsx(Copy, { size: 14, className: "sm:size-4 text-[#c5a386]" }),
                  copiedEvent === ev.id ? "Berhasil!" : "Salin Alamat"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: ev.venue.mapsEmbedUrl.replace("&output=embed", ""),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex-1 py-3 sm:py-4 bg-[#c5a386] rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-white shadow-lg transition-all hover:bg-[#8c7851] flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(ExternalLink, { size: 14, className: "sm:size-4" }),
                  "Petunjuk Jalan"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative h-48 sm:h-64 md:h-80 rounded-xl sm:rounded-3xl overflow-hidden border border-[#d9c5b2]/40 shadow-xl", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              src: ev.venue.mapsEmbedUrl,
              width: "100%",
              height: "100%",
              style: { border: 0 },
              allowFullScreen: true,
              loading: "lazy",
              className: "grayscale-[0.5] contrast-[1.1] transition-all duration-1000 group-hover:grayscale-0 dark:opacity-80"
            }
          ) })
        ] })
      ] }) }, ev.id)) })
    ] })
  ] });
};
const Gallery$9 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#f9f5f0] dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-64 h-64 bg-[#c5a386]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-96 h-96 bg-[#8c7851]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-8 sm:space-y-12 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-4xl sm:text-6xl md:text-7xl text-[#4a3f35] dark:text-stone-200 italic leading-tight transition-colors", children: "Galeri" }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-[1px] bg-[#d9c5b2] mx-auto opacity-50" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-4 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] hover:bg-[#c5a386] hover:text-white transition-all shadow-sm",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-1", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-[#c5a386] scale-105 shadow-md" : "border-transparent opacity-50 grayscale hover:opacity-100"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] hover:bg-[#c5a386] hover:text-white transition-all shadow-sm",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-[#d9c5b2] dark:border-white/5 shadow-2xl group", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.1 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { duration: 1.2, ease: "easeInOut" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer",
            alt: "Featured Gallery",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 right-6 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 20 })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-[2010]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 24, className: "sm:size-10", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center p-2 sm:p-4", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-white/50 hover:text-white transition-colors z-[2010]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 32, className: "sm:size-16", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
              motion.img,
              {
                initial: { opacity: 0, scale: 0.9, x: 20 },
                animate: { opacity: 1, scale: 1, x: 0 },
                exit: { opacity: 0, scale: 1.1, x: -20 },
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                src: config.galleryImages[selectedImg],
                className: "max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain shadow-2xl rounded-sm",
                alt: `Gallery detail ${selectedImg + 1}`,
                onClick: (e) => e.stopPropagation()
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-white/50 hover:text-white transition-colors z-[2010]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 32, className: "sm:size-16", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 sm:px-6 sm:py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10", children: /* @__PURE__ */ jsxs("p", { className: "text-white/40 text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase", children: [
              selectedImg + 1,
              " ",
              /* @__PURE__ */ jsx("span", { className: "mx-1 sm:mx-2 opacity-20", children: "/" }),
              " ",
              config.galleryImages.length
            ] }) })
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$9 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-[#f9f5f0] dark:bg-slate-900 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-12 sm:space-y-20 relative z-10", children: [
    /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsx(Gift, { className: "text-[#c5a386] h-8 w-8 sm:h-10 sm:w-10 mx-auto opacity-40 mb-2 sm:mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-5xl md:text-8xl text-[#4a3f35] dark:text-stone-200 italic transition-colors", children: "Kado Kasih" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-xl mx-auto text-sm sm:text-base text-slate-500 dark:text-stone-400 italic transition-colors", children: "Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsx(Reveal$9, { delay: idx * 0.2, children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] shadow-xl space-y-6 sm:space-y-8 flex flex-col justify-center text-center group transition-all hover:scale-[1.02] duration-1000", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 sm:space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 sm:w-16 sm:h-16 bg-[#f9f5f0] dark:bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 transition-colors", children: /* @__PURE__ */ jsx(Landmark, { className: "text-[#8c7851] h-5 w-5 sm:h-8 sm:w-8" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black text-[#c5a386] tracking-[0.2em] sm:tracking-[0.3em] uppercase", children: account.bank }),
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl sm:text-3xl text-[#4a3f35] dark:text-stone-200 italic font-bold transition-colors", children: account.number }),
        /* @__PURE__ */ jsxs("p", { className: "font-serif text-base sm:text-xl italic text-slate-500 dark:text-stone-400 transition-colors", children: [
          "a.n ",
          account.name
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => copyToClipboard(account.number, `bank-${idx}`),
          className: "inline-flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#8c7851] dark:text-[#c5a386] hover:text-[#4a3f35] dark:hover:text-[#d9c5b2] transition-colors",
          children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { size: 12, className: "sm:size-4 text-green-500" }),
            " Tersalin"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Copy, { size: 12, className: "sm:size-4" }),
            " Salin Nomor Rekening"
          ] })
        }
      )
    ] }) }, idx)) }),
    /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 border border-[#d9c5b2] dark:border-white/5 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3.5rem] shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-14 text-center md:text-left group transition-all duration-1000 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#c5a386]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#f9f5f0] dark:bg-slate-900 rounded-2xl md:rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-float", children: /* @__PURE__ */ jsx(MapPin, { className: "text-[#8c7851] h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex-grow space-y-2 sm:space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-2 text-[#c5a386]", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "sm:size-5" }),
          /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-200 italic font-bold", children: "Kirim Kado Fisik" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-lg text-slate-500 dark:text-stone-400 italic transition-colors leading-relaxed", children: config.giftAddress || "Alamat belum diatur secara lengkap oleh mempelai." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => copyToClipboard(config.giftAddress || "", "gift-address"),
          className: `relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-lg text-[9px] sm:text-[11px] font-black tracking-widest uppercase ${copiedId === "gift-address" ? "bg-green-500 text-white" : "bg-[#4a3f35] text-[#f4ebe1] hover:scale-105"}`,
          children: copiedId === "gift-address" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { size: 14, className: "sm:size-5" }),
            " Tersalin"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Copy, { size: 14, className: "sm:size-5" }),
            " Salin Alamat"
          ] })
        }
      )
    ] }) })
  ] }) });
};
const Navbar$9 = ({ theme, toggleTheme }) => {
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
    { icon: Gift, label: "Gift", href: "#gift" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-[#4a3f35]/95 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 sm:gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: "group relative flex flex-col items-center gap-0.5 sm:gap-1 text-[#d9c5b2] hover:text-white transition-colors",
        children: [
          /* @__PURE__ */ jsx(item.icon, { size: 14, className: "sm:size-5 transition-transform group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" }),
          /* @__PURE__ */ jsx("span", { className: "text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 sm:-top-8 bg-[#4a3f35] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-white whitespace-nowrap", children: item.label })
        ]
      },
      idx
    )),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleTheme,
        className: "group relative flex flex-col items-center gap-0.5 sm:gap-1 text-[#d9c5b2] hover:text-white transition-colors",
        "aria-label": "Toggle theme",
        children: [
          theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 14, className: "sm:size-5" }) : /* @__PURE__ */ jsx(Sun, { size: 14, className: "sm:size-5" }),
          /* @__PURE__ */ jsx("span", { className: "text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 sm:-top-8 bg-[#4a3f35] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md whitespace-nowrap text-white", children: theme === "light" ? "Dark Mode" : "Light Mode" })
        ]
      }
    )
  ] }) });
};
const RSVPForm$9 = () => {
  const { invitationId, config } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
    const hadir = rsvps.filter((r) => r.attendance === AttendanceStatus.HADIR).reduce((total, r) => total + (r.guest_count || 1), 0);
    const ragu = rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length;
    const tidak = rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR).length;
    return { hadir, ragu, tidak };
  }, [rsvps]);
  const currentRSVPs = useMemo(() => {
    const start = (currentPage - 1) * rsvpsPerPage;
    const sorted = [...rsvps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return sorted.slice(start, start + rsvpsPerPage);
  }, [rsvps, currentPage]);
  const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);
  return /* @__PURE__ */ jsxs("section", { id: "rsvp", className: "bg-[#fdfaf7] dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-white dark:from-slate-950 to-transparent transition-colors" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 sm:gap-16 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-12 xl:col-span-5", children: /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-14 rounded-[1.5rem] sm:rounded-[3.5rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 relative overflow-hidden transition-all duration-1000", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-[#c5a386]/5 rounded-bl-full pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-[#f9f5f0] dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsx(MessageCircle, { className: "text-[#c5a386] h-4 w-4 sm:h-6 sm:w-6" }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-5xl text-[#4a3f35] dark:text-stone-200 italic transition-colors", children: "Konfirmasi Kehadiran" }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors leading-relaxed", children: "Harap isi form di bawah ini untuk mengonfirmasi kehadiran Anda" })
        ] }),
        submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 sm:py-12 space-y-6 sm:space-y-8 animate-reveal", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-24 sm:h-24 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto transition-colors", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 32, className: "sm:size-12" }) }),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { scale: 0 },
                animate: { scale: 1 },
                className: "absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-green-500",
                children: /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "sm:size-6" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl sm:text-4xl text-[#4a3f35] dark:text-stone-200 italic transition-colors", children: "Terima Kasih!" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-slate-500 dark:text-stone-400 italic transition-colors max-w-xs mx-auto", children: "Konfirmasi Anda telah berhasil kami terima. Sampai jumpa di hari bahagia kami!" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSubmitted(false),
              className: "px-6 py-3 sm:px-10 sm:py-4 bg-[#8c7851] text-white rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-[#4a3f35] transition-all",
              children: "Update Konfirmasi"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 sm:space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-1 sm:mb-2", children: "Nama Lengkap" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  disabled: isNameLocked,
                  placeholder: "Nama Anda",
                  className: "w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all disabled:opacity-50",
                  value: formData.guest_name,
                  onChange: (e) => setFormData({ ...formData, guest_name: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-1 sm:mb-2", children: "Pesan Untuk Mempelai" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 3,
                  placeholder: "Tulis pesan Anda...",
                  className: "w-full bg-[#f9f5f0] dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all resize-none",
                  value: formData.message,
                  onChange: (e) => setFormData({ ...formData, message: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors", children: "Tambah Sticker" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowStickerPicker(true),
                    className: "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f9f5f0] dark:bg-slate-800 text-[#c5a386] flex items-center justify-center hover:bg-[#c5a386] hover:text-white transition-all shadow-md active:scale-90",
                    children: /* @__PURE__ */ jsx(Smile, { size: 16, className: "sm:size-5" })
                  }
                )
              ] }),
              formData.sticker && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "relative inline-block bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#d9c5b2] shadow-xl",
                  children: [
                    /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Sticker", className: "w-16 h-16 sm:w-20 sm:h-20 object-contain" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFormData({ ...formData, sticker: null }),
                        className: "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform",
                        children: /* @__PURE__ */ jsx(X, { size: 12, className: "sm:size-4" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                StickerPicker$1,
                {
                  isOpen: showStickerPicker,
                  selectedSticker: formData.sticker?.id || null,
                  onSelect: (sticker) => {
                    setFormData({ ...formData, sticker });
                    setShowStickerPicker(false);
                  },
                  onClose: () => setShowStickerPicker(false)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors", children: "Status Kehadiran" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:gap-4", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map((status) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData({ ...formData, attendance: status }),
                  className: `flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${formData.attendance === status ? "bg-[#4a3f35] dark:bg-stone-200 border-[#4a3f35] dark:border-stone-200 text-white dark:text-slate-900 shadow-xl" : "bg-white dark:bg-slate-800 border-[#d9c5b2] dark:border-white/5 text-[#8c7851] dark:text-stone-400 hover:bg-[#f9f5f0] dark:hover:bg-white/5"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-black tracking-widest uppercase", children: status.replace("_", " ") }),
                    /* @__PURE__ */ jsx("div", { className: `w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.attendance === status ? "bg-[#c5a386] border-[#c5a386]" : "border-[#d9c5b2] opacity-30"}`, children: formData.attendance === status && /* @__PURE__ */ jsx(Check, { size: 12, className: "sm:size-4 text-white" }) })
                  ]
                },
                status
              )) })
            ] }),
            formData.attendance === AttendanceStatus.HADIR && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                className: "space-y-3 sm:space-y-4 pt-3 sm:pt-4 overflow-hidden",
                children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors", children: "Jumlah Tamu" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[#f9f5f0] dark:bg-slate-800 rounded-2xl sm:rounded-3xl transition-colors", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFormData((p) => ({ ...p, guest_count: Math.max(1, p.guest_count - 1) })),
                        className: "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-[#d9c5b2] flex items-center justify-center text-[#4a3f35] dark:text-stone-200 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30",
                        disabled: formData.guest_count <= 1,
                        children: /* @__PURE__ */ jsx(Minus, { size: 18, className: "sm:size-6" })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center font-serif text-xl sm:text-3xl italic text-[#4a3f35] dark:text-stone-200 transition-colors", children: [
                      formData.guest_count,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-lg opacity-50", children: "Orang" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFormData((p) => ({ ...p, guest_count: Math.min(MAX_GUESTS, p.guest_count + 1) })),
                        className: "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-[#d9c5b2] flex items-center justify-center text-[#4a3f35] dark:text-stone-200 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30",
                        disabled: formData.guest_count >= MAX_GUESTS,
                        children: /* @__PURE__ */ jsx(Plus, { size: 18, className: "sm:size-6" })
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: isSubmitting,
              className: "w-full bg-[#8c7851] text-white py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-[#4a3f35] transition-all shadow-xl shadow-[#8c7851]/30 flex items-center justify-center gap-2 sm:gap-4 group disabled:opacity-50",
              children: [
                isSubmitting ? "Processing..." : "Konfirmasi Sekarang",
                /* @__PURE__ */ jsx(Send, { size: 14, className: "sm:size-5 transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" })
              ]
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-12 xl:col-span-7", children: /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[4rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 transition-all duration-1000", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#f4ebe1] dark:border-white/5 pb-8 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sm:justify-start gap-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-stone-200 italic transition-colors", children: "Daftar Kehadiran" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-[#f9f5f0] dark:bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "text-[#c5a386] h-4 w-4 sm:h-6 sm:w-6" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 sm:gap-4 flex-1 sm:flex-none", children: [
            { label: "Hadir", count: stats.hadir, color: "text-[#4a3f35] dark:text-stone-200", bg: "bg-[#f9f5f0] dark:bg-white/5", icon: CheckCircle2 },
            { label: "Ragu", count: stats.ragu, color: "text-[#8c7851] dark:text-stone-400", bg: "bg-white dark:bg-slate-800/50", icon: Clock },
            { label: "Absen", count: stats.tidak, color: "text-red-400 dark:text-red-500", bg: "bg-white dark:bg-slate-800/50", icon: XCircle }
          ].map((stat, i) => /* @__PURE__ */ jsx("div", { className: `p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-[#d9c5b2]/30 dark:border-white/5 text-center transition-all ${stat.bg}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsx(stat.icon, { size: 12, className: `opacity-40 mb-1 ${stat.color}` }),
            /* @__PURE__ */ jsx("p", { className: `font-serif text-sm sm:text-lg font-bold ${stat.color}`, children: stat.count }),
            /* @__PURE__ */ jsx("p", { className: "text-[7px] sm:text-[9px] font-black tracking-widest uppercase opacity-40 leading-tight", children: stat.label })
          ] }) }, i)) })
        ] }),
        rsvps.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 sm:py-20 opacity-30 space-y-3 sm:space-y-4", children: [
          /* @__PURE__ */ jsx(Users, { size: 40, className: "sm:size-16 mx-auto", strokeWidth: 1 }),
          /* @__PURE__ */ jsx("p", { className: "font-serif text-lg sm:text-2xl italic", children: "Belum ada tamu terdaftar" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4 sm:gap-6", children: currentRSVPs.map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-8 bg-[#fdfaf7] dark:bg-slate-800/50 rounded-xl sm:rounded-[2.5rem] border border-white dark:border-white/5 space-y-4 sm:space-y-6 transition-all hover:bg-[#f9f5f0] dark:hover:bg-slate-800 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 sm:gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 sm:gap-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic truncate transition-colors capitalize", children: rsvp.guest_name }),
                  rsvp.sticker && /* @__PURE__ */ jsx("div", { className: "w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 animate-bounce", children: /* @__PURE__ */ jsx("img", { src: STICKERS.find((s) => s.id === rsvp.sticker)?.src || "", className: "w-full h-full object-contain", alt: "sticker" }) })
                ] }),
                /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[7px] sm:text-[8px] font-black tracking-widest uppercase transition-colors ${rsvp.attendance === AttendanceStatus.HADIR ? "bg-green-100 dark:bg-green-500/20 text-green-700" : rsvp.attendance === AttendanceStatus.RAGU ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700" : "bg-red-100 dark:bg-red-500/20 text-red-700"}`, children: rsvp.attendance.replace("_", " ") })
              ] }),
              rsvp.attendance === AttendanceStatus.HADIR && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end opacity-40", children: [
                /* @__PURE__ */ jsx(Users, { size: 12, className: "sm:size-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] sm:text-[10px] font-bold", children: rsvp.guest_count })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Quote, { className: "absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-3 h-3 sm:w-4 sm:h-4 text-[#c5a386] opacity-10" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-stone-400 italic leading-relaxed transition-colors pl-3 sm:pl-4", children: rsvp.message || "Eshari bersama dalam doa..." })
            ] })
          ] }, rsvp.id)) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-3 sm:gap-4 pt-6 sm:pt-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16, className: "sm:size-5" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-1.5 sm:py-3 bg-[#fdfaf7] dark:bg-slate-800 rounded-full text-[#8c7851] dark:text-[#c5a386] font-serif text-base sm:text-lg italic transition-colors", children: [
              /* @__PURE__ */ jsx("span", { children: currentPage }),
              /* @__PURE__ */ jsx("span", { className: "opacity-20", children: "/" }),
              /* @__PURE__ */ jsx("span", { children: totalPages })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages,
                className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0]",
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "sm:size-5" })
              }
            )
          ] })
        ] })
      ] }) }) })
    ] }) })
  ] });
};
const Wishes$9 = () => {
  const { invitationId, config } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const wishesPerPage = 6;
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
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
  const handleSubmit = async (e) => {
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
      setTimeout(() => setPostSuccess(false), 3e3);
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
  return /* @__PURE__ */ jsxs("section", { id: "wishes", className: "bg-white dark:bg-slate-950 py-16 sm:py-24 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] pointer-events-none", style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' } }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 sm:gap-16 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-12 xl:col-span-5", children: /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs("div", { className: "bg-[#f9f5f0] dark:bg-slate-900 p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[4rem] border border-[#d9c5b2] dark:border-white/5 shadow-2xl space-y-8 sm:space-y-12 transition-all duration-1000 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#c5a386]/5 rounded-br-full pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-xl sm:rounded-[2rem] flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx(Sparkles, { className: "text-[#c5a386] h-4 w-4 sm:h-7 sm:w-7" }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-5xl md:text-6xl text-[#4a3f35] dark:text-stone-200 italic transition-colors leading-tight", children: "Untaian Doa" }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-[0.3em] sm:tracking-[0.4em] uppercase transition-colors", children: "Digital Guestbook" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 sm:space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-2 sm:mb-3", children: "Nama Anda" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  disabled: isNameLocked,
                  placeholder: "Siapa nama Anda?",
                  className: "w-full bg-white dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all disabled:opacity-50",
                  value: name,
                  onChange: (e) => setName(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase transition-colors block mb-2 sm:mb-3", children: "Ucapan & Doa Restu" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  required: true,
                  placeholder: "Tuliskan ucapan terbaik Anda...",
                  rows: 4,
                  className: "w-full bg-white dark:bg-slate-800 border-none rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-5 font-serif text-base sm:text-xl italic text-[#4a3f35] dark:text-stone-200 outline-none focus:ring-2 focus:ring-[#c5a386]/50 transition-all resize-none",
                  value: message,
                  onChange: (e) => setMessage(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] sm:text-[10px] font-black text-[#8c7851] dark:text-[#c5a386] tracking-widest uppercase", children: "Kirim Sticker" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowStickerPicker(true),
                    className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 text-[#c5a386] flex items-center justify-center hover:bg-[#c5a386] hover:text-white transition-all shadow-md active:scale-90",
                    children: /* @__PURE__ */ jsx(Smile, { size: 18, className: "sm:size-6" })
                  }
                )
              ] }),
              selectedSticker && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "relative inline-block bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#d9c5b2] shadow-xl",
                  children: [
                    /* @__PURE__ */ jsx("img", { src: selectedSticker.src, alt: "Sticker", className: "w-16 h-16 sm:w-20 sm:h-20 object-contain" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSelectedSticker(null),
                        className: "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform",
                        children: /* @__PURE__ */ jsx(X, { size: 12, className: "sm:size-4" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                StickerPicker$1,
                {
                  isOpen: showStickerPicker,
                  selectedSticker: selectedSticker?.id || null,
                  onSelect: (sticker) => {
                    setSelectedSticker(sticker);
                    setShowStickerPicker(false);
                  },
                  onClose: () => setShowStickerPicker(false)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: isSending || postSuccess,
              className: `w-full py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-4 group ${postSuccess ? "bg-green-500 text-white shadow-green-500/30" : "bg-[#4a3f35] dark:bg-stone-200 text-white dark:text-slate-900"} hover:translate-y-[-1px] sm:hover:translate-y-[-2px] active:scale-95 disabled:opacity-50`,
              children: [
                isSending ? "Mengirim..." : postSuccess ? "Pesan Terkirim!" : "Kirim Doa Restu",
                postSuccess ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "sm:size-5" }) : /* @__PURE__ */ jsx(Send, { size: 16, className: "sm:size-5 transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1" })
              ]
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-12 xl:col-span-7 space-y-8 sm:space-y-12", children: [
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4 sm:gap-8", children: currentWishes.map((wish, idx) => /* @__PURE__ */ jsx(Reveal$9, { delay: idx * 0.1, children: /* @__PURE__ */ jsx("div", { className: "bg-[#f9f5f0] dark:bg-slate-900/50 p-6 sm:p-10 rounded-xl sm:rounded-[3.5rem] border border-white dark:border-white/5 shadow-xl relative group transition-all duration-700 hover:shadow-2xl hover:bg-[#f9f5f0] dark:hover:bg-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8 relative z-10 h-full flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-slate-800 flex items-center justify-center text-[#c5a386] font-serif text-lg sm:text-2xl border border-[#d9c5b2] dark:border-white/10 transition-colors shadow-sm", children: wish.name.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-black tracking-widest text-[#8c7851] dark:text-[#c5a386] uppercase transition-colors", children: wish.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-widest italic", children: new Date(wish.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Quote, { className: "h-5 w-5 sm:h-8 sm:w-8 text-[#c5a386] opacity-5 group-hover:opacity-20 transition-opacity" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-grow space-y-4 sm:space-y-6", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-lg sm:text-2xl text-[#4a3f35] dark:text-stone-200 italic leading-relaxed transition-colors", children: [
              '"',
              wish.message,
              '"'
            ] }),
            wish.sticker && /* @__PURE__ */ jsxs("div", { className: "w-16 h-16 sm:w-24 sm:h-24 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#c5a386]/5 blur-xl sm:blur-2xl rounded-full" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: STICKERS.find((s) => s.id === wish.sticker)?.src || "",
                  className: "w-full h-full object-contain relative z-10 animate-bounce-slow",
                  alt: "wish sticker"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-4 sm:pt-6 border-t border-[#f4ebe1] dark:border-white/5 flex items-center justify-end", children: /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 sm:gap-1", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(Heart, { size: 8, className: "sm:size-3 text-[#c5a386] opacity-20" }, i)) }) })
        ] }) }) }, wish.id)) }),
        totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-3 sm:gap-4 pt-6 sm:pt-10", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
              disabled: currentPage === 1,
              className: "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0] shadow-md bg-white dark:bg-slate-900",
              children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18, className: "sm:size-6" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:gap-6 px-6 sm:px-12 py-2 sm:py-4 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 shadow-xl font-serif text-lg sm:text-2xl italic text-[#4a3f35] dark:text-stone-300", children: [
            /* @__PURE__ */ jsx("span", { children: currentPage }),
            /* @__PURE__ */ jsx("span", { className: "opacity-20 text-xl sm:text-3xl", children: "/" }),
            /* @__PURE__ */ jsx("span", { children: totalPages })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
              disabled: currentPage === totalPages,
              className: "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border border-[#d9c5b2] dark:border-white/10 flex items-center justify-center text-[#8c7851] disabled:opacity-20 transition-all hover:bg-[#f9f5f0] shadow-md bg-white dark:bg-slate-900",
              children: /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "sm:size-6" })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const Footer$2 = () => {
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
  return /* @__PURE__ */ jsxs("footer", { className: "bg-[#f9f5f0] dark:bg-slate-900 border-t border-[#d9c5b2] dark:border-white/5 py-24 sm:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 dark:opacity-[0.03]", children: /* @__PURE__ */ jsx(Heart, { className: "animate-pulse-soft h-[80vw] w-[80vw] stroke-[0.3] text-[#c5a386]" }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl flex flex-col items-center gap-16 md:gap-24 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$9, { children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: scrollToTop,
          className: "group flex flex-col items-center gap-4 transition-transform duration-500 hover:scale-105",
          children: [
            /* @__PURE__ */ jsx("div", { className: "border-[#c5a386]/40 text-[#8c7851] dark:text-[#c5a386] group-hover:bg-[#c5a386]/10 flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-colors md:h-20 md:w-20", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-8 w-8 animate-bounce md:h-10 md:w-10" }) }),
            /* @__PURE__ */ jsx("span", { className: "tracking-[0.4em] text-[10px] font-black uppercase opacity-40 transition-opacity group-hover:opacity-100 text-[#8c7851] dark:text-[#c5a386]", children: "Sampai Jumpa di Hari Bahagia Kami" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center md:space-y-12", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#c5a386]/60 mx-auto h-10 w-10 animate-pulse fill-current md:h-14 md:w-14" }),
        /* @__PURE__ */ jsxs("h2", { className: "font-serif text-5xl sm:text-7xl md:text-[10rem] leading-[0.85] tracking-tighter text-[#4a3f35] dark:text-stone-200 italic drop-shadow-xl transition-colors", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#c5a386]/30 text-4xl sm:text-6xl md:text-8xl", children: "&" }),
          " ",
          config.couple.bride.name
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 md:gap-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-[#c5a386]/30 h-[1px] w-12 md:w-24" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#8c7851] dark:text-[#c5a386] text-[14px] font-black tracking-[0.5em] uppercase italic md:text-[22px] transition-colors", children: footerDate }),
          /* @__PURE__ */ jsx("div", { className: "bg-[#c5a386]/30 h-[1px] w-12 md:w-24" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$9, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "space-y-16 text-center md:space-y-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "group relative inline-block px-8 py-4", children: [
          /* @__PURE__ */ jsx(Quote, { className: "text-[#c5a386] absolute -top-8 -left-2 h-16 w-16 rotate-180 opacity-10 transition-transform duration-1000 md:-top-16 md:-left-12 md:h-24 md:w-24 dark:opacity-20" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 relative z-10", children: [
            /* @__PURE__ */ jsxs("p", { className: "mx-auto max-w-2xl font-serif text-xl leading-relaxed text-balance text-[#4a3f35] dark:text-stone-400 italic md:text-3xl transition-colors", children: [
              '"',
              text.closing.text,
              '"'
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl font-bold text-[#8c7851] dark:text-stone-200 transition-colors", children: text.closing.salam })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-8 border-t border-[#d9c5b2]/30 pt-16 md:gap-12 md:pt-24 dark:border-white/5", children: [
          /* @__PURE__ */ jsx("p", { className: "tracking-[0.4em] text-[11px] font-black uppercase text-[#c5a386] md:text-[14px]", children: text.closing.signature }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-2xl italic text-[#4a3f35] dark:text-stone-200 md:text-4xl", children: [
              config.couple.groom.name,
              " & ",
              config.couple.bride.name
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-[12px] font-medium text-slate-400 dark:text-stone-500 tracking-widest uppercase", children: config.closingFamily })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
function Rustic({ theme, toggleTheme, isOpened, onOpen }) {
  return /* @__PURE__ */ jsxs("div", { className: `overflow-x-hidden selection:bg-[#c5a386] selection:text-white ${theme}`, children: [
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: !isOpened && /* @__PURE__ */ jsx(Envelope$9, { onOpen }) }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-y-0 right-4 z-[1000] flex flex-col items-center justify-center gap-4 pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }) }),
    isOpened && /* @__PURE__ */ jsxs("main", { className: "relative", children: [
      /* @__PURE__ */ jsx(Hero$9, {}),
      /* @__PURE__ */ jsx(CoupleProfile$9, {}),
      /* @__PURE__ */ jsx(LoveStory$9, {}),
      /* @__PURE__ */ jsx(EventDetails$9, {}),
      /* @__PURE__ */ jsx(Gallery$9, {}),
      /* @__PURE__ */ jsx(RSVPForm$9, {}),
      /* @__PURE__ */ jsx(Wishes$9, {}),
      /* @__PURE__ */ jsx(GiftInfo$9, {}),
      /* @__PURE__ */ jsx(Footer$2, {}),
      /* @__PURE__ */ jsx(Navbar$9, { theme, toggleTheme }),
      /* @__PURE__ */ jsx(FloatingPetals, {}),
      /* @__PURE__ */ jsx(InstallPrompt, {})
    ] })
  ] });
}

const Reveal$8 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30, filter: "blur(10px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: false, margin: "-100px" },
      transition: { duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] },
      style: { position: "relative", width },
      className,
      children
    }
  );
};
const Envelope$8 = ({ onOpen }) => {
  const { config } = useSettings();
  const [guestName, setGuestName] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [side, setSide] = useState("pria");
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
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !isExiting && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: {
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
      },
      className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#fffafa] overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-96 h-96 bg-[#ffe4e1] opacity-30 rounded-full blur-[100px] animate-pulse-soft" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -right-24 w-96 h-96 bg-[#fdf5e6] opacity-30 rounded-full blur-[100px] animate-pulse-soft", style: { animationDelay: "2s" } }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30, filter: "blur(10px)" },
            animate: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
            },
            className: "relative w-full max-w-lg px-8 text-center space-y-12",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] font-bold text-[#db7093] uppercase", children: "Dear Beloved Guests" }),
                /* @__PURE__ */ jsxs("h1", { className: "font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight", children: [
                  firstName,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[#db7093]", children: "&" }),
                  " ",
                  secondName
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative py-12 px-8", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#db7093] italic", children: "Yth. Bapak/Ibu/Saudara/i" }),
                  /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-4xl text-[#4a4a4a] font-bold", children: guestName || "Tamu Undangan" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleOpenClick,
                  className: "group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#db7093] text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#db7093]/20",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "relative z-10 font-bold tracking-widest text-[11px] uppercase", children: "Open Invitation" }),
                    /* @__PURE__ */ jsx(Heart, { className: "relative z-10 h-4 w-4 fill-white" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#c71585] rounded-full scale-0 transition-transform group-hover:scale-100 origin-center" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-widest text-[#db7093] uppercase opacity-60", children: "We are getting married!" })
            ]
          }
        )
      ]
    }
  ) });
};
const Hero$8 = () => {
  const { config } = useSettings();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [guestName, setGuestName] = useState(null);
  const [side, setSide] = useState("pria");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuestName(params.get("to"));
    const sideParam = params.get("side");
    if (sideParam === "wanita") setSide("wanita");
    const timer = setInterval(() => {
      const targetDateStr = config.hero.heroDateRaw;
      if (!targetDateStr) return;
      const target = new Date(targetDateStr).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1e3 * 60 * 60 * 24)),
        hours: Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)),
        minutes: Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60)),
        seconds: Math.floor(distance % (1e3 * 60) / 1e3)
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [config.hero.heroDateRaw]);
  const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
  const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fffafa] dark:bg-slate-950 transition-colors duration-1000", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsx(
        motion.img,
        {
          initial: { scale: 1.2 },
          animate: { scale: 1 },
          transition: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" },
          src: config.hero.image,
          className: "w-full h-full object-cover opacity-20 dark:opacity-10",
          alt: "Floral Wedding Background"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#fffafa]/80 via-[#fffafa]/40 to-[#fffafa] dark:from-slate-950/90 dark:via-slate-950/60 dark:to-slate-950" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-4xl px-6 space-y-16", children: [
      /* @__PURE__ */ jsx(Reveal$8, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] md:text-xs font-black text-[#db7093] dark:text-[#ff8da1] uppercase", children: "Save the Date" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-serif text-7xl md:text-9xl text-[#4a4a4a] dark:text-stone-100 italic leading-none transition-colors", children: [
          firstName,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#db7093] dark:text-[#ff8da1] not-italic", children: "&" }),
          " ",
          secondName
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$8, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6 md:gap-12", children: Object.entries(timeLeft).map(([label, value], i) => /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-[#ffd1dc]/20 dark:bg-white/5 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform" }),
        /* @__PURE__ */ jsxs("div", { className: "relative text-center min-w-[80px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 transition-colors", children: value }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase", children: label })
        ] })
      ] }, label)) }) }),
      /* @__PURE__ */ jsx(Reveal$8, { delay: 0.6, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-300 italic transition-colors", children: config.hero.date }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 text-[#db7093] dark:text-[#ff8da1]", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-current opacity-30" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold tracking-[0.4em] uppercase", children: config.hero.city }),
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-current opacity-30" })
        ] })
      ] }) })
    ] })
  ] });
};
const CoupleProfile$8 = () => {
  const { config } = useSettings();
  const [side, setSide] = useState("pria");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "wanita") setSide("wanita");
  }, []);
  const firstCouple = side === "wanita" ? config.couple.bride : config.couple.groom;
  const secondCouple = side === "wanita" ? config.couple.groom : config.couple.bride;
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#fffafa]/50 dark:bg-slate-900/20 rotate-45 opacity-50 pointer-events-none transition-colors", children: /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=600&auto=format&fit=crop", className: "w-full h-full object-cover rounded-full blur-3xl" }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-8 max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto animate-pulse fill-[#db7093] dark:fill-[#ff8da1] opacity-20 transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-lg md:text-xl text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase mb-4", children: "The Holy Matrimony" }),
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed transition-colors", children: '"And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them, and He has put love and mercy between your (hearts): verily in that are Signs for those who reflect."' }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-[0.4em] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors", children: "— QS. AR-RUM: 21 —" })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-20 items-center", children: [
        /* @__PURE__ */ jsx(Reveal$8, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 text-center group", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl overflow-hidden", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: firstCouple.image,
                className: "w-full h-full object-cover rounded-full saturate-[0.8] hover:scale-105 transition-transform duration-1000",
                alt: firstCouple.fullName
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-100 italic transition-colors", children: firstCouple.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors", children: "Putra Kedua Dari:" }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 italic text-sm transition-colors", children: firstCouple.parents })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Reveal$8, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 text-center group", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ffd1dc] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 w-64 md:w-80 h-64 md:h-80 mx-auto rounded-full p-2 border border-[#ffd1dc] shadow-2xl overflow-hidden", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: secondCouple.image,
                className: "w-full h-full object-cover rounded-full saturate-[0.8] hover:scale-105 transition-transform duration-1000",
                alt: secondCouple.fullName
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-100 italic transition-colors", children: secondCouple.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors", children: "Putri Pertama Dari:" }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 italic text-sm transition-colors", children: secondCouple.parents })
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] });
};
const LoveStory$8 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white dark:from-slate-900 to-transparent transition-colors" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -left-32 top-1/2 w-96 h-96 bg-[#ffd1dc] opacity-10 rounded-full blur-[100px]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-32 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx(Star, { className: "text-[#db7093] dark:text-[#ff8da1] h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Our Love Story" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-gradient-to-r from-transparent to-[#db7093] opacity-30" }),
          /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors", children: "A Beautiful Journey" }),
          /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-gradient-to-l from-transparent to-[#db7093] dark:to-[#ff8da1] opacity-30 transition-colors" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-24 relative before:absolute before:inset-y-0 before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#db7093]/20 before:to-transparent", children: config.loveStory.map((story, idx) => /* @__PURE__ */ jsx(Reveal$8, { delay: idx * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 items-center relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute left-8 md:left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-[#db7093] dark:border-[#ff8da1] shadow-lg shadow-[#db7093]/20" }),
          /* @__PURE__ */ jsx("div", { className: "w-[1px] h-12 bg-gradient-to-b from-[#db7093]/30 to-transparent" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `pl-20 md:pl-0 ${idx % 2 === 1 ? "md:col-start-2 md:text-left" : "md:col-start-1 md:text-right"} text-left`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-[#ffd1dc]/10 shadow-2xl transition-all hover:-translate-y-2 duration-1000", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl md:text-4xl text-[#db7093] dark:text-[#ff8da1] italic tracking-tight transition-colors", children: story.date }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl md:text-3xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors", children: story.title })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `w-12 h-0.5 bg-[#db7093] opacity-20 ${idx % 2 === 0 ? "md:ml-auto" : ""}` }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 font-serif text-lg md:text-xl italic leading-relaxed transition-colors", children: story.desc })
        ] }) })
      ] }) }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center pt-20", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-4 bg-white dark:bg-slate-900 px-10 py-6 rounded-full border border-[#ffd1dc]/20 dark:border-white/5 shadow-xl transition-all", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#db7093] dark:text-[#ff8da1] h-6 w-6 fill-[#db7093] dark:fill-[#ff8da1] animate-pulse transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "To be continued..." })
      ] }) })
    ] })
  ] });
};
const EventDetails$8 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const copyAddress = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-slate-900 to-transparent opacity-50 transition-colors" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-4", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "text-[#db7093] h-6 w-6 mx-auto opacity-40 animate-pulse" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "The Wedding Event" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.5em] text-[11px] font-black text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors", children: "Blessing & Reception" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-12 lg:gap-20", children: config.events.map((event, idx) => /* @__PURE__ */ jsx(Reveal$8, { delay: idx * 0.2, children: /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl transition-all group-hover:shadow-[#ffd1dc]/40 group-hover:-translate-y-2 duration-1000 overflow-hidden border border-[#ffd1dc]/20 dark:border-white/5", children: /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-40 h-40 bg-[#ffd1dc] opacity-10 rounded-full blur-[50px]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-12 md:p-20 space-y-12 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.4em] uppercase transition-colors", children: idx === 0 ? "Holy Matrimony" : "Grand Reception" }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: event.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "text-[#db7093] h-6 w-6 mx-auto opacity-40" }),
              /* @__PURE__ */ jsxs("p", { className: "font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-none transition-colors", children: [
                event.day,
                ", ",
                event.date
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Clock, { className: "text-[#db7093] h-6 w-6 mx-auto opacity-40" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-[0.2em] uppercase transition-colors", children: [
                event.startTime,
                " — ",
                event.endTime,
                " WIB"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-10 border-t border-[#ffd1dc]/30 dark:border-white/5 space-y-4 transition-colors", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "text-[#db7093] h-6 w-6 mx-auto opacity-40" }),
              /* @__PURE__ */ jsx("h4", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors", children: event.venue.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 dark:text-stone-400 max-w-[250px] mx-auto italic leading-relaxed transition-colors", children: event.venue.address })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-[2.5rem] overflow-hidden border border-[#ffd1dc]/20 dark:border-white/5 h-64 relative group/map", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              src: event.venue.mapsEmbedUrl,
              className: "w-full h-full grayscale-[0.5] contrast-[0.8] brightness-[1.1] group-hover/map:grayscale-0 group-hover/map:contrast-100 transition-all duration-1000",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowCalendar(showCalendar === event.id ? null : event.id),
                  className: "w-full py-5 px-4 bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 text-[#db7093] dark:text-[#ff8da1] rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#db7093] hover:text-white transition-all active:scale-95",
                  children: [
                    /* @__PURE__ */ jsx(CalendarPlus, { size: 14 }),
                    " Save Date"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(AnimatePresence, { children: showCalendar === event.id && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, scale: 0.95 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 10, scale: 0.95 },
                  className: "absolute bottom-full left-0 right-0 mb-4 bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[50]",
                  children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => {
                          window.open(generateGoogleCalendarUrl({
                            title: event.title,
                            description: `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}`,
                            location: `${event.venue.name}, ${event.venue.address}`,
                            startTime: event.startDateTime,
                            endTime: event.endDateTime
                          }), "_blank");
                          setShowCalendar(null);
                        },
                        className: "w-full p-6 text-left hover:bg-[#fffafa] dark:hover:bg-white/5 flex items-center gap-4 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-[#db7093]/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Star, { size: 14, className: "text-[#db7093]" }) }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest uppercase", children: "Google Calendar" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => {
                          downloadICS({
                            title: event.title,
                            description: `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}`,
                            location: `${event.venue.name}, ${event.venue.address}`,
                            startTime: event.startDateTime,
                            endTime: event.endDateTime
                          });
                          setShowCalendar(null);
                        },
                        className: "w-full p-6 text-left hover:bg-[#fffafa] dark:hover:bg-white/5 flex items-center gap-4 border-t border-[#ffd1dc]/10 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-[#db7093]/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-[#db7093]" }) }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest uppercase", children: "iCal / Outlook" })
                        ]
                      }
                    )
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => copyAddress(event.venue.address, event.id),
                className: "w-full py-5 px-4 bg-[#db7093] text-white rounded-full text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 active:scale-95",
                children: copiedId === event.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { size: 14 }),
                  " COPIED"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Copy, { size: 14 }),
                  " COPY ADDRESS"
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: event.venue.mapsEmbedUrl.replace("&output=embed", ""),
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-full py-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all hover:shadow-2xl active:scale-95",
              children: [
                /* @__PURE__ */ jsx(Map, { size: 18 }),
                " OPEN IN GOOGLE MAPS"
              ]
            }
          )
        ] })
      ] }) }, event.id)) })
    ] })
  ] });
};
const Gallery$8 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#fffafa] dark:bg-slate-950 py-24 sm:py-32 md:py-40 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#ffd1dc]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#db7093]/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-16 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#db7093] h-8 w-8 mx-auto opacity-20 animate-pulse" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Sweet Memories" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] sm:text-xs font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors", children: "Our Journey Captured" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-[1px] bg-[#ffd1dc] mx-auto opacity-50" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$8, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all shadow-lg active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-[#db7093] scale-110 shadow-xl z-20" : "border-transparent opacity-40 grayscale hover:opacity-100 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#ffd1dc] dark:border-white/10 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all shadow-lg active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 20 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$8, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-[#ffd1dc]/30 dark:border-white/5 shadow-2xl group", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, filter: "blur(10px)" },
            animate: { opacity: 1, filter: "blur(0px)" },
            exit: { opacity: 0, filter: "blur(10px)" },
            transition: { duration: 1, ease: "easeInOut" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer",
            alt: "Featured Moment",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#db7093]/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 right-8 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#db7093]/80",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#fffafa]/90 dark:bg-slate-950/95 backdrop-blur-xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-[#db7093] dark:text-white/50 hover:scale-110 transition-all z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 32, className: "sm:size-12", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-[#db7093] dark:text-white/30 hover:text-[#db7093] dark:hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 48, className: "sm:size-20", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.05 },
                transition: { duration: 0.5 },
                className: "relative max-h-full max-w-full flex items-center justify-center",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[80vh] w-auto h-auto object-contain rounded-3xl sm:rounded-[4rem] shadow-2xl border border-[#ffd1dc]/20",
                      alt: "Full Moment"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-16 flex items-center justify-center gap-4", children: /* @__PURE__ */ jsx("div", { className: "bg-[#db7093]/10 dark:bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-[#db7093]/20 dark:border-white/10", children: /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-[#db7093] dark:text-stone-300", children: [
                    "Moment ",
                    selectedImg + 1,
                    " of ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-[#db7093] dark:text-white/30 hover:text-[#db7093] dark:hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 48, className: "sm:size-20", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$8 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "gift", className: "bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-full h-full opacity-[0.05] pointer-events-none", style: { backgroundImage: "radial-gradient(#db7093 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-6", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ffd1dc] rounded-full blur-2xl opacity-30 animate-pulse" }),
          /* @__PURE__ */ jsx(Gift, { className: "text-[#db7093] h-14 w-14 relative z-10 mx-auto" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Digital Envelope" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-[1px] bg-gradient-to-r from-transparent via-[#db7093] to-transparent mx-auto opacity-30" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl leading-relaxed transition-colors", children: '"Your presence is enough for us, but if you wish to give a gift, we provide the digital envelope below."' })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-10 items-stretch", children: [
        config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsx(Reveal$8, { delay: idx * 0.2, children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-white dark:bg-slate-900 border border-[#ffd1dc]/40 dark:border-white/5 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-center text-center space-y-10 group hover:shadow-[#ffd1dc]/30 dark:hover:shadow-white/5 transition-all duration-1000", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#fffafa] dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all shadow-inner", children: /* @__PURE__ */ jsx(Landmark, { className: "text-[#db7093] h-8 w-8" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#db7093] tracking-[0.4em] uppercase", children: account.bank }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors", children: account.number }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-400 dark:text-stone-400 italic transition-colors", children: [
              "a.n ",
              account.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => copyToClipboard(account.number, `bank-${idx}`),
              className: "group relative inline-flex items-center justify-center gap-3 py-5 bg-[#db7093] text-white rounded-full text-[11px] font-black tracking-widest uppercase transition-all hover:pr-14 hover:shadow-xl active:scale-95 shadow-lg shadow-[#db7093]/20",
              children: [
                copiedId === `bank-${idx}` ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { size: 14, strokeWidth: 3 }),
                  " Copied!"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Copy, { size: 14 }),
                  " Copy Number"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all", children: /* @__PURE__ */ jsx(ExternalLink, { size: 12 }) })
              ]
            }
          )
        ] }) }, idx)),
        config.giftAddress && /* @__PURE__ */ jsx(Reveal$8, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-white/10 dark:border-black/5 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-center text-center space-y-10 group hover:shadow-2xl transition-all duration-1000", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white/10 dark:bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all shadow-inner", children: /* @__PURE__ */ jsx(Home, { className: "text-[#db7093] h-8 w-8" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black tracking-[0.4em] uppercase opacity-60", children: "Physical Gift Address" }),
            /* @__PURE__ */ jsxs("h3", { className: "font-serif text-2xl font-bold leading-snug", children: [
              config.couple.bride.name,
              " & ",
              config.couple.groom.name
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-[250px] mx-auto italic leading-relaxed", children: config.giftAddress })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => copyToClipboard(config.giftAddress, "physical"),
              className: "group relative inline-flex items-center justify-center gap-3 py-5 bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-full text-[11px] font-black tracking-widest uppercase transition-all hover:pr-14 hover:shadow-xl active:scale-95",
              children: [
                copiedId === "physical" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { size: 14, strokeWidth: 3 }),
                  " Address Copied!"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Copy, { size: 14 }),
                  " Copy Address"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all", children: /* @__PURE__ */ jsx(ExternalLink, { size: 12 }) })
              ]
            }
          )
        ] }) })
      ] })
    ] })
  ] });
};
const Navbar$8 = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "couple", icon: Heart, label: "Couple" },
    { id: "event", icon: Calendar, label: "Event" },
    { id: "gallery", icon: Camera, label: "Gallery" },
    { id: "gift", icon: Gift, label: "Gift" },
    { id: "rsvp", icon: MessageCircle, label: "RSVP" }
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
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-[1100] transition-all duration-1000 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 py-3 rounded-full border border-[#ffd1dc]/40 dark:border-white/10 shadow-2xl flex items-center gap-2 md:gap-6", children: [
    navItems.map((item) => {
      const isActive = activeSection === item.id;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxs(
        "a",
        {
          href: `#${item.id}`,
          onClick: (e) => {
            e.preventDefault();
            scrollToSection(item.id);
          },
          className: `group relative flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive ? "text-[#db7093] scale-110" : "text-slate-400 dark:text-stone-500 hover:text-[#db7093]"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 18, className: `transition-transform duration-300 ${isActive ? "" : "group-hover:-translate-y-1"}` }),
            /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-[#db7093] text-white px-3 py-2 rounded-full whitespace-nowrap shadow-lg pointer-events-none", children: item.label }),
            isActive && /* @__PURE__ */ jsx(motion.div, { layoutId: "nav-active", className: "absolute -bottom-1 w-1 h-1 bg-[#db7093] rounded-full" })
          ]
        },
        item.id
      );
    }),
    /* @__PURE__ */ jsx("div", { className: "w-[1px] h-6 bg-[#ffd1dc]/40 dark:bg-white/10 mx-1 md:mx-2" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleTheme,
        className: "group relative flex flex-col items-center gap-1 p-2 text-slate-400 dark:text-stone-500 hover:text-[#db7093] transition-all duration-300",
        "aria-label": "Toggle theme",
        children: [
          theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 18 }) : /* @__PURE__ */ jsx(Sun, { size: 18 }),
          /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-[#db7093] text-white px-3 py-2 rounded-full whitespace-nowrap shadow-lg pointer-events-none", children: theme === "light" ? "Dark Mode" : "Light Mode" })
        ]
      }
    )
  ] }) });
};
const Footer$1 = () => {
  const { config, text } = useSettings();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const footerDate = (() => {
    const firstEvent = config.events[0];
    if (!firstEvent) return "";
    const d = firstEvent.startDateTime;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  })();
  return /* @__PURE__ */ jsxs("footer", { className: "bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000 border-t border-[#ffd1dc]/20", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none", style: { backgroundImage: "radial-gradient(#db7093 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl relative z-10 flex flex-col items-center text-center space-y-20", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: scrollToTop,
          className: "group flex flex-col items-center gap-4 transition-all hover:scale-105",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] group-hover:bg-[#db7093] group-hover:text-white transition-all shadow-xl shadow-[#ffd1dc]/20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "rotate-90", size: 24 }) }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-[0.4em] text-[#db7093] uppercase opacity-40 group-hover:opacity-100", children: "Back to Top" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#db7093] h-10 w-10 mx-auto fill-[#db7093] opacity-20 animate-pulse" }),
        /* @__PURE__ */ jsxs("h2", { className: "font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-[0.8] transition-colors", children: [
          config.couple.groom.name.split(" ")[0],
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#db7093]/30", children: "&" }),
          " ",
          config.couple.bride.name.split(" ")[0]
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-gradient-to-r from-transparent to-[#ffd1dc]" }),
          /* @__PURE__ */ jsx("p", { className: "text-[14px] font-black tracking-[0.6em] text-[#db7093] uppercase italic", children: footerDate }),
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-gradient-to-l from-transparent to-[#ffd1dc]" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12 max-w-2xl", children: [
        /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-12 bg-[#fffafa]/50 dark:bg-slate-900/50 rounded-[3rem] border border-[#ffd1dc]/10 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx(Quote, { className: "text-[#db7093] h-12 w-12 opacity-[0.05] mx-auto -mb-16 rotate-180" }),
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-xl md:text-2xl text-slate-400 dark:text-stone-400 italic leading-relaxed transition-colors", children: [
            '"',
            text.closing.text,
            '"'
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold", children: text.closing.salam })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-12 border-t border-[#ffd1dc]/20 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black tracking-[0.4em] text-[#db7093] uppercase italic", children: text.closing.signature }),
          /* @__PURE__ */ jsx("p", { className: "font-serif text-lg text-slate-400 italic", children: "Kami yang berbahagia," }),
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors", children: [
            "Keluarga Besar ",
            config.couple.groom.name,
            " & ",
            config.couple.bride.name
          ] }),
          config.closingFamily && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 italic max-w-sm mx-auto mt-6", children: config.closingFamily })
        ] })
      ] })
    ] })
  ] });
};
const RSVPForm$8 = () => {
  const { invitationId, config } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
    hadir: rsvps.filter((r) => r.attendance === AttendanceStatus.HADIR).reduce((total, r) => total + (r.guest_count || 1), 0),
    ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
    tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR).length
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
  return /* @__PURE__ */ jsxs("section", { id: "rsvp", className: "bg-[#fffafa] dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#ffd1dc] opacity-20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-[#ffe4e1] opacity-20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-12 text-center mb-16", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-[#db7093] h-10 w-10 mx-auto opacity-20" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-8xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "RSVP & Wishes" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] font-bold text-[#db7093] dark:text-[#ff8da1] uppercase transition-colors", children: "Join our celebration" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-14 relative overflow-hidden transition-all duration-1000 min-h-[600px] flex flex-col justify-between", children: submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 space-y-8 animate-reveal flex flex-col items-center justify-center flex-grow", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#db7093]/20 rounded-full blur-2xl animate-pulse" }),
          /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#db7093] h-24 w-24 relative z-10" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "See You There!" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 italic text-xl transition-colors", children: "Your presence will make our day complete." }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "px-12 py-5 bg-[#db7093] text-white rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20", children: "SEND ANOTHER RESPONSE" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-4 pb-10 border-b border-[#ffd1dc]/20", children: formSteps.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step > i + 1 ? "bg-[#db7093] text-white" : step === i + 1 ? "bg-[#db7093] text-white shadow-lg scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-300"}`, children: step > i + 1 ? /* @__PURE__ */ jsx(Check, { size: 16, strokeWidth: 3 }) : /* @__PURE__ */ jsx(s.icon, { size: 16 }) }),
          i < 2 && /* @__PURE__ */ jsx("div", { className: `w-8 h-[1px] ${step > i + 1 ? "bg-[#db7093]" : "bg-slate-200"}` })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-10 flex-grow pt-10", children: [
          /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
            step === 1 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                className: "space-y-8",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase", children: "Your Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        required: true,
                        disabled: isNameLocked,
                        placeholder: "Type your name...",
                        className: "w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-full px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#db7093]/20 outline-none transition-all",
                        value: formData.guest_name,
                        onChange: (e) => setFormData({ ...formData, guest_name: e.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase", children: "Phone Number (Optional)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        placeholder: "0812...",
                        className: "w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-full px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-4 focus:ring-[#db7093]/20 outline-none transition-all",
                        value: formData.phone,
                        onChange: (e) => setFormData({ ...formData, phone: e.target.value })
                      }
                    )
                  ] })
                ]
              },
              "step1"
            ),
            step === 2 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                className: "space-y-12",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase", children: "Will you attend?" }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFormData({ ...formData, attendance: status }),
                        className: `py-6 rounded-3xl border text-[10px] font-black tracking-widest uppercase transition-all ${formData.attendance === status ? "bg-[#db7093] border-[#db7093] text-white shadow-xl shadow-[#db7093]/20 scale-[1.02]" : "bg-white dark:bg-slate-800 border-[#ffd1dc]/20 text-[#db7093]"}`,
                        children: status === AttendanceStatus.HADIR ? "YES, I WILL" : "NO, I CAN'T"
                      },
                      status
                    )) })
                  ] }),
                  formData.attendance === AttendanceStatus.HADIR && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                    /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase flex items-center justify-between", children: [
                      "Guest Count ",
                      /* @__PURE__ */ jsxs("span", { children: [
                        formData.guest_count,
                        " Person"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setFormData((prev) => ({ ...prev, guest_count: Math.max(1, prev.guest_count - 1) })),
                          className: "w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all",
                          children: /* @__PURE__ */ jsx(Minus, { size: 20 })
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "flex-grow h-2 bg-[#ffd1dc]/30 rounded-full relative overflow-hidden", children: /* @__PURE__ */ jsx(
                        motion.div,
                        {
                          className: "absolute left-0 top-0 bottom-0 bg-[#db7093]",
                          animate: { width: `${formData.guest_count / config.maxGuests * 100}%` }
                        }
                      ) }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setFormData((prev) => ({ ...prev, guest_count: Math.min(config.maxGuests, prev.guest_count + 1) })),
                          className: "w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#db7093] hover:bg-[#db7093] hover:text-white transition-all",
                          children: /* @__PURE__ */ jsx(Plus, { size: 20 })
                        }
                      )
                    ] })
                  ] })
                ]
              },
              "step2"
            ),
            step === 3 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                className: "space-y-8",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase italic", children: "Add a Sticker" }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowStickerPicker(true),
                          className: "text-[#db7093] hover:rotate-12 transition-transform",
                          children: /* @__PURE__ */ jsx(Smile, { size: 24 })
                        }
                      )
                    ] }),
                    formData.sticker ? /* @__PURE__ */ jsxs("div", { className: "relative inline-block group", children: [
                      /* @__PURE__ */ jsx("img", { src: formData.sticker.src, className: "w-24 h-24 object-contain animate-bounce-slow" }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setFormData({ ...formData, sticker: null }),
                          className: "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                          children: /* @__PURE__ */ jsx(X, { size: 14 })
                        }
                      )
                    ] }) : /* @__PURE__ */ jsxs(
                      "div",
                      {
                        onClick: () => setShowStickerPicker(true),
                        className: "w-full h-32 border-2 border-dashed border-[#ffd1dc] rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-300 cursor-pointer hover:border-[#db7093] hover:text-[#db7093] transition-all",
                        children: [
                          /* @__PURE__ */ jsx(Smile, { size: 32 }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest uppercase", children: "Pick a Sticker" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#db7093] tracking-widest uppercase", children: "Message" }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        rows: 4,
                        placeholder: "Write a beautiful message...",
                        className: "w-full bg-[#fffafa] dark:bg-slate-800 border border-[#ffd1dc]/30 dark:border-white/10 rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none focus:ring-4 focus:ring-[#db7093]/20 transition-all resize-none",
                        value: formData.message,
                        onChange: (e) => setFormData({ ...formData, message: e.target.value })
                      }
                    )
                  ] })
                ]
              },
              "step3"
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-10", children: [
            step > 1 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setStep(step - 1),
                className: "w-20 py-2 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] hover:bg-slate-50 active:scale-95 transition-all",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
              }
            ),
            step < 3 ? /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setStep(step + 1),
                disabled: step === 1 && !formData.guest_name,
                className: "flex-grow bg-[#db7093] text-white py-6 rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 disabled:opacity-30 flex items-center justify-center gap-4 active:scale-95",
                children: [
                  "NEXT STEP ",
                  /* @__PURE__ */ jsx(ChevronRight, { size: 18 })
                ]
              }
            ) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: isSubmitting,
                className: "flex-grow bg-[#db7093] text-white py-6 rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-[#c71585] transition-all shadow-xl shadow-[#db7093]/20 flex items-center justify-center gap-4 active:scale-95",
                children: [
                  isSubmitting ? "SENDING..." : "CONFIRM RSVP",
                  /* @__PURE__ */ jsx(Send, { size: 18 })
                ]
              }
            )
          ] })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4 md:gap-8", children: [
          { label: "Attending", count: stats.hadir, color: "text-[#db7093]", bg: "bg-white" },
          { label: "Unsure", count: stats.ragu, color: "text-slate-400", bg: "bg-white/50" },
          { label: "Absent", count: stats.tidak, color: "text-[#ffd1dc]", bg: "bg-white/30" }
        ].map((stat, i) => /* @__PURE__ */ jsx(Reveal$8, { delay: i * 0.1, children: /* @__PURE__ */ jsxs("div", { className: `${stat.bg} dark:bg-slate-900 border border-[#ffd1dc]/20 dark:border-white/5 p-8 rounded-[3rem] text-center space-y-2 shadow-xl hover:-translate-y-2 transition-all duration-500`, children: [
          /* @__PURE__ */ jsx("p", { className: `font-serif text-4xl md:text-6xl font-bold ${stat.color}`, children: stat.count }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black tracking-widest text-[#db7093] uppercase italic", children: stat.label })
        ] }) }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: currentRSVPs.map((rsvp, idx) => /* @__PURE__ */ jsx(Reveal$8, { delay: idx * 0.05, children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg group hover:shadow-2xl transition-all duration-500 min-h-[160px] flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic leading-none", children: rsvp.guest_name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black tracking-widest text-[#db7093] uppercase opacity-40", children: rsvp.attendance === AttendanceStatus.HADIR ? `Hadir • ${rsvp.guest_count} Orang` : "Tidak Hadir" })
                ] }),
                rsvp.sticker && /* @__PURE__ */ jsx("img", { src: `/stickers/${rsvp.sticker}.webp`, className: "w-12 h-12 object-contain" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm italic leading-relaxed line-clamp-3", children: [
                '"',
                rsvp.message || "Sending love and prayers...",
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-200 dark:text-stone-700 font-bold uppercase tracking-widest", children: new Date(rsvp.created_at).toLocaleDateString() }) })
          ] }) }, rsvp.id)) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-6 pt-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                className: "w-12 h-12 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "font-serif text-xl italic text-[#db7093]", children: [
              currentPage,
              " / ",
              totalPages
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages,
                className: "w-12 h-12 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white",
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 20 })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      StickerPicker,
      {
        isOpen: showStickerPicker,
        selectedSticker: formData.sticker?.id || null,
        onSelect: (sticker) => {
          setFormData({ ...formData, sticker });
          setShowStickerPicker(false);
        },
        onClose: () => setShowStickerPicker(false)
      }
    )
  ] });
};
const Wishes$8 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
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
  const handleSubmit = async (e) => {
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
      setTimeout(() => setPostSuccess(false), 3e3);
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
  return /* @__PURE__ */ jsxs("section", { id: "wishes", className: "bg-white dark:bg-slate-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent opacity-30" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl relative z-10 space-y-24", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-6", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "text-[#db7093] h-10 w-10 mx-auto opacity-30 animate-pulse" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Digital Guestbook" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-xl mx-auto text-slate-400 dark:text-stone-400 italic font-serif text-xl transition-colors", children: '"Your prayers and warm wishes mean the world to us as we begin this new journey together."' })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsxs("div", { className: "bg-[#fffafa] dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] border border-[#ffd1dc]/40 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "Send a Wish" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-[#db7093] opacity-30 mx-auto" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("label", { className: "absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors", children: "From" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    required: true,
                    disabled: isNameLocked,
                    placeholder: "Your lovely name",
                    className: "w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-800 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors",
                    value: name,
                    onChange: (e) => setName(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("label", { className: "absolute -top-6 left-0 text-[10px] font-black text-[#db7093] dark:text-[#ff8da1] tracking-widest uppercase transition-colors", children: "Message" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    required: true,
                    placeholder: "Write your beautiful message...",
                    rows: 4,
                    className: "w-full bg-transparent border-b border-[#ffd1dc] dark:border-white/10 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 outline-none placeholder:text-slate-200 dark:placeholder:text-stone-800 focus:border-[#db7093] dark:focus:border-[#ff8da1] transition-colors resize-none",
                    value: message,
                    onChange: (e) => setMessage(e.target.value)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: isSending || postSuccess,
                className: `w-full py-6 rounded-full text-[11px] font-black tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-4 ${postSuccess ? "bg-green-500 text-white shadow-green-500/20" : "bg-[#db7093] dark:bg-[#ff8da1] text-white dark:text-slate-950 hover:bg-[#c71585] dark:hover:bg-white active:scale-95 transition-all shadow-lg shadow-[#db7093]/20"}`,
                children: [
                  isSending ? "SENDING..." : postSuccess ? "SENT WITH LOVE!" : "POST MESSAGE",
                  !postSuccess && /* @__PURE__ */ jsx(Heart, { size: 18 }),
                  postSuccess && /* @__PURE__ */ jsx(Check, { size: 18 })
                ]
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-8", children: currentWishes.map((wish, idx) => /* @__PURE__ */ jsx(Reveal$8, { delay: idx * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "relative group p-10 bg-[#fffafa] dark:bg-slate-900 rounded-[3.5rem] border border-[#ffd1dc]/10 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-1000 flex flex-col gap-6 min-h-[240px]", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-8 right-8 text-[#db7093]/10 dark:text-white/5 group-hover:text-[#db7093] transition-colors", children: /* @__PURE__ */ jsx(Quote, { size: 40 }) }),
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors", children: [
              '"',
              wish.message,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[#fffafa] dark:border-white/5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black tracking-[0.3em] text-[#db7093] dark:text-[#ff8da1] uppercase italic transition-colors truncate", children: wish.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-300 dark:text-stone-600 font-bold uppercase tracking-widest mt-1", children: new Date(wish.created_at).toLocaleDateString(void 0, { month: "long", day: "numeric", year: "numeric" }) })
            ] })
          ] }) }, wish.id)) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-8 pt-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                className: "w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white shadow-lg active:scale-90",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 28 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-10 py-4 bg-[#fffafa] dark:bg-slate-900 rounded-full border border-[#ffd1dc]/20 shadow-xl", children: [
              /* @__PURE__ */ jsx("span", { className: "font-serif text-3xl italic text-[#db7093]", children: currentPage }),
              /* @__PURE__ */ jsx("span", { className: "opacity-20 text-[#db7093] text-xl", children: "/" }),
              /* @__PURE__ */ jsx("span", { className: "font-serif text-3xl italic text-[#db7093] opacity-50", children: totalPages })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages,
                className: "w-16 h-16 rounded-full border border-[#ffd1dc] flex items-center justify-center text-[#db7093] disabled:opacity-20 transition-all hover:bg-[#db7093] hover:text-white shadow-lg active:scale-90",
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 28 })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
};
const StickerPicker = ({ isOpen, onClose, onSelect, selectedSticker }) => {
  const stickers = Array.from({ length: 40 }, (_, i) => ({
    id: `sticker-${i + 1}`,
    src: `/stickers/sticker-${i + 1}.webp`
  }));
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-6", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-md",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        className: "relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(Reveal$8, { children: /* @__PURE__ */ jsx(Smile, { className: "text-[#db7093] h-6 w-6" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl text-slate-800 dark:text-white italic", children: "Express with Stickers" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-8 max-h-[60vh] overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-6 custom-scrollbar", children: stickers.map((sticker) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => onSelect(sticker),
              className: `relative aspect-square p-2 rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${selectedSticker === sticker.id ? "border-[#db7093] bg-[#db7093]/5 p-0 scale-110" : "border-transparent hover:border-slate-100 dark:hover:border-white/10"}`,
              children: [
                /* @__PURE__ */ jsx("img", { src: sticker.src, className: "w-full h-full object-contain", alt: "Sticker" }),
                selectedSticker === sticker.id && /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 bg-[#db7093] text-white rounded-full p-1 shadow-lg", children: /* @__PURE__ */ jsx(Check, { size: 10, strokeWidth: 4 }) })
              ]
            },
            sticker.id
          )) }),
          /* @__PURE__ */ jsx("div", { className: "p-8 bg-slate-50 dark:bg-slate-950/50 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase", children: "Scroll for more" }) })
        ]
      }
    )
  ] }) });
};
const FloralTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `floral-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$8, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-1000 ${isOpened ? "opacity-100" : "opacity-0 blur-lg scale-95 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$8, {}),
      /* @__PURE__ */ jsx(CoupleProfile$8, {}),
      /* @__PURE__ */ jsx(LoveStory$8, {}),
      /* @__PURE__ */ jsx(EventDetails$8, {}),
      /* @__PURE__ */ jsx(Gallery$8, {}),
      /* @__PURE__ */ jsx(RSVPForm$8, {}),
      /* @__PURE__ */ jsx(Wishes$8, {}),
      /* @__PURE__ */ jsx(GiftInfo$8, {}),
      /* @__PURE__ */ jsx(Footer$1, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$8, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$7 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$7 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdf5e6] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#e2725b] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8a9a5b] opacity-10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-bold text-[#c19a6b] uppercase", children: "Invitation From Us" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-serif text-6xl md:text-7xl text-[#4a4a4a] italic leading-tight", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#e2725b]", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative py-12 px-8 border-[1.5px] border-[#c19a6b]/20 rounded-[3rem]", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#c19a6b] italic", children: "Kepada Yth. Bapak/Ibu/Saudara/i" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-5xl text-[#4a4a4a] font-bold tracking-tight", children: guestName || "Tamu Undangan" })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onOpen,
          className: "group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#e2725b] text-white rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-[#e2725b]/30",
          children: [
            /* @__PURE__ */ jsx("span", { className: "relative z-10 font-bold tracking-widest text-[11px] uppercase", children: "Buka Undangan" }),
            /* @__PURE__ */ jsx(Mail, { className: "relative z-10 h-4 w-4" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-widest text-[#c19a6b] uppercase opacity-60", children: "Save The Date" })
    ] })
  ] });
};
const Hero$7 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#faf7f2] dark:bg-stone-950 transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert transition-all" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#c19a6b]/10 dark:border-white/5 rounded-full scale-0 animate-reveal transition-colors", style: { animationDelay: "0.2s", animationFillMode: "forwards" } }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-16 px-6 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 reveal-active", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] dark:text-stone-500 h-10 w-10 mx-auto opacity-20 animate-spin-slow transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-bold text-[#c19a6b] dark:text-stone-400 uppercase transition-colors", children: "The Wedding Journey of" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors", children: config.couple.groom.name }),
          /* @__PURE__ */ jsx("span", { className: "font-serif text-5xl md:text-7xl text-[#e2725b] italic font-light transition-colors", children: "&" }),
          /* @__PURE__ */ jsx("h1", { className: "font-serif text-8xl md:text-[13rem] text-[#4a4a4a] dark:text-stone-200 leading-[0.7] tracking-tighter transition-colors", children: config.couple.bride.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-reveal", style: { animationDelay: "0.8s" }, children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-[1px] bg-[#c19a6b]/30 dark:bg-stone-800 mx-auto mb-6 transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-4xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: config.hero.date }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" }),
          /* @__PURE__ */ jsxs("p", { className: "tracking-[0.5em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors", children: [
            "At ",
            config.hero.city
          ] }),
          /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 fill-[#e2725b] text-[#e2725b] opacity-30 transition-colors" })
        ] })
      ] })
    ] })
  ] });
};
const CoupleProfile$7 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-96 h-96 bg-[#e2725b]/5 dark:bg-[#e2725b]/2 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl space-y-32 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-20 transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed max-w-3xl mx-auto transition-colors", children: '"Two souls, one heart. A journey that began with flowers and continues with stars."' }),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-[1px] bg-[#e2725b] mx-auto opacity-30" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 text-center group", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: config.couple.groom.image,
                className: "w-full h-full object-cover",
                alt: config.couple.groom.fullName
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors", children: "The Groom" }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors", children: "Putra dari Pasangan" }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors", children: config.couple.groom.parents })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 text-center group md:mt-40", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mx-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 border border-[#c19a6b]/20 rounded-t-full scale-105 transition-transform group-hover:scale-100 duration-700" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 w-72 md:w-96 h-[30rem] md:h-[40rem] overflow-hidden rounded-t-full shadow-2xl saturate-[0.7] hover:saturate-100 transition-all duration-1000", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: config.couple.bride.image,
                className: "w-full h-full object-cover",
                alt: config.couple.bride.fullName
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors", children: "The Bride" }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-5xl md:text-7xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-400 dark:text-stone-500 italic transition-colors", children: "Putri dari Pasangan" }),
              /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-[#c19a6b] dark:text-stone-400 font-bold transition-colors", children: config.couple.bride.parents })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LoveStory$7 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-white dark:bg-stone-900 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert rotate-12 transition-all" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-[#e2725b]/5 rounded-full blur-[120px]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-32 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx(Star, { className: "text-[#c19a6b] dark:text-stone-500 h-8 w-8 mx-auto opacity-30 animate-spin-slow transition-colors" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Our Soul Connection" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-gradient-to-r from-transparent to-[#e2725b] opacity-30" }),
          /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-black text-[#c19a6b] dark:text-stone-400 uppercase transition-colors", children: "Timeline of Togetherness" }),
          /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-gradient-to-l from-transparent to-[#e2725b] opacity-30 transition-colors" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative space-y-32 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-[#c19a6b]/10 dark:before:bg-white/5 transition-colors", children: config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`, children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-stone-800 border-2 border-[#e2725b] shadow-2xl flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#e2725b] animate-ping" }) }),
        /* @__PURE__ */ jsxs("div", { className: `w-full md:w-1/2 space-y-8 bg-[#faf7f2] dark:bg-stone-950 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-2xl transition-all duration-1000 hover:-translate-y-4 group ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "font-serif text-4xl md:text-5xl text-[#e2725b] italic tracking-tight transition-colors", children: story.date }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl md:text-4xl text-[#4a4a4a] dark:text-stone-200 font-black tracking-tight group-hover:text-[#e2725b] transition-colors", children: story.title })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `w-12 h-1 bg-[#c19a6b] opacity-20 rounded-full ${idx % 2 === 0 ? "ml-auto" : ""}` }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors", children: story.desc })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
      ] }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center pt-20", children: /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-8 w-8 mx-auto opacity-20 animate-spin-slow" }) })
    ] })
  ] });
};
const EventDetails$7 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#e2725b]/10 -rotate-12 translate-x-32 -translate-y-32" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: "Sacred Union" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[11px] font-black text-[#e2725b] uppercase transition-colors", children: "Place & Time" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-16", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 rounded-[3rem] shadow-2xl transition-all group-hover:shadow-[#e2725b]/20 group-hover:-translate-y-2 duration-1000" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-12 md:p-20 space-y-12 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-1 bg-[#e2725b] mx-auto opacity-40 rounded-full" }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl md:text-5xl text-[#4a4a4a] dark:text-stone-200 font-bold tracking-tight transition-colors", children: event.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "text-[#c19a6b] h-6 w-6 opacity-40" }),
              /* @__PURE__ */ jsxs("p", { className: "font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: [
                event.day,
                ", ",
                event.date
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsx(Clock, { className: "text-[#c19a6b] h-6 w-6 opacity-40" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12px] font-black text-[#e2725b] tracking-[0.3em] uppercase", children: [
                event.startTime,
                " — ",
                event.endTime,
                " WIB"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-10 border-t border-[#faf7f2] dark:border-white/5 flex flex-col items-center gap-4 transition-colors", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "text-[#c19a6b] h-6 w-6 opacity-40" }),
              /* @__PURE__ */ jsx("h4", { className: "font-serif text-2xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors", children: event.venue.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 dark:text-stone-500 max-w-[280px] mx-auto italic leading-relaxed transition-colors", children: event.venue.address })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-8", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: event.venue.mapsEmbedUrl.replace("&output=embed", ""),
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-4 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl shadow-[#4a4a4a]/20 duration-500",
              children: [
                /* @__PURE__ */ jsx(Map, { size: 16 }),
                " Open Location"
              ]
            }
          ) })
        ] })
      ] }, event.id)) })
    ] })
  ] });
};
const Gallery$7 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#faf7f2] dark:bg-stone-900 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 dark:invert pointer-events-none transition-all" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$7, { children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-8 w-8 mx-auto opacity-30 animate-spin-slow" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-6xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Glimpses of Love" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] sm:text-xs font-bold text-[#e2725b] uppercase transition-colors", children: "Visual Journey" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-px bg-[#e2725b] mx-auto opacity-30" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$7, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 rounded-3xl bg-white dark:bg-stone-800 border-2 border-[#c19a6b]/20 dark:border-white/5 flex items-center justify-center text-[#e2725b] hover:bg-[#e2725b] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-[#e2725b] scale-110 shadow-2xl z-20" : "border-transparent opacity-40 grayscale-[0.4] hover:opacity-100 hover:grayscale-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 rounded-3xl bg-white dark:bg-stone-800 border-2 border-[#c19a6b]/20 dark:border-white/5 flex items-center justify-center text-[#e2725b] hover:bg-[#e2725b] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$7, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[4rem] sm:rounded-[5rem] overflow-hidden border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl group transition-all duration-1000", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.05 },
            transition: { duration: 0.8, ease: "anticipate" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer saturate-[0.8] group-hover:saturate-100",
            alt: "Boho Moment",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#e2725b]/5 opacity-50 pointer-events-none group-hover:opacity-0 transition-opacity" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 right-12 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#e2725b]/80 shadow-2xl",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 28 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#faf7f2]/95 dark:bg-stone-950/98 backdrop-blur-2xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-[#e2725b] hover:scale-110 transition-all z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 40, className: "sm:size-16", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-[#c19a6b] hover:text-[#e2725b] transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[100px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.1 },
                transition: { duration: 0.5 },
                className: "relative max-h-full max-w-full flex items-center justify-center",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[85vh] w-auto h-auto object-contain rounded-[3rem] sm:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(226,114,91,0.2)] border-2 border-[#c19a6b]/10",
                      alt: "Boho Reel"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-20 flex items-center justify-center gap-6", children: /* @__PURE__ */ jsx("div", { className: "px-8 py-3 bg-white/40 dark:bg-stone-800/40 backdrop-blur-xl rounded-full border border-[#c19a6b]/20", children: /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-2xl text-[#e2725b] dark:text-stone-300", children: [
                    "Page ",
                    selectedImg + 1,
                    " / ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-[#c19a6b] hover:text-[#e2725b] transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[100px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$7 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "gift", className: "bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-80 h-80 bg-[#e2725b]/5 rotate-45 translate-x-32 translate-y-32" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-24 relative z-10 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-12 w-12 mx-auto opacity-30 animate-spin-slow" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Gifts of Love" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors", children: '"Your prayers are the most precious gifts. Should you wish to share more, we provide these digital options."' }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#e2725b] mx-auto opacity-30 rounded-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-10 items-stretch", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-stone-900 border border-[#c19a6b]/20 dark:border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-10 group hover:shadow-[#e2725b]/20 transition-all duration-1000", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#faf7f2] dark:bg-stone-950 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all", children: /* @__PURE__ */ jsx(Landmark, { className: "text-[#e2725b] h-8 w-8" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#c19a6b] tracking-[0.5em] uppercase", children: account.bank }),
          /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold tracking-tight transition-colors", children: account.number }),
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-xl italic text-slate-400 dark:text-stone-500 transition-colors", children: [
            "a.n ",
            account.name
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => copyToClipboard(account.number, `bank-${idx}`),
            className: "inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-[#e2725b] dark:hover:bg-[#e2725b] shadow-2xl transition-all duration-500",
            children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { size: 16, className: "text-green-400" }),
              " Account Copied"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Copy, { size: 16 }),
              " Copy Number"
            ] })
          }
        )
      ] }, idx)) })
    ] })
  ] });
};
const Navbar$7 = ({ theme, toggleTheme }) => {
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
    { icon: Calendar, label: "Dates", href: "#event" },
    { icon: Camera, label: "Gallery", href: "#gallery" },
    { icon: Gift, label: "Gifts", href: "#gift" },
    { icon: MessageCircle, label: "RSVP", href: "#rsvp" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-[#4a4a4a]/95 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: "group relative flex flex-col items-center gap-1 text-[#c19a6b] hover:text-[#e2725b] transition-all",
        children: [
          /* @__PURE__ */ jsx(item.icon, { size: 20, className: "transition-transform group-hover:-translate-y-1" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-50 group-hover:scale-100", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#e2725b] text-[#faf7f2] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl", children: [
            item.label,
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#e2725b] rotate-45" })
          ] }) })
        ]
      },
      idx
    )),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleTheme,
        className: "group relative flex flex-col items-center gap-1 text-[#c19a6b] hover:text-[#e2725b] transition-all",
        "aria-label": "Toggle theme",
        children: [
          theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-50 group-hover:scale-100", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#e2725b] text-[#faf7f2] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl", children: [
            theme === "light" ? "Dark Spirit" : "Light Spirit",
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#e2725b] rotate-45" })
          ] }) })
        ]
      }
    )
  ] }) });
};
const RSVPForm$7 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
    hadir: rsvps.filter((r) => r.attendance === AttendanceStatus.HADIR).reduce((total, r) => total + (r.guest_count || 1), 0),
    ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
    tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR).length
  };
  const currentRSVPs = useMemo(() => {
    const start = (currentPage - 1) * rsvpsPerPage;
    const sorted = [...rsvps].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    return sorted.slice(start, start + rsvpsPerPage);
  }, [rsvps, currentPage]);
  const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);
  return /* @__PURE__ */ jsxs("section", { id: "rsvp", className: "bg-[#faf7f2] dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-64 h-64 bg-[#8a9a5b]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/30 dark:border-white/5 shadow-2xl space-y-14 relative group overflow-hidden transition-all duration-1000", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-6 w-6 opacity-30 animate-spin-slow" }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-6xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Will You Join Us?" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#e2725b] tracking-[0.5em] uppercase transition-colors", children: "RSVP Online" })
        ] }),
        submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10 space-y-8 animate-reveal", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#e2725b] h-20 w-20 mx-auto opacity-30" }),
          /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 italic font-bold transition-colors", children: "Wonderful!" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-stone-400 italic transition-colors", children: "Your presence will fill our hearts with joy." }),
          /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-[#e2725b] text-[10px] font-black tracking-widest uppercase border-b-2 border-[#e2725b]/20 pb-1", children: "Reset Form" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Full Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  disabled: isNameLocked,
                  className: "w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-3xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all shadow-inner",
                  value: formData.guest_name,
                  onChange: (e) => setFormData({ ...formData, guest_name: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Prayer or Message" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 4,
                  className: "w-full bg-[#faf7f2] dark:bg-stone-800 border-none rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 focus:ring-[1px] focus:ring-[#e2725b] outline-none transition-all resize-none shadow-inner",
                  value: formData.message,
                  onChange: (e) => setFormData({ ...formData, message: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Pilih Sticker" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowStickerPicker(true),
                  className: "text-[#c19a6b] hover:text-[#e2725b] transition-colors",
                  children: /* @__PURE__ */ jsx(Smile, { className: "w-6 h-6" })
                }
              )
            ] }),
            formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2", children: [
              /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-16 h-16 object-contain" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData({ ...formData, sticker: null }),
                  className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md",
                  children: /* @__PURE__ */ jsx(X, { size: 12 })
                }
              )
            ] }),
            showStickerPicker && /* @__PURE__ */ jsx(
              StickerPicker$1,
              {
                isOpen: showStickerPicker,
                selectedSticker: formData.sticker?.id || null,
                onSelect: (sticker) => {
                  setFormData({ ...formData, sticker });
                  setShowStickerPicker(false);
                },
                onClose: () => setShowStickerPicker(false)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Are you joining?" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR, AttendanceStatus.RAGU].map((status) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setFormData({ ...formData, attendance: status }),
                className: `flex items-center justify-between px-10 py-5 rounded-3xl border transition-all duration-500 ${formData.attendance === status ? "bg-[#e2725b] border-[#e2725b] text-white shadow-xl translate-x-2" : "bg-white dark:bg-stone-800 border-[#c19a6b]/20 dark:border-white/5 text-[#c19a6b] dark:text-stone-400 hover:bg-[#faf7f2] dark:hover:bg-stone-700"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest uppercase", children: status.replace("TIDAK_HADIR", "Cannot Attend").replace("HADIR", "Confirm Presence").replace("RAGU", "Maybe Later") }),
                  formData.attendance === status && /* @__PURE__ */ jsx(Heart, { size: 16, className: "fill-white" })
                ]
              },
              status
            )) })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: isSubmitting,
              className: "w-full bg-[#4a4a4a] dark:bg-stone-800 text-[#faf7f2] py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase hover:bg-[#e2725b] transition-all shadow-2xl flex items-center justify-center gap-4 duration-500",
              children: [
                isSubmitting ? "Sending..." : "Submit Reservation",
                /* @__PURE__ */ jsx(Send, { size: 18 })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-6", children: [
          { label: "Joined", count: stats.hadir, color: "text-[#e2725b]" },
          { label: "Uncertain", count: stats.ragu, color: "text-[#c19a6b]" },
          { label: "Absent", count: stats.tidak, color: "text-slate-300" }
        ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "p-12 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 text-center space-y-2 shadow-2xl transition-all duration-1000", children: [
          /* @__PURE__ */ jsx("p", { className: `font-serif text-5xl md:text-8xl font-black tracking-tighter ${stat.color}`, children: stat.count }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black tracking-widest text-slate-400 uppercase", children: stat.label })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black text-[#e2725b] tracking-widest uppercase", children: "Community Attendance" }),
            /* @__PURE__ */ jsx("div", { className: "h-px flex-grow bg-gradient-to-r from-[#e2725b]/40 to-transparent" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-8", children: currentRSVPs.map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-10 bg-white dark:bg-stone-900 rounded-[3.5rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-lg space-y-5 hover:scale-[1.02] transition-all duration-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic transition-colors", children: rsvp.guest_name }),
              /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full ${rsvp.attendance === AttendanceStatus.HADIR ? "bg-[#e2725b]" : "bg-slate-200"}` })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-slate-400 dark:text-stone-400 text-lg font-serif italic leading-relaxed transition-colors", children: [
              '"',
              rsvp.message || "Blessings...",
              '"'
            ] })
          ] }, rsvp.id)) }),
          totalPages > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4 pt-10", children: [...Array(totalPages)].map((_, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage(i + 1),
              className: `w-14 h-14 rounded-2xl font-serif text-2xl transition-all duration-500 ${currentPage === i + 1 ? "bg-[#e2725b] text-white shadow-2xl -translate-y-2" : "text-[#c19a6b] dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 border border-[#c19a6b]/20 dark:border-white/5"}`,
              children: i + 1
            },
            i
          )) })
        ] })
      ] })
    ] }) })
  ] });
};
const Wishes$7 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
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
  const handleSubmit = async (e) => {
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
      setTimeout(() => setPostSuccess(false), 3e3);
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
  return /* @__PURE__ */ jsxs("section", { id: "wishes", className: "bg-white dark:bg-stone-950 py-24 md:py-40 px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/weave.png')] opacity-5 dark:invert pointer-events-none transition-all" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl relative z-10 space-y-32", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-8", children: [
        /* @__PURE__ */ jsx(Sun, { className: "text-[#c19a6b] h-10 w-10 mx-auto opacity-20 animate-spin-slow" }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-5xl md:text-9xl text-[#4a4a4a] dark:text-stone-200 italic leading-tight transition-colors", children: "Blessing Tree" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto text-slate-400 dark:text-stone-400 font-serif text-2xl italic leading-relaxed transition-colors", children: '"Your words are the seeds of our future garden. Thank you for being part of our story."' }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-px bg-[#e2725b] opacity-40" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 bg-[#faf7f2] dark:bg-stone-900 p-12 md:p-16 rounded-[4rem] border border-[#c19a6b]/20 dark:border-white/5 shadow-2xl space-y-12 transition-all duration-1000", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-4xl text-[#4a4a4a] dark:text-stone-200 font-bold transition-colors", children: "Write a Note" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#e2725b] tracking-[0.4em] uppercase", children: "Digital Guestbook" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Your Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    required: true,
                    disabled: isNameLocked,
                    placeholder: "Beautiful name here",
                    className: "w-full bg-white dark:bg-stone-800 rounded-2xl px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700",
                    value: name,
                    onChange: (e) => setName(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-[#c19a6b] tracking-widest uppercase ml-4", children: "Warm Wishes" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    required: true,
                    placeholder: "Pour your heart out...",
                    rows: 5,
                    className: "w-full bg-white dark:bg-stone-800 rounded-[2.5rem] px-8 py-5 font-serif text-2xl italic text-[#4a4a4a] dark:text-stone-200 shadow-inner outline-none transition-all focus:ring-1 focus:ring-[#e2725b] placeholder:text-slate-200 dark:placeholder:text-stone-700 resize-none",
                    value: message,
                    onChange: (e) => setMessage(e.target.value)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: isSending || postSuccess,
                className: `w-full py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${postSuccess ? "bg-green-600 text-white" : "bg-[#e2725b] text-white dark:text-slate-950 hover:bg-[#4a4a4a] dark:hover:bg-white transition-colors duration-500"}`,
                children: [
                  isSending ? "Sending Wish..." : postSuccess ? "Wish Received!" : "Post Message",
                  !postSuccess && /* @__PURE__ */ jsx(Send, { size: 18 }),
                  postSuccess && /* @__PURE__ */ jsx(Check, { size: 18 })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-8", children: currentWishes.map((wish) => /* @__PURE__ */ jsxs("div", { className: "relative group p-12 bg-white dark:bg-stone-900 rounded-[4rem] border border-[#c19a6b]/10 dark:border-white/5 shadow-xl hover:shadow-[#e2725b]/20 transition-all duration-1000 flex flex-col gap-6", children: [
            /* @__PURE__ */ jsx(Quote, { className: "text-[#e2725b] h-10 w-10 opacity-10 -ml-2" }),
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-3xl text-[#4a4a4a] dark:text-stone-200 italic leading-relaxed flex-grow transition-colors", children: [
              '"',
              wish.message,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-[#faf7f2] dark:border-white/5 flex items-center justify-between transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black tracking-[0.3em] text-[#e2725b] uppercase italic transition-colors", children: wish.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-300 dark:text-stone-500 italic transition-colors", children: new Date(wish.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })
              ] }),
              /* @__PURE__ */ jsx(Heart, { className: "text-[#e2725b] h-4 w-4 opacity-20 fill-[#e2725b]" })
            ] })
          ] }, wish.id)) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 pt-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                className: "w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8 px-12 bg-[#faf7f2] dark:bg-stone-800 rounded-2xl text-[#c19a6b] dark:text-stone-400 font-serif text-2xl italic shadow-inner transition-colors", children: [
              /* @__PURE__ */ jsx("span", { children: currentPage }),
              /* @__PURE__ */ jsx("span", { className: "opacity-10", children: "/" }),
              /* @__PURE__ */ jsx("span", { children: totalPages })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages,
                className: "w-16 h-16 rounded-2xl border border-[#c19a6b]/20 flex items-center justify-center text-[#c19a6b] disabled:opacity-10 transition-all hover:bg-[#faf7f2] hover:shadow-xl",
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
};
const BohoTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `boho-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$7, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-1000 ${isOpened ? "opacity-100" : "opacity-0 blur-xl scale-110 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$7, {}),
      /* @__PURE__ */ jsx(CoupleProfile$7, {}),
      /* @__PURE__ */ jsx(LoveStory$7, {}),
      /* @__PURE__ */ jsx(EventDetails$7, {}),
      /* @__PURE__ */ jsx(Gallery$7, {}),
      /* @__PURE__ */ jsx(GiftInfo$7, {}),
      /* @__PURE__ */ jsx(RSVPForm$7, {}),
      /* @__PURE__ */ jsx(Wishes$7, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$7, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$6 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30, filter: "blur(10px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: false, margin: "-100px" },
      transition: { duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] },
      style: { position: "relative", width },
      className,
      children
    }
  );
};
const Envelope$6 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  const [isExiting, setIsExiting] = useState(false);
  const handleOpen = () => {
    setIsExiting(true);
    setTimeout(onOpen, 1500);
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !isExiting && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: {
        opacity: 0,
        transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }
      },
      className: "fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-950 overflow-hidden text-white",
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, rotate: 12, y: -100 },
            animate: { opacity: 0.05, rotate: 12, y: -200 },
            transition: { duration: 2, ease: "easeOut" },
            className: "absolute top-0 left-0 w-full h-1/2 bg-white skew-y-12"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, rotate: 12, y: 100 },
            animate: { opacity: 0.05, rotate: 12, y: 200 },
            transition: { duration: 2, ease: "easeOut" },
            className: "absolute bottom-0 right-0 w-full h-1/2 bg-white skew-y-12"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-16", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 1, delay: 0.5 },
              className: "space-y-6 text-center",
              children: [
                /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-black uppercase text-zinc-500", children: "The Wedding Invitation of" }),
                /* @__PURE__ */ jsxs("h1", { className: "text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none", children: [
                  config.couple.groom.name,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: "&" }),
                  " ",
                  config.couple.bride.name
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scaleX: 0 },
              animate: { scaleX: 1 },
              transition: { duration: 1.5, delay: 0.8 },
              className: "w-full h-px bg-zinc-800 origin-left"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between w-full gap-12", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 1, delay: 1.2 },
                className: "text-left space-y-4",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-zinc-500 tracking-widest", children: "Inviting You" }),
                  /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold uppercase tracking-tight", children: guestName || "Distinguished Guest" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 1, delay: 1.4 },
                onClick: handleOpen,
                className: "group relative flex items-center gap-6 px-10 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-[10px_10px_0_rgba(255,255,255,0.2)]",
                children: [
                  "Enter Experience",
                  /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 1.6 },
              className: "absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.8em] font-black text-zinc-700 uppercase",
              children: [
                "Est. ",
                (/* @__PURE__ */ new Date()).getFullYear()
              ]
            }
          )
        ] })
      ]
    }
  ) });
};
const Hero$6 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative h-screen flex flex-col justify-end bg-zinc-950 text-white overflow-hidden p-8 md:p-20", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsx(
      motion.h1,
      {
        initial: { scale: 1.2, opacity: 0 },
        animate: { scale: 1, opacity: 0.03 },
        transition: { duration: 2 },
        className: "text-[30rem] md:text-[50rem] font-black uppercase tracking-tighter leading-none whitespace-nowrap -rotate-6",
        children: "Marr-ied"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-end justify-between gap-12 border-t border-zinc-800 pt-12", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-2xl text-left", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-500", children: "Official Ceremony" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-8xl md:text-[14rem] font-black tracking-tighter uppercase leading-[0.8]", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-zinc-700", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start md:items-end gap-4 text-left md:text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500", children: "Save the Date" }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-6xl font-black uppercase tracking-tighter", children: config.hero.date }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-zinc-400 max-w-[200px] leading-relaxed", children: [
          "Join us at ",
          config.hero.city,
          " for a night of celebration and joy."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 h-px bg-zinc-700 mt-4" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-8 md:right-20 vertical-text hidden md:block", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-800 whitespace-nowrap", children: [
      "CHAPTER TWO — ",
      (/* @__PURE__ */ new Date()).getFullYear()
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            ` })
  ] });
};
const CoupleProfile$6 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "couple", className: "bg-white dark:bg-zinc-950 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 md:gap-40 items-start", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-16 group", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0_rgba(255,255,255,0.02)] transition-all", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: config.couple.groom.image,
              className: "w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105",
              alt: config.couple.groom.fullName
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8 flex flex-col items-start gap-2", children: /* @__PURE__ */ jsx("span", { className: "bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors", children: "Groom" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none", children: config.couple.groom.name }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-2 bg-black dark:bg-white" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400", children: "Parents" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold uppercase tracking-tight transition-colors", children: config.couple.groom.parents })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "space-y-16 group md:mt-64", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[-20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[-20px_20px_0_rgba(255,255,255,0.02)] transition-all", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: config.couple.bride.image,
              className: "w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105",
              alt: config.couple.bride.fullName
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-8 right-8 flex flex-col items-end gap-2 text-right", children: /* @__PURE__ */ jsx("span", { className: "bg-black dark:bg-zinc-800 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest transition-colors", children: "Bride" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 md:text-right flex flex-col md:items-end", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none", children: config.couple.bride.name }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-2 bg-black dark:bg-white" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400", children: "Parents" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold uppercase tracking-tight transition-colors", children: config.couple.bride.parents })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "mt-40 grid md:grid-cols-2 items-center gap-12 border-t border-zinc-100 dark:border-zinc-800 pt-12 transition-colors", children: [
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-black uppercase tracking-tighter italic", children: '"A monochromatic bond, etched in time and love."' }),
      /* @__PURE__ */ jsx("div", { className: "flex md:justify-end", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-zinc-400 max-w-sm leading-relaxed", children: "Witness the union of two souls that complete each other's shades. A journey of depth, contrast, and infinite connection." }) })
    ] }) })
  ] }) });
};
const LoveStory$6 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -rotate-12" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-baseline gap-12", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-none", children: [
          "The ",
          /* @__PURE__ */ jsx("br", {}),
          " Log"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-left md:text-right space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-600", children: "Sequential Connection" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold uppercase tracking-tight max-w-md ml-auto", children: "A documentation of significant milestones that led us to this union." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-px bg-zinc-800 border-[1px] border-zinc-800", children: config.loveStory.map((story, idx) => /* @__PURE__ */ jsx(Reveal$6, { delay: idx * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "bg-zinc-950 p-12 md:p-20 space-y-12 group hover:bg-zinc-900 transition-all duration-700 h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-zinc-700", children: [
            "STORY_",
            idx + 1
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white/20 group-hover:text-white transition-colors", children: story.date })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight", children: story.title }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-2 bg-white" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-zinc-500 uppercase tracking-tight leading-relaxed line-clamp-4", children: story.desc })
        ] })
      ] }) }, idx)) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "pt-20 border-t border-zinc-800 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-700", children: "Status: Evolving" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-zinc-800" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-zinc-900" })
        ] })
      ] }) })
    ] })
  ] });
};
const EventDetails$6 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-full h-[1px] bg-zinc-800" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-32", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-baseline gap-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none", children: "Schedule" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-600", children: "The Grand Occasions" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-px bg-zinc-800", children: config.events.map((event, idx) => /* @__PURE__ */ jsx(Reveal$6, { delay: idx * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-12 bg-zinc-950 py-20 px-4 md:px-12 group hover:bg-zinc-900 transition-all duration-700 items-center gap-12 border-b border-zinc-800", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase text-zinc-600 tracking-widest", children: idx === 0 ? "Part One" : "Part Two" }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter", children: event.title })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-4 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-6xl font-black uppercase italic tracking-tighter", children: event.date }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold uppercase tracking-tight text-white/50", children: [
            event.startTime,
            " — ",
            event.endTime,
            " WIB"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-3 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-zinc-600 tracking-widest", children: "Venue" }),
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-black uppercase leading-tight", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 max-w-[200px] leading-relaxed", children: event.venue.address })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2 flex md:justify-end", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: event.venue.mapsEmbedUrl.replace("&output=embed", ""),
            target: "_blank",
            className: "w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:scale-110 active:scale-95",
            children: /* @__PURE__ */ jsx(ArrowUpRight, { size: 32, strokeWidth: 2.5 })
          }
        ) })
      ] }) }, event.id)) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "pt-20 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-block px-12 py-8 bg-zinc-900 border border-zinc-800", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500", children: "Dresscode Policy" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-black uppercase tracking-tighter mt-2", children: "Monochromatic Attire Recommended" })
      ] }) }) })
    ] })
  ] });
};
const Gallery$6 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-white dark:bg-zinc-950 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none", style: { backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "50px 50px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none dark:text-white transition-colors", children: "Frames" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-black dark:bg-white transition-colors" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] dark:text-white transition-colors", children: "Static Motion" }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-black dark:bg-white transition-colors" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24, strokeWidth: 3 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 grayscale ${activeIndex === idx ? "border-black dark:border-white scale-110 grayscale-0 z-20" : "border-transparent opacity-40 hover:opacity-80 hover:grayscale-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24, strokeWidth: 3 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[500px] mx-auto overflow-hidden border-4 border-black dark:border-white transition-colors shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] group", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.8, ease: "anticipate" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-1000",
            alt: "Featured Frame",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-8 bottom-8 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black text-white uppercase tracking-widest bg-black px-4 py-2 border border-white/20", children: [
            "Frame #",
            activeIndex + 1
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openLightbox(activeIndex),
              className: "w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors",
              children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-white dark:bg-zinc-950 px-4 sm:px-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-black dark:text-white hover:rotate-90 transition-all duration-500 z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 40, className: "sm:size-16", strokeWidth: 3 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center py-10 sm:py-20", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: -10 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-black dark:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[120px]", strokeWidth: 3 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 1.1 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
                transition: { duration: 0.5 },
                className: "relative h-full w-full flex items-center justify-center",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-full max-w-full object-contain border-8 border-black dark:border-white shadow-2xl",
                      alt: "Fullscreen Frame"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8 hidden md:block", children: /* @__PURE__ */ jsxs("p", { className: "text-[200px] font-black text-black/5 dark:text-white/5 leading-none", children: [
                    "#",
                    selectedImg + 1
                  ] }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: 10 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-black dark:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[120px]", strokeWidth: 3 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 left-12 flex flex-col items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[2px] w-24 bg-black dark:bg-white transition-colors" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-black dark:text-white", children: [
              "Image ",
              selectedImg + 1,
              " / ",
              config.galleryImages.length
            ] })
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$6 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "gift", className: "bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-full bg-white opacity-[0.02] -skew-x-12 translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start", children: [
      /* @__PURE__ */ jsx(Reveal$6, { className: "lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-600", children: "Contribution" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none", children: [
            "Wedding ",
            /* @__PURE__ */ jsx("br", {}),
            " Tokens"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-500 font-bold uppercase tracking-tight leading-relaxed italic", children: "Your presence is the priority, but should you wish to share a token of love, we provide these simple digital and physical channels." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 w-full space-y-12", children: [
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-1", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsx(Reveal$6, { delay: idx * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 p-10 space-y-8 group h-full flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black uppercase text-zinc-600 tracking-widest", children: account.bank }),
              /* @__PURE__ */ jsx(Landmark, { size: 16, className: "text-zinc-700" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-black tracking-tighter uppercase break-all", children: account.number }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold uppercase tracking-tight text-white/50 italic", children: [
              "A.N ",
              account.name
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => copyToClipboard(account.number, `bank-${idx}`),
              className: "w-full py-5 border border-zinc-700 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95",
              children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Check, { size: 14 }),
                " COPIED"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Copy, { size: 14 }),
                " COPY NUMBER"
              ] })
            }
          )
        ] }) }, idx)) }),
        config.giftAddress && /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 p-10 space-y-8 group", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black uppercase text-zinc-600 tracking-widest", children: "Physical Gift" }),
              /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-zinc-700" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg font-bold uppercase tracking-tight text-white/50 leading-relaxed italic", children: config.giftAddress })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => copyToClipboard(config.giftAddress, "physical-gift"),
              className: "w-full py-5 border border-zinc-700 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95",
              children: copiedId === "physical-gift" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Check, { size: 14 }),
                " ADDRESS COPIED"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Copy, { size: 14 }),
                " COPY ADDRESS"
              ] })
            }
          )
        ] }) })
      ] })
    ] }) })
  ] });
};
const Navbar$6 = ({ theme, toggleTheme }) => {
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
    { icon: MessageCircle, label: "RSVP", href: "#rsvp" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-90 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center gap-6 md:gap-10 transition-colors duration-1000", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: "group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx(item.icon, { size: 20, className: "transition-transform group-hover:-translate-y-1" }),
          /* @__PURE__ */ jsx("span", { className: "absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2", children: item.label })
        ]
      },
      idx
    )),
    /* @__PURE__ */ jsx("div", { className: "w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleTheme,
        className: "group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300",
        "aria-label": "Toggle theme",
        children: [
          theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }),
          /* @__PURE__ */ jsx("span", { className: "absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2", children: theme === "light" ? "Dark Mode" : "Light Mode" })
        ]
      }
    )
  ] }) });
};
const RSVPForm$6 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
  return /* @__PURE__ */ jsxs("section", { id: "rsvp", className: "bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-zinc-800" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start", children: [
      /* @__PURE__ */ jsx(Reveal$6, { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-600", children: "Confirmation" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none", children: [
            "Are You ",
            /* @__PURE__ */ jsx("br", {}),
            " Coming?"
          ] })
        ] }),
        submitted ? /* @__PURE__ */ jsxs("div", { className: "p-12 border border-zinc-800 bg-zinc-900/50 space-y-8 animate-reveal text-center", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "text-white h-16 w-16 mx-auto" }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black uppercase tracking-tighter", children: "Response Recorded" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-500 uppercase text-xs font-bold tracking-widest leading-loose", children: "Thank you for your response. We have added your name to our guest list session." }),
          /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-white border-b-2 border-white pb-1 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400 hover:border-zinc-400 transition-all", children: "Send another response" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500", children: "Identity" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  disabled: isNameLocked,
                  placeholder: "INPUT FULL NAME",
                  className: "w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none",
                  value: formData.guest_name,
                  onChange: (e) => setFormData({ ...formData, guest_name: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500", children: "Statement" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 2,
                  placeholder: "LEAVE A SHORT MESSAGE",
                  className: "w-full bg-transparent border-b-2 border-zinc-800 py-6 text-3xl font-black uppercase tracking-tighter placeholder:text-zinc-800 focus:border-white transition-all outline-none resize-none",
                  value: formData.message,
                  onChange: (e) => setFormData({ ...formData, message: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500", children: "Pilih Sticker" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowStickerPicker(true),
                  className: "text-zinc-500 hover:text-white transition-colors",
                  children: /* @__PURE__ */ jsx(Smile, { size: 24 })
                }
              )
            ] }),
            formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2", children: [
              /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-16 h-16 object-contain" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData({ ...formData, sticker: null }),
                  className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md",
                  children: /* @__PURE__ */ jsx(X, { size: 12 })
                }
              )
            ] }),
            showStickerPicker && /* @__PURE__ */ jsx(
              StickerPicker$1,
              {
                isOpen: showStickerPicker,
                selectedSticker: formData.sticker?.id || null,
                onSelect: (sticker) => {
                  setFormData({ ...formData, sticker });
                  setShowStickerPicker(false);
                },
                onClose: () => setShowStickerPicker(false)
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFormData({ ...formData, attendance: status }),
              className: `py-8 font-black uppercase tracking-widest text-[10px] border-2 transition-all ${formData.attendance === status ? "bg-white text-black border-white" : "bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700"}`,
              children: status.replace("TIDAK_HADIR", "Absent").replace("HADIR", "Attending")
            },
            status
          )) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: isSubmitting,
              className: "w-full bg-white text-black py-8 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-6 group active:scale-95",
              children: [
                isSubmitting ? "PROCESSING..." : "SUBMIT RESPONSE",
                /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-16", children: [
        /* @__PURE__ */ jsx(Reveal$6, { delay: 0.2, children: /* @__PURE__ */ jsx("div", { className: "flex md:justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-black tracking-tighter", children: rsvps.length }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-zinc-600 tracking-widest", children: "Responses" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-black tracking-tighter", children: rsvps.filter((r) => r.attendance === AttendanceStatus.HADIR).length }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-zinc-600 tracking-widest", children: "Attending" })
          ] }),
          /* @__PURE__ */ jsx(Users, { className: "text-zinc-800 h-12 w-12" })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: currentRSVPs.map((rsvp, idx) => /* @__PURE__ */ jsx(Reveal$6, { delay: idx * 0.05, children: /* @__PURE__ */ jsxs("div", { className: "p-10 border border-zinc-800 hover:border-zinc-500 transition-all space-y-6 group bg-zinc-900/10 h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black uppercase tracking-tighter", children: rsvp.guest_name }),
            /* @__PURE__ */ jsx("span", { className: `text-[9px] font-black uppercase tracking-widest px-3 py-1 ${rsvp.attendance === AttendanceStatus.HADIR ? "bg-white text-black" : "bg-zinc-800 text-zinc-500"}`, children: rsvp.attendance.replace("_", " ") })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-zinc-500 text-sm font-medium uppercase tracking-tight leading-relaxed", children: [
            '"',
            rsvp.message || "No message provided.",
            '"'
          ] })
        ] }) }, rsvp.id)) }),
        totalPages > 1 && /* @__PURE__ */ jsx(Reveal$6, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center md:justify-end gap-2 pt-8", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
              disabled: currentPage === 1,
              className: "w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-20",
              children: /* @__PURE__ */ jsx(MoveLeft, { size: 16 })
            }
          ),
          [...Array(totalPages)].map((_, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage(i + 1),
              className: `w-12 h-12 font-black uppercase text-[10px] transition-all border ${currentPage === i + 1 ? "bg-white text-black border-white" : "text-zinc-600 border-zinc-800 hover:border-zinc-600"}`,
              children: i + 1
            },
            i
          )),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
              disabled: currentPage === totalPages,
              className: "w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-20",
              children: /* @__PURE__ */ jsx(MoveRight, { size: 16 })
            }
          )
        ] }) })
      ] })
    ] }) })
  ] });
};
const Wishes$6 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
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
  const handleSubmit = async (e) => {
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
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-white dark:bg-zinc-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 md:gap-24 items-start", children: [
    /* @__PURE__ */ jsx(Reveal$6, { className: "lg:col-span-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "space-y-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none", children: "Journal of Prayers" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-2 bg-black dark:bg-white transition-colors" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400", children: "Leave your mark" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-zinc-50 dark:bg-zinc-900 p-12 border border-zinc-100 dark:border-zinc-800 transition-colors shadow-[20px_20px_0_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0_rgba(255,255,255,0.02)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-400", children: "Contributor" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                required: true,
                disabled: isNameLocked,
                placeholder: "YOUR NAME",
                className: "w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white",
                value: name,
                onChange: (e) => setName(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-400", children: "Message" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                required: true,
                placeholder: "TYPE YOUR MESSAGE",
                rows: 4,
                className: "w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-2xl font-black uppercase tracking-tighter outline-none focus:border-black dark:focus:border-white transition-all resize-none text-black dark:text-white",
                value: message,
                onChange: (e) => setMessage(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            disabled: isSending,
            className: "w-full bg-black dark:bg-white text-white dark:text-black py-6 font-black uppercase tracking-[0.5em] text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group active:scale-95",
            children: [
              isSending ? "POSTING..." : "POST MESSAGE",
              /* @__PURE__ */ jsx(MoveRight, { size: 16, className: "group-hover:translate-x-2 transition-transform" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-8 transition-colors", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-300", children: [
          "Archives — ",
          wishes.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
              disabled: currentPage === 1,
              className: "w-12 h-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-20",
              children: /* @__PURE__ */ jsx(MoveLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
              disabled: currentPage === totalPages,
              className: "w-12 h-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-20",
              children: /* @__PURE__ */ jsx(MoveRight, { size: 20 })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-1 gap-12", children: currentWishes.map((wish, idx) => /* @__PURE__ */ jsx(Reveal$6, { delay: idx * 0.05, children: /* @__PURE__ */ jsx("div", { className: "relative space-y-8 animate-reveal group", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic group-hover:translate-x-2 transition-transform duration-700", children: [
          '"',
          wish.message,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-12 bg-black dark:bg-white transition-colors" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xl font-black uppercase tracking-tight", children: wish.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-zinc-400", children: new Date(wish.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })
          ] })
        ] })
      ] }) }) }, wish.id)) })
    ] })
  ] }) }) });
};
const Footer = () => {
  const { config } = useSettings();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return /* @__PURE__ */ jsx("footer", { className: "bg-zinc-950 text-white py-24 md:py-48 px-6 md:px-20 relative overflow-hidden border-t border-zinc-800", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 items-end", children: [
      /* @__PURE__ */ jsx(Reveal$6, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none", children: [
          "Thank ",
          /* @__PURE__ */ jsx("br", {}),
          " You"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold uppercase tracking-tight max-w-md italic", children: '"Our joy is incomplete without your presence and blessing."' })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$6, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start md:items-end gap-12 text-left md:text-right", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: scrollToTop,
            className: "group flex items-center gap-6 px-10 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-[10px_10px_0_rgba(255,255,255,0.1)]",
            children: [
              "Back to Top",
              /* @__PURE__ */ jsx(ArrowUpRight, { className: "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500", children: "Turut Mengundang" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold uppercase tracking-tight italic", children: "Segenap Keluarga Besar" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-12 border-t border-zinc-800 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-white h-6 w-6 fill-white" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black uppercase tracking-tighter italic", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-zinc-600", children: [
        "Design for Eternity — ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] })
    ] })
  ] }) });
};
const MonokromTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `monokrom-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$6, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100" : "opacity-0 scale-95 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$6, {}),
      /* @__PURE__ */ jsx(CoupleProfile$6, {}),
      /* @__PURE__ */ jsx(LoveStory$6, {}),
      /* @__PURE__ */ jsx(EventDetails$6, {}),
      /* @__PURE__ */ jsx(Gallery$6, {}),
      /* @__PURE__ */ jsx(GiftInfo$6, {}),
      /* @__PURE__ */ jsx(RSVPForm$6, {}),
      /* @__PURE__ */ jsx(Wishes$6, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$6, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$5 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$5 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#f0f9ff] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full animate-bounce", style: { animationDuration: "3s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rotate-12 animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-40 w-24 h-24 bg-blue-500 -skew-x-12 hidden md:block" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-lg px-8 text-center space-y-12 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsx(PartyPopper, { className: "text-pink-500 h-8 w-8" }),
          /* @__PURE__ */ jsx("span", { className: "bg-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-black", children: "You're Invited!" }),
          /* @__PURE__ */ jsx(PartyPopper, { className: "text-pink-500 h-8 w-8 -scale-x-100" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "font-sans text-6xl md:text-8xl font-black text-blue-600 tracking-tighter uppercase leading-none italic", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-pink-500", children: "&" }),
          " ",
          /* @__PURE__ */ jsx("br", {}),
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-10 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] border-4 border-black space-y-4 text-black", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-zinc-400 uppercase tracking-widest italic", children: "Special Guest" }),
        /* @__PURE__ */ jsx("h2", { className: "font-sans text-3xl md:text-4xl font-black uppercase tracking-tight", children: guestName || "Awesome Person" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onOpen,
          className: "group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-pink-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-[8px_8px_0_#000]",
          children: [
            /* @__PURE__ */ jsx("span", { className: "relative z-10 font-black tracking-widest text-xs uppercase", children: "Join The Party" }),
            /* @__PURE__ */ jsx(PartyPopper, { className: "relative z-10 h-5 w-5" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-600 rounded-full scale-0 transition-transform group-hover:scale-100" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-[0.6em] text-blue-600 font-bold uppercase opacity-60", children: "Let's Celebrate Together!" })
    ] })
  ] });
};
const Hero$5 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#fafafa] dark:bg-slate-950 transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.05]", style: { backgroundImage: "radial-gradient(#3b82f6 2px, transparent 2px)", backgroundSize: "30px 30px" } }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(Star, { className: "text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black italic text-zinc-400 uppercase tracking-[1em]", children: "The Big Day is Coming" }),
      /* @__PURE__ */ jsx(Star, { className: "text-yellow-400 fill-yellow-400 h-6 w-6 animate-spin-slow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-12 px-6 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-sans text-[10rem] md:text-[18rem] font-black text-black dark:text-white leading-[0.75] tracking-tighter uppercase italic select-none", children: [
          /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: config.couple.groom.name.substring(0, 1) }),
          config.couple.groom.name.substring(1)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-8 -my-4 md:-my-12", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 w-32 bg-yellow-400 -rotate-3 rounded-full" }),
          /* @__PURE__ */ jsx(Smile, { className: "h-16 w-16 text-pink-500 animate-bounce" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-32 bg-blue-500 rotate-3 rounded-full" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "font-sans text-[10rem] md:text-[18rem] font-black text-black dark:text-white leading-[0.75] tracking-tighter uppercase italic select-none", children: [
          /* @__PURE__ */ jsx("span", { className: "text-pink-500", children: config.couple.bride.name.substring(0, 1) }),
          config.couple.bride.name.substring(1)
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-12 animate-reveal", style: { animationDelay: "0.8s" }, children: /* @__PURE__ */ jsxs("div", { className: "inline-block bg-black dark:bg-slate-900 text-white px-12 py-6 rounded-3xl -rotate-2 shadow-[12px_12px_0_#fbd38d] dark:shadow-[12px_12px_0_#3b82f6] transition-all", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none", children: config.hero.date }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-black uppercase tracking-[0.4em] mt-3 text-yellow-400", children: [
          "Save our union in ",
          config.hero.city
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 left-10 hidden md:block", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 border-8 border-blue-600 rounded-full opacity-20" }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-10 right-10 hidden md:block", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-pink-500 rotate-45 opacity-20" }) })
  ] });
};
const CoupleProfile$5 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-slate-900 py-24 md:py-48 px-6 md:px-20 text-black dark:text-white relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 opacity-10", style: { backgroundImage: "radial-gradient(#ec4899 1px, transparent 1px)", backgroundSize: "15px 15px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-32 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-20 md:gap-32 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-yellow-400 -rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: config.couple.groom.image,
                className: "w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110",
                alt: config.couple.groom.fullName
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 rotate-12 z-20 transition-all", children: /* @__PURE__ */ jsx(Smile, { className: "h-12 w-12" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-1.5 w-12 bg-pink-500 rounded-full" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400", children: "The Groom" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest italic font-sans text-left", children: "Son of" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black uppercase tracking-tighter text-blue-600", children: config.couple.groom.parents })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 md:mt-48 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-blue-500 rotate-3 rounded-[3rem] group-hover:rotate-0 transition-transform duration-500" }),
            /* @__PURE__ */ jsx("div", { className: "relative z-10 h-[30rem] md:h-[40rem] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-2xl", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: config.couple.bride.image,
                className: "w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover:scale-110",
                alt: config.couple.bride.fullName
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 -left-10 bg-yellow-400 text-black w-24 h-24 rounded-full flex items-center justify-center border-4 border-black dark:border-white/20 -rotate-12 z-20 transition-all", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-12 w-12" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-1.5 w-12 bg-blue-600 rounded-full" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400", children: "The Bride" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest italic font-sans text-left", children: "Daughter of" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black uppercase tracking-tighter text-pink-500", children: config.couple.bride.parents })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-24 text-center", children: /* @__PURE__ */ jsx("div", { className: "inline-block bg-zinc-100 dark:bg-slate-800 p-12 rounded-[3.5rem] rotate-1 transition-colors", children: /* @__PURE__ */ jsx("p", { className: "text-3xl font-black uppercase italic tracking-tighter max-w-2xl", children: '"When our worlds collided, it was a explosion of colors and joy!"' }) }) })
    ] })
  ] });
};
const LoveStory$5 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-white dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-40 h-40 border-[1.5rem] border-blue-600 rounded-full opacity-5" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-20 w-40 h-40 bg-pink-500 rotate-12 opacity-5" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-8 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600 text-white px-10 py-4 rounded-full border-4 border-black dark:border-white/20 rotate-1 shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] transition-all", children: /* @__PURE__ */ jsx("h2", { className: "text-5xl md:text-[7rem] font-black uppercase tracking-tighter italic leading-none", children: "Fun Timeline" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 pt-4", children: [
          /* @__PURE__ */ jsx(Zap, { className: "text-yellow-400 fill-yellow-400 h-8 w-8" }),
          /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-black text-zinc-400 uppercase italic", children: "How it all exploded!" }),
          /* @__PURE__ */ jsx(Zap, { className: "text-yellow-400 fill-yellow-400 h-8 w-8" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative space-y-40", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-black hidden md:block opacity-[0.05]" }),
        config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 flex items-center justify-center shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] rotate-12 transition-all", children: idx % 2 === 0 ? /* @__PURE__ */ jsx(Smile, { className: "text-blue-600" }) : /* @__PURE__ */ jsx(Sparkles, { className: "text-pink-500" }) }) }),
          /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 space-y-10 group transition-all duration-700 hover:-translate-y-4 ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: `p-12 md:p-16 rounded-[4rem] border-4 border-black dark:border-white/20 bg-zinc-50 dark:bg-slate-900 shadow-[15px_15px_0_#000] dark:shadow-[15px_15px_0_rgba(255,255,255,0.05)] group-hover:shadow-[15px_15px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
              /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-blue-600 leading-none", children: story.date }),
              /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none", children: story.title })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `w-12 h-2 bg-pink-500 my-8 rounded-full ${idx % 2 === 0 ? "md:ml-auto" : ""}` }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500 font-bold uppercase text-sm tracking-tight leading-relaxed italic text-left", children: story.desc })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
        ] }, idx))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-6 bg-black dark:bg-slate-900 text-white px-12 py-8 rounded-[3rem] shadow-[15px_15px_0_#fbd38d] dark:shadow-[15px_15px_0_#3b82f6] -rotate-1 transition-all", children: [
        /* @__PURE__ */ jsx(Heart, { className: "text-pink-500 fill-pink-500 animate-pulse h-10 w-10" }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl font-black uppercase italic tracking-tighter", children: "Stay Tuned!" })
      ] }) })
    ] })
  ] });
};
const EventDetails$5 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "event", className: "bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-full h-[2px] bg-blue-600 opacity-20 rotate-12 -translate-y-20" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-500/5 rounded-full blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-32 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-blue-600 tracking-[1em]", children: "The Big Occasions" }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none", children: "Schedule" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-12 lg:gap-20", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] transition-all group-hover:translate-x-4 group-hover:translate-y-4 duration-500` }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-12 md:p-20 space-y-12 text-center flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: `w-24 h-24 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${idx === 0 ? "bg-yellow-400 text-black" : "bg-blue-500 text-white"}`, children: /* @__PURE__ */ jsx(Calendar, { size: 40, strokeWidth: 2.5 }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-pink-500 uppercase tracking-widest italic", children: idx === 0 ? "Initial Toast" : "The Main Bash" }),
            /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none", children: event.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-10 w-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-black dark:border-white/20 rotate-1 transition-colors", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-black uppercase tracking-tight", children: [
                event.day,
                ", ",
                event.date
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mt-2 text-zinc-500", children: [
                /* @__PURE__ */ jsx(Clock, { size: 16, strokeWidth: 3 }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-black uppercase tracking-widest", children: [
                  event.startTime,
                  " — ",
                  event.endTime,
                  " WIB"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "text-blue-600", size: 24, strokeWidth: 3 }),
                /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black uppercase tracking-tight", children: event.venue.name })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 max-w-[280px] mx-auto font-medium leading-relaxed italic", children: event.venue.address })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: event.venue.mapsEmbedUrl.replace("&output=embed", ""),
              target: "_blank",
              className: "group inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-slate-800 text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:bg-blue-600 hover:shadow-[10px_10px_0_#fbd38d] dark:hover:shadow-[10px_10px_0_#3b82f6]",
              children: [
                "Google Maps ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
              ]
            }
          ) })
        ] })
      ] }, event.id)) })
    ] })
  ] });
};
const Gallery$5 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-white dark:bg-slate-950 py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.05]", style: { backgroundImage: "radial-gradient(#ec4899 4px, transparent 4px)", backgroundSize: "40px 40px" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-40 h-40 bg-yellow-400 rotate-12 opacity-10 animate-pulse pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$5, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-yellow-400 text-black px-10 py-4 rounded-full border-4 border-black dark:border-white/20 -rotate-2 shadow-[10px_10px_0_#000] transition-all", children: /* @__PURE__ */ jsx("p", { className: "text-xl font-black uppercase tracking-tighter italic", children: "Captured Moments!" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[14rem] font-black uppercase tracking-tighter italic leading-none text-blue-600 drop-shadow-[8px_8px_0_#ec4899]", children: "Gallery" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$5, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 bg-blue-600 text-white rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-900 border-4 border-black transition-all duration-500 overflow-hidden rounded-[2rem] ${activeIndex === idx ? "scale-110 shadow-[10px_10px_0_#ec4899] z-20 grayscale-0 rotate-3" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105 shadow-[6px_6px_0_#3b82f6] -rotate-3"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 bg-blue-600 text-white rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$5, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-slate-900 p-4 border-4 border-black rounded-[4rem] shadow-[25px_25px_0_#3b82f6] group transition-all duration-1000 overflow-hidden", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.2, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: -50 },
            transition: { duration: 0.8, type: "spring", bounce: 0.4 },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer saturate-[1.2] group-hover:saturate-[1.5] transition-all duration-1000 rounded-[3.5rem]",
            alt: "Vibrant Memory",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-8 right-8 bg-yellow-400 text-black px-6 py-2 rounded-full border-4 border-black rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none", children: /* @__PURE__ */ jsx("p", { className: "font-black uppercase text-[10px] tracking-widest", children: "WOW! 🎉" }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 left-12 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 bg-pink-500 text-white rounded-full border-4 border-black flex items-center justify-center shadow-[6px_6px_0_#000] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-yellow-400 hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 28 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-blue-600/95 backdrop-blur-xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            motion.button,
            {
              whileHover: { scale: 1.2, rotate: 90 },
              whileTap: { scale: 0.9 },
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 bg-pink-500 text-white rounded-full border-4 border-black flex items-center justify-center shadow-[8px_8px_0_#000] z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 32, strokeWidth: 4 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.3, x: -10 },
                whileTap: { scale: 0.8 },
                className: "absolute left-2 sm:left-4 md:left-12 text-yellow-400 hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 80, className: "sm:size-[140px]", strokeWidth: 6 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.5, rotate: -20 },
                animate: { opacity: 1, scale: 1, rotate: 0 },
                exit: { opacity: 0, scale: 1.5, rotate: 20 },
                transition: { type: "spring", stiffness: 200, damping: 15 },
                className: "relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-6 bg-white dark:bg-slate-900 border-8 border-black rounded-[5rem] shadow-[30px_30px_0_#000]",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[75vh] w-auto h-auto object-contain rounded-[3.5rem] border-4 border-black",
                      alt: "Vibrant Fullscreen"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-24 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-yellow-400 px-12 py-5 rounded-full border-4 border-black shadow-[8px_8px_0_#000] -rotate-2", children: /* @__PURE__ */ jsxs("p", { className: "font-black italic text-3xl text-black uppercase tracking-tighter", children: [
                    "Moment #",
                    selectedImg + 1
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.3, x: 10 },
                whileTap: { scale: 0.8 },
                className: "absolute right-2 sm:right-4 md:right-12 text-yellow-400 hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 80, className: "sm:size-[140px]", strokeWidth: 6 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$5 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsxs("section", { id: "gift", className: "bg-[#f0f9ff] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-yellow-400 rotate-45 translate-x-32 -translate-y-32 opacity-20" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-24 relative z-10 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-10 rounded-full shadow-[10px_10px_0_#3b82f6] -rotate-3 mb-4 transition-all", children: /* @__PURE__ */ jsx(Gift, { className: "text-pink-500 h-16 w-16", strokeWidth: 3 }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-none", children: "Wedding Gift" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
          /* @__PURE__ */ jsx(PartyPopper, { className: "text-yellow-400" }),
          /* @__PURE__ */ jsx("p", { className: "max-w-xl mx-auto text-zinc-400 font-bold uppercase tracking-tight text-xl leading-relaxed italic", children: `"Your presence is our ultimate gift. But if you're feeling extra generous, here are our digital accounts!"` }),
          /* @__PURE__ */ jsx(PartyPopper, { className: "text-yellow-400 -scale-x-100" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-10 items-stretch", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: `bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 group hover:shadow-[20px_20px_0_#3b82f6] transition-all duration-500 ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-[#f0f9ff] dark:bg-slate-800 rounded-full border-4 border-black dark:border-white/20 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all", children: /* @__PURE__ */ jsx(Landmark, { className: "text-blue-600 h-10 w-10", strokeWidth: 3 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-zinc-400 uppercase tracking-[0.5em] italic", children: account.bank }),
          /* @__PURE__ */ jsx("h3", { className: "text-5xl font-black tracking-tighter uppercase italic", children: account.number }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-black uppercase tracking-widest text-blue-600", children: [
            "A.N ",
            account.name
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => copyToClipboard(account.number, `bank-${idx}`),
            className: "w-full py-6 rounded-full font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-4 bg-black text-white hover:bg-pink-500 active:scale-95 shadow-[8px_8px_0_#3b82f6]",
            children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { size: 18, className: "text-yellow-400" }),
              " NUMBER COPIED!"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Copy, { size: 18 }),
              " COPY ACCOUNT NO"
            ] })
          }
        )
      ] }, idx)) })
    ] })
  ] });
};
const Navbar$5 = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { icon: Home, label: "INFO", href: "#hero" },
    { icon: Heart, label: "COUPLE", href: "#couple" },
    { icon: PartyPopper, label: "STORY", href: "#story" },
    { icon: Calendar, label: "DATES", href: "#event" },
    { icon: Camera, label: "SHOTS", href: "#gallery" },
    { icon: Gift, label: "TOKEN", href: "#gift" },
    { icon: MessageCircle, label: "RSVP", href: "#rsvp" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-50 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-black border-4 border-white px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: "group relative flex flex-col items-center gap-1 text-white hover:text-yellow-400 transition-all",
        children: [
          /* @__PURE__ */ jsx(item.icon, { size: 22, className: "transition-transform group-hover:-translate-y-2 group-hover:scale-125" }),
          /* @__PURE__ */ jsx("span", { className: "absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-pink-500 text-white text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl italic border-2 border-black rotate-3 group-hover:block hidden", children: item.label })
        ]
      },
      idx
    )),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleTheme,
        className: "group relative flex flex-col items-center gap-1 text-white hover:text-yellow-400 transition-all",
        "aria-label": "Toggle theme",
        children: [
          theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 22 }) : /* @__PURE__ */ jsx(Sun, { size: 22 }),
          /* @__PURE__ */ jsx("span", { className: "absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-pink-500 text-white text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl italic border-2 border-black rotate-3 group-hover:block hidden", children: theme === "light" ? "Night Mode" : "Day Mode" })
        ]
      }
    )
  ] }) });
};
const RSVPForm$5 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
    sticker: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, {
        ...formData,
        sticker: formData.sticker?.id || void 0
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
  return /* @__PURE__ */ jsxs("section", { id: "rsvp", className: "bg-[#fafafa] dark:bg-slate-950 py-24 md:py-48 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 text-black dark:text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 w-32 h-32 bg-yellow-400 -translate-x-1/2 rotate-45 opacity-20" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest -rotate-2", children: [
            /* @__PURE__ */ jsx(Smile, { size: 18 }),
            " Let's RSVP!"
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.8]", children: [
            "Join ",
            /* @__PURE__ */ jsx("br", {}),
            " The Bash"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold uppercase tracking-tight text-zinc-400", children: "Confirm your presence for the most exciting night of our lives." })
        ] }),
        submitted ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-12 rounded-[3.5rem] shadow-[20px_20px_0_#ec4899] space-y-10 animate-reveal transition-all", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "text-blue-600 h-20 w-20 mx-auto", strokeWidth: 3 }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black uppercase tracking-tighter italic", children: "Total Success!" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-8", children: "Your response has been added to our guest list. We are thrilled to see you!" })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "w-full bg-black dark:bg-slate-800 text-white py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all", children: "Send Another" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-10 group", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic", children: "Who are you?" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  disabled: isNameLocked,
                  placeholder: "INPUT YOUR AWESOME NAME",
                  className: "w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#3b82f6] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] text-black dark:text-white",
                  value: formData.guest_name,
                  onChange: (e) => setFormData({ ...formData, guest_name: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-6 italic", children: "Any words?" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 2,
                  placeholder: "SEND A FUN MESSAGE!",
                  className: "w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2rem] px-10 py-6 text-2xl font-black uppercase tracking-tight placeholder:text-zinc-200 focus:shadow-[8px_8px_0_#ec4899] outline-none transition-all shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] resize-none text-black dark:text-white",
                  value: formData.message,
                  onChange: (e) => setFormData({ ...formData, message: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500 italic", children: "Pilih Sticker" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowStickerPicker(true),
                  className: "text-zinc-500 hover:text-black dark:hover:text-white transition-colors",
                  children: /* @__PURE__ */ jsx(Smile, { size: 24 })
                }
              )
            ] }),
            formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-6", children: [
              /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData({ ...formData, sticker: null }),
                  className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md",
                  children: /* @__PURE__ */ jsx(X, { size: 12 })
                }
              )
            ] }),
            showStickerPicker && /* @__PURE__ */ jsx(
              StickerPicker$1,
              {
                isOpen: showStickerPicker,
                selectedSticker: formData.sticker?.id || null,
                onSelect: (sticker) => {
                  setFormData({ ...formData, sticker });
                  setShowStickerPicker(false);
                },
                onClose: () => setShowStickerPicker(false)
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFormData({ ...formData, attendance: status }),
              className: `py-8 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-4 border-black dark:border-white/20 transition-all shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] active:translate-y-1 active:shadow-none ${formData.attendance === status ? "bg-yellow-400 text-black shadow-[6px_6px_0_#3b82f6]" : "bg-white dark:bg-slate-800 text-zinc-400"}`,
              children: status.replace("TIDAK_HADIR", "Cannot Come").replace("HADIR", "Confirming!")
            },
            status
          )) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              disabled: isSubmitting,
              className: "w-full bg-blue-600 text-white py-8 rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-black dark:hover:bg-slate-800 transition-all shadow-[12px_12px_0_#fbd38d] hover:shadow-[12px_12px_0_#ec4899] flex items-center justify-center gap-6 group active:scale-95",
              children: [
                isSubmitting ? "PROCESSING..." : "SUBMIT TICKET",
                /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform", strokeWidth: 4 })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-16", children: [
        /* @__PURE__ */ jsx("div", { className: "flex md:justify-end", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-8 rounded-[2.5rem] shadow-[15px_15px_0_#3b82f6] flex items-center gap-8 -rotate-1 transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-6xl font-black tracking-tighter leading-none", children: rsvps.length }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-pink-500 tracking-widest", children: "Confirmed Guests" })
          ] }),
          /* @__PURE__ */ jsx(Users, { className: "text-blue-600 h-14 w-14", strokeWidth: 3 })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: currentRSVPs.map((rsvp) => /* @__PURE__ */ jsxs("div", { className: `p-8 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[2.5rem] shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] space-y-5 group hover:-translate-y-2 transition-all ${Math.random() > 0.5 ? "rotate-1" : "-rotate-1"} text-left`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black uppercase tracking-tighter truncate max-w-[150px]", children: rsvp.guest_name }),
            /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center ${rsvp.attendance === AttendanceStatus.HADIR ? "bg-pink-500" : "bg-zinc-100 dark:bg-slate-800"}`, children: /* @__PURE__ */ jsx(Heart, { size: 14, className: "text-white fill-white" }) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-zinc-500 text-xs font-black uppercase tracking-tight line-clamp-2 leading-relaxed italic", children: [
            '"',
            rsvp.message || "Sending hugs!",
            '"'
          ] })
        ] }, rsvp.id)) })
      ] })
    ] }) })
  ] });
};
const Wishes$5 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
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
  const handleSubmit = async (e) => {
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
      setTimeout(() => setPostSuccess(false), 3e3);
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
  return /* @__PURE__ */ jsxs("section", { id: "wishes", className: "bg-white dark:bg-slate-950 text-black dark:text-white py-24 md:py-48 px-6 md:px-20 overflow-hidden relative transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.05]", style: { backgroundImage: "radial-gradient(#3b82f6 2px, transparent 2px)", backgroundSize: "30px 30px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-32", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-8 flex flex-col items-center", children: /* @__PURE__ */ jsx("div", { className: "bg-pink-500 p-8 border-4 border-black dark:border-white/20 rotate-2 shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] transition-all", children: /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-white", children: "Guest Notes" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 bg-zinc-50 dark:bg-slate-900 p-12 md:p-16 border-4 border-black dark:border-white/20 rounded-[4rem] shadow-[20px_20px_0_#000] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)] space-y-12 transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-blue-600 tracking-[0.5em] italic", children: "Post your wish" }),
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black uppercase tracking-tighter italic leading-none", children: "Drop a Line!" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-10 group", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-left", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 italic", children: "Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    required: true,
                    disabled: isNameLocked,
                    placeholder: "Your Awesome Name",
                    className: "w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-full px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#3b82f6] transition-all text-black dark:text-white placeholder:dark:text-slate-600",
                    value: name,
                    onChange: (e) => setName(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-left", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 italic", children: "Wish" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    required: true,
                    placeholder: "Write something cool...",
                    rows: 4,
                    className: "w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-white/20 rounded-[2.5rem] px-8 py-5 text-xl font-black uppercase tracking-tight outline-none focus:shadow-[6px_6px_0_#ec4899] transition-all resize-none text-black dark:text-white placeholder:dark:text-slate-600",
                    value: message,
                    onChange: (e) => setMessage(e.target.value)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: isSending || postSuccess,
                className: `w-full py-6 rounded-full font-black uppercase tracking-[0.5em] text-xs transition-all shadow-[10px_10px_0_#000] dark:shadow-[10px_10px_0_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 group active:scale-95 ${postSuccess ? "bg-green-500 text-white" : "bg-black dark:bg-slate-800 text-white hover:bg-blue-600"}`,
                children: [
                  isSending ? "POSTING..." : postSuccess ? "POSTED!" : "SEND WISH",
                  !postSuccess && /* @__PURE__ */ jsx(Send, { size: 18, className: "group-hover:translate-x-1" }),
                  postSuccess && /* @__PURE__ */ jsx(Check, { size: 18 })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-8 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(Quote, { className: "text-blue-600 h-10 w-10 rotate-180", strokeWidth: 3 }),
              /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-black uppercase tracking-[0.8em] text-zinc-300", children: [
                "Archives — ",
                wishes.length
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                  disabled: currentPage === 1,
                  className: "w-16 h-16 border-4 border-black dark:border-white/20 rounded-2xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-blue-600 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.1)] dark:text-white",
                  children: /* @__PURE__ */ jsx(MoveLeft, { size: 28, strokeWidth: 3 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                  disabled: currentPage === totalPages,
                  className: "w-16 h-16 border-4 border-black dark:border-white/20 rounded-2xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-blue-600 transition-all disabled:opacity-20 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(255,255,255,0.1)] dark:text-white",
                  children: /* @__PURE__ */ jsx(MoveRight, { size: 28, strokeWidth: 3 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-1 gap-12", children: currentWishes.map((wish, idx) => /* @__PURE__ */ jsx("div", { className: `p-10 bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 rounded-[3rem] shadow-[12px_12px_0_#3b82f6] dark:shadow-[12px_12px_0_rgba(255,255,255,0.05)] space-y-8 animate-reveal transition-all hover:-translate-y-2 ${idx % 2 === 0 ? "rotate-1 hover:shadow-[12px_12px_0_#ec4899]" : "-rotate-1 hover:shadow-[12px_12px_0_#fbd38d]"} text-left`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic", children: [
              '"',
              wish.message,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t-2 border-zinc-100 dark:border-slate-800 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xl font-black uppercase tracking-tight text-blue-600", children: wish.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-300 italic", children: new Date(wish.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })
              ] }),
              /* @__PURE__ */ jsx(Smile, { className: "text-pink-500 opacity-20 h-10 w-10" })
            ] })
          ] }) }, wish.id)) })
        ] })
      ] })
    ] })
  ] });
};
const VibrantTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `vibrant-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$5, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpened ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-50 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$5, {}),
      /* @__PURE__ */ jsx(CoupleProfile$5, {}),
      /* @__PURE__ */ jsx(LoveStory$5, {}),
      /* @__PURE__ */ jsx(EventDetails$5, {}),
      /* @__PURE__ */ jsx(Gallery$5, {}),
      /* @__PURE__ */ jsx(GiftInfo$5, {}),
      /* @__PURE__ */ jsx(RSVPForm$5, {}),
      /* @__PURE__ */ jsx(Wishes$5, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$5, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$4 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$4 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0b] overflow-hidden text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-16 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-black uppercase text-emerald-500/60 font-sans", children: "The Wedding Invitation of" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-7xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-sans not-italic text-emerald-500 mx-4", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between w-full gap-12 bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-left space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-emerald-500 tracking-[0.5em]", children: "Dear Distinguished Guest" }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-serif italic tracking-tight text-white", children: guestName || "Distinguished Guest" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onOpen,
            className: "group relative flex items-center gap-6 px-12 py-6 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/50",
            children: [
              "Enter Ceremony",
              /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
const Hero$4 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative h-screen flex flex-col justify-end bg-white dark:bg-[#0a0a0b] text-black dark:text-white transition-colors duration-1000 overflow-hidden p-8 md:p-24 text-left", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,white_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0b_100%)] z-10 transition-colors duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-20 flex flex-col md:flex-row items-end justify-between gap-16 border-t border-black/5 dark:border-white/5 pt-16 transition-colors duration-1000", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 max-w-4xl text-left animate-reveal", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-12 bg-emerald-500" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[1em] text-emerald-500", children: "Official Union" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-8xl md:text-[15rem] font-serif italic tracking-tighter text-black dark:text-white leading-[0.8] transition-colors duration-1000", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-sans not-italic text-emerald-500/50", children: "&" }),
          " ",
          /* @__PURE__ */ jsx("br", {}),
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start md:items-end gap-6 text-left md:text-right animate-reveal", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.5em] text-black/40 dark:text-white/40", children: "The Calendar Event" }),
        /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-8xl font-serif italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000", children: config.hero.date }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-black/30 dark:text-white/30 max-w-[280px] leading-relaxed italic border-r-2 border-emerald-500/30 pr-6 hidden md:block", children: '"Two paths converge under the midnight sky to form a constellation of eternal love."' })
      ] })
    ] })
  ] });
};
const CoupleProfile$4 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "couple", className: "bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 text-black dark:text-white relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 md:gap-40 items-start", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-16 group text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000 text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-[2rem]", children: /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full h-full object-cover transition-all", alt: config.couple.groom.fullName }) }),
        /* @__PURE__ */ jsx("span", { className: "absolute top-12 left-12 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest", children: "The Groom" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 pl-6 text-left", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000", children: config.couple.groom.fullName }),
        /* @__PURE__ */ jsx("div", { className: "h-[2px] w-20 bg-emerald-500/50" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60", children: config.couple.groom.parents })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-16 group md:mt-64 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-1000 text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-[2rem]", children: /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full h-full object-cover transition-all", alt: config.couple.bride.fullName }) }),
        /* @__PURE__ */ jsx("span", { className: "absolute top-12 right-12 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest", children: "The Bride" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 md:text-right flex flex-col md:items-end pr-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40 transition-all duration-1000", children: config.couple.bride.fullName }),
        /* @__PURE__ */ jsx("div", { className: "h-[2px] w-20 bg-emerald-500/50" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60", children: config.couple.bride.parents })
      ] })
    ] })
  ] }) }) });
};
const LoveStory$4 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "story", className: "bg-white dark:bg-[#0a0a0b] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-baseline gap-12 text-left", children: /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000", children: "Timeline" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 lg:gap-12", children: config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: "group relative text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all duration-700 shadow-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative p-12 md:p-16 space-y-12 h-full text-left", children: [
        /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-7xl font-serif italic tracking-tighter text-black/10 dark:text-white/20", children: story.date }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-serif italic tracking-tighter leading-tight text-black/80 dark:text-white/80", children: story.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-black/30 dark:text-white/30 uppercase tracking-tight italic", children: story.desc })
      ] })
    ] }, idx)) })
  ] }) });
};
const EventDetails$4 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "event", className: "bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000", children: "Ceremony" }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-24", children: config.events.map((event) => /* @__PURE__ */ jsxs("div", { className: "relative p-12 md:p-20 space-y-16 text-left bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[4rem] backdrop-blur-3xl transition-all shadow-2xl", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-6xl font-serif italic tracking-tighter leading-none", children: event.title }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif italic tracking-tight", children: [
          event.day,
          ", ",
          event.date
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xl font-black uppercase tracking-tight text-emerald-500/60", children: [
          event.startTime,
          " — ",
          event.endTime,
          " WIB"
        ] }),
        /* @__PURE__ */ jsx("h4", { className: "text-2xl font-serif italic tracking-tight text-black/80 dark:text-white/80", children: event.venue.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-black/30 dark:text-white/30 max-w-[300px] leading-relaxed italic", children: event.venue.address })
      ] }),
      /* @__PURE__ */ jsx("a", { href: event.venue.mapsEmbedUrl.replace("&output=embed", ""), target: "_blank", className: "text-[10px] font-black tracking-widest uppercase text-emerald-400", children: "View Coordinate" })
    ] }, event.id)) })
  ] }) });
};
const Gallery$4 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-white dark:bg-[#0a0a0b] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/2 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2 pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-16 sm:space-y-24 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$4, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-black uppercase text-emerald-500/60 font-sans", children: "Frames of Infinite Love" }),
        /* @__PURE__ */ jsx("h2", { className: "text-8xl md:text-[14rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000", children: "Celestial" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$4, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-8 justify-center max-w-4xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-emerald-500 transition-all active:scale-95 flex-shrink-0 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-xl",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-700 bg-white/5 p-1 border ${activeIndex === idx ? "border-emerald-500/50 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-20 grayscale-0" : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover rounded-xl sm:rounded-[1.8rem]", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-emerald-500 transition-all active:scale-95 flex-shrink-0 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-xl",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$4, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[3rem] border border-black/5 dark:border-white/10 p-4 bg-black/[0.02] dark:bg-white/5 backdrop-blur-3xl shadow-2xl group transition-all duration-1000 overflow-hidden", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, filter: "blur(10px) brightness(0.5)" },
            animate: { opacity: 1, filter: "blur(0px) brightness(1)" },
            exit: { opacity: 0, filter: "blur(10px) brightness(0.5)" },
            transition: { duration: 1.2, ease: "anticipate" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer rounded-[2.5rem] brightness-90 group-hover:brightness-100 transition-all duration-1000",
            alt: "Celestial Frame",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-8 bottom-12 flex justify-between items-end", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openLightbox(activeIndex),
              className: "w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-emerald-500 hover:text-white",
              children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-white/60", children: "Fullscreen View" }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#0a0a0b]/95 backdrop-blur-2xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-500 hover:border-emerald-500/30 transition-all z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 32, strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: -10 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-white/20 hover:text-emerald-500 transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9, filter: "blur(20px)" },
                animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
                exit: { opacity: 0, scale: 1.1, filter: "blur(20px)" },
                transition: { duration: 0.6, ease: "circOut" },
                className: "relative max-h-full max-w-full flex items-center justify-center p-2 sm:p-4 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(16,185,129,0.1)]",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[80vh] w-auto h-auto object-contain rounded-[2rem] border border-white/5 shadow-2xl",
                      alt: "Celestial Fullscreen"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-20 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 px-10 py-4 rounded-full", children: /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-2xl text-emerald-400", children: [
                    "Frame ",
                    selectedImg + 1,
                    " // ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: 10 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-white/20 hover:text-emerald-500 transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$4 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-8xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/10 dark:to-white/10 transition-all duration-1000 text-left", children: "Presence" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 text-left lg:w-1/2", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl space-y-10 group hover:border-emerald-500/20 shadow-xl transition-all text-left", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black uppercase text-emerald-500/40 italic", children: account.bank }),
      /* @__PURE__ */ jsx("h3", { className: "text-5xl font-serif italic tracking-tight font-black", children: account.number }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-black uppercase text-black/20 dark:text-white/20", children: [
        "Holder: ",
        account.name
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(account.number, `bank-${idx}`), className: "w-full py-6 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-black dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all active:scale-95 shadow-2xl", children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { size: 16 }) : /* @__PURE__ */ jsx(Copy, { size: 16 }) })
    ] }, idx)) })
  ] }) });
};
const RSVPForm$4 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setFormData((prev) => ({ ...prev, guest_name: to }));
    loadRSVPs();
  }, [invitationId]);
  const loadRSVPs = async () => {
    if (!invitationId) return;
    const data = await dbService.getRSVPs(invitationId);
    setRsvps(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || void 0 });
      setSubmitted(true);
      await loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "rsvp", className: "bg-zinc-50 dark:bg-[#0f0f11] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/20 dark:to-white/20 transition-all duration-1000 text-left", children: "Reception" }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "p-16 border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] rounded-[4rem] text-center", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "text-emerald-500 h-24 w-24 mx-auto", strokeWidth: 1 }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif italic tracking-tight mt-4", children: "Entry Recorded" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-emerald-500 mt-8 uppercase text-xs", children: "Request Correction" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-16 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "INPUT FULL NAME", className: "w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all", value: formData.guest_name, onChange: (e) => setFormData({ ...formData, guest_name: e.target.value }) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "A SHORT SENTIMENT...", className: "w-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-[2.5rem] px-12 py-8 text-2xl font-serif italic tracking-tight outline-none focus:border-emerald-500/50 transition-all resize-none", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-8", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase text-black/30 dark:text-white/30 italic", children: "Sticker" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowStickerPicker(true), className: "text-emerald-500", children: /* @__PURE__ */ jsx(Smile, { size: 24 }) })
        ] }),
        formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-8 text-left", children: [
          /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, sticker: null }), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }),
        showStickerPicker && /* @__PURE__ */ jsx(StickerPicker$1, { isOpen: showStickerPicker, selectedSticker: formData.sticker?.id || null, onSelect: (sticker) => {
          setFormData({ ...formData, sticker });
          setShowStickerPicker(false);
        }, onClose: () => setShowStickerPicker(false) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, attendance: status }), className: `py-8 rounded-full font-black uppercase tracking-widest text-[10px] border transition-all ${formData.attendance === status ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/10" : "bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border-black/5 dark:border-white/5"}`, children: status.replace("TIDAK_HADIR", "Distantly Notified").replace("HADIR", "Confirming Presence") }, status)) }),
        /* @__PURE__ */ jsx("button", { disabled: isSubmitting, className: "w-full bg-emerald-500 text-white py-8 rounded-full font-black uppercase text-xs hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95", children: isSubmitting ? "PROCESSING..." : "CONFIRM RECEIPT" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 lg:pl-24 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-3 text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-8xl font-serif italic text-black dark:text-white", children: rsvps.length }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-emerald-500", children: [
          /* @__PURE__ */ jsx(Users, { size: 16 }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest font-black", children: "Enrolled Guests" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: rsvps.slice(0, 5).map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-10 bg-black/[0.01] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[3rem] space-y-6 group hover:border-emerald-500/20 transition-all text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-3xl font-serif italic text-black/80 dark:text-white/80", children: rsvp.guest_name }),
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full border flex items-center justify-center ${rsvp.attendance === AttendanceStatus.HADIR ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-black/5 dark:border-white/5"}`, children: /* @__PURE__ */ jsx(Heart, { size: 16, ...rsvp.attendance === AttendanceStatus.HADIR ? { fill: "currentColor" } : {} }) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-black/30 dark:text-white/30 text-sm italic", children: [
          '"',
          rsvp.message || "A silent wish.",
          '"'
        ] })
      ] }, rsvp.id)) })
    ] })
  ] }) }) });
};
const Wishes$4 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const loadWishes = async () => {
    if (!invitationId) return;
    const data = await dbService.getWishes(invitationId);
    setWishes(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setName(to);
    loadWishes();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !invitationId) return;
    try {
      await dbService.saveWish(invitationId, { name, message });
      setMessage("");
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-white dark:bg-[#0a0a0b] text-black dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-20 text-left text-black dark:text-white", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-8xl font-serif italic text-black dark:text-white text-left", children: "Sentiments" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-black/[0.01] dark:bg-white/[0.02] p-12 md:p-16 border border-black/5 dark:border-white/5 rounded-[4rem] text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "YOUR NAME", className: "w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic outline-none text-black dark:text-white", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx("textarea", { required: true, placeholder: "TYPE MESSAGE...", rows: 4, className: "w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 text-2xl font-serif italic outline-none resize-none text-black dark:text-white", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-full font-black uppercase text-xs hover:bg-emerald-500 hover:text-white active:scale-95 shadow-xl", children: "POST SENTIMENT" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16 lg:pl-20 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 border-b border-black/5 dark:border-white/5 pb-12 text-left", children: [
        /* @__PURE__ */ jsx(Quote, { className: "text-emerald-500 h-10 w-10 rotate-180" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[1em] text-black/20 dark:text-white/20", children: [
          "Archive — ",
          wishes.length
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-1 gap-16 text-left", children: wishes.slice(0, 4).map((wish) => /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-left group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-5xl md:text-6xl font-serif italic text-black/90 dark:text-white/90 group-hover:text-emerald-400 transition-colors", children: [
          '"',
          wish.message,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12 pt-4 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-emerald-500/30" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic text-black/60 dark:text-white/60", children: wish.name })
        ] })
      ] }, wish.id)) })
    ] })
  ] }) }) });
};
const Navbar$4 = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{ icon: Home, label: "Aura", href: "#hero" }, { icon: Heart, label: "Ones", href: "#couple" }, { icon: Star, label: "Log", href: "#story" }, { icon: Calendar, label: "Time", href: "#event" }, { icon: Camera, label: "Frames", href: "#gallery" }, { icon: Gift, label: "Token", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-32 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-[#0f0f11]/80 backdrop-blur-3xl border border-white/10 px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs("a", { href: item.href, className: "group relative text-white/40 hover:text-emerald-400 transition-all", children: [
      /* @__PURE__ */ jsx(item.icon, { size: 20 }),
      /* @__PURE__ */ jsx("span", { className: "absolute -top-14 opacity-0 group-hover:opacity-100 transition-all bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] px-4 py-2 rounded-full hidden group-hover:block", children: item.label })
    ] }, idx)),
    /* @__PURE__ */ jsx("button", { onClick: toggleTheme, className: "text-white/40 hover:text-emerald-400 transition-all", children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }) })
  ] }) });
};
const DarkElegantTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `dark-elegant-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$4, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-[2s] ease-in-out ${isOpened ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-3xl scale-125 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$4, {}),
      /* @__PURE__ */ jsx(CoupleProfile$4, {}),
      /* @__PURE__ */ jsx(LoveStory$4, {}),
      /* @__PURE__ */ jsx(EventDetails$4, {}),
      /* @__PURE__ */ jsx(Gallery$4, {}),
      /* @__PURE__ */ jsx(GiftInfo$4, {}),
      /* @__PURE__ */ jsx(RSVPForm$4, {}),
      /* @__PURE__ */ jsx(Wishes$4, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$4, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$3 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$3 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#4a0404] overflow-hidden text-[#d4af37]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-4 md:inset-8 border-[1px] border-[#d4af37]/30 pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-6 md:inset-12 border-[3px] border-[#d4af37]/20 pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-[#d4af37]/20 animate-pulse" }),
        /* @__PURE__ */ jsxs("span", { className: "text-4xl md:text-5xl font-serif italic", children: [
          config.couple.groom.name[0],
          config.couple.bride.name[0]
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#d4af37]/80", children: "The Honorable Wedding of" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-9xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#f9d976] via-[#d4af37] to-[#8d6e1c]", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-sans not-italic text-2xl md:text-4xl mx-2", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/60 italic", children: "Kepada Yth. Bapak/Ibu/Saudara/i" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-serif italic tracking-tight text-white/90", children: guestName || "Tamu Undangan" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onOpen,
            className: "group relative flex items-center gap-4 px-12 py-5 bg-gradient-to-b from-[#d4af37] to-[#8d6e1c] text-maroon-900 font-bold uppercase text-[10px] tracking-[0.3em] rounded-md hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all active:scale-95 text-black",
            children: [
              /* @__PURE__ */ jsx(Mail, { size: 16 }),
              "Buka Undangan",
              /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#d4af37]/40 uppercase", children: "Exclusive Invitation" })
    ] })
  ] });
};
const Hero$3 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative min-h-screen flex flex-col items-center justify-center bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] transition-colors duration-1000 overflow-hidden px-8 py-20", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] opacity-[0.03] dark:opacity-10 bg-fixed transition-opacity duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-white dark:from-[#2a0202] via-transparent to-white dark:to-[#2a0202] opacity-60 transition-colors duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-48 h-48 border-t-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-48 h-48 border-t-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 border-b-8 border-l-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-48 h-48 border-b-8 border-r-8 border-[#d4af37]/10 dark:border-[#d4af37]/30 m-4 md:m-12 opacity-50 transition-colors duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto flex flex-col items-center space-y-16 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#d4af37]/80 leading-relaxed max-w-2xl mx-auto", children: "Mengarungi Samudera Kehidupan Dalam Ikatan Suci" }),
        /* @__PURE__ */ jsx("div", { className: "h-px w-24 bg-[#d4af37] mx-auto opacity-50" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("h1", { className: "text-[5rem] md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white via-[#d4af37] to-[#4a3a0a] transition-all duration-1000", children: [
        config.couple.groom.name,
        " ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-4xl md:text-8xl font-sans not-italic text-[#d4af37]/40", children: "&" }),
        " ",
        /* @__PURE__ */ jsx("br", {}),
        config.couple.bride.name
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-8 text-center pt-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37]/60", children: "Saturdays | Premiere" }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-6xl font-serif italic tracking-tight text-black/80 dark:text-white/90 transition-colors duration-1000", children: config.hero.date })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 flex flex-col items-center gap-4 animate-bounce opacity-30", children: [
      /* @__PURE__ */ jsx("div", { className: "w-[1px] h-12 bg-[#d4af37]" }),
      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase tracking-[0.5em]", children: "Scroll" })
    ] })
  ] });
};
const CoupleProfile$3 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 text-[#8d6e1c] dark:text-[#d4af37] relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-32 space-y-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-5xl md:text-8xl font-serif italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/40 dark:to-white/40 transition-all duration-1000", children: "Sang Mempelai" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-[1px] bg-[#d4af37] mx-auto opacity-30" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg font-serif italic text-[#d4af37]/60 max-w-2xl mx-auto leading-relaxed", children: '"Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, binalah rumah tangga kami dengan ikatan pusaka-Mu."' })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 md:gap-40 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center md:items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-t-[9.5rem]", children: /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0", alt: config.couple.groom.fullName }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center md:text-left", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsx("div", { className: "h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:mx-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000", children: config.couple.groom.parents })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center md:items-end md:mt-32", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[400px] aspect-[4/5] p-3 border border-[#d4af37]/30 bg-[#4a0404]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-t-[10rem]", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-t-[9.5rem]", children: /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0", alt: config.couple.bride.fullName }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-[10px] border-maroon-900/50 pointer-events-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center md:text-right", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl font-serif italic tracking-tight leading-none text-black/80 dark:text-white/90 transition-colors duration-1000", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsx("div", { className: "h-[2px] w-12 bg-[#d4af37]/50 mx-auto md:ml-auto md:mr-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic tracking-tight text-black/60 dark:text-white/60 transition-colors duration-1000", children: config.couple.bride.parents })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LoveStory$3 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-[#f9f8f0] dark:bg-[#2a0202] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8d6e1c]/10 dark:via-[#d4af37]/20 to-transparent transition-colors duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] transition-opacity duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center", children: "Romansa" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000 text-center", children: "Sekelumit Kisah Cinta Kami" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative space-y-24 max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#d4af37]/10 hidden md:block" }),
        config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center gap-16 md:gap-32 ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-[#fdfcf0] dark:bg-[#2a0202] border border-[#8d6e1c]/30 dark:border-[#d4af37]/50 flex items-center justify-center transition-colors duration-1000", children: /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-[#8d6e1c] dark:bg-[#d4af37] animate-ping transition-colors duration-1000" }) }) }),
          /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 space-y-8 group transition-all duration-700 hover:-translate-y-2 ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-12 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white/50 dark:bg-black/10 backdrop-blur-xl relative overflow-hidden transition-all duration-700 group-hover:border-[#8d6e1c]/40 dark:group-hover:border-[#d4af37]/40 shadow-2xl", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-6 h-6 border-t border-l border-[#d4af37]/30" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#d4af37]/30" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-5xl font-serif italic tracking-tighter text-[#8d6e1c] dark:text-[#d4af37]/80 leading-none transition-colors duration-1000", children: story.date }),
              /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90 leading-none transition-colors duration-1000", children: story.title })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `w-12 h-[1px] bg-[#d4af37]/40 my-8 ${idx % 2 === 0 ? "md:ml-auto" : ""}` }),
            /* @__PURE__ */ jsx("p", { className: "text-[#8d6e1c]/40 dark:text-[#d4af37]/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase transition-colors duration-1000", children: story.desc })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
        ] }, idx))
      ] })
    ] })
  ] });
};
const EventDetails$3 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "event", className: "bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10 text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center", children: "Momentum" }),
      /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60 italic transition-colors duration-1000 text-center", children: "Agenda Perayaan Suci" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-24", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group p-12 md:p-20 space-y-16 flex flex-col items-center text-center bg-white dark:bg-black/20 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 backdrop-blur-xl rounded-lg shadow-2xl transition-all duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block px-8 py-2 border border-[#8d6e1c]/30 dark:border-[#d4af37]/30 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-4", children: event.title }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-3xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90", children: [
            event.day,
            ", ",
            event.date
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 text-xl font-bold uppercase tracking-widest", children: [
            /* @__PURE__ */ jsx(Clock, { size: 20 }),
            /* @__PURE__ */ jsxs("span", { children: [
              event.startTime,
              " — ",
              event.endTime,
              " WIB"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-2xl md:text-3xl font-serif italic tracking-tight text-black/80 dark:text-white/90", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#8d6e1c]/40 dark:text-[#d4af37]/40 max-w-[350px] mx-auto leading-relaxed italic uppercase tracking-wider", children: event.venue.address })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: event.venue.mapsEmbedUrl.replace("&output=embed", ""), target: "_blank", className: "px-10 py-4 border border-[#8d6e1c]/20 dark:border-[#d4af37]/20 rounded-md text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8d6e1c] hover:text-white transition-all", children: "Petunjuk Peta" })
    ] }, event.id)) })
  ] }) });
};
const Gallery$3 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#f9f8f0] dark:bg-[#2a0202] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] pointer-events-none transition-all" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$3, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white via-[#d4af37] to-[#4a3a0a]", children: "Galeri" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-[#8d6e1c]/60 dark:text-[#d4af37]/60", children: "Dokumentasi Moment" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-[1px] bg-[#d4af37] opacity-30" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$3, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 bg-[#4a0404] dark:bg-black/40 border-2 border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#4a0404] transition-all shadow-xl active:scale-95 flex-shrink-0 rounded-none transform rotate-45",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24, className: "-rotate-45" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-[#d4af37] scale-110 shadow-2xl z-20 grayscale-0" : "border-[#d4af37]/10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 bg-[#4a0404] dark:bg-black/40 border-2 border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#4a0404] transition-all shadow-xl active:scale-95 flex-shrink-0 rounded-none transform rotate-45",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24, className: "-rotate-45" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$3, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white/50 dark:bg-[#4a0404]/20 p-2 sm:p-4 border border-[#d4af37]/30 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] group transition-all duration-1000 overflow-hidden", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.1, filter: "grayscale(1)" },
            animate: { opacity: 1, scale: 1, filter: "grayscale(0.2)" },
            exit: { opacity: 0, scale: 0.9, filter: "grayscale(1)" },
            transition: { duration: 1.2, ease: "anticipate" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer hover:grayscale-0 transition-all duration-1000",
            alt: "Royal Moment",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-4 border border-[#d4af37]/20 pointer-events-none group-hover:inset-6 transition-all duration-700" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 right-12 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 bg-[#4a0404]/80 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#d4af37] hover:text-[#4a0404] shadow-2xl",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 28 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#4a0404]/98 backdrop-blur-3xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-[#d4af37] hover:scale-110 hover:rotate-90 transition-all duration-500 z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 40, className: "sm:size-16", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.2, x: -10 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -50 },
                transition: { duration: 0.6 },
                className: "relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-6 bg-white shadow-2xl rounded-none",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[85vh] w-auto h-auto object-contain border border-[#d4af37]/20",
                      alt: "Fullscreen Moment"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-24 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "px-10 py-4 bg-black/40 backdrop-blur-3xl border border-[#d4af37]/30", children: /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-2xl text-[#d4af37] uppercase tracking-widest leading-none", children: [
                    "Archive ",
                    selectedImg + 1,
                    " / ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.2, x: 10 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$3 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-center", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/10 dark:to-white/10 transition-all duration-1000 text-center", children: "Kado Kasih" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-serif italic tracking-tight text-[#8d6e1c]/60 dark:text-[#d4af37]/60 mt-8 leading-relaxed max-w-2xl italic transition-colors duration-1000 text-center", children: '"Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."' })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-10 max-w-5xl mx-auto", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white/50 dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 p-12 rounded-none backdrop-blur-3xl space-y-10 group relative transition-all duration-700 hover:border-[#8d6e1c]/60 dark:hover:border-[#d4af37]/60 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-left", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] italic", children: account.bank }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-serif italic tracking-tight text-black/80 dark:text-white/90 font-black", children: account.number }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold uppercase tracking-[0.3em]", children: [
            "A.N ",
            account.name
          ] })
        ] }),
        /* @__PURE__ */ jsx(Landmark, { size: 24, className: "opacity-20" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(account.number, `bank-${idx}`), className: "w-full py-5 border border-[#8d6e1c]/20 dark:border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8d6e1c] hover:text-white transition-all shadow-xl active:scale-95", children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { size: 14 }) : /* @__PURE__ */ jsx(Copy, { size: 14 }) })
    ] }, idx)) })
  ] }) });
};
const RSVPForm$3 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const loadRSVPs = async () => {
    if (!invitationId) return;
    const data = await dbService.getRSVPs(invitationId);
    setRsvps(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setFormData((p) => ({ ...p, guest_name: to }));
    loadRSVPs();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || void 0 });
      setSubmitted(true);
      loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "rsvp", className: "bg-[#fdfcf0] dark:bg-[#4a0404] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#8d6e1c] dark:from-white to-[#8d6e1c]/20 dark:to-white/20 transition-all duration-1000 text-left", children: "RSVP" }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 bg-white/50 dark:bg-black/20 text-center", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#d4af37] h-24 w-24 mx-auto" }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif italic mt-4", children: "Terima Kasih" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-[#8d6e1c] dark:text-[#d4af37] mt-8 uppercase text-xs", children: "Kirim Ulang" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-16 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "NAMA LENGKAP", className: "w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic outline-none focus:border-[#d4af37]/60", value: formData.guest_name, onChange: (e) => setFormData({ ...formData, guest_name: e.target.value }) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "TULIS PESAN ANDA...", className: "w-full bg-white dark:bg-black/20 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 px-8 py-6 text-2xl font-serif italic outline-none resize-none focus:border-[#d4af37]/60", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-8 text-left", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase text-[#d4af37]/40", children: "Sticker" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowStickerPicker(true), className: "text-[#d4af37] transition-colors", children: /* @__PURE__ */ jsx(Smile, { size: 24 }) })
        ] }),
        formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-8 text-left", children: [
          /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((p) => ({ ...p, sticker: null })), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }),
        showStickerPicker && /* @__PURE__ */ jsx(StickerPicker$1, { isOpen: showStickerPicker, selectedSticker: formData.sticker?.id || null, onSelect: (sticker) => {
          setFormData((p) => ({ ...p, sticker }));
          setShowStickerPicker(false);
        }, onClose: () => setShowStickerPicker(false) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, attendance: status }), className: `py-8 font-bold uppercase tracking-widest text-[9px] border transition-all ${formData.attendance === status ? "bg-[#8d6e1c] dark:bg-[#d4af37] text-white dark:text-maroon-900 border-[#8d6e1c] dark:border-[#d4af37]" : "bg-white dark:bg-black/20 text-[#8d6e1c]/40 dark:text-[#d4af37]/40 border-[#8d6e1c]/10 dark:border-[#d4af37]/10"}`, children: status.replace("TIDAK_HADIR", "Berhalangan").replace("HADIR", "Akan Hadir") }, status)) }),
        /* @__PURE__ */ jsx("button", { disabled: isSubmitting, className: "w-full bg-gradient-to-b from-[#8d6e1c] dark:from-[#d4af37] to-[#4a3a0a] dark:to-[#8d6e1c] text-white dark:text-maroon-900 py-8 font-bold uppercase tracking-[0.4em] text-[10px] active:scale-95 transition-all", children: isSubmitting ? "MEMPROSES..." : "KONFIRMASI KEHADIRAN" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 lg:pl-24 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-3 text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-7xl md:text-8xl font-serif italic text-black/80 dark:text-white/90", children: rsvps.length }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[#d4af37]", children: [
          /* @__PURE__ */ jsx(Users, { size: 16 }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest font-bold", children: "Total Konfirmasi" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: rsvps.slice(0, 5).map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-10 border border-[#8d6e1c]/10 dark:border-[#d4af37]/10 bg-white dark:bg-black/10 text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-2xl md:text-3xl font-serif italic text-black/80 dark:text-white/80", children: rsvp.guest_name }),
          /* @__PURE__ */ jsx(Heart, { size: 16, className: rsvp.attendance === AttendanceStatus.HADIR ? "text-[#d4af37] fill-[#d4af37]" : "text-black/10" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[#d4af37]/40 text-sm italic mt-4", children: [
          '"',
          rsvp.message || "Hadir.",
          '"'
        ] })
      ] }, rsvp.id)) })
    ] })
  ] }) }) });
};
const Wishes$3 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const loadWishes = async () => {
    if (!invitationId) return;
    const data = await dbService.getWishes(invitationId);
    setWishes(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setName(to);
    loadWishes();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !invitationId) return;
    try {
      await dbService.saveWish(invitationId, { name, message });
      setMessage("");
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-[#f9f8f0] dark:bg-[#2a0202] text-[#8d6e1c] dark:text-[#d4af37] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-20 text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-8xl font-serif italic text-left", children: "Untaian Doa" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-white dark:bg-black/20 p-12 md:p-16 border border-[#8d6e1c]/10 dark:border-[#d4af37]/20 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "NAMA ANDA", className: "w-full bg-transparent border-b border-[#d4af37]/20 py-4 text-2xl font-serif italic outline-none text-black dark:text-white", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx("textarea", { required: true, placeholder: "TULIS DOA ANDA...", rows: 4, className: "w-full bg-transparent border-b border-[#d4af37]/20 py-4 text-2xl font-serif italic outline-none text-black dark:text-white resize-none", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-gradient-to-b from-[#8d6e1c] to-[#4a3a0a] text-white py-8 font-bold uppercase text-[10px] transition-all active:scale-95", children: "KIRIM DOA RESTU" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16 lg:pl-20 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 border-b border-[#d4af37]/10 pb-12 text-left", children: [
        /* @__PURE__ */ jsx(Quote, { className: "text-[#d4af37] h-10 w-10 rotate-180 opacity-40" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[1em] text-[#d4af37]/20 text-left", children: [
          "GUESTBOOK — ",
          wishes.length
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-12 text-left", children: wishes.slice(0, 4).map((wish) => /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-left group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl font-serif italic text-black/80 dark:text-white/80 transition-colors group-hover:text-[#d4af37] text-left italic", children: [
          '"',
          wish.message,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12 pt-4 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-24 bg-[#d4af37]/20" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic text-[#d4af37]/80", children: wish.name })
        ] })
      ] }, wish.id)) })
    ] })
  ] }) }) });
};
const Navbar$3 = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{ icon: Home, label: "Home", href: "#hero" }, { icon: Heart, label: "Mempelai", href: "#couple" }, { icon: Star, label: "Kisah", href: "#story" }, { icon: Calendar, label: "Acara", href: "#event" }, { icon: Camera, label: "Galeri", href: "#gallery" }, { icon: Gift, label: "Kado", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-50 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-[#4a0404]/80 backdrop-blur-3xl border border-[#d4af37]/30 px-8 py-5 rounded-full flex items-center gap-6 md:gap-10 shadow-2xl", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs("a", { href: item.href, className: "group relative text-[#d4af37]/40 hover:text-[#d4af37] transition-all", children: [
      /* @__PURE__ */ jsx(item.icon, { size: 20 }),
      /* @__PURE__ */ jsx("span", { className: "absolute -top-14 opacity-0 group-hover:opacity-100 transition-all bg-[#d4af37] text-maroon-900 text-[9px] font-black px-4 py-2 rounded-md hidden group-hover:block whitespace-nowrap", children: item.label })
    ] }, idx)),
    /* @__PURE__ */ jsx("button", { onClick: toggleTheme, className: "text-[#d4af37]/40 hover:text-[#d4af37] transition-all", children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }) })
  ] }) });
};
const RoyalTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `royal-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$3, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$3, {}),
      /* @__PURE__ */ jsx(CoupleProfile$3, {}),
      /* @__PURE__ */ jsx(LoveStory$3, {}),
      /* @__PURE__ */ jsx(EventDetails$3, {}),
      /* @__PURE__ */ jsx(Gallery$3, {}),
      /* @__PURE__ */ jsx(GiftInfo$3, {}),
      /* @__PURE__ */ jsx(RSVPForm$3, {}),
      /* @__PURE__ */ jsx(Wishes$3, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$3, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$2 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$2 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfbf7] overflow-hidden text-[#2d4a3e]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-8 md:inset-16 border border-[#2d4a3e]/10 pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-10 md:inset-20 border-2 border-[#c5a059]/20 pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Star, { className: "text-[#c5a059] mx-auto opacity-40", size: 32, strokeWidth: 1 }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] md:text-xs font-bold uppercase text-[#2d4a3e]/60", children: "Assalamu'alaikum Warahmatullahi Wabarakatuh" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059]", children: "The Sacred Union of" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#2d4a3e]", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 bg-white/50 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-[#2d4a3e]/5 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 italic", children: "Kepada Yth. Bapak/Ibu/Saudara/i" }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e]", children: guestName || "Tamu Undangan" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onOpen,
            className: "group relative flex items-center gap-6 px-12 py-5 bg-[#2d4a3e] text-white font-bold uppercase text-[10px] tracking-[0.4em] rounded-full hover:bg-[#1e332a] transition-all shadow-xl active:scale-95",
            children: [
              "Buka Undangan",
              /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1em] font-bold text-[#2d4a3e]/20 uppercase", children: "Walimatul 'Ursy" })
    ] })
  ] });
};
const Hero$2 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 transition-colors duration-1000 overflow-hidden px-8 py-20", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-fixed transition-opacity duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,#0c2c1e_0%,transparent_100%)] opacity-60 transition-colors duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-px bg-[#c5a059]/30 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] md:text-sm font-bold uppercase text-[#c5a059] leading-relaxed", children: "Maha Suci Allah Yang Menciptakan Makhluk-Nya Berpasang-pasangan" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-px bg-[#c5a059]/30 mx-auto" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-8", children: /* @__PURE__ */ jsxs("h1", { className: "text-[5.5rem] md:text-[13rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white/95 transition-colors duration-1000", children: [
        config.couple.groom.name,
        " ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-4xl md:text-8xl font-sans not-italic text-[#c5a059] opacity-40", children: "&" }),
        " ",
        /* @__PURE__ */ jsx("br", {}),
        config.couple.bride.name
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-10 text-center", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.5em] text-[#2d4a3e]/40 dark:text-white/30 italic", children: "— The Celebration —" }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-7xl font-serif italic tracking-tight text-[#c5a059]", children: config.hero.date })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 flex flex-col items-center gap-3 opacity-20 transition-opacity duration-1000", children: [
      /* @__PURE__ */ jsx("div", { className: "w-[1px] h-16 bg-[#2d4a3e] dark:bg-[#c5a059]" }),
      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-[0.8em] [writing-mode:vertical-rl] rotate-180 dark:text-white/50", children: "Discovery" })
    ] })
  ] });
};
const CoupleProfile$2 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 text-[#2d4a3e] dark:text-white/90 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-[#fdfbf7] dark:bg-[#0c2c1e] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 transition-colors duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-32 space-y-10 animate-reveal", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-5xl md:text-8xl font-serif italic tracking-tight leading-none dark:text-white transition-colors duration-1000", children: "The Mempelai" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed border-y border-[#2d4a3e]/5 dark:border-white/5 py-10 transition-colors duration-1000", children: [
          '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." ',
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-[#c5a059] mt-4 block text-xs md:text-sm font-bold uppercase tracking-widest", children: "( QS. Ar-Rum: 21 )" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-24 md:gap-40 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem]" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-[2.8rem] relative z-10", children: /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100", alt: config.couple.groom.fullName }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]", children: "The Groom" }),
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40", children: "Putra Dari" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all", children: config.couple.groom.parents })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[420px] aspect-[4/5] p-6 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 shadow-xl overflow-hidden rounded-[4rem] group-hover:shadow-2xl transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-4 border border-[#c5a059]/10 dark:border-[#c5a059]/20 rounded-[3rem]" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden rounded-[2.8rem] relative z-10", children: /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full h-full object-cover saturate-[0.8] brightness-[1.05] transition-all duration-1000 group-hover:scale-105 group-hover:saturate-100", alt: config.couple.bride.fullName }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em]", children: "The Bride" }),
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-6xl font-serif italic tracking-tight leading-none dark:text-white", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-[#2d4a3e]/5 dark:border-white/5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d4a3e]/40 dark:text-white/40", children: "Putri Dari" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-serif italic tracking-tight opacity-70 group-hover:opacity-100 transition-all", children: config.couple.bride.parents })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LoveStory$2 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-[#fdfbf7] dark:bg-[#061a12] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] transition-opacity duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white", children: "The Hikayat" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic", children: "Sekelumit Perjalanan Kasih" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative space-y-20 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#2d4a3e]/10 dark:via-white/5 to-transparent hidden md:block" }),
        config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`, style: { animationDelay: `${idx * 0.2}s` }, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white dark:bg-[#0c2c1e] rounded-full border border-[#2d4a3e]/5 dark:border-white/5 flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx(Star, { size: 12, className: "text-[#c5a059]" }) }) }),
          /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 group ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-12 md:p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-5xl font-serif italic tracking-tighter text-[#c5a059] leading-none", children: story.date }),
              /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-serif italic tracking-tight text-[#2d4a3e]/80 dark:text-white/80 leading-none", children: story.title })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[#2d4a3e]/40 dark:text-white/40 font-serif italic text-sm tracking-tight leading-relaxed uppercase mt-10", children: story.desc })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
        ] }, idx))
      ] })
    ] })
  ] });
};
const EventDetails$2 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "event", className: "bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8 animate-reveal", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors duration-1000", children: "The Rangkaian" }),
      /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-bold uppercase text-[#c5a059] italic", children: "Acara Kebahagiaan" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-24", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group p-12 md:p-20 flex flex-col items-center text-center bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] shadow-sm transition-all duration-700 hover:shadow-xl hover:border-[#c5a059]/20", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block px-10 py-3 bg-[#fdfbf7] dark:bg-[#061a12] border border-[#c5a059]/20 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] mb-12", children: event.title }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-3xl md:text-5xl font-serif italic text-[#2d4a3e] dark:text-white", children: [
            event.day,
            ", ",
            event.date
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 text-lg font-bold uppercase text-[#c5a059]", children: [
            /* @__PURE__ */ jsx(Clock, { size: 18 }),
            /* @__PURE__ */ jsxs("span", { children: [
              event.startTime,
              " — ",
              event.endTime,
              " WIB"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-2xl md:text-3xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#2d4a3e]/40 dark:text-white/40 max-w-[320px] mx-auto leading-relaxed italic uppercase tracking-wider", children: event.venue.address })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: event.venue.mapsEmbedUrl.replace("&output=embed", ""), target: "_blank", className: "mt-12 group/btn flex items-center gap-4 px-10 py-5 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-[10px] font-bold uppercase text-white shadow-md", children: "Petunjuk Peta" })
    ] }, event.id)) })
  ] }) });
};
const Gallery$2 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#fefcf8] dark:bg-[#061a12] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-all", style: { backgroundImage: "radial-gradient(#c5a059 1px, transparent 1px)", backgroundSize: "40px 40px" } }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$2, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] sm:text-xs font-bold uppercase text-[#c5a059]", children: "Kisah Visual" }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-none text-[#2d4a3e] dark:text-white transition-colors", children: "Archives" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-[1px] bg-[#c5a059] opacity-30" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$2, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 rounded-full bg-white dark:bg-[#0c2c1e]/60 border-2 border-[#c5a059]/20 dark:border-white/5 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx ? "border-[#c5a059] scale-110 shadow-2xl z-20" : "border-transparent opacity-40 grayscale-[0.3] hover:opacity-100 hover:grayscale-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 rounded-full bg-white dark:bg-[#0c2c1e]/60 border-2 border-[#c5a059]/20 dark:border-white/5 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$2, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[4rem] sm:rounded-[6rem] overflow-hidden border border-[#c5a059]/20 dark:border-white/5 shadow-2xl group transition-all duration-1000", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, filter: "brightness(0.8) sepia(0.2)" },
            animate: { opacity: 1, filter: "brightness(1) sepia(0)" },
            exit: { opacity: 0, filter: "brightness(0.8) sepia(0.2)" },
            transition: { duration: 1, ease: "easeInOut" },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer",
            alt: "Featured Archives",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#2d4a3e]/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 right-12 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#c5a059]",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 28 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#fefcf8]/95 dark:bg-[#061a12]/98 backdrop-blur-2xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-[#c5a059] hover:rotate-90 transition-all duration-500 z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 40, className: "sm:size-16", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-[#2d4a3e]/30 dark:text-white/30 hover:text-[#c5a059] transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.05 },
                transition: { duration: 0.5 },
                className: "relative max-h-full max-w-full flex items-center justify-center",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[85vh] w-auto h-auto object-contain rounded-[3rem] sm:rounded-[6rem] shadow-2xl border border-[#c5a059]/10",
                      alt: "Fullscreen Archives"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-20 flex items-center justify-center gap-6", children: /* @__PURE__ */ jsx("div", { className: "px-8 py-3 bg-white/40 dark:bg-[#0c2c1e]/40 backdrop-blur-xl rounded-full border border-[#c5a059]/20", children: /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-2xl text-[#2d4a3e] dark:text-stone-300", children: [
                    "Moment ",
                    selectedImg + 1,
                    " of ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-[#2d4a3e]/30 dark:text-white/30 hover:text-[#c5a059] transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[120px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$2 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[10rem] font-serif italic text-[#2d4a3e] dark:text-white", children: "Kado Kasih" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl font-serif italic text-[#2d4a3e]/60 dark:text-white/60 leading-relaxed italic max-w-xl mx-auto", children: '"Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih, kami sampaikan pintu terima kasih."' })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-10 max-w-5xl mx-auto", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 p-12 rounded-[4rem] shadow-sm space-y-12 transition-all duration-700 hover:shadow-2xl hover:border-[#c5a059]/20 group relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-left", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[12px] font-bold uppercase text-[#c5a059] tracking-[0.4em] italic", children: account.bank }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-serif italic tracking-tight text-[#2d4a3e] dark:text-white font-black", children: account.number }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80", children: account.name })
        ] }),
        /* @__PURE__ */ jsx(Landmark, { size: 24, className: "text-[#c5a059] opacity-40" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(account.number, `bank-${idx}`), className: "w-full py-6 bg-[#2d4a3e] dark:bg-[#c5a059] rounded-full text-white dark:text-[#061a12] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all shadow-xl active:scale-95", children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { size: 16 }) : /* @__PURE__ */ jsx(Copy, { size: 16 }) })
    ] }, idx)) })
  ] }) });
};
const RSVPForm$2 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const loadRSVPs = async () => {
    if (!invitationId) return;
    const data = await dbService.getRSVPs(invitationId);
    setRsvps(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setFormData((p) => ({ ...p, guest_name: to }));
    loadRSVPs();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || void 0 });
      setSubmitted(true);
      loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "rsvp", className: "bg-[#fdfbf7] dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-serif italic text-[#2d4a3e] dark:text-white", children: "Reservasi" }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "p-16 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[4rem] text-center shadow-sm", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#2d4a3e] dark:text-white h-24 w-24 mx-auto opacity-80" }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif italic text-[#2d4a3e] dark:text-white mt-8", children: "Terima Kasih" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold mt-8 uppercase", children: "Kirim Ulang" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-16 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "NAMA LENGKAP", className: "w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30", value: formData.guest_name, onChange: (e) => setFormData({ ...formData, guest_name: e.target.value }) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "PESAN SINGKAT...", className: "w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 resize-none", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-8 text-left", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase text-[#c5a059]", children: "Pilih Sticker" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowStickerPicker(true), className: "text-[#c5a059] transition-colors", children: /* @__PURE__ */ jsx(Smile, { size: 24 }) })
        ] }),
        formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-8 text-left", children: [
          /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((p) => ({ ...p, sticker: null })), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }),
        showStickerPicker && /* @__PURE__ */ jsx(StickerPicker$1, { isOpen: showStickerPicker, selectedSticker: formData.sticker?.id || null, onSelect: (sticker) => {
          setFormData((p) => ({ ...p, sticker }));
          setShowStickerPicker(false);
        }, onClose: () => setShowStickerPicker(false) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, attendance: status }), className: `py-8 rounded-full font-bold uppercase tracking-widest text-[9px] border transition-all ${formData.attendance === status ? "bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] border-[#2d4a3e] dark:border-[#c5a059] shadow-lg scale-105" : "bg-white dark:bg-[#0c2c1e]/40 text-[#2d4a3e]/40 dark:text-white/30 border-[#2d4a3e]/5 dark:border-white/5 hover:border-[#c5a059]/30"}`, children: status.replace("TIDAK_HADIR", "Insyaallah Berhalangan").replace("HADIR", "Insyaallah Hadir") }, status)) }),
        /* @__PURE__ */ jsx("button", { disabled: isSubmitting, className: "w-full bg-[#c5a059] text-white py-8 rounded-full font-bold uppercase text-[10px] transition-all hover:bg-[#b08b45] active:scale-95 shadow-xl", children: isSubmitting ? "MENGIRIM..." : "KONFIRMASI KEHADIRAN" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 lg:pl-24 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center lg:items-end gap-3 text-center lg:text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-8xl font-serif italic text-[#2d4a3e]/40 dark:text-white/20", children: rsvps.length }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[#c5a059]", children: "Tamu Terdaftar" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: rsvps.slice(0, 5).map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-10 bg-white dark:bg-[#0c2c1e]/40 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3.5rem] shadow-sm relative group hover:border-[#c5a059]/20 transition-all text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-3xl font-serif italic text-[#2d4a3e]/80 dark:text-white/80", children: rsvp.guest_name }),
          /* @__PURE__ */ jsx(Heart, { size: 16, className: rsvp.attendance === AttendanceStatus.HADIR ? "text-[#c5a059] fill-[#c5a059]" : "text-[#2d4a3e]/10" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[#2d4a3e]/40 dark:text-white/40 text-sm font-medium italic mt-4", children: [
          '"',
          rsvp.message || "Barakallahu lakum wa baraka 'alaikum.",
          '"'
        ] })
      ] }, rsvp.id)) })
    ] })
  ] }) }) });
};
const Wishes$2 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const loadWishes = async () => {
    if (!invitationId) return;
    const data = await dbService.getWishes(invitationId);
    setWishes(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setName(to);
    loadWishes();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !invitationId) return;
    try {
      await dbService.saveWish(invitationId, { name, message });
      setMessage("");
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-white dark:bg-[#061a12] text-[#2d4a3e] dark:text-white/90 py-24 md:py-48 px-6 md:px-24 relative overflow-hidden transition-colors duration-1000", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-8xl font-serif italic text-[#2d4a3e] dark:text-white", children: "Doa & Restu" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-[#fdfbf7] dark:bg-[#0c2c1e]/40 p-12 md:p-16 rounded-[4rem] border border-[#2d4a3e]/5 dark:border-white/5 shadow-sm text-left transition-all hover:shadow-xl", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "NAMA ANDA", className: "w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-full px-12 py-6 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx("textarea", { required: true, placeholder: "DOA TERBAIK ANDA...", rows: 4, className: "w-full bg-white dark:bg-[#0c2c1e]/60 border border-[#2d4a3e]/5 dark:border-white/5 rounded-[3rem] px-12 py-8 text-2xl font-serif italic text-[#2d4a3e] dark:text-white outline-none focus:border-[#c5a059]/30 resize-none", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-[#2d4a3e] dark:bg-[#c5a059] text-white dark:text-[#061a12] py-8 rounded-full font-bold uppercase text-[10px] transition-all hover:bg-[#1e332a] active:scale-95 shadow-xl", children: "KIRIM DOA RESTU" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 border-b border-[#2d4a3e]/5 dark:border-white/5 pb-12 text-left", children: [
        /* @__PURE__ */ jsx(Quote, { size: 40, className: "text-[#c5a059] opacity-40" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.8em] text-[#2d4a3e]/20 dark:text-white/20", children: "GUESTBOOK ARCHIVE" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-12 text-left", children: wishes.slice(0, 4).map((wish) => /* @__PURE__ */ jsxs("div", { className: "relative space-y-10 group text-left", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl font-serif italic text-[#2d4a3e]/90 dark:text-white/90 group-hover:text-[#2d4a3e] dark:group-hover:text-white transition-colors", children: [
          '"',
          wish.message,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-10 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-[#c5a059]/30" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-serif italic text-[#2d4a3e]/70 dark:text-white/70", children: wish.name })
        ] })
      ] }, wish.id)) })
    ] })
  ] }) }) });
};
const Navbar$2 = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{ icon: Home, label: "Awal", href: "#hero" }, { icon: Heart, label: "Mempelai", href: "#couple" }, { icon: Star, label: "Kisah", href: "#story" }, { icon: Calendar, label: "Agenda", href: "#event" }, { icon: Camera, label: "Galeri", href: "#gallery" }, { icon: Gift, label: "Kado", href: "#gift" }, { icon: MessageCircle, label: "RSVP", href: "#rsvp" }];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-75 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-2xl border border-[#2d4a3e]/5 px-10 py-6 rounded-full shadow-2xl flex items-center gap-8 md:gap-12", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs("a", { href: item.href, className: "group relative text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all", children: [
      /* @__PURE__ */ jsx(item.icon, { size: 20 }),
      /* @__PURE__ */ jsx("span", { className: "absolute -top-16 opacity-0 group-hover:opacity-100 transition-all bg-[#2d4a3e] text-white text-[9px] font-black px-5 py-3 rounded-full hidden group-hover:block whitespace-nowrap", children: item.label })
    ] }, idx)),
    /* @__PURE__ */ jsx("button", { onClick: toggleTheme, className: "text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all", children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }) })
  ] }) });
};
const IslamicTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `islamic-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$2, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-1000 ${isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$2, {}),
      /* @__PURE__ */ jsx(CoupleProfile$2, {}),
      /* @__PURE__ */ jsx(LoveStory$2, {}),
      /* @__PURE__ */ jsx(EventDetails$2, {}),
      /* @__PURE__ */ jsx(Gallery$2, {}),
      /* @__PURE__ */ jsx(GiftInfo$2, {}),
      /* @__PURE__ */ jsx(RSVPForm$2, {}),
      /* @__PURE__ */ jsx(Wishes$2, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$2, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const Reveal$1 = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope$1 = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#f4ecd8] overflow-hidden text-[#5c4033]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#704214]/5 mix-blend-multiply" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-8 md:inset-16 border-[12px] border-[#5c4033]/10 border-double pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-12 right-12 md:top-24 md:right-24 rotate-12 opacity-40 group hover:grayscale-0 transition-all duration-700", children: /* @__PURE__ */ jsxs("div", { className: "w-24 h-32 md:w-32 md:h-40 bg-white p-2 border-2 border-dashed border-[#5c4033]/30 shadow-lg flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full h-2/3 bg-[#5c4033]/5 mb-2 border border-[#5c4033]/10" }),
      /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-tighter", children: "Postage Paid" }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] font-serif italic text-[#c5a059]", children: "1970s" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-10 text-center animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] md:text-sm font-bold uppercase text-[#5c4033]/60 font-mono", children: "Top Secret & Exclusive" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-[2px] bg-[#5c4033]/20 mx-auto" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] font-mono", children: "The Union of Two Souls" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-[#5c4033]", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-sans not-italic text-2xl md:text-4xl text-[#c5a059] mx-2", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs h-[1px] bg-[#5c4033]/10" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 bg-white/40 backdrop-blur-sm p-12 md:p-20 border-x-4 border-[#5c4033]/20 relative shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 relative z-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold uppercase tracking-[0.4em] text-[#5c4033]/40 italic font-mono", children: "Kepada Yth. Kolega & Kerabat" }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-6xl font-serif italic tracking-tight text-[#5c4033]/80", children: guestName || "Tamu Undangan" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onOpen,
            className: "group relative flex items-center gap-6 px-12 py-6 bg-[#5c4033] text-[#f4ecd8] font-mono font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#3d2b22] transition-all shadow-xl active:scale-95 mx-auto",
            children: [
              "Open Telegram",
              /* @__PURE__ */ jsx(MoveRight, { className: "group-hover:translate-x-2 transition-transform" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] tracking-[1.5em] font-bold text-[#5c4033]/20 uppercase font-mono", children: "Classified Information" })
    ] })
  ] });
};
const Hero$1 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative min-h-screen flex flex-col items-center justify-center bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] overflow-hidden px-8 py-20 font-serif transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-fixed transition-opacity duration-1000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20", children: [...Array(20)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-x-2 border-black/20 dark:border-white/10" }, i)) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-12 bg-black/5 dark:bg-white/5 flex items-center justify-around opacity-20", children: [...Array(20)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-x-2 border-black/20 dark:border-white/10" }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto flex flex-col items-center space-y-20 animate-reveal", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 justify-center text-[#c5a059]", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px w-12 bg-[#c5a059]/40" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] md:text-sm font-bold uppercase font-mono", children: "A Nostalgic Chronicle" }),
        /* @__PURE__ */ jsx("div", { className: "h-px w-12 bg-[#c5a059]/40" })
      ] }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-[5.5rem] md:text-[14rem] italic tracking-tighter leading-none text-[#5c4033]/90 dark:text-[#d4c3a1]/90 transition-colors duration-1000", children: [
        config.couple.groom.name,
        " ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-4xl md:text-9xl font-sans not-italic text-[#c5a059] opacity-30", children: "&" }),
        " ",
        /* @__PURE__ */ jsx("br", {}),
        config.couple.bride.name
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-12 text-center pt-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold uppercase tracking-[1em] text-[#5c4033]/40 dark:text-[#d4c3a1]/30 font-mono italic", children: "Documented on" }),
          /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-8xl italic tracking-tight text-[#5c4033]/70 dark:text-[#d4c3a1]/80 font-black", children: config.hero.date })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "py-6 px-12 border-y-2 border-[#5c4033]/10 dark:border-white/10", children: /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-[#c5a059] uppercase tracking-[0.4em] font-mono", children: "— ESTABLISHED FOR ETERNITY —" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 flex flex-col items-center gap-4 opacity-40 animate-pulse", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-[0.8em] font-mono rotate-90 dark:text-[#d4c3a1]/60", children: "Rewind" }),
      /* @__PURE__ */ jsx("div", { className: "w-[2px] h-12 bg-[#5c4033]/30 dark:bg-[#d4c3a1]/20" })
    ] })
  ] });
};
const CoupleProfile$1 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-[#f4ecd8] dark:bg-[#121212] py-24 md:py-48 px-6 md:px-24 text-[#5c4033] dark:text-[#d4c3a1] relative overflow-hidden font-serif transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-32 space-y-10 animate-reveal", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-9xl italic tracking-tighter leading-none dark:text-[#d4c3a1]/90", children: "The Protagonists" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 max-w-2xl mx-auto font-mono uppercase tracking-widest leading-relaxed py-4 px-8 bg-[#5c4033]/5 dark:bg-white/5 transition-colors duration-1000", children: '"A cinematic journey of two souls, captured in the grain of time."' })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 md:gap-40 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl -rotate-3 group-hover:rotate-0 transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6", children: /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000", alt: config.couple.groom.fullName }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-2xl font-mono tracking-tighter opacity-70 italic", children: [
              config.couple.groom.name,
              " — '70"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl italic dark:text-[#d4c3a1]", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono", children: "Legacy of" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl italic tracking-tight opacity-60", children: config.couple.groom.parents })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center md:mt-32", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-[85%] overflow-hidden bg-gray-100 dark:bg-black/20 mb-6", children: /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000", alt: config.couple.bride.fullName }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-2xl font-mono tracking-tighter opacity-70 italic", children: [
              config.couple.bride.name,
              " — '72"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl italic dark:text-[#d4c3a1]", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] font-mono", children: "Heritage of" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl italic tracking-tight opacity-60", children: config.couple.bride.parents })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LoveStory$1 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "story", className: "bg-[#3d2b22] dark:bg-[#0a0a0a] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10", children: [...Array(30)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-4 h-8 border-x border-white/20" }, i)) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-16 bg-black/20 dark:bg-white/5 flex items-center justify-around opacity-10", children: [...Array(30)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-4 h-8 border-x border-white/20" }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] italic tracking-tighter leading-none text-[#f4ecd8] opacity-90 drop-shadow-2xl", children: "The Archives" }),
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono", children: "Our History Logged" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative space-y-24 max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-4 bg-black/10 border-x border-white/5 hidden md:block" }),
        config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`, style: { animationDelay: `${idx * 0.2}s` }, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-8 bg-[#3d2b22] border-y-2 border-[#c5a059]/40 flex shadow-lg" }) }),
          /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 group ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-12 md:p-16 bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 rounded-sm hover:bg-[#f4ecd8]/10 transition-all duration-700 shadow-2xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-4xl md:text-5xl italic text-[#c5a059] font-black italic", children: story.date }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl italic text-[#f4ecd8]/80 font-mono uppercase tracking-widest mt-6", children: story.title }),
            /* @__PURE__ */ jsx("p", { className: "text-[#f4ecd8]/30 font-mono text-xs uppercase tracking-[0.1em] leading-relaxed italic mt-10", children: story.desc })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
        ] }, idx))
      ] })
    ] })
  ] });
};
const EventDetails$1 = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "event", className: "bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8 animate-reveal", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] italic tracking-tighter text-[#f4ecd8]/90 drop-shadow-xl", children: "The Docket" }),
      /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-bold uppercase text-[#c5a059] font-mono", children: "Confidential Schedule" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-24", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group bg-[#f4ecd8]/5 dark:bg-white/5 border border-[#f4ecd8]/10 p-12 md:p-24 flex flex-col items-center text-center hover:bg-[#f4ecd8]/10 transition-all duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block px-12 py-3 border-2 border-[#c5a059]/40 text-[#c5a059] font-mono mb-12 uppercase tracking-widest", children: event.title }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-6xl italic font-black", children: [
            event.day,
            ", ",
            event.date
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-mono tracking-widest text-[#c5a059] opacity-80", children: [
            event.startTime,
            " — ",
            event.endTime,
            " HRS"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-3xl md:text-4xl italic", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#f4ecd8]/40 border-l-2 border-[#c5a059]/30 pl-6 text-left font-mono italic", children: event.venue.address })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: event.venue.mapsEmbedUrl.replace("&output=embed", ""), target: "_blank", className: "mt-12 group/btn flex items-center gap-6 px-12 py-5 bg-[#f4ecd8] dark:bg-[#d4c3a1] text-[#333] hover:bg-[#c5a059] transition-all font-mono", children: "Locate Signal" })
    ] }, event.id)) })
  ] }) });
};
const Gallery$1 = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-[#f4ecd8] dark:bg-[#121212] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal$1, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "tracking-[1em] text-[10px] font-bold uppercase text-[#5c4033]/40 dark:text-[#d4c3a1]/40 font-mono italic", children: "Negative Film #001" }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] font-serif italic text-[#5c4033] dark:text-[#d4c3a1] leading-none", children: "The Reels" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$1, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-10 h-10 border-2 border-[#5c4033]/20 dark:border-[#d4c3a1]/20 text-[#5c4033] dark:text-[#d4c3a1] flex items-center justify-center hover:bg-[#5c4033] hover:text-[#f4ecd8] transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 overflow-hidden border-2 transition-all duration-500 sepia-[0.5] ${activeIndex === idx ? "border-[#5c4033] dark:border-[#d4c3a1] scale-110 shadow-2xl z-20 sepia-0" : "border-transparent opacity-40 hover:opacity-100 hover:sepia-0 hover:scale-105"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-10 h-10 border-2 border-[#5c4033]/20 dark:border-[#d4c3a1]/20 text-[#5c4033] dark:text-[#d4c3a1] flex items-center justify-center hover:bg-[#5c4033] hover:text-[#f4ecd8] transition-all active:scale-95 flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 20 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal$1, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-[#1a1a1a] p-3 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group transform rotate-[-1deg] hover:rotate-0 transition-transform duration-700", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-1 w-2 flex flex-col justify-around py-10 opacity-20 hidden sm:flex", children: [...Array(10)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-black rounded-full" }, i)) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-1 w-2 flex flex-col justify-around py-10 opacity-20 hidden sm:flex", children: [...Array(10)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-black rounded-full" }, i)) }),
        /* @__PURE__ */ jsx("div", { className: "relative w-full h-full overflow-hidden bg-zinc-200", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.1, filter: "sepia(1) brightness(0.8)" },
            animate: { opacity: 1, scale: 1, filter: "sepia(0.3) brightness(1)" },
            exit: { opacity: 0, scale: 0.9, filter: "sepia(1) brightness(0.8)" },
            transition: { duration: 1, ease: "circOut" },
            src: config.galleryImages[activeIndex],
            className: "w-full h-full object-cover cursor-pointer",
            alt: "Selected Reel",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8 z-20 pointer-events-none", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-mono text-white/50 bg-black/40 px-2 py-1 backdrop-blur-sm", children: [
          "FR — ",
          activeIndex + 1
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-14 h-14 bg-[#5c4033]/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#5c4033]",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 24 })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#121212]/98 backdrop-blur-2xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 text-white/30 hover:text-white hover:rotate-90 transition-all duration-500 z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 40, className: "sm:size-16", strokeWidth: 1 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center py-10 sm:py-20", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: -10 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-white/20 hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[100px]", strokeWidth: 1 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 30, filter: "blur(10px)" },
                animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                exit: { opacity: 0, y: -30, filter: "blur(10px)" },
                transition: { duration: 0.6 },
                className: "relative flex items-center justify-center bg-white p-2 sm:p-4 shadow-2xl",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[80vh] w-auto h-auto object-contain brightness-95",
                      alt: "Reel Fullscreen"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-white/20" }),
                    /* @__PURE__ */ jsxs("p", { className: "font-serif italic text-white/60 text-xl sm:text-3xl", children: [
                      "Frame ",
                      selectedImg + 1,
                      " / ",
                      config.galleryImages.length
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "h-[1px] w-12 bg-white/20" })
                  ] })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.1, x: 10 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-white/20 hover:text-white transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[100px]", strokeWidth: 1 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo$1 = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-serif transition-colors duration-1000", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] italic text-[#5c4033]/80 drop-shadow-xl", children: "The Tokens" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl italic text-[#5c4033]/60 dark:text-[#d4c3a1]/60 leading-relaxed font-mono uppercase tracking-widest italic max-w-xl mx-auto", children: `"Your presence is the greatest gift of all. However, should you wish to send a token of affection, we've provided our bank coordinates below."` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-10 max-w-5xl mx-auto", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white/40 dark:bg-white/5 border-2 border-[#5c4033]/10 p-12 backdrop-blur-md space-y-12 transition-all duration-700 hover:shadow-2xl hover:border-[#c5a059]/30 group relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[12px] font-bold uppercase text-[#c5a059] font-mono italic", children: [
            account.bank,
            " — ACCOUNT"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl italic font-mono tracking-tighter", children: account.number }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl italic text-[#5c4033]/80 uppercase", children: account.name })
        ] }),
        /* @__PURE__ */ jsx(Landmark, { size: 24, className: "text-[#c5a059]/40 group-hover:text-[#c5a059] transition-colors" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(account.number, `bank-${idx}`), className: "w-full py-6 bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] font-mono font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] transition-all active:scale-95 shadow-xl", children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { size: 16 }) : /* @__PURE__ */ jsx(Copy, { size: 16 }) })
    ] }, idx)) })
  ] }) });
};
const RSVPForm$1 = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const loadRSVPs = async () => {
    if (!invitationId) return;
    const data = await dbService.getRSVPs(invitationId);
    setRsvps(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setFormData((p) => ({ ...p, guest_name: to }));
    loadRSVPs();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || void 0 });
      setSubmitted(true);
      loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "rsvp", className: "bg-[#3d2b22] dark:bg-[#0a0a0a] text-[#f4ecd8] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-mono transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-serif italic text-white/90 drop-shadow-2xl", children: "Confirm" }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "p-16 border-4 border-dashed border-[#f4ecd8]/10 bg-black/10 text-center", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#c5a059] h-24 w-24 mx-auto opacity-60" }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif italic text-white/90 mt-8", children: "Signal Received" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-[#c5a059] border-b border-[#c5a059]/30 pb-1 text-[10px] font-bold mt-8 uppercase tracking-widest", children: "Re-Transmit" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-16 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "IDENTIFY YOURSELF...", className: "w-full bg-black/20 border-b-2 border-[#f4ecd8]/10 px-8 py-6 text-2xl font-mono italic tracking-tighter outline-none text-[#f4ecd8]", value: formData.guest_name, onChange: (e) => setFormData({ ...formData, guest_name: e.target.value }) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "WRITE MESSAGE...", className: "w-full bg-black/20 border-b-2 border-[#f4ecd8]/10 px-8 py-6 text-2xl font-mono italic tracking-tighter outline-none resize-none text-[#f4ecd8]", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 text-left", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase text-[#c5a059]", children: "Pilih Sticker" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowStickerPicker(true), className: "text-[#c5a059] transition-colors", children: /* @__PURE__ */ jsx(Smile, { size: 24 }) })
        ] }),
        formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-4 text-left", children: [
          /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((p) => ({ ...p, sticker: null })), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }),
        showStickerPicker && /* @__PURE__ */ jsx(StickerPicker$1, { isOpen: showStickerPicker, selectedSticker: formData.sticker?.id || null, onSelect: (sticker) => {
          setFormData((p) => ({ ...p, sticker }));
          setShowStickerPicker(false);
        }, onClose: () => setShowStickerPicker(false) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 text-left", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, attendance: status }), className: `py-8 font-bold uppercase text-[9px] border-2 transition-all ${formData.attendance === status ? "bg-[#c5a059] text-white border-[#c5a059] shadow-xl" : "bg-black/10 text-[#f4ecd8]/20 border-[#f4ecd8]/5"}`, children: status.replace("TIDAK_HADIR", "Negative").replace("HADIR", "Positive") }, status)) }),
        /* @__PURE__ */ jsx("button", { disabled: isSubmitting, className: "w-full bg-[#f4ecd8] dark:bg-[#d4c3a1] text-[#333] py-8 font-bold uppercase text-[10px] shadow-2xl hover:bg-white transition-all", children: isSubmitting ? "TRANSMITTING..." : "SEND SIGNAL" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 lg:pl-24 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center lg:items-end gap-3 text-center lg:text-right border-x-4 border-[#f4ecd8]/5 px-8 py-12", children: [
        /* @__PURE__ */ jsx("p", { className: "text-8xl font-serif italic text-[#f4ecd8]/20", children: rsvps.length }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[#c5a059]/60", children: "Operators Checked-In" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 text-left", children: rsvps.slice(0, 5).map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "p-10 border border-[#f4ecd8]/5 bg-black/5 flex flex-col gap-4 text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-2xl font-serif italic text-white/50", children: rsvp.guest_name }),
          /* @__PURE__ */ jsx(Heart, { size: 14, className: "text-[#c5a059]/20" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[#f4ecd8]/20 text-[11px] font-mono italic uppercase", children: [
          '— "',
          rsvp.message || "Message not provided.",
          '"'
        ] })
      ] }, rsvp.id)) })
    ] })
  ] }) }) });
};
const Wishes$1 = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const loadWishes = async () => {
    if (!invitationId) return;
    const data = await dbService.getWishes(invitationId);
    setWishes(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setName(to);
    loadWishes();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !invitationId) return;
    try {
      await dbService.saveWish(invitationId, { name, message });
      setMessage("");
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-[#f4ecd8] dark:bg-[#121212] text-[#5c4033] dark:text-[#d4c3a1] py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-serif transition-colors duration-1000 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-8xl italic text-[#5c4033]/90", children: "Telegrams" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-white/40 p-12 md:p-16 border-y-4 border-[#5c4033]/10 backdrop-blur-md shadow-2xl text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "NAMA ANDA...", className: "w-full bg-transparent border-b-2 border-[#5c4033]/10 py-6 text-2xl font-mono italic tracking-tighter outline-none text-[#5c4033]", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx("textarea", { required: true, placeholder: "TULIS PESAN...", rows: 4, className: "w-full bg-transparent border-b-2 border-[#5c4033]/10 py-6 text-2xl font-mono italic tracking-tighter outline-none resize-none text-[#5c4033]", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-[#5c4033] dark:bg-[#d4c3a1] text-[#f4ecd8] py-8 font-mono font-bold uppercase text-[10px] shadow-xl hover:bg-[#3d2b22] dark:hover:bg-[#c5a059] transition-all", children: "DISPATCH TELEGRAM" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b-2 border-[#5c4033]/5 pb-10 text-left", children: [
        /* @__PURE__ */ jsx(Quote, { size: 32, className: "text-[#c5a059] opacity-30" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold uppercase tracking-[0.8em] text-[#5c4033]/20", children: [
          "ARCHIVE LOG — ",
          wishes.length
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-16 text-left", children: wishes.slice(0, 4).map((wish) => /* @__PURE__ */ jsxs("div", { className: "relative space-y-8 text-left", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl italic text-[#5c4033]/70 font-black transition-colors", children: [
          '— "',
          wish.message,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[2px] w-16 bg-[#c5a059]/20" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl italic text-[#5c4033]/60 font-mono uppercase transition-colors", children: wish.name })
        ] })
      ] }, wish.id)) })
    ] })
  ] }) }) });
};
const Navbar$1 = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{ icon: Home, label: "Rewind", href: "#hero" }, { icon: Heart, label: "Couples", href: "#couple" }, { icon: Star, label: "History", href: "#story" }, { icon: Calendar, label: "Dockets", href: "#event" }, { icon: Camera, label: "Archives", href: "#gallery" }, { icon: Gift, label: "Tokens", href: "#gift" }, { icon: MessageCircle, label: "Signals", href: "#rsvp" }];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-50 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-[#f4ecd8]/90 backdrop-blur-md border-x-4 border-[#5c4033]/20 px-8 py-5 shadow-2xl flex items-center gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs("a", { href: item.href, className: "group relative text-[#5c4033]/40 hover:text-[#5c4033] transition-all", children: [
      /* @__PURE__ */ jsx(item.icon, { size: 20 }),
      /* @__PURE__ */ jsx("span", { className: "absolute -top-16 opacity-0 group-hover:opacity-100 transition-all bg-[#5c4033] text-[#f4ecd8] text-[9px] font-mono px-5 py-3 hidden group-hover:block whitespace-nowrap", children: item.label })
    ] }, idx)),
    /* @__PURE__ */ jsx("button", { onClick: toggleTheme, className: "text-[#5c4033]/40 hover:text-[#5c4033] transition-all", children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 }) })
  ] }) });
};
const VintageTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `vintage-theme ${theme === "dark" ? "dark" : ""}`, children: [
    !isOpened && /* @__PURE__ */ jsx(Envelope$1, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-[2.5s] ease-in-out ${isOpened ? "opacity-100 scale-100 grayscale-0 blur-0" : "opacity-0 scale-110 grayscale blur-xl pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero$1, {}),
      /* @__PURE__ */ jsx(CoupleProfile$1, {}),
      /* @__PURE__ */ jsx(LoveStory$1, {}),
      /* @__PURE__ */ jsx(EventDetails$1, {}),
      /* @__PURE__ */ jsx(Gallery$1, {}),
      /* @__PURE__ */ jsx(GiftInfo$1, {}),
      /* @__PURE__ */ jsx(RSVPForm$1, {}),
      /* @__PURE__ */ jsx(Wishes$1, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar$1, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {}),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none opacity-[0.05] z-[9999] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" })
  ] });
};

const Reveal = ({ children, delay = 0, width = "100%", className = "" }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay, ease: "easeOut" },
      style: { width },
      className,
      children
    }
  );
};
const Envelope = ({ onOpen }) => {
  const { config } = useSettings();
  const guestName = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("to") : null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center bg-[#fdfaf0] dark:bg-slate-950 overflow-hidden text-[#2d2d2d] dark:text-slate-100 font-sans transition-colors duration-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-8 md:inset-16 border-[4px] border-[#2d2d2d] dark:border-blue-500 rounded-[2rem] pointer-events-none shadow-[10px_10px_0_rgba(0,0,0,0.1)] transition-all duration-1000" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl px-8 flex flex-col items-center gap-12 text-center animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white dark:bg-slate-900 border-[3px] border-[#2d2d2d] dark:border-blue-400 px-10 py-5 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.1)]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-black uppercase tracking-[0.4em]", children: "NEW ISSUE: THE BIG DAY!" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-900 border-r-[3px] border-b-[3px] border-[#2d2d2d] dark:border-blue-400 rotate-45" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-black uppercase tracking-[0.5em] text-[#ff4081] dark:text-pink-500", children: "Starring" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-9xl font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-6", children: [
          config.couple.groom.name,
          " ",
          /* @__PURE__ */ jsx("span", { className: "not-italic text-2xl md:text-5xl text-[#2196f3] dark:text-blue-400 mx-2", children: "&" }),
          " ",
          config.couple.bride.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs h-[4px] bg-[#2d2d2d] dark:bg-blue-500 rounded-full" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 bg-white dark:bg-slate-900 border-[4px] border-[#2d2d2d] dark:border-blue-600 p-12 md:p-20 rounded-[3rem] shadow-[15px_15px_0_rgba(33,150,243,0.3)] relative group overflow-hidden transition-all duration-1000", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 relative z-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.4em] text-[#2d2d2d]/40 dark:text-slate-500 italic", children: "Exclusive Access For:" }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-7xl font-black italic tracking-tight text-[#2d2d2d] dark:text-white uppercase transition-colors duration-1000", children: guestName || "VIP GUEST" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onOpen,
            className: "group relative flex items-center gap-6 px-12 py-6 bg-[#2196f3] dark:bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] border-[4px] border-[#2d2d2d] dark:border-white shadow-[8px_8px_0_#2d2d2d] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 mx-auto",
            children: [
              "START THE STORY",
              /* @__PURE__ */ jsx(Zap, { className: "fill-white group-hover:animate-bounce", size: 18 })
            ]
          }
        )
      ] })
    ] })
  ] });
};
const Hero = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative min-h-screen flex flex-col items-center justify-center bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white overflow-hidden px-8 py-20 font-sans transition-colors duration-700", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(#2d2d2d_1px,transparent_1px),linear-gradient(90deg,#2d2d2d_1px,transparent_1px)] [background-size:100px_100px]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 container mx-auto flex flex-col items-center space-y-24 animate-reveal", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white px-12 py-3 shadow-[8px_8px_0_#2d2d2d] transform -rotate-1", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] md:text-sm font-black uppercase text-[#2d2d2d]", children: "VOLUME ONE: ETERNAL LOVE" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center relative", children: /* @__PURE__ */ jsxs("h1", { className: "text-[5.5rem] md:text-[15rem] font-black italic tracking-tighter leading-none text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#2196f3] dark:drop-shadow-[5px_5px_0_#ff4081]", children: [
        config.couple.groom.name,
        " ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-4xl md:text-8xl not-skew-x-0 inline-block text-[#ff4081] dark:text-[#00e5ff] -rotate-12", children: "&" }),
        " ",
        /* @__PURE__ */ jsx("br", {}),
        config.couple.bride.name
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-12 text-center pt-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase tracking-[0.5em] text-[#2d2d2d]/30 dark:text-white/30 italic transition-colors", children: "— THE PREMIERE —" }),
        /* @__PURE__ */ jsx("p", { className: "text-5xl md:text-9xl font-black italic tracking-tighter text-[#2196f3] dark:text-[#00e5ff] uppercase transform -rotate-1", children: config.hero.date })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 flex flex-col items-center gap-4 opacity-40", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.6em] [writing-mode:vertical-rl] rotate-180", children: "Scroll Down" }),
      /* @__PURE__ */ jsx("div", { className: "w-[4px] h-12 bg-[#2d2d2d] dark:bg-[#ff4081] rounded-full" })
    ] })
  ] });
};
const CoupleProfile = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsxs("section", { id: "couple", className: "bg-white dark:bg-[#0a0a1a] py-24 md:py-48 px-6 md:px-24 text-[#2d2d2d] dark:text-white relative overflow-hidden font-sans transition-colors duration-700", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:40px_40px]" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-32 space-y-12 animate-reveal", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase transform -skew-x-12 drop-shadow-[5px_5px_0_#ffeb3b] dark:drop-shadow-[5px_5px_0_#ff4081]", children: "Meet The Cast" }),
        /* @__PURE__ */ jsx("div", { className: "relative inline-block px-12 py-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] dark:border-white shadow-[10px_10px_0_#2196f3] transform rotate-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm md:text-xl font-bold italic text-[#2d2d2d] uppercase tracking-widest leading-relaxed", children: '"Every great story needs its heroes."' }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 md:gap-40 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] group-hover:shadow-[20px_20px_0_#2196f3] transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden bg-gray-100 border-[3px] border-[#2d2d2d]", children: /* @__PURE__ */ jsx("img", { src: config.couple.groom.image, className: "w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110", alt: config.couple.groom.fullName }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-6 -right-6 px-10 py-3 bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] rotate-6 group-hover:rotate-0 transition-all", children: "Groom" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl font-black italic uppercase text-[#2196f3] dark:text-[#00e5ff]", children: config.couple.groom.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase text-[#2d2d2d]/30 dark:text-white/30 italic", children: "Son of" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-3xl font-bold italic opacity-70", children: config.couple.groom.parents })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-16 group flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[450px] aspect-[4/5] bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-4 shadow-[15px_15px_0_#2d2d2d] group-hover:shadow-[20px_20px_0_#ff4081] transition-all duration-700", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-hidden bg-gray-100 border-[3px] border-[#2d2d2d]", children: /* @__PURE__ */ jsx("img", { src: config.couple.bride.image, className: "w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110", alt: config.couple.bride.fullName }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-6 -right-6 px-10 py-3 bg-[#2196f3] dark:bg-[#ff4081] text-white font-black italic uppercase border-[3px] border-[#2d2d2d] dark:border-white shadow-[5px_5px_0_#2d2d2d] -rotate-6 group-hover:rotate-0 transition-all", children: "Bride" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-5xl md:text-7xl font-black italic uppercase text-[#ff4081] dark:text-[#ff4081]", children: config.couple.bride.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t-4 border-dotted border-[#2d2d2d]/10 dark:border-white/10", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase text-[#2d2d2d]/30 dark:text-white/30 italic", children: "Daughter of" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-3xl font-bold italic opacity-70", children: config.couple.bride.parents })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LoveStory = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "story", className: "bg-white dark:bg-[#050510] py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-12 py-2 shadow-[8px_8px_0_#ff4081] transform -rotate-1", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]", children: "THE BACKSTORY" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[10px_10px_0_#2196f3]", children: "Chronicles" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative space-y-32 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-12 md:left-1/2 -translate-x-1/2 w-[6px] bg-[#2d2d2d]/10 dark:bg-[#00e5ff]/20 rounded-full hidden md:block" }),
      config.loveStory.map((story, idx) => /* @__PURE__ */ jsxs("div", { className: `relative flex items-center md:flex-row flex-col gap-12 md:gap-32 animate-reveal ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`, style: { animationDelay: `${idx * 0.2}s` }, children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-12 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white dark:bg-[#0a0a1a] border-[4px] border-[#2d2d2d] rounded-full flex items-center justify-center shadow-[6px_6px_0_#ffeb3b] dark:shadow-[6px_6px_0_#ff4081] group hover:scale-125 transition-all", children: /* @__PURE__ */ jsx(Zap, { size: 24, className: "text-[#2d2d2d] fill-[#ffeb3b]" }) }) }),
        /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 group ${idx % 2 === 1 ? "text-left" : "md:text-right text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-12 md:p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] rounded-none hover:shadow-[15px_15px_0_#2196f3] hover:-translate-y-2 transition-all duration-700", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block px-10 py-1 bg-[#ff4081] text-white font-black italic text-4xl leading-none shadow-[6px_6px_0_#2d2d2d] transform -rotate-1", children: story.date }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-5xl font-black italic uppercase text-[#2d2d2d] dark:text-white transform -skew-x-12 mt-6", children: story.title }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 rounded-xl font-black italic text-xs uppercase text-[#2d2d2d]/60 dark:text-white/60", children: story.desc })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block w-1/2" })
      ] }, idx))
    ] })
  ] }) });
};
const EventDetails = () => {
  const { config } = useSettings();
  return /* @__PURE__ */ jsx("section", { id: "event", className: "bg-[#fdfaf0] dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl space-y-40 relative z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center text-center space-y-8 animate-reveal", children: /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ffeb3b] dark:drop-shadow-[8px_8px_0_#ff4081]", children: "Plan It" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-24", children: config.events.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] dark:border-white p-12 md:p-24 flex flex-col items-center text-center font-black shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] hover:shadow-[20px_20px_0_#2196f3] transition-all duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block px-12 py-3 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] text-[#2d2d2d] mb-12 transform -rotate-2 uppercase tracking-widest", children: event.title }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-6xl italic text-[#2196f3] dark:text-[#00e5ff]", children: [
            event.day,
            ", ",
            event.date
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl tracking-widest text-[#ff4081] italic", children: [
            event.startTime,
            " — ",
            event.endTime,
            " PM"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-3xl md:text-5xl italic text-[#2d2d2d]/80 dark:text-white/80 uppercase", children: event.venue.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#2d2d2d]/60 p-8 bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-dotted border-[#2d2d2d]/20 rounded-xl italic uppercase font-bold", children: event.venue.address })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: event.venue.mapsEmbedUrl.replace("&output=embed", ""), target: "_blank", className: "mt-12 group/btn flex items-center gap-6 px-12 py-5 bg-[#2d2d2d] dark:bg-[#ff4081] text-white hover:bg-[#ff4081] transition-all shadow-[8px_8px_0_#ffeb3b]", children: "OPEN MISSION MAP" })
    ] }, event.id)) })
  ] }) });
};
const Gallery = () => {
  const { config } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % config.galleryImages.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [config.galleryImages.length]);
  const openLightbox = (index) => {
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
  const navigate = (direction, e) => {
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
    const handleKeyDown = (e) => {
      if (selectedImg === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg]);
  return /* @__PURE__ */ jsxs("section", { id: "gallery", className: "bg-white dark:bg-[#050510] py-24 sm:py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden transition-colors duration-700", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none transition-all" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl space-y-12 sm:space-y-20 relative z-10", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-block px-10 py-2 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] shadow-[8px_8px_0_#2d2d2d] transform rotate-2", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] sm:text-xs font-black uppercase text-[#2d2d2d]", children: "EPISODE: MOMENTS" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[12rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#2196f3]", children: "The Panels" })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-6 justify-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("prev"),
            className: "w-12 h-12 bg-[#2d2d2d] dark:bg-[#ff4081] text-white border-[3px] border-[#2d2d2d] flex items-center justify-center hover:bg-[#ffeb3b] hover:text-[#2d2d2d] transition-all shadow-[6px_6px_0_#2196f3] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-6 px-2", children: config.galleryImages.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] transition-all duration-500 overflow-hidden ${activeIndex === idx ? "scale-110 shadow-[8px_8px_0_#ff4081] z-20 grayscale-0" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105 shadow-[4px_4px_0_#2196f3]"}`,
            children: /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-full object-cover", alt: `Thumb ${idx}` })
          },
          idx
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("next"),
            className: "w-12 h-12 bg-[#2d2d2d] dark:bg-[#ff4081] text-white border-[3px] border-[#2d2d2d] flex items-center justify-center hover:bg-[#ffeb3b] hover:text-[#2d2d2d] transition-all shadow-[6px_6px_0_#2196f3] active:translate-x-1 active:translate-y-1 active:shadow-none flex-shrink-0",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full max-w-[450px] mx-auto bg-white dark:bg-[#1a1a2e] p-3 sm:p-5 border-[6px] border-[#2d2d2d] shadow-[25px_25px_0_rgba(33,150,243,0.3)] dark:shadow-[25px_25px_0_rgba(255,64,129,0.3)] group transition-all duration-1000 overflow-hidden transform -rotate-1", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.img,
          {
            initial: { opacity: 0, scale: 1.2, rotate: 5 },
            animate: { opacity: 1, scale: 1, rotate: 0 },
            exit: { opacity: 0, scale: 0.8, rotate: -5 },
            transition: { duration: 0.8, type: "spring", bounce: 0.4 },
            src: config.galleryImages[activeIndex],
            className: "absolute inset-0 w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-1000",
            alt: "Comic Panel",
            onClick: () => openLightbox(activeIndex)
          },
          activeIndex
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 right-12 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openLightbox(activeIndex),
            className: "w-16 h-16 bg-[#ff4081] text-white border-[4px] border-[#2d2d2d] flex items-center justify-center shadow-[6px_6px_0_#2d2d2d] opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[#ffeb3b] hover:text-[#2d2d2d] active:shadow-none active:translate-x-1 active:translate-y-1",
            children: /* @__PURE__ */ jsx(Maximize2, { size: 28 })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8 bg-white dark:bg-slate-900 border-[3px] border-[#2d2d2d] px-6 py-2 shadow-[4px_4px_0_#2d2d2d] transform -rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-[#2d2d2d] dark:text-white", children: "WOW!" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImg !== null && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-[#fdfaf0]/95 dark:bg-[#050510]/98 backdrop-blur-xl p-4 sm:p-10",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-6 right-6 sm:top-10 sm:right-10 bg-[#ff4081] text-white border-[4px] border-[#2d2d2d] p-3 shadow-[8px_8px_0_#2d2d2d] hover:bg-[#ffeb3b] hover:text-[#2d2d2d] hover:rotate-90 transition-all duration-550 z-[2030]",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx(X, { size: 32, strokeWidth: 4 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.2, x: -10 },
                whileTap: { scale: 0.9 },
                className: "absolute left-2 sm:left-4 md:left-12 text-[#2d2d2d] dark:text-blue-400 hover:text-[#ff4081] transition-colors z-[2030]",
                onClick: (e) => navigate("prev", e),
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 64, className: "sm:size-[120px]", strokeWidth: 4 })
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 100, rotate: 10 },
                animate: { opacity: 1, x: 0, rotate: 0 },
                exit: { opacity: 0, x: -100, rotate: -10 },
                transition: { type: "spring", stiffness: 300, damping: 20 },
                className: "relative max-h-full max-w-full flex items-center justify-center p-3 sm:p-8 bg-white dark:bg-[#1a1a2e] border-[8px] border-[#2d2d2d] shadow-[30px_30px_0_rgba(33,150,243,0.5)] transform -rotate-1",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: config.galleryImages[selectedImg],
                      className: "max-h-[80vh] w-auto h-auto object-contain border-[2px] border-[#2d2d2d]",
                      alt: "Comic Fullscreen"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -bottom-24 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "px-12 py-5 bg-[#ffeb3b] border-[4px] border-[#2d2d2d] shadow-[8px_8px_0_#2d2d2d] rotate-2", children: /* @__PURE__ */ jsxs("p", { className: "font-black italic text-3xl text-[#2d2d2d] uppercase tracking-tighter", children: [
                    "Page ",
                    selectedImg + 1,
                    " // ",
                    config.galleryImages.length
                  ] }) }) })
                ]
              },
              selectedImg
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.2, x: 10 },
                whileTap: { scale: 0.9 },
                className: "absolute right-2 sm:right-4 md:right-12 text-[#2d2d2d] dark:text-blue-400 hover:text-[#ff4081] transition-colors z-[2030]",
                onClick: (e) => navigate("next", e),
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 64, className: "sm:size-[120px]", strokeWidth: 4 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const GiftInfo = () => {
  const { config } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "gift", className: "bg-white dark:bg-[#0a0a1a] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-12 py-3 shadow-[8px_8px_0_#2d2d2d] transform rotate-1", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.8em] text-[10px] font-black uppercase text-[#2d2d2d]", children: "THE BONUS STAGE" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-[11rem] font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12 drop-shadow-[8px_8px_0_#ff4081]", children: "Tokens" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-12 max-w-5xl mx-auto", children: config.bankAccounts?.map((account, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] p-12 shadow-[15px_15px_0_#2d2d2d] dark:shadow-[15px_15px_0_#ff4081] space-y-12 transition-all duration-700 hover:shadow-[20px_20px_0_#2196f3] group relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block px-4 py-1 bg-[#2196f3] text-white font-black text-[10px] uppercase border-[2px] border-[#2d2d2d] shadow-[4px_4px_0_#2d2d2d] transform -rotate-3", children: account.bank }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-black italic tracking-tighter uppercase", children: account.number }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black italic tracking-tight text-[#2d2d2d]/80 uppercase transform -skew-x-12", children: account.name })
        ] }),
        /* @__PURE__ */ jsx(Landmark, { size: 24, className: "text-[#2d2d2d] group-hover:scale-125 transition-all rotate-12" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(account.number, `bank-${idx}`), className: "w-full py-8 bg-[#2d2d2d] dark:bg-[#ff4081] text-white font-black uppercase text-[12px] shadow-[8px_8px_0_#ffeb3b] hover:bg-[#ff4081] transition-all active:scale-95", children: copiedId === `bank-${idx}` ? /* @__PURE__ */ jsx(Check, { size: 20 }) : /* @__PURE__ */ jsx(Copy, { size: 20 }) })
    ] }, idx)) })
  ] }) });
};
const RSVPForm = () => {
  const { invitationId } = useSettings();
  const [formData, setFormData] = useState({ guest_name: "", phone: "", attendance: AttendanceStatus.HADIR, guest_count: 1, message: "", sticker: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const loadRSVPs = async () => {
    if (!invitationId) return;
    const data = await dbService.getRSVPs(invitationId);
    setRsvps(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setFormData((p) => ({ ...p, guest_name: to }));
    loadRSVPs();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !invitationId) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(invitationId, { ...formData, sticker: formData.sticker?.id || void 0 });
      setSubmitted(true);
      loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "rsvp", className: "bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 relative overflow-hidden font-sans transition-colors duration-700 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block bg-[#ff4081] dark:bg-[#00e5ff] text-white dark:text-[#2d2d2d] px-8 py-2 border-[3px] border-[#2d2d2d] shadow-[6px_6px_0_#2d2d2d] transform -rotate-2", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] font-black uppercase", children: "ACTION REQUIRED" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-9xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase transform -skew-x-12", children: "RSVP!" }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "p-16 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] text-center shadow-[15px_15px_0_#2196f3]", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "text-[#2196f3] h-24 w-24 mx-auto" }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black italic uppercase mt-8", children: "Signal Received!" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSubmitted(false), className: "text-[#ff4081] border-b-2 border-[#ff4081] pb-1 text-[10px] font-black mt-8 uppercase tracking-widest transition-all", children: "TRY AGAIN?" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-16 text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "WHO ARE YOU?", className: "w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter outline-none uppercase text-[#2d2d2d] dark:text-white", value: formData.guest_name, onChange: (e) => setFormData({ ...formData, guest_name: e.target.value }) }),
        /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "SPEAK YOUR MIND...", className: "w-full bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter outline-none resize-none uppercase text-[#2d2d2d] dark:text-white", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 text-left", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase text-[#ff4081]", children: "Pilih Sticker" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowStickerPicker(true), className: "text-[#2196f3]", children: /* @__PURE__ */ jsx(Smile, { size: 24 }) })
        ] }),
        formData.sticker && /* @__PURE__ */ jsxs("div", { className: "relative inline-block mt-2 ml-4 text-left", children: [
          /* @__PURE__ */ jsx("img", { src: formData.sticker.src, alt: "Selected Sticker", className: "w-20 h-20 object-contain" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((p) => ({ ...p, sticker: null })), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }),
        showStickerPicker && /* @__PURE__ */ jsx(StickerPicker$1, { isOpen: showStickerPicker, selectedSticker: formData.sticker?.id || null, onSelect: (sticker) => {
          setFormData((p) => ({ ...p, sticker }));
          setShowStickerPicker(false);
        }, onClose: () => setShowStickerPicker(false) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 text-left", children: [AttendanceStatus.HADIR, AttendanceStatus.TIDAK_HADIR].map((status) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, attendance: status }), className: `py-8 font-black uppercase text-[10px] border-[4px] border-[#2d2d2d] transition-all transform ${formData.attendance === status ? "bg-[#ffeb3b] dark:bg-[#00e5ff] text-[#2d2d2d] shadow-[10px_10px_0_#2d2d2d] -translate-x-1 -translate-y-1" : "bg-white dark:bg-transparent text-[#2d2d2d]/30"}`, children: status.replace("TIDAK_HADIR", "SORRY!").replace("HADIR", "YES!") }, status)) }),
        /* @__PURE__ */ jsx("button", { disabled: isSubmitting, className: "w-full bg-[#ff4081] text-white py-8 font-black uppercase text-[12px] shadow-[12px_12px_0_#2d2d2d] hover:shadow-none transition-all", children: isSubmitting ? "TRANSMITTING..." : "SUBMIT LOG" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-20 lg:pl-24 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center lg:items-end text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-9xl font-black italic tracking-tighter text-[#2196f3] transform -skew-x-12 drop-shadow-[10px_10px_0_#ffeb3b]", children: rsvps.length }),
        /* @__PURE__ */ jsx("div", { className: "bg-[#ff4081] text-white px-6 py-2 border-[3px] border-[#2d2d2d] rotate-[-15deg] font-black text-xs uppercase shadow-[4px_4px_0_#2d2d2d]", children: "JOINED!" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8 text-left", children: rsvps.slice(0, 5).map((rsvp) => /* @__PURE__ */ jsxs("div", { className: "relative p-10 bg-white dark:bg-[#1a1a2e] border-[4px] border-[#2d2d2d] group hover:shadow-[10px_10px_0_#ffeb3b] transition-all duration-700 text-left", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-3xl font-black italic text-[#2d2d2d] dark:text-white uppercase transform -skew-x-6", children: rsvp.guest_name }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 bg-[#fdfaf0] dark:bg-black/20 border-[2px] border-[#2d2d2d] text-sm font-black italic uppercase text-[#2d2d2d]/60 dark:text-white/60", children: [
          '— "',
          rsvp.message || "NO QUOTES.",
          '"'
        ] })
      ] }, rsvp.id)) })
    ] })
  ] }) }) });
};
const Wishes = () => {
  const { invitationId } = useSettings();
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const loadWishes = async () => {
    if (!invitationId) return;
    const data = await dbService.getWishes(invitationId);
    setWishes(data);
  };
  useEffect(() => {
    if (!invitationId) return;
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setName(to);
    loadWishes();
  }, [invitationId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !invitationId) return;
    try {
      await dbService.saveWish(invitationId, { name, message });
      setMessage("");
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "wishes", className: "bg-[#fdfaf0] dark:bg-[#050510] text-[#2d2d2d] dark:text-white py-24 md:py-48 px-6 md:px-24 overflow-hidden relative font-sans transition-colors duration-700 text-left", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl relative z-10 space-y-40 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-24 items-start text-left", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] px-10 py-2 rotate-2 shadow-[8px_8px_0_#2d2d2d]", children: /* @__PURE__ */ jsx("p", { className: "tracking-[0.6em] text-[10px] font-black uppercase text-[#2d2d2d]", children: "FAN GREETINGS" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-7xl md:text-8xl font-black italic tracking-tighter uppercase transform -skew-x-12", children: "The Dialogue" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 bg-white dark:bg-[#1a1a2e] p-12 md:p-16 border-[4px] border-[#2d2d2d] shadow-[15px_15px_0_#2196f3] group text-left", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "WHO ARE YOU?", className: "w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase outline-none", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx("textarea", { required: true, placeholder: "TYPE YOUR MESSAGE...", rows: 4, className: "w-full bg-[#fdfaf0] dark:bg-black/20 border-[3px] border-[#2d2d2d] px-10 py-6 text-2xl font-black italic tracking-tighter text-[#2d2d2d] dark:text-white uppercase outline-none resize-none", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-[#2d2d2d] dark:bg-[#ff4081] text-white py-8 font-black uppercase tracking-[0.6em] shadow-[10px_10px_0_#ffeb3b] hover:bg-[#ff4081] transition-all", children: "SEND TO LOG" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-16 lg:pl-20 animate-reveal text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b-[4px] border-[#2d2d2d]/10 pb-10 text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-[#ffeb3b] dark:bg-[#00e5ff] border-[3px] border-[#2d2d2d] shadow-[5px_5px_0_#2d2d2d] -rotate-3 text-left", children: /* @__PURE__ */ jsx(Quote, { size: 28, className: "text-[#2d2d2d]", fill: "currentColor" }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-black uppercase tracking-[0.8em] text-[#2d2d2d]/30 italic transition-colors", children: [
          "CHAPTER ARCHIVE — ",
          wishes.length
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-16 text-left", children: wishes.slice(0, 4).map((wish) => /* @__PURE__ */ jsxs("div", { className: "relative space-y-8 group text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "p-10 bg-white dark:bg-[#1a1a2e] border-[3px] border-[#2d2d2d] shadow-[10px_10px_0_rgba(0,0,0,0.05)] transition-all text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-4xl md:text-5xl italic tracking-tighter text-[#2d2d2d] dark:text-white font-black uppercase transform -skew-x-6", children: [
          '" ',
          wish.message,
          ' "'
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12 px-8 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[4px] w-20 bg-[#ff4081]/30" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black italic tracking-tighter text-[#2d2d2d]/60 uppercase transform -skew-x-12", children: wish.name })
        ] })
      ] }, wish.id)) })
    ] })
  ] }) }) });
};
const Navbar = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{ icon: Home, label: "Intro", href: "#hero" }, { icon: Heart, label: "Heroes", href: "#couple" }, { icon: Star, label: "History", href: "#story" }, { icon: Calendar, label: "Agenda", href: "#event" }, { icon: Camera, label: "Panels", href: "#gallery" }, { icon: Gift, label: "Tokens", href: "#gift" }, { icon: MessageCircle, label: "Log", href: "#rsvp" }];
  return /* @__PURE__ */ jsx("nav", { className: `fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-75 pointer-events-none"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-[4px] border-[#2d2d2d] dark:border-blue-500 px-8 py-5 shadow-2xl flex items-center gap-6 md:gap-10", children: [
    navItems.map((item, idx) => /* @__PURE__ */ jsxs("a", { href: item.href, className: "group relative text-[#2d2d2d]/30 hover:text-[#2196f3] transition-all", children: [
      /* @__PURE__ */ jsx(item.icon, { size: 22 }),
      /* @__PURE__ */ jsx("span", { className: "absolute -top-16 opacity-0 group-hover:opacity-100 transition-all bg-[#ffeb3b] text-[#2d2d2d] text-[10px] font-black px-5 py-3 border-[3px] border-[#2d2d2d] hidden group-hover:block whitespace-nowrap italic", children: item.label })
    ] }, idx)),
    /* @__PURE__ */ jsx("button", { onClick: toggleTheme, className: "text-[#2d2d2d]/30 hover:text-[#2196f3] transition-all", children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 22 }) : /* @__PURE__ */ jsx(Sun, { size: 22 }) })
  ] }) });
};
const StoryboardTheme = ({ theme, toggleTheme, isOpened, onOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);
  return /* @__PURE__ */ jsxs("div", { className: `storyboard-theme ${theme === "dark" ? "dark" : ""}`, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-[9999] bg-[radial-gradient(#000_2px,transparent_2px)] dark:bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:25px_25px] transition-all duration-1000" }),
    !isOpened && /* @__PURE__ */ jsx(Envelope, { onOpen }),
    /* @__PURE__ */ jsxs("main", { className: `transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpened ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"}`, children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(CoupleProfile, {}),
      /* @__PURE__ */ jsx(LoveStory, {}),
      /* @__PURE__ */ jsx(EventDetails, {}),
      /* @__PURE__ */ jsx(Gallery, {}),
      /* @__PURE__ */ jsx(GiftInfo, {}),
      /* @__PURE__ */ jsx(RSVPForm, {}),
      /* @__PURE__ */ jsx(Wishes, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4", children: [
      /* @__PURE__ */ jsx(MusicController, { isOpened }),
      /* @__PURE__ */ jsx(AutoScrollController, { isOpened })
    ] }),
    /* @__PURE__ */ jsx(Navbar, { theme, toggleTheme }),
    /* @__PURE__ */ jsx(MusicPlayer, {}),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};

const ThemeRegistry = {
  luxury: LuxuryTheme,
  minimalist: MinimalistTheme,
  rustic: Rustic,
  floral: FloralTheme,
  boho: BohoTheme,
  monokrom: MonokromTheme,
  vibrant: VibrantTheme,
  "dark-elegant": DarkElegantTheme,
  royal: RoyalTheme,
  islamic: IslamicTheme,
  vintage: VintageTheme,
  storyboard: StoryboardTheme
};
const AVAILABLE_THEMES = [
  {
    id: "luxury",
    name: "Luxury Premium",
    preview: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
    description: "Desain elegan dengan glassmorphism dan animasi mewah."
  },
  {
    id: "minimalist",
    name: "Minimalist Clean",
    preview: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    description: "Bersih, modern, dan fokus pada tipografi yang indah."
  },
  {
    id: "rustic",
    name: "Rustic Earth",
    preview: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    description: "Tekstur kayu, warna bumi, dan nuansa alam yang hangat."
  },
  {
    id: "floral",
    name: "Floral Bloom",
    preview: "https://images.unsplash.com/photo-1549646876-0f8982468d6c?q=80&w=800&auto=format&fit=crop",
    description: "Ilustrasi bunga cat air yang romantis dan lembut."
  },
  {
    id: "boho",
    name: "Bohemian Soul",
    preview: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?q=80&w=600&auto=format&fit=crop",
    description: "Etnik, macrame, dan palet warna terracotta yang berjiwa bebas."
  },
  {
    id: "monokrom",
    name: "Modern Monokrom",
    preview: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
    description: "Minimalis kontras tinggi dengan tipografi bold yang urban."
  },
  {
    id: "vibrant",
    name: "Vibrant / Fun",
    preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
    description: "Energi pop-art, warna cerah, dan animasi yang menyenangkan."
  },
  {
    id: "dark-elegant",
    name: "Dark Elegant",
    preview: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    description: "Kemewahan emerald dan emas dalam balutan dark mode premium."
  },
  {
    id: "royal",
    name: "Royal Heritage",
    preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
    description: "Keagungan warisan budaya dengan motif Batik dan warna emas."
  },
  {
    id: "islamic",
    name: "Islamic Modern",
    preview: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop",
    description: "Nuansa spiritual yang sejuk dengan pola Arabesque modern."
  },
  {
    id: "vintage",
    name: "Vintage / Retro",
    preview: "https://images.unsplash.com/photo-1455134168668-40a762acc615?q=80&w=600&auto=format&fit=crop",
    description: "Nostalgia fotografi analog dan tekstur kertas tua yang klasik."
  },
  {
    id: "storyboard",
    name: "Storyboard",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
    description: "Ceritakan perjalanan cinta Anda dalam format komik yang artistik."
  }
];

export { AVAILABLE_THEMES as A, ThemeRegistry as T };
