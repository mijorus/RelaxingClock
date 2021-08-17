<script lang="ts">
import time from "../../stores/time";
import { clockFormat } from "../../stores/storedSettings";
import type { Moment } from "moment";
import anime from "animejs";
import randomcolor from 'randomcolor';

    $: setHours($time, $clockFormat);

    let oldFormat: string;
    function setHours(time: Moment, clockFormat) {
        if (oldFormat && oldFormat !== clockFormat) {
            anime({
                targets: '#hours',
                duration: 500,
                rotateX: [0, 360],
                complete() {time.format(clockFormat === '24h' ? 'HH' : 'hh')}
            })
        }
        
        oldFormat = clockFormat;
    }

    let tl;
    function handleClockMousedown(e) {
        if (e.button !== 0) return;

        if (tl) tl.pause();
        tl = anime({
            targets: '#hours',
            duration: 500,
            scale: document.querySelector('#hours').classList.contains('scaling') ? 1 : [1, 1.3, 1.2],
            rotate: [5, -5, 5, -5, 5, -5, 5, -5, 0],
            easing: 'easeOutElastic',
            complete() {
                document.querySelector('#hours').classList.contains('scaling') 
                    ? document.querySelector('#hours').classList.remove('font-extrabold', 'scaling')
                    : document.querySelector('#hours').classList.add('font-extrabold', 'scaling');
            }
        })
    }

    function handleClockMouseUp(e) {
        if (e.button !== 0) return;

        if (tl) tl.pause();

        let animation: any = {
            targets: '#hours',
            duration: 200,
            rotate: 0,
            easing: 'easeOutElastic',
            complete() {
                document.querySelector('#hours').classList.remove('scaling')
            }
        };

        if (!document.querySelector('#hours').classList.contains('scaling')) animation.scale = 1;
        tl = anime(animation)
    }

    function handleClockCM(e) {
        e.preventDefault();

        tl = anime({
            targets: '#hours',
            duration: 250,
            rotate: [5, -5, 5, -5, 0],
            easing: 'linear',
            complete() {
                document.getElementById('hours').style.color = randomcolor({ luminosity: 'bright' });
            }
        })
    }
</script>

<span id="hours" on:mousedown={handleClockMousedown} on:mouseup={handleClockMouseUp} on:contextmenu={handleClockCM}>
    { $time.format($clockFormat === '24h' ? 'HH' : 'hh') }
</span>