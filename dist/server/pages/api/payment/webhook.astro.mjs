import midtransClient from 'midtrans-client';
import { s as sql } from '../../../chunks/db_BEFLq8SP.mjs';
import { c as createAccountFromRegistration } from '../../../chunks/registration-helper_Dde8CMeX.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const notificationJson = await request.json();
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const clientKey = process.env.PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey
    });
    const statusResponse = await snap.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);
    let paymentStatus = "pending";
    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        paymentStatus = "challenge";
      } else if (fraudStatus == "accept") {
        paymentStatus = "settlement";
      }
    } else if (transactionStatus == "settlement") {
      paymentStatus = "settlement";
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      paymentStatus = "failure";
    } else if (transactionStatus == "pending") {
      paymentStatus = "pending";
    }
    const [payment] = await sql`
            UPDATE payments 
            SET status = ${paymentStatus}, updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ${orderId}
            RETURNING id, invitation_id, user_id, registration_data
        `;
    if (!payment) {
      return new Response(JSON.stringify({ error: "Payment record not found" }), { status: 404 });
    }
    if (paymentStatus === "settlement" && payment.registration_data && !payment.user_id) {
      await createAccountFromRegistration(payment.registration_data, orderId, payment.id);
    } else if (paymentStatus === "settlement" && payment.invitation_id) {
      await sql`
                UPDATE invitations 
                SET status = 'active' 
                WHERE id = ${payment.invitation_id}
            `;
    }
    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
