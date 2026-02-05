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
