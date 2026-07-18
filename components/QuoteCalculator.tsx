"use client";

import { useEffect, useRef, useState } from "react";
import {
  quote,
  isServiceArea,
  CLEAN_TYPE,
  FREQUENCY,
  DEPOSIT_GBP,
  type CleanType,
  type Frequency,
} from "@/lib/pricing";

const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK; // e.g. "yourname/cleaning-visit"
const STRIPE_URL = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_URL;

type Step = "postcode" | "outOfArea" | "quote" | "book";

export default function QuoteCalculator() {
  const [step, setStep] = useState<Step>("postcode");
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");

  const [bedrooms, setBedrooms] = useState(2);
  const [cleanType, setCleanType] = useState<CleanType>("standard");
  const [frequency, setFrequency] = useState<Frequency>("oneOff");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const price = quote(bedrooms, cleanType, frequency);
  const recurring = cleanType === "standard" && frequency !== "oneOff";

  function checkPostcode() {
    const pc = postcode.trim().toUpperCase();
    if (pc.length < 2) {
      setPostcodeError("Enter your postcode to see your price");
      return;
    }
    if (isServiceArea(pc)) {
      setPostcodeError("");
      setStep("quote");
    } else {
      setStep("outOfArea");
    }
  }

  async function submitLead() {
    if (!name.trim() || !phone.trim()) {
      setSubmitError("Add your name and phone number so we can confirm your clean");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          postcode: postcode.trim().toUpperCase(),
          bedrooms,
          cleanType,
          frequency: cleanType === "standard" ? frequency : "oneOff",
          price,
        }),
      });
      setStep("book");
    } catch {
      // Still let them book — the lead also exists in Cal.com + Stripe
      setStep("book");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white shadow-xl shadow-ink/10 ring-1 ring-ink/5 p-6 sm:p-8">
      {step === "postcode" && (
        <PostcodeStep
          postcode={postcode}
          setPostcode={setPostcode}
          error={postcodeError}
          onCheck={checkPostcode}
        />
      )}

      {step === "outOfArea" && (
        <OutOfArea postcode={postcode} onBack={() => setStep("postcode")} />
      )}

      {step === "quote" && (
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Your quote</h2>
            <span className="text-xs text-ink/50">{postcode.trim().toUpperCase()}</span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="field-label">Bedrooms</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Number of bedrooms">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBedrooms(n)}
                    className={`pill ${bedrooms === n ? "pill-on" : "pill-off"}`}
                    aria-pressed={bedrooms === n}
                  >
                    {n === 5 ? "5+" : n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Type of clean</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Type of clean">
                {(Object.keys(CLEAN_TYPE) as CleanType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCleanType(t)}
                    className={`pill ${cleanType === t ? "pill-on" : "pill-off"}`}
                    aria-pressed={cleanType === t}
                  >
                    {CLEAN_TYPE[t].label}
                  </button>
                ))}
              </div>
            </div>

            {cleanType === "standard" && (
              <div>
                <span className="field-label">How often</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Frequency">
                  {(Object.keys(FREQUENCY) as Frequency[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`pill ${frequency === f ? "pill-on" : "pill-off"}`}
                      aria-pressed={frequency === f}
                    >
                      {FREQUENCY[f].label}
                      {FREQUENCY[f].note && (
                        <span className="ml-1 text-xs opacity-75">· {FREQUENCY[f].note}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between rounded-2xl bg-foam px-5 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-tide">
                {recurring ? "Per visit" : "Total"}
              </div>
              <div className="font-display text-4xl font-bold text-ink" aria-live="polite">
                £{price}
              </div>
            </div>
            <div className="text-right text-xs text-ink/60 max-w-[10rem]">
              £{DEPOSIT_GBP} deposit today, rest after your clean
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="field-label">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border-2 border-foam bg-white px-4 py-3 focus:border-tide focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="field-label">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border-2 border-foam bg-white px-4 py-3 focus:border-tide focus:outline-none"
                />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Email (for your confirmation)</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-foam bg-white px-4 py-3 focus:border-tide focus:outline-none"
              />
            </label>
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <button
              type="button"
              onClick={submitLead}
              disabled={submitting}
              className="w-full rounded-xl bg-citrus px-6 py-4 font-display text-lg font-semibold text-ink transition hover:brightness-105 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-tide"
            >
              {submitting ? "One moment…" : "Pick your date & time"}
            </button>
            <p className="text-center text-xs text-ink/50">
              No payment yet — choose a slot first
            </p>
          </div>
        </div>
      )}

      {step === "book" && (
        <BookingStep price={price} recurring={recurring} />
      )}
    </div>
  );
}

function PostcodeStep({
  postcode,
  setPostcode,
  error,
  onCheck,
}: {
  postcode: string;
  setPostcode: (v: string) => void;
  error: string;
  onCheck: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-1">Get your price in 30 seconds</h2>
      <p className="text-sm text-ink/60 mb-5">Start with your postcode — we cover Bristol and Weston-super-Mare.</p>
      <label className="block">
        <span className="field-label">Postcode</span>
        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCheck()}
          placeholder="BS1 4DJ"
          autoComplete="postal-code"
          className="w-full rounded-xl border-2 border-foam bg-white px-4 py-3 text-lg tracking-wide focus:border-tide focus:outline-none"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={onCheck}
        className="mt-4 w-full rounded-xl bg-tide px-6 py-4 font-display text-lg font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-citrus"
      >
        Show my price
      </button>
    </div>
  );
}

function OutOfArea({ postcode, onBack }: { postcode: string; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function joinWaitlist() {
    if (!email.trim()) return;
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "WAITLIST",
        phone: "-",
        email,
        postcode: postcode.trim().toUpperCase(),
      }),
    }).catch(() => {});
    setSent(true);
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-2">
        We&apos;re not in {postcode.trim().toUpperCase()} yet
      </h2>
      {sent ? (
        <p className="text-ink/70">You&apos;re on the list — we&apos;ll email you when we expand your way.</p>
      ) : (
        <>
          <p className="text-sm text-ink/60 mb-4">
            We currently cover Bristol and Weston-super-Mare. Leave your email and we&apos;ll tell you the moment we reach your area.
          </p>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-xl border-2 border-foam px-4 py-3 focus:border-tide focus:outline-none"
            />
            <button
              type="button"
              onClick={joinWaitlist}
              className="rounded-xl bg-tide px-5 py-3 font-semibold text-white hover:brightness-110"
            >
              Notify me
            </button>
          </div>
        </>
      )}
      <button type="button" onClick={onBack} className="mt-4 text-sm text-tide underline">
        Try a different postcode
      </button>
    </div>
  );
}

function BookingStep({ price, recurring }: { price: number; recurring: boolean }) {
  const calRef = useRef<HTMLDivElement>(null);

  // Cal.com inline embed
  useEffect(() => {
    if (!CAL_LINK || !calRef.current) return;
    const w = window as any;
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(w, "https://app.cal.com/embed/embed.js", "init");
    w.Cal("init", "booking", { origin: "https://cal.com" });
    w.Cal.ns.booking("inline", {
      elementOrSelector: calRef.current,
      calLink: CAL_LINK,
      layout: "month_view",
    });
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-1">Nearly there</h2>
      <ol className="mb-5 text-sm text-ink/60 list-decimal list-inside space-y-1">
        <li>Pick a date and time below</li>
        <li>
          Pay your £{DEPOSIT_GBP} deposit to lock it in — the remaining £{price - DEPOSIT_GBP}
          {recurring ? " per visit" : ""} is due after your clean
        </li>
      </ol>

      {CAL_LINK ? (
        <div ref={calRef} className="min-h-[420px] rounded-2xl overflow-hidden ring-1 ring-foam" />
      ) : (
        <div className="rounded-2xl bg-sand p-5 text-sm text-ink/70">
          Calendar not configured — set <code className="font-mono">NEXT_PUBLIC_CALCOM_LINK</code> in
          your environment (e.g. <code className="font-mono">yourname/cleaning-visit</code>).
        </div>
      )}

      <div className="mt-5">
        {STRIPE_URL ? (
          <a
            href={STRIPE_URL}
            className="block w-full rounded-xl bg-citrus px-6 py-4 text-center font-display text-lg font-semibold text-ink transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-tide"
          >
            Pay £{DEPOSIT_GBP} deposit
          </a>
        ) : (
          <div className="rounded-2xl bg-sand p-5 text-sm text-ink/70">
            Deposit button not configured — set{" "}
            <code className="font-mono">NEXT_PUBLIC_STRIPE_DEPOSIT_URL</code> to your Stripe Payment
            Link.
          </div>
        )}
        <p className="mt-2 text-center text-xs text-ink/50">
          Fully refundable up to 24 hours before your clean
        </p>
      </div>
    </div>
  );
}
