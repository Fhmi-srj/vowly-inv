const parseJson = (jsonString, defaultValue) => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("Failed to parse JSON env:", e);
    return defaultValue;
  }
};
const MAX_GUESTS = parseInt(
  "20",
  10
);
const MUSIC_URL = "https://www.bensound.com/bensound-music/bensound-forever.mp3";
const WEDDING_TEXT = {
  // 1. Salam Pembuka (Hero / Profile)
  opening: {
    salam: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
    intro: "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkai kasih sayang yang Engkau ciptakan ini dalam ikatan suci pernikahan."
  },
  // 2. Ayat Suci / Quotes (Ar-Rum: 21 adalah standar emas yang penuh doa)
  quote: {
    ar_rum: `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`,
    source: "QS. Ar-Rum: 21"
  },
  // 3. Kalimat Undangan (Sangat Rendah Hati)
  invitation: "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, kawan, dan sahabat, untuk memberikan doa restu pada acara pernikahan kami:",
  // 4. Penutup (Footer)
  closing: {
    text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.",
    salam: "Wassalamu’alaikum Warahmatullahi Wabarakatuh",
    signature: "Kami yang berbahagia,",
    family: "Kel. Bpk [Ayah Pria] & Kel. Bpk [Ayah Wanita]"
  },
  // 5. Disclaimer Kado (Halus & Sopan)
  gift: {
    title: "Tanda Kasih",
    desc: "Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami. Namun, jika Anda ingin memberikan tanda kasih dalam bentuk lain, kami menerimanya dengan segala kerendahan hati."
  }
};
const WEDDING_CONFIG = {
  couple: {
    bride: {
      name: "Fey",
      fullName: "Fera Oktapia",
      parents: "Putri tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
      instagram: "feraoktapia___",
      image: "https://placehold.co/600x800?text=Fey+Portrait"
    },
    groom: {
      name: "Yaya",
      fullName: "Yahya Zulfikri",
      parents: "Putra tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
      instagram: "zulfikriyahya_",
      image: "https://placehold.co/600x800?text=Yaya+Portrait"
    }
  },
  events: {
    akad: {
      title: "Akad Nikah",
      day: "Minggu",
      date: "11 Oktober 2025",
      startTime: "08:00",
      endTime: "10:00",
      startDateTime: /* @__PURE__ */ new Date(
        "2025-10-11T08:00:00+07:00"
      ),
      endDateTime: /* @__PURE__ */ new Date(
        "2025-10-11T10:00:00+07:00"
      ),
      venue: {
        name: "The Royal Azure Ballroom",
        address: "Jl. Elok No. 77",
        mapsEmbedUrl: "https://maps.google.com/maps?q=-6.2088,106.8456&output=embed"
      }
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      day: "Minggu",
      date: "11 Oktober 2025",
      startTime: "11:00",
      endTime: "14:00",
      startDateTime: /* @__PURE__ */ new Date(
        "2025-10-11T11:00:00+07:00"
      ),
      endDateTime: /* @__PURE__ */ new Date(
        "2025-10-11T14:00:00+07:00"
      ),
      venue: {
        name: "The Royal Azure Ballroom",
        address: "Jl. Elok No. 77",
        mapsEmbedUrl: "https://maps.google.com/maps?q=-6.2088,106.8456&output=embed"
      }
    }
  },
  hero: {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    city: "Kab. Pandeglang, Banten"
  }
};
const LOVE_STORY = parseJson('[{"date":"2020","title":"Awal Pertemuan","desc":"Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna."},{"date":"2022","title":"Menjalin Harapan","desc":"Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya."},{"date":"2025","title":"Ikatan Suci","desc":"Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan."}]', [
  {
    date: "Musim Gugur, 2020",
    title: "Pertemuan Pertama",
    desc: "Berawal dari sebuah diskusi kecil..."
  }
]);
const BANK_ACCOUNTS = parseJson('[{"bank":"Bank BCA","number":"1234567890","name":"Fera Oktapia"},{"bank":"Bank Mandiri","number":"0987654321","name":"Yahya Zulfikri"}]', [
  { bank: "Bank BCA", number: "1234567890", name: "Fera Oktapia" }
]);
const GALLERY_IMAGES = parseJson('["https://placehold.co/800x1200?text=Moment+1","https://placehold.co/1200x800?text=Moment+2","https://placehold.co/800x800?text=Moment+3","https://placehold.co/800x1200?text=Moment+4","https://placehold.co/1200x800?text=Moment+5","https://placehold.co/800x1200?text=Moment+6"]', [
  "https://placehold.co/450x800",
  "https://placehold.co/450x800"
]);

export { BANK_ACCOUNTS as B, GALLERY_IMAGES as G, LOVE_STORY as L, MUSIC_URL as M, WEDDING_CONFIG as W, WEDDING_TEXT as a, MAX_GUESTS as b };
