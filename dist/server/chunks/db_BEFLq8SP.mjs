import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

const getDbUrl = () => {
  try {
    const url = "postgresql://postgres:Fahmimsm@localhost:5432/wedding_db";
    if (url) return url;
  } catch (e) {
  }
  try {
    const url = process.env.DATABASE_URL;
    if (url) return url;
  } catch (e) {
  }
  return "";
};
let DATABASE_URL = getDbUrl();
if (DATABASE_URL) {
  DATABASE_URL = DATABASE_URL.replace(/^DATABASE_URL=/, "").replace(/^['"]|['"]$/g, "").trim();
}
const sql = DATABASE_URL ? DATABASE_URL.includes("neon.tech") ? neon(DATABASE_URL) : postgres(DATABASE_URL) : ((...args) => {
  console.error("❌ DATABASE_URL is missing! Queries will fail.");
  throw new Error("DATABASE_URL is not configured.");
});
async function initializeTables() {
  if (!DATABASE_URL) {
    console.error("⚠️ [DB] Cannot initialize: DATABASE_URL is empty.");
    throw new Error("DATABASE_URL is missing");
  }
  console.log("🚀 [DB] Starting table initialization...");
  try {
    console.log("🚀 [DB] Initializing tables...");
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
    console.log("✅ [DB] users table ready");
    await sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        slug VARCHAR(100) UNIQUE NOT NULL,
        theme_id VARCHAR(50) DEFAULT 'luxury',
        package_id VARCHAR(50) DEFAULT 'basic',
        status VARCHAR(20) DEFAULT 'inactive',
        is_active BOOLEAN DEFAULT TRUE,
        views_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ [DB] invitations table ready");
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
    console.log("✅ [DB] rsvps table ready");
    await sql`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ [DB] wishes table ready");
    await sql`
      CREATE TABLE IF NOT EXISTS invitation_settings (
        invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
        setting_key VARCHAR(100),
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (invitation_id, setting_key)
      )
    `;
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
      )
    `;
    console.log("✅ [DB] payments table ready");
    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
      console.log(`☝️ [DB] Promoting ${adminPhone} to admin...`);
      await sql`UPDATE users SET role = 'admin' WHERE phone = ${adminPhone}`;
    }
    console.log("✅ [DB] Database tables ready.");
  } catch (error) {
    console.error("❌ [DB] Table initialization failed:", error.message);
    throw error;
  }
}

export { initializeTables as i, sql as s };
