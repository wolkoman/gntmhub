module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          '100': '#F8F8F8',
          '200': '#E0E0E0',
          '300': '#C8C8C8',
          '400': '#888888',
          '500': '#707070',
          '600': '#505050',
          '700': '#383838',
          '800': '#282828',
          '900': '#101010',
        },
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
        black: {
          DEFAULT: "#222"
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
