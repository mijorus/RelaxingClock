<script lang="ts">
    import anime from "animejs";
    import time from "../../../stores/time";
    import { screenSaver } from "../../../stores/globalState";
    import { accentColor } from "../../../stores/storedSettings";
    import { eaElasticDefault } from "../../../utils/animations";
    import StyleBase from "./StyleBase.svelte";
    import type { Moment } from "moment";
    import moment from "moment";
    import { onMount } from "svelte";
    import { nextStyleId } from "../../../stores/clockStyle";
    import { slide } from "svelte/transition";
    import IncomingEventsBox from "../IncomingEventsBox.svelte";

    let hoursHovered = false;
    let rotateSec = 0;
    let rotateMin = 0;
    let container: HTMLElement;
    let entrance = false;

    $: handleClock($time);
    // $: load($activeStyleId);
    $: load($nextStyleId);
    $: screenSaverMode($screenSaver);

    let lastsec = 0;
    function getSecRotation(time: Moment) {
        if (!time.seconds()) lastsec ++;
        return (time.seconds() * 6) + (186 + (360 * lastsec));
    }

    function getMinRotation(time: Moment) {
        return (time.minutes() * 6) + 186;
    }

    function load(style) {
        if (style === 5) {
            rotateSec = getSecRotation(moment()) - 30;
            rotateMin = getSecRotation(moment()) + 15;

            setTimeout(() => {
                rotateSec = getSecRotation(moment());
                rotateMin = getMinRotation(moment());
            }, 250);

            entrance = true;
        } else {
            entrance = false;
        }
    }

    function handleClock(time: Moment) {
        if (entrance) {
            rotateSec = getSecRotation(time);
            if (time.seconds() === 0) rotateMin = getMinRotation(time);
        }
    }

    function screenSaverMode(screenSaver: boolean) {
        anime({
            targets: container,
            duration: 1500,
            easing: eaElasticDefault,
            scale: screenSaver ? 1.6 : 1,
        });
    }

    function isCurrentMinute(s: number, time: Moment) {
        return ((60 - (s + 1)) === time.minutes());
    }
</script>

<StyleBase styleId={5}>
    <div bind:this={container} class="relative {$screenSaver ? 'pb-0' : 'pb-36'} font-title" style="transition: padding .2s ease-out;">
        <div class="absolute w-96" style="transform: translateX(-50%) rotate({rotateSec}deg); transition: transform .25s ease-out; will-change: transform;">
            {#each Array(60) as _, s}
                <div class="absolute transform-gpu flex items-center rounded-full w-96 h-2" style="transform: rotate({6 * s}deg);">
                    <div class="w-2 h-0.5 bg-white opacity-20" />
                    {#if !((s + 1) % 5)}
                        <span class="pr-2 {6 * s + (rotateSec % 180) ? 'text-sm' : 'text-xs'} transform-gpu" style="transform: scale(-1);">{60 - (s + 1)}</span>
                    {/if}
                </div>
            {/each}
        </div>
        <div class="absolute w-60" style="transform: translateX(-50%) rotate({rotateMin}deg); transition: transform .25s ease-out;">
            {#each Array(60) as _, s}
                <div class:z-10={isCurrentMinute(s, $time)} class="absolute transform-gpu flex items-center rounded-full w-60 h-2" style="transform: rotate({6 * s}deg);">
                    <div class="w-2 h-0.5 bg-white opacity-20" />
                    {#if !((s + 1) % 5) || isCurrentMinute(s, $time)}
                        <div 
                            transition:slide
                            class="leading-normal mr-3 px-2 py-1 transform-gpu {isCurrentMinute(s, $time) ? 'shadow-2xl shadow-primary bg-primary text-2xl rounded-full border-2' : 'text-base'}" 
                            style="transform: scale(-1); border-color: {$accentColor}">
                            {60 - (s + 1)}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        <div
            on:mouseenter={() => hoursHovered = true} 
            on:mouseleave={() => hoursHovered = false} 
            class="absolute flex justify-center items-center font-title" style="transform: translate(-50%, -50%)">
            <span class="text-6xl">{$time.hours()}</span>
            <div class="absolute -bottom-1/2 text-lg" style="transform: translateX(25%);">
                <IncomingEventsBox isHovered={hoursHovered} />
            </div>
        </div>
    </div>
</StyleBase>

<style>
</style>
