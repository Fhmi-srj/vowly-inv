import * as React from "react";

export interface ThemeProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
    isOpened: boolean;
    onOpen: () => void;
}
