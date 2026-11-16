/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        valley: {
          cream: '#FAF6EC',
          parchment: '#FFFDF7',
          moss: '#2D6A4F',
          leaf: '#40916C',
          mint: '#74C69D',
          wood: '#8C5E3C',
          woodLight: '#D4A373',
          lumi: '#38BDF8',
          indigo: '#1E1B4B',
          ink: '#243028',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.86)', opacity: '0' },
          '70%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'jump-rope': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '45%': { transform: 'translateY(-28px) scale(1.05)' },
        },
        aurora: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
      },
      animation: {
        float: 'float 3.6s ease-in-out infinite',
        sway: 'sway 3s ease-in-out infinite',
        pop: 'pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'jump-rope': 'jump-rope 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        aurora: 'aurora 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
