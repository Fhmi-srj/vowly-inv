import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_izSyb1tO.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DcQtjN1d.mjs';
import { s as sql } from '../chunks/db_DXmNE2yN.mjs';
import { s as settingsToConfig, d as defaultSettings, g as getSettings } from '../chunks/getSettings_DKvKzerU.mjs';
import { T as ThemeRegistry } from '../chunks/index_CLWR17k7.mjs';
export { renderers } from '../renderers.mjs';

async function getInvitationBySlug(slug) {
  const rows = await sql`
        SELECT * FROM invitations WHERE slug = ${slug} AND is_active = TRUE
    `;
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function incrementInvitationViews(id) {
  await sql`
        UPDATE invitations SET views_count = views_count + 1 WHERE id = ${id}
    `;
}

const $$Astro = createAstro("https://undangan-pernikahan.vercel.app");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  let invitationId = null;
  let config = null;
  if (slug.startsWith("demo-")) {
    const themeId = slug.replace("demo-", "");
    if (!ThemeRegistry[themeId]) {
      return Astro2.redirect("/404");
    }
    config = settingsToConfig({
      ...defaultSettings,
      theme_id: themeId,
      bride_nickname: "Putri",
      groom_nickname: "Putra"
    });
  } else {
    const invitation = await getInvitationBySlug(slug);
    if (!invitation) {
      return Astro2.redirect("/404");
    }
    await incrementInvitationViews(invitation.id);
    const settings = await getSettings(invitation.id);
    config = settingsToConfig(settings);
    invitationId = invitation.id;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": config ? `The Wedding of ${config.couple.groom.name} & ${config.couple.bride.name}` : "Wedding Invitation" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": "react", "invitationId": invitationId, "initialConfig": config, "client:component-hydration": "only", "client:component-path": "C:/laragon/www/Undangan-Pernikahan/src/App", "client:component-export": "default" })} ` })}`;
}, "C:/laragon/www/Undangan-Pernikahan/src/pages/[slug].astro", void 0);

const $$file = "C:/laragon/www/Undangan-Pernikahan/src/pages/[slug].astro";
const $$url = "/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
