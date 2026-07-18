import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12343B",       // deep sea slate — headings, footer
        tide: "#2E6F6C",      // primary teal — buttons, accents
        foam: "#EFF6F4",      // pale seafoam — section backgrounds
        sand: "#F6E9D8",      // warm sand — highlight chips
        citrus: "#E8A33D",    // amber — price + CTA emphasis
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
