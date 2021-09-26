<script lang="ts">
import randomcolor from "randomcolor";
import { onMount } from "svelte";
import { visibleStylesId } from "../../../stores/clockStyle";
import { screenSaver } from "../../../stores/globalState";
import time from "../../../stores/time";
import StyleBase from "./StyleBase.svelte";

    const styleId = 2;
    let analogClock: HTMLElement;
    const handClasses = 'absolute rounded-full top-2/4 left-2/4 origin-right-2/4 ';
    let handSecColor: string;

    $: hours = parseInt($time.format('h'));
    $: min = parseInt($time.format('m'));
    $: sec = parseInt($time.format('s'));

    function setHandSecColor() {
        handSecColor = randomcolor({ luminosity: 'light' });
        localStorage.setItem('handSecCustomColor', handSecColor);
    }

    onMount(() => {
        if (localStorage.getItem('handSecCustomColor')) handSecColor = localStorage.getItem('handSecCustomColor');
        else setHandSecColor(); 
    })
</script>

<StyleBase>
    {#if $visibleStylesId.includes(styleId)}
        <div
            bind:this={analogClock}
            class="rounded-full border-none w-96 h-96 to-screensaver transform {$screenSaver ? '-translate-y-0 scale-125' : '-translate-y-1/4'}"
        >
            <span id="little-dot" class="z-50 transition-transform h-4 w-4 absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-highlighted 
                rounded-full hover:scale-125" on:click={(e) => {e.preventDefault(); setHandSecColor();}}></span>
            {#each Array(12) as _, i}
                <span class="hand smooth-move {handClasses} w-48" style="transform: rotate({i * 30}deg);">
                    <span class="bg-highlighted {i % 3 ? 'h-1.5 w-1.5 opacity-75' : 'h-3 w-3'} absolute top-0 right-0 transform -translate-x-2/4 -translate-y-2/4 inline-block rounded-full"></span>
                </span>
            {/each}
            <span id="hand-hours" 
                style="transform: translate(0%, -50%) rotate({(((hours * 30) + (min / 2)) - 90)}deg)"
                class="hand smooth-move {handClasses} border-2 border-primary w-24 h-3 z-10"
            >
            </span>
            <span id="hand-min" 
                style="transform: translate(0%, -50%) rotate({(((min * 6) + (sec / 10)) - 90)}deg)"
                class="hand smooth-move {handClasses} border-2 border-primary w-32 h-2 z-20"
            >
            </span>
            <span id="hand-seconds" 
                style="transform: translate(0%, -50%) rotate({((sec * 6) - 90)}deg); background-color: {handSecColor}"
                class="hand {handClasses}  w-40 h-1.5 z-30"
            >
            </span>
        </div>
    {/if}
</StyleBase>

<style>
    .to-screensaver {
        transition: transform .6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .smooth-move {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }
</style>