

<script lang="ts">
    import { onMount } from 'svelte';
    import { hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import type { ClockElements } from '../../../types';
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import { getClockElements } from '../Clock.svelte';

    let clock:ClockElements;

    async function compute() {
        clock = await getClockElements();

        const divSize: number = getWidth(document.getElementById('minutes-divisor'));
        const centerElSize: number = getWidth(clock.minutes);

        hoursBox.update(el => el = {...el, x: `${-(centerElSize + getWidth(clock.hours) - divSize)}px`, y: '-50%'});
        minutesBox.update(el => el = {...el, x: `${-(centerElSize - divSize)}px`, y: '-50%'});
        secondsBox.update(el => el = {...el, x: `${(divSize)}px`, y: `-50%`});
    }

    async function load() {
        compute();
    }

    onMount(() => load());
</script>