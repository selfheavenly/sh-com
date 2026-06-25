/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      colors: {
        sand: {
          DEFAULT: "#DDD5C5",
          light: "#EAE4D8",
          dark: "#C9BDA8",
        },
        ruby: {
          DEFAULT: "#8B2020",
          dark: "#6e1a1a",
          light: "#B53030",
        },
        ink: {
          DEFAULT: "#2C2420",
          60: "#2C242099",
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        shake: "shake 0.4s ease",
      },
    },
  },
  plugins: [],
};
