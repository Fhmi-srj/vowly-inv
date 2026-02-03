import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Rustic/Hero";
import CoupleProfile from "../components/Invitation/Rustic/CoupleProfile";
import EventDetails from "../components/Invitation/Rustic/EventDetails";
import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import Envelope from "../components/Invitation/Rustic/Envelope";
import { useSettings } from "../contexts/SettingsContext";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";
import type { ThemeProps } from "./types";

import Gallery from "../components/Invitation/Rustic/Gallery";
import LoveStory from "../components/Invitation/Rustic/LoveStory";
import RSVPForm from "../components/Invitation/Rustic/RSVPForm";
import Wishes from "../components/Invitation/Rustic/Wishes";
import GiftInfo from "../components/Invitation/Rustic/GiftInfo";
import Navbar from "../components/Invitation/Rustic/Navbar";

const RusticTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`rustic-theme ${theme === "dark" ? "dark" : ""}`}>
            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-opacity duration-1000 ${isOpened ? "opacity-100" : "opacity-0"}`}>
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

export default RusticTheme;
