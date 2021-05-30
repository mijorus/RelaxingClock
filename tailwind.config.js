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
            'secondary': 'rgb(100 100 100)',
            'screen-saver': 'rgba(245, 245, 245, 0.45)',
            'bg': 'rgb(29, 29, 29)',
        }),
        borderColor: theme => ({
            ...theme('colors'),
            'primary': 'rgb(245, 245, 245)',
            'screen-saver': 'rgba(245, 245, 245, 0.45)',
        }),
        extend: {
            fontFamily: {
                'clock': ['Source Code Pro', 'monospace'],
                'primary': ['DM Mono', 'monospace'],
            },
            colors: {
                'primary': 'rgb(245, 245, 245)',
                'secondary': 'rgb(63, 63, 63)',
                'spotify': 'rgb(29, 185, 84)'
            },
            fontSize: {
                'giant-1': '15rem',
            },
            transitionTimingFunction: {
                'cb-default': 'cubic-bezier(0.37, 0, 0.63, 1)',
            },
            zIndex: {
                '-1': '-1',
                '-10': '-10',
            },
            transformOrigin: {
                'right-2/4': '0% 50%',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
