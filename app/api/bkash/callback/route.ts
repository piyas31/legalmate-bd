import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

const BKASH_BASE_URL = "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized";
const BKASH_TOKEN_URL = `${BKASH_BASE_URL}/checkout/token/grant`;
// ✅ FIX: same host as everything else, and /checkout/execute (not /checkout/payment/execute)
const BKASH_EXECUTE_PAYMENT_URL = `${BKASH_BASE_URL}/checkout/execute`;

const BKASH_USERNAME = process.env.BKASH_USERNAME;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD;
const BKASH_APP_KEY = process.env.BKASH_APP_KEY;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET;

async function getBkashToken() {
  try {
    const response = await fetch(BKASH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "username": BKASH_USERNAME!.trim(),
        "password": BKASH_PASSWORD!.trim(),
      },
      body: JSON.stringify({
        app_key: BKASH_APP_KEY!.trim(),
        app_secret: BKASH_APP_SECRET!.trim(),
      }),
    });

    const data = await response.json();
    return data.id_token;
  } catch (error) {
    console.error("💥 Callback Token Grant Exception:", error);
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  if (status === "cancel" || status === "failure") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=failed`);
  }

  try {
    const token = await getBkashToken();
    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error`);
    }

    const response = await fetch(BKASH_EXECUTE_PAYMENT_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-APP-Key": BKASH_APP_KEY!.trim(),
        "Authorization": token.trim(),
      },
      body: JSON.stringify({ paymentID }),
    });

    const executeData = await response.json();
    console.log("🔄 bKash Payment Execute Response:", executeData);

    if (executeData.transactionStatus === "Completed") {
      const appointmentId = executeData.payerReference;

      await db
        .update(appointments)
        .set({ paymentStatus: "paid" })
        .where(eq(appointments.id, appointmentId));

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=failed`);
  } catch (error) {
    console.error("💥 bKash Execute Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error`);
  }
}