const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL);

async function testWebhook() {
    try {
        console.log("Setting up test data...");

        // 1. Ensure we have a user and invitation to test with
        const [user] = await sql`SELECT id FROM users LIMIT 1`;
        if (!user) throw new Error("No user found in DB");

        const [inv] = await sql`SELECT id FROM invitations WHERE user_id = ${user.id} LIMIT 1`;
        if (!inv) throw new Error("No invitation found for user");

        // Reset invitation status
        await sql`UPDATE invitations SET status = 'inactive' WHERE id = ${inv.id}`;

        const orderId = "TEST-ORDER-" + Date.now();

        // 2. Insert a pending payment
        await sql`
            INSERT INTO payments (user_id, invitation_id, order_id, amount, package_id, status)
            VALUES (${user.id}, ${inv.id}, ${orderId}, 150000, 'premium', 'pending')
        `;
        console.log("Created pending payment with Order ID:", orderId);

        // 3. Mock Midtrans Notification
        const notification = {
            transaction_time: "2026-02-06 00:00:00",
            transaction_status: "settlement",
            transaction_id: "test-trans-id-123",
            status_message: "midtrans payment notification",
            status_code: "200",
            signature_key: "mock-signature",
            payment_type: "credit_card",
            order_id: orderId,
            merchant_id: "test-merchant",
            gross_amount: "150000.00",
            fraud_status: "accept",
            currency: "IDR"
        };

        console.log("Sending mock webhook notification...");
        // Use global fetch
        const response = await fetch("http://localhost:4321/api/payment/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notification)
        });

        const result = await response.json();
        console.log("Webhook response:", result);

        // 4. Verify DB changes
        const [payment] = await sql`SELECT status FROM payments WHERE order_id = ${orderId}`;
        const [invitation] = await sql`SELECT status FROM invitations WHERE id = ${inv.id}`;

        console.log("--- FINAL STATUS ---");
        console.log("Payment Status (expected 'settlement'):", payment.status);
        console.log("Invitation Status (expected 'active'):", invitation.status);

        if (payment.status === 'settlement' && invitation.status === 'active') {
            console.log("✅ WEBHOOK TEST PASSED!");
        } else {
            console.error("❌ WEBHOOK TEST FAILED!");
        }

    } catch (error) {
        console.error("Error during test:", error);
    } finally {
        await sql.end();
    }
}

testWebhook();
