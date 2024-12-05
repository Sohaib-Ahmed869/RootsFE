/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"], // Add Outfit font
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animated"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#88141C", //ou crimson
          secondary: "#C82026", //fire engine red
          accent: "#FFFFFF",
          "base-100": "#ffffff",
          info: "#9ce37d",
          warning: "#ff5722",
        },
      },
    ],
  },
};
