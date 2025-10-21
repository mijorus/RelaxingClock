module.exports = {
    purge: {
        enabled: !process.env.ROLLUP_WATCH,
        content: ['../public/index.html', './src/**/*.svelte'],
        options: {
            defaultExtractor: content => [
                ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
                ...(content.match(/(?<=class:)[^=>/\s]*/g) || []),
            ],
        },
        safelist: [
            "hidden",
            "w-12",
            "absolute",
            "w-screen",
            "md:flex-row",
            "h-screen",
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        backgroundColor: theme =>({
            ...theme('colors'),
            'primary': 'rgb(20, 20, 20)',
            'secondary': 'rgb(63, 63, 63)',
            'tertiary': 'rgb(40, 40, 40)',
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
                'monofur': ['monofur', 'monospace'], 
                'courier': ['Courier Prime', 'monospace'],
                'sono': ['Sono', 'monospace'],
                'workbench': ['Workbench', 'monospace'],
                'wenkai': ['LXGW WenKai Mono TC', 'monospace'],
                'ubuntu': ['Ubuntu', 'sans-serif'],
                'primary': ['DM Mono', 'monospace'],
                'title': ['Comfortaa', 'monospace'],
            },
            colors: {
                'primary': 'rgb(245, 245, 245)',
                'secondary': 'rgb(63, 63, 63)',
                'spotify': 'rgb(29, 185, 84)',
                'dark': 'rgb(20, 20, 20)',
            },
            fontSize: {
                'xxs': '0.5rem',
                'giant-0.5': '12rem',
                'giant-1': '15rem',
                'giant-2': '20rem',
                'giant-3': '25rem',
                'giant-4': '30rem',
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
            },
            spacing: {
                '101': '25rem',
                '104': '26rem',
                '120': '30rem',
                '132': '33rem',
            }
        },
    },
    variants: {
        extend: {
            margin: ['focus'],
        },
    },
    plugins: [],
};
