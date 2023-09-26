<script lang="ts">
    import time from "../../stores/time";
    import { accentColor, clockFormat } from "../../stores/storedSettings";
    import type { Moment } from "moment";
    import anime from "animejs";
    import randomcolor from "randomcolor";
    import { onMount, tick } from "svelte";
    import { customColors, locSto, randomCustomColor } from "../../utils/utils";
    import { fade } from "svelte/transition";
    import { colorSelector, darkenClock, bgImageBrigth } from "../../stores/globalState";
    import { handleMouseEnterCommon, handleMouseLeaveCommon } from "./clockStyles/common";

    $: setHours($time, $clockFormat);
    $: changeColor($accentColor);

    export let interactive = true;
    let hours: HTMLElement;
    let color: string;
    let textShadow: string;

    // change clock format
    let oldFormat: string;
    function setHours(time: Moment, clockFormat) {
        if (clockFormat && hours && oldFormat && oldFormat !== clockFormat) {
            anime({
                targets: hours,
                duration: 500,
                rotateX: [0, 360],
                complete() {
                    time.format(clockFormat === "24h" ? "HH" : "hh");
                },
            });
        }

        oldFormat = clockFormat;
    }

    // change hours size
    let tl: anime.AnimeInstance;
    function scaleUp(up: boolean, animation = true) {
        tl = anime({
            begin() {
                hours.classList.add("scaling");
            },
            targets: hours,
            duration: animation ? 500 : 0,
            scale: !up ? 1 : [1, 1.3, 1.2],
            rotate: [5, -5, 5, -5, 5, -5, 5, -5, 0],
            easing: "easeOutElastic",
            complete() {
                if (!up) {
                    locSto("hours", "default");
                    hours.classList.remove("font-extrabold");
                } else {
                    locSto("hours", "scaled");
                    hours.classList.add("font-extrabold");
                }
            },
        });
    }

    function changeColor(c = null) {
        color = c;
        textShadow = color !== "white" ? "2px 2px #fff" : null;
    }

    function handleClockMousedown(e) {
        if (tl) tl.pause();
        if ((!e || e.button == 0) && hours) {
            scaleUp(!(localStorage.getItem("hours") === "scaled"));
        }
    }

    function handleClockMouseUp(e) {
        if (e.button !== 0 || !hours) return;
        if (tl) tl.pause();

        let animation: any = {
            targets: hours,
            duration: 200,
            rotate: 0,
            easing: "easeOutElastic",
            complete() {
                hours.classList.remove("scaling");
            },
        };

        if (!(localStorage.getItem("hours") === "scaled")) animation.scale = 1;
        tl = anime(animation);
    }

    function handleClockCM(e: MouseEvent) {
        colorSelector.set({
            show: true,
            x: e.pageX,
            y: e.pageY,
            colors: [...customColors, "white"],
            callback(c) {
                if (c) accentColor.set(c);
            },
        });
    }

    function handleMouseEnter(e) {
        handleMouseEnterCommon(e);
        if (!$colorSelector || !$colorSelector.show) anime({ targets: hours, duration: 250, rotate: [0, -5, 5, 0], easing: "linear" });
    }

    onMount(async () => {
        await tick();

        if (!$accentColor || locSto("hours") === "scaled") scaleUp(true, false);
        $accentColor ? changeColor($accentColor) : changeColor(randomCustomColor());
    });
</script>

{#if interactive}
    <span
        bind:this={hours}
        class="hours inline-block z-10 relative"
        on:mouseenter={handleMouseEnter}
        on:mousedown={handleClockMousedown}
        on:mouseup={handleClockMouseUp}
        on:mouseleave={handleMouseLeaveCommon}
        on:contextmenu|preventDefault={handleClockCM}
        class:pointer-events-none={$bgImageBrigth.length}
        style="transition: color .05s linear; color: {$bgImageBrigth.length ? null : color}; text-shadow: {$bgImageBrigth.length ? null : textShadow}"
    >
        {$time.format($clockFormat === "24h" ? "HH" : "hh")}
    </span>
{:else}
    <span bind:this={hours} class="inline-block" style="transition: color .05s linear; ">
        {$time.format($clockFormat === "24h" ? "HH" : "hh")}
    </span>
{/if}

