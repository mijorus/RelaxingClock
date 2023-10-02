<script lang="ts">
    import { darkenClock, screenSaver } from "../../stores/globalState";
    import screenSaverHandler from "../../handlers/screenSaver";
    import Tips from "../tips/Tips.svelte";
    import Clock from "../clock/Clock.svelte";
    import FullScreenBtn from "../elements/FullScreenBtn.svelte";
    import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";
    import SpotifyBox from "../spotifyPlayer/SpotifyBox.svelte";
    import WeatherWidget from "./WeatherWidget.svelte";
    import Pinned from "./pinned/Pinned.svelte";
    import anime from "animejs";
    import { bigClockSSoffset, cbDefault } from "../../utils/animations";
    import FloatingBlobs from "./FloatingBlobs/FloatingBlobs.svelte";
    import IncomingEventsBox from "../clock/IncomingEventsBox.svelte";
    import Bubble from "../elements/Bubble.svelte";
    import { backgroundImage } from "../../stores/storedSettings";
    import SmoothImage from "../elements/SmoothImage.svelte";
    import HomeBackgroud from "../elements/HomeBackgroud.svelte";

    let bigClockContainer: HTMLElement;
    let incomingEventsBoxHovered = false;
    console.log('image', $backgroundImage);
    

    $: screenSaverApply($screenSaver);
    $: darken($darkenClock);

    function darken(obscure: boolean) {
        if (!bigClockContainer) return;
        anime({
            begin() {
                bigClockContainer.classList.add("pointer-events-none");
            },
            targets: bigClockContainer,
            duration: 500,
            opacity: obscure ? 0.5 : 1,
            easing: "easeOutQuad",
            update(a) {
                bigClockContainer.style.filter = `blur(${Math.round((obscure ? 0 : -3) + a.progress / 33)}px)`;
            },
            complete() {
                bigClockContainer.classList.remove("pointer-events-none");
            },
        });
    }

    function disableScreenSaver() {
        screenSaverHandler.disable();
        screenSaverHandler.set(15 * 1000);
    }

    function screenSaverApply(status: boolean) {
        anime({
            targets: document.getElementById("clock"),
            duration: 1000,
            translateY: status ? 0 : bigClockSSoffset,
            easing: cbDefault,
        });
    }
</script>

<FullScreenBtn />
<!-- <div class="absolute w-full top-0 left-0 hidden md:p-5 xl:pr-0 md:flex md:justify-end xl:justify-center" style="z-index: 1;">
    <span>
        <WeatherWidget />
    </span>
</div> -->

<div class="absolute top-0" style="z-index: -999;">
    <FloatingBlobs />
</div>

<div class="h-screen relative" class:home-bg-image={$backgroundImage !== 'none'}>
    {#if $backgroundImage !== 'none'}
        <SmoothImage classes="clock-bg-image absolute top-0 w-full h-full" src={$backgroundImage} />
        <!-- <HomeBackgroud cssClasses="absolute top-0 w-full h-full"></HomeBackgroud> -->
    {/if}

    <div
        id="clock"
        bind:this={bigClockContainer}
        class="h-full flex flex-col justify-center items-center"
        style="transform: translateY({bigClockSSoffset});"
        on:click={disableScreenSaver}
        on:mousemove={() => {
            if (!$screenSaver) disableScreenSaver;
        }}
        on:wheel={() => {
            if (!$screenSaver) disableScreenSaver;
        }}
    >
        <Clock />
        <StyleSelectionBox />
    </div>

    <SpotifyBox />

    <div class="hidden md:flex justify-center absolute bottom-5 left-1/2 transform -translate-x-1/2 lg:scale-125">
        <Bubble>
            <div>
                <IncomingEventsBox />
            </div>
        </Bubble>
    </div>

    <Tips />

    <div class="absolute top-0 left-0" style="z-index: 2;">
        <Pinned />
    </div>
</div>

<style global>
    .clock-bg-image {
        /* background-size: cover;
        background-repeat: no-repeat;
        box-shadow: 0px -40px 35px var(--primary) inset; */
        border-radius: 0 0 25px 5px;
        z-index: -99;
    }

    .home-bg-image {
        border-radius: 0 0 25px 5px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 70%, var(--primary) 100%);
    }
</style>
