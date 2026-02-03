import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Royal/Hero";
import CoupleProfile from "../components/Invitation/Royal/CoupleProfile";
import EventDetails from "../components/Invitation/Royal/EventDetails";
import LoveStory from "../components/Invitation/Royal/LoveStory";
import Gallery from "../components/Invitation/Royal/Gallery";
import RSVPForm from "../components/Invitation/Royal/RSVPForm";
import Wishes from "../components/Invitation/Royal/Wishes";
import GiftInfo from "../components/Invitation/Royal/GiftInfo";
import Navbar from "../components/Invitation/Royal/Navbar";
import Envelope from "../components/Invitation/Royal/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const RoyalTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`royal-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-[1.5s] ease-in-out ${isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`}>
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

export default RoyalTheme;
