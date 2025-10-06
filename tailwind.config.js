/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1FA88E',
          orange: '#F5A623',
          gray: '#4A5568',
        },
      },
    },
  },
  plugins: [],
};
