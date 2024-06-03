import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        beige: {
          100: '#ffffff',
          200: '#f3f2f1',
          300: '#e8e6e3',
          400: '#e0ddda',
          500: '#dcd9d5',	
          600: '#d1ccc7',	
          700: '#c5bfba',
          800: '#b9b3ac',
          900: '#aea69e',
        },
      },
    },
  },

  plugins: [],
};
export default config;
