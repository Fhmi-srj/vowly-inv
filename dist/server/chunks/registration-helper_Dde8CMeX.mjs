import { s as sql } from './db_BEFLq8SP.mjs';

async function createAccountFromRegistration(data, orderId, paymentId) {
  try {
    console.log(`Starting account creation for Order ID: ${orderId}`);
    const adminPhone = "12345678";
    const role = data.phone === adminPhone?.trim() ? "admin" : "user";
    const [user] = await sql`
            INSERT INTO users (full_name, phone, password_hash, role)
            VALUES (${data.fullName}, ${data.phone}, ${data.password}, ${role})
            RETURNING id
        `;
    const [invitation] = await sql`
            INSERT INTO invitations (user_id, slug, theme_id, package_id, status)
            VALUES (${user.id}, ${data.slug}, ${data.themeId}, ${data.packageId}, 'active')
            RETURNING id
        `;
    await sql`
            INSERT INTO invitation_settings (invitation_id, setting_key, setting_value)
            VALUES 
                (${invitation.id}, 'hero_date', '2026-12-12'),
                (${invitation.id}, 'groom_name', 'Nama Pria'),
                (${invitation.id}, 'bride_name', 'Nama Wanita')
        `;
    await sql`
            UPDATE payments 
            SET user_id = ${user.id}, invitation_id = ${invitation.id}
            WHERE id = ${paymentId}
        `;
    console.log(`Successfully created account for Order ID: ${orderId}. User ID: ${user.id}`);
    return { userId: user.id, invitationId: invitation.id };
  } catch (error) {
    console.error("Failed to create account from registration:", error);
    throw error;
  }
}

export { createAccountFromRegistration as c };
