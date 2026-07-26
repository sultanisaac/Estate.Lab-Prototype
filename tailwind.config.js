/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F4C5C", // Deep Emerald Teal
          secondary: "#D4B483", // Champagne Gold
          background: "#FAF8F4", // Warm Ivory
          accent: "#E8DCCB", // Blush Sand
          text: "#1F2937", // Graphite
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
