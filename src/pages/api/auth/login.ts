import type { APIRoute } from "astro";
import sql from "../../../lib/db";
import { verifyPassword, setSession } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
        }

        const users = await sql`SELECT id, password_hash, role FROM users WHERE phone = ${phone}`;
        if (users.length === 0) {
            return new Response(JSON.stringify({ error: "Akun tidak ditemukan" }), { status: 400 });
        }

        const user = users[0];
        const isMatch = await verifyPassword(password, user.password_hash);

        if (!isMatch) {
            return new Response(JSON.stringify({ error: "Password salah" }), { status: 400 });
        }

        const sessionCookie = setSession(user.id);

        // Fetch user's invitation
        const invitations = await sql`SELECT id FROM invitations WHERE user_id = ${user.id} LIMIT 1`;
        const invitationId = invitations.length > 0 ? invitations[0].id : null;

        return new Response(
            JSON.stringify({ success: true, invitationId, role: user.role }),
            {
                status: 200,
                headers: {
                    "Set-Cookie": sessionCookie,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error: any) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
