import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_R-gB5CVe.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, UserPlus, ArrowRight, LogIn, Smartphone, Lock, Loader2, Sparkles, ChevronRight, Music, Image, MessageSquare, Calendar, ShieldCheck, ExternalLink, Heart, Zap, Minus, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { A as AVAILABLE_THEMES } from '../chunks/index_DbNV1jv1.mjs';
export { renderers } from '../renderers.mjs';

const RegisterModal = ({ isOpen, onClose, selectedTheme }) => {
  const [view, setView] = useState("selection");
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    slug: ""
  });
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  if (!isVisible) return null;
  const handleShowLogin = () => {
    setDirection(1);
    setView("auth");
    setError("");
  };
  const handleBackToSelection = () => {
    setDirection(-1);
    setView("selection");
    setError("");
  };
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const endpoint = "/api/auth/login";
      const payload = { phone: formData.phone, password: formData.password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else if (data.role === "user") {
          window.location.href = data.invitationId ? `/dashboard/manage/${data.invitationId}` : "/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { 
                        transform: translateX(0); 
                    }
                    25% { 
                        transform: translateX(-5px); 
                    }
                    75% { 
                        transform: translateX(5px); 
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }

                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            ` }),
    /* @__PURE__ */ jsxs("div", { className: `fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`,
          onClick: handleClose
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: `relative w-full max-w-lg overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white shadow-2xl border border-pink-100 max-h-[95vh] overflow-y-auto transition-all duration-300 ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClose,
            className: "absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10",
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4 sm:h-5 sm:w-5 text-slate-400" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "p-0", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, custom: direction, children: view === "selection" ? /* @__PURE__ */ jsxs(
          motion.div,
          {
            custom: direction,
            initial: { x: direction > 0 ? -300 : 300, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: direction > 0 ? -300 : 300, opacity: 0 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-8 md:p-12",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-8 sm:mb-10", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-3xl flex items-center justify-center p-2 mb-4 sm:mb-6", children: /* @__PURE__ */ jsx("img", { src: "/logo-vowly.png", alt: "Vowly Logo", className: "w-full h-full object-contain" }) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-serif italic font-bold mb-2", children: "Abadikan Momen Cinta" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-slate-500 px-2", children: "Pilih langkah Anda untuk memulai kebahagiaan." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `/register${selectedTheme ? `?theme=${selectedTheme}` : ""}`,
                    className: "w-full py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-lg shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group",
                    children: [
                      /* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4 sm:h-5 sm:w-5" }),
                      "Belum Punya Akun? Daftar",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleShowLogin,
                    className: "w-full py-4 sm:py-5 bg-white text-pink-500 border-2 border-pink-100 rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm hover:bg-pink-50 hover:border-pink-200 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4 sm:h-5 sm:w-5" }),
                      "Sudah Punya Akun? Masuk"
                    ]
                  }
                )
              ] })
            ]
          },
          "selection"
        ) : /* @__PURE__ */ jsxs(
          motion.div,
          {
            custom: direction,
            initial: { x: direction > 0 ? 300 : -300, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: direction > 0 ? 300 : -300, opacity: 0 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-8 md:p-12",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-8 sm:mb-10", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-3xl flex items-center justify-center p-2 mb-4 sm:mb-6", children: /* @__PURE__ */ jsx("img", { src: "/logo-vowly.png", alt: "Vowly Logo", className: "w-full h-full object-contain" }) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-serif italic font-bold mb-2", children: "Selamat Datang Kembali" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-slate-500 px-2", children: "Masuk untuk mengelola undangan Anda." })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-5", children: [
                error && /* @__PURE__ */ jsx("div", { className: "p-3 sm:p-4 bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl border border-red-100 animate-shake", children: error }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Nomor HP (WhatsApp)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                    /* @__PURE__ */ jsx(Smartphone, { className: "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "tel",
                        name: "phone",
                        required: true,
                        value: formData.phone,
                        onChange: handleChange,
                        placeholder: "081234567890",
                        className: "w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-pink-50/50 border border-pink-100 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Password" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                    /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "password",
                        name: "password",
                        required: true,
                        value: formData.password,
                        onChange: handleChange,
                        placeholder: "••••••••",
                        className: "w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-pink-50/50 border border-pink-100 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isLoading,
                    className: "w-full py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold tracking-widest uppercase text-xs sm:text-sm shadow-lg shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer",
                    children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 sm:h-5 sm:w-5 animate-spin" }) : "MASUK KE DASHBOARD"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 sm:mt-8 text-center", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleBackToSelection,
                  className: "text-pink-500 text-xs sm:text-sm font-bold hover:underline transition-all flex items-center justify-center gap-2 mx-auto",
                  children: [
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 rotate-180" }),
                    " Kembali ke pilihan"
                  ]
                }
              ) })
            ]
          },
          "auth"
        ) }) })
      ] })
    ] })
  ] });
};

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden transition-all hover:shadow-md", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "w-full px-6 md:px-10 py-5 md:py-8 flex items-center justify-between text-left group",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors", children: q }),
          /* @__PURE__ */ jsx("div", { className: `w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all ${isOpen ? "rotate-180 bg-primary/10 text-primary" : ""}`, children: isOpen ? /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4 md:h-5 md:w-5" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 md:h-5 md:w-5" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.3, ease: "easeInOut" },
        children: /* @__PURE__ */ jsxs("div", { className: "px-6 md:px-10 pb-6 md:pb-10 pt-0", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-full bg-slate-100 dark:bg-white/5 mb-6 md:mb-8" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-lg text-slate-500 dark:text-slate-300 leading-relaxed italic font-serif", children: [
            '"',
            a,
            '"'
          ] })
        ] })
      }
    ) })
  ] });
};
const LandingPage = () => {
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState();
  const [currentSlide, setCurrentSlide] = React.useState(AVAILABLE_THEMES.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileCarouselRef = React.useRef(null);
  const desktopCarouselRef = React.useRef(null);
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const isDesktop = window.innerWidth >= 1024;
      const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
      if (ref.current) {
        const cardWidth = isDesktop ? 304 : 177;
        const nextSlide = currentSlide + 1;
        ref.current.scrollTo({
          left: nextSlide * cardWidth,
          behavior: "smooth"
        });
        setCurrentSlide(nextSlide);
        if (nextSlide >= AVAILABLE_THEMES.length * 2) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.scrollLeft = AVAILABLE_THEMES.length * cardWidth;
              setCurrentSlide(AVAILABLE_THEMES.length);
            }
          }, 500);
        }
      }
    }, 3e3);
    return () => clearInterval(interval);
  }, [currentSlide]);
  React.useEffect(() => {
    const mobileRef = mobileCarouselRef.current;
    const desktopRef = desktopCarouselRef.current;
    if (mobileRef) {
      mobileRef.scrollLeft = AVAILABLE_THEMES.length * 177;
    }
    if (desktopRef) {
      desktopRef.scrollLeft = AVAILABLE_THEMES.length * 304;
    }
  }, []);
  const scrollToPrev = () => {
    const isDesktop = window.innerWidth >= 1024;
    const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
    const cardWidth = isDesktop ? 304 : 177;
    if (ref.current) {
      const prevSlide = currentSlide - 1;
      ref.current.scrollTo({
        left: prevSlide * cardWidth,
        behavior: "smooth"
      });
      setCurrentSlide(prevSlide);
      if (prevSlide < AVAILABLE_THEMES.length) {
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollLeft = (AVAILABLE_THEMES.length * 2 - 1) * cardWidth;
            setCurrentSlide(AVAILABLE_THEMES.length * 2 - 1);
          }
        }, 500);
      }
    }
  };
  const scrollToNext = () => {
    const isDesktop = window.innerWidth >= 1024;
    const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
    const cardWidth = isDesktop ? 304 : 177;
    if (ref.current) {
      const nextSlide = currentSlide + 1;
      ref.current.scrollTo({
        left: nextSlide * cardWidth,
        behavior: "smooth"
      });
      setCurrentSlide(nextSlide);
      if (nextSlide >= AVAILABLE_THEMES.length * 2) {
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollLeft = AVAILABLE_THEMES.length * cardWidth;
            setCurrentSlide(AVAILABLE_THEMES.length);
          }
        }, 500);
      }
    }
  };
  const openRegister = (themeId) => {
    setSelectedTheme(themeId);
    setIsRegisterOpen(true);
  };
  const activeIndex = currentSlide % AVAILABLE_THEMES.length;
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white to-pink-50/30 text-slate-900 selection:bg-pink-200/50 selection:text-pink-700", children: [
    /* @__PURE__ */ jsx("nav", { className: "fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/80 border-b border-pink-100/50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: "/logo-vowly.png", alt: "Vowly Logo", className: "h-8 md:h-10 w-auto object-contain" }),
        /* @__PURE__ */ jsx("span", { className: "font-serif text-xl md:text-2xl italic font-bold tracking-tighter text-pink-600", children: "Vowly" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm font-medium tracking-wide", children: [
        /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-primary transition-colors", children: "Fitur" }),
        /* @__PURE__ */ jsx("a", { href: "#templates", className: "hover:text-primary transition-colors", children: "Template" }),
        /* @__PURE__ */ jsx("a", { href: "#pricing", className: "hover:text-primary transition-colors", children: "Harga" }),
        /* @__PURE__ */ jsx("a", { href: "#faq", className: "hover:text-primary transition-colors", children: "FAQ" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openRegister(),
            className: "px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-pink-200 transition-all active:scale-95 cursor-pointer",
            children: "Buat Undangan"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openRegister(),
            className: "px-4 py-2 text-xs bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all active:scale-95 cursor-pointer",
            children: "Buat"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
            className: "p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors",
            "aria-label": "Menu",
            children: /* @__PURE__ */ jsxs("div", { className: "w-6 h-5 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: `w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}` }),
              /* @__PURE__ */ jsx("span", { className: `w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}` }),
              /* @__PURE__ */ jsx("span", { className: `w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}` })
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-[90] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: () => setIsMobileMenuOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed top-16 left-0 right-0 bg-white dark:bg-slate-900 z-[95] md:hidden transition-all duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`,
        style: {
          boxShadow: isMobileMenuOpen ? "0 10px 40px rgba(0, 0, 0, 0.15)" : "none"
        },
        children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "block py-3 text-slate-900 dark:text-white font-semibold text-lg hover:text-primary transition-colors",
              onClick: () => setIsMobileMenuOpen(false),
              children: "Beranda"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#templates",
              className: "block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors",
              onClick: () => setIsMobileMenuOpen(false),
              children: "Tema"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#features",
              className: "block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors",
              onClick: () => setIsMobileMenuOpen(false),
              children: "Fitur"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#pricing",
              className: "block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors",
              onClick: () => setIsMobileMenuOpen(false),
              children: "Harga"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#faq",
              className: "block py-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors",
              onClick: () => setIsMobileMenuOpen(false),
              children: "FAQ"
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "relative pt-20 pb-12 md:pt-48 md:pb-40 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-300/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-200/20 rounded-full blur-[120px] -ml-40 -mb-40" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 text-center space-y-4 md:space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-pink-50 rounded-full border border-pink-100 animate-reveal", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 md:h-4 md:w-4 text-pink-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-xs font-bold tracking-widest uppercase text-pink-600", children: "Digital Wedding Invitation" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "font-serif text-3xl sm:text-5xl md:text-8xl lg:text-[10rem] leading-[0.95] md:leading-[0.85] tracking-tighter italic animate-reveal text-gray-800", style: { animationDelay: "200ms" }, children: [
          "Abadikan Momen ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-pink-500 italic", children: "Cinta" }),
          " Selamanya"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto text-slate-500 dark:text-slate-300 text-sm sm:text-base md:text-xl animate-reveal leading-relaxed px-2", style: { animationDelay: "400ms" }, children: "Buat undangan pernikahan digital yang elegan, mewah, dan interaktif hanya dalam hitungan menit." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 animate-reveal px-4", style: { animationDelay: "600ms" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openRegister(),
              className: "w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury hover:shadow-2xl hover:shadow-pink-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
              children: [
                "Mulai Buat Sekarang ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("a", { href: "#templates", className: "w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-white border border-pink-200 rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury transition-all hover:bg-pink-50 text-center text-pink-600", children: "Lihat Demo" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "features", className: "py-12 md:py-40 bg-pink-50/50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mb-8 md:mb-24", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-serif text-2xl sm:text-4xl md:text-6xl text-slate-900 dark:text-white italic mb-3 md:mb-6", children: [
          "Fitur Premium Untuk ",
          /* @__PURE__ */ jsx("br", {}),
          " Hari Bahagia Anda"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-sm md:text-lg", children: "Kami menyediakan segala yang Anda butuhkan untuk membuat undangan digital yang sempurna." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8", children: [
        { icon: Smartphone, title: "Mobile Friendly", desc: "Tampilan responsif yang terlihat sempurna di semua perangkat." },
        { icon: Music, title: "Background Music", desc: "Pilih lagu favorit untuk memberikan suasana romantis." },
        { icon: Image, title: "Gallery & Video", desc: "Tampilkan foto pre-wedding terbaik dalam galeri berkualitas." },
        { icon: MessageSquare, title: "RSVP & Wishes", desc: "Kelola konfirmasi kehadiran dan terima doa restu langsung." },
        { icon: Calendar, title: "Add to Calendar", desc: "Tamu dapat menyimpan jadwal ke Google Calendar atau iCal." },
        { icon: ShieldCheck, title: "Digital Greeting", desc: "Fitur nama tamu khusus untuk setiap link yang dibagikan." }
      ].map((feature, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-10 rounded-xl md:rounded-[2.5rem] border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-2 transition-all duration-500 group backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 md:w-16 md:h-16 bg-pink-50 rounded-lg md:rounded-2xl flex items-center justify-center text-pink-500 mb-3 md:mb-8 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500", children: /* @__PURE__ */ jsx(feature.icon, { className: "h-5 w-5 md:h-8 md:w-8" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xs md:text-xl font-bold mb-1.5 md:mb-4 leading-tight", children: feature.title }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-[10px] md:text-base leading-snug md:leading-relaxed", children: feature.desc })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "templates", className: "py-12 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-8 md:mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-7xl italic mb-3 md:mb-6", children: "Pilih Desain Impian Anda" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-sm md:text-lg", children: "Berbagai pilihan tema premium dirancang khusus untuk membuat undangan Anda terlihat unik." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: mobileCarouselRef,
              className: "overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2",
              style: { scrollbarWidth: "none", msOverflowStyle: "none" },
              children: /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: [...AVAILABLE_THEMES, ...AVAILABLE_THEMES, ...AVAILABLE_THEMES].map((theme, idx) => /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-[165px] snap-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800/60 rounded-2xl p-3 shadow-lg border border-slate-100 dark:border-white/10", children: [
                /* @__PURE__ */ jsx("div", { className: "relative aspect-square overflow-hidden rounded-xl mb-2.5 shadow-md", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: theme.preview,
                    alt: theme.name,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsx("h3", { className: "text-center font-serif text-sm font-bold mb-2 text-slate-900 dark:text-white leading-tight", children: theme.name }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `/demo-${theme.id}`,
                      target: "_blank",
                      className: "w-full py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:shadow-lg transition-colors",
                      children: [
                        "Lihat Demo ",
                        /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openRegister(theme.id),
                      className: "w-full py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer",
                      children: "Pilih Tema"
                    }
                  )
                ] })
              ] }) }, `${theme.id}-${idx}`)) })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-3 mt-5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: scrollToPrev,
                className: "w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-pink-200 transition-all active:scale-95",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 rotate-180" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: AVAILABLE_THEMES.map((_, idx) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-2 rounded-full transition-all ${idx === activeIndex ? "bg-pink-500 w-6" : "bg-pink-200 w-2"}`
              },
              idx
            )) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: scrollToNext,
                className: "w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-pink-200 transition-all active:scale-95",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-6", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => openRegister(),
            className: "px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-pink-200 transition-colors text-sm flex items-center gap-2 mx-auto",
            children: [
              /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" }),
              " Lihat Semua Tema"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "relative group/carousel", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: desktopCarouselRef,
            className: "overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2",
            style: { scrollbarWidth: "none", msOverflowStyle: "none" },
            children: /* @__PURE__ */ jsx("div", { className: "flex gap-6 px-10", children: [...AVAILABLE_THEMES, ...AVAILABLE_THEMES, ...AVAILABLE_THEMES].map((theme, idx) => /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-[280px] snap-center group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800/60 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500", children: [
              /* @__PURE__ */ jsx("div", { className: "relative aspect-square overflow-hidden rounded-[1.5rem] mb-6 shadow-lg", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: theme.preview,
                  alt: theme.name,
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "text-center px-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl font-bold mb-2 text-slate-900 dark:text-white leading-tight", children: theme.name }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-sm mb-6 leading-snug", children: theme.description })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `/demo-${theme.id}`,
                    target: "_blank",
                    className: "w-full py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95",
                    children: [
                      "Lihat Demo ",
                      /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => openRegister(theme.id),
                    className: "w-full py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95",
                    children: "Pilih Tema"
                  }
                )
              ] })
            ] }) }, `${theme.id}-${idx}`)) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-6 mt-12", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: scrollToPrev,
              className: "w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-xl hover:shadow-pink-200 transition-all active:scale-90 hover:scale-105",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 rotate-180" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2.5 px-6 py-3 bg-pink-50 rounded-full", children: AVAILABLE_THEMES.map((_, idx) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const isDesktop = window.innerWidth >= 1024;
                const ref = isDesktop ? desktopCarouselRef : mobileCarouselRef;
                if (ref.current) {
                  const cardWidth = isDesktop ? 304 : 177;
                  const targetSlide = AVAILABLE_THEMES.length + idx;
                  ref.current.scrollTo({
                    left: targetSlide * cardWidth,
                    behavior: "smooth"
                  });
                  setCurrentSlide(targetSlide);
                }
              },
              className: `h-2.5 rounded-full transition-all duration-500 ${idx === activeIndex ? "bg-pink-500 w-10" : "bg-pink-200 w-2.5 hover:bg-pink-300"}`
            },
            idx
          )) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: scrollToNext,
              className: "w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-xl hover:shadow-pink-200 transition-all active:scale-90 hover:scale-105",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6" })
            }
          )
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { id: "pricing", className: "py-12 md:py-40", children: [
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-7xl italic mb-8 md:mb-20", children: "Pilih Paket Sesuai Kebutuhan" }),
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 items-stretch px-2 md:px-0", children: [
          {
            id: "lite",
            name: "Lite",
            price: "Gratis",
            priceNum: 0,
            originalPrice: "50k",
            features: ["1 Tema Pilihan", "Masa Aktif 3 Hari", "RSVP Dasar", "Maksimal 20 Tamu"],
            color: "slate",
            badge: "Trial"
          },
          {
            id: "basic",
            name: "Basic",
            price: "49k",
            priceNum: 49e3,
            originalPrice: "99k",
            features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan Dasar", "Galeri Foto (5)"],
            color: "blue",
            badge: "Hemat"
          },
          {
            id: "premium",
            name: "Premium",
            price: "149k",
            priceNum: 149e3,
            originalPrice: "249k",
            features: ["Semua Tema Pilihan", "Masa Aktif Selamanya", "RSVP & Ucapan Pro", "Galeri Foto & Video", "Musik Latar Custom"],
            color: "pink",
            badge: "Populer"
          },
          {
            id: "royal",
            name: "Royal",
            price: "299k",
            priceNum: 299e3,
            originalPrice: "499k",
            features: ["Semua Fitur Premium+", "Domain Custom .com*", "QR Code Check-in", "Prioritas Support", "Desain Eksklusif"],
            color: "amber",
            badge: "VIP"
          }
        ].map((pkg) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `group relative p-4 md:p-10 rounded-2xl md:rounded-[3rem] border transition-all duration-500 flex flex-col items-center text-center overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${pkg.id === "premium" ? "bg-gradient-to-br from-pink-500 to-pink-600 border-transparent text-white shadow-xl shadow-pink-200 lg:scale-[1.05]" : "bg-white border-pink-100 text-slate-900 shadow-lg"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: `absolute top-0 right-0 px-2.5 py-1 md:px-5 md:py-2 rounded-bl-xl md:rounded-bl-2xl text-[7px] md:text-[10px] font-black tracking-widest uppercase ${pkg.id === "premium" ? "bg-white/20" : "bg-pink-50 text-pink-500"}`, children: pkg.badge }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-4 md:mb-8 ${pkg.id === "premium" ? "bg-white/20" : "bg-pink-50 text-pink-600"}`, children: pkg.name }),
              /* @__PURE__ */ jsxs("div", { className: "mb-4 md:mb-10", children: [
                /* @__PURE__ */ jsxs("div", { className: `text-[9px] md:text-sm font-bold line-through mb-0.5 md:mb-1 ${pkg.id === "premium" ? "text-white/50 decoration-white/40" : "text-slate-300 decoration-pink-300"}`, children: [
                  "Rp ",
                  pkg.originalPrice
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 md:gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-lg md:text-5xl font-black", children: pkg.priceNum === 0 ? "Gratis" : pkg.price }),
                  pkg.priceNum > 0 && /* @__PURE__ */ jsx("span", { className: `text-[8px] md:text-sm font-bold opacity-70`, children: "/unit" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 md:space-y-4 text-left w-full mb-6 md:mb-12", children: pkg.features.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: `flex items-start gap-1.5 md:gap-3 text-[9px] md:text-sm ${pkg.id === "premium" ? "text-white/90" : "text-slate-600"}`, children: [
                /* @__PURE__ */ jsx(Zap, { className: `h-2.5 w-2.5 md:h-4 md:w-4 flex-shrink-0 mt-0.5 ${pkg.id === "premium" ? "text-white" : "text-pink-500"}` }),
                /* @__PURE__ */ jsx("span", { className: "leading-snug md:leading-tight", children: feat })
              ] }, i)) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => openRegister(),
                  className: `w-full py-2.5 md:py-4 text-[10px] md:text-base rounded-xl md:rounded-2xl font-bold transition-all mt-auto cursor-pointer ${pkg.id === "premium" ? "bg-white text-pink-600 hover:shadow-xl hover:scale-[1.02]" : "border border-pink-200 text-pink-600 hover:bg-pink-50"}`,
                  children: [
                    "Pilih ",
                    pkg.name
                  ]
                }
              )
            ]
          },
          pkg.id
        )) })
      ] }),
      /* @__PURE__ */ jsx(
        RegisterModal,
        {
          isOpen: isRegisterOpen,
          onClose: () => setIsRegisterOpen(false),
          selectedTheme
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { id: "faq", className: "py-12 md:py-40 bg-pink-50/50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-12 md:mb-24", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-7xl italic mb-3 md:mb-6", children: "Pertanyaan Sering Diajukan" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-sm md:text-lg", children: "Temukan jawaban untuk pertanyaan yang paling sering ditanyakan mengenai Vowly." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto space-y-4", children: [
        {
          q: "Apa itu Vowly?",
          a: "Vowly adalah platform pembuatan undangan pernikahan digital yang memudahkan Anda membuat undangan elegan dan interaktif dalam hitungan menit."
        },
        {
          q: "Bagaimana cara membuat undangan digital?",
          a: "Cukup pilih tema yang Anda sukai, lengkapi data pendaftaran, selesaikan pembayaran (jika berbayar), dan undangan Anda siap dikelola dari dashboard."
        },
        {
          q: "Apakah saya bisa mengubah tema setelah memilih?",
          a: "Ya, Anda dapat mengubah tema kapan saja melalui dashboard admin tanpa kehilangan data yang sudah diisi."
        },
        {
          q: "Apakah ada biaya tambahan untuk fitur premium?",
          a: "Tidak ada. Sekali bayar untuk paket Premium atau Royal, Anda mendapatkan akses ke semua fitur yang dijanjikan tanpa biaya tersembunyi."
        },
        {
          q: "Berapa lama undangan saya akan aktif?",
          a: "Untuk paket Lite aktif selama 3 hari. Paket Basic aktif 1 tahun, sedangkan paket Premium dan Royal aktif selamanya."
        },
        {
          q: "Bagaimana cara membagikan undangan?",
          a: "Anda akan mendapatkan link khusus yang bisa dibagikan langsung melalui WhatsApp, Instagram, atau media sosial lainnya."
        },
        {
          q: "Apakah tamu bisa mengirim ucapan dan doa?",
          a: "Tentu saja! Fitur RSVP dan Digital Guestbook memungkinkan tamu memberikan doa restu secara langsung di undangan."
        },
        {
          q: "Bisakah saya menambahkan musik sendiri?",
          a: "Ya, untuk paket Premium Anda dapat memilih dari daftar lagu kami atau mengunggah musik favorit Anda sendiri."
        }
      ].map((item, idx) => /* @__PURE__ */ jsx(FAQItem, { q: item.q, a: item.a }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "py-10 md:py-20 border-t border-pink-100", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:space-y-4 text-center md:text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: "/logo-vowly.png", alt: "Vowly Logo", className: "h-6 md:h-8 w-auto object-contain" }),
            /* @__PURE__ */ jsx("span", { className: "font-serif text-lg md:text-xl italic font-bold text-pink-600", children: "Vowly" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-slate-300 text-xs md:text-sm max-w-xs", children: "Mewujudkan undangan impian Anda menjadi kenyataan digital." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 md:gap-10 text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "Privacy" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "Terms" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-primary transition-colors", children: "Contact" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 md:mt-20 pt-6 md:pt-10 border-t border-slate-50 dark:border-white/[0.02] text-center text-[9px] md:text-[10px] text-slate-400 tracking-widest uppercase", children: "© 2026 Vowly. Created with love by Fahmi" })
    ] }) })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Vowly - Buat Undangan Digital Pernikahan Mewah & Terjangkau", "description": "Platform pembuatan undangan pernikahan digital dengan desain premium, fitur lengkap, dan aktivasi otomatis.", "forceLight": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LandingPage", LandingPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Landing/LandingPage", "client:component-export": "default" })} ` })}`;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/index.astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
