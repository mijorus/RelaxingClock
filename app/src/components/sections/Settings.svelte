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
import SettingsBox from '../elements/SettingsBox.svelte';
import DangerZone from './settingsPage/DangerZone.svelte';
import SaveBattery from './settingsPage/SaveBattery.svelte';
import PomodoroTimer from './settingsPage/PomodoroTimer.svelte';
</script>

<div class="relative">
    <div class="relative flex flex-col w-full md:w-8/12 max-w-2xl p-2 md:p-0 m-auto mt-20 text-primary font-primary">
        <Spotify />
        <Weather />
        <Alarm />
        <PomodoroTimer />
        <Pinned />
        <Reminders />  
        
        <div class="mt-16">
            <SettingsBox collapsable={false} bordered={false}><span class="text-6xl text-primary font-title font-bold">Settings</span></SettingsBox>
            <div class="relative pt-1 rounded-xl border-2 border-secondary">
                <HighContrast />
                <BlinkingDots />
                <SaveBattery />
                <div class="mt-20"><DangerZone /></div>
            </div>
        </div>
    </div>
    {#if !$clockIsVisible}
        <div class="sticky bottom-0 left-0 xl:text-7xl opacity-50 lg:text-5xl md:text-4xl hidden md:block p-4 font-clock text-primary transition-all" transition:fade>
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