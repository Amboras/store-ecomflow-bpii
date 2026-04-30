import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // Comic palette
        comic: {
          yellow: '#FFE600',
          pink: '#FF3EA5',
          blue: '#2EC4F1',
          red: '#FF2E2E',
          green: '#7CFF6B',
          cream: '#FFF4D6',
          ink: '#0A0A0A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'Comic Sans MS', 'sans-serif'],
      },
      fontSize: {
        'display': ['5.5rem', { lineHeight: '0.95', letterSpacing: '0em' }],
        'h1': ['3.5rem', { lineHeight: '1', letterSpacing: '0em' }],
        'h2': ['2.5rem', { lineHeight: '1.05', letterSpacing: '0em' }],
        'h3': ['1.75rem', { lineHeight: '1.15' }],
        'h4': ['1.25rem', { lineHeight: '1.25' }],
      },
      maxWidth: {
        'content': '1280px',
      },
      spacing: {
        'section': '6rem',
        'section-sm': '3rem',
      },
      boxShadow: {
        'comic': '6px 6px 0 0 #0A0A0A',
        'comic-sm': '4px 4px 0 0 #0A0A0A',
        'comic-lg': '10px 10px 0 0 #0A0A0A',
        'comic-pink': '6px 6px 0 0 #FF3EA5',
        'comic-blue': '6px 6px 0 0 #2EC4F1',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.85)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
        'pop': 'pop 0.4s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
