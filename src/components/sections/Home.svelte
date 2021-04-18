<script lang="ts">
    import { screenSaver } from '../../stores/globalState';
    import screenSaverHandler from "../../handlers/screenSaver";

    import Clock from '../clock/Clock.svelte';
    import FullScreenBtn from '../elements/FullScreenBtn.svelte';
    import StyleSelectionBox from "../elements/StyleSelectionBox.svelte";

    screenSaverHandler.set(5000);

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