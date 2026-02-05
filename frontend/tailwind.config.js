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
        // Jared's public site colors
        'pub-green': {
          50: '#f0f7f2',
          100: '#dcebdf',
          200: '#b9d7c0',
          300: '#8ebf9a',
          400: '#6b9b7a',
          500: '#4a7c59',
          600: '#3d6649',
          700: '#275d38',
          800: '#1e4a2c',
          900: '#153821',
        },
        'pub-tan': {
          50: '#faf6f1',
          100: '#f2e9dc',
          200: '#e5d3b9',
          300: '#d4b88f',
          400: '#c49d6b',
          500: '#a8956d',
          600: '#8b734a',
          700: '#6e5a3a',
          800: '#54452e',
          900: '#3d3222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'organic': '0.625rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
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
