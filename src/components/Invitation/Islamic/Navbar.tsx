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
        { icon: Home, label: "Awal", href: "#hero" },
        { icon: Heart, label: "Mempelai", href: "#couple" },
        { icon: Star, label: "Kisah", href: "#story" },
        { icon: Calendar, label: "Agenda", href: "#event" },
        { icon: Camera, label: "Galeri", href: "#gallery" },
        { icon: Gift, label: "Kado", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75 pointer-events-none'}`}>
            <div className="bg-white/80 backdrop-blur-2xl border border-[#2d4a3e]/5 px-10 py-6 rounded-full shadow-[0_25px_50px_-12px_rgba(45,74,62,0.15)] flex items-center gap-8 md:gap-12">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all"
                    >
                        <item.icon size={20} strokeWidth={1} className="transition-transform group-hover:-translate-y-3 group-hover:scale-110" />
                        <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#2d4a3e] text-white text-[9px] font-black tracking-widest uppercase px-5 py-3 rounded-full italic group-hover:block hidden shadow-2xl">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#2d4a3e]/40 hover:text-[#c5a059] transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} strokeWidth={1} /> : <Sun size={20} strokeWidth={1} />}
                    <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#2d4a3e] text-white text-[9px] font-black tracking-widest uppercase px-5 py-3 rounded-full italic group-hover:block hidden shadow-2xl">
                        {theme === "light" ? "Malam" : "Siang"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
