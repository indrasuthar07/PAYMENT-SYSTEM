/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/antd/**/*.{js,jsx,ts,tsx}"
  ],
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        secondary: '#52c41a',
        danger: '#ff4d4f',
        warning: '#faad14',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 