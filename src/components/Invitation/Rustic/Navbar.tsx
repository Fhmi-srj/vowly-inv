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
        { icon: Calendar, label: "Event", href: "#event" },
        { icon: Camera, label: "Gallery", href: "#gallery" },
        { icon: Gift, label: "Gift", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="bg-[#4a3f35]/95 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    >
                        <item.icon size={18} className="transition-transform group-hover:-translate-y-1" />
                        <span className="text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#4a3f35] px-2 py-1 rounded-md">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    <span className="text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#4a3f35] px-2 py-1 rounded-md whitespace-nowrap">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
