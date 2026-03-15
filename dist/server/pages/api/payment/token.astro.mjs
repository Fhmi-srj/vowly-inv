import midtransClient from 'midtrans-client';
import { s as sql } from '../../../chunks/db_BEFLq8SP.mjs';
import { R as REGISTRATION_PACKAGES } from '../../../chunks/packages_utg4v2Xt.mjs';
import { h as hashPassword } from '../../../chunks/auth_CQCycFgF.mjs';
import { c as createAccountFromRegistration } from '../../../chunks/registration-helper_Dde8CMeX.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { fullName, phone, password, slug, themeId, package: packageId } = await request.json();
    if (!fullName || !phone || !password || !slug || !packageId) {
      return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
    }
    const pkg = REGISTRATION_PACKAGES[packageId];
    if (!pkg) {
      return new Response(JSON.stringify({ error: "Paket tidak valid" }), { status: 400 });
    }
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
    if (pkg.price === 0) {
      const orderId2 = `FREE-${Date.now()}`;
      const [payment] = await sql`
                INSERT INTO payments (order_id, amount, package_id, status, registration_data)
                VALUES (${orderId2}, 0, ${packageId}, 'settlement', ${sql.json(registrationData)})
                RETURNING id
            `;
      await createAccountFromRegistration(registrationData, orderId2, payment.id);
      return new Response(JSON.stringify({ free: true, orderId: orderId2 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const clientKey = process.env.PUBLIC_MIDTRANS_CLIENT_KEY || "";
    if (!serverKey) {
      return new Response(JSON.stringify({ error: "Konfigurasi payment tidak ditemukan" }), { status: 500 });
    }
    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey
    });
    const orderId = `INV-PRE-${Date.now()}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pkg.price
      },
      customer_details: {
        first_name: fullName,
        phone,
        email: `${slug}@vowly.com`
      },
      item_details: [{
        id: pkg.id,
        price: pkg.price,
        quantity: 1,
        name: `Paket Undangan Digital - ${pkg.name}`
      }],
      enabled_payments: [
        "credit_card",
        "gopay",
        "shopeepay",
        "qris",
        "akulaku",
        "bca_va",
        "bni_va",
        "bri_va",
        "cimb_va",
        "permata_va",
        "other_va",
        "indomaret",
        "alfamart"
      ],
      callbacks: {
        finish: process.env.MIDTRANS_NEXT_URL || "http://localhost:4321/dashboard"
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
  } catch (error) {
    console.error("Payment Token Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Gagal proses pendaftaran" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
