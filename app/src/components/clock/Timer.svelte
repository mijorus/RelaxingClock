<script lang="ts">
    export let isShowedAlongsideClock: boolean = false;
    import { windowReady } from "html-ready";

    import styles from "./clockStyles/styles";
    import {
        activeStyle,
        presentation,
        timerTime,
    } from "../../stores/storedSettings";
    import { clockIsVisible, styleChangeLock } from "../../stores/globalState";
    import { screenSaver } from "../../stores/globalState";
    import { clockStyleClass, accentColor } from "../../stores/storedSettings";
    import IncomingEventsMessages from "./IncomingEventsMessages.svelte";
    import Divisor from "./Divisor.svelte";
    import Seconds from "./Seconds.svelte";
    import Minutes from "./Minutes.svelte";
    import Hours from "./Hours.svelte";
    import ClockItem from "./ClockItem.svelte";
    import time from "../../stores/time";
    import moment, { Moment } from "moment";

    $: updateValues($time);

    let hours = "00";
    let minutes = "00";
    let seconds = "00";

    function updateValues(time: Moment) {
        if ($timerTime) {
            const alarm = moment($timerTime, "X");
            if (alarm.isSameOrBefore(moment())) {
                hours = "00";
                minutes = "00";
                seconds = "00";
                return;
            }

            const diffS = alarm.diff(moment(), "seconds");
            hours = Math.floor(diffS / 3600)
                .toString()
                .padStart(2, "0");
            minutes = Math.floor((diffS % 3600) / 60)
                .toString()
                .padStart(2, "0");
            seconds = (diffS % 60).toString().padStart(2, "0");
        }
    }
</script>

{#if !isShowedAlongsideClock}
    <div
        class="w-full justify-center flex flex-row items-center flex-nowrap {$clockStyleClass} font-semibold text-primary text-giant-0.5 lg:text-giant-1 transition-opacity
        whitespace-nowrap w-auto h-full z-10 absolute top-0 left-0 select-none {$screenSaver &&
        !$presentation
            ? 'opacity-75'
            : ''}"
    >
        <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-2/4">
                <IncomingEventsMessages />
            </div>
            <div>
                {#if hours !== "00"}
                    <ClockItem value={hours} /><Divisor />
                {/if}<ClockItem value={minutes} /><Divisor /><ClockItem
                    color
                    value={seconds}
                />
            </div>
        </div>
    </div>
{:else}
    <div
        class="relative opacity-60 text-primary text-lg lg:text-6xl
           font-medium transition-opacity duration-300 select-none pointer-events-none m-5"
    >
        <p class="text-lg text-center">
            <span style={`color: ${$accentColor};`}>Re</span>maining:
        </p>
        <div class="flex flex-row items-center space-x-1">
            {#if hours !== "00"}
                <ClockItem value={hours} /><span>:</span>
            {/if}
            <ClockItem value={minutes} /><span>:</span>
            <ClockItem color value={seconds} />
        </div>
    </div>
{/if}
