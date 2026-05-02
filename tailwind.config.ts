import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        litvm: {
          teal:    '#64BFD3',
          dark:    '#1A616E',
          navy:    '#1A2A40',
          wine:    '#302326',
          heading: '#D0E9FF',
          muted:   'rgba(255,255,255,0.65)',
        },
      },
      backgroundImage: {
        'litvm-gradient': 'linear-gradient(135deg, #1A616E 0%, #1A2A40 45%, #302326 100%)',
        'teal-gradient':  'linear-gradient(135deg, #64BFD3 0%, #1A616E 100%)',
        'card-gradient':  'linear-gradient(135deg, rgba(26,97,110,0.3) 0%, rgba(26,42,64,0.5) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.4s ease-out',
        'float':      'float 5s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'teal-glow': '0 0 30px rgba(100,191,211,0.2)',
        'teal-sm':   '0 0 12px rgba(100,191,211,0.15)',
        'card':      '0 4px 24px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
