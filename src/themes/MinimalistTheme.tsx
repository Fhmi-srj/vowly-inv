import * as React from "react";
import { useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import Envelope from "../components/Invitation/Luxury/Envelope";
import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import Navbar from "../components/Invitation/Luxury/Navbar";
import type { ThemeProps } from "./types";
import { Heart } from "lucide-react";

const MinimalistTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    const { config, text } = useSettings();

    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpened]);

    return (
        <div className={`selection:bg-slate-200 bg-slate-50 dark:bg-slate-950 min-h-screen font-serif text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-1000 ${theme === 'dark' ? 'dark' : ''}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            {/* Simple Hero */}
            <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center">
                <div className="space-y-6 animate-fadeIn">
                    <p className="tracking-[0.5em] text-xs uppercase text-slate-400 dark:text-stone-500 transition-colors">The Wedding of</p>
                    <h1 className="text-5xl md:text-8xl font-light italic">
                        {config.couple.groom.name} & {config.couple.bride.name}
                    </h1>
                    <div className="h-20 w-[1px] bg-slate-200 dark:bg-slate-800 mx-auto transition-colors"></div>
                    <p className="text-xl tracking-widest">{config.hero.date}</p>
                </div>
            </section>

            {/* Basic Content Sections */}
            <main className="max-w-4xl mx-auto px-6 space-y-32 py-32">
                {/* Couple */}
                <section className="text-center space-y-12">
                    <Heart className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-700 transition-colors" />
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <img src={config.couple.groom.image} className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm" />
                            <h3 className="text-2xl font-light">{config.couple.groom.fullName}</h3>
                            <p className="text-sm text-slate-500 dark:text-stone-400 transition-colors">{config.couple.groom.parents}</p>
                        </div>
                        <div className="space-y-4">
                            <img src={config.couple.bride.image} className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover rounded-sm" />
                            <h3 className="text-2xl font-light">{config.couple.bride.fullName}</h3>
                            <p className="text-sm text-slate-500 dark:text-stone-400 transition-colors">{config.couple.bride.parents}</p>
                        </div>
                    </div>
                </section>

                {/* Note: This is a placeholder theme to demonstrate multi-template functionality */}
                <section className="bg-white dark:bg-slate-900 p-12 text-center rounded-sm shadow-sm border border-slate-100 dark:border-white/5 transition-all duration-1000">
                    <h2 className="text-3xl font-light mb-8 italic">Detail Acara</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {config.events.map(event => (
                            <div key={event.id} className="space-y-4">
                                <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400 dark:text-stone-500 transition-colors">{event.title}</h4>
                                <p className="text-lg">{event.day}, {event.date}</p>
                                <p className="text-sm">{event.startTime} - {event.endTime}</p>
                                <div className="h-[1px] w-8 bg-slate-100 dark:bg-slate-800 mx-auto transition-colors"></div>
                                <p className="text-sm font-medium">{event.venue.name}</p>
                                <p className="text-xs text-slate-500 dark:text-stone-400 transition-colors">{event.venue.address}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <MusicPlayer />

            {/* Standardized Floating Utilities */}
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4">
                <MusicController />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <footer className="py-20 text-center border-t border-slate-100 dark:border-white/5 transition-colors">
                <p className="text-xs tracking-widest uppercase text-slate-400 opacity-50">
                    Created with Vowly
                </p>
            </footer>
        </div>
    );
};

export default MinimalistTheme;
