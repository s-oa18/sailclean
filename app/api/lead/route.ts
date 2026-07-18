import { NextRequest, NextResponse } from "next/server";

// Phase 0: no DB. Leads are forwarded to a Google Apps Script webhook
// that appends a row to a Google Sheet (see README for the 5-line script).
// If SHEETS_WEBHOOK_URL is unset, leads are logged to Vercel function logs
// so nothing is silently dropped while you wire the sheet up.

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, postcode, bedrooms, cleanType, frequency, price } = body;

  if (!name || !phone || !postcode) {
    return NextResponse.json({ error: "Name, phone and postcode are required" }, { status: 400 });
  }

  const lead = {
    ts: new Date().toISOString(),
    name,
    phone,
    email: email ?? "",
    postcode,
    bedrooms,
    cleanType,
    frequency,
    price,
    source: "web",
  };

  const webhook = process.env.SHEETS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      // Log but don't fail the customer's booking flow over a sheet hiccup
      console.error("LEAD_WEBHOOK_FAILED", err, JSON.stringify(lead));
    }
  } else {
    console.log("LEAD (no webhook configured):", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true });
}
