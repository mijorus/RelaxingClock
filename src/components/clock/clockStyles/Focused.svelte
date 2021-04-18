<script lang="ts">
    import anime from 'animejs/lib/anime.es.js';

    import { onDestroy, onMount } from 'svelte';
    import { hoursBox, minutesBox } from '../../../stores/clockStyle';
    import type { ClockElements } from '../../../types';
    import { getClockElements } from '../Clock.svelte';
    import { getWidth } from '../../../utils/getBoundingClientRect';

    let clock:ClockElements;

    function animation(forward: boolean) {
        anime({
            begin() {  
                if (!forward) clock.seconds.classList.remove('hidden');
            },
            targets: clock.seconds,
            opacity: forward ? 0 : 1,
            duration: 200,
            complete() {
                if (forward) clock.seconds.classList.add('hidden');
            }
        });
    }
    
    async function compute() {
        clock = await getClockElements();
        
        // clock.seconds.classList.add('opacity-0');

        animation(true);


        const divSize: number = getWidth(document.getElementById('minutes-divisor'));

        hoursBox.set({x: `${-(getWidth(clock.hours) + (divSize / 2 ))}px`, y: '-50%'});
        minutesBox.set({x: `${-(divSize / 2)}px`, y: '-50%'});

    }

    onMount(() => compute());

    onDestroy(() => {
        if (clock) animation(false);
    });
</script>