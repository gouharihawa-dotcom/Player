/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e50914",
        "primary-hover": "#b20710",
        dark: "#141414",
        darker: "#0b0b0b",
        surface: "#1f1f1f",
        "surface-light": "#2a2a2a",
        text: "#e5e5e5",
        "text-muted": "#a3a3a3",
        border: "#333333",
      },
    },
  },
  plugins: [],
}
