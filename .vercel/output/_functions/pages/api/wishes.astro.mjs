import { s as sql } from '../../chunks/db_DVtNYTj_.mjs';
import { c as checkRateLimit, s as sendTelegramNotification } from '../../chunks/telegram_CYpfHjRV.mjs';
export { renderers } from '../../renderers.mjs';

const sanitize = (str) => {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const invitationId = url.searchParams.get("invitationId");
  if (!invitationId) {
    return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
  }
  try {
    const rows = await sql`
      SELECT * FROM wishes 
      WHERE invitation_id = ${parseInt(invitationId)}
      ORDER BY created_at DESC
    `;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500
    });
  }
};
const POST = async ({ request, clientAddress }) => {
  const ip = clientAddress || "unknown";
  if (!checkRateLimit(ip, 5, 6e4)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429 }
    );
  }
  try {
    const rawData = await request.json();
    const { invitationId } = rawData;
    if (!invitationId) {
      return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
    }
    const name = sanitize(rawData.name);
    const message = sanitize(rawData.message);
    const existingRows = await sql`
      SELECT id FROM wishes WHERE name = ${name} AND invitation_id = ${parseInt(invitationId)}
    `;
    const existingWish = existingRows[0];
    let actionType = "";
    let resultId = 0;
    if (existingWish) {
      await sql`
        UPDATE wishes 
        SET message = ${message}, created_at = NOW()
        WHERE id = ${existingWish.id}
      `;
      actionType = "updated";
      resultId = existingWish.id;
    } else {
      const result = await sql`
        INSERT INTO wishes (invitation_id, name, message, created_at) 
        VALUES (${parseInt(invitationId)}, ${name}, ${message}, NOW())
        RETURNING id
      `;
      actionType = "created";
      resultId = result[0]?.id || 0;
    }
    const title = actionType === "created" ? "✨ <b>UCAPAN & DOA BARU!</b>" : "📝 <b>UCAPAN DIPERBARUI!</b>";
    const notifMsg = `
${title}

👤 <b>Dari:</b> ${name}

<i>"${message}"</i>
    `.trim();
    sendTelegramNotification(notifMsg);
    return new Response(
      JSON.stringify({
        success: true,
        id: resultId,
        action: actionType
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
