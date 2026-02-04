import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript, h as addAttribute } from '../../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DcQtjN1d.mjs';
import { ChevronLeft, Zap } from 'lucide-react';
import { A as AVAILABLE_THEMES } from '../../chunks/index_CLWR17k7.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Create;
  const COOKIE_NAME = "wedding_admin_auth";
  const isAuthenticated = Astro2.cookies.get(COOKIE_NAME)?.value === "true";
  if (!isAuthenticated) {
    return Astro2.redirect("/admin");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Buat Undangan Baru" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-20"> <div class="max-w-xl mx-auto"> <a href="/admin" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-10 transition-colors"> ${renderComponent($$result2, "ChevronLeft", ChevronLeft, { "className": "h-4 w-4" })} Kembali ke Dashboard
</a> <div class="bg-white dark:bg-slate-900 shadow-xl rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 md:p-14"> <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8"> ${renderComponent($$result2, "Zap", Zap, { "className": "h-8 w-8" })} </div> <h1 class="font-serif text-4xl italic mb-4">Mulai Momen Anda</h1> <p class="text-slate-500 mb-10">Pilih slug unik untuk link undangan pernikahan digital Anda.</p> <form id="create-form" class="space-y-8"> <div class="space-y-2"> <label class="text-[10px] font-bold tracking-widest uppercase text-slate-400">URL Undangan</label> <div class="flex items-center gap-2 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all"> <span class="text-slate-400 font-medium">vowly.com/</span> <input type="text" name="slug" required pattern="[a-z0-9-]+" title="Hanya huruf kecil, angka, dan tanda hubung" class="flex-1 bg-transparent outline-none font-bold" placeholder="nama-mempelai"> </div> <p class="text-[10px] text-slate-400">Contoh: romeo-juliet</p> </div> <div class="space-y-4"> <label class="text-[10px] font-bold tracking-widest uppercase text-slate-400">Pilih Tema Desain</label> <div class="grid grid-cols-2 gap-4"> ${AVAILABLE_THEMES.map((theme) => renderTemplate`<label class="relative cursor-pointer group"> <input type="radio" name="themeId"${addAttribute(theme.id, "value")} class="peer sr-only"${addAttribute(theme.id === "luxury", "checked")}> <div class="overflow-hidden rounded-2xl border-2 border-transparent peer-checked:border-primary transition-all shadow-sm group-hover:shadow-md"> <img${addAttribute(theme.preview, "src")}${addAttribute(theme.name, "alt")} class="w-full aspect-video object-cover"> <div class="p-3 bg-white dark:bg-slate-800"> <p class="text-[10px] font-bold uppercase">${theme.name}</p> </div> </div> <div class="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 transition-opacity"> <div class="bg-primary text-white p-1 rounded-full shadow-lg"> ${renderComponent($$result2, "Zap", Zap, { "className": "h-3 w-3 fill-current" })} </div> </div> </label>`)} </div> </div> <button type="submit" id="submit-btn" class="w-full py-5 bg-primary text-white rounded-2xl font-bold tracking-luxury shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50">
BUAT UNDANGAN
</button> </form> </div> </div> </main> ${renderScript($$result2, "C:/laragon/www/Undangan-Pernikahan/src/pages/admin/create.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/admin/create.astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/admin/create.astro";
const $$url = "/admin/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
