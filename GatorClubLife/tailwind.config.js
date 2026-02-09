/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FA4616', // UF Gator Orange (Pantone 172)
          50: '#fff1ec',
          100: '#ffdfd3',
          200: '#ffbfab',
          300: '#ff987d',
          400: '#ff6d4d',
          500: '#FA4616',
          600: '#d93104',
          700: '#b02502',
          800: '#8c2006',
          900: '#731d09',
        },
        secondary: {
          DEFAULT: '#0021A5', // UF Gator Blue (Pantone 287)
          light: '#334eac', // Lighter blue for hover states
          dark: '#00166e',
        },
        accent: '#FA4616', // Also Orange
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          800: '#343a40',
          900: '#212529',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

