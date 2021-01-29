module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    colors: {
      white: "#ffffff",
      "gray-lightest": "#fafaf8",
      "gray-lighter": "#e6e6e4",
      "gray-light": "#d2d2d1",
      gray: "#bfc0be",
      "gray-dark": "#989896",
      "gray-darker": "#70706f",
      "gray-darkest": "#111313!important",
      black: "#000",

      "brand-light": "#f4ffce",
      brand: "#c0fd00",
      "brand-dark": "#5d761a",

      "cta-light": "#d9cdff",
      cta: "#0042fd",
      "cta-dark": "#232477",

      "info-light": "#e0f8f5",
      info: "#77e3d9",
      "info-dark": "#3d6b66",

      "warning-light": "#fff8cc",
      warning: "#f4e400",
      "warning-dark": "#736b19",

      "success-light": "#dffdd2",
      success: "#5ff13d",
      "success-dark": "#367125",

      "danger-light": "#ffdccd",
      danger: "#fa6f40",
      "danger-dark": "#773924",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
