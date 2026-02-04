import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DcQtjN1d.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import { X, Heart, User, Smartphone, Globe, Lock, Loader2, Sparkles, ChevronRight, Music, Image, MessageSquare, Calendar, ShieldCheck, ExternalLink, Zap, Star } from 'lucide-react';
import { A as AVAILABLE_THEMES } from '../chunks/index_CLWR17k7.mjs';
export { renderers } from '../renderers.mjs';

const RegisterModal = ({ isOpen, onClose, selectedTheme }) => {
  const [mode, setMode] = useState("register");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    slug: ""
  });
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "register" ? { ...formData, themeId: selectedTheme } : { phone: formData.phone, password: formData.password };
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
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-950/60 backdrop-blur-md", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-lg animate-reveal overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-white/5", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10",
          children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-slate-400" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "p-8 md:p-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6", children: /* @__PURE__ */ jsx(Heart, { className: "h-8 w-8 animate-pulse" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif italic font-bold mb-2", children: mode === "register" ? "Mulailah Kebahagiaan Anda" : "Selamat Datang Kembali" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400", children: mode === "register" ? "Daftar sekarang untuk membuat undangan digital impian Anda." : "Masuk untuk mengelola undangan Anda." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          error && /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30", children: error }),
          mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Nama Lengkap" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "fullName",
                  required: true,
                  value: formData.fullName,
                  onChange: handleChange,
                  placeholder: "Nama Anda",
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Nomor HP (WhatsApp)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  name: "phone",
                  required: true,
                  value: formData.phone,
                  onChange: handleChange,
                  placeholder: "081234567890",
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                }
              )
            ] })
          ] }),
          mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Subdomain / Slug" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Globe, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "slug",
                  required: true,
                  value: formData.slug,
                  onChange: handleChange,
                  placeholder: "nama-pasangan",
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 ml-1 mt-1 italic", children: "Hasilnya akan: vowly.com/nama-pasangan" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  name: "password",
                  required: true,
                  value: formData.password,
                  onChange: handleChange,
                  placeholder: "••••••••",
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isLoading,
              className: "w-full py-5 bg-primary text-white rounded-2xl font-bold tracking-widest uppercase shadow-luxury hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3",
              children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : mode === "register" ? "DAFTAR SEKARANG" : "MASUK KE DASHBOARD"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
          mode === "register" ? "Sudah memiliki akun?" : "Belum memiliki akun?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMode(mode === "register" ? "login" : "register"),
              className: "text-primary font-bold hover:underline",
              children: mode === "register" ? "Masuk di sini" : "Daftar di sini"
            }
          )
        ] }) })
      ] })
    ] })
  ] });
};

