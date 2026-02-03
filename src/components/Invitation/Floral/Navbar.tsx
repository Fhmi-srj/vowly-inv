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
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { icon: Home, label: "Hero", href: "#hero" },
        { icon: Heart, label: "Couple", href: "#couple" },
        { icon: Calendar, label: "Event", href: "#event" },
        { icon: Camera, label: "Photos", href: "#gallery" },
        { icon: Gift, label: "Gifts", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
            <div className="bg-white/70 backdrop-blur-xl px-10 py-5 rounded-full border border-white/20 shadow-[0_20px_60px_rgba(255,182,193,0.3)] flex items-center gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#db7093] hover:text-[#c71585] transition-all"
                    >
                        <item.icon size={20} className="transition-all group-hover:scale-125" />
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-[#db7093] text-white px-3 py-1.5 rounded-full scale-0 group-hover:scale-100">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#db7093] hover:text-[#c71585] transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all absolute -top-10 bg-[#db7093] text-white px-3 py-1.5 rounded-full scale-0 group-hover:scale-100 whitespace-nowrap">
                        {theme === "light" ? "Dark View" : "Light View"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
