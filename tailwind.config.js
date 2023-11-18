/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinza: "#e3e3e0",
        cinza_escuro: "#A9A9A9",
        cinza_escuro2: "#818181",
        preto: "#2b2b2b",
        rosa: "#e03b39",
        laranja: "#ff6224",
        amarelo: "#cad842",
        amarelo_escuro: "#B9C544",
        azul: "#285cf4",
      },
      display: ["group-hover"],
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  variants: {
    scrollbar: ['rounded']
}

}
