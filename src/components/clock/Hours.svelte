<script lang="ts">
import time from "../../stores/time";
import { clockFormat } from "../../stores/storedSettings";
import type { Moment } from "moment";
import anime from "animejs";
import randomcolor from 'randomcolor';
import { onMount, tick } from "svelte";
import tinycolor from "tinycolor2";

    $: setHours($time, $clockFormat);
    export let interactive = true;
    let hours: HTMLElement;

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

    // set the color of the hours number
    function changeColor(color = null, animation = true) {
        tl = anime({
            targets: hours,
            duration: animation ? 250 : 0,
            rotate: [5, -5, 5, -5, 0],
            easing: 'linear',
            complete() { 
                hours.style.color = color;
                hours.style.background = color 
                    ? `linear-gradient(150deg, ${tinycolor(color).brighten(5).toString()}, ${tinycolor(color).darken(10).toString()}` 
                    : process.env.TEXT_PRIMARY;

                if (color) localStorage.setItem('hoursColor', color) 
                else localStorage.removeItem('hoursColor') 
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

    let c = 0;
    function handleClockCM(e) {
        e.preventDefault();
        changeColor(c > 10 ? null : randomcolor({ luminosity: (c % 2 === 0) ? 'light' : 'bright', hue: 'random', format: 'hex' }));
        c > 10 ? c = 0 : c++;
    }

    onMount(async() => {
        await tick();
        if (localStorage.getItem('hours') === 'scaled') scaleUp(true, false);
        if (localStorage.getItem('hoursColor')) changeColor(localStorage.getItem('hoursColor'), false);
    })
</script>

{#if interactive}
    <span bind:this={hours} class="inline-block hours-bg"
        on:mouseenter={() => anime({targets: hours, duration: 250, rotate: [0, -5, 5, 0], easing: 'linear' })} 
        on:mousedown={handleClockMousedown} 
        on:mouseup={handleClockMouseUp} 
        on:contextmenu={handleClockCM} style="transition: color .05s linear;">
        { $time.format($clockFormat === '24h' ? 'HH' : 'hh') }
    </span>
    {:else}
    <span bind:this={hours} class="inline-block hours-bg" style="transition: color .05s linear;">
        { $time.format($clockFormat === '24h' ? 'HH' : 'hh') }
    </span>
{/if}

<style>
    .hours-bg {
        background-clip: text;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
    }
</style>