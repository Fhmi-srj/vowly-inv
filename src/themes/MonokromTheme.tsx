import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Monokrom/Hero";
import CoupleProfile from "../components/Invitation/Monokrom/CoupleProfile";
import EventDetails from "../components/Invitation/Monokrom/EventDetails";
import LoveStory from "../components/Invitation/Monokrom/LoveStory";
import Gallery from "../components/Invitation/Monokrom/Gallery";
import RSVPForm from "../components/Invitation/Monokrom/RSVPForm";
import Wishes from "../components/Invitation/Monokrom/Wishes";
import GiftInfo from "../components/Invitation/Monokrom/GiftInfo";
import Navbar from "../components/Invitation/Monokrom/Navbar";
import Envelope from "../components/Invitation/Monokrom/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const MonokromTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`monokrom-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100" : "opacity-0 scale-95 pointer-events-none"}`}>
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

export default MonokromTheme;
