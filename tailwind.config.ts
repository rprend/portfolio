import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#232325", // More muted, sophisticated blue
        background: "#ffffff",
        "muted-red": "#A65D57",
      },
      fontFamily: {
        headline: ["Afacad Flux", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
      fontSize: {
        headline: ["8vw", "1"], // For responsive headline
        "headline-mobile": ["12vw", "1"],
      },
      borderRadius: {
        project: "9999px", // For the pill/capsule shape
      },
      spacing: {
        section: "6rem", // For consistent vertical spacing
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
