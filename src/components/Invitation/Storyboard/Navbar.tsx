import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Camera, Gift, MessageCircle, Star, Zap, Sun, Moon } from "lucide-react";

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
        { icon: Heart, label: "Heroes", href: "#couple" },
        { icon: Star, label: "History", href: "#story" },
        { icon: Calendar, label: "Agenda", href: "#event" },
        { icon: Camera, label: "Panels", href: "#gallery" },
        { icon: Gift, label: "Tokens", href: "#gift" },
        { icon: MessageCircle, label: "Log", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-75 pointer-events-none'}`}>
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-[4px] border-[#2d2d2d] dark:border-blue-500 px-8 py-5 rounded-none shadow-[20px_20px_0_rgba(33,150,243,0.3)] dark:shadow-[20px_20px_0_rgba(139,92,246,0.3)] flex items-center gap-6 md:gap-10 transition-all duration-1000">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-[#2d2d2d]/30 dark:text-slate-400 hover:text-[#2196f3] dark:hover:text-blue-400 transition-all duration-300"
                    >
                        <item.icon size={22} strokeWidth={3} className="transition-transform group-hover:scale-150 group-hover:-translate-y-2 group-hover:rotate-12" />
                        <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#ffeb3b] dark:bg-pink-500 text-[#2d2d2d] dark:text-white text-[10px] font-black tracking-widest uppercase px-5 py-3 border-[3px] border-[#2d2d2d] dark:border-pink-300 shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#8b5cf6] group-hover:block hidden italic">
                            {item.label}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ffeb3b] dark:bg-pink-500 border-r-[3px] border-b-[3px] border-[#2d2d2d] dark:border-pink-300 rotate-45"></div>
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-[#2d2d2d]/30 dark:text-slate-400 hover:text-[#2196f3] dark:hover:text-blue-400 transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={22} strokeWidth={3} /> : <Sun size={22} strokeWidth={3} />}
                    <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#ffeb3b] dark:bg-pink-500 text-[#2d2d2d] dark:text-white text-[10px] font-black tracking-widest uppercase px-5 py-3 border-[3px] border-[#2d2d2d] dark:border-pink-300 shadow-[5px_5px_0_#2d2d2d] dark:shadow-[5px_5px_0_#8b5cf6] group-hover:block hidden italic">
                        {theme === "light" ? "Night Panel" : "Day Panel"}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ffeb3b] dark:bg-pink-500 border-r-[3px] border-b-[3px] border-[#2d2d2d] dark:border-pink-300 rotate-45"></div>
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
