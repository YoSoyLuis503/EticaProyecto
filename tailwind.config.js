/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        camp: {
          sky: '#E0F4FF',
          sun: '#FEF9C3',
          cream: '#FFFDF5',
          purple: '#7C3AED',
          mint: '#10B981',
          orange: '#F97316',
          ink: '#1E293B',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.82)', opacity: '0' },
          '70%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bubble-rise': {
          '0%': { transform: 'translateY(0px) scale(0.96)' },
          '50%': { transform: 'translateY(-14px) scale(1.03)' },
          '100%': { transform: 'translateY(0px) scale(0.96)' },
        },
      },
      animation: {
        float: 'float 3.4s ease-in-out infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'bubble-rise': 'bubble-rise 3.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