const LandingPage = () => {
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState();
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  const openRegister = (themeId) => {
    setSelectedTheme(themeId);
    setIsRegisterOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-accent/30 selection:text-primary", children: [
    /* @__PURE__ */ jsx("nav", { className: "fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse" }),
        /* @__PURE__ */ jsx("span", { className: "font-serif text-xl md:text-2xl italic font-bold tracking-tighter", children: "Vowly" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm font-medium tracking-wide", children: [
        /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-primary transition-colors", children: "Fitur" }),
        /* @__PURE__ */ jsx("a", { href: "#templates", className: "hover:text-primary transition-colors", children: "Template" }),
        /* @__PURE__ */ jsx("a", { href: "#pricing", className: "hover:text-primary transition-colors", children: "Harga" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openRegister(),
            className: "px-6 py-2.5 bg-primary text-white rounded-full hover:shadow-lg transition-all active:scale-95 cursor-pointer",
            children: "Buat Undangan"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => openRegister(),
          className: "md:hidden px-4 py-2 text-xs bg-primary text-white rounded-full hover:shadow-lg transition-all active:scale-95 cursor-pointer",
          children: "Buat"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative pt-20 pb-12 md:pt-48 md:pb-40 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent/10 rounded-full blur-[120px] -ml-40 -mb-40" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 text-center space-y-4 md:space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10 animate-reveal", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 md:h-4 md:w-4 text-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400", children: "Digital Wedding Invitation" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "font-serif text-3xl sm:text-5xl md:text-8xl lg:text-[10rem] leading-[0.95] md:leading-[0.85] tracking-tighter italic animate-reveal", style: { animationDelay: "200ms" }, children: [
          "Abadikan Momen ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-primary italic", children: "Cinta" }),
          " Selamanya"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto text-slate-500 dark:text-slate-300 text-sm sm:text-base md:text-xl animate-reveal leading-relaxed px-2", style: { animationDelay: "400ms" }, children: "Buat undangan pernikahan digital yang elegan, mewah, dan interaktif hanya dalam hitungan menit." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 animate-reveal px-4", style: { animationDelay: "600ms" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openRegister(),
              className: "w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
              children: [
                "Mulai Buat Sekarang ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("a", { href: "#templates", className: "w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl md:rounded-2xl text-sm md:text-base font-bold tracking-luxury transition-all hover:bg-slate-50 dark:hover:bg-white/10 text-center", children: "Lihat Demo" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "features", className: "py-12 md:py-40 bg-slate-50/50 dark:bg-white/[0.02]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
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
      ].map((feature, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800/40 p-4 md:p-10 rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 md:w-16 md:h-16 bg-primary/5 dark:bg-primary/20 rounded-lg md:rounded-2xl flex items-center justify-center text-primary mb-3 md:mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500", children: /* @__PURE__ */ jsx(feature.icon, { className: "h-5 w-5 md:h-8 md:w-8" }) }),
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
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2", style: { scrollbarWidth: "none", msOverflowStyle: "none" }, children: /* @__PURE__ */ jsx("div", { className: "flex gap-4 px-2", children: AVAILABLE_THEMES.map((theme) => /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-[280px] md:w-[320px] snap-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-4 shadow-xl border border-slate-100 dark:border-white/10", children: [
            /* @__PURE__ */ jsx("div", { className: "relative aspect-[9/16] overflow-hidden rounded-2xl mb-4 shadow-lg", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: theme.preview,
                alt: theme.name,
                className: "w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsx("h3", { className: "text-center font-serif text-lg font-bold mb-3 text-slate-900 dark:text-white", children: theme.name }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `/demo-${theme.id}`,
                  target: "_blank",
                  className: "w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors",
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
                  className: "w-full py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer",
                  children: "Pilih Tema"
                }
              )
            ] })
          ] }) }, theme.id)) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-4 mt-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const container = document.querySelector(".overflow-x-auto");
                  if (container) container.scrollBy({ left: -300, behavior: "smooth" });
                },
                className: "w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all active:scale-95",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 rotate-180" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: AVAILABLE_THEMES.map((_, idx) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const container = document.querySelector(".overflow-x-auto");
                  if (container) container.scrollTo({ left: idx * 300, behavior: "smooth" });
                },
                className: "w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors"
              },
              idx
            )) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const container = document.querySelector(".overflow-x-auto");
                  if (container) container.scrollBy({ left: 300, behavior: "smooth" });
                },
                className: "w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all active:scale-95",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => openRegister(),
            className: "px-8 py-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-2xl font-bold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors",
            children: "Lihat Semua Tema"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:grid lg:grid-cols-2 gap-8 xl:gap-16", children: AVAILABLE_THEMES.map((theme) => /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-800/40 rounded-[3rem] p-8 shadow-xl border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500", children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-[9/16] overflow-hidden rounded-3xl mb-8 shadow-2xl", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: theme.preview,
            alt: theme.name,
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          }
        ) }),
        /* @__PURE__ */ jsx("h3", { className: "text-center font-serif text-3xl font-bold mb-3 text-slate-900 dark:text-white", children: theme.name }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-slate-500 dark:text-slate-300 mb-8", children: theme.description }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/demo-${theme.id}`,
              target: "_blank",
              className: "w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-xl",
              children: [
                "Lihat Demo ",
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-5 w-5" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openRegister(theme.id),
              className: "w-full py-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-white/10 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all cursor-pointer",
              children: "Pilih Tema"
            }
          )
        ] })
      ] }) }, theme.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { id: "pricing", className: "py-12 md:py-40", children: [
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl sm:text-4xl md:text-7xl italic mb-8 md:mb-20", children: "Pilih Paket Sesuai Kebutuhan" }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-2 gap-3 md:gap-8 items-stretch", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800/40 p-4 md:p-12 rounded-2xl md:rounded-[3.5rem] border border-slate-100 dark:border-white/10 flex flex-col items-center backdrop-blur-sm shadow-xl", children: [
            /* @__PURE__ */ jsx("span", { className: "px-2 py-1 md:px-4 md:py-1.5 bg-slate-100 dark:bg-white/10 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-3 md:mb-8", children: "Basic" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl md:text-5xl font-bold mb-1 md:mb-4 text-slate-900 dark:text-white", children: "Gratis" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-300 text-[10px] md:text-base mb-4 md:mb-10 text-center leading-tight", children: "Coba fitur dasar" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 md:space-y-4 text-left w-full mb-4 md:mb-12", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm text-slate-600 dark:text-slate-200", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Desain Standar" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm text-slate-600 dark:text-slate-200", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "RSVP Management" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm text-slate-600 dark:text-slate-200", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Aktif 7 Hari" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm opacity-20 dark:opacity-40 line-through grayscale", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 md:h-4 md:w-4 text-slate-300 flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Music" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm opacity-20 dark:opacity-40 line-through grayscale", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 md:h-4 md:w-4 text-slate-300 flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Gallery" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("a", { href: "/admin", className: "w-full py-2.5 md:py-4 text-xs md:text-base rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all mt-auto text-slate-900 dark:text-slate-200", children: "Pilih" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-primary p-4 md:p-12 rounded-2xl md:rounded-[3.5rem] text-white flex flex-col items-center relative overflow-hidden shadow-2xl scale-[1.02] md:scale-105", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-white/20 px-2 md:px-6 py-0.5 md:py-2 rounded-bl-xl md:rounded-bl-3xl text-[8px] md:text-[10px] font-black tracking-widest uppercase", children: "Best" }),
            /* @__PURE__ */ jsx("span", { className: "px-2 py-1 md:px-4 md:py-1.5 bg-white/20 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-3 md:mb-8", children: "Premium" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl md:text-5xl font-bold mb-1 md:mb-4", children: "149K" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/70 text-[10px] md:text-base mb-4 md:mb-10 text-center leading-tight", children: "Fitur lengkap" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 md:space-y-4 text-left w-full mb-4 md:mb-12", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 md:h-4 md:w-4 fill-white flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Semua Basic" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 md:h-4 md:w-4 fill-white flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Music" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 md:h-4 md:w-4 fill-white flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Gallery Unlimited" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 md:h-4 md:w-4 fill-white flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Wedding Gift" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5 md:gap-3 text-[10px] md:text-sm", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 md:h-4 md:w-4 fill-white flex-shrink-0 mt-0.5" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: "Aktif Selamanya" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openRegister(),
                className: "w-full py-2.5 md:py-4 text-xs md:text-base bg-white text-primary rounded-xl md:rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-[1.02] mt-auto",
                children: "Mulai"
              }
            )
          ] })
        ] })
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
    /* @__PURE__ */ jsx("footer", { className: "py-10 md:py-20 border-t border-slate-100 dark:border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:space-y-4 text-center md:text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-2", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 md:h-5 md:w-5 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "font-serif text-lg md:text-xl italic font-bold", children: "Vowly" })
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
