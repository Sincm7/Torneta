/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D7EFF',
          light: '#7AA5FF',
          dark: '#2156D8',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(15, 23, 42, 0.3)',
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, rgba(61, 126, 255, 0.12), rgba(61, 126, 255, 0.02))',
      },
    },
  },
  plugins: [],
};
