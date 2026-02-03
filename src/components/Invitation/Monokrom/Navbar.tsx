import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Camera, Gift, MessageCircle, Sun, Moon, MapPin, Star } from "lucide-react";

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
        { icon: Home, label: "Intro", href: "#hero" },
        { icon: Heart, label: "Couple", href: "#couple" },
        { icon: Calendar, label: "Time", href: "#event" },
        { icon: Camera, label: "Frames", href: "#gallery" },
        { icon: Gift, label: "Token", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center gap-6 md:gap-10 transition-colors duration-1000">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300"
                    >
                        <item.icon size={20} className="transition-transform group-hover:-translate-y-1" />
                        <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2">
                            {item.label}
                        </span>
                    </a>
                ))}

                <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-transform group-hover:translate-y-0 translate-y-2">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
