// import type { Config } from 'tailwindcss';
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Font families
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Poppins", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
        Poppins: ["var(--font-Poppins)"],
        Josefin_Sans: ["var(--font-Josefin)"],
      },
      // Background images
      backgroundImage: {
        "auth-pattern": "url('/images/auth-bg-pattern.svg')",
        "course-card-pattern": "url('/images/course-card-pattern.svg')",
        "hero-wave": "url('/images/hero-wave.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-linear":
          "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      // Animation utilities
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      // Custom box shadow for cards
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
    // Screen breakpoints
    screens: {
      "400px": "400px",
      "800px": "800px",
      "1000px": "1000px",
      "1100px": "1100px",
      "1200px": "1200px",
      "1300px": "1300px",
      "1500px": "1500px",
      ...defaultTheme.screens,
      md: "800px",
      "3xl": "1792px",
    },
  },
  plugins: [],
};
