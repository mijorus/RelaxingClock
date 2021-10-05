<script lang="ts">
import anime from 'animejs';
import { visibleStylesId } from '../../../stores/clockStyle';
import time from '../../../stores/time';
import { screenSaver } from '../../../stores/globalState'
import { cbDefault, eaElasticDefault } from '../../../utils/animations';
import { cities } from '../../../handlers/citiesBg';
import { windowReady } from 'html-ready';
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import StyleBase from './StyleBase.svelte';
import { blink } from '../../../stores/storedSettings';
    
    let container: HTMLElement;
    const zoomedOut = 0.8;
    const shiftedUp = '-25%';
    $: toggleScreenSaver($screenSaver);

    async function toggleScreenSaver(enabled: boolean) {
        await windowReady;
        anime({
            targets: container,
            easing: eaElasticDefault,
            duration: 1200,
            scale: enabled ? 1 : zoomedOut,
            translateY: enabled ? 0 : shiftedUp
        });
    }
</script>

<StyleBase styleId={3}>
        <div bind:this={container} class="flex flex-col" style="transform: scale({zoomedOut * 100}%) translateY({shiftedUp});">
            <Hours />
            <div class="font-clock text-primary text-giant-1 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4">
                {#if (($time.second() % 2) && $blink)}&middot{:else}&nbsp;{/if}
            </div>
            <Minutes />
        </div>
</StyleBase>