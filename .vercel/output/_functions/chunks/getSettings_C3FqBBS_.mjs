import { s as sql } from './db_DAiex9Tg.mjs';
import { a as WEDDING_TEXT, G as GALLERY_IMAGES, L as LOVE_STORY, B as BANK_ACCOUNTS, W as WEDDING_CONFIG, M as MUSIC_URL, b as MAX_GUESTS } from './constants_DNnL6zYp.mjs';

const defaultSettings = {
  hero_image: WEDDING_CONFIG.hero.image,
  hero_city: WEDDING_CONFIG.hero.city,
  hero_date: "",
  gift_address: "",
  bride_nickname: WEDDING_CONFIG.couple.bride.name,
  bride_fullname: WEDDING_CONFIG.couple.bride.fullName,
  bride_image: WEDDING_CONFIG.couple.bride.image,
  bride_parents: WEDDING_CONFIG.couple.bride.parents,
  bride_instagram: WEDDING_CONFIG.couple.bride.instagram,
  groom_nickname: WEDDING_CONFIG.couple.groom.name,
  groom_fullname: WEDDING_CONFIG.couple.groom.fullName,
  groom_image: WEDDING_CONFIG.couple.groom.image,
  groom_parents: WEDDING_CONFIG.couple.groom.parents,
  groom_instagram: WEDDING_CONFIG.couple.groom.instagram,
  akad_title: WEDDING_CONFIG.events.akad.title,
  akad_day: WEDDING_CONFIG.events.akad.day,
  akad_date: WEDDING_CONFIG.events.akad.date,
  akad_start: WEDDING_CONFIG.events.akad.startTime,
  akad_end: WEDDING_CONFIG.events.akad.endTime,
  akad_iso_start: WEDDING_CONFIG.events.akad.startDateTime.toISOString(),
  akad_iso_end: WEDDING_CONFIG.events.akad.endDateTime.toISOString(),
  akad_venue_name: WEDDING_CONFIG.events.akad.venue.name,
  akad_venue_address: WEDDING_CONFIG.events.akad.venue.address,
  akad_venue_maps: WEDDING_CONFIG.events.akad.venue.mapsEmbedUrl,
  resepsi_title: WEDDING_CONFIG.events.resepsi.title,
  resepsi_day: WEDDING_CONFIG.events.resepsi.day,
  resepsi_date: WEDDING_CONFIG.events.resepsi.date,
  resepsi_start: WEDDING_CONFIG.events.resepsi.startTime,
  resepsi_end: WEDDING_CONFIG.events.resepsi.endTime,
  resepsi_iso_start: WEDDING_CONFIG.events.resepsi.startDateTime.toISOString(),
  resepsi_iso_end: WEDDING_CONFIG.events.resepsi.endDateTime.toISOString(),
  resepsi_venue_name: WEDDING_CONFIG.events.resepsi.venue.name,
  resepsi_venue_address: WEDDING_CONFIG.events.resepsi.venue.address,
  resepsi_venue_maps: WEDDING_CONFIG.events.resepsi.venue.mapsEmbedUrl,
  music_url: MUSIC_URL,
  max_guests: String(MAX_GUESTS),
  bank_accounts: JSON.stringify(BANK_ACCOUNTS),
  love_story: JSON.stringify(LOVE_STORY),
  gallery_images: JSON.stringify(GALLERY_IMAGES),
  closing_family: WEDDING_TEXT.closing.family,
  events_data: "",
  theme_id: "luxury"
};
const formatHeroDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
};
const parseJson = (jsonString, defaultValue) => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
};
const syncWithHeroDate = (dateObj, heroDateStr) => {
  if (!heroDateStr) return dateObj;
  try {
    const [y, m, d] = heroDateStr.split("-").map(Number);
    const result = new Date(dateObj);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      if (dateObj.getFullYear() === 2025 && dateObj.getMonth() === 9 && dateObj.getDate() === 11) {
        result.setFullYear(y, m - 1, d);
      }
    }
    return result;
  } catch {
    return dateObj;
  }
};
async function getSettings(invitationId) {
  try {
    const rows = await sql`
            SELECT setting_key, setting_value FROM invitation_settings
            WHERE invitation_id = ${invitationId}
        `;
    const dbSettings = {};
    rows.forEach((row) => {
      dbSettings[row.setting_key] = row.setting_value;
    });
    const [invitation] = await sql`
            SELECT theme_id FROM invitations WHERE id = ${invitationId}
        `;
    return {
      ...defaultSettings,
      ...dbSettings,
      theme_id: invitation?.theme_id || dbSettings.theme_id || defaultSettings.theme_id
    };
  } catch (error) {
    console.error("Failed to fetch settings from DB for invitation", invitationId, error);
    return defaultSettings;
  }
}
function settingsToConfig(settings) {
  const heroDate = settings.hero_date;
  const items = [];
  if (settings.events_data) {
    try {
      const rawEvents = JSON.parse(settings.events_data);
      rawEvents.forEach((e) => {
        items.push({
          id: e.id,
          title: e.title,
          day: e.day,
          date: e.date,
          startTime: e.startTime,
          endTime: e.endTime,
          startDateTime: e.isoStart ? new Date(e.isoStart) : /* @__PURE__ */ new Date(),
          endDateTime: e.isoEnd ? new Date(e.isoEnd) : /* @__PURE__ */ new Date(),
          venue: {
            name: e.venueName,
            address: e.venueAddress,
            mapsEmbedUrl: e.venueMaps
          }
        });
      });
    } catch {
    }
  }
  if (items.length === 0) {
    if (settings.akad_title || settings.akad_date || heroDate) {
      items.push({
        id: "akad",
        title: settings.akad_title || WEDDING_CONFIG.events.akad.title,
        day: settings.akad_day || (heroDate ? "" : WEDDING_CONFIG.events.akad.day),
        date: settings.akad_date || (heroDate ? formatHeroDate(heroDate) : WEDDING_CONFIG.events.akad.date),
        startTime: settings.akad_start || WEDDING_CONFIG.events.akad.startTime,
        endTime: settings.akad_end || WEDDING_CONFIG.events.akad.endTime,
        startDateTime: syncWithHeroDate(settings.akad_iso_start ? new Date(settings.akad_iso_start) : WEDDING_CONFIG.events.akad.startDateTime, heroDate),
        endDateTime: syncWithHeroDate(settings.akad_iso_end ? new Date(settings.akad_iso_end) : WEDDING_CONFIG.events.akad.endDateTime, heroDate),
        venue: {
          name: settings.akad_venue_name || WEDDING_CONFIG.events.akad.venue.name,
          address: settings.akad_venue_address || WEDDING_CONFIG.events.akad.venue.address,
          mapsEmbedUrl: settings.akad_venue_maps || WEDDING_CONFIG.events.akad.venue.mapsEmbedUrl
        }
      });
    }
    if (settings.resepsi_title || settings.resepsi_date) {
      items.push({
        id: "resepsi",
        title: settings.resepsi_title || WEDDING_CONFIG.events.resepsi.title,
        day: settings.resepsi_day || WEDDING_CONFIG.events.resepsi.day,
        date: settings.resepsi_date || WEDDING_CONFIG.events.resepsi.date,
        startTime: settings.resepsi_start || WEDDING_CONFIG.events.resepsi.startTime,
        endTime: settings.resepsi_end || WEDDING_CONFIG.events.resepsi.endTime,
        startDateTime: syncWithHeroDate(settings.resepsi_iso_start ? new Date(settings.resepsi_iso_start) : WEDDING_CONFIG.events.resepsi.startDateTime, heroDate),
        endDateTime: syncWithHeroDate(settings.resepsi_iso_end ? new Date(settings.resepsi_iso_end) : WEDDING_CONFIG.events.resepsi.endDateTime, heroDate),
        venue: {
          name: settings.resepsi_venue_name || WEDDING_CONFIG.events.resepsi.venue.name,
          address: settings.resepsi_venue_address || WEDDING_CONFIG.events.resepsi.venue.address,
          mapsEmbedUrl: settings.resepsi_venue_maps || WEDDING_CONFIG.events.resepsi.venue.mapsEmbedUrl
        }
      });
    }
  }
  if (items.length === 0) {
    items.push({
      id: "akad",
      title: WEDDING_CONFIG.events.akad.title,
      day: WEDDING_CONFIG.events.akad.day,
      date: WEDDING_CONFIG.events.akad.date,
      startTime: WEDDING_CONFIG.events.akad.startTime,
      endTime: WEDDING_CONFIG.events.akad.endTime,
      startDateTime: WEDDING_CONFIG.events.akad.startDateTime,
      endDateTime: WEDDING_CONFIG.events.akad.endDateTime,
      venue: WEDDING_CONFIG.events.akad.venue
    });
  }
  const heroDisplayDate = heroDate ? formatHeroDate(heroDate) : items[0].date;
  return {
    couple: {
      bride: {
        name: settings.bride_nickname,
        fullName: settings.bride_fullname,
        parents: settings.bride_parents,
        instagram: settings.bride_instagram,
        image: settings.bride_image
      },
      groom: {
        name: settings.groom_nickname,
        fullName: settings.groom_fullname,
        parents: settings.groom_parents,
        instagram: settings.groom_instagram,
        image: settings.groom_image
      }
    },
    events: items,
    hero: {
      image: settings.hero_image,
      city: settings.hero_city,
      date: heroDisplayDate,
      heroDateRaw: heroDate || ""
    },
    musicUrl: settings.music_url,
    maxGuests: parseInt(settings.max_guests, 10),
    bankAccounts: parseJson(settings.bank_accounts, BANK_ACCOUNTS),
    loveStory: parseJson(settings.love_story, LOVE_STORY),
    galleryImages: parseJson(settings.gallery_images, GALLERY_IMAGES),
    closingFamily: settings.closing_family,
    themeId: settings.theme_id || "luxury"
  };
}

export { defaultSettings as d, getSettings as g, settingsToConfig as s };
