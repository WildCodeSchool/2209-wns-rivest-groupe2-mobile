/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      'c-block': '#45C7C9',
     'black': colors.black,
      'white': colors.white,
    }
  },
  plugins: [],
}

