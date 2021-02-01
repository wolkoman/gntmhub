module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        pohutukawa: {
          DEFAULT: "#900519",
          10: "#ffdce1",
          50: "#FB8092",
          100: "#FA677C",
          200: "#F83652",
          300: "#F3082A",
          400: "#C10722",
          500: "#900519",
          600: "#5F0310",
          700: "#2D0208",
          800: "#000000",
          900: "#000000",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
