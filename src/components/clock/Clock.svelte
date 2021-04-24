<script lang="ts" context="module">
    export const clockElementsClass: string = 'absolute animated left-1/2 top-1/2';
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { windowReady } from 'html-ready';

    import time from '../../stores/time';
    import { activeStyle, bigClockUpdate, hoursBox, minutesBox, secondsBox } from "../../stores/clockStyle";

    import Classic from './clockStyles/Classic.svelte';
    import Focused from './clockStyles/Focused.svelte';
    import Metro from './clockStyles/Metro.svelte';
    
    import Hours from './Hours.svelte';
    import Minutes from './Minutes.svelte';
    import Seconds from './Seconds.svelte';
    import Divisor from './Divisor.svelte';
    
    
    onMount(async () => {
        await windowReady;
        
        hoursBox.update(p => ({...p, el: document.getElementById('hours-box')}));
        minutesBox.update(p => ({...p, el: document.getElementById('minutes-box')}));
        secondsBox.update(p => ({...p, el: document.getElementById('seconds-box')}));

        bigClockUpdate.set($time.unix());
    });
</script>

<div class="flex flex-row items-center relative">
    <div id="big-clock" class="font-clock text-primary text-giant-1 whitespace-nowrap relative w-full h-full m-auto">
        <span id="hours-box" class="{clockElementsClass}" style="transform: translateX({$hoursBox.x}) translateY({$hoursBox.y});">
            {#if $hoursBox.visible}
                <Hours value={$time.format('HH')}></Hours>
            {/if}
        </span>

        <span id="minutes-box" class="{clockElementsClass}" style="transform: translateX({$minutesBox.x}) translateY({$minutesBox.y});">
            {#if $minutesBox.visible}
                <span id="minutes-divisor"><Divisor /></span><Minutes value={$time.format('mm')}></Minutes>
            {/if}
        </span>
        
        <span id="seconds-box" class="{clockElementsClass}" style="transform: translateX({$secondsBox.x}) translateY({$secondsBox.y});">
            {#if $secondsBox.visible}
                <span id="seconds-divisor"><Divisor /></span><Seconds value={$time.format('ss')}></Seconds>
            {/if}
        </span>
    </div>

    {#if $activeStyle === 0}
    <Classic />
    {:else if $activeStyle === 1}
    <Focused />
    {:else if $activeStyle === 2}
    <Metro />
    {/if}
</div>

<style>
    .animated {
        transition: transform .3s ease-out;
    }
</style>