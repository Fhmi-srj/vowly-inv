import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$UserLayout } from '../chunks/UserLayout_D-pStfLk.mjs';
import { s as sql } from '../chunks/db_DVtNYTj_.mjs';
import { Layout, Eye, Calendar, ArrowRight } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const SESSION_COOKIE = "vowly_session";
  const sessionId = Astro2.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return Astro2.redirect("/admin");
  }
  const userId = parseInt(sessionId);
  const invitations = await sql`
  SELECT i.*, u.full_name as buyer_name 
  FROM invitations i 
  JOIN users u ON i.user_id = u.id 
  WHERE i.user_id = ${userId}
`;
  if (invitations.length === 0) ;
  const invitation = invitations[0];
  return renderTemplate`${renderComponent($$result, "UserLayout", $$UserLayout, { "title": "Selamat Datang!", "userName": invitation?.buyer_name, "userPhone": invitation?.buyer_phone }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl"> <div class="mb-12"> <h2 class="text-4xl font-serif italic mb-4">Halo, ${invitation?.buyer_name || "User"}</h2> <p class="text-slate-500 max-w-lg">Senang melihat Anda kembali. Berikut adalah ringkasan undangan pernikahan Anda yang sedang aktif.</p> </div> ${invitation ? renderTemplate`<div class="grid gap-8"> <div class="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-10 shadow-sm hover:shadow-xl transition-all"> <div class="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"> ${renderComponent($$result2, "Layout", Layout, { "size": 200 })} </div> <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-8"> <div class="space-y-4"> <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-black tracking-widest uppercase">
AKTIF
</div> <h3 class="text-3xl font-bold italic font-serif">/${invitation.slug}</h3> <div class="flex items-center gap-6 text-sm text-slate-400"> <div class="flex items-center gap-2"> ${renderComponent($$result2, "Eye", Eye, { "size": 16 })} <span>${invitation.views_count} Kunjungan</span> </div> <div class="flex items-center gap-2"> ${renderComponent($$result2, "Calendar", Calendar, { "size": 16 })} <span>Dibuat ${new Date(invitation.created_at).toLocaleDateString("id-ID")}</span> </div> </div> </div> <a${addAttribute(`/dashboard/manage/${invitation.id}`, "href")} class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold tracking-widest uppercase hover:shadow-luxury hover:-translate-y-1 transition-all active:scale-95">
KELOLA UNDANGAN
${renderComponent($$result2, "ArrowRight", ArrowRight, { "size": 18 })} </a> </div> </div> </div>` : renderTemplate`<div class="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10"> ${renderComponent($$result2, "Layout", Layout, { "size": 48, "className": "mx-auto text-slate-200 mb-6" })} <p class="text-slate-400">Anda belum memiliki undangan yang aktif.</p> </div>`} </div> ` })}`;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
