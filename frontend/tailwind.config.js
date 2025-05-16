import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [  daisyui,],
  daisyui: {
    themes: [
      {
        mydark: {
          "primary": "#1f6feb",
          "secondary": "#161b22",
          "accent": "#3fb950",
          "neutral": "#0d1117",
          "base-100": "#0d1117",
          "info": "#58a6ff",
          "success": "#2ea043",
          "warning": "#f0b400",
          "error": "#da3633",
          "--rounded-box": "0.5rem",
          "--tab-border": "1px",
        },
      },
      "dark", // fallback
    ],
    darkTheme: "mydark", // Use this theme for dark mode
  },
}
