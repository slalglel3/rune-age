/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        daqan: '#1E40AF',
        latari: '#065F46',
        waiqar: '#581C87',
        uthuk: '#991B1B',
      }
    },
  },
  plugins: [],
}
