import { s as sql } from '../../../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
  const sessionId = cookies.get("vowly_session")?.value;
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const usage = await sql`
            SELECT theme_id, COUNT(*) as count 
            FROM invitations 
            GROUP BY theme_id
        `;
    const themes = [
      { id: "luxury", name: "Luxury Gold", color: "bg-amber-100 text-amber-600" },
      { id: "classic", name: "Classic Rose", color: "bg-pink-100 text-pink-600" },
      { id: "minimal", name: "Minimal Slate", color: "bg-slate-100 text-slate-600" },
      { id: "bloom", name: "Floral Bloom", color: "bg-emerald-100 text-emerald-600" }
    ];
    const result = themes.map((t) => ({
      ...t,
      count: Number(usage.find((u) => u.theme_id === t.id)?.count || 0)
    }));
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin Templates Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
