import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#08090d",
        ink: "#11131a",
        line: "#262a35",
        champagne: "#f5f0e6",
        gold: "#c7a45a",
        mint: "#35d0ba",
        rose: "#ed4d6e",
        smoke: "#9ca3af"
      },
      boxShadow: {
        panel: "0 20px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
