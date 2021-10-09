import Classic from './Classic.svelte';
import Focused from './Focused.svelte';
import Metro from './Metro.svelte';
import Analog from './Analog.svelte';
import Galaxy from './Galaxy.svelte';

const styles: Array<{id: number, label: string, component?: any }> = [
    {
        id: 0,
        label: 'Classic',
        component: Classic,
    },
    {
        id: 1,
        label: 'Focused',
        component: Focused,
    },
    {
        id: 2,
        label: 'Analog',
        component: Analog,
    },
    {
        id: 3,
        label: 'Metropolis',
        component: Metro,
    },
    // {
    //     id: 4,
    //     label: 'Galaxy',
    //     component: Galaxy,
    // },
    // {
    //     label: 'Globetrotter',
    // },
    // {
    //     label: 'Galaxy',
    // },
    // {
    //     label: 'Landscapes',
    // },
];

export default styles;