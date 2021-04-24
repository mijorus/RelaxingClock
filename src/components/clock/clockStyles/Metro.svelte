<script lang="ts">
    import anime from 'animejs';
    import { onDestroy } from 'svelte';
    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import { cbDefault } from '../../../utils/animations';
import { getWidth } from '../../../utils/getBoundingClientRect';
    
    $: compute($bigClockUpdate);

    function animate(forward: boolean) {
        anime({
            begin() {
                if (!forward) secondsBox.update(el => ({...el, visible: true}));
            },
            targets: [$secondsBox.el, '#minutes-divisor'],
            duration: 200,
            opacity: forward ? 0 : 1,
            easing: cbDefault,
            complete() {
                if (forward) secondsBox.update(el => ({...el, visible: false}));
            }
        });
    }   

    function compute(timestamp: number) {
        if (timestamp > 0) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: '-50%', y: '-100%'}));
            minutesBox.update(el => ({...el, x: `${-((getWidth($minutesBox.el) / 2) + (divSize / 2))}px`, y: '0%'}));

            animate(true);
        }
    }

    onDestroy(() => animate(false));
</script>