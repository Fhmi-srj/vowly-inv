import { s as sql } from '../../../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
  const sessionId = cookies.get("vowly_session")?.value;
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const invitations = await sql`
            SELECT i.*, u.full_name as owner_name, u.phone as owner_phone
            FROM invitations i
            LEFT JOIN users u ON i.user_id = u.id
            ORDER BY i.created_at DESC
        `;
    return new Response(JSON.stringify(invitations), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin Invitations Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
