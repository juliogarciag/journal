module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "fit-content": "fit-content",
        124: "31em",
      },
    },
  },
  variants: {
    extend: {
      outline: ["active"],
      ringWidth: ["active"],
    },
  },
  plugins: [],
};
