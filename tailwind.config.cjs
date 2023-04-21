/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Roboto", ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1440px",
    },
    container: {
      center: true,
    },
    colors: {
      dark: "#0D0A27",
      white: "#FFF",
      yellow: "##FFD001",
      purpur: "#3538AD",
      black: "#000",
      yellow: "#ffc82c",
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
  variants: {
    extend: {
      scale: ["group-hover"],
    },
  },
};
