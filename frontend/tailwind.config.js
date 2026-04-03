/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        code: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: '#24B3BD',
        surface: '#111111',
        card: '#0c0c0c',
        border: '#1f1f1f',
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'fade-in': 'fade-in 0.3s ease forwards',
        'slide-up': 'slide-up 0.4s ease forwards',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
