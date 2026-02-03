import type { APIRoute } from "astro";
import sql from "../../../lib/db";
import { getUserIdFromRequest } from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
        }

        const users = await sql`SELECT id, full_name, phone, role FROM users WHERE id = ${userId}`;
        if (users.length === 0) {
            return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
        }

        const invitations = await sql`SELECT id, slug, status FROM invitations WHERE user_id = ${userId} LIMIT 1`;

        return new Response(
            JSON.stringify({
                authenticated: true,
                user: users[0],
                invitation: invitations[0] || null,
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Auth Me Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
