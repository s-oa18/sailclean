import QuoteCalculator from "@/components/QuoteCalculator";

export default function Home() {
  return (
    <main>
      {/* Hero: the calculator IS the pitch */}
      <section className="bg-foam">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-16 sm:pt-12 sm:pb-24">
          <header className="mb-10 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">
              Sail<span className="text-tide">Clean</span>
            </span>
            <span className="hidden sm:block text-sm text-ink/60">
              Bristol &amp; Weston-super-Mare
            </span>
          </header>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="pt-2 lg:pt-10">
              <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-ink">
                A spotless home,
                <br />
                booked before the kettle boils.
              </h1>
              <p className="mt-5 text-lg text-ink/70 max-w-md">
                Instant price, real calendar, vetted cleaners. No
                quote-by-callback, no waiting for someone to ring you back on
                Tuesday.
              </p>
              <ul className="mt-8 space-y-3 text-ink/80">
                {[
                  "See your exact price in 30 seconds",
                  "Pick a slot that suits you — evenings and weekends too",
                  "Small deposit locks it in, pay the rest after your clean",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-citrus"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <QuoteCalculator />
          </div>
        </div>
      </section>

      {/* How it works — kept tight, no filler sections */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Quote",
              text: "Tell us your postcode, bedrooms and how often. Your price appears instantly — what you see is what you pay.",
            },
            {
              title: "Book",
              text: "Choose a date and time from the live calendar and secure it with a small deposit.",
            },
            {
              title: "Relax",
              text: "A vetted local cleaner arrives with everything needed. Pay the balance after the job, only if you're happy.",
            },
          ].map((s) => (
            <div key={s.title}>
              <h3 className="font-display text-lg font-semibold text-tide mb-2">
                {s.title}
              </h3>
              <p className="text-ink/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-ink text-white/70">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <span>
            © {new Date().getFullYear()} SailClean · Bristol &amp;
            Weston-super-Mare
          </span>
          <a href="#top" className="hover:text-white">
            Get a quote
          </a>
        </div>
      </footer>
    </main>
  );
}
