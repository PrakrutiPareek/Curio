/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rainbow: {
          red: '#F87171',
          orange: '#FB923C',
          yellow: '#FACC15',
          green: '#4ADE80',
          blue: '#38BDF8',
          purple: '#A78BFA',
          pink: '#F472B6',
        },
        curio: {
          background: '#FFFBEB',
          text: '#334155',
        },
      },
    },
  },
  plugins: [],
}
