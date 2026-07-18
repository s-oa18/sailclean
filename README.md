# Sail Clean — Phase 0 (Lead Capture)

Instant-quote landing page for Bristol & Weston-super-Mare. No accounts, no DB, no job board — by design. See the roadmap before adding anything.

## Ship tonight — runbook (~30 min)

### 1. Deploy (5 min)

```bash
git init && git add -A && git commit -m "Phase 0"
# push to GitHub, then import at vercel.com/new — zero config needed
```

### 2. Cal.com (10 min)

- Create an event type, e.g. "Cleaning visit" (set duration + your working hours)
- Env var: `NEXT_PUBLIC_CALCOM_LINK=yourusername/cleaning-visit`

### 3. Stripe deposit (5 min)

- Dashboard → Payment Links → new link, one product "Booking deposit", £20
- Env var: `NEXT_PUBLIC_STRIPE_DEPOSIT_URL=https://buy.stripe.com/...`
- In the Payment Link settings, set the after-payment redirect back to your site

### 4. Leads → Google Sheet (10 min)

Create a Sheet, then Extensions → Apps Script, paste:

```javascript
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()[0]
    .appendRow([
      d.ts,
      d.name,
      d.phone,
      d.email,
      d.postcode,
      d.bedrooms,
      d.cleanType,
      d.frequency,
      d.price,
      d.source,
    ]);
  return ContentService.createTextOutput("ok");
}
```

Deploy → New deployment → Web app → execute as **Me**, access **Anyone**. Copy the URL into `SHEETS_WEBHOOK_URL` (Vercel env var, **not** `NEXT_PUBLIC_`).

If the webhook is unset or fails, leads still hit Vercel function logs — nothing is silently dropped.

### 5. Set env vars in Vercel → redeploy

```
NEXT_PUBLIC_CALCOM_LINK=
NEXT_PUBLIC_STRIPE_DEPOSIT_URL=
SHEETS_WEBHOOK_URL=
```

## Editing prices

Everything is in **`lib/pricing.ts`** — base price per bedroom count, clean-type multipliers, frequency discounts, deposit amount, and the postcode gate. One file, no other changes needed.

## Rename the business

"Brightside Cleaning" is a placeholder — grep for `Brightside` (appears in `app/page.tsx` and metadata in `app/layout.tsx`).

## What's deliberately NOT here (don't add it)

- No database — leads go to the Sheet. Phase 1 replaces this.
- No auth, no admin panel, no cleaner accounts — Phase 1–2.
- Deposit is a static £20 Payment Link, not amount-matched to the quote. Stripe Payment Links can't take dynamic amounts; matching deposit-to-quote needs Checkout Sessions server-side, which needs a Stripe secret key + API route — that's Phase 1 work. £20 flat is fine for validation.
- Cal.com booking and Stripe payment aren't linked to each other or to the lead row. You reconcile manually in the Sheet. Annoying at 20 bookings/week; irrelevant at Phase 0 volume. This pain is exactly what justifies Phase 1.

## Known gaps (acceptable for Phase 0)

- Postcode gate is `SERVICE_AREAS = ["BS"]` in `lib/pricing.ts` — Bristol + Weston only. Out-of-area postcodes go to the waitlist; when expanding, add prefixes/outward codes (e.g. `"BA1"` for Bath city) and use waitlist counts by outward code to pick the next area.
- No spam protection on `/api/lead`. Add Cloudflare Turnstile only if you actually get spammed.
