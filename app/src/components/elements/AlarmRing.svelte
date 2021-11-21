<script lang="ts">
import moment from "moment";

import {  fade } from "svelte/transition";

import { dismiss } from "../../handlers/alarm";
import { alarmIsRinging } from "../../stores/globalState";
import { alarmTime } from "../../stores/storedSettings";
import AnimatedText from "./AnimatedText.svelte";

    let action = ' ';
    const snoozeMinutes = 10;
    
    function resetAction() {
        action = ' ';
    }

    function snoozeAlarm() {
        dismiss(true);
        alarmTime.set(moment().add(snoozeMinutes, 'minutes').unix());
    }
</script>

{#if $alarmIsRinging}
<div id="alarm-ring" class="top-0 left-0 d-none w-screen h-screen flex flex-col justify-center items-center fixed" transition:fade={{duration: 100}} style="z-index: 999;">
    <div class="text-3xl">{localStorage.getItem('alarmTitle') ?? ''}</div>
    <div class="flex justify-center items-center my-24">
        <div><button class="alarm-btn icon-bell-off text-8xl p-4" on:mouseenter={() => action = 'Snooze'} on:mouseleave={resetAction} on:click={snoozeAlarm}></button></div>
        <div><span id="alarm-clock-ring" class="lnr lnr-clock text-giant-3 mx-36 inline-block"></span></div>
        <div><button class="alarm-btn lnr lnr-cross text-8xl font-bold" on:mouseenter={() => action = 'Dismiss'} on:mouseleave={resetAction} on:click={() => dismiss()}></button></div>
    </div>
    <div class="text-3xl"><AnimatedText text={action} /></div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio id="alarm-audio" loop autoplay src="/media/static_media_alarm.mp3" />
</div>
{/if}

<style>
    .alarm-btn {
        transition: transform .1s linear;
    }

    .alarm-btn:hover {
        transform: scale(1.2);
    }
</style>