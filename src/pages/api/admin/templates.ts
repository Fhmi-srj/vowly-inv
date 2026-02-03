import type { APIRoute } from "astro";
import sql from "../../../lib/db";

export const GET: APIRoute = async ({ cookies }) => {
    const sessionId = cookies.get("vowly_session")?.value;
    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // Count invitations per theme
        const usage = await sql`
            SELECT theme_id, COUNT(*) as count 
            FROM invitations 
            GROUP BY theme_id
        `;

        // Mock theme list (expand as needed)
        const themes = [
            { id: 'luxury', name: 'Luxury Gold', color: 'bg-amber-100 text-amber-600' },
            { id: 'classic', name: 'Classic Rose', color: 'bg-pink-100 text-pink-600' },
            { id: 'minimal', name: 'Minimal Slate', color: 'bg-slate-100 text-slate-600' },
            { id: 'bloom', name: 'Floral Bloom', color: 'bg-emerald-100 text-emerald-600' },
        ];

        const result = themes.map(t => ({
            ...t,
            count: Number(usage.find((u: any) => u.theme_id === t.id)?.count || 0)
        }));

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Admin Templates Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
