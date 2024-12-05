/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import tailwindAnimated from "tailwindcss-animated";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [
    daisyui,
    tailwindAnimated,
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#88141C",
          secondary: "#C82026",
          accent: "#FFFFFF",
          "base-100": "#ffffff",
          info: "#9ce37d",
          warning: "#ff5722",
        },
      },
    ],
  },
};