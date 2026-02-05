import type { APIRoute } from "astro";
import sql from "../../../lib/db";
import { hashPassword, setSession } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { fullName, phone, password, slug, themeId, package: packageId } = await request.json();

        if (!fullName || !phone || !password || !slug) {
            return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
        }

        // Check if phone exists
        const existingUser = await sql`SELECT id FROM users WHERE phone = ${phone}`;
        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ error: "Nomor HP sudah terdaftar" }), { status: 400 });
        }

        // Check if slug exists
        const existingSlug = await sql`SELECT id FROM invitations WHERE slug = ${slug}`;
        if (existingSlug.length > 0) {
            return new Response(JSON.stringify({ error: "Subdomain/Slug sudah digunakan" }), { status: 400 });
        }

        // Create User
        const adminPhone = (import.meta as any).env?.ADMIN_PHONE || process.env.ADMIN_PHONE;
        const role = (phone === adminPhone?.trim()) ? 'admin' : 'user';

        const hashedPassword = await hashPassword(password);
        const [user] = await sql`
      INSERT INTO users (full_name, phone, password_hash, role)
      VALUES (${fullName}, ${phone}, ${hashedPassword}, ${role})
      RETURNING id, role
    `;

        // Create Invitation
        const [invitation] = await sql`
      INSERT INTO invitations (user_id, slug, theme_id, package_id, status)
      VALUES (${user.id}, ${slug}, ${themeId || "luxury"}, ${packageId || "basic"}, 'inactive')
      RETURNING id
    `;

        // Initialize default settings for this invitation
        // Typically you'd insert default keys here, but getSettings handles defaults if missing.
        // However, to be safe:
        await sql`
      INSERT INTO invitation_settings (invitation_id, setting_key, setting_value)
      VALUES 
        (${invitation.id}, 'hero_date', '2026-12-12'),
        (${invitation.id}, 'groom_name', 'Nama Pria'),
        (${invitation.id}, 'bride_name', 'Nama Wanita')
    `;

        const sessionCookie = setSession(user.id);

        return new Response(
            JSON.stringify({ success: true, invitationId: invitation.id, userId: user.id, role: user.role || 'user' }),
            {
                status: 200,
                headers: {
                    "Set-Cookie": sessionCookie,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error: any) {
        console.error("Register Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
