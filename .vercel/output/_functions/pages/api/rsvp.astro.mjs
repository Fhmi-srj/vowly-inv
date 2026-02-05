import { s as sql } from '../../chunks/db_DAiex9Tg.mjs';
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
      SELECT id, guest_name, attendance, guest_count, message, created_at 
      FROM rsvps 
      WHERE invitation_id = ${parseInt(invitationId)}
      ORDER BY created_at DESC
    `;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
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
    const guest_name = sanitize(rawData.guest_name);
    const phone = sanitize(rawData.phone);
    const message = sanitize(rawData.message);
    const attendance = rawData.attendance;
    const guest_count = rawData.guest_count;
    const existingRows = await sql`
      SELECT id FROM rsvps WHERE guest_name = ${guest_name} AND invitation_id = ${parseInt(invitationId)}
    `;
    const existingGuest = existingRows[0];
    let actionType = "";
    let resultId = 0;
    if (existingGuest) {
      await sql`
        UPDATE rsvps 
        SET phone = ${phone}, 
            attendance = ${attendance}, 
            guest_count = ${guest_count}, 
            message = ${message || ""},
            created_at = NOW()
        WHERE id = ${existingGuest.id}
      `;
      actionType = "updated";
      resultId = existingGuest.id;
    } else {
      const result = await sql`
        INSERT INTO rsvps (invitation_id, guest_name, phone, attendance, guest_count, message, created_at)
        VALUES (${parseInt(invitationId)}, ${guest_name}, ${phone}, ${attendance}, ${guest_count}, ${message || ""}, NOW())
        RETURNING id
      `;
      actionType = "created";
      resultId = result[0]?.id || 0;
    }
    const title = actionType === "created" ? "💌 <b>RSVP BARU MASUK!</b>" : "♻️ <b>PEMBARUAN DATA RSVP!</b>";
    const statusEmoji = attendance === "hadir" ? "✅" : attendance === "ragu" ? "🤔" : "❌";
    const notifMsg = `
${title}

👤 <b>Nama:</b> ${guest_name}
${statusEmoji} <b>Status:</b> ${attendance.toUpperCase()}
👥 <b>Jml:</b> ${attendance === "hadir" ? guest_count + " Orang" : "-"}
📞 <b>Kontak:</b> ${phone || "-"}

💬 <b>Pesan:</b>
<i>"${message || "-"}"</i>
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
