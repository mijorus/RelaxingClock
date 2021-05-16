<script lang="ts" context="module">
    export const clockElementsClass: string = 'absolute animated left-1/2 top-1/2 clock-element';
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { windowReady } from 'html-ready';

    import time from '../../stores/time';
    import { activeStyle } from "../../stores/settings";
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
        
        hoursBox.update(p => ({...p, el: document.getElementById('hours-box')}));
        minutesBox.update(p => ({...p, el: document.getElementById('minutes-box')}));
        secondsBox.update(p => ({...p, el: document.getElementById('seconds-box')}));

        bigClockUpdate.set($time.unix());
    });
</script>

<div id="big-clock-container" class="w-full h-full relative overflow-hidden">
    <div id="big-clock" class="font-clock text-primary text-giant-1 whitespace-nowrap relative w-full h-full m-auto">
        <span id="hours-box" class="{clockElementsClass}" style="transform: translateX({$hoursBox.x}) translateY({$hoursBox.y});">
            <Hours value={$hoursBox.visible ? $time.format('HH') : ''}></Hours>
        </span>

        <span id="minutes-box" class="{clockElementsClass}" style="transform: translateX({$minutesBox.x}) translateY({$minutesBox.y});">
            <span id="minutes-divisor"><Divisor visible={$minutesBox.visible}/></span><Minutes value={$minutesBox.visible ? $time.format('mm') : ''}></Minutes>
           
        </span>
        
        <span id="seconds-box" class="{clockElementsClass}" style="transform: translateX({$secondsBox.x}) translateY({$secondsBox.y});">
            <span id="seconds-divisor"><Divisor visible={$secondsBox.visible}/></span><Seconds value={$secondsBox.visible ? $time.format('ss') : ''}></Seconds>
        </span>

        {#if $activeStyle === 0}
        <Classic />
        {:else if $activeStyle === 1}
        <Focused />
        {:else if $activeStyle === 2}
        <Metro />
        {:else if $activeStyle === 3}
        <Analog />
        {/if}
    </div>
</div>

<style>
    .animated {
        transition: transform .3s ease-out;
    }
</style>