/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe',
          pink: '#ff2a6d',
        },
        dark: {
          bg: '#0a0e17',
          card: 'rgba(22, 33, 62, 0.6)',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 243, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(188, 19, 254, 0.5)',
      }
    },
  },
  plugins: [],
}
