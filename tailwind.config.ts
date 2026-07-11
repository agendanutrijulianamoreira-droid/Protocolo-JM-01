import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        creme: "#F4EFE4",
        "marrom-escuro": "#2B1A10",
        dourado: "#C9A435",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#C9A435",
          foreground: "#2B1A10",
        },
        secondary: {
          DEFAULT: "#F4EFE4",
          foreground: "#2B1A10",
        },
        muted: {
          DEFAULT: "#EDE6D6",
          foreground: "#6B5B4A",
        },
        destructive: {
          DEFAULT: "#B3423B",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFDF8",
          foreground: "#2B1A10",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "goal-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "goal-pop": "goal-pop 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
