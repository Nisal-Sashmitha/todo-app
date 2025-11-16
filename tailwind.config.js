/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        work: '#3b82f6',
        personal: '#10b981',
        urgent: '#ef4444'
      }
    }
  },
  plugins: []
};
