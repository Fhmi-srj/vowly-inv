import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/DarkElegant/Hero";
import CoupleProfile from "../components/Invitation/DarkElegant/CoupleProfile";
import EventDetails from "../components/Invitation/DarkElegant/EventDetails";
import LoveStory from "../components/Invitation/DarkElegant/LoveStory";
import Gallery from "../components/Invitation/DarkElegant/Gallery";
import RSVPForm from "../components/Invitation/DarkElegant/RSVPForm";
import Wishes from "../components/Invitation/DarkElegant/Wishes";
import GiftInfo from "../components/Invitation/DarkElegant/GiftInfo";
import Navbar from "../components/Invitation/DarkElegant/Navbar";
import Envelope from "../components/Invitation/DarkElegant/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const DarkElegantTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`dark-elegant-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-[2s] ease-in-out ${isOpened ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-3xl scale-125 pointer-events-none"}`}>
                <Hero />
                <CoupleProfile />
                <LoveStory />
                <EventDetails />
                <Gallery />
                <GiftInfo />
                <RSVPForm />
                <Wishes />
            </main>

            {/* Standardized Floating Utilities */}
            <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 flex flex-col items-center gap-4 px-4">
                <MusicController />
                <AutoScrollController isOpened={isOpened} />
            </div>

            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <MusicPlayer />
            <InstallPrompt />
        </div>
    );
};

export default DarkElegantTheme;
