<script lang="ts" context="module">
    export const clockElementsClass: string = 'absolute animated left-1/2 top-1/2 clock-element';
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { windowReady } from 'html-ready';

    import time from '../../stores/time';
    import styles from "./clockStyles/styles";
    import { activeStyle } from "../../stores/storedSettings";
    import { bigClockUpdate } from "../../stores/clockStyle";

    import Classic from './clockStyles/Classic.svelte';
    import Focused from './clockStyles/Focused.svelte';
    import Metro from './clockStyles/Metro.svelte';
    import Analog from "./clockStyles/Analog.svelte";

    $: currentPosition = $activeStyle * (100 / styles.length)

    onMount(async () => {
        await windowReady;
        bigClockUpdate.set($time.unix());
    });
</script>

<div 
    id="big-clock" 
    class="flex flex-row items-center flex-nowrap font-clock text-primary text-giant-1 whitespace-nowrap w-auto h-full animated z-10 absolute top-0 left-0" 
    style="transform: translateX(-{currentPosition}%);"
>
    <Classic /><Focused /><Analog /><Metro />
</div>

<style>
    .animated {
        transition: transform .3s ease-out;
    }
</style>