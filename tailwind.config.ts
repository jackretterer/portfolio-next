import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        "walk-path": {
          "0%": {
            transform: "translateX(-100px) translateY(80vh)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "30%": {
            transform: "translateX(20vw) translateY(80vh)",
          },
          "60%": {
            transform: "translateX(60vw) translateY(80vh)",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(calc(100vw + 100px)) translateY(80vh)",
            opacity: "0",
          },
        },
        "left-arm-swing": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(15deg)",
          },
        },
        "right-arm-swing": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-15deg)",
          },
        },
        "left-leg-swing": {
          "0%": {
            transform: "rotate(8deg)",
          },
          "50%": {
            transform: "rotate(-8deg)",
          },
          "100%": {
            transform: "rotate(8deg)",
          },
        },
        "right-leg-swing": {
          "0%": {
            transform: "rotate(-8deg)",
          },
          "50%": {
            transform: "rotate(8deg)",
          },
          "100%": {
            transform: "rotate(-8deg)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
