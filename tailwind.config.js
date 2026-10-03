/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ────────────────────────────────────────────
        background: {
          DEFAULT: '#08090D',
          secondary: '#101218',
          card: '#171A22',
          elevated: '#1D212B',
        },
        // ── Brand accent (violet) ───────────────────────────────
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
          muted: '#6D28D9',
          subtle: 'rgba(139, 92, 246, 0.12)',
        },
        secondary: {
          DEFAULT: '#A78BFA',
        },
        // ── Semantic role names ─────────────────────────────────
        cinema: {
          dark: '#08090D',
          surface: '#101218',
          card: '#171A22',
          elevated: '#1D212B',
          border: 'rgba(255, 255, 255, 0.08)',
          borderStrong: 'rgba(255, 255, 255, 0.14)',
          muted: '#9CA3AF',
          subtle: '#6B7280',
          light: '#F8FAFC',
          violet: '#8B5CF6',
          accent: '#A78BFA',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      borderRadius: {
        card: '14px',
        panel: '18px',
        pill: '999px',
      },
      boxShadow: {
        // Ambient violet glow for primary interactive elements
        'glow-violet': '0 0 28px -6px rgba(139, 92, 246, 0.55)',
        'glow-violet-lg': '0 0 48px -10px rgba(139, 92, 246, 0.65)',
        // Lift effect for cards on hover
        lift: '0 18px 45px -18px rgba(0, 0, 0, 0.85)',
        'lift-violet': '0 18px 45px -16px rgba(139, 92, 246, 0.35)',
        // Elevated surface
        panel: '0 10px 34px -16px rgba(0, 0, 0, 0.7)',
        inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'violet-gradient-soft':
          'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(167,139,250,0.10) 100%)',
        'surface-gradient': 'linear-gradient(180deg, #171A22 0%, #101218 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in-scale': 'fade-in-scale 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
