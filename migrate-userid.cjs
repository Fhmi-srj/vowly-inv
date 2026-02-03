const postgres = require('postgres');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function migrate() {
    try {
        console.log("🚀 Starting Migration: Fix user_id Type Mismatch...");

        // 1. Get the first user ID (usually the admin)
        const users = await sql`SELECT id FROM users ORDER BY id ASC LIMIT 1`;
        if (users.length === 0) {
            console.error("❌ No users found to link invitations to.");
            return;
        }
        const firstUserId = users[0].id;
        console.log(`📍 Found primary user ID: ${firstUserId}`);

        // 2. Map 'admin' or other strings to the first user ID
        console.log("🧹 Cleaning up non-numeric user_id values...");
        await sql`
      UPDATE invitations 
      SET user_id = ${firstUserId.toString()} 
      WHERE user_id !~ '^[0-9]+$' OR user_id IS NULL
    `;

        // 3. Alter the column type to INTEGER
        console.log("🔧 Altering invitations.user_id to INTEGER...");
        await sql`
      ALTER TABLE invitations 
      ALTER COLUMN user_id TYPE INTEGER USING user_id::INTEGER
    `;

        // 4. Update the DB initialization logic in db.ts to match this
        console.log("✅ Migration successful!");

    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await sql.end();
    }
}

migrate();
