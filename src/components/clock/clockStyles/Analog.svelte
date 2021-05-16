<script lang="ts">
    import anime from "animejs";
    import randomcolor from "randomcolor";
    import { onDestroy } from "svelte";
    import { clockTransition } from "../../../handlers/clockTransitions";

    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from "../../../stores/clockStyle";
    import { screenSaver } from "../../../stores/globalState";
    import time from "../../../stores/time";
    import { cbDefault } from "../../../utils/animations";

    let analogClock: HTMLElement;
    let initialized: boolean = false;
    const handClasses = 'absolute rounded-full top-2/4 left-2/4 origin-right-2/4 bg-primary';

    $: compute($bigClockUpdate);
    $: toggleScreenSaver($screenSaver);

    $: hours = parseInt($time.format('h'));
    $: min = parseInt($time.format('m'));
    $: sec = parseInt($time.format('s'));

    function animate(forward: boolean) {
        const targets = forward ? '.clock-element' : ['.clock-element', analogClock];
        const boxes = [secondsBox, minutesBox, hoursBox];
        const transition = anime({
            targets,
            opacity: forward ? 0 : 1,
            easing: cbDefault,
            duration: 300,
            complete() {
                if (forward) {
                    boxes.forEach(i => i.update(el => ({...el, visible: false})));
                }
            }
        });

        clockTransition(transition);
    }

    function toggleScreenSaver(enabled: boolean) {}

    function compute(timestamp: number) {
        if (timestamp > 0 && !initialized) {
            animate(true);
            initialized = true;
        }
    }

    onDestroy(() => animate(false));
</script>

<div
    bind:this={analogClock}
    class="rounded-full border-none w-96 h-96 absolute top-2/4 left-2/4 transition-transform duration-1000 ease-in-out transform -translate-x-2/4 {$screenSaver ? '-translate-y-2/4' : '-translate-y-3/4'}"
>
    <span id="little-dot" class="z-50 h-4 w-4 absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-highlighted rounded-full"></span>
    {#each Array(12) as _, i}
        <span class="hand smooth-move {handClasses} w-48" style="transform: rotate({i * 30}deg);">
            <span class="bg-highlighted {i % 3 ? 'h-1.5 w-1.5 opacity-75' : 'h-3 w-3'} absolute top-0 right-0 transform -translate-x-2/4 -translate-y-2/4 inline-block rounded-full"></span>
        </span>
    {/each}
    <span id="hand-hours" 
        style="transform: translate(0%, -50%) rotate({(((hours * 30) + (min / 2)) - 90)}deg)"
        class="hand smooth-move {handClasses} border-2 border-primary w-20 h-3 z-10"
    >
    </span>
    <span id="hand-min" 
        style="transform: translate(0%, -50%) rotate({(((min * 6) + (sec / 10)) - 90)}deg)"
        class="hand smooth-move {handClasses} border-2 border-primary w-24 h-2 z-20"
    >
    </span>
    <span id="hand-seconds" 
        style="transform: translate(0%, -50%) rotate({((sec * 6) - 90)}deg); border-color: {randomcolor({ luminosity: 'bright' })}"
        class="hand {handClasses} border-2 w-40 h-1.5 z-30"
    >
    </span>
</div>