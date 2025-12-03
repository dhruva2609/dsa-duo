/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        duoGreen: "#58cc02",
        duoGreenDark: "#46a302",
        duoBlue: "#1cb0f6",
        duoBlueDark: "#1899d6",
      }
    },
  },
  plugins: [],
}