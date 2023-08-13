/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      anton: ["Anton", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {},
    colors: {
      "custom-primary": "#35B5AD",
      "custom-secondary": "#EBEBEB",
      white: "#ffffff",
      black: "#000000",
      green: "#16FF2E",
    }
  },
  plugins: [require("daisyui")],
};
