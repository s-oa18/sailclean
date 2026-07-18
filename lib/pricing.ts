// ─── EDIT THIS FILE TO CHANGE PRICES ───────────────────────────────
// All prices in GBP. Everything on the site derives from this config.

export const DEPOSIT_GBP = 20;

export type CleanType = "standard" | "deep" | "endOfTenancy";
export type Frequency = "oneOff" | "weekly" | "fortnightly";

// Base price per visit by bedrooms (standard clean, one-off)
export const BASE_PRICE: Record<number, number> = {
  1: 55,
  2: 70,
  3: 85,
  4: 100,
  5: 120, // 5+ beds
};

export const CLEAN_TYPE: Record<CleanType, { label: string; multiplier: number }> = {
  standard: { label: "Standard clean", multiplier: 1.0 },
  deep: { label: "Deep clean", multiplier: 1.6 },
  endOfTenancy: { label: "End of tenancy", multiplier: 2.0 },
};

export const FREQUENCY: Record<Frequency, { label: string; multiplier: number; note?: string }> = {
  oneOff: { label: "One-off", multiplier: 1.0 },
  fortnightly: { label: "Fortnightly", multiplier: 0.9, note: "10% off per visit" },
  weekly: { label: "Weekly", multiplier: 0.85, note: "15% off per visit" },
};

// Recurring discounts only apply to standard cleans (deep/EoT are one-off jobs)
export function quote(bedrooms: number, cleanType: CleanType, frequency: Frequency): number {
  const beds = Math.min(Math.max(bedrooms, 1), 5);
  const base = BASE_PRICE[beds] * CLEAN_TYPE[cleanType].multiplier;
  const freq = cleanType === "standard" ? FREQUENCY[frequency].multiplier : 1.0;
  return Math.round(base * freq);
}

// ─── Postcode gate ─────────────────────────────────────────────────
// Add prefixes or outward codes here when opening a new area.
// e.g. opening Bath city later: ["BS", "BA1", "BA2", "BA3"]
export const SERVICE_AREAS = ["BS"]; // Bristol + Weston-super-Mare (BS22–24)

export function isServiceArea(postcode: string): boolean {
  const pc = postcode.trim().toUpperCase().replace(/\s+/g, "");
  // Plausible UK postcode: outward code, optionally with full inward code
  if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?(\d[A-Z]{2})?$/.test(pc)) return false;
  return SERVICE_AREAS.some((area) => pc.startsWith(area));
}
