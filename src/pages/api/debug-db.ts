import type { APIRoute } from "astro";
import sql, { initializeTables } from "../../lib/db";

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const forceInit = url.searchParams.get("init") === "true";
        const shouldSeed = url.searchParams.get("seed") === "true";

        if (forceInit) {
            await initializeTables();
        }

        if (shouldSeed) {
            // Create a test invitation
            const [invitation] = await sql`
            INSERT INTO invitations (slug, theme_id, user_id)
            VALUES ('test-invitation', 'luxury', 'admin')
            ON CONFLICT (slug) DO UPDATE SET theme_id = EXCLUDED.theme_id
            RETURNING id
        `;

            // Add some settings
            const settings = [
                { key: 'bride_nickname', value: 'Fey' },
                { key: 'groom_nickname', value: 'Yaya' }
            ];

            for (const s of settings) {
                await sql`
                INSERT INTO invitation_settings (invitation_id, setting_key, setting_value)
                VALUES (${invitation.id}, ${s.key}, ${s.value})
                ON CONFLICT (invitation_id, setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value
            `;
            }
        }

        const dbUrl = process.env.DATABASE_URL || (import.meta as any).env?.DATABASE_URL || "NOT FOUND";
        const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@");

        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

        const tableCounts: Record<string, number> = {};
        for (const t of tables) {
            const name = t.table_name;
            const [res] = await sql`SELECT count(*) as count FROM ${sql(name)}`;
            tableCounts[name] = parseInt(res.count, 10);
        }

        return new Response(JSON.stringify({
            status: "ok",
            initAttempted: forceInit,
            seeded: shouldSeed,
            databaseUrlFound: dbUrl !== "NOT FOUND",
            maskedUrl,
            tables,
            counts: tableCounts,
            message: "If Navicat is empty, right-click 'Tables' and click 'Refresh'. Also check for filters."
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: "error",
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
