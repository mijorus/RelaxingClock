<script lang="ts">
import time from "../../stores/time";
import { clockFormat } from "../../stores/storedSettings";
import type { Moment } from "moment";
import anime from "animejs";
import randomcolor from 'randomcolor';
import { onMount, tick } from "svelte";
import { customColors, locSto, randomCustomColor } from "../../utils/utils";

    $: setHours($time, $clockFormat);
    export let interactive = true;
    let hours: HTMLElement;
    let color: string;
    let textShadow: string;

    // change clock format
    let oldFormat: string;
    function setHours(time: Moment, clockFormat) {
        if (clockFormat && hours && oldFormat && oldFormat !== clockFormat) {
            anime({
                targets: hours,
                duration: 500,
                rotateX: [0, 360],
                complete() {time.format(clockFormat === '24h' ? 'HH' : 'hh')}
            });
        }
        
        oldFormat = clockFormat;
    }

    // change hours size
    let tl: anime.AnimeInstance;
    function scaleUp(up: boolean, animation = true) {
        tl = anime({
            begin() { hours.classList.add('scaling') },
            targets: hours,
            duration: animation ? 500 : 0,
            scale: !up ? 1 : [1, 1.3, 1.2],
            rotate: [5, -5, 5, -5, 5, -5, 5, -5, 0],
            easing: 'easeOutElastic',
            complete() {
                if (!up) {
                    localStorage.removeItem('hours');
                    hours.classList.remove('font-extrabold');
                } else {
                    localStorage.setItem('hours', 'scaled');
                    hours.classList.add('font-extrabold');
                }
            }
        })
    }

    function changeColor(c = null, animation = true) {
        tl = anime({
            targets: hours,
            duration: animation ? 250 : 0,
            rotate: [5, -5, 5, -5, 0],
            easing: 'linear',
            complete() { 
                color = c;
                textShadow = color ? '2px 2px #fff' :  null;
                locSto('hoursColor', color || undefined);
            }
        })
    }

    function handleClockMousedown(e) {
        if (tl) tl.pause();
        if ((!e || e.button == 0) && hours) {
            scaleUp(!(localStorage.getItem('hours') === 'scaled'));
        }
    }

    function handleClockMouseUp(e) {
        if (e.button !== 0 || !hours) return;
        if (tl) tl.pause();

        let animation: any = {
            targets: hours,
            duration: 200,
            rotate: 0,
            easing: 'easeOutElastic',
            complete() { hours.classList.remove('scaling') }
        };

        if (!(localStorage.getItem('hours') === 'scaled')) animation.scale = 1;
        tl = anime(animation)
    }

    let c = 0; let d = 0;
    function handleClockCM(e) {
        if (c % 10 === 0)  changeColor(null);
        else {
            changeColor(customColors[d]);
            d = (d === (customColors.length - 1)) ? 0 : d + 1;
        }

        c = c + 1;
    }

    onMount(async() => {
        await tick();
        if (locSto('hours') === 'scaled') scaleUp(true, false);
        if (locSto('hoursColor')) changeColor(locSto('hoursColor'), false);
    })
</script>

{#if interactive}
    <span bind:this={hours} class="inline-block"
        on:mouseenter={() => anime({targets: hours, duration: 250, rotate: [0, -5, 5, 0], easing: 'linear' })} 
        on:mousedown={handleClockMousedown} 
        on:mouseup={handleClockMouseUp} 
        on:contextmenu|preventDefault={handleClockCM} 
        style="transition: color .05s linear; color: {color}; text-shadow: {textShadow}">
        { $time.format($clockFormat === '24h' ? 'HH' : 'hh') }
    </span>
    {:else}
    <span bind:this={hours} class="inline-block" style="transition: color .05s linear; ">
        { $time.format($clockFormat === '24h' ? 'HH' : 'hh') }
    </span>
{/if}