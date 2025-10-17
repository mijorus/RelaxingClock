<script lang="ts">
    import BlinkingDots from "./settingsPage/BlinkingDots.svelte";
    import HighContrast from "./settingsPage/HighContrast.svelte";
    import Spotify from "./settingsPage/Spotify.svelte";
    import Reminders from "./settingsPage/Reminders.svelte";
    import Alarm from "./settingsPage/Alarm.svelte";
    import Weather from "./settingsPage/Weather.svelte";
    import Hours from "../clock/Hours.svelte";
    import Divisor from "../clock/Divisor.svelte";
    import Minutes from "../clock/Minutes.svelte";
    import { clockIsVisible, tips } from "../../stores/globalState";
    import { fade, fly, slide } from "svelte/transition";
    import Pinned from "./settingsPage/Pinned.svelte";
    import SettingsBox from "../elements/SettingsBox.svelte";
    import DangerZone from "./settingsPage/DangerZone.svelte";
    import SaveBattery from "./settingsPage/SaveBattery.svelte";
    import PomodoroTimer from "./settingsPage/PomodoroTimer.svelte";
    import ShowTutorial from "./settingsPage/ShowTutorial.svelte";
    import ChangeAccentColor from "./settingsPage/ChangeAccentColor.svelte";
    import RemoteTime from "./settingsPage/RemoteTime.svelte";
    import ProTips from "./settingsPage/ProTips.svelte";
    import Donate from "./settingsPage/Donate.svelte";
    import { clockStyleClass } from "../../stores/storedSettings";
    import ClockFont from "./settingsPage/ClockFont.svelte";
    import Feedback from "./settingsPage/Feedback.svelte";

    $: {
        if (!$clockIsVisible && !$tips) tips.set([{ name: "Show keyboard shortcuts", shortcut: "?" }]);
        if ($clockIsVisible && $tips && $tips[0].shortcut === "?") tips.set(null);
    }
</script>

<div class="relative">
    <div class="relative flex flex-col w-full md:w-8/12 max-w-2xl p-2 md:p-0 m-auto mt-20 text-primary font-primary">
        <SettingsBox collapsable={false} bordered={false}>
            <h1 class="pl-5 md:p-0 text-7xl md:text-8xl text-primary font-title font-bold">
                Relaxing<br />Clock
            </h1>
        </SettingsBox>
        <!-- <Donate />
        <ProTips /> -->
        <Spotify />
        <!-- <Weather /> -->
        <Alarm />
        <PomodoroTimer />
        <Pinned />
        <Reminders />

        <div class="mt-16">
            <SettingsBox collapsable={false} bordered={false}><span class="pl-5 md:p-0 text-6xl text-primary font-title font-bold">Settings</span></SettingsBox>
            <div class="relative pt-1 rounded-xl border-2 border-secondary">
                <ChangeAccentColor />
                <ClockFont />
                <RemoteTime />
                <HighContrast />
                <BlinkingDots />
                <!-- <SaveBattery /> -->
                <ShowTutorial />
                <!-- <Feedback /> -->
                <div class="mt-20"><DangerZone /></div>
            </div>
        </div>
    </div>
    {#if !$clockIsVisible}
        <div class="p-4 fixed bottom-0 left-0 xl:text-7xl opacity-50 lg:text-5xl md:text-4xl hidden md:block {$clockStyleClass} text-primary" transition:slide>
            <a href="#clock" class="cursor-pointer"><Hours interactive={false} /><Divisor /><Minutes /></a>
        </div>
    {/if}
</div>

<style global>
    .settings-btn {
        transition: color 0.4s linear;
        outline: none;
    }

    .settings-btn:focus,
    .settings-btn:active,
    .settings-btn:hover {
        outline: none;
    }
</style>
