import { s as sql } from '../../../chunks/db_DVtNYTj_.mjs';
import { g as getUserIdFromRequest } from '../../../chunks/auth_CQCycFgF.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }
    const users = await sql`SELECT id, full_name, phone, role FROM users WHERE id = ${userId}`;
    if (users.length === 0) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }
    const invitations = await sql`SELECT id, slug, status FROM invitations WHERE user_id = ${userId} LIMIT 1`;
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: users[0],
        invitation: invitations[0] || null
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Me Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
