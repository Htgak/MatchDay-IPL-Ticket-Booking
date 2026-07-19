/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald 500
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#111827',
          light: '#1f2937'
        }
      }
    },
  },
  plugins: [],
}
