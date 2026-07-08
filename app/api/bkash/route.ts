import { NextResponse } from "next/server";
import axios from "axios";

const BKASH_BASE_URL = "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized";

const BKASH_USERNAME = process.env.BKASH_USERNAME?.trim() || "";
const BKASH_PASSWORD = process.env.BKASH_PASSWORD?.trim() || "";
const BKASH_APP_KEY = process.env.BKASH_APP_KEY?.trim() || "";
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET?.trim() || "";

async function getBkashToken() {
  try {
    const tokenUrl = `${BKASH_BASE_URL}/checkout/token/grant`;

    const response = await axios.post(tokenUrl, {
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "username": BKASH_USERNAME,
        "password": BKASH_PASSWORD
      }
    });

    console.log("🔍 [STEP 2] Token Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("💥 Token Generation Exception:", error.response?.data || error.message);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { amount, appointmentId } = await req.json();

    const tokenResponse = await getBkashToken();

    if (!tokenResponse || !tokenResponse.id_token) {
      return NextResponse.json({
        error: "Token generation failed at bKash end",
        bKashRawResponse: tokenResponse
      }, { status: 401 });
    }

    console.log("💳 [STEP 3] Proceeding to Create Payment...");

    const formattedAmount = Number(amount).toFixed(2);

    // ✅ FIX 1: correct path is /checkout/create (NOT /checkout/payment/create)
    const createPaymentUrl = `${BKASH_BASE_URL}/checkout/create`;

    const response = await axios.post(createPaymentUrl, {
      mode: "0011",
      payerReference: appointmentId.toString(),
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bkash/callback`,
      amount: formattedAmount,
      currency: "BDT",
      intent: "sale",
       merchantInvoiceNumber: `INV-${appointmentId}-${Date.now()}`
    }, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-App-Key": BKASH_APP_KEY,
        // ✅ FIX 2: bKash wants the RAW id_token, not "Bearer <token>"
        "Authorization": tokenResponse.id_token.trim()
      }
    });

    console.log("🎯 [STEP 4] bKash Payment Create Final Response:", response.data);

    return NextResponse.json({
      bkashURL: response.data.bkashURL,
      ...response.data
    });

  } catch (error: any) {
    console.error("💥 bKash Route Main Error:", error.response?.data || error.message);
    return NextResponse.json({
      error: "bKash API Error",
      details: error.response?.data || error.message
    }, { status: 400 });
  }
}