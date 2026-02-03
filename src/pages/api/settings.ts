import type { APIRoute } from "astro";
import sql from "../../lib/db";

// GET - Fetch settings for a specific invitationId
export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const invitationId = url.searchParams.get("invitationId");

    if (!invitationId) {
        return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
    }

    try {
        const rows = await sql`
            SELECT setting_key, setting_value FROM invitation_settings
            WHERE invitation_id = ${parseInt(invitationId)}
        `;

        const settings: Record<string, string> = {};
        (rows as any[]).forEach((row) => {
            settings[row.setting_key] = row.setting_value;
        });

        // Fetch theme_id from invitations table
        const [invitation] = await sql`
            SELECT theme_id FROM invitations WHERE id = ${parseInt(invitationId)}
        `;
        if (invitation) {
            settings.theme_id = invitation.theme_id;
        }

        return new Response(JSON.stringify(settings), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch settings" }), { status: 500 });
    }
};

// POST - Update settings for a specific invitationId
export const POST: APIRoute = async ({ request, cookies }) => {
    // Basic auth check remains (future: check if user owns invitation)
    const auth = cookies.get("wedding_admin_auth")?.value;
    if (auth !== "true") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { invitationId, settings } = await request.json();

        if (!invitationId) {
            return new Response(JSON.stringify({ error: "invitationId is required" }), { status: 400 });
        }

        // Upsert each setting
        for (const [key, value] of Object.entries(settings)) {
            if (key === 'theme_id') {
                // Update theme_id in invitations table
                await sql`
                    UPDATE invitations SET theme_id = ${String(value)}, updated_at = NOW()
                    WHERE id = ${parseInt(invitationId)}
                `;
                continue;
            }

            await sql`
                INSERT INTO invitation_settings (invitation_id, setting_key, setting_value, updated_at) 
                VALUES (${parseInt(invitationId)}, ${key}, ${String(value)}, NOW())
                ON CONFLICT (invitation_id, setting_key) 
                DO UPDATE SET setting_value = ${String(value)}, updated_at = NOW()
            `;
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Failed to save settings:", error);
        return new Response(JSON.stringify({ error: "Failed to save settings" }), { status: 500 });
    }
};
