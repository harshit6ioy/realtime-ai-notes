/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f5f3f0",
          100: "#ede8e3",
          200: "#ddd4ca",
          300: "#cbb7a6",
          400: "#b39983",
          500: "#9d7f6a",
          600: "#8a6b59",
          700: "#74584a",
          800: "#62493f",
          900: "#54403a",
        },
      },
    },
  },
  plugins: [],
};