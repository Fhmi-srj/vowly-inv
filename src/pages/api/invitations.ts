import type { APIRoute } from "astro";
import sql from "../../lib/db";

export const GET: APIRoute = async ({ cookies }) => {
    const auth = cookies.get("wedding_admin_auth")?.value;
    if (auth !== "true") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const rows = await sql`
            SELECT id, slug, views_count, created_at FROM invitations 
            ORDER BY created_at DESC
        `;
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    const auth = cookies.get("wedding_admin_auth")?.value;
    if (auth !== "true") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { slug, themeId } = await request.json();
        if (!slug) {
            return new Response(JSON.stringify({ error: "Slug is required" }), { status: 400 });
        }

        // Check uniqueness
        const existing = await sql`SELECT id FROM invitations WHERE slug = ${slug}`;
        if (existing.length > 0) {
            return new Response(JSON.stringify({ error: "Slug already exists" }), { status: 409 });
        }

        const result = await sql`
            INSERT INTO invitations (slug, theme_id) 
            VALUES (${slug}, ${themeId || 'luxury'}) 
            RETURNING *
        `;
        return new Response(JSON.stringify(result[0]), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
    }
};
