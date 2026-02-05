import type { APIRoute } from "astro";
import midtransClient from "midtrans-client";
import sql from "../../../lib/db";
import { REGISTRATION_PACKAGES, type PackageId } from "../../../lib/packages";
import { hashPassword } from "../../../lib/auth";
import { createAccountFromRegistration } from "../../../lib/registration-helper";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { fullName, phone, password, slug, themeId, package: packageId } = await request.json();

        if (!fullName || !phone || !password || !slug || !packageId) {
            return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
        }

        const pkg = REGISTRATION_PACKAGES[packageId as PackageId];
        if (!pkg) {
            return new Response(JSON.stringify({ error: "Paket tidak valid" }), { status: 400 });
        }

        // --- PRE-VALIDATION ---
        const existingUser = await sql`SELECT id FROM users WHERE phone = ${phone}`;
        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ error: "Nomor HP sudah terdaftar" }), { status: 400 });
        }

        const existingSlug = await sql`SELECT id FROM invitations WHERE slug = ${slug}`;
        if (existingSlug.length > 0) {
            return new Response(JSON.stringify({ error: "Subdomain/Slug sudah digunakan" }), { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const registrationData = {
            fullName,
            phone,
            password: hashedPassword,
            slug,
            themeId: themeId || "luxury",
            packageId
        };

        // --- FREE PACKAGE LOGIC ---
        if (pkg.price === 0) {
            const orderId = `FREE-${Date.now()}`;
            const [payment] = await sql`
                INSERT INTO payments (order_id, amount, package_id, status, registration_data)
                VALUES (${orderId}, 0, ${packageId}, 'settlement', ${sql.json(registrationData)})
                RETURNING id
            `;

            await createAccountFromRegistration(registrationData, orderId, payment.id);

            return new Response(JSON.stringify({ free: true, orderId }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // --- PAID PACKAGE LOGIC (MIDTRANS) ---
        const isProduction = import.meta.env.MIDTRANS_IS_PRODUCTION === "true";
        const serverKey = import.meta.env.MIDTRANS_SERVER_KEY || "";
        const clientKey = import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY || "";

        if (!serverKey) {
            return new Response(JSON.stringify({ error: "Konfigurasi payment tidak ditemukan" }), { status: 500 });
        }

        const snap = new midtransClient.Snap({
            isProduction: isProduction,
            serverKey: serverKey,
            clientKey: clientKey
        });

        const orderId = `INV-PRE-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: pkg.price
            },
            customer_details: {
                first_name: fullName,
                phone: phone,
                email: `${slug}@vowly.com`
            },
            item_details: [{
                id: pkg.id,
                price: pkg.price,
                quantity: 1,
                name: `Paket Undangan Digital - ${pkg.name}`
            }],
            enabled_payments: [
                "credit_card", "gopay", "shopeepay", "qris", "akulaku",
                "bca_va", "bni_va", "bri_va", "cimb_va", "permata_va", "other_va",
                "indomaret", "alfamart"
            ],
            callbacks: {
                finish: import.meta.env.MIDTRANS_NEXT_URL || "http://localhost:4321/dashboard"
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        await sql`
            INSERT INTO payments (order_id, amount, package_id, snap_token, status, registration_data)
            VALUES (${orderId}, ${pkg.price}, ${packageId}, ${snapToken}, 'pending', ${sql.json(registrationData)})
        `;

        return new Response(JSON.stringify({ token: snapToken, orderId }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("Payment Token Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Gagal proses pendaftaran" }), { status: 500 });
    }
};
