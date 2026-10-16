/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    // gradient colours come from the API as strings, so keep them in the build
    "from-red-500", "to-orange-500", "from-yellow-400", "to-pink-500", "from-indigo-600", "to-purple-500",
    "from-pink-500", "to-rose-400", "from-gray-800", "to-gray-600", "from-teal-600", "to-emerald-500",
  ],
  theme: {
    extend: {
      colors: { brand: { 500: "#e11d48", 600: "#be123c", 700: "#9f1239" } },
    },
  },
  plugins: [],
};
