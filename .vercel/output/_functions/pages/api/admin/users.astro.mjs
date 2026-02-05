import { s as sql } from '../../../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
  const sessionId = cookies.get("vowly_session")?.value;
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const users = await sql`
            SELECT id, full_name, phone, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin Users Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
