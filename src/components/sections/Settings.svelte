<script lang="ts">
    import SettingsBox from '../elements/SettingsBox.svelte';

    import Title from "../elements/settings/Title.svelte";
    import TitleIcon from "../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../elements/settings/PrimaryBox.svelte";
    import NestedBox from "../elements/settings/NestedBox.svelte";
    import Booleans from "../elements/settings/Buttons/Booleans.svelte";
    import Action from "../elements/settings/Buttons/Action.svelte";

    import BlinkingDots from './settingsPage/BlinkingDots.svelte';
    import HighContrast from './settingsPage/HighContrast.svelte';
    import Spotify from './settingsPage/Spotify.svelte';
    import Reminders from './settingsPage/Reminders.svelte';
</script>

<div class="w-10/12 flex flex-col md:w-8/12 max-w-2xl m-auto mt-20 relative text-primary font-primary">
    <Spotify />
    <HighContrast />
    <BlinkingDots />
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