/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F1EB',
          300: '#EDE6DB',
        },
        brown: {
          50: '#F7F5F2',
          100: '#E8E1D9',
          200: '#C9B8A8',
          300: '#A68B72',
          400: '#8B7355',
          500: '#6F5B44',
          600: '#5A4A37',
          700: '#4A3D2E',
          800: '#3D3226',
        },
        'warm-brown': {
          50: '#FBF7F2',
          100: '#F5EDE4',
          200: '#E9D9C7',
          300: '#D9BEA0',
          400: '#C9A279',
          500: '#B8875A',
          600: '#A06F47',
          700: '#855A3A',
          800: '#6B4830',
        },
        sage: {
          100: '#E5EBE0',
          200: '#CCD9C3',
          300: '#B2C5A6',
          400: '#9CAF88',
          500: '#7D906A',
        },
        lavender: {
          100: '#EAE3F1',
          200: '#D5C7E3',
          300: '#C9B1D6',
          400: '#A88FC0',
        },
        terracotta: {
          100: '#F5E6D5',
          200: '#EBCDB0',
          300: '#D4A574',
          400: '#C48A52',
        },
        blush: {
          100: '#F5E6E6',
          200: '#EDD3D3',
          300: '#E8C4C4',
          400: '#DAA5A5',
        },
        mint: {
          100: '#DDECE8',
          200: '#B8D8D0',
          300: '#96C4B9',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Source Serif Pro', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'Source Han Sans', 'system-ui', 'sans-serif'],
        handwritten: ['"Ma Shan Zheng"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(139, 115, 85, 0.08)',
        'card': '0 4px 20px rgba(139, 115, 85, 0.1)',
        'hover': '0 8px 30px rgba(139, 115, 85, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
