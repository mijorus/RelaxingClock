<script lang="ts">
import SettingsBox from '../elements/SettingsBox.svelte';

import BlinkingDots from './settingsPage/BlinkingDots.svelte';
import HighContrast from './settingsPage/HighContrast.svelte';
import Spotify from './settingsPage/Spotify.svelte';
import Reminders from './settingsPage/Reminders.svelte';
import Alarm from './settingsPage/Alarm.svelte';
</script>

<div class="w-10/12 flex flex-col md:w-8/12 max-w-2xl m-auto mt-20 relative text-primary font-primary">
    <Spotify />
    <HighContrast />
    <BlinkingDots />
    <Alarm />
    <Reminders />
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