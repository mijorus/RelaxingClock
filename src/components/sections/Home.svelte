<script lang="ts">
    import { screenSaver } from '../../stores/globalState';
    import screenSaverHandler from "../../handlers/screenSaver";
    
    import Tips from '../tips/Tips.svelte';
    import Clock from '../clock/Clock.svelte';
    import FullScreenBtn from '../elements/FullScreenBtn.svelte';
    import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";
    import SpotifyBox from '../spotifyPlayer/SpotifyBox.svelte';
    import { spotifyPlayerStatus } from '../../stores/spotify';

    screenSaverHandler.set(7000);

    function disableScreenSaver() {
        screenSaverHandler.disable();
    }
</script>

<FullScreenBtn />

<div 
    class="h-full flex flex-col justify-center items-center animated transition duration-1000 ease-cb-default transform {$screenSaver ? 'translate-y-0' : '-translate-y-10'}"
    on:click="{disableScreenSaver}"
>
    <Clock />
    <StyleSelectionBox />
</div>
<!-- 
    {#if $spotifyPlayerStatus !== 'disconnected' || $spotifyPlayerStatus !== 'error' }
    <SpotifyBox />
    {/if} -->
<SpotifyBox />
<Tips />