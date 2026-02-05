import { s as sql } from '../../../chunks/db_DVtNYTj_.mjs';
import { h as hashPassword, s as setSession } from '../../../chunks/auth_CQCycFgF.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { fullName, phone, password, slug, themeId } = await request.json();
    if (!fullName || !phone || !password || !slug) {
      return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
    }
    const existingUser = await sql`SELECT id FROM users WHERE phone = ${phone}`;
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "Nomor HP sudah terdaftar" }), { status: 400 });
    }
    const existingSlug = await sql`SELECT id FROM invitations WHERE slug = ${slug}`;
    if (existingSlug.length > 0) {
      return new Response(JSON.stringify({ error: "Subdomain/Slug sudah digunakan" }), { status: 400 });
    }
    const adminPhone = "12345678";
    const role = phone === adminPhone?.trim() ? "admin" : "user";
    const hashedPassword = await hashPassword(password);
    const [user] = await sql`
      INSERT INTO users (full_name, phone, password_hash, role)
      VALUES (${fullName}, ${phone}, ${hashedPassword}, ${role})
      RETURNING id, role
    `;
    const [invitation] = await sql`
      INSERT INTO invitations (user_id, slug, theme_id, status)
      VALUES (${user.id}, ${slug}, ${themeId || "luxury"}, 'inactive')
      RETURNING id
    `;
    await sql`
      INSERT INTO invitation_settings (invitation_id, setting_key, setting_value)
      VALUES 
        (${invitation.id}, 'hero_date', '2026-12-12'),
        (${invitation.id}, 'groom_name', 'Nama Pria'),
        (${invitation.id}, 'bride_name', 'Nama Wanita')
    `;
    const sessionCookie = setSession(user.id);
    return new Response(
      JSON.stringify({ success: true, invitationId: invitation.id, role: user.role || "user" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
