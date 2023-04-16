/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Rubik', 'ui-sans-serif', 'system-ui'],
        'serif': ['Rubik', 'ui-sans-serif', 'system-ui'],
        'body': ['Rubik', 'ui-sans-serif', 'system-ui'],
        // 'serif': ['ui-serif', 'Georgia', ...],
        // 'mono': ['ui-monospace', 'SFMono-Regular', ...],
        // 'display': ['Oswald', ...],
        // 'body': ['"Open Sans"', ...],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class'
}