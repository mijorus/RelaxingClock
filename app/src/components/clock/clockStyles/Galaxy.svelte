<script lang="ts">
    import anime from "animejs";
    import time from "../../../stores/time";
    import { bgImageBright, screenSaver } from "../../../stores/globalState";
    import { cbDefault, eaElasticDefault } from "../../../utils/animations";
    import StyleBase from "./StyleBase.svelte";
    import { describeArc } from "../../../utils/utils";
    import type { Moment } from "moment";
    import moment from "moment";
    import { clockFormat } from "../../../stores/storedSettings";
    import { onMount } from "svelte";
    import IncomingEventsMessages from "../IncomingEventsMessages.svelte";

    let animationReady = false;
    let isHovered = false;
    let galaxyContainer: HTMLElement, galaxyHours: HTMLElement, galaxyMin: HTMLElement, galaxySec: HTMLElement;
    $: handleGalaxyClock($time);
    $: screenSaverMode($screenSaver);

    function handleGalaxyClock(time: Moment) {
        if (!galaxyHours) return;
        const hours = moment(time).hours();

        [
            {
                el: galaxyHours,
                value: hours - ($clockFormat === "12h" && hours > 12 ? 12 : 0),
                arc: describeArc(galaxyHours.clientWidth / 2, 0, parseInt(time.format("h")) * 30),
            },
            {
                el: galaxyMin,
                value: moment(time).minutes(),
                arc: describeArc(galaxyMin.clientWidth / 2, 0, parseInt(time.format("m")) * 6),
            },
            {
                el: galaxySec,
                value: moment(time).seconds(),
                arc: describeArc(galaxySec.clientWidth / 2, 0, parseInt(time.format("s")) * 6),
            },
        ].forEach((element) => {
            element.el.getElementsByTagName("path")[0].setAttribute("d", element.arc.d);
            element.el.querySelector(".galaxy-time-text").textContent = element.value.toString();
            element.el.querySelector(".galaxy-time").style.transform = `translate(${element.arc.x}px, ${element.arc.y}px)`;
        });
    }

    function screenSaverMode(screenSaver: boolean) {
        anime({
            targets: galaxyContainer,
            duration: 1500,
            easing: eaElasticDefault,
            scale: screenSaver ? 1.2 : 1,
        });
    }

    onMount(() => {
        handleGalaxyClock(moment());
        setTimeout(() => (animationReady = true), 750);
    });
</script>

<StyleBase styleId={4}>
    <div bind:this={galaxyContainer} id="galaxy-container" class={!$screenSaver ? "mb-36" : "mb-0"}>
        <div class="w-80 h-80 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 {$bgImageBright === 'light' ? 'bg-highlighted shadow-xl' : 'bg-galaxy'}" />
        <div class="w-1 h-1 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 {$bgImageBright === 'light' ? 'bg-primary' : 'bg-white'}" />

        <div id="galaxy-space" class="relative">
            <div id="galaxy-dot" />
            <div bind:this={galaxyHours} class="orbit-container w-96 h-96">
                <div class="galaxy-time z-10" class:gt-animated={animationReady}>
                    <span class="w-14 h-14 font-title galaxy-time-n bg-primary rounded-full text-3xl">
                        <span class="galaxy-time-text" />
                    </span>
                </div>
                <svg class="galaxy-orbit"><path d="" /></svg>
                <div class="{$screenSaver ? 'absolute' : 'hidden'} left-1/2 transform -translate-x-2/4 top-full">
                    <IncomingEventsMessages />
                </div>
            </div>
            <div bind:this={galaxyMin} class="orbit-container w-64 h-64">
                <div class="galaxy-time z-10" class:gt-animated={animationReady}>
                    <span class="w-8 h-8 font-title galaxy-time-n bg-primary rounded-full text-xl">
                        <span class="galaxy-time-text" />
                    </span>
                </div>
                <svg class="galaxy-orbit"><path d="" /></svg>
            </div>
            <div bind:this={galaxySec} class="orbit-container w-32 h-32">
                <div class="galaxy-time z-10" class:gt-animated={animationReady}>
                    <span class="w-7 h-7 font-title galaxy-time-n bg-primary rounded-full text-sm">
                        <span class="galaxy-time-text" />
                    </span>
                </div>
                <svg class="galaxy-orbit"><path d="" /></svg>
            </div>
        </div>
    </div>
</StyleBase>

<style>
    #galaxy-container {
        will-change: margin, transform;
        transition: margin 0.2s ease-out;
    }

    .bg-galaxy {
        background-color: rgb(35, 35, 35);
    }

    .orbit-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .galaxy-orbit {
        overflow: visible;
        z-index: 2;
    }

    .galaxy-orbit path {
        stroke: rgb(100, 100, 100);
        stroke-width: 2px;
        stroke-linejoin: round;
        fill: none;
        transition: stroke 0.2s linear;
    }

    .galaxy-orbit path:hover {
        stroke: rgb(255, 255, 255);
    }

    .galaxy-time-n {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        transform: translate(-50%, -50%);
    }

    .galaxy-time {
        display: inline-block;
        position: absolute;
        will-change: transform;
    }

    .galaxy-time.gt-animated {
        transition: transform 0.1s ease-out;
    }
</style>
