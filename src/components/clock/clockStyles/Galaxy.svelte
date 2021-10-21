<script lang="ts">
import time from '../../../stores/time';
import { documentReady, windowReady } from 'html-ready';
import StyleBase from './StyleBase.svelte';
import { blink } from '../../../stores/storedSettings';
import { describeArc } from '../../../utils/utils';
import type { Moment } from 'moment';
import { onMount, tick } from 'svelte';
    anime({
                targets: element.el.getElementsByTagName('path')[0],
                duration: 600,
                easing:
                d: [
                    { value : element.arc.d}
                ]
            })
    let isReady = false;
    let container: HTMLElement;
    let galaxyHours:HTMLElement, galaxyMin:HTMLElement, galaxySec:HTMLElement; 
    $: handleGalaxyClock($time);

    var oldMin, oldHour;
    function handleGalaxyClock(time: Moment) {
        if (!isReady || !galaxyHours) return;

        [
            {
                el: galaxyHours,
                arc: describeArc(galaxyHours.clientWidth / 2, 0, (parseInt(time.format('h') ) * 30)),
            },
            {
                el: galaxyMin,
                arc: describeArc(galaxyMin.clientWidth / 2, 0, (parseInt(time.format('m')) * 6)),
            },
            {
                el: galaxySec,
                arc: describeArc(galaxySec.clientWidth / 2, 0, (parseInt(time.format('s')) * 6)),
            }
        ].forEach((element) => {
            element.el.getElementsByTagName('path')[0].setAttribute('d', element.arc.d);
        });
    }

    onMount(async () => {
        await windowReady;
        await tick();
        isReady = true;
    })
</script>

<StyleBase styleId={4}>
    <div id="galaxy-container" class="galaxy-margin toscreensave" style="transform: translateY(-1.5rem);">
        <div id="galaxy-dot" class="absolute top-1/2 w-1 h-1 bg-highlighted rounded-full" style="transform: translate(-50%, -50%)"></div>
        <div bind:this={galaxyHours} class="absolute top-1/2 w-72 h-72" style="transform: translate(-50%, -50%)">
            <div id="galaxy-h-n" class="galaxy-time">
                <span class="galaxy-time-n"></span>
            </div>
            <svg id="galaxy-h-path" class="galaxy-orbit">
                <path d="" />
            </svg>
        </div>
        <div bind:this={galaxyMin} class="absolute top-1/2 w-48 h-48" style="transform: translate(-50%, -50%)">
            <div id="galaxy-m-n" class="galaxy-time">
                <span class="galaxy-time-n"></span>
            </div>
            <svg id="galaxy-m-path" class="galaxy-orbit">
                <path d="" />
            </svg>
        </div>
        <div bind:this={galaxySec} class="absolute top-1/2 w-24 h-24" style="transform: translate(-50%, -50%)">
            <div id="galaxy-s-n" class="galaxy-time">
                <span class="galaxy-time-n"></span>
            </div>
            <svg id="galaxy-s-path" class="galaxy-orbit">
                <path d="" />
            </svg>
        </div>
    </div>
</StyleBase>

<style>
    .galaxy-orbit {
        overflow: visible;
        z-index: 2;
    }

    .galaxy-orbit path {
        stroke: white;
        stroke-width: 3px;
        stroke-linecap: round;
        fill: none;
    }
</style>