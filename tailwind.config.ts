import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f6f7f9",
        foreground: "#172026",
        border: "#d9dee5",
        muted: "#667085",
        panel: "#ffffff",
        primary: "#126b79",
        accent: "#d8523f",
        warning: "#b7791f",
        success: "#237a57"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
