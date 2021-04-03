module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    content: ['./public/index.html', './src/**/*.svelte'],
    options: {
      defaultExtractor: content => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme =>({
      ...theme('colors'),
      'primary': 'rgb(29, 29, 29)',
      'secondary': 'rgb(63, 63, 63)',
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
