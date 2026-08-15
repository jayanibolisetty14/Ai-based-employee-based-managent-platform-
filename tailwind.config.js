/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        
        'primary-text': "rgb(var(--color-primary-text) / <alpha-value>)",
        'secondary-text': "rgb(var(--color-secondary-text) / <alpha-value>)",
        border: "var(--color-border)",
        'border-subtle': "var(--color-border-subtle)",
        
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
        
        blue: "rgb(var(--color-blue) / <alpha-value>)",
        green: "rgb(var(--color-green) / <alpha-value>)",
        yellow: "rgb(var(--color-yellow) / <alpha-value>)",
        muted: "rgb(var(--color-secondary-text) / <alpha-value>)",
      },
      boxShadow: {
        'glow-primary': '0 0 20px var(--glow-primary)',
        'glow-secondary': '0 0 20px var(--glow-secondary)',
        'glow-accent': '0 0 20px var(--glow-accent)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom right, rgb(var(--color-background)), rgb(var(--color-surface)), rgb(var(--color-background)))',
        'gradient-neon': 'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-secondary)), rgb(var(--color-accent)))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
