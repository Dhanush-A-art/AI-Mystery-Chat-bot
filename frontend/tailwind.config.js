/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          bg: "#0B0F14",
          bgSecondary: "#121923",
          card: "#18212C",
          gold: "#D6A84F",
          goldHover: "#C49742",
          slate: "#8FA7BA",
          text: "#F4F1E8",
          textMuted: "#9AA6B2",
          danger: "#C95D5D",
          success: "#69A982",
          border: "#232F3E"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [],
}

