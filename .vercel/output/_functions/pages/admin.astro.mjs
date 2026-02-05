import { e as createAstro, f as createComponent, n as renderHead, k as renderComponent, o as renderSlot, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
/* empty css                                 */
import { Shield, LayoutDashboard, Users, Globe, Palette, CreditCard, LogOut, Loader2, Layout, Activity, ArrowRight, Rocket, Search, MoreVertical, ExternalLink, CheckCircle2, ArrowUpRight, Layers, Bell, Lock, Sparkles } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { $ as $$Layout } from '../chunks/Layout_C3XU2xVI.mjs';
import { s as sql } from '../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../renderers.mjs';

const activeAdminTabStore = atom("overview");
function setActiveAdminTab(tab) {
  activeAdminTabStore.set(tab);
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("view", tab);
    window.history.pushState({}, "", url.toString());
  }
}

const AdminSidebar = () => {
  const activeTab = useStore(activeAdminTabStore);
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Manajemen User", icon: Users },
    { id: "invitations", label: "Semua Undangan", icon: Globe },
    { id: "templates", label: "Template Registry", icon: Palette },
    { id: "payments", label: "Transaksi", icon: CreditCard }
  ];
  return /* @__PURE__ */ jsx("aside", { className: "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20", children: /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-2xl font-serif italic font-bold tracking-tight text-slate-900", children: [
        "Vowly ",
        /* @__PURE__ */ jsx("span", { className: "text-indigo-600 font-sans text-xs not-italic font-black align-top ml-1", children: "PRO" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-2", children: menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveAdminTab(item.id),
          className: `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${isActive ? "bg-slate-50 border border-slate-100 text-indigo-600 font-bold shadow-sm" : "text-slate-500 hover:bg-slate-50"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 20 }),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ]
        },
        item.id
      );
    }) }),
    /* @__PURE__ */ jsx("form", { action: "/api/auth/logout", method: "POST", className: "mt-auto", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all group", children: [
      /* @__PURE__ */ jsx(LogOut, { size: 20 }),
      /* @__PURE__ */ jsx("span", { children: "Log Out" })
    ] }) })
  ] }) });
};

const PlatformOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-black tracking-widest uppercase text-slate-500", children: "Total Pengguna" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold text-slate-900", children: stats?.totalUsers || 0 }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: "+12% dari bulan lalu" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600", children: /* @__PURE__ */ jsx(Layout, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-black tracking-widest uppercase text-slate-500", children: "Undangan Aktif" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold text-slate-900", children: stats?.totalInvitations || 0 }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: "vowly.com/live" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600", children: /* @__PURE__ */ jsx(Activity, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-black tracking-widest uppercase text-slate-500", children: "Registrasi Baru" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold text-slate-900", children: "4" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: "Dalam 24 jam terakhir" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-slate-100 flex items-center justify-between bg-white", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Pengguna Terbaru" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Daftar pendaftar terakhir di platform Anda." })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold transition-all text-slate-600 border border-slate-200 shadow-sm", children: [
          "LIHAT SEMUA ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50/50", children: [
          /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Nama" }),
          /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Kontak" }),
          /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Role" }),
          /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Tanggal Daftar" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: stats?.recentUsers.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-9 w-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100", children: user.full_name?.charAt(0) }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-slate-900", children: user.full_name })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-sm text-slate-500", children: user.phone }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === "admin" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-slate-100 text-slate-500"}`, children: user.role }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-sm text-slate-400", children: new Date(user.created_at).toLocaleDateString() })
        ] }, user.id)) })
      ] }) })
    ] })
  ] });
};

