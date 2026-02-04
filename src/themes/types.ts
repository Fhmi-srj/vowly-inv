import * as React from "react";

export interface ThemeProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
    isOpened: boolean;
    onOpen: () => void;
}

export type ThemeId =
    | "luxury"
    | "minimalist"
    | "rustic"
    | "floral"
    | "boho"
    | "monokrom"
    | "vibrant"
    | "dark-elegant"
    | "royal"
    | "islamic"
    | "vintage"
    | "storyboard";
