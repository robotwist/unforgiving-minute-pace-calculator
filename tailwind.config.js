/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Munich 1972 Olympic Design Colors - Consistent with CSS variables
        munich: {
          'light-blue': '#4A90E2',      // --munich-light-blue
          'light-green': '#7ED321',     // --munich-light-green
          'silver': '#9CA3AF',          // --munich-silver
          'violet': '#6366F1',          // --munich-violet
          'dark-green': '#059669',      // --munich-dark-green
          'orange': '#F97316',          // --munich-orange
          'yellow': '#EAB308',          // --munich-yellow
          'white': '#FFFFFF',           // --munich-white
          'black': '#1F2937',           // --munich-black
          'gray': '#F8FAFC',            // --munich-gray
          'border': '#E2E8F0',          // --munich-border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        geometric: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Munich 1972 Typography Scale - Matching CSS variables
        'munich-xs': ['0.75rem', { lineHeight: '1rem' }],        // --text-xs
        'munich-sm': ['0.875rem', { lineHeight: '1.25rem' }],    // --text-sm
        'munich-base': ['1rem', { lineHeight: '1.5rem' }],       // --text-base
        'munich-lg': ['1.125rem', { lineHeight: '1.75rem' }],    // --text-lg
        'munich-xl': ['1.25rem', { lineHeight: '1.75rem' }],     // --text-xl
        'munich-2xl': ['1.5rem', { lineHeight: '2rem' }],        // --text-2xl
        'munich-3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // --text-3xl
        'munich-4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // --text-4xl
      },
      spacing: {
        // Munich 1972 Spacing System - Matching CSS variables
        'munich-1': '0.25rem',   // --space-1
        'munich-2': '0.5rem',    // --space-2
        'munich-3': '0.75rem',   // --space-3
        'munich-4': '1rem',      // --space-4
        'munich-5': '1.25rem',   // --space-5
        'munich-6': '1.5rem',    // --space-6
        'munich-8': '2rem',      // --space-8
        'munich-10': '2.5rem',   // --space-10
        'munich-12': '3rem',     // --space-12
        'munich-16': '4rem',     // --space-16
      },
      borderRadius: {
        'geometric': '0',
      },
      boxShadow: {
        'geometric': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'geometric-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
    },
  },
  plugins: [],
} 