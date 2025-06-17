// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Essential for scanning your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        apexBlue: '#0056b3',
        apexDarkBlue: '#003366',
        apexGray: '#f8f8f8',
      }
    },
  },
  plugins: [],
}