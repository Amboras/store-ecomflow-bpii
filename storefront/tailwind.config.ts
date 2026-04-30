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
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-hard': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0) rotate(0)' },
          '25%': { transform: 'translateX(-3px) rotate(-1deg)' },
          '75%': { transform: 'translateX(3px) rotate(1deg)' },
        },
        'swing': {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        'jiggle': {
          '0%, 100%': { transform: 'rotate(-1.5deg) scale(1)' },
          '50%': { transform: 'rotate(1.5deg) scale(1.03)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ping-comic': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.18)', opacity: '0.85' },
        },
        'flash-bg': {
          '0%, 100%': { backgroundColor: '#FFE600' },
          '33%': { backgroundColor: '#FF3EA5' },
          '66%': { backgroundColor: '#2EC4F1' },
        },
        'shimmy': {
          '0%, 100%': { transform: 'translateX(0) skewX(0)' },
          '50%': { transform: 'translateX(2px) skewX(-2deg)' },
        },
        'halftone-shift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        'stripes-shift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '64px 0' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '70%': { transform: 'scale(1.15) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        'tilt': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
        'wiggle-slow': 'wiggle 2.5s ease-in-out infinite',
        'pop': 'pop 0.4s ease-out',
        'pop-in': 'pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'marquee': 'marquee 18s linear infinite',
        'marquee-slow': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 22s linear infinite',
        'bounce-hard': 'bounce-hard 1.4s ease-in-out infinite',
        'shake': 'shake 0.6s ease-in-out infinite',
        'swing': 'swing 1.6s ease-in-out infinite',
        'jiggle': 'jiggle 1.8s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 6s linear infinite',
        'spin-slower': 'spin-slow 14s linear infinite',
        'ping-comic': 'ping-comic 1.4s ease-in-out infinite',
        'flash-bg': 'flash-bg 1.8s ease-in-out infinite',
        'shimmy': 'shimmy 0.8s ease-in-out infinite',
        'halftone-shift': 'halftone-shift 4s linear infinite',
        'stripes-shift': 'stripes-shift 2s linear infinite',
        'tilt': 'tilt 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
