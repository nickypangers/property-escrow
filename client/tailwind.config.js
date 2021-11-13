module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#191516",
        "blue-accent": "#03F7EB",
        sidebar: "#003844",
        "gray-blue": "#C9DAEA",
        "green-accent": "#00B295",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
