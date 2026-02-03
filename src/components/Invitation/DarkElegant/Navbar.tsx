import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Camera, Gift, MessageCircle, Star, Sun, Moon } from "lucide-react";

interface NavbarProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { icon: Home, label: "Aura", href: "#hero" },
        { icon: Heart, label: "Ones", href: "#couple" },
        { icon: Star, label: "Log", href: "#story" },
        { icon: Calendar, label: "Time", href: "#event" },
        { icon: Camera, label: "Frames", href: "#gallery" },
        { icon: Gift, label: "Token", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32 pointer-events-none'}`}>
            <div className="bg-[#0f0f11]/80 backdrop-blur-3xl border border-white/10 px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-white/40 hover:text-emerald-400 transition-all"
                    >
                        <item.icon size={20} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-2" />
                        <span className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full italic group-hover:block hidden">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-white/40 hover:text-emerald-400 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
                    <span className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full italic group-hover:block hidden">
                        {theme === "light" ? "Switch Dark" : "Switch Light"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
