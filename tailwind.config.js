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
      'highlighted': 'rgb(245, 245, 245)',
    }),
    textColor: theme => ({
      ...theme('colors'),
      'primary': 'rgb(245, 245, 245)',
      'screen-saver': 'rgba(245, 245, 245, 0.45)',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      'primary': 'rgb(245, 245, 245)',
      'screen-saver': 'rgba(245, 245, 245, 0.45)',
    }),
    extend: {
      fontFamily: {
        'primary': ['Source Code Pro', 'monospace'],
        'secondary': ['DM Mono', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
