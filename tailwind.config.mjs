/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Edgardo's Grill Brand Colors - Bacolod Authentic Inasal
        primary: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#ababab',
          400: '#888888',
          500: '#6b6b6b',
          600: '#4a4a4a',
          700: '#1C1C1C',  // Charcoal Black - Main brand color
          800: '#171717',
          900: '#0f0f0f',
        },
        // Ember Orange - Primary CTA and highlights
        secondary: {
          50: '#fef5f0',
          100: '#fde8dc',
          200: '#fbd0b9',
          300: '#f8af8b',
          400: '#f38b5b',
          500: '#ef6f37',
          600: '#D96B2B',  // Ember Orange - Main secondary color
          700: '#b94a1e',
          800: '#943d19',
          900: '#793317',
        },
        // Warm Gold - Accents and highlights
        accent: {
          50: '#fdfaf1',
          100: '#faf3de',
          200: '#f5e5bd',
          300: '#edd391',
          400: '#e3bb67',
          500: '#d9a648',
          600: '#C9A24D',  // Warm Gold - Main accent color
          700: '#a87b2e',
          800: '#896128',
          900: '#715025',
        },
        // Smoked Cream - Background
        background: '#F7F3EE',
        'text-dark': '#2B2B2B',
        'text-light': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['Bebas Neue', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(217, 107, 43, 0.05)',
        'warm': '0 1px 3px 0 rgba(217, 107, 43, 0.1), 0 1px 2px 0 rgba(217, 107, 43, 0.06)',
        'warm-md': '0 4px 6px -1px rgba(217, 107, 43, 0.1), 0 2px 4px -1px rgba(217, 107, 43, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(217, 107, 43, 0.1), 0 4px 6px -2px rgba(217, 107, 43, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(217, 107, 43, 0.1), 0 10px 10px -5px rgba(217, 107, 43, 0.04)',
      },
    },
  },
  plugins: [],
}
