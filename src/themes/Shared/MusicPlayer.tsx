import { useEffect, useRef } from "react";
import type { FC } from "react";
import { useSettings } from "../../contexts/SettingsContext";

const MusicPlayer: FC = () => {
  const { config } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      audio.play().catch(err => console.warn("Autoplay prevented", err));
    };

    const handlePause = () => {
      audio.pause();
    };

    const handleToggle = () => {
      if (audio.paused) {
        handlePlay();
      } else {
        handlePause();
      }
    };

    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("pause-wedding-music", handlePause);
    window.addEventListener("toggle-wedding-music", handleToggle);

    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("pause-wedding-music", handlePause);
      window.removeEventListener("toggle-wedding-music", handleToggle);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={config.musicUrl}
      preload="auto"
      loop
      className="hidden"
    />
  );
};

export default MusicPlayer;
