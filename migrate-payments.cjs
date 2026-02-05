const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function migrate() {
    try {
        console.log("🚀 Starting migration...");

        // 1. Add package_id to invitations if not exists
        console.log("Adding package_id to invitations...");
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='package_id') THEN
                    ALTER TABLE invitations ADD COLUMN package_id VARCHAR(50) DEFAULT 'basic';
                END IF;
            END $$;
        `;
        console.log("✅ Column package_id checked/added");

        // 2. Create payments table
        console.log("Creating payments table...");
        await sql`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                invitation_id INTEGER REFERENCES invitations(id),
                order_id VARCHAR(100) UNIQUE NOT NULL,
                amount INTEGER NOT NULL,
                package_id VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                snap_token TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("✅ Table payments checked/created");

        console.log("🎉 Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await sql.end();
    }
}

migrate();
