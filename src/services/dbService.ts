import type { RSVP, Wish } from "../types";

let rsvpCache: { data: RSVP[]; timestamp: number } | null = null;
let wishesCache: { data: Wish[]; timestamp: number } | null = null;

const CACHE_DURATION = 30 * 1000;

export const dbService = {
  async initializeDemo() { },

  async getRSVPs(invitationId: number): Promise<RSVP[]> {
    const now = Date.now();

    // Cache key could include invitationId if we want to be safe
    // But usually only one invitation is loaded at a time in the browser
    if (rsvpCache && now - rsvpCache.timestamp < CACHE_DURATION) {
      return rsvpCache.data;
    }

    try {
      const response = await fetch(`/api/rsvp?invitationId=${invitationId}`);
      if (!response.ok) throw new Error("Failed to fetch RSVPs");
      const data = await response.json();

      rsvpCache = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async saveRSVP(invitationId: number, data: Omit<RSVP, "id" | "created_at">): Promise<RSVP> {
    rsvpCache = null;

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, invitationId }),
    });
    if (!response.ok) throw new Error("Failed to save RSVP");
    return {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
  },

  async getWishes(invitationId: number): Promise<Wish[]> {
    const now = Date.now();
    if (wishesCache && now - wishesCache.timestamp < CACHE_DURATION) {
      return wishesCache.data;
    }

    try {
      const response = await fetch(`/api/wishes?invitationId=${invitationId}`);
      if (!response.ok) throw new Error("Failed to fetch wishes");
      const data = await response.json();
      wishesCache = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async saveWish(invitationId: number, data: { name: string; message: string; sticker?: string }): Promise<Wish> {
    wishesCache = null;
    const response = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, invitationId }),
    });
    if (!response.ok) throw new Error("Failed to save wish");
    return {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
  },
};
