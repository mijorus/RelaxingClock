<script lang="ts">
    import anime from "animejs";
    import time from "../../../stores/time";
    import { screenSaver } from "../../../stores/globalState";
    import { cbDefault, eaElasticDefault } from "../../../utils/animations";
    import StyleBase from "./StyleBase.svelte";
    import { describeArc } from "../../../utils/utils";
    import type { Moment } from "moment";
    import moment from "moment";
    import { clockFormat } from "../../../stores/storedSettings";
    import { onMount } from "svelte";
    import IncomingEventsBox from "../IncomingEventsBox.svelte";
    import IncomingEventsMessages from "../IncomingEventsMessages.svelte";
    import { activeStyleId, nextStyleId } from "../../../stores/clockStyle";
    import Hours from "../Hours.svelte";

    let animationReady = false;
    let rotateSec = 0;
    let rotateMin = 0;
    let container: HTMLElement;
    let entrance = false;

    $: handleClock($time);
    // $: load($activeStyleId);
    $: load($nextStyleId);
    $: screenSaverMode($screenSaver);

    function load(style) {
        if (style === 5) {
            rotateSec -= 30;
            rotateMin += 30;
            setTimeout(() => {
                rotateSec += 30;
                rotateMin -= 30;
            }, 250);

            entrance = true;
        } else {
            entrance = false;
        }
    }

    function handleClock(time: Moment) {
        if (entrance) {
            rotateSec += 6;
            if (time.seconds() === 0) rotateMin += 6;
        }
    }

    function screenSaverMode(screenSaver: boolean) {
        anime({
            targets: container,
            duration: 1500,
            easing: eaElasticDefault,
            scale: screenSaver ? 1.6 : 1
        })
    }

    onMount(() => {
        setTimeout(() => {
            animationReady = true
        }, 750);
    });
</script>

<StyleBase styleId={5}>
    <div bind:this={container} class="relative {$screenSaver ? 'pb-0' : 'pb-36'} font-title" style="transition: padding .2s ease-out;">
        <div class="absolute w-96" style="transform: translateX(-50%);">
            {#each Array(60) as _, s}
                <div class="absolute transform-gpu flex items-center rounded-full w-96 h-2" 
                    style="transform: rotate({6 * s + rotateSec}deg); transition: transform .25s ease-out; will-change: transform;"
                >
                    <div class="w-2 h-0.5 bg-white opacity-20" />
                    {#if !((s+1) % 5)}
                    <span class="pr-2 {6 * s + rotateSec % 180 ? 'text-sm' :"text-xs"} transform-gpu" style="transform: scale(-1);">{60 - (s + 1)}</span>
                    {/if}
                </div>
                {/each}
        </div>
        <div class="absolute w-60" style="transform: translateX(-50%);">
            {#each Array(60) as _, s}
            <div class="absolute transform-gpu flex items-center rounded-full w-60 h-2" style="transform: rotate({6 * s + rotateMin}deg); transition: transform .25s ease-out;">
                <div class="w-2 h-0.5 bg-white opacity-20" />
                {#if !((s+1) % 5)}
                    <span class="pr-3 transform-gpu text-base" style="transform: scale(-1);">{60 - (s + 1)}</span>
                {/if}
                </div>
            {/each}
        </div>
        <div class="absolute flex justify-center items-center font-title" style="transform: translate(-50%, -25%)">
            <span class="text-6xl">{$time.hours()}</span>
        </div>
    </div>
</StyleBase>

<style>
</style>
