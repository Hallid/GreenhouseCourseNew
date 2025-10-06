/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1FA88E',
          'teal-light': '#2BC5A7',
          'teal-dark': '#188770',
          green: '#4CAF50',
          'green-light': '#81C784',
          orange: '#F5A623',
          'orange-light': '#FFB74D',
          gray: '#4A5568',
        },
      },
      backgroundImage: {
        'gradient-nature': 'linear-gradient(135deg, #1FA88E 0%, #4CAF50 50%, #81C784 100%)',
        'gradient-brand': 'linear-gradient(135deg, #1FA88E 0%, #188770 100%)',
      },
    },
  },
  plugins: [],
};
