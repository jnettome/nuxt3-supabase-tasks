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
        // 'sans': ['Lato', 'ui-sans-serif', 'system-ui'],
        // 'serif': ['Lato', 'ui-sans-serif', 'system-ui'],
        // 'body': ['Lato', 'ui-sans-serif', 'system-ui'],
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