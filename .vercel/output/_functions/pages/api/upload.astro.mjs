import fs from 'fs';
import path from 'path';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_AKAD_DATE": "11 Oktober 2025", "PUBLIC_AKAD_DAY": "Minggu", "PUBLIC_AKAD_END": "10:00", "PUBLIC_AKAD_ISO_END": "2025-10-11T10:00:00+07:00", "PUBLIC_AKAD_ISO_START": "2025-10-11T08:00:00+07:00", "PUBLIC_AKAD_START": "08:00", "PUBLIC_AKAD_TITLE": "Akad Nikah", "PUBLIC_BANK_ACCOUNTS": "[{\"bank\":\"Bank BCA\",\"number\":\"1234567890\",\"name\":\"Fera Oktapia\"},{\"bank\":\"Bank Mandiri\",\"number\":\"0987654321\",\"name\":\"Yahya Zulfikri\"}]", "PUBLIC_BRIDE_FULLNAME": "Fera Oktapia", "PUBLIC_BRIDE_IMAGE": "https://placehold.co/600x800?text=Fey+Portrait", "PUBLIC_BRIDE_INSTAGRAM": "feraoktapia___", "PUBLIC_BRIDE_NICKNAME": "Fey", "PUBLIC_BRIDE_PARENTS": "Putri tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]", "PUBLIC_GALLERY_IMAGES": "[\"https://placehold.co/800x1200?text=Moment+1\",\"https://placehold.co/1200x800?text=Moment+2\",\"https://placehold.co/800x800?text=Moment+3\",\"https://placehold.co/800x1200?text=Moment+4\",\"https://placehold.co/1200x800?text=Moment+5\",\"https://placehold.co/800x1200?text=Moment+6\"]", "PUBLIC_GROOM_FULLNAME": "Yahya Zulfikri", "PUBLIC_GROOM_IMAGE": "https://placehold.co/600x800?text=Yaya+Portrait", "PUBLIC_GROOM_INSTAGRAM": "zulfikriyahya_", "PUBLIC_GROOM_NICKNAME": "Yaya", "PUBLIC_GROOM_PARENTS": "Putra tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]", "PUBLIC_HERO_CITY": "Kab. Pandeglang, Banten", "PUBLIC_HERO_IMAGE": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop", "PUBLIC_LOVE_STORY": "[{\"date\":\"2020\",\"title\":\"Awal Pertemuan\",\"desc\":\"Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna.\"},{\"date\":\"2022\",\"title\":\"Menjalin Harapan\",\"desc\":\"Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya.\"},{\"date\":\"2025\",\"title\":\"Ikatan Suci\",\"desc\":\"Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan.\"}]", "PUBLIC_MUSIC_URL": "https://www.bensound.com/bensound-music/bensound-forever.mp3", "PUBLIC_RESEPSI_DATE": "11 Oktober 2025", "PUBLIC_RESEPSI_DAY": "Minggu", "PUBLIC_RESEPSI_END": "14:00", "PUBLIC_RESEPSI_ISO_END": "2025-10-11T14:00:00+07:00", "PUBLIC_RESEPSI_ISO_START": "2025-10-11T11:00:00+07:00", "PUBLIC_RESEPSI_START": "11:00", "PUBLIC_RESEPSI_TITLE": "Resepsi Pernikahan", "PUBLIC_RSVP_MAX_GUESTS": "20", "PUBLIC_VENUE_ADDRESS": "Jl. Taman Makam Pahlawan No.1, Kab. Pandeglang, Banten", "PUBLIC_VENUE_LAT": "-6.2088", "PUBLIC_VENUE_LNG": "106.8456", "PUBLIC_VENUE_NAME": "The Royal Azure Ballroom", "SITE": "https://undangan-pernikahan.vercel.app", "SSR": true};
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "audio/mp3", "audio/wav"];
const UPLOAD_DIR = "public/uploads";
const POST = async ({ request, cookies }) => {
  const auth = cookies.get("wedding_admin_auth")?.value;
  if (auth !== "true") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400
      });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" }),
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Max 5MB allowed" }),
        { status: 400 }
      );
    }
    const CLOUD_NAME = Object.assign(__vite_import_meta_env__, { OS: process.env.OS, Path: process.env.Path })?.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = Object.assign(__vite_import_meta_env__, { OS: process.env.OS, Path: process.env.Path })?.CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
    if (CLOUD_NAME && UPLOAD_PRESET) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", UPLOAD_PRESET);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: cloudinaryFormData
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        return new Response(JSON.stringify({ success: true, url: data.secure_url }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
    }
    if (process.env.VERCEL) {
      return new Response(JSON.stringify({
        error: "Cannot upload to local disk on Vercel. Please configure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET."
      }), {
        status: 500
      });
    }
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadPath, filename);
    fs.writeFileSync(filePath, buffer);
    const url = `/uploads/${filename}`;
    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message || "Upload failed" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
