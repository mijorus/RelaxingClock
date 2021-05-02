<script lang="ts">
    import anime from "animejs";
    import { onDestroy } from 'svelte';

    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import { cbDefault } from "../../../utils/animations";
    import { clockTransition } from "../../../handlers/clockTransitions";

    let initialized: boolean = false;
    $: compute($bigClockUpdate);

    function animate(forward: boolean) {
        const transition = anime({
            targets: $secondsBox.el,
            duration: 200,
            autoplay: false,
            opacity: forward ? 0 : 1,
            easing: cbDefault,
            complete() {
                if (forward) {
                    initialized = true;
                    secondsBox.update(el => ({...el, visible: false}));
                }
            }
        });

        clockTransition(transition);
    }   

    async function compute(timestamp: number) {
        if (timestamp > 0) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: `${-(getWidth($hoursBox.el) + (divSize / 2 ))}px`, y: '-50%', visible: true}));
            minutesBox.update(el => ({...el, x: `${-(divSize / 2)}px`, y: '-50%', visible: true}));

            // only run animation if the component has just been initialized,
            // otherwise skip it
            if (!initialized) animate(true);
        }
    }

    onDestroy(async () => animate(false));
</script>