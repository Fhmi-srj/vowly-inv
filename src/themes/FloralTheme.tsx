import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Floral/Hero";
import CoupleProfile from "../components/Invitation/Floral/CoupleProfile";
import EventDetails from "../components/Invitation/Floral/EventDetails";
import LoveStory from "../components/Invitation/Floral/LoveStory";
import Gallery from "../components/Invitation/Floral/Gallery";
import RSVPForm from "../components/Invitation/Floral/RSVPForm";
import Wishes from "../components/Invitation/Floral/Wishes";
import GiftInfo from "../components/Invitation/Floral/GiftInfo";
import Navbar from "../components/Invitation/Floral/Navbar";
import Envelope from "../components/Invitation/Floral/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const FloralTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`floral-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-1000 ${isOpened ? "opacity-100" : "opacity-0 blur-lg scale-95 pointer-events-none"}`}>
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

export default FloralTheme;
