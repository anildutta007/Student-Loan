/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scenario: {
          a: '#1f77b4',      // Blue - Conservative
          b: '#2ca02c',      // Green - Moderate
          c: '#ff7f0e',      // Orange - Higher
          d: '#d62728',      // Red - Premium
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
