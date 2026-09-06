/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0d0f",
        surface: "#141417",
        "surface-raised": "#1c1c21",
        "surface-border": "#27272e",
        primary: "#f3f3f6",
        secondary: "#8e8e99",
        accent: "#d4af37", // Warm gold / champagne
        "accent-hover": "#e5c358",
        danger: "#ef4444",
        success: "#10b981",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        syne: ['"Syne"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
        tightest: "-.04em",
      },
    },
  },
  plugins: [],
}
