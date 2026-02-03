import type { APIRoute } from "astro";
import sql from "../../../lib/db";
import { setSession } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { password } = await request.json();
        const envPassword = (import.meta as any).env?.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "admin123";
        const ADMIN_PASSWORD = envPassword.trim();

        // Debug log (internal)
        console.log("[AdminGate] Attempting login...");

        if (password.trim() !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: "Password Admin Salah" }), { status: 401 });
        }

        // Find the admin user
        const adminPhone = (import.meta as any).env?.ADMIN_PHONE || process.env.ADMIN_PHONE;
        let adminUser;

        if (adminPhone) {
            const users = await sql`SELECT id, role FROM users WHERE phone = ${adminPhone.trim()} LIMIT 1`;
            if (users.length > 0) {
                adminUser = users[0];
                // Sync role if it's not admin yet (important for new registrations)
                if (adminUser.role !== 'admin') {
                    console.log(`[AdminGate] Syncing role for ${adminPhone.trim()} to admin...`);
                    await sql`UPDATE users SET role = 'admin' WHERE id = ${adminUser.id}`;
                    adminUser.role = 'admin';
                }
            }
        }

        // If no specific admin user found by phone, look for any user with admin role
        if (!adminUser) {
            const admins = await sql`SELECT id, role FROM users WHERE role = 'admin' LIMIT 1`;
            if (admins.length > 0) adminUser = admins[0];
        }

        if (!adminUser) {
            console.warn("[AdminGate] Password matches, but no user with 'admin' role found in database.");
            return new Response(JSON.stringify({ error: "Akses Diterima, tapi Akun Admin belum terdaftar di database. Silakan daftar dulu dengan nomor HP yang ditentukan." }), { status: 404 });
        }

        const sessionCookie = setSession(adminUser.id);

        return new Response(
            JSON.stringify({ success: true, role: adminUser.role }),
            {
                status: 200,
                headers: {
                    "Set-Cookie": sessionCookie,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error: any) {
        console.error("Admin Login Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
