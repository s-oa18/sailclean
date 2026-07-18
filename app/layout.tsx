import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home cleaning in Bristol & Weston-super-Mare — instant quote",
  description:
    "Book a vetted local cleaner in under two minutes. Instant pricing, no callbacks, no quotes-by-email. Serving BS and BA postcodes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