const ComingSoon = ({ title }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner", children: /* @__PURE__ */ jsx(CreditCard, { size: 40, className: "animate-pulse" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif italic font-bold text-slate-900", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-md mx-auto", children: "Fitur ini sedang dalam tahap pengembangan intensif untuk memberikan pengalaman terbaik bagi Anda." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-200", children: [
      /* @__PURE__ */ jsx(Rocket, { size: 14 }),
      " Coming Soon"
    ] })
  ] });
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter(
    (u) => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
  );
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif italic font-bold text-slate-900", children: "Manajemen Pengguna" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm mt-1", children: [
          "Total ",
          users.length,
          " pengguna terdaftar di platform."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari nama atau nomor HP...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-sm shadow-sm"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50/50", children: [
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Pengguna" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Kontak" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Role" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Tanggal Bergabung" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100", children: [
        filteredUsers.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-100", children: user.full_name?.charAt(0) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-slate-900", children: user.full_name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 uppercase tracking-widest", children: [
                "ID: #",
                user.id
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: user.phone }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === "admin" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-slate-100 text-slate-500"}`, children: user.role }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-sm text-slate-400", children: new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsx("button", { className: "p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400", children: /* @__PURE__ */ jsx(MoreVertical, { size: 16 }) }) })
        ] }, user.id)),
        filteredUsers.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-8 py-12 text-center text-slate-400 italic text-sm", children: "Tidak ada pengguna yang ditemukan." }) })
      ] })
    ] }) }) })
  ] });
};

const InvitationManagement = () => {
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchInvitations();
  }, []);
  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/admin/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const filteredInvitations = invitations.filter(
    (i) => i.slug.toLowerCase().includes(search.toLowerCase()) || i.owner_name?.toLowerCase().includes(search.toLowerCase())
  );
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif italic font-bold text-slate-900", children: "Daftar Undangan" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm mt-1", children: [
          "Mengelola ",
          invitations.length,
          " undangan yang diterbitkan di Vowly."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari slug atau nama owner...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-sm shadow-sm"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50/50", children: [
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Subdomain / Slug" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Pemilik (Owner)" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Theme" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100", children: [
        filteredInvitations.map((invite) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100", children: /* @__PURE__ */ jsx(Globe, { size: 18 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-slate-900", children: invite.slug }),
              /* @__PURE__ */ jsxs("a", { href: `/${invite.slug}`, target: "_blank", className: "text-[10px] text-indigo-500 flex items-center gap-1 hover:underline", children: [
                "Lihat Undangan ",
                /* @__PURE__ */ jsx(ExternalLink, { size: 10 })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-700", children: invite.owner_name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400", children: invite.owner_phone })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 capitalize", children: invite.theme_id }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${invite.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"}`, children: invite.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsx("button", { className: "p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400", children: /* @__PURE__ */ jsx(MoreVertical, { size: 16 }) }) })
        ] }, invite.id)),
        filteredInvitations.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-8 py-12 text-center text-slate-400 italic text-sm", children: "Tidak ada undangan yang ditemukan." }) })
      ] })
    ] }) }) })
  ] });
};

const TemplateRegistry = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTemplates();
  }, []);
  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10 animate-reveal", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif italic font-bold text-slate-900", children: "Template Registry" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Katalog desain undangan yang tersedia dan statistik penggunaannya." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
      templates.map((template) => /* @__PURE__ */ jsxs("div", { className: "group bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: `w-14 h-14 ${template.color} rounded-2xl flex items-center justify-center shadow-inner`, children: /* @__PURE__ */ jsx(Palette, { size: 28 }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col items-end", children: /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
            " Active"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif italic font-bold text-slate-900", children: template.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest", children: [
            "Theme ID: ",
            template.id
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-8 border-t border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Digunakan Oleh" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-slate-900", children: [
              template.count,
              " Koleksi"
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { className: "p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all", children: /* @__PURE__ */ jsx(ArrowUpRight, { size: 20 }) })
        ] })
      ] }, template.id)),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 hover:bg-slate-100 transition-all group cursor-pointer", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 shadow-sm transition-colors", children: /* @__PURE__ */ jsx(Layers, { size: 24 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-400 group-hover:text-indigo-600 transition-colors", children: "Tambah Desain Baru" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 max-w-[180px]", children: "Daftarkan template tema baru ke dalam registry." })
        ] })
      ] })
    ] })
  ] });
};

const AdminPanel = () => {
  const activeTab = useStore(activeAdminTabStore);
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return /* @__PURE__ */ jsx(PlatformOverview, {});
      case "users":
        return /* @__PURE__ */ jsx(UserManagement, {});
      case "invitations":
        return /* @__PURE__ */ jsx(InvitationManagement, {});
      case "templates":
        return /* @__PURE__ */ jsx(TemplateRegistry, {});
      case "payments":
        return /* @__PURE__ */ jsx(ComingSoon, { title: "Daftar Transaksi" });
      default:
        return /* @__PURE__ */ jsx(PlatformOverview, {});
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "animate-reveal", children: renderContent() });
};

const $$Astro$1 = createAstro("https://undangan-pernikahan.vercel.app");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Admin Panel - Vowly" } = Astro2.props;
  const adminData = {
    name: "Platform Admin",
    role: "Owner"
  };
  return renderTemplate`<html lang="id"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-slate-50 font-sans text-slate-950"> <div class="flex min-h-screen"> <!-- Sidebar (React SPA) --> ${renderComponent($$result, "AdminSidebar", AdminSidebar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Dashboard/Admin/AdminSidebar", "client:component-export": "default" })} <!-- Main Content --> <main class="flex-1 lg:ml-72 min-h-screen"> <!-- Header --> <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-20 flex items-center justify-between"> <div class="flex items-center gap-4"> <h1 class="text-xl font-bold tracking-tight text-slate-900">${title}</h1> </div> <div class="flex items-center gap-6"> <button class="relative p-2 text-slate-400 hover:text-slate-900 transition-colors"> ${renderComponent($$result, "Bell", Bell, { "size": 20 })} <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> </button> <div class="h-8 w-px bg-slate-200"></div> <div class="flex items-center gap-4"> <div class="text-right"> <p class="text-sm font-bold text-slate-900 uppercase tracking-tight">${adminData.name}</p> <p class="text-[10px] text-indigo-600 font-black uppercase tracking-widest">${adminData.role}</p> </div> <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
