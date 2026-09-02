/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {

      colors: {

        /* Main health-themed colors */

        cream: '#F7F7F4',
        ink: '#0F172A',
        panel: '#FFFFFF',
        panelLine: '#DDE3E8',
        parchment: '#1F2937',
        sienna: '#475569',
        amber: '#FCDC4D',
        clay: '#D9A441',
        brand: '#F5C400',
        brandSoft: '#FDE68A',
        coral: '#D62828',
        glow: '#2B7A4B',
        night: '#0B1F13',
      },


      fontFamily: {

        display: ['"Manrope"', 'sans-serif'],

        body: ['"Plus Jakarta Sans"', 'sans-serif'],

        mono: ['"JetBrains Mono"', 'monospace'],

      },

      boxShadow: {
        soft: '0 20px 60px rgba(76, 29, 149, 0.35)',
        glow: '0 0 40px rgba(34, 211, 238, 0.25)',
      },

    },
  },

  plugins: [],
}