const REGISTRATION_PACKAGES = {
  lite: {
    id: "lite",
    name: "Lite",
    price: 0,
    originalPrice: 5e4,
    features: ["1 Tema Pilihan", "Masa Aktif 3 Hari", "RSVP Dasar", "Maksimal 20 Tamu"]
  },
  basic: {
    id: "basic",
    name: "Basic",
    price: 49e3,
    originalPrice: 99e3,
    features: ["3 Tema Pilihan", "Masa Aktif 1 Tahun", "RSVP & Ucapan", "Maksimal 100 Tamu", "Galeri Foto (5)"]
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 149e3,
    originalPrice: 249e3,
    features: ["Semua Tema", "Masa Aktif Selamanya", "RSVP & Ucapan Pro", "Tamu Tanpa Batas", "Galeri Foto & Video", "Musik Latar Custom", "Tanpa Watermark"]
  },
  royal: {
    id: "royal",
    name: "Royal",
    price: 299e3,
    originalPrice: 499e3,
    features: ["Semua Fitur Premium", "Domain Custom (.com/.id)*", "Prioritas Support", "Desain Custom Ringkas", "QR Code Check-in", "E-Guest Book"]
  }
};
const getFeatureLimits = (packageId) => {
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
        hasCustomDomain: false
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
        hasCustomDomain: false
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
        hasCustomDomain: false
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
        hasCustomDomain: true
      };
    default:
      return getFeatureLimits("lite");
  }
};

export { REGISTRATION_PACKAGES as R, getFeatureLimits as g };
