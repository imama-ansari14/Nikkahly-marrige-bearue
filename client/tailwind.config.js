/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#fbf5f6", 100: "#f7e8eb", 200: "#edcfd5", 300: "#dba8b3",
          400: "#c27688", 500: "#a84f65", 600: "#8d3049", 700: "#6f1f35",
          800: "#54182a", 900: "#3c101d", 950: "#260a12"
        },
        gold: {
          50: "#fffaf0", 100: "#fdf0ce", 200: "#f8df9e", 300: "#f1c967",
          400: "#e1ad38", 500: "#c89425", 600: "#a87316"
        }
      },
      boxShadow: { soft: "0 18px 50px rgba(60,16,29,.08)" }
    }
  },
  plugins: []
};