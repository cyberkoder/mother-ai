/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'alien-green': 'var(--theme-color)',
        'alien-dark': 'var(--theme-color-dark)',
        'alien-glow': 'var(--theme-color)',
        'theme': 'var(--theme-color)',
        'theme-dark': 'var(--theme-color-dark)',
        'alien-earth-blue': '#0d1a26',
        'alien-earth-amber': '#ffb86c',
        'alien-earth-dark': '#000000',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scan': 'scan 8s linear infinite',
        'typing': 'typing 0.1s steps(1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}