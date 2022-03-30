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
      primary: {500: "#CB1634"},
      opposite: {500: "#7EA700"},
      close: {500: "#111"},
      smudge: {500: "#fafafa"},
      light: {500: "#eeeeee"},
      dark: {500: "#222"},
      white: "#fff",
      black: "#000",
    },
    nightwind: {
      colors: {
        close: {500: "#f0f0f0"},
        smudge: {500: "#070707"},
        primary: {500: "#ff3a53"},
        opposite: {500: "#7EA700"},
        light: {500: "#252525"},
        dark: {500: "#eee"},
        white: "#171717",
        black: "#fff",
      },
    },
  },
  plugins: [require("nightwind")],
}
