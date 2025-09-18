/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/ui/**/*.{js,ts,jsx,tsx}", // Include shadcn/ui components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#60a5fa", // blue-400
        secondary: "#4338ca", // indigo-700
        background: "#0f172a", // slate-950
        "background-secondary": "#1e293b", // slate-900
        accent: "#67e8f9", // cyan-300
        text: "#f1f5f9", // slate-100
        "text-secondary": "#cbd5e1", // slate-300
      },
    },
  },
  plugins: [], // No animation plugins
};
