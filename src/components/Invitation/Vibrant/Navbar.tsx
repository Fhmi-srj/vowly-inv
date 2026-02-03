import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Camera, Gift, MessageCircle, PartyPopper, Sun, Moon } from "lucide-react";

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
        { icon: Home, label: "INFO", href: "#hero" },
        { icon: Heart, label: "COUPLE", href: "#couple" },
        { icon: PartyPopper, label: "STORY", href: "#story" },
        { icon: Calendar, label: "DATES", href: "#event" },
        { icon: Camera, label: "SHOTS", href: "#gallery" },
        { icon: Gift, label: "TOKEN", href: "#gift" },
        { icon: MessageCircle, label: "RSVP", href: "#rsvp" },
    ];

    return (
        <nav className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'}`}>
            <div className="bg-black border-4 border-white px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 md:gap-10">
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="group relative flex flex-col items-center gap-1 text-white hover:text-yellow-400 transition-all"
                    >
                        <item.icon size={22} className="transition-transform group-hover:-translate-y-2 group-hover:scale-125" />
                        <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-pink-500 text-white text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl italic border-2 border-black rotate-3 group-hover:block hidden">
                            {item.label}
                        </span>
                    </a>
                ))}
                <button
                    onClick={toggleTheme}
                    className="group relative flex flex-col items-center gap-1 text-white hover:text-yellow-400 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
                    <span className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-pink-500 text-white text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl italic border-2 border-black rotate-3 group-hover:block hidden">
                        {theme === "light" ? "Night Mode" : "Day Mode"}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
