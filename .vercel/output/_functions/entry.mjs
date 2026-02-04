import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DfcoQak6.mjs';
import { manifest } from './manifest_BB3NODGs.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/create.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admin/invitations.astro.mjs');
const _page5 = () => import('./pages/api/admin/stats.astro.mjs');
const _page6 = () => import('./pages/api/admin/templates.astro.mjs');
const _page7 = () => import('./pages/api/admin/users.astro.mjs');
const _page8 = () => import('./pages/api/admin.astro.mjs');
const _page9 = () => import('./pages/api/auth/admin-login.astro.mjs');
const _page10 = () => import('./pages/api/auth/login.astro.mjs');
const _page11 = () => import('./pages/api/auth/logout.astro.mjs');
const _page12 = () => import('./pages/api/auth/me.astro.mjs');
const _page13 = () => import('./pages/api/auth/register.astro.mjs');
const _page14 = () => import('./pages/api/debug-db.astro.mjs');
const _page15 = () => import('./pages/api/export-rsvp.astro.mjs');
const _page16 = () => import('./pages/api/export-wishes.astro.mjs');
const _page17 = () => import('./pages/api/invitations.astro.mjs');
const _page18 = () => import('./pages/api/rsvp.astro.mjs');
const _page19 = () => import('./pages/api/settings.astro.mjs');
const _page20 = () => import('./pages/api/upload.astro.mjs');
const _page21 = () => import('./pages/api/wishes.astro.mjs');
const _page22 = () => import('./pages/dashboard/manage/_id_.astro.mjs');
const _page23 = () => import('./pages/dashboard.astro.mjs');
const _page24 = () => import('./pages/qrcode.astro.mjs');
const _page25 = () => import('./pages/_slug_.astro.mjs');
const _page26 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/create.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admin/invitations.ts", _page4],
    ["src/pages/api/admin/stats.ts", _page5],
    ["src/pages/api/admin/templates.ts", _page6],
    ["src/pages/api/admin/users.ts", _page7],
    ["src/pages/api/admin.ts", _page8],
    ["src/pages/api/auth/admin-login.ts", _page9],
    ["src/pages/api/auth/login.ts", _page10],
    ["src/pages/api/auth/logout.ts", _page11],
    ["src/pages/api/auth/me.ts", _page12],
    ["src/pages/api/auth/register.ts", _page13],
    ["src/pages/api/debug-db.ts", _page14],
    ["src/pages/api/export-rsvp.ts", _page15],
    ["src/pages/api/export-wishes.ts", _page16],
    ["src/pages/api/invitations.ts", _page17],
    ["src/pages/api/rsvp.ts", _page18],
    ["src/pages/api/settings.ts", _page19],
    ["src/pages/api/upload.ts", _page20],
    ["src/pages/api/wishes.ts", _page21],
    ["src/pages/dashboard/manage/[id].astro", _page22],
    ["src/pages/dashboard/index.astro", _page23],
    ["src/pages/qrcode.astro", _page24],
    ["src/pages/[slug].astro", _page25],
    ["src/pages/index.astro", _page26]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a9aff9e7-45e2-4e70-82ed-1d3d63550e6a",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
