/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Bu kısım, Tailwind'in CSS sınıflarını arayacağı dosyaları belirtir.
    // Projenizdeki React bileşenlerinizin ve HTML dosyalarınızın yollarını içerir.
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}