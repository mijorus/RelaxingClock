<script lang="ts">
    import anime from "animejs";
    import { onDestroy } from 'svelte';

    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import { cbDefault } from "../../../utils/animations";

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

    async function compute(timestamp: number) {
        if (timestamp > 0) {
            console.log(' run');
            
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: `${-(getWidth($hoursBox.el) + (divSize / 2 ))}px`, y: '-50%'}));
            minutesBox.update(el => ({...el, x: `${-(divSize / 2)}px`, y: '-50%'}));

            animate(true);
        }
    }

    onDestroy(async () => animate(false));
</script>