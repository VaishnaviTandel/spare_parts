/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { green: '#1D9E75', dark: '#0F6E56', light: '#E1F5EE' },
      },
      animation: {
        'float-a':  'floatA 9s ease-in-out infinite',
        'float-b':  'floatB 7s ease-in-out infinite',
        'float-c':  'floatC 5s ease-in-out infinite',
        'float-d':  'floatD 11s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in':  'fadeIn 0.25s ease-out',
        'spin-slow':'spin 20s linear infinite',
      },
      keyframes: {
        floatA: { '0%,100%': { transform:'translateY(0) translateX(0)' }, '33%': { transform:'translateY(-22px) translateX(12px)' }, '66%': { transform:'translateY(11px) translateX(-9px)' } },
        floatB: { '0%,100%': { transform:'translateY(0) translateX(0)' }, '50%': { transform:'translateY(-18px) translateX(-14px)' } },
        floatC: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        floatD: { '0%,100%': { transform:'translateY(0) translateX(0)' }, '25%': { transform:'translateY(-16px) translateX(8px)' }, '75%': { transform:'translateY(8px) translateX(-6px)' } },
        slideUp: { from:{ opacity:'0', transform:'translateY(14px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from:{ opacity:'0' }, to:{ opacity:'1' } },
      },
    },
  },
  plugins: [],
}
