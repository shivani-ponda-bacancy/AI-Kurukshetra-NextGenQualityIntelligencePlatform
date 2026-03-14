import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(216 20% 88%)",
        input: "hsl(216 20% 88%)",
        ring: "hsl(203 84% 44%)",
        background: "hsl(210 33% 98%)",
        foreground: "hsl(220 39% 11%)",
        primary: {
          DEFAULT: "hsl(203 84% 44%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(200 22% 95%)",
          foreground: "hsl(220 39% 11%)",
        },
        accent: {
          DEFAULT: "hsl(28 92% 52%)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(210 20% 94%)",
          foreground: "hsl(215 16% 40%)",
        },
        success: {
          DEFAULT: "hsl(157 72% 35%)",
          foreground: "hsl(0 0% 100%)",
        },
        warning: {
          DEFAULT: "hsl(36 94% 52%)",
          foreground: "hsl(220 39% 11%)",
        },
        danger: {
          DEFAULT: "hsl(0 72% 51%)",
          foreground: "hsl(0 0% 100%)",
        },
        surface: "hsl(0 0% 100%)",
      },
      boxShadow: {
        soft: "0 20px 60px -28px rgba(15, 23, 42, 0.25)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
