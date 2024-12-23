import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        alice: ['var(--font-alice)'],
        sacramento: ['var(--font-sacramento)'],
        opensans: ['var(--font-opensans)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
