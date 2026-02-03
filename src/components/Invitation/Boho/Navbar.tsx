import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Camera, Gift, MessageCircle, Sun, Moon } from "lucide-react";

interface NavbarProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
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
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24 pointer-events-none'}`}>
            <div className="bg-[#4a4a4a]/95 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#c19a6b] hover:text-[#e2725b] transition-all"
                    >
                        <item.icon size={20} className="transition-transform group-hover:-translate-y-1" />
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-50 group-hover:scale-100">
                            <div className="bg-[#e2725b] text-[#faf7f2] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                                {item.label}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#e2725b] rotate-45"></div>
                            </div>
                        </div>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#c19a6b] hover:text-[#e2725b] transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-50 group-hover:scale-100">
                        <div className="bg-[#e2725b] text-[#faf7f2] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                            {theme === "light" ? "Dark Spirit" : "Light Spirit"}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#e2725b] rotate-45"></div>
                        </div>
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
