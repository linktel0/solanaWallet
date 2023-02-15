module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './screen/**/*.html',
    './screen/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
    './public/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#F5F5F5",
          DEFAULT: "#d400bc",
          dark: "#475569",
        },
        secondary: {
          light: "#fde68a",
          DEFAULT: "#d400bc",
          dark: "#92400e",
        },
      },
    },
  },
  plugins: [],
}
