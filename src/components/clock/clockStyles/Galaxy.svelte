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
import moment from 'moment';
    
    let galaxyHours:HTMLElement, galaxyMin:HTMLElement, galaxySec:HTMLElement; 
    $: handleGalaxyClock($time);

    var oldMin, oldHour;
    function handleGalaxyClock(time: Moment) {
        if (!galaxyHours) return;

        [
            {
                el: galaxyHours,
                value: moment(time).hours(),
                arc: describeArc(galaxyHours.clientWidth / 2, 0, (parseInt(time.format('h') ) * 30)),
            },
            {
                el: galaxyMin,
                value: moment(time).minutes(),
                arc: describeArc(galaxyMin.clientWidth / 2, 0, (parseInt(time.format('m')) * 6)),
            },
            {
                el: galaxySec,
                value: moment(time).seconds(),
                arc: describeArc(galaxySec.clientWidth / 2, 0, (parseInt(time.format('s')) * 6)),
            }
        ].forEach((element) => {
            element.el.getElementsByTagName('path')[0].setAttribute('d', element.arc.d);
            element.el.querySelector('.galaxy-time-text').textContent = element.value.toString();
            element.el.querySelector('.galaxy-time').style.transform = `translate(${element.arc.x}px, ${element.arc.y}px)`;
        })
    }

</script>

<StyleBase styleId={4}>
    <div id="galaxy-container" class="{!$screenSaver ? 'mb-10' : 'mb-0'}">
        <div id="galaxy-space" class="relative">
            <div id="galaxy-dot"></div>
            <div bind:this={galaxyHours} class="orbit-container w-72 h-72">
                <div class="galaxy-time z-10">
                    <span class="w-7 h-7 font-title galaxy-time-n bg-primary rounded-full text-xl">
                        <span class="galaxy-time-text"></span>
                    </span>
                </div>
                <svg class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
            <div bind:this={galaxyMin} class="orbit-container w-48 h-48">
                <div class="galaxy-time z-10">
                    <span class="w-6 h-6 font-title galaxy-time-n bg-primary rounded-full text-base">
                        <span class="galaxy-time-text"></span>
                    </span>
                </div>
                <svg class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
            <div bind:this={galaxySec} class="orbit-container w-24 h-24">
                <div class="galaxy-time z-10">
                    <span class="w-5 h-5 font-title galaxy-time-n bg-primary rounded-full text-sm">
                        <span class="galaxy-time-text"></span>
                    </span>
                </div>
                <svg class="galaxy-orbit">
                    <path d="" />
                </svg>
            </div>
        </div>
    </div>
</StyleBase>

<style>
    #galaxy-container {
        transition: margin .2s ease-out;
    }

    .orbit-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .galaxy-orbit {
        overflow: visible;
        z-index: 2;
    }

    .galaxy-orbit path {
        stroke: rgb(197, 197, 197);
        stroke-width: 2px;
        stroke-linejoin: round;
        fill: none;
    }

    .galaxy-time-n {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        transform: translate(-50%, -50%);
    }
    
    .galaxy-time {
        display: inline-block;
        position: absolute;
        transition: transform .1s ease-out;
    }
</style>