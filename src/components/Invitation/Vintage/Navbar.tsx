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
        { icon: Home, label: "Rewind", href: "#hero" },
        { icon: Heart, label: "Couples", href: "#couple" },
        { icon: Star, label: "History", href: "#story" },
        { icon: Calendar, label: "Dockets", href: "#event" },
        { icon: Camera, label: "Archives", href: "#gallery" },
        { icon: Gift, label: "Tokens", href: "#gift" },
        { icon: MessageCircle, label: "Signals", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'}`}>
            <div className="bg-[#f4ecd8]/90 backdrop-blur-md border-x-4 border-[#5c4033]/20 px-8 py-5 rounded-none shadow-[20px_20px_0_rgba(0,0,0,0.1)] flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#5c4033]/40 hover:text-[#5c4033] transition-all"
                    >
                        <item.icon size={20} strokeWidth={1} className="transition-transform group-hover:scale-125" />
                        <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#5c4033] text-[#f4ecd8] text-[9px] font-mono font-bold tracking-widest uppercase px-5 py-3 rounded-none italic group-hover:block hidden shadow-2xl">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#5c4033]/40 hover:text-[#5c4033] transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} strokeWidth={1} /> : <Sun size={20} strokeWidth={1} />}
                    <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#5c4033] text-[#f4ecd8] text-[9px] font-mono font-bold tracking-widest uppercase px-5 py-3 rounded-none italic group-hover:block hidden shadow-2xl">
                        {theme === "light" ? "Sepia Dark" : "Classic Light"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
