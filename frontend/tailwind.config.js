/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Joe's existing colors (protected app)
        primary: {
          50: '#eef0f9',
          100: '#d5daf0',
          200: '#b0b8e3',
          300: '#8a96d6',
          400: '#6e7cc9',
          500: '#5C6BC0',
          600: '#4a56a3',
          700: '#3b4583',
          800: '#2c3363',
          900: '#1d2242',
        },
        secondary: {
          50: '#e6f5f3',
          100: '#c0e6e1',
          200: '#96d6cd',
          300: '#6cc6b9',
          400: '#4db9aa',
          500: '#26A69A',
          600: '#1f8a80',
          700: '#186d66',
          800: '#12514c',
          900: '#0c3532',
        },
        accent: {
          50: '#fff8eb',
          100: '#ffedcc',
          200: '#ffdea3',
          300: '#ffce7a',
          400: '#ffc35c',
          500: '#FFB74D',
          600: '#d99940',
          700: '#b37b33',
          800: '#8c5e26',
          900: '#66401a',
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
        text: {
          primary: '#37474F',
          secondary: '#78909C',
        },
        // Public site colors - Slate Blue theme (distinct from UVU)
        'pub-blue': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        'pub-accent': {
          50: '#fff4e6',
          100: '#ffe4c4',
          200: '#ffd19a',
          300: '#ffbd70',
          400: '#f9a849',
          500: '#e8912d',
          600: '#cb7519',
          700: '#a35a12',
          800: '#7c4310',
          900: '#5c310d',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'organic': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
