import type { FC } from "react";
import LuxuryTheme from "./Luxury";
import MinimalistTheme from "./Minimalist";
import RusticTheme from "./Rustic";
import FloralTheme from "./Floral";
import BohoTheme from "./Boho";
import MonokromTheme from "./Monokrom";
import VibrantTheme from "./Vibrant";
import DarkElegantTheme from "./DarkElegant";
import RoyalTheme from "./Royal";
import IslamicTheme from "./Islamic";
import VintageTheme from "./Vintage";
import StoryboardTheme from "./Storyboard";
import type { ThemeProps, ThemeId } from "./types";

export const ThemeRegistry: Record<ThemeId, FC<ThemeProps>> = {
    luxury: LuxuryTheme,
    minimalist: MinimalistTheme,
    rustic: RusticTheme,
    floral: FloralTheme,
    boho: BohoTheme,
    monokrom: MonokromTheme,
    vibrant: VibrantTheme,
    "dark-elegant": DarkElegantTheme,
    royal: RoyalTheme,
    islamic: IslamicTheme,
    vintage: VintageTheme,
    storyboard: StoryboardTheme,
};

export const getThemeComponent = (themeId: string): FC<ThemeProps> => {
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
    {
        id: "rustic",
        name: "Rustic Earth",
        preview: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
        description: "Tekstur kayu, warna bumi, dan nuansa alam yang hangat.",
    },
    {
        id: "floral",
        name: "Floral Bloom",
        preview: "https://images.unsplash.com/photo-1549646876-0f8982468d6c?q=80&w=800&auto=format&fit=crop",
        description: "Ilustrasi bunga cat air yang romantis dan lembut.",
    },
    {
        id: "boho",
        name: "Bohemian Soul",
        preview: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?q=80&w=600&auto=format&fit=crop",
        description: "Etnik, macrame, dan palet warna terracotta yang berjiwa bebas.",
    },
    {
        id: "monokrom",
        name: "Modern Monokrom",
        preview: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
        description: "Minimalis kontras tinggi dengan tipografi bold yang urban.",
    },
    {
        id: "vibrant",
        name: "Vibrant / Fun",
        preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
        description: "Energi pop-art, warna cerah, dan animasi yang menyenangkan.",
    },
    {
        id: "dark-elegant",
        name: "Dark Elegant",
        preview: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
        description: "Kemewahan emerald dan emas dalam balutan dark mode premium.",
    },
    {
        id: "royal",
        name: "Royal Heritage",
        preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
        description: "Keagungan warisan budaya dengan motif Batik dan warna emas.",
    },
    {
        id: "islamic",
        name: "Islamic Modern",
        preview: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop",
        description: "Nuansa spiritual yang sejuk dengan pola Arabesque modern.",
    },
    {
        id: "vintage",
        name: "Vintage / Retro",
        preview: "https://images.unsplash.com/photo-1455134168668-40a762acc615?q=80&w=600&auto=format&fit=crop",
        description: "Nostalgia fotografi analog dan tekstur kertas tua yang klasik.",
    },
    {
        id: "storyboard",
        name: "Storyboard",
        preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
        description: "Ceritakan perjalanan cinta Anda dalam format komik yang artistik.",
    },
];
