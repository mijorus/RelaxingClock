<script lang="ts">
import randomcolor from "randomcolor";
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import { screenSaver, tips } from "../../../stores/globalState";
import { accentColor, analogTimeLocked } from "../../../stores/storedSettings";
import time from "../../../stores/time";
import Divisor from "../Divisor.svelte";
import Hours from "../Hours.svelte";
import Minutes from "../Minutes.svelte";
import AmPmBadge from "../AmPmBadge.svelte";
import StyleBase from "./StyleBase.svelte";
import IncomingEventsBox from "../IncomingEventsBox.svelte";
import { locSto, randomCustomColor, shakeElement } from "../../../utils/utils";
import IncomingEventsMessages from "../IncomingEventsMessages.svelte";

    let analogClock: HTMLElement;
    const handClasses = 'absolute rounded-full top-2/4 left-2/4 origin-right-2/4 ';
    let handSecColor: string;
    
    let showTime = false;

    $: hours = parseInt($time.format('h'));
    $: min = parseInt($time.format('m'));
    $: sec = parseInt($time.format('s'));

    function setHandSecColor() {
        accentColor.set(randomCustomColor());
    }

    function handleMouseEnter(e) {
        showTime = true;
        tips.set([
            { name:"Always show the digital clock", shortcut:'Lock button' },
            { name:"Change accent color", shortcut:'Click on the center dot' }
        ]);
    }

    function handleMouseLeave(e) {
        showTime = false;
        tips.set(null);
    }

    function changeAnalogTimeLockedState() {
        analogTimeLocked.set(!$analogTimeLocked);
        shakeElement(document.getElementById('analog-lock-time'));
    }

    onMount(() => {
        if (!$accentColor) setHandSecColor(); 
    })
</script>

<StyleBase styleId={2}>
        <div
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
            bind:this={analogClock}
            class="rounded-full border-none w-96 h-96 to-screensaver transform {$screenSaver ? '-translate-y-0 scale-125' : '-translate-y-1/4'}"
        >
            <div class="text-center text-2xl mt-16 -z-1 smooth-fade {showTime || $analogTimeLocked ? 'opacity-70' : 'opacity-0'}" style="filter:grayscale(1);" transition:fade>
                <div id="analog-lock-time" class="{showTime ? 'opacity-70' : 'opacity-20'} text-base transition-opacity  cursor-pointer" on:click|stopPropagation={changeAnalogTimeLockedState}>
                    <i class="fas fa-{$analogTimeLocked ? 'lock' : 'unlock'}"></i>
                </div>
                <div><Hours interactive={false}/><Divisor /><Minutes /><AmPmBadge size="xs"/></div>
            </div>
            <div class="text-center text-xl mt-0 -z-1">
                 <IncomingEventsBox isHovered={showTime} />
            </div>
            
            <span id="little-dot" class="z-50 transition-transform h-4 w-4 absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-highlighted 
                rounded-full hover:scale-125" on:click|stopPropagation|preventDefault={(e) => {setHandSecColor();}}></span>
            {#each Array(12) as _, i}
                <span class="hand smooth-move {handClasses} w-48" style="transform: rotate({i * 30}deg);">
                    <span class="bg-highlighted {i % 3 ? 'h-1.5 w-1.5 opacity-75' : 'h-3 w-3'} absolute top-0 right-0 transform -translate-x-2/4 -translate-y-2/4 inline-block rounded-full"></span>
                </span>
            {/each}
            <span id="hand-hours" 
                style="transform: translate(0%, -50%) rotate({(((hours * 30) + (min / 2)) - 90)}deg)"
                class="hand smooth-move bg-primary {handClasses} border-2 border-primary w-24 h-3 z-10 flex items-center justify-center"
            >
                <div class="hand smooth-move bg-white rounded-full border-2 border-none w-12 h-0.5 z-10"></div>
            </span>
            <span id="hand-min" 
                style="transform: translate(0%, -50%) rotate({(((min * 6) + (sec / 10)) - 90)}deg)"
                class="hand smooth-move bg-primary {handClasses} border-2 border-primary w-32 h-2 z-20"
            >
            </span>
            <span id="hand-seconds" 
                style="transform: translate(0%, -50%) rotate({((sec * 6) - 90)}deg); background-color: {$accentColor}; transition: background-color .1s linear"
                class="hand {handClasses} w-40 h-1.5 z-30"
            >
            </span>
            <div class="{$screenSaver ? 'absolute' : 'hidden'} left-1/2 transform -translate-x-2/4 top-full mt-10">
                <IncomingEventsMessages />
            </div>
        </div>
</StyleBase>

<style>
    .smooth-fade {
        transition: opacity 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .to-screensaver {
        transition: transform .75s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .smooth-move {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }
</style>