import * as React from "react";
import { useEffect } from "react";
import Hero from "../components/Invitation/Storyboard/Hero";
import CoupleProfile from "../components/Invitation/Storyboard/CoupleProfile";
import EventDetails from "../components/Invitation/Storyboard/EventDetails";
import LoveStory from "../components/Invitation/Storyboard/LoveStory";
import Gallery from "../components/Invitation/Storyboard/Gallery";
import RSVPForm from "../components/Invitation/Storyboard/RSVPForm";
import Wishes from "../components/Invitation/Storyboard/Wishes";
import GiftInfo from "../components/Invitation/Storyboard/GiftInfo";
import Navbar from "../components/Invitation/Storyboard/Navbar";
import Envelope from "../components/Invitation/Storyboard/Envelope";

import MusicPlayer from "../components/Invitation/Shared/MusicPlayer";
import MusicController from "../components/Invitation/Shared/MusicController";
import AutoScrollController from "../components/Invitation/Shared/AutoScrollController";
import InstallPrompt from "../components/Invitation/Shared/InstallPrompt";

import { useSettings } from "../contexts/SettingsContext";
import type { ThemeProps } from "./types";

const StoryboardTheme: React.FC<ThemeProps> = ({ theme, toggleTheme, isOpened, onOpen }) => {
    useEffect(() => {
        if (isOpened) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [isOpened]);

    return (
        <div className={`storyboard-theme ${theme === "dark" ? "dark" : ""}`}>
            {/* Global Comic Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-[9999] bg-[radial-gradient(#000_2px,transparent_2px)] dark:bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:25px_25px] transition-all duration-1000"></div>

            {!isOpened && <Envelope onOpen={onOpen} />}

            <main className={`transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpened ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"}`}>
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

export default StoryboardTheme;