AD
</div> </div> </div> </header> <div class="p-8"> <!-- Admin SPA Panel --> ${renderComponent($$result, "AdminPanel", AdminPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Dashboard/Admin/AdminPanel", "client:component-export": "default" })} <!-- Any legacy slot content (unused in SPA) --> <div class="hidden">${renderSlot($$result, $$slots["default"])}</div> </div> </main> </div> </body></html>`;
}, "C:/laragon/www/Undangan-Pernikahan/src/layouts/AdminLayout.astro", void 0);

const AdminGate = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        setError(data.error || "Akses Ditolak");
      }
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[999] bg-slate-50 flex items-center justify-center p-6 overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse-soft" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -ml-40 -mb-40" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md animate-reveal", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] border border-slate-200 mb-8 shadow-xl relative group overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" }),
          /* @__PURE__ */ jsx(Shield, { className: "h-10 w-10 text-primary relative z-10 animate-pulse" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-6xl font-serif italic text-slate-900 mb-6 tracking-tight", children: "Admin Gate" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 font-light tracking-wide leading-relaxed", children: [
          "Masukkan kunci otorisasi untuk mengakses ",
          /* @__PURE__ */ jsx("br", {}),
          " Pusat Kendali Vowly."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        error && /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase rounded-2xl text-center", children: error }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-6 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              required: true,
              autoFocus: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "KUNCI OTORISASI",
              className: "w-full bg-white border border-slate-200 rounded-3xl py-6 pl-16 pr-6 text-slate-900 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-mono tracking-[0.3em] text-center shadow-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full bg-primary text-white hover:bg-slate-800 rounded-3xl py-6 font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Buka Akses ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 flex flex-col items-center gap-4 text-slate-400", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary/40" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-black tracking-[0.4em]", children: "Vowly Governance System" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-10 w-px bg-gradient-to-b from-slate-200 to-transparent" })
      ] })
    ] })
  ] });
};

const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const SESSION_COOKIE = "vowly_session";
  const sessionId = Astro2.cookies.get(SESSION_COOKIE)?.value;
  let isAdmin = false;
  if (sessionId) {
    const userId = parseInt(sessionId);
    const users = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (users.length > 0 && users[0].role === "admin") {
      isAdmin = true;
    }
  }
  return renderTemplate`${isAdmin ? renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Platform Overview" }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="mb-12"><h2 class="text-3xl font-serif italic text-white mb-2">Pusat Kendali</h2><p class="text-slate-500">Pantau pertumbuhan dan performa platform Vowly Anda secara real-time.</p></div>${renderComponent($$result2, "PlatformOverview", PlatformOverview, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Dashboard/Admin/PlatformOverview", "client:component-export": "default" })}` })}` : renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Otorisasi - Vowly" }, { "default": async ($$result2) => renderTemplate`${renderComponent($$result2, "AdminGate", AdminGate, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/components/Dashboard/Admin/AdminGate", "client:component-export": "default" })}` })}`}`;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/admin/index.astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
