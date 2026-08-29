/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {

      colors: {

        /* Main health-themed colors */

        cream: '#F0FDFA',       // Soft mint-white
        ink: '#071A1D',         // Deep teal background
        panel: '#0D2929',       // Dark teal panels
        panelLine: '#164E4A',   // Teal borders

        parchment: '#F0FDFA',   // Main text
        sienna: '#94A3B8',      // Muted/secondary text

        amber: '#2DD4BF',       // Main teal accent
        clay: '#0F766E',        // Dark teal accent
      },


      fontFamily: {

        display: ['"Space Grotesk"', 'sans-serif'],

        body: ['Inter', 'sans-serif'],

        mono: ['"IBM Plex Mono"', 'monospace'],

      },

    },
  },

  plugins: [],
}