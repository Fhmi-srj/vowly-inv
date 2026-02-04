import { useEffect, useState } from "react";
import type { FC } from "react";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import InstallPrompt from "./themes/Shared/InstallPrompt";
import { getThemeComponent } from "./themes";

// Inner component that uses the settings context
const AppContent: FC = () => {
  const { config } = useSettings();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as "light" | "dark";
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    // Sync browser tab title with bride & groom names
    if (config?.couple?.groom?.name && config?.couple?.bride?.name) {
      document.title = `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}`;
    }
  }, [config]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const apply = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(apply);
    } else {
      apply();
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const ThemeComponent = getThemeComponent(config.themeId);

  // Safety check for events
  if (!Array.isArray(config.events)) {
    console.error("🚨 [App] config.events is not an array!", config.events);
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 p-6 text-center text-red-800">
        <div>
          <h1 className="text-2xl font-bold">Data Error</h1>
          <p>Format data acara tidak valid. Hubungi admin.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <InstallPrompt />
      <ThemeComponent
        theme={theme}
        toggleTheme={toggleTheme}
        isOpened={isOpened}
        onOpen={handleOpenInvitation}
      />
    </>
  );
};

// Main App component wrapped with SettingsProvider
const App: FC<{ invitationId?: number; initialConfig?: any }> = ({ invitationId, initialConfig }) => {
  return (
    <SettingsProvider invitationId={invitationId} initialConfig={initialConfig}>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
