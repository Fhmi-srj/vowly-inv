import sql from "./db";

export interface Invitation {
    id: number;
    user_id: string | null;
    slug: string;
    is_active: boolean;
    views_count: number;
    created_at: string;
    updated_at: string;
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
    const rows = await sql`
        SELECT * FROM invitations WHERE slug = ${slug} AND is_active = TRUE
    `;
    if (!rows || rows.length === 0) return null;
    return rows[0] as Invitation;
}

export async function incrementInvitationViews(id: number) {
    await sql`
        UPDATE invitations SET views_count = views_count + 1 WHERE id = ${id}
    `;
}

export async function createInvitation(user_id: string | null, slug: string, theme_id: string = 'luxury') {
    const rows = await sql`
        INSERT INTO invitations (user_id, slug, theme_id)
        VALUES (${user_id}, ${slug}, ${theme_id})
        RETURNING *
    `;
    return rows[0] as Invitation;
}
