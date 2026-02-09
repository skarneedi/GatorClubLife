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
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo-ish (placeholder if needed, but we use strict Gator Blue usually)
          600: '#0021A5', // Main Blue
          700: '#001b85',
          800: '#00166e',
          900: '#000f4d',
        },
        surface: '#ffffff',
        background: '#F8FAFC', // Light neutral background
        'border-light': '#E2E8F0', // Subtle border color
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

