/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    '../packages/ui/**/*.{js,jsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0f4fd',
          100: '#dde7fa',
          200: '#c2d5f7',
          300: '#99bcf2',
          400: '#689bea',
          500: '#437ade',
          600: '#2f5fc2',
          700: '#264ca0',
          800: '#1e3d80',
          900: '#0c1a38',
          950: '#070e20'
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fbf9ee',
          100: '#f5f0d3',
          200: '#ebe0a4',
          300: '#decb70',
          400: '#d4af37',
          500: '#bd9626',
          600: '#9f751c',
          700: '#7e5619',
          800: '#68451a',
          900: '#583a1b',
          950: '#341f0b'
        },
        cream: {
          DEFAULT: '#faf7f2',
          50: '#fdfcf9',
          100: '#faf7f2',
          200: '#f4ece1',
          300: '#ebdccb',
          400: '#dec4ac',
          500: '#cca78b'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
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
        'divine': '0 20px 40px -15px rgba(212, 175, 55, 0.25)',
        'book': '0 10px 30px -5px rgba(12, 26, 56, 0.15), 0 0 0 1px rgba(12, 26, 56, 0.05)',
        'glow': '0 0 30px rgba(212, 175, 55, 0.35)'
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
