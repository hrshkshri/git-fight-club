import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['VT323', 'monospace'],
        display: ['Press Start 2P', 'monospace'],
      },
      colors: {
        neon: {
          green: '#00ff00',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 0.15s ease-in-out',
      }
    },
  },
  plugins: [],
};
export default config;
