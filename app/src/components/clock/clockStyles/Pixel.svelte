<script lang="ts">
    import anime from "animejs";
    import time from "../../../stores/time";
    import { bgImageBright, screenSaver } from "../../../stores/globalState";
    import { accentColor, clockFormat } from "../../../stores/storedSettings";
    import { eaElasticDefault } from "../../../utils/animations";
    import StyleBase from "./StyleBase.svelte";
    import type { Moment } from "moment";
    import moment from "moment";
    import { onMount } from "svelte";
    import { nextStyleId } from "../../../stores/clockStyle";
    import { slide } from "svelte/transition";

    let rotateSec = 0;
    let rotateMin = 0;
    let container: HTMLElement;
    let entrance = false;

    $: handleClock($time);
    $: load($nextStyleId);
    $: screenSaverMode($screenSaver);

    let lastsec = 0;
    function getSecRotation(time: Moment) {
        if (!time.seconds()) lastsec++;
        return time.seconds() * 6 + (186 + 360 * lastsec);
    }

    function getMinRotation(time: Moment) {
        return time.minutes() * 6 + 186;
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
        return 60 - (s + 1) === time.minutes();
    }
</script>

<StyleBase styleId={5}>
    <div bind:this={container} class="relative {$screenSaver ? 'pb-0' : 'pb-36'} font-title {$bgImageBright !== 'none' ? 'bg-image-light-pixel' : ''}" style="transition: padding .2s ease-out; color .2s linear;">
        <div class="absolute h-96 w-96" style="transform: translate(-50%) rotate({rotateSec}deg); transition: transform .25s ease-out; will-change: transform; transform-origin: 50% 0%;">
            {#each Array(60) as _, s}
                <div class=" absolute transform-gpu flex items-center rounded-full w-96 h-2" style="transform: translateY(-50%) rotate({6 * s}deg);">
                    <div class="w-2 h-0.5 bg-white opacity-20" />
                    {#if !((s + 1) % 5)}
                        <span class="pr-2 {6 * s + (rotateSec % 180) ? 'text-sm' : 'text-xs'} transform-gpu" style="transform: scale(-1);">{60 - (s + 1)}</span>
                    {/if}
                </div>
            {/each}
        </div>
        <div class="absolute w-60" style="transform; transform-origin: 50% 0%; transform: translate(-50%) rotate({rotateMin}deg); transition: transform .25s ease-out;">
            {#each Array(60) as _, s}
                <div class:z-10={isCurrentMinute(s, $time)} class=" absolute transform-gpu flex items-center rounded-full w-60 h-2" style="transform: translateY(-50%) rotate({6 * s}deg);">
                    <div class="w-2 h-0.5 bg-white opacity-20" />
                    {#if !((s + 1) % 5) || isCurrentMinute(s, $time)}
                        <div
                            transition:slide
                            class="leading-normal mr-3 px-2 py-1 transform-gpu {isCurrentMinute(s, $time)
                                ? `shadow-2xl shadow-primary text-2xl rounded-full border-2 ${$bgImageBright === 'light' ? 'bg-white current-minute-light' : 'bg-primary'}`
                                : 'text-base'}"
                            style="transform: scale(-1); border-color: {$bgImageBright === 'light' ? 'white'  : ($bgImageBright === 'dark' ? 'bg-primary' : $accentColor)}"
                        >
                            {60 - (s + 1)}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        <div class="absolute flex justify-center items-center font-title" style="transform: translate(-50%, -50%)">
            <span class="text-6xl">{$time.format($clockFormat === "24h" ? "HH" : "hh")}</span>
        </div>
    </div>
</StyleBase>

<style>
    .bg-image-light-pixel {
        color: var(--primary);
        text-shadow: 0 0 20px var(--highlighted);
    }

    .origin-center {
        transform-origin: center center;
    }
    
    .current-minute-light {
        text-shadow: none !important;
        color: black !important;
        box-shadow: 0 0 30px var(--secondary);
        opacity: .95;
    }
</style>
