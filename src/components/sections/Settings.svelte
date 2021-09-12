<script lang="ts">
import BlinkingDots from './settingsPage/BlinkingDots.svelte';
import HighContrast from './settingsPage/HighContrast.svelte';
import Spotify from './settingsPage/Spotify.svelte';
import Reminders from './settingsPage/Reminders.svelte';
import Alarm from './settingsPage/Alarm.svelte';
import Weather from './settingsPage/Weather.svelte';
import Hours from '../clock/Hours.svelte';
import Divisor from '../clock/Divisor.svelte';
import Minutes from '../clock/Minutes.svelte';
import { clockIsVisible } from '../../stores/globalState';
import { fade } from 'svelte/transition';
import Pinned from './settingsPage/Pinned.svelte';
</script>

<div class="relative">
    <div class="w-10/12 flex flex-col md:w-8/12 max-w-2xl m-auto mt-20 relative text-primary font-primary">
        <Spotify />
        <Weather />
        <HighContrast />
        <BlinkingDots />
        <Alarm />
        <Pinned />
        <div class="relative">
            <div class="absolute w-1/2 h-1/2 pr-0 rounded-xl" style="transform: translate(-5%, -5%); background-color: rgb(14 14 14);"></div>
            <Reminders />
        </div>
    </div>
    {#if !$clockIsVisible}
        <div class="sticky bottom-0 left-0 xl:text-7xl opacity-50 lg:text-5xl md:text-4xl sm:hidden md:block p-4 font-clock text-primary transition-all" transition:fade>
            <div><Hours interactive={false}/><Divisor /><Minutes /></div>
        </div>
    {/if}
</div>


<style global>
    .settings-btn {
        transition: color .4s linear;
        outline: none;
    }
    
    .settings-btn:focus, .settings-btn:active, .settings-btn:hover {
        outline: none;
    }
</style>