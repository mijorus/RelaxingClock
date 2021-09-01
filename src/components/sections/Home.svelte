<script lang="ts">
import { screenSaver } from '../../stores/globalState';
import screenSaverHandler from "../../handlers/screenSaver";
import Tips from '../tips/Tips.svelte';
import Clock from '../clock/Clock.svelte';
import FullScreenBtn from '../elements/FullScreenBtn.svelte';
import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";
import SpotifyBox from '../spotifyPlayer/SpotifyBox.svelte';
import WeatherWidget from './WeatherWidget.svelte';

    function disableScreenSaver() {
        screenSaverHandler.disable();
        screenSaverHandler.set(15 * 1000);
    }
</script>

<FullScreenBtn />
<div class="absolute left-2/4" style="transform: translateX(-50%);">
    <WeatherWidget />
</div>

<div class="h-full flex flex-col justify-center items-center animated transition duration-1000 ease-cb-default transform {$screenSaver ? 'translate-y-0' : '-translate-y-10'}"
    on:click={disableScreenSaver}
    on:mousemove={() => { if (!$screenSaver) disableScreenSaver}}>
    <Clock />
    <StyleSelectionBox />
</div>
<SpotifyBox />
<Tips />