const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL);

async function migrate() {
    try {
        console.log("🚀 Updating payments table schema...");

        // Make user_id and invitation_id nullable
        console.log("Making user_id and invitation_id nullable...");
        await sql`ALTER TABLE payments ALTER COLUMN user_id DROP NOT NULL`;
        await sql`ALTER TABLE payments ALTER COLUMN invitation_id DROP NOT NULL`;

        // Add registration_data column
        console.log("Adding registration_data column...");
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='payments' AND column_name='registration_data') THEN
                    ALTER TABLE payments ADD COLUMN registration_data JSONB;
                END IF;
            END $$;
        `;

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await sql.end();
    }
}

migrate();
