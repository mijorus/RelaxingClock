<script lang="ts" context="module">
    import type { ClockElements } from "../../types";
    
    let elements: ClockElements = undefined;
    export const clockElementsClass: string = 'absolute animated left-1/2 top-1/2';

    export async function getClockElements(): Promise<ClockElements> {
        await windowReady;

        if (!elements) elements = {
            hours: document.getElementById('hours-box'),
            minutes: document.getElementById('minutes-box'),
            seconds: document.getElementById('seconds-box'),
        };

        return new Promise(resolve => resolve(elements));
    }
</script>

<script lang="ts">
    import time from '../../stores/time';
    import { activeStyle, hoursBox, minutesBox, secondsBox } from "../../stores/clockStyle";
    
    import { windowReady } from 'html-ready';
    import styles from "./clockStyles/styles";

    import Classic from './clockStyles/Classic.svelte';
    import Focused from './clockStyles/Focused.svelte';
    import Hours from './Hours.svelte';
    import Minutes from './Minutes.svelte';
    import Seconds from './Seconds.svelte';
    import Divisor from './Divisor.svelte';

    const styleClass: string = 'font-clock text-primary text-giant-1';

   
</script>

<div class="flex flex-row items-center relative">
    <div id="big-clock" class="{styleClass} whitespace-nowrap relative w-full h-full m-auto">
        {#if $hoursBox.visible}
        <span id="hours-box" class="{clockElementsClass}" style="transform: translateX({$hoursBox.x}) translateY({$hoursBox.y});">
            <Hours value={$time.format('HH')}></Hours>
        </span>
        {/if}

        {#if $minutesBox.visible}
        <span id="minutes-box" class="{clockElementsClass}" style="transform: translateX({$minutesBox.x}) translateY({$minutesBox.y});">
            <span id="minutes-divisor"><Divisor /></span><Minutes value={$time.format('mm')}></Minutes>
        </span>
        {/if}
        
        {#if $secondsBox.visible}
        <span id="seconds-box" class="{clockElementsClass}" style="transform: translateX({$secondsBox.x}) translateY({$secondsBox.y});">
            <span id="seconds-divisor"><Divisor /></span><Seconds value={$time.format('ss')}></Seconds>
        </span>
        {/if}
    </div>

    {#if $activeStyle === 0}
    <Classic />
    {:else if $activeStyle === 1}
    <Focused />
    {/if}
</div>

<style>
    .animated {
        transition: transform .3s ease-out, opacity .2s linear;
    }

    .change-height {
        transition: all .1s linear;
    }
</style>