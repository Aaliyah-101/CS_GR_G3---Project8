/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12100D',       // near-black warm charcoal, base background
        panel: '#1C1712',     // card / surface tone
        panelLine: '#2E271F', // hairline borders on panels
        parchment: '#F5EFE6', // primary text, warm off-white
        sienna: '#A89484',    // muted body text
        amber: '#E8A33D',     // sunset dye — primary accent
        clay: '#B85C1F',      // bark-cloth terracotta — secondary accent
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
