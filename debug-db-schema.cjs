const postgres = require('postgres');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function checkSchema() {
    try {
        console.log("--- Invitations Table Columns ---");
        const invCols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'invitations'
    `;
        console.table(invCols);

        console.log("\n--- Users Table Columns ---");
        const userCols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
        console.table(userCols);

        console.log("\n--- Sample Invitation (First 1) ---");
        const sample = await sql`SELECT * FROM invitations LIMIT 1`;
        console.log(JSON.stringify(sample[0], null, 2));

    } catch (error) {
        console.error("Error during schema check:", error);
    } finally {
        await sql.end();
    }
}

checkSchema();
