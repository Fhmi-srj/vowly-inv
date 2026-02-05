import * as React from "react";
import { useState } from "react";
import { Check, Heart, ArrowRight, ArrowLeft, Loader2, Smartphone, Lock, User, Globe, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_THEMES } from "../../themes/index";

declare global {
    interface Window {
        snap: any;
    }
}

const RegistrationPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        package: "",
        themeId: "",
        fullName: "",
        phone: "",
        password: "",
        slug: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [direction, setDirection] = useState(0);
    const [showThemeConfirm, setShowThemeConfirm] = useState(false);
    const [pendingThemeId, setPendingThemeId] = useState("");
    const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: ""
    });
    const [paymentStatus, setPaymentStatus] = useState<"none" | "pending" | "success" | "error">("none");
    const [paymentId, setPaymentId] = useState("");


    const swipeVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    // Read theme from URL query parameter on mount
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get("theme");
        if (themeParam && AVAILABLE_THEMES.some(t => t.id === themeParam)) {
            setFormData(prev => ({ ...prev, themeId: themeParam }));
        }

        // Load Midtrans Script
        const clientKey = (import.meta as any).env?.PUBLIC_MIDTRANS_CLIENT_KEY || "";
        const isProduction = (import.meta as any).env?.PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

        const script = document.createElement("script");
        script.src = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";
        if (clientKey) {
            script.setAttribute("data-client-key", clientKey);
        }
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
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
            priceNum: 49000,
            originalPrice: "99k",
            features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan", "Galeri Foto (5)"],
            color: "blue",
            badge: "Hemat"
        },
        {
            id: "premium",
            name: "Premium",
            price: "149k",
            priceNum: 149000,
            originalPrice: "249k",
            features: ["Semua Tema", "Aktif Selamanya", "RSVP & Ucapan Pro", "Galeri Foto & Video", "Musik Latar"],
            color: "pink",
            badge: "Populer"
        },
        {
            id: "royal",
            name: "Royal",
            price: "299k",
            priceNum: 299000,
            originalPrice: "499k",
            features: ["Fitur Premium+", "Domain Custom", "Check-in QR Code", "Prioritas Support", "Desain Eksklusif"],
            color: "amber",
            badge: "VIP"
        }
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleStepClick = (targetStep: number) => {
        if (targetStep === step) return;

        // Validation for moving forward
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

    const handlePackageSelect = (pkgId: string) => {
        setFormData(prev => ({ ...prev, package: pkgId }));
        setDirection(1);
        setStep(2);
    };

    const handleThemeSelectClick = (themeId: string) => {
        setPendingThemeId(themeId);
        setShowThemeConfirm(true);
    };

    const confirmThemeSelect = () => {
        setFormData(prev => ({ ...prev, themeId: pendingThemeId }));
        setShowThemeConfirm(false);
        setDirection(1);
        setStep(3);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Get Payment Token (Registration data is sent here now)
            const tokenRes = await fetch("/api/payment/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok) {
                setError(tokenData.error || "Gagal membuat sesi pendaftaran");
                setIsLoading(false);
                return;
            }

            // --- FREE SUCCESS CASE ---
            if (tokenData.free) {
                console.log("Free Registration Success:", tokenData);
                setPaymentStatus("success");
                setTimeout(() => {
                    window.location.href = "/login?registered=true";
                }, 3000);
                return;
            }

            // 2. Trigger Midtrans Snap
            if (window.snap) {
                window.snap.pay(tokenData.token, {
                    onSuccess: (result: any) => {
                        console.log("Payment Success:", result);
                        setPaymentStatus("success");
                        setTimeout(() => {
                            window.location.href = "/login?registered=true";
                        }, 3000);
                    },
                    onPending: (result: any) => {
                        console.log("Payment Pending:", result);
                        setPaymentId(result.order_id);
                        setPaymentStatus("pending");
                    },
                    onError: (result: any) => {
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

    // Render Steps
    const renderStep1 = () => (
        <motion.div
            key="step1"
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
            className="space-y-8"
        >
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    <Heart className="h-3 w-3 fill-pink-600" /> Penawaran Terbatas
                </div>
                <h1 className="text-3xl md:text-5xl font-serif italic font-bold text-gray-800 mb-4 px-4">Pilih Paket Kebahagiaan Anda</h1>
                <p className="text-slate-500">Hemat hingga <span className="text-pink-600 font-bold italic">50% hari ini</span> hanya di Vowly.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg.id)}
                        className={`relative group cursor-pointer transition-all duration-500 ${formData.package === pkg.id ? 'scale-105' : 'hover:scale-[1.02]'}`}
                    >
                        <div className={`h-full p-8 rounded-[3rem] border-2 transition-all duration-500 overflow-hidden relative ${formData.package === pkg.id
                                ? 'border-pink-500 bg-white shadow-2xl shadow-pink-100 z-10'
                                : 'border-slate-100 bg-white hover:border-pink-200'
                            }`}>
                            {/* Badge */}
                            <div className={`absolute top-6 right-8 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg ${pkg.color === 'pink' ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' :
                                    pkg.color === 'amber' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' :
                                        pkg.color === 'blue' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' :
                                            'bg-slate-200 text-slate-500'
                                }`}>
                                {pkg.badge}
                            </div>

                            <h3 className={`text-xl font-black mb-1 ${pkg.color === 'pink' ? 'text-pink-600' :
                                    pkg.color === 'amber' ? 'text-amber-600' :
                                        pkg.color === 'blue' ? 'text-blue-600' :
                                            'text-slate-700'
                                }`}>{pkg.name}</h3>

                            <div className="mb-8">
                                <div className="text-slate-300 text-sm line-through font-bold decoration-pink-300 decoration-2 mb-1">
                                    Rp {pkg.originalPrice}
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-800 leading-none">
                                        {pkg.priceNum === 0 ? "Gratis" : `Rp ${pkg.price}`}
                                    </span>
                                    {pkg.priceNum > 0 && <span className="text-slate-400 text-xs font-bold uppercase">/unit</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {pkg.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-500 text-xs font-medium leading-relaxed">
                                        <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${pkg.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                                                pkg.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                                    pkg.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-100 text-slate-400'
                                            }`}>
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${formData.package === pkg.id
                                    ? pkg.color === 'pink' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' :
                                        pkg.color === 'amber' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' :
                                            pkg.color === 'blue' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' :
                                                'bg-slate-800 text-white'
                                    : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-pink-200 group-hover:text-pink-600'
                                }`}>
                                Pilih {pkg.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            key="step2"
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
            className="space-y-8"
        >
            <div className="text-center mb-10 relative">
                <h1 className="text-3xl md:text-4xl font-serif italic font-bold text-gray-800 mb-4">Pilih Tema Undangan</h1>
                <p className="text-slate-500">Visualisasikan cinta Anda dengan desain premium kami.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-2">
                {AVAILABLE_THEMES.map((theme) => (
                    <div key={theme.id} className="group">
                        <div className={`h-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-xl border-2 transition-all duration-500 ${formData.themeId === theme.id ? 'border-pink-500 shadow-pink-100 shadow-2xl' : 'border-slate-100 hover:shadow-2xl'}`}>
                            {/* Theme Preview */}
                            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] mb-4 md:mb-6 shadow-lg">
                                <img
                                    src={theme.preview}
                                    alt={theme.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Theme Name & Description */}
                            <div className="text-center px-1 mb-4 md:mb-6">
                                <h3 className="font-serif text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900 leading-tight truncate">{theme.name}</h3>
                                <p className="text-slate-500 text-[10px] md:text-sm line-clamp-2 leading-snug">{theme.description}</p>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2 md:space-y-3">
                                <a
                                    href={`/demo-${theme.id}`}
                                    target="_blank"
                                    className="w-full py-2.5 md:py-3.5 bg-slate-900 text-white rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Lihat Demo <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                                </a>
                                <button
                                    onClick={() => handleThemeSelectClick(theme.id)}
                                    className={`w-full py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-sm font-bold transition-all cursor-pointer active:scale-95 ${formData.themeId === theme.id ? 'bg-pink-100 text-pink-600 border border-pink-200' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {formData.themeId === theme.id ? 'Terpilih' : 'Pilih Tema'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div
            key="step3"
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
            className="max-w-xl mx-auto"
        >
            <div className="text-center mb-10 relative">
                <h1 className="text-3xl md:text-4xl font-serif italic font-bold text-gray-800 mb-4">Lengkapi Akun Anda</h1>
                <p className="text-slate-500">Satu langkah lagi untuk membuat undangan Anda live.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-pink-50 border border-pink-100">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" /> {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nama Lengkap</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nama Lengkap Anda"
                            className="w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Nomor WhatsApp</label>
                    <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="081234567890"
                            className="w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Subdomain (Slug Undangan)</label>
                    <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="nama-pasangan"
                            className="w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 mt-1 italic">Hasilnya: vowly.com/{formData.slug || "nama-pasangan"}</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-bold tracking-widest uppercase text-sm shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-400 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 mt-4"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                            Daftar Sekarang <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30 pb-20 overflow-x-hidden">
            {/* Sticky Stepper Header */}
            <div className="sticky top-0 z-[200] bg-white/70 backdrop-blur-xl border-b border-pink-100/50 mb-12 py-6 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between relative px-2">
                        {/* Stepper Progress Line Container */}
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-5 md:px-6 z-0">
                            <div className="relative h-0.5 bg-pink-100 w-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
                                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                                />
                            </div>
                        </div>

                        {[1, 2, 3].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleStepClick(s)}
                                className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent outline-none focus:ring-0"
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-pink-500 text-white border-4 border-pink-100' : 'bg-white text-slate-300 border-2 border-slate-100'} group-hover:scale-110`}>
                                    {step > s ? <Check className="h-6 w-6" /> : s}
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${step >= s ? 'text-pink-600' : 'text-slate-300'} group-hover:text-pink-400`}>
                                    {s === 1 ? 'Paket' : s === 2 ? 'Tema' : 'Akun'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 overflow-x-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </AnimatePresence>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showThemeConfirm && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setShowThemeConfirm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-pink-100 text-center"
                        >
                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-6">
                                <Heart className="h-8 w-8 animate-pulse fill-pink-200" />
                            </div>
                            <h3 className="text-2xl font-serif italic font-bold text-slate-800 mb-3">Konfirmasi Tema</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Anda memilih tema <span className="font-bold text-pink-600">"{AVAILABLE_THEMES.find(t => t.id === pendingThemeId)?.name}"</span>.
                                <br /><br />
                                <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-lg text-xs font-bold">PENTING:</span>
                                <br />
                                Sekali Anda memilih lalu menyelesaikan pendaftaran, tema <span className="underline decoration-pink-300 decoration-2">tidak dapat diubah</span> kecuali melalui bantuan admin.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowThemeConfirm(false)}
                                    className="py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmThemeSelect}
                                    className="py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all"
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Information Modal */}
            <AnimatePresence>
                {infoModal.show && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setInfoModal(prev => ({ ...prev, show: false }))}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl border border-pink-100 text-center"
                        >
                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-6">
                                <AlertCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-serif italic font-bold text-slate-800 mb-3">{infoModal.title}</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                {infoModal.message}
                            </p>
                            <button
                                onClick={() => setInfoModal(prev => ({ ...prev, show: false }))}
                                className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95"
                            >
                                Oke, Saya Mengerti
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Status Modals */}
            <AnimatePresence>
                {paymentStatus === "success" && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran Berhasil!</h3>
                            <p className="text-slate-500 mb-8">Selamat! Akun dan undangan Anda telah berhasil dibuat dan diaktifkan.</p>
                            <div className="flex items-center justify-center gap-2 text-pink-500 font-bold">
                                <Loader2 className="h-5 w-5 animate-spin" /> Mengalihkan ke Dashboard...
                            </div>
                        </motion.div>
                    </div>
                )}

                {paymentStatus === "pending" && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <Loader2 className="h-10 w-10 animate-spin" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Menunggu Pembayaran</h3>
                            <p className="text-slate-500 mb-4">Silakan selesaikan pembayaran Anda menggunakan instruksi di jendela sebelumnya.</p>
                            <div className="bg-slate-50 p-4 rounded-2xl mb-8">
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Order ID</p>
                                <p className="text-sm font-mono text-slate-700">{paymentId}</p>
                            </div>
                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold mb-4"
                            >
                                Ke Dashboard
                            </button>
                            <p className="text-xs text-slate-400 text-center">Undangan akan otomatis aktif setelah pembayaran terkonfirmasi.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default RegistrationPage;
