<script lang="ts">
import { darkenClock, screenSaver } from '../../stores/globalState';
import screenSaverHandler from "../../handlers/screenSaver";
import Tips from '../tips/Tips.svelte';
import Clock from '../clock/Clock.svelte';
import FullScreenBtn from '../elements/FullScreenBtn.svelte';
import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";
import SpotifyBox from '../spotifyPlayer/SpotifyBox.svelte';
import WeatherWidget from './WeatherWidget.svelte';
import Pinned from './pinned/Pinned.svelte';
import anime from "animejs";
import { bigClockSSoffset, cbDefault } from '../../utils/animations';
import FloatingBlobs from './FloatingBlobs/FloatingBlobs.svelte';

    let bigClockContainer: HTMLElement;

    $: screenSaverApply($screenSaver);
    $: darken($darkenClock);

    function darken(obscure: boolean) {
       if (!bigClockContainer) return;
       anime({
            begin() { bigClockContainer.classList.add('pointer-events-none') },
            targets: bigClockContainer,
            duration: 500,
            opacity: obscure ? 0.5 : 1,
            easing: 'easeOutQuad',
            complete() { bigClockContainer.classList.remove('pointer-events-none') },
        });
    }

    function disableScreenSaver() {
        screenSaverHandler.disable();
        screenSaverHandler.set(15 * 1000);
    }

    function screenSaverApply(status: boolean) {
         anime({
            targets: document.getElementById('big-clock-container'),
            duration: 1000,
            translateY: status ? 0 : bigClockSSoffset,
            easing: cbDefault,
        });
    }
</script>

<FullScreenBtn />
<div class="absolute left-2/4" style="transform: translateX(-50%); z-index: 1;">
    <WeatherWidget />
</div>

<div class="absolute top-0">
    <FloatingBlobs />
</div>

<div id="big-clock-container" bind:this={bigClockContainer} class="h-full flex flex-col justify-center items-center"
    style="transform: translateY({bigClockSSoffset});"
    on:click={disableScreenSaver}
    on:mousemove={() => { if (!$screenSaver) disableScreenSaver}}
    on:wheel={() => { if (!$screenSaver) disableScreenSaver}}>
    <Clock />
    <StyleSelectionBox />
</div>
<SpotifyBox />
<Tips />

<div class="absolute top-0 left-0">
    <Pinned />
</div>