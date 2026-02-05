import { neon } from "@neondatabase/serverless";
import postgres from "postgres";

// Priority list for environment variables in different runtimes
const getDbUrl = () => {
  // 1. Try Astro standard env (server-side)
  try {
    const url = (import.meta as any).env?.DATABASE_URL;
    if (url) return url;
  } catch (e) { }

  // 2. Try Node.js standard env (Vercel/Node runtime)
  try {
    const url = process.env.DATABASE_URL;
    if (url) return url;
  } catch (e) { }

  return "";
};

let DATABASE_URL = getDbUrl();

// Robustness: clean the URL string
if (DATABASE_URL) {
  DATABASE_URL = DATABASE_URL
    .replace(/^DATABASE_URL=/, "") // Strip accidental key
    .replace(/^['"]|['"]$/g, "")   // Strip accidental quotes
    .trim();
}

// Create the connection function
// USE postgres package for local (TCP) and neon for Neon Cloud (HTTP)
export const sql = DATABASE_URL
  ? (DATABASE_URL.includes("neon.tech") ? neon(DATABASE_URL) : postgres(DATABASE_URL))
  : ((...args: any[]) => {
    console.error("❌ DATABASE_URL is missing! Queries will fail.");
    throw new Error("DATABASE_URL is not configured.");
  }) as any;

// Initialize tables
export async function initializeTables() {
  if (!DATABASE_URL) {
    console.error("⚠️ [DB] Cannot initialize: DATABASE_URL is empty.");
    throw new Error("DATABASE_URL is missing");
  }

  console.log("🚀 [DB] Starting table initialization...");

  // 2. Initialize Tables (Connect to the actual target DB)
  try {
    console.log("🚀 [DB] Initializing tables...");

    // Create invitations table
    await sql`
            CREATE TABLE IF NOT EXISTS invitations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                slug VARCHAR(100) UNIQUE NOT NULL,
                theme_id VARCHAR(50) DEFAULT 'luxury',
                is_active BOOLEAN DEFAULT TRUE,
                views_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Add status column to invitations if missing
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='status') THEN
          ALTER TABLE invitations ADD COLUMN status VARCHAR(20) DEFAULT 'inactive';
        END IF;
      END $$;
    `;

    // Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add user_id column to invitations if missing
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='user_id') THEN
          ALTER TABLE invitations ADD COLUMN user_id INTEGER REFERENCES users(id);
        ELSE
          -- Ensure it's INTEGER even if it existed as VARCHAR
          ALTER TABLE invitations ALTER COLUMN user_id TYPE INTEGER USING user_id::INTEGER;
        END IF;
      END $$;
    `;

    // Create rsvps table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
                id SERIAL PRIMARY KEY,
                invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
                guest_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                attendance VARCHAR(50),
                guest_count INT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Create wishes table
    await sql`
            CREATE TABLE IF NOT EXISTS wishes (
                id SERIAL PRIMARY KEY,
                invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Create invitation_settings table
    await sql`
            CREATE TABLE IF NOT EXISTS invitation_settings (
                invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
                setting_key VARCHAR(100),
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (invitation_id, setting_key)
            )
        `;

    // Migration logic
    try {
      await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE`;
      await sql`ALTER TABLE wishes ADD COLUMN IF NOT EXISTS invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE`;
      await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS theme_id VARCHAR(50) DEFAULT 'luxury'`;
    } catch (e) { }

    // Admin Promotion Logic
    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
      console.log(`☝️ [DB] Promoting ${adminPhone} to admin...`);
      await sql`UPDATE users SET role = 'admin' WHERE phone = ${adminPhone}`;
    }

    console.log("✅ [DB] Database tables ready.");
  } catch (error: any) {
    console.error("❌ [DB] Table initialization failed:", error.message);
    throw error;
  }
}

// Startup - REMOVED for Vercel stability
/*
if (DATABASE_URL) {
  console.log("📍 [DB] Attempting auto-initialization...");
  initializeTables()
    .then(() => console.log("🏁 [DB] Initialization routine finished."))
    .catch(err => console.error("🚨 [DB] Fatal startup error:", err.message));
} else {
  console.warn("⚠️ [DB] No DATABASE_URL found. Initialize manually or check environment.");
}
*/

export default sql;
