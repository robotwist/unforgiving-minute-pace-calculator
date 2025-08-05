/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Munich 1972 Olympic Design Colors - High Contrast
        munich: {
          blue: '#2563EB',
          green: '#059669',
          white: '#FFFFFF',
          black: '#1F2937',
          gray: '#F3F4F6',
          accent: '#DC2626',
          'dark-blue': '#1E40AF',
          'light-blue': '#DBEAFE',
          border: '#D1D5DB',
        },
        // Legacy primary colors for compatibility
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        geometric: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'geometric': '0',
      },
      boxShadow: {
        'geometric': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'high-contrast': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      clipPath: {
        'diamond': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        'octagon': 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
        'square': 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)',
      },
      animation: {
        'progressive-melange': 'progressive-melange 8s ease-in-out infinite',
        'running-motion': 'running-motion 2s ease-in-out infinite',
        'geometric-float': 'geometric-float 6s ease-in-out infinite',
        'track-rotate': 'track-rotate 20s linear infinite',
        'stopwatch-tick': 'stopwatch-tick 2s ease-in-out infinite',
        'track-rotate-counterclockwise': 'track-rotate-counterclockwise 20s linear infinite',
        'stopwatch-tick-counterclockwise': 'stopwatch-tick-counterclockwise 2s ease-in-out infinite',
        'geometric-float-counterclockwise': 'geometric-float-counterclockwise 6s ease-in-out infinite',
      },
      fontSize: {
        'responsive-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'responsive-base': ['1rem', { lineHeight: '1.5rem' }],
        'responsive-lg': ['1.125rem', { lineHeight: '1.75rem' }],
      },
      spacing: {
        'responsive-sm': '1rem',
        'responsive-md': '1.5rem',
        'responsive-lg': '2rem',
      },
    },
  },
  plugins: [],
} 