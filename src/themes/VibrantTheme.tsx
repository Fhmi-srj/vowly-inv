import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Vibrant/Hero";
import CoupleProfile from "../components/Invitation/Vibrant/CoupleProfile";
import EventDetails from "../components/Invitation/Vibrant/EventDetails";
import LoveStory from "../components/Invitation/Vibrant/LoveStory";
import Gallery from "../components/Invitation/Vibrant/Gallery";
import RSVPForm from "../components/Invitation/Vibrant/RSVPForm";
import Wishes from "../components/Invitation/Vibrant/Wishes";
import GiftInfo from "../components/Invitation/Vibrant/GiftInfo";
import Navbar from "../components/Invitation/Vibrant/Navbar";
import Envelope from "../components/Invitation/Vibrant/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const VibrantTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`vibrant-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpened ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-50 pointer-events-none"}`}>
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

export default VibrantTheme;
