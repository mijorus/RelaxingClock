<script lang="ts">
    import anime from 'animejs/lib/anime.es.js';
    import { cbDefault } from '../../../utils/animations';

    import { onDestroy, onMount } from 'svelte';
    import { hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import type { ClockElements } from '../../../types';
    import { getClockElements } from '../Clock.svelte';
    import { getWidth } from '../../../utils/getBoundingClientRect';

    let clock:ClockElements;

    function animation(forward: boolean) {
        return anime({
            begin() { 
            },
            targets: clock.seconds,
            opacity: forward ? 0 : 1,
            duration: 200,
            easing: cbDefault,
        });
    }
    
    async function compute() {
        clock = await getClockElements();

        animation(true);
        const divSize: number = getWidth(document.getElementById('minutes-divisor'));

        hoursBox.update(el => el = {...el, x: `${-(getWidth(clock.hours) + (divSize / 2 ))}px`, y: '-50%'});
        minutesBox.update(el => el = {...el, x: `${-(divSize / 2)}px`, y: '-50%'});
    }

    onMount(() => compute());

    onDestroy(() => {
        animation(false);
    });
</script>