import { c as clearSession } from '../../../chunks/auth_CQCycFgF.mjs';
export { renderers } from '../../../renderers.mjs';

const ALL = async ({ cookies, redirect }) => {
  const sessionCookie = clearSession();
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": sessionCookie,
      "Location": "/"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
