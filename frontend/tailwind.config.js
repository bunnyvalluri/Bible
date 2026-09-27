/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Controlled explicitly
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    '../packages/ui/**/*.{js,jsx}'
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2560px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem'
      },
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: '#ffffff',
        'light-surface': '#f8fafc',
        primary: {
          DEFAULT: '#163A5F',
          foreground: '#ffffff',
          50: '#f0f6fc',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#163A5F',
          900: '#0f2742',
          950: '#081524'
        },
        gold: {
          DEFAULT: '#C9A227',
          50: '#fefce8',
          100: '#f7efcb',
          200: '#f5e49c',
          300: '#ebd367',
          400: '#dec038',
          500: '#C9A227',
          600: '#a6821b',
          700: '#846317',
          800: '#6d5019',
          900: '#5c431a'
        },
        secondary: {
          DEFAULT: '#C9A227',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#737373'
        },
        accent: {
          DEFAULT: '#f7efcb',
          foreground: '#163A5F'
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#171717'
        }
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'book': '0 4px 20px -2px rgba(22, 58, 95, 0.05), 0 0 0 1px #e5e7eb',
        'card': '0 4px 20px rgba(0, 0, 0, 0.03)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: []
};
