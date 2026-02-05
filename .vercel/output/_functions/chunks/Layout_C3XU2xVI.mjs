import { e as createAstro, f as createComponent, h as addAttribute, n as renderHead, r as renderTemplate, o as renderSlot } from './astro/server_izSyb1tO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */
import { W as WEDDING_CONFIG } from './constants_DNnL6zYp.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = `The Wedding of ${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name}`,
    description = `Kami mengundang Anda untuk hadir di pernikahan kami pada ${WEDDING_CONFIG.events.akad.date}.`,
    image = "/thumbnail.png",
    forceLight = false
  } = Astro2.props;
  const canonicalURL = new URL(
    Astro2.url.pathname,
    Astro2.site || "https://wedding.feyaya.com"
  );
  return renderTemplate`<html lang="id" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- SEO Primary --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Open Graph / Facebook / WhatsApp --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(image, "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(image, "content")}><!-- PWA Theme Color (Sama dengan bg di manifest) --><meta name="theme-color"${addAttribute(forceLight ? "#ffffff" : "#020617", "content")}><!-- PWA Link Manifest (Otomatis digenerate plugin, tapi baiknya didefinisikan untuk fallback) --><link rel="manifest" href="/manifest.webmanifest"><!-- Untuk iOS Safari --><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style"${addAttribute(forceLight ? "default" : "black-translucent", "content")}><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">${renderHead()}</head> <body> ${!forceLight && renderTemplate(_a || (_a = __template(['<script>\n        const theme = (() => {\n          if (\n            typeof localStorage !== "undefined" &&\n            localStorage.getItem("theme")\n          ) {\n            return localStorage.getItem("theme");\n          }\n          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {\n            return "dark";\n          }\n          return "light";\n        })();\n\n        if (theme === "dark") {\n          document.documentElement.classList.add("dark");\n        } else {\n          document.documentElement.classList.remove("dark");\n        }\n      <\/script>'])))} ${forceLight && renderTemplate(_b || (_b = __template(['<script>\n         document.documentElement.classList.remove("dark");\n       <\/script>'])))} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/laragon/www/Undangan-Pernikahan/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
