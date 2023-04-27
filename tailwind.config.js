/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/login.jpg')",
        register: "url('/register.jpg')",
      },
      colors: {
        orange: {
          980: '#ffb254',
        },
        teal: { 980: '#51a9dd' },
        blue: { 980: '#aad9f5' },
        green: { 980: '#0d7abb' },
      },
    },
  },

  plugins: [],
}
