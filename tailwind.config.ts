import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bumpr: {
          DEFAULT: "#111827",
          accent: "#f97316",
        },
      },
    },
  },
  plugins: [],
};
export default config;
