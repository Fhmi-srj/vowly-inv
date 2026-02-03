import type { APIRoute } from "astro";
import sql from "../../../lib/db";

export const GET: APIRoute = async ({ cookies }) => {
    const SESSION_COOKIE = "vowly_session";
    const sessionId = cookies.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const userId = parseInt(sessionId);
        // Verify admin role
        const users = await sql`SELECT role FROM users WHERE id = ${userId}`;
        if (users.length === 0 || users[0].role !== 'admin') {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        // Fetch stats
        const userCount = await sql`SELECT count(*) FROM users`;
        const invCount = await sql`SELECT count(*) FROM invitations`;
        const recentUsers = await sql`
            SELECT id, full_name, phone, role, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 10
        `;

        return new Response(JSON.stringify({
            totalUsers: parseInt(userCount[0].count),
            totalInvitations: parseInt(invCount[0].count),
            recentUsers: recentUsers
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
