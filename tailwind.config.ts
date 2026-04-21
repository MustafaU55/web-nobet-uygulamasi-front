import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /bg-\[url\(.*\)\]/,
    },
  ],
  theme: {
    extend: {

      screens: {
        'custom': '1660px', // Özel breakpoint (1400px)
        'large': '1800px',  // Özel breakpoint (1800px)
        '1550': '1550px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        rainbow: 'rainbow 1.5s linear infinite',
      },
      keyframes: {
        rainbow: {
          '0%, 100%': { color: '#e1306c' }, // Pembe
          '33%': { color: '#9b59b6' }, // Mor
          '66%': { color: '#f1c40f' }, // Sarı
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
