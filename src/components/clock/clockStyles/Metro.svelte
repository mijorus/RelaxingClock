<script lang="ts">
    import anime from 'animejs';
    import { onDestroy } from 'svelte';
    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import { cbDefault } from '../../../utils/animations';
    
    $: compute($bigClockUpdate);

    function animate(forward: boolean) {
        anime({
            begin() {
                if (!forward) secondsBox.update(el => ({...el, visible: true}));
            },
            targets: $secondsBox.el,
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
            hoursBox.update(el => ({...el, x: '-50%', y: '-100%'}));
            minutesBox.update(el => ({...el, x: '-50%', y: '0%'}));

            animate(true);
        }
    }

    onDestroy(() => animate(false));
</script>