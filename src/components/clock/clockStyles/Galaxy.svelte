<script lang="ts">
import anime from 'animejs';
import { visibleStylesId } from '../../../stores/clockStyle';
import time from '../../../stores/time';
import { screenSaver } from '../../../stores/globalState'
import { cbDefault, eaElasticDefault } from '../../../utils/animations';
import { cities } from '../../../handlers/citiesBg';
import { documentReady, windowReady } from 'html-ready';
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import StyleBase from './StyleBase.svelte';
import { blink } from '../../../stores/storedSettings';
import { describeArc } from '../../../utils/utils';
import type { Moment } from 'moment';
import { onMount } from 'svelte';
    
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
            element.el.getElementsByTagName('path')[0].setAttribute('d', element.arc.d)
        })
    }

    onMount(async () => {
        // await windowReady;
        isReady = true;
    })
</script>

<StyleBase styleId={4}>
    <div id="galaxy-container" class="galaxy-margin toscreensave">
        <div id="galaxy-space">
            <div id="galaxy-dot"></div>
            <div bind:this={galaxyHours} class="orbit-container w-72 h-72">
                <div id="galaxy-h-n" class="galaxy-time">
                    <span class="galaxy-time-n"></span>
                </div>
                <svg id="galaxy-h-path" class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
            <div bind:this={galaxyMin} class="orbit-container w-56 h-56">
                <div id="galaxy-m-n" class="galaxy-time">
                    <span class="galaxy-time-n"></span>
                </div>
                <svg id="galaxy-m-path" class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
            <div bind:this={galaxySec} class="orbit-container w-24 h-24">
                <div id="galaxy-s-n" class="galaxy-time">
                    <span class="galaxy-time-n"></span>
                </div>
                <svg id="galaxy-s-path" class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
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
        stroke-width: 2px;
        fill: none;
    }
</style>