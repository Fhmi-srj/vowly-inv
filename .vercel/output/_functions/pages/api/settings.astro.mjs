import { s as sql } from '../../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  const url = new URL(request.url);
  const invitationId = url.searchParams.get("invitationId");
  if (!invitationId) {
    return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
  }
  try {
    const rows = await sql`
            SELECT setting_key, setting_value FROM invitation_settings
            WHERE invitation_id = ${parseInt(invitationId)}
        `;
    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });
    const [invitation] = await sql`
            SELECT theme_id FROM invitations WHERE id = ${parseInt(invitationId)}
        `;
    if (invitation) {
      settings.theme_id = invitation.theme_id;
    }
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch settings" }), { status: 500 });
  }
};
const POST = async ({ request, cookies }) => {
  const auth = cookies.get("wedding_admin_auth")?.value;
  if (auth !== "true") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { invitationId, settings } = await request.json();
    if (!invitationId) {
      return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
    }
    for (const [key, value] of Object.entries(settings)) {
      if (key === "theme_id") {
        await sql`
                    UPDATE invitations SET theme_id = ${String(value)}, updated_at = NOW()
                    WHERE id = ${parseInt(invitationId)}
                `;
        continue;
      }
      await sql`
                INSERT INTO invitation_settings (invitation_id, setting_key, setting_value, updated_at) 
                VALUES (${parseInt(invitationId)}, ${key}, ${String(value)}, NOW())
                ON CONFLICT (invitation_id, setting_key) 
                DO UPDATE SET setting_value = ${String(value)}, updated_at = NOW()
            `;
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return new Response(JSON.stringify({ error: "Failed to save settings" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
