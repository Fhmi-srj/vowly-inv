import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$UserLayout } from '../chunks/UserLayout_Dq1zgGIy.mjs';
import { s as sql } from '../chunks/db_BEFLq8SP.mjs';
import { Layout } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://vowly.hello-inv.com");
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
  SELECT i.id, u.full_name as buyer_name 
  FROM invitations i 
  JOIN users u ON i.user_id = u.id 
  WHERE i.user_id = ${userId}
  LIMIT 1
`;
  if (invitations.length > 0) {
    return Astro2.redirect(`/dashboard/manage/${invitations[0].id}`);
  }
  const invitation = null;
  return renderTemplate`${renderComponent($$result, "UserLayout", $$UserLayout, { "title": "Selamat Datang!", "userName": invitation?.buyer_name, "userPhone": invitation?.buyer_phone }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl"> <div class="mb-12"> <h2 class="text-4xl font-serif italic mb-4">Halo, ${"User"}</h2> <p class="text-slate-500 max-w-lg">Senang melihat Anda kembali. Berikut adalah ringkasan undangan pernikahan Anda yang sedang aktif.</p> </div> ${renderTemplate`<div class="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10"> ${renderComponent($$result2, "Layout", Layout, { "size": 48, "className": "mx-auto text-slate-200 mb-6" })} <p class="text-slate-400">Anda belum memiliki undangan yang aktif.</p> </div>`} </div> ` })}`;
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
