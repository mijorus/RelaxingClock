<script lang="ts" context="module">
    export const clockElementsClass: string = 'absolute animated left-1/2 top-1/2 clock-element';
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { windowReady } from 'html-ready';

    import time from '../../stores/time';
    import { activeStyle } from "../../stores/storedSettings";
    import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from "../../stores/clockStyle";

    import Classic from './clockStyles/Classic.svelte';
    import Focused from './clockStyles/Focused.svelte';
    import Metro from './clockStyles/Metro.svelte';
    
    import Hours from './Hours.svelte';
    import Minutes from './Minutes.svelte';
    import Seconds from './Seconds.svelte';
    import Divisor from './Divisor.svelte';
    import Analog from "./clockStyles/Analog.svelte";

    
    
    onMount(async () => {
        await windowReady;
        bigClockUpdate.set($time.unix());
    });
</script>

<div id="big-clock-container" class="w-full h-full relative overflow-hidden z-10">
    <div 
        id="big-clock" 
        class="font-clock text-primary text-giant-1 whitespace-nowrap relative w-full h-full" 
        style="transform: translateX({$activeStyle * -100}%);"
    >
        <Classic /><Focused />
        <!-- {:else if $activeStyle === 1} -->
        <!-- <Focused /> -->
        <!-- {:else if $activeStyle === 2} -->
        <!-- <Metro /> -->
        <!-- {:else if $activeStyle === 3} -->
        <!-- <Analog /> -->
        <!-- {/if} -->
    </div>
</div>

<style>
    .animated {
        transition: transform .3s ease-out;
    }
</style>