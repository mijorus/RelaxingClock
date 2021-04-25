<script lang="ts">
    import anime from "animejs";
    import { onDestroy } from 'svelte';

    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import { cbDefault } from "../../../utils/animations";
    import { styleChangeLock } from "../../../stores/globalState";

    $: compute($bigClockUpdate);

    function animate(forward: boolean) {
        anime({
            begin() {
                styleChangeLock.set(true);
                if (!forward) secondsBox.update(el => ({...el, visible: true}));
            },
            targets: $secondsBox.el,
            duration: 200,
            opacity: forward ? 0 : 1,
            easing: cbDefault,
            complete() {
                if (forward) secondsBox.update(el => ({...el, visible: false}));
                styleChangeLock.set(false);
            }
        });
    }   

    async function compute(timestamp: number) {
        if (timestamp > 0) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: `${-(getWidth($hoursBox.el) + (divSize / 2 ))}px`, y: '-50%', visible: true}));
            minutesBox.update(el => ({...el, x: `${-(divSize / 2)}px`, y: '-50%', visible: true}));

            animate(true);
        }
    }

    onDestroy(async () => animate(false));
</script>