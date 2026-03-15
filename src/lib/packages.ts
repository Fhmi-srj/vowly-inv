export const REGISTRATION_PACKAGES = {
    lite: {
        id: "lite",
        name: "Lite",
        price: 0,
        originalPrice: 50000,
        features: ["1 Tema Pilihan", "Masa Aktif 3 Hari", "RSVP Dasar", "Maksimal 20 Tamu"]
    },
    basic: {
        id: "basic",
        name: "Basic",
        price: 49000,
        originalPrice: 99000,
        features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan", "Maksimal 100 Tamu", "Galeri Foto (5)"]
    },
    premium: {
        id: "premium",
        name: "Premium",
        price: 149000,
        originalPrice: 249000,
        features: ["Semua Tema", "Masa Aktif Selamanya", "RSVP & Ucapan Pro", "Tamu Tanpa Batas", "Galeri Foto & Video", "Musik Latar Custom", "Tanpa Watermark"]
    },
    royal: {
        id: "royal",
        name: "Royal",
        price: 299000,
        originalPrice: 499000,
        features: ["Semua Fitur Premium", "Domain Custom (.com/.id)*", "Prioritas Support", "Desain Custom Ringkas", "QR Code Check-in", "E-Guest Book"]
    }
};

export type PackageId = keyof typeof REGISTRATION_PACKAGES;

export interface FeatureLimits {
    maxThemes: number;
    maxGuests: number;
    maxGalleryImages: number;
    hasWatermark: boolean;
    hasMusic: boolean;
    hasVideo: boolean;
    hasRSVPCustom: boolean;
    hasRSVPWishes: boolean;
    hasEBook: boolean;
    hasQRCode: boolean;
    hasCustomDomain: boolean;
}

export const getFeatureLimits = (packageId: PackageId | string): FeatureLimits => {
    switch (packageId) {
        case "lite":
            return {
                maxThemes: 1,
                maxGuests: 20,
                maxGalleryImages: 0,
                hasWatermark: true,
                hasMusic: false,
                hasVideo: false,
                hasRSVPCustom: false,
                hasRSVPWishes: false,
                hasEBook: false,
                hasQRCode: false,
                hasCustomDomain: false,
            };
        case "basic":
            return {
                maxThemes: 3,
                maxGuests: 100,
                maxGalleryImages: 5,
                hasWatermark: true,
                hasMusic: true,
                hasVideo: false,
                hasRSVPCustom: false,
                hasRSVPWishes: true,
                hasEBook: false,
                hasQRCode: false,
                hasCustomDomain: false,
            };
        case "premium":
            return {
                maxThemes: 99,
                maxGuests: 9999,
                maxGalleryImages: 20,
                hasWatermark: false,
                hasMusic: true,
                hasVideo: true,
                hasRSVPCustom: true,
                hasRSVPWishes: true,
                hasEBook: false,
                hasQRCode: false,
                hasCustomDomain: false,
            };
        case "royal":
            return {
                maxThemes: 99,
                maxGuests: 9999,
                maxGalleryImages: 50,
                hasWatermark: false,
                hasMusic: true,
                hasVideo: true,
                hasRSVPCustom: true,
                hasRSVPWishes: true,
                hasEBook: true,
                hasQRCode: true,
                hasCustomDomain: true,
            };
        default:
            return getFeatureLimits("lite");
    }
};
