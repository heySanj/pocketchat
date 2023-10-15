/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Sora, sans-serif",
      serif: "Zilla Slab, serif",
      mono: "Space Mono, monospace",
    },
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: true,
    darkTheme: "night",
  },
};
