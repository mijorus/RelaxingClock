<script lang="ts">
    import anime from "animejs";
import { onDestroy } from "svelte";
import { clockTransition } from "../../../handlers/clockTransitions";

    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from "../../../stores/clockStyle";
import { cbDefault } from "../../../utils/animations";

    let initialized: boolean = false;
    $: compute($bigClockUpdate)

    function animate(forward: boolean) {
        const boxes = [secondsBox, minutesBox, hoursBox];
        const transition = anime({
            targets: '#big-clock',
            opacity: forward ? 0 : 1,
            easing: cbDefault,
            duration: 300,
            complete() {
                if (forward) boxes.forEach(i => i.update(el => ({...el, visible: false})))
            }
        });

        clockTransition(transition);
    }

    function compute(timestamp: number) {
        if (timestamp > 0) {
            if (!initialized) {
                initialized = true;
                animate(true);
            }
        }
    }

    onDestroy(() => animate(false));
</script>