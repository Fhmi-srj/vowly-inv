import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_R-gB5CVe.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import { Check, Heart, AlertCircle, CheckCircle2, Loader2, ExternalLink, User, Smartphone, Globe, Lock, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { A as AVAILABLE_THEMES } from '../chunks/index_DbNV1jv1.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_AKAD_DATE": "11 Oktober 2025", "PUBLIC_AKAD_DAY": "Minggu", "PUBLIC_AKAD_END": "10:00", "PUBLIC_AKAD_ISO_END": "2025-10-11T10:00:00+07:00", "PUBLIC_AKAD_ISO_START": "2025-10-11T08:00:00+07:00", "PUBLIC_AKAD_START": "08:00", "PUBLIC_AKAD_TITLE": "Akad Nikah", "PUBLIC_BANK_ACCOUNTS": "[{\"bank\":\"Bank BCA\",\"number\":\"1234567890\",\"name\":\"Fera Oktapia\"},{\"bank\":\"Bank Mandiri\",\"number\":\"0987654321\",\"name\":\"Yahya Zulfikri\"}]", "PUBLIC_BRIDE_FULLNAME": "Fera Oktapia", "PUBLIC_BRIDE_IMAGE": "https://placehold.co/600x800?text=Fey+Portrait", "PUBLIC_BRIDE_INSTAGRAM": "feraoktapia___", "PUBLIC_BRIDE_NICKNAME": "Fey", "PUBLIC_BRIDE_PARENTS": "Putri tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]", "PUBLIC_GROOM_FULLNAME": "Yahya Zulfikri", "PUBLIC_GROOM_IMAGE": "https://placehold.co/600x800?text=Yaya+Portrait", "PUBLIC_GROOM_INSTAGRAM": "zulfikriyahya_", "PUBLIC_GROOM_NICKNAME": "Yaya", "PUBLIC_GROOM_PARENTS": "Putra tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]", "PUBLIC_HERO_CITY": "Kab. Pandeglang, Banten", "PUBLIC_HERO_IMAGE": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop", "PUBLIC_LOVE_STORY": "[{\"date\":\"2020\",\"title\":\"Awal Pertemuan\",\"desc\":\"Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna.\"},{\"date\":\"2022\",\"title\":\"Menjalin Harapan\",\"desc\":\"Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya.\"},{\"date\":\"2025\",\"title\":\"Ikatan Suci\",\"desc\":\"Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan.\"}]", "PUBLIC_MIDTRANS_CLIENT_KEY": "Mid-client-2Vv_2CxT7hPAYKXe", "PUBLIC_MIDTRANS_IS_PRODUCTION": "false", "PUBLIC_MUSIC_URL": "https://www.bensound.com/bensound-music/bensound-forever.mp3", "PUBLIC_RESEPSI_DATE": "11 Oktober 2025", "PUBLIC_RESEPSI_DAY": "Minggu", "PUBLIC_RESEPSI_END": "14:00", "PUBLIC_RESEPSI_ISO_END": "2025-10-11T14:00:00+07:00", "PUBLIC_RESEPSI_ISO_START": "2025-10-11T11:00:00+07:00", "PUBLIC_RESEPSI_START": "11:00", "PUBLIC_RESEPSI_TITLE": "Resepsi Pernikahan", "PUBLIC_RSVP_MAX_GUESTS": "20", "PUBLIC_VENUE_ADDRESS": "Jl. Taman Makam Pahlawan No.1, Kab. Pandeglang, Banten", "PUBLIC_VENUE_LAT": "-6.2088", "PUBLIC_VENUE_LNG": "106.8456", "PUBLIC_VENUE_NAME": "The Royal Azure Ballroom", "SITE": "https://vowly.hello-inv.com", "SSR": true};
const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    package: "",
    themeId: "",
    fullName: "",
    phone: "",
    password: "",
    slug: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(0);
  const [showThemeConfirm, setShowThemeConfirm] = useState(false);
  const [pendingThemeId, setPendingThemeId] = useState("");
  const [infoModal, setInfoModal] = useState({
    show: false,
    title: "",
    message: ""
  });
  const [paymentStatus, setPaymentStatus] = useState("none");
  const [paymentId, setPaymentId] = useState("");
  const swipeVariants = {
    enter: (direction2) => ({
      x: direction2 > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction2) => ({
      zIndex: 0,
      x: direction2 < 0 ? 50 : -50,
      opacity: 0
    })
  };
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");
    if (themeParam && AVAILABLE_THEMES.some((t) => t.id === themeParam)) {
      setFormData((prev) => ({ ...prev, themeId: themeParam }));
    }
    const clientKey = Object.assign(__vite_import_meta_env__, { MIDTRANS_IS_PRODUCTION: "false", OS: process.env.OS, PUBLIC: process.env.PUBLIC })?.PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const isProduction = Object.assign(__vite_import_meta_env__, { MIDTRANS_IS_PRODUCTION: "false", OS: process.env.OS, PUBLIC: process.env.PUBLIC })?.PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const script = document.createElement("script");
    script.src = isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
    if (clientKey) {
      script.setAttribute("data-client-key", clientKey);
    }
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const packages = [
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
      features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan", "Galeri Foto (5)"],
      color: "blue",
      badge: "Hemat"
    },
    {
      id: "premium",
      name: "Premium",
      price: "149k",
      priceNum: 149e3,
      originalPrice: "249k",
      features: ["Semua Tema", "Aktif Selamanya", "RSVP & Ucapan Pro", "Galeri Foto & Video", "Musik Latar"],
      color: "pink",
      badge: "Populer"
    },
    {
      id: "royal",
      name: "Royal",
      price: "299k",
      priceNum: 299e3,
      originalPrice: "499k",
      features: ["Fitur Premium+", "Domain Custom", "Check-in QR Code", "Prioritas Support", "Desain Eksklusif"],
      color: "amber",
      badge: "VIP"
    }
  ];
  const handleStepClick = (targetStep) => {
    if (targetStep === step) return;
    if (targetStep > step) {
      if (targetStep >= 2 && !formData.package) {
        setInfoModal({
          show: true,
          title: "Pilih Paket Dulu",
          message: "Silakan pilih paket yang sesuai dengan kebutuhan Anda sebelum memilih tema."
        });
        return;
      }
      if (targetStep === 3 && !formData.themeId) {
        setInfoModal({
          show: true,
          title: "Pilih Tema Dulu",
          message: "Silakan pilih desain tema yang Anda sukai sebelum membuat akun."
        });
        return;
      }
    }
    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
  };
  const handlePackageSelect = (pkgId) => {
    setFormData((prev) => ({ ...prev, package: pkgId }));
    setDirection(1);
    setStep(2);
  };
  const handleThemeSelectClick = (themeId) => {
    setPendingThemeId(themeId);
    setShowThemeConfirm(true);
  };
  const confirmThemeSelect = () => {
    setFormData((prev) => ({ ...prev, themeId: pendingThemeId }));
    setShowThemeConfirm(false);
    setDirection(1);
    setStep(3);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const tokenRes = await fetch("/api/payment/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        setError(tokenData.error || "Gagal membuat sesi pendaftaran");
        setIsLoading(false);
        return;
      }
      if (tokenData.free) {
        console.log("Free Registration Success:", tokenData);
        setPaymentStatus("success");
        setTimeout(() => {
          window.location.href = "/login?registered=true";
        }, 3e3);
        return;
      }
      if (window.snap) {
        window.snap.pay(tokenData.token, {
          onSuccess: (result) => {
            console.log("Payment Success:", result);
            setPaymentStatus("success");
            setTimeout(() => {
              window.location.href = "/login?registered=true";
            }, 3e3);
          },
          onPending: (result) => {
            console.log("Payment Pending:", result);
            setPaymentId(result.order_id);
            setPaymentStatus("pending");
          },
          onError: (result) => {
            console.error("Payment Error:", result);
            setError("Pembayaran gagal. Silakan coba lagi.");
            setPaymentStatus("error");
          },
          onClose: () => {
            console.log("Payment closed");
            setIsLoading(false);
          }
        });
      } else {
        setError("Sistem pembayaran belum siap. Silakan coba beberapa saat lagi.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setError("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
  };
  const renderStep1 = () => /* @__PURE__ */ jsxs(
    motion.div,
    {
      custom: direction,
      variants: swipeVariants,
      initial: "enter",
      animate: "center",
      exit: "exit",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      },
      className: "space-y-8",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-3 w-3 fill-pink-600" }),
            " Penawaran Terbatas"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl font-serif italic font-bold text-gray-800 mb-4 px-4", children: "Pilih Paket Kebahagiaan Anda" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500", children: [
            "Hemat hingga ",
            /* @__PURE__ */ jsx("span", { className: "text-pink-600 font-bold italic", children: "50% hari ini" }),
            " hanya di Vowly."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto", children: packages.map((pkg) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => handlePackageSelect(pkg.id),
            className: `relative group cursor-pointer transition-all duration-500 ${formData.package === pkg.id ? "scale-105" : "hover:scale-[1.02]"}`,
            children: /* @__PURE__ */ jsxs("div", { className: `h-full p-8 rounded-[3rem] border-2 transition-all duration-500 overflow-hidden relative ${formData.package === pkg.id ? "border-pink-500 bg-white shadow-2xl shadow-pink-100 z-10" : "border-slate-100 bg-white hover:border-pink-200"}`, children: [
              /* @__PURE__ */ jsx("div", { className: `absolute top-6 right-8 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg ${pkg.color === "pink" ? "bg-pink-500 text-white shadow-lg shadow-pink-100" : pkg.color === "amber" ? "bg-amber-500 text-white shadow-lg shadow-amber-100" : pkg.color === "blue" ? "bg-blue-500 text-white shadow-lg shadow-blue-100" : "bg-slate-200 text-slate-500"}`, children: pkg.badge }),
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-black mb-1 ${pkg.color === "pink" ? "text-pink-600" : pkg.color === "amber" ? "text-amber-600" : pkg.color === "blue" ? "text-blue-600" : "text-slate-700"}`, children: pkg.name }),
              /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-slate-300 text-sm line-through font-bold decoration-pink-300 decoration-2 mb-1", children: [
                  "Rp ",
                  pkg.originalPrice
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-slate-800 leading-none", children: pkg.priceNum === 0 ? "Gratis" : `Rp ${pkg.price}` }),
                  pkg.priceNum > 0 && /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-xs font-bold uppercase", children: "/unit" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-4 mb-10", children: pkg.features.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-slate-500 text-xs font-medium leading-relaxed", children: [
                /* @__PURE__ */ jsx("div", { className: `mt-0.5 p-0.5 rounded-full flex-shrink-0 ${pkg.color === "pink" ? "bg-pink-100 text-pink-600" : pkg.color === "amber" ? "bg-amber-100 text-amber-600" : pkg.color === "blue" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`, children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }) }),
                feat
              ] }, i)) }),
              /* @__PURE__ */ jsxs("button", { className: `w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${formData.package === pkg.id ? pkg.color === "pink" ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : pkg.color === "amber" ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : pkg.color === "blue" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-slate-800 text-white" : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-pink-200 group-hover:text-pink-600"}`, children: [
                "Pilih ",
                pkg.name
              ] })
            ] })
          },
          pkg.id
        )) })
      ]
    },
    "step1"
  );
  const renderStep2 = () => /* @__PURE__ */ jsxs(
    motion.div,
    {
      custom: direction,
      variants: swipeVariants,
      initial: "enter",
      animate: "center",
      exit: "exit",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      },
      className: "space-y-8",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-10 relative", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-serif italic font-bold text-gray-800 mb-4", children: "Pilih Tema Undangan" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Visualisasikan cinta Anda dengan desain premium kami." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-2", children: AVAILABLE_THEMES.map((theme) => /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: `h-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-xl border-2 transition-all duration-500 ${formData.themeId === theme.id ? "border-pink-500 shadow-pink-100 shadow-2xl" : "border-slate-100 hover:shadow-2xl"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-square overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] mb-4 md:mb-6 shadow-lg", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: theme.preview,
              alt: theme.name,
              className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center px-1 mb-4 md:mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900 leading-tight truncate", children: theme.name }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-[10px] md:text-sm line-clamp-2 leading-snug", children: theme.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:space-y-3", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `/demo-${theme.id}`,
                target: "_blank",
                className: "w-full py-2.5 md:py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95",
                children: [
                  "Lihat Demo ",
                  /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 md:h-4 md:w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleThemeSelectClick(theme.id),
                className: `w-full py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-sm font-bold transition-all cursor-pointer active:scale-95 ${formData.themeId === theme.id ? "bg-pink-100 text-pink-600 border border-pink-200" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"}`,
                children: formData.themeId === theme.id ? "Terpilih" : "Pilih Tema"
              }
            )
          ] })
        ] }) }, theme.id)) })
      ]
    },
    "step2"
  );
  const renderStep3 = () => /* @__PURE__ */ jsxs(
    motion.div,
    {
      custom: direction,
      variants: swipeVariants,
      initial: "enter",
      animate: "center",
      exit: "exit",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      },
      className: "max-w-xl mx-auto",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-10 relative", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-serif italic font-bold text-gray-800 mb-4", children: "Lengkapi Akun Anda" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Satu langkah lagi untuk membuat undangan Anda live." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-pink-50 border border-pink-100", children: [
          error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }),
            " ",
            error
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Nama Lengkap" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "fullName",
                  required: true,
                  value: formData.fullName,
                  onChange: handleChange,
                  placeholder: "Nama Lengkap Anda",
                  className: "w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Nomor WhatsApp" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  name: "phone",
                  required: true,
                  value: formData.phone,
                  onChange: handleChange,
                  placeholder: "081234567890",
                  className: "w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Subdomain (Slug Undangan)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Globe, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "slug",
                  required: true,
                  value: formData.slug,
                  onChange: handleChange,
                  placeholder: "nama-pasangan",
                  className: "w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 ml-1 mt-1 italic", children: [
              "Hasilnya: vowly.com/",
              formData.slug || "nama-pasangan"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest uppercase text-slate-400 ml-1", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  name: "password",
                  required: true,
                  value: formData.password,
                  onChange: handleChange,
                  placeholder: "••••••••",
                  className: "w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isLoading,
              className: "w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-bold tracking-widest uppercase text-sm shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-400 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 mt-4",
              children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Daftar Sekarang ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
              ] })
            }
          )
        ] })
      ]
    },
    "step3"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-b from-white to-pink-50/30 pb-20 overflow-x-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-[200] bg-white/70 backdrop-blur-xl border-b border-pink-100/50 mb-12 py-6 px-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between relative px-2", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 right-0 -translate-y-1/2 px-5 md:px-6 z-0", children: /* @__PURE__ */ jsx("div", { className: "relative h-0.5 bg-pink-100 w-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500",
          style: { width: `${(step - 1) / 2 * 100}%` }
        }
      ) }) }),
      [1, 2, 3].map((s) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleStepClick(s),
          className: "relative z-10 flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent outline-none focus:ring-0",
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? "bg-pink-500 text-white border-4 border-pink-100" : "bg-white text-slate-300 border-2 border-slate-100"} group-hover:scale-110`, children: step > s ? /* @__PURE__ */ jsx(Check, { className: "h-6 w-6" }) : s }),
            /* @__PURE__ */ jsx("span", { className: `text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${step >= s ? "text-pink-600" : "text-slate-300"} group-hover:text-pink-400`, children: s === 1 ? "Paket" : s === 2 ? "Tema" : "Akun" })
          ]
        },
        s
      ))
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 overflow-x-hidden", children: /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", custom: direction, initial: false, children: [
      step === 1 && renderStep1(),
      step === 2 && renderStep2(),
      step === 3 && renderStep3()
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showThemeConfirm && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[300] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "absolute inset-0 bg-slate-950/40 backdrop-blur-sm",
          onClick: () => setShowThemeConfirm(false)
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          className: "relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-pink-100 text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-6", children: /* @__PURE__ */ jsx(Heart, { className: "h-8 w-8 animate-pulse fill-pink-200" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif italic font-bold text-slate-800 mb-3", children: "Konfirmasi Tema" }),
            /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mb-8 leading-relaxed", children: [
              "Anda memilih tema ",
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-pink-600", children: [
                '"',
                AVAILABLE_THEMES.find((t) => t.id === pendingThemeId)?.name,
                '"'
              ] }),
              ".",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "bg-pink-50 text-pink-700 px-3 py-1 rounded-lg text-xs font-bold", children: "PENTING:" }),
              /* @__PURE__ */ jsx("br", {}),
              "Sekali Anda memilih lalu menyelesaikan pendaftaran, tema ",
              /* @__PURE__ */ jsx("span", { className: "underline decoration-pink-300 decoration-2", children: "tidak dapat diubah" }),
              " kecuali melalui bantuan admin."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowThemeConfirm(false),
                  className: "py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all border border-slate-100",
                  children: "Batal"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: confirmThemeSelect,
                  className: "py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all",
                  children: "Ya, Lanjutkan"
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: infoModal.show && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[400] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "absolute inset-0 bg-slate-950/40 backdrop-blur-sm",
          onClick: () => setInfoModal((prev) => ({ ...prev, show: false }))
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          className: "relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl border border-pink-100 text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-6", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif italic font-bold text-slate-800 mb-3", children: infoModal.title }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-8 leading-relaxed", children: infoModal.message }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setInfoModal((prev) => ({ ...prev, show: false })),
                className: "w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95",
                children: "Oke, Saya Mengerti"
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs(AnimatePresence, { children: [
      paymentStatus === "success" && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[500] flex items-center justify-center p-4", children: [
        /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-slate-950/60 backdrop-blur-md" }),
        /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-2xl", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-slate-800 mb-2", children: "Pembayaran Berhasil!" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-8", children: "Selamat! Akun dan undangan Anda telah berhasil dibuat dan diaktifkan." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-pink-500 font-bold", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
            " Mengalihkan ke Dashboard..."
          ] })
        ] })
      ] }),
      paymentStatus === "pending" && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[500] flex items-center justify-center p-4", children: [
        /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-slate-950/60 backdrop-blur-md" }),
        /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-2xl", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6", children: /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-slate-800 mb-2", children: "Menunggu Pembayaran" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-4", children: "Silakan selesaikan pembayaran Anda menggunakan instruksi di jendela sebelumnya." }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-2xl mb-8", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 uppercase font-bold mb-1", children: "Order ID" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-mono text-slate-700", children: paymentId })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.href = "/dashboard",
              className: "w-full py-4 bg-slate-900 text-white rounded-xl font-bold mb-4",
              children: "Ke Dashboard"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 text-center", children: "Undangan akan otomatis aktif setelah pembayaran terkonfirmasi." })
        ] })
      ] })
    ] })
  ] });
};

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Daftar - Vowly | Undangan Digital Premium" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="bg-white selection:bg-pink-200/50 selection:text-pink-700">  <nav class="sticky top-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/80 border-b border-pink-100/50"> <div class="container mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between"> <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity"> <img src="/logo-vowly.png" alt="Vowly Logo" class="h-8 md:h-10 w-auto object-contain"> <span class="font-serif text-xl md:text-2xl italic font-bold tracking-tighter text-pink-600">Vowly</span> </a> <div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
Proses Pendaftaran
</div> </div> </nav> ${renderComponent($$result2, "RegistrationPage", RegistrationPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Landing/RegistrationPage", "client:component-export": "default" })} </main> ` })} `;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/register.astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Register,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
