<script lang="ts">
    import { spring } from "svelte/motion";
    import { accentColor, activeStyle, clockFormat } from "../../stores/storedSettings";
    import { bgImageBright, mobileStatus, screenSaver, screenSize, styleChangeLock } from "../../stores/globalState";
    import styles from "../clock/clockStyles/styles";
    import { onMount } from "svelte";
    import { windowReady } from "html-ready";
    import anime from "animejs";
    import { cbDefault, eaElasticDefault } from "../../utils/animations";
    import { locSto } from "../../utils/utils";

    let bigClock: HTMLElement;
    const viewFinderClass: string = "w-44";
    const buttonClass: string = "text-primary outline-none c-format focus:outline-none cursor-pointer";
    const l: number = styles.length; //the number of available styles
    let lastStyleBeforeMobileApplied = null;

    let selectionPosition = spring(0, {
        stiffness: 0.07,
        damping: 0.3,
    });

    
    $: {
        changeStyle($activeStyle);
        if ($mobileStatus) {
            changeStyle(styles.find((s) => s.label === "Metropolis").id);
        }
    }

    function changeStyle(toStyle: number) {
        if (toStyle >= 0 && toStyle <= l - 1) {
            activeStyle.set(toStyle);
            selectionPosition.set(-(100 / l) * $activeStyle);
        } else {
            const overScroll = 3; //the amount pixels of the overscroll effect
            selectionPosition.set(toStyle > 0 ? -((100 / l) * (l - 1)) - overScroll : overScroll);

            setTimeout(() => {
                selectionPosition.set(toStyle > 0 ? -(100 / l) * (l - 1) : 0);
            }, 100);
        }
    }

    function moveLeft() {
        if (!$styleChangeLock && !$screenSaver) changeStyle($activeStyle - 1);
    }

    function moveRight() {
        if (!$styleChangeLock && !$screenSaver) changeStyle($activeStyle + 1);
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (document.activeElement === document.querySelector("body")) {
            if (e.code === "ArrowLeft") moveLeft();
            else if (e.code === "ArrowRight") moveRight();
        }
    }

    let wheelScrollTimeout,
        allowScroll = true;
    function handleBigClockScroll(e: WheelEvent) {
        if (!allowScroll) return;

        const thold = 100;
        const el = document.getElementById("move-" + (e.deltaX < 0 ? "left" : "right"));
        el.style.transform = `scale(${(Math.abs(e.deltaX) > thold ? thold : Math.abs(e.deltaX)) / (thold / 2) + 1})`;

        if (Math.abs(e.deltaX) > thold) {
            e.deltaX > 0 ? moveRight() : moveLeft();
            allowScroll = false;
            el.querySelector("i").style.color = $accentColor ?? `red`;
        }

        clearTimeout(wheelScrollTimeout);
        wheelScrollTimeout = setTimeout(() => {
            el.style.transform = `scale(1)`;
            el.querySelector("i").style.color = process.env.TEXT_PRIMARY;
            allowScroll = true;
        }, 150);
    }

    onMount(() => {
        windowReady.then(() => {
            bigClock = document.getElementById("big-clock");
            bigClock.addEventListener("wheel", handleBigClockScroll);
        });
    });
</script>

<svelte:window on:keydown={handleWindowKeydown} />
<div class="{$screenSaver ? '-z-1' : 'z-20'} absolute flex flex-col items-center overflow-visible top-2/4 mt-36 fade select-none {$screenSaver ? 'opacity-0' : 'opacity-1'}"
    class:bg-image-light={$bgImageBright.length}>
    <div class="font-primary text-xl text-primary">Select your clock style</div>
    <div class="relative flex overflow-hidden">
        <div class="flex flex-row z-10 absolute top-0 left-0 h-full w-full">
            <div class="h-full flex flex-row transform -translate-x-2/4 relative top-0 left-2/4">
                <button id="move-left" aria-label="move left" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="backward" on:click={moveLeft}>
                    <i class="fas fa-caret-left text-primary text-md opacity-{$activeStyle === 0 ? '20' : 1} fade" />
                </button>
                <span class="inline-block {viewFinderClass} opacity-0" />
                <button id="move-right" aria-label="move right" class="cursor-pointer outline-none border-none focus:outline-none w-4" data-direction="forward" on:click={moveRight}>
                    <i class="fas fa-caret-right text-primary text-md opacity-{$activeStyle === styles.length - 1 ? '20' : '1'} fade" />
                </button>
            </div>
        </div>
        <div class="relative left-2/4 whitespace-nowrap my-1" style="transform: translateX({$selectionPosition}%);">
            {#each styles as style, i}
                <span class="{viewFinderClass} text-center fade inline-block transform -translate-x-2/4 {i === $activeStyle ? 'opacity-1' : 'opacity-0'}" data-selection={i}>
                    <span class="inline-block text-bg bg-highlighted rounded-2xl font-primary text-xl px-2 py-0">{style.label}</span>
                </span>
            {/each}
        </div>
    </div>
    <div class="flex flex-row font-primary text-primary">
        <button aria-label="format 12 hours" class="{buttonClass} {$clockFormat === '12h' ? 'active-format' : ''} c-format" on:click={() => clockFormat.set("12h")}>12H</button>
        <div class="w-6" />
        <button aria-label="format 24 hours" class="{buttonClass} {$clockFormat === '24h' ? 'active-format' : ''} c-format" on:click={() => clockFormat.set("24h")}>24H</button>
    </div>
</div>

<style>
    .fade {
        transition: opacity 0.3s linear;
    }

    .c-format {
        border: 2px solid transparent;
        transition: all 0.2s linear;
        opacity: 0.5;
    }

    .active-format {
        opacity: 1;
        transform: scale(1.1);
        border-bottom: 2px solid white !important;
    }

    .bg-image-light {
        text-shadow: 0 0 20px var(--secondary);
    }
</style>