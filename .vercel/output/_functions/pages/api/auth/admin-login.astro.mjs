import { s as sql } from '../../../chunks/db_DXmNE2yN.mjs';
import { s as setSession } from '../../../chunks/auth_CQCycFgF.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { password } = await request.json();
    const envPassword = "admin123";
    const ADMIN_PASSWORD = envPassword.trim();
    console.log("[AdminGate] Attempting login...");
    if (password.trim() !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Password Admin Salah" }), { status: 401 });
    }
    const adminPhone = "12345678";
    let adminUser;
    if (adminPhone) {
      const users = await sql`SELECT id, role FROM users WHERE phone = ${adminPhone.trim()} LIMIT 1`;
      if (users.length > 0) {
        adminUser = users[0];
        if (adminUser.role !== "admin") {
          console.log(`[AdminGate] Syncing role for ${adminPhone.trim()} to admin...`);
          await sql`UPDATE users SET role = 'admin' WHERE id = ${adminUser.id}`;
          adminUser.role = "admin";
        }
      }
    }
    if (!adminUser) {
      const admins = await sql`SELECT id, role FROM users WHERE role = 'admin' LIMIT 1`;
      if (admins.length > 0) adminUser = admins[0];
    }
    if (!adminUser) {
      console.warn("[AdminGate] Password matches, but no user with 'admin' role found in database.");
      return new Response(JSON.stringify({ error: "Akses Diterima, tapi Akun Admin belum terdaftar di database. Silakan daftar dulu dengan nomor HP yang ditentukan." }), { status: 404 });
    }
    const sessionCookie = setSession(adminUser.id);
    return new Response(
      JSON.stringify({ success: true, role: adminUser.role }),
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Admin Login Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
