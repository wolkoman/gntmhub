module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins"],
      sans: ["Lato"]
    },
    colors: {
      primary: {500: "#aa0217"},
      opposite: {500: "#206000"},
      close: {500: "#111"},
      smudge: {500: "#f0f0f0"},
      light: {500: "#ddd"},
      dark: {500: "#222"},
      white: "#fff",
      black: "#000",
    },
    nightwind: {
      colors: {
        close: {500: "#f0f0f0"},
        smudge: {500: "#111"},
        primary: {500: "#ff3a53"},
        opposite: {500: "#4caf1a"},
        light: {500: "#222"},
        dark: {500: "#eee"},
        white: "#000",
        black: "#fff",
      },
    },
  },
  plugins: [require("nightwind")],
}
