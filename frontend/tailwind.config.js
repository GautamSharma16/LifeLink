/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#e11d48",
          600: "#be123c",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
