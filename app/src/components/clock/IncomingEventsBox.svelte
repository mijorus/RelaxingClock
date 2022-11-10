<script lang="ts">
    import time from "../../stores/time";
    import { fly, fade, scale, slide } from "svelte/transition";
    import type { Moment } from "moment";
    import { RemindersDB } from "../../handlers/RemindersDB";
    import { alarmTime, clockFormat } from "../../stores/storedSettings";
    import { locSto } from "../../utils/utils";
    import moment from "moment";
    import momentDurationFormatSetup from "moment-duration-format";
    import { geniusLink, spotifyPlayerState } from "../../stores/spotify";
    import axios from "axios";

    let isHovered = false;

    momentDurationFormatSetup(moment);

    $: periodicCheck($time);
    let incoming: { [key: string]: { isIncoming: boolean; color: string; icon: string; link: boolean | string; iconColor?: string; label?: string } } = {
        alarm: {
            isIncoming: false,
            color: "orange",
            icon: "lnr lnr-clock",
            link: true,
            label: null,
        },
        reminders: {
            isIncoming: false,
            color: "#57ceff",
            icon: "lnr lnr-calendar-full",
            link: true,
        },
        pomodoro: {
            isIncoming: false,
            color: "red",
            iconColor: "white",
            icon: "icon-tomato-bw",
            link: true,
            label: null,
        },
        genius: {
            isIncoming: false,
            color: "yellow",
            iconColor: "yellow",
            icon: "genius-icon",
            link: true,
            label: null,
        },
    };

    async function periodicCheck(time: Moment) {
        if (!time) return;

        incoming.reminders.isIncoming = (RemindersDB.db && (await RemindersDB.getAllByExpirationDate()).find((r) => !r.done)) !== undefined;
        incoming.alarm.isIncoming = $alarmTime !== undefined;
        incoming.alarm.label = locSto("alarmTime") ? moment(locSto("alarmTime"), "X").format($clockFormat === "24h" ? "HH:mm" : "hh:mm") : null;

        incoming.pomodoro.isIncoming = locSto("pomodoroState") ? true : false;

        const pomodoroColor = locSto("pomodoroState") ? (locSto("pomodoroState") === "focus" ? "red" : "green") : "white";

        incoming.pomodoro.color = pomodoroColor;
        incoming.pomodoro.iconColor = pomodoroColor;
        incoming.pomodoro.label = locSto("pomodoroState") ? moment.duration(moment(locSto("pomodoroEndsAt"), "X").diff(time)).format("mm:ss") : null;

        incoming.genius.isIncoming = $geniusLink !== null;
        if ($geniusLink) {
            incoming.genius.link = $geniusLink;
        }
    }
</script>

{#if Object.keys(incoming).find((k) => incoming[k].isIncoming)}
    <div 
    class="my-1 flex justify-center incoming-events-box incoming-elements">
        <div class="flex justify-center items-center w-min incoming-el-container">
            {#each Object.keys(incoming) as k (k)}
                {#if incoming[k].isIncoming}
                    {#if !incoming[k].link}
                        <i class="status-icon  text-md  mx-1 p-2 {incoming[k].icon}" style="color: {incoming[k].color};" in:fade />
                    {:else if incoming[k].link}
                        <a on:click|stopPropagation href={typeof incoming[k].link === "boolean" ? `#${k}` : incoming[k].link} class="status-icon text-md" target="{typeof incoming[k].link === 'string' ? '_blank' : null}">
                            <div class=" mx-1 p-2 flex flex-row items-center gap-1 {incoming[k].label ? 'border rounded-full border-white' : ''}">
                                <i class="inline-block {incoming[k].icon}" style="color: {incoming[k].iconColor ?? incoming[k].color};" in:fade />
                                {#if incoming[k].label}<span class="text-white text-xs">{incoming[k].label}</span>{/if}
                            </div>
                        </a>
                    <!-- {:else} -->
                    {/if}
                    <span class="middot mx-1 p-2 inline-block text-3xl" style="color: {incoming[k].color};" in:fade>&middot;</span>
                {/if}
            {/each}
        </div>
    </div>
{/if}


<style>
    .incoming-events-box {
        opacity: .5;
    }

    .incoming-events-box:hover {
        opacity: 1;
    }

    .incoming-events-box:hover .incoming-el-container {
        background-color: var(--tertiary) !important;
        border-radius: 999px !important;
    }

    .incoming-events-box:hover .middot{
        display: none !important;
    }

    .status-icon {
        display: none !important;
    }

    .incoming-events-box:hover .status-icon{
        display: inline-block !important;
    }
</style>