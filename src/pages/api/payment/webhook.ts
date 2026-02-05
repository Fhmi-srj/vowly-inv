import type { APIRoute } from "astro";
import midtransClient from "midtrans-client";
import sql from "../../../lib/db";
import { createAccountFromRegistration } from "../../../lib/registration-helper";

export const POST: APIRoute = async ({ request }) => {
    try {
        const notificationJson = await request.json();

        const isProduction = import.meta.env.MIDTRANS_IS_PRODUCTION === "true";
        const serverKey = import.meta.env.MIDTRANS_SERVER_KEY || "";
        const clientKey = import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY || "";

        const snap = new midtransClient.Snap({
            isProduction: isProduction,
            serverKey: serverKey,
            clientKey: clientKey
        });

        const statusResponse = await snap.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

        let paymentStatus = "pending";

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                paymentStatus = "challenge";
            } else if (fraudStatus == 'accept') {
                paymentStatus = "settlement";
            }
        } else if (transactionStatus == 'settlement') {
            paymentStatus = "settlement";
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            paymentStatus = "failure";
        } else if (transactionStatus == 'pending') {
            paymentStatus = "pending";
        }

        // Update payment status in DB
        const [payment] = await sql`
            UPDATE payments 
            SET status = ${paymentStatus}, updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ${orderId}
            RETURNING id, invitation_id, user_id, registration_data
        `;

        if (!payment) {
            return new Response(JSON.stringify({ error: "Payment record not found" }), { status: 404 });
        }

        // If paid and it's a new registration (has registration_data but no user_id yet)
        if (paymentStatus === "settlement" && payment.registration_data && !payment.user_id) {
            await createAccountFromRegistration(payment.registration_data, orderId, payment.id);
        } else if (paymentStatus === "settlement" && payment.invitation_id) {
            // Case for existing users (top-up/upgrade/re-activation)
            await sql`
                UPDATE invitations 
                SET status = 'active' 
                WHERE id = ${payment.invitation_id}
            `;
        }

        return new Response(JSON.stringify({ status: "ok" }), { status: 200 });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
