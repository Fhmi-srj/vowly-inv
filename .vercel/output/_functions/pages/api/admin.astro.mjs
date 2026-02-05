import { s as sql } from '../../chunks/db_DVtNYTj_.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const auth = cookies.get("wedding_admin_auth")?.value;
  if (auth !== "true") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }
  try {
    const body = await request.json();
    const { action, id, ids, data } = body;
    const targetIds = ids || (id ? [id] : []);
    if (targetIds.length === 0 && !data) {
      return new Response(JSON.stringify({ error: "No valid ID provided" }), {
        status: 400
      });
    }
    if (action === "update_rsvp") {
      const { guest_name, attendance, guest_count, message } = data;
      await sql`
        UPDATE rsvps 
        SET guest_name = ${guest_name}, 
            attendance = ${attendance}, 
            guest_count = ${guest_count}, 
            message = ${message},
            created_at = NOW()
        WHERE id = ${id}
      `;
      return new Response(JSON.stringify({ success: true }));
    }
    if (action === "delete_rsvp") {
      for (const targetId of targetIds) {
        await sql`DELETE FROM rsvps WHERE id = ${targetId}`;
      }
      return new Response(JSON.stringify({ success: true }));
    }
    if (action === "update_wish") {
      const { name, message } = data;
      await sql`
        UPDATE wishes 
        SET name = ${name}, 
            message = ${message},
            created_at = NOW()
        WHERE id = ${id}
      `;
      return new Response(JSON.stringify({ success: true }));
    }
    if (action === "delete_wish") {
      for (const targetId of targetIds) {
        await sql`DELETE FROM wishes WHERE id = ${targetId}`;
      }
      return new Response(JSON.stringify({ success: true }));
    }
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400
    });
  } catch (error) {
    console.error("Admin API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server Error" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
