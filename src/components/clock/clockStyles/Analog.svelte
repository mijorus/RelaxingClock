<script lang="ts">
    import randomcolor from "randomcolor";
    import { screenSaver } from "../../../stores/globalState";
    import time from "../../../stores/time";
    import StyleBase from "./StyleBase.svelte";

    let analogClock: HTMLElement;
    const handClasses = 'absolute rounded-full top-2/4 left-2/4 origin-right-2/4 bg-primary';

    $: toggleScreenSaver($screenSaver);

    $: hours = parseInt($time.format('h'));
    $: min = parseInt($time.format('m'));
    $: sec = parseInt($time.format('s'));
    function toggleScreenSaver(enabled: boolean) {}
</script>

<StyleBase>
    <div
        bind:this={analogClock}
        class="rounded-full border-none w-96 h-96 transform {$screenSaver ? '-translate-y-0' : '-translate-y-1/4'}"
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
</StyleBase>