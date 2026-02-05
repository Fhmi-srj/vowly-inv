import { e as createAstro, f as createComponent, n as renderHead, k as renderComponent, h as addAttribute, o as renderSlot, l as renderScript, r as renderTemplate } from './astro/server_izSyb1tO.mjs';
import 'piccolore';
/* empty css                         */
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { Heart, X, LayoutDashboard, Settings, User, Users, MessageCircle, QrCode, Printer, LogOut, Menu } from 'lucide-react';

const activeTabStore = atom("overview");
function setActiveTab(tab) {
  activeTabStore.set(tab);
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.pushState({}, "", url.toString());
}

const Sidebar = ({ invitationId, userName, initialTab }) => {
  const $activeTab = useStore(activeTabStore);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (initialTab) {
      activeTabStore.set(initialTab);
    }
  }, [initialTab]);
  const handleNavClick = (tab, e) => {
    if (invitationId && window.location.pathname.includes("/dashboard/manage/")) {
      e.preventDefault();
      setActiveTab(tab);
      setIsOpen(false);
    }
  };
  const getLink = (tab) => {
    if (invitationId) {
      return `/dashboard/manage/${invitationId}?tab=${tab}`;
    }
    return `/dashboard?tab=${tab}`;
  };
  const navItems = [
    { id: "overview", label: "Ringkasan", icon: LayoutDashboard }
  ];
  const manageItems = invitationId ? [
    { id: "rsvp", label: "Data RSVP", icon: Users },
    { id: "wishes", label: "Ucapan & Doa", icon: MessageCircle },
    { id: "qr", label: "QR Generator", icon: QrCode },
    { id: "pdf", label: "Design PDF", icon: Printer }
  ] : [];
  const accountItems = [
    { id: "settings", label: "Pengaturan", icon: Settings },
    { id: "profile", label: "Profil Saya", icon: User }
  ];
  const renderLink = (item) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: getLink(item.id),
      onClick: (e) => handleNavClick(item.id, e),
      className: `flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold transition-all ${$activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"}`,
      children: [
        /* @__PURE__ */ jsx(item.icon, { size: 18 }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: item.label })
      ]
    },
    item.id
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden ${isOpen ? "block" : "hidden"}`,
        onClick: () => setIsOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: `fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(Heart, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-serif italic font-bold", children: "Vowly" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg",
                children: /* @__PURE__ */ jsx(X, { size: 24 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 mb-2 mt-4", children: "Menu Utama" }),
            navItems.map(renderLink),
            invitationId && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "mt-4" }),
              manageItems.map(renderLink)
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 mb-2 mt-8", children: "Akun & Sistem" }),
            accountItems.map(renderLink)
          ] }),
          /* @__PURE__ */ jsx("form", { action: "/api/auth/logout", method: "POST", className: "mt-auto", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all", children: [
            /* @__PURE__ */ jsx(LogOut, { size: 20 }),
            /* @__PURE__ */ jsx("span", { children: "Log Out" })
          ] }) })
        ] })
      }
    ),
    typeof window !== "undefined" && window.toggleSidebar === void 0 && /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `window.toggleSidebar = () => { window.dispatchEvent(new CustomEvent('toggle-sidebar')); }` } }),
    useEffect(() => {
      const handler = () => setIsOpen(!isOpen);
      window.addEventListener("toggle-sidebar", handler);
      return () => window.removeEventListener("toggle-sidebar", handler);
    }, [isOpen])
  ] });
};

const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$UserLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UserLayout;
  const {
    title = "Dashboard - Vowly",
    invitationId,
    activeTab = "overview",
    userName,
    userPhone
  } = Astro2.props;
  const userData = {
    name: userName || "Buyer Name"};
  return renderTemplate`<html lang="id"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100"> <div class="flex min-h-screen"> <!-- SPA Sidebar --> ${renderComponent($$result, "Sidebar", Sidebar, { "client:load": true, "invitationId": invitationId, "userName": userData.name, "initialTab": activeTab, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Dashboard/Sidebar", "client:component-export": "default" })} <!-- Main Content --> <main class="flex-1 lg:ml-72 min-h-screen"> <!-- Header --> <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-8 h-20 flex items-center justify-between"> <div class="flex items-center gap-4"> <button id="open-sidebar" class="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"> ${renderComponent($$result, "Menu", Menu, { "size": 24 })} </button> <h1 class="text-xl font-bold tracking-tight">${title}</h1> </div> <div class="flex items-center gap-4"> <div class="text-right hidden sm:block"> <p class="text-sm font-bold">${userData.name}</p> <p class="text-[10px] text-slate-400 uppercase tracking-widest font-black">USER / PEMBELI</p> </div> <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border-2 border-primary/20"> <img${addAttribute(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`, "src")} alt="avatar"> </div> </div> </header> <div class="p-8"> ${renderSlot($$result, $$slots["default"])} </div> </main> </div> ${renderScript($$result, "C:/laragon/www/Undangan-Pernikahan/src/layouts/UserLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/laragon/www/Undangan-Pernikahan/src/layouts/UserLayout.astro", void 0);

export { $$UserLayout as $, activeTabStore as a };
