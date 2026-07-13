import type { Config } from "tailwindcss";

// Design tokens taken 1:1 from the Konsole / TV Dashboard design, registered as
// named Tailwind tokens so components use `bg-panel`, `text-muted`, etc. — never
// the raw `[var(--x)]` arbitrary syntax.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        panel: "var(--panel)",
        "panel-2": "var(--panel-2)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        janne: "var(--janne)",
        simon: "var(--simon)",
        success: "var(--success)",
        danger: "var(--danger)",
        warn: "var(--warn)",
        tech: "var(--tech)",
      },
      borderRadius: {
        pill: "99px",
        card: "14px",
        item: "10px",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
