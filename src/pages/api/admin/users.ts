import type { APIRoute } from "astro";
import sql from "../../../lib/db";

export const GET: APIRoute = async ({ cookies }) => {
    // Auth check (basic check for session, in production check role in DB)
    const sessionId = cookies.get("vowly_session")?.value;
    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const users = await sql`
            SELECT id, full_name, phone, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Admin Users Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
