/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF4C00',
        'brand-blue': '#B5D4FF',
        'dark-bg': '#000000',
        'dark-card': '#121212',
      },
    },
  },
  plugins: [],
}
