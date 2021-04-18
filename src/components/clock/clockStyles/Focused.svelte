<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { hoursBox, minutesBox } from '../../../stores/clockStyle';
    import type { ClockElements } from '../../../types';
    import { getClockElements } from '../Clock.svelte';
    import { getWidth } from '../../../utils/getBoundingClientRect';

    let clock:ClockElements;
    
    async function compute() {
        clock = await getClockElements();
        
        clock.seconds.classList.add('opacity-0');
        const divSize: number = getWidth(document.getElementById('minutes-divisor'));

        hoursBox.set({x: `${-(getWidth(clock.hours) + (divSize / 2 ))}px`, y: '-50%'});
        minutesBox.set({x: `${-(divSize / 2)}px`, y: '-50%'});

    }

    onMount(() => compute());

    onDestroy(() => {
        if (clock) clock.seconds.classList.remove('opacity-0');
    });
</script>