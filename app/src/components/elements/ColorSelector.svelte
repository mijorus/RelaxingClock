<script lang="ts">
import { fade } from "svelte/transition";
import { colorSelector, darkenClock } from "../../stores/globalState";
import tinycolor from 'tinycolor2';

    $: if ($colorSelector !== undefined) darkenClock.set($colorSelector && $colorSelector.show);
    $: size = $colorSelector && $colorSelector.size ? $colorSelector.size : 6.5;

    function closeSelector(color?: string) {
        $colorSelector.callback(color);
        colorSelector.set({...$colorSelector, show: false});
    }
</script>


{#if $colorSelector && $colorSelector.show}
    <div class="w-screen h-screen absolute top-0 left-0" on:contextmenu|preventDefault on:click|stopPropagation={() => closeSelector()}></div>
    <div class="absolute z-10 transform -translate-y-1/4" style="top: {$colorSelector.y}px; left: {$colorSelector.x}px; width: {size}rem; height: {size}rem;">
        {#each $colorSelector.colors as c, i}
            <div class="absolute w-6 flex items-end" style="height:{size / 2}rem; transform: rotate({(i * (360 / $colorSelector.colors.length))}deg); transform-origin: top center;" transition:fade={{delay: i * 50}}>
                <div class="w-6 h-6 rounded-full transform hover:scale-150 transition-transform" style="background-color: {c};" on:click={() => closeSelector(c)}></div>
            </div>
        {/each}
    </div>
{/if}