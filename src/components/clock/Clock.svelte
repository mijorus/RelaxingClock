<script lang="ts">
    import time from '../../stores/time';
    import { activeStyle } from "../../stores/clockStyle";
    
    import Classic from './clockStyles/Classic.svelte';
    import Focused from './clockStyles/Focused.svelte';
    
    import Hours from './Hours.svelte';
    import Divisor from './Divisor.svelte';
    import Seconds from './Seconds.svelte';
    import Minutes from './Minutes.svelte';

    const styleClass: string = 'font-clock text-primary text-8xl';

</script>

<div class="h-64 flex flex-row items-center relative">
    <div id="big-clock" class="{styleClass} whitespace-nowrap relative w-full h-full m-auto">
        <span id="hours-box" class="absolute animate">
            <Hours value={$time.format('HH')}></Hours>
        </span>
        <span id="minutes-box" class="absolute animate">
            <span id="minutes-divisor"><Divisor /></span><Minutes value={$time.format('mm')}></Minutes>
        </span>
        <span id="seconds-box" class="absolute animate">
            <span id="seconds-divisor"><Divisor /></span><Seconds value={$time.format('ss')}></Seconds>
        </span>
    </div>

    {#if $activeStyle === 0}
    <Classic/>
    {:else if $activeStyle === 1}
    <Focused />
    {/if}
</div>

<style>
    .animate {
        transition: transform .3s ease-out, opacity .2s linear;
    }
</style>