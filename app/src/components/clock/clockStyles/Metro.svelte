<script lang="ts">
    import anime from "animejs";
    import time from "../../../stores/time";
    import { bgImageBright as bgImageBright, screenSaver } from "../../../stores/globalState";
    import { cbDefault, eaElasticDefault } from "../../../utils/animations";
    import Hours from "../Hours.svelte";
    import Minutes from "../Minutes.svelte";
    import StyleBase from "./StyleBase.svelte";
    import { blink } from "../../../stores/storedSettings";
    import IncomingEventsMessages from "../IncomingEventsMessages.svelte";
    import { clockStyleClass } from "../../../stores/storedSettings";

    let container: HTMLElement;
    const zoomedOut = 0.7;
    let isHovered = false;
    const shiftedUp = "-20%";
    $: toggleScreenSaver($screenSaver);

    async function toggleScreenSaver(enabled: boolean) {
        // await windowReady;
        anime({
            targets: container,
            easing: eaElasticDefault,
            duration: 1200,
            scale: enabled ? 1 : zoomedOut,
            translateY: enabled ? 0 : shiftedUp,
        });
    }
</script>

<StyleBase styleId={3}>
    <div bind:this={container} class="flex flex-col" class:common-clock-background-image={$bgImageBright.length} style="transform: scale({zoomedOut * 100}%) translateY({shiftedUp});">
        <Hours />
        <div class="{$clockStyleClass} text-primary text-giant-1 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4">
            {#if $time.second() % 2 && $blink}&middot{:else}&nbsp;{/if}
        </div>
        <Minutes />
        <div class="{$screenSaver ? 'absolute' : 'hidden'} left-1/2 transform -translate-x-2/4 top-full">
            <IncomingEventsMessages />
        </div>
    </div>
</StyleBase>