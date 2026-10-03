/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#09090B',
          secondary: '#121216',
          card: '#18181F',
        },
        primary: {
          DEFAULT: '#E50914',
          hover: '#c40811',
          light: '#FF4D5A',
        },
        secondary: {
          DEFAULT: '#FF4D5A',
        },
        cinema: {
          dark: '#09090B',
          surface: '#121216',
          card: '#18181F',
          border: '#27272A',
          muted: '#A1A1AA',
          light: '#FFFFFF',
          red: '#E50914',
          accent: '#FF4D5A',
          success: '#22C55E',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(229, 9, 20, 0.4)',
        'glow-red-lg': '0 0 40px -5px rgba(229, 9, 20, 0.6)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
