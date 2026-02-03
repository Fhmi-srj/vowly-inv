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
        { icon: Home, label: "Home", href: "#hero" },
        { icon: Heart, label: "Mempelai", href: "#couple" },
        { icon: Star, label: "Kisah", href: "#story" },
        { icon: Calendar, label: "Acara", href: "#event" },
        { icon: Camera, label: "Galeri", href: "#gallery" },
        { icon: Gift, label: "Kado", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'}`}>
            <div className="bg-[#4a0404]/80 backdrop-blur-3xl border border-[#d4af37]/30 px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#d4af37]/40 hover:text-[#d4af37] transition-all"
                    >
                        <item.icon size={20} strokeWidth={1} className="transition-transform group-hover:-translate-y-2 group-hover:scale-110" />
                        <span className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-gradient-to-b from-[#d4af37] to-[#8d6e1c] text-maroon-900 text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-md italic group-hover:block hidden shadow-xl text-black">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#d4af37]/40 hover:text-[#d4af37] transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} strokeWidth={1} /> : <Sun size={20} strokeWidth={1} />}
                    <span className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-gradient-to-b from-[#d4af37] to-[#8d6e1c] text-maroon-900 text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-md italic group-hover:block hidden shadow-xl text-black">
                        {theme === "light" ? "Malam" : "Siang"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
