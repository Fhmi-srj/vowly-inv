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
function parseDbInfo(urlStr) {
  try {
    const url = new URL(urlStr);
    const dbName = url.pathname.replace(/^\//, "").split(/[?#]/)[0];
    url.pathname = "/postgres";
    const baseUrl = url.toString();
    return { dbName, baseUrl };
  } catch (e) {
    const dbName = urlStr.split("/").pop()?.split(/[?#]/)[0] || "wedding_db";
    const baseUrl = urlStr.replace(new RegExp(`/${dbName}(\\?.*)?$`), "/postgres$1");
    return { dbName, baseUrl };
  }
}
async function initializeTables() {
  if (!DATABASE_URL) {
    console.error("⚠️ [DB] Cannot initialize: DATABASE_URL is empty.");
    return;
  }
  const { dbName, baseUrl } = parseDbInfo(DATABASE_URL);
  console.log(`🔍 [DB] Targeted database: "${dbName}"`);
  try {
    console.log(`� [DB] Connecting to default "postgres" to check "${dbName}"...`);
    const tempSql = postgres(baseUrl, {
      max: 1,
      idle_timeout: 1,
      connect_timeout: 5
    });
    const dbs = await tempSql`SELECT datname FROM pg_database WHERE datname = ${dbName}`;
    if (dbs.length === 0) {
      console.log(`✨ [DB] Database "${dbName}" missing. Creating...`);
      await tempSql.unsafe(`CREATE DATABASE ${dbName}`);
      console.log(`🎉 [DB] Database "${dbName}" created successfully!`);
    } else {
      console.log(`✅ [DB] Database "${dbName}" exists.`);
    }
    await tempSql.end();
  } catch (err) {
    console.warn("⚠️ [DB] Warning during database check:", err.message);
    if (err.message.includes("does not exist") && err.message.includes("postgres")) {
      console.error("🚨 [DB] Fatal: Default 'postgres' database not found on server.");
    }
  }
  try {
    console.log("🚀 [DB] Initializing tables...");
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
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='status') THEN
          ALTER TABLE invitations ADD COLUMN status VARCHAR(20) DEFAULT 'inactive';
        END IF;
      END $$;
    `;
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
    await sql`
            CREATE TABLE IF NOT EXISTS wishes (
                id SERIAL PRIMARY KEY,
                invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await sql`
            CREATE TABLE IF NOT EXISTS invitation_settings (
                invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE,
                setting_key VARCHAR(100),
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (invitation_id, setting_key)
            )
        `;
    try {
      await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE`;
      await sql`ALTER TABLE wishes ADD COLUMN IF NOT EXISTS invitation_id INT REFERENCES invitations(id) ON DELETE CASCADE`;
      await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS theme_id VARCHAR(50) DEFAULT 'luxury'`;
    } catch (e) {
    }
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
if (DATABASE_URL) {
  console.log("📍 [DB] Attempting auto-initialization...");
  initializeTables().then(() => console.log("🏁 [DB] Initialization routine finished.")).catch((err) => console.error("🚨 [DB] Fatal startup error:", err.message));
} else {
  console.warn("⚠️ [DB] No DATABASE_URL found. Initialize manually or check environment.");
}

export { initializeTables as i, sql as s };
