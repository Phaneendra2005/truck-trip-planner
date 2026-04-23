/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkCard: '#1e293b',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        accentOffDuty: '#94a3b8',
        accentSleeper: '#facc15',
        accentDriving: '#ef4444',
        accentOnDuty: '#3b82f6'
      }
    },
  },
  plugins: [],
}