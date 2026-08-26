/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F0',     // Fresh, bright luxury cream accent
        ink: '#2E2A24',       
        panel: '#3D372F',     
        panelLine: '#524B40', 
        parchment: '#F5EFE6', 
        sienna: '#C4B4A7',    
        amber: '#E8A33D',     
        clay: '#B85C1F',      
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



