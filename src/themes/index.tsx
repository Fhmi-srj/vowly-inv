import * as React from "react";
import LuxuryTheme from "./LuxuryTheme";
import MinimalistTheme from "./MinimalistTheme";
import type { ThemeProps } from "./types";

export type ThemeId = "luxury" | "minimalist";

export const ThemeRegistry: Record<ThemeId, React.FC<ThemeProps>> = {
    luxury: LuxuryTheme,
    minimalist: MinimalistTheme,
};

export const getThemeComponent = (themeId: string): React.FC<ThemeProps> => {
    return ThemeRegistry[themeId as ThemeId] || LuxuryTheme;
};

export const AVAILABLE_THEMES = [
    {
        id: "luxury",
        name: "Luxury Premium",
        preview: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
        description: "Desain elegan dengan glassmorphism dan animasi mewah.",
    },
    {
        id: "minimalist",
        name: "Minimalist Clean",
        preview: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
        description: "Bersih, modern, dan fokus pada tipografi yang indah.",
    },
];
