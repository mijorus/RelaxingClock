<script lang="ts">
    import anime from 'animejs';
    import { onDestroy } from 'svelte';
    import { bigClockUpdate, blink, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import time from '../../../stores/time';
    import { screenSaver } from '../../../stores/globalState'
    import { cbDefault, eaElasticDefault } from '../../../utils/animations';
    import { getHeight, getWidth } from '../../../utils/getBoundingClientRect';
    
    let initialized: boolean = false;

    let middot: HTMLElement;
    const zoomedOut: number = 0.7;
    const bigClock: HTMLElement = document.getElementById('big-clock');

    $: compute($bigClockUpdate);
    $: toggleScreenSaver($screenSaver);

    function getVerticalShift() {
        return (- (getHeight($minutesBox.el) / 2));
    }

    function toggleScreenSaver(enabled: boolean) {
        if (initialized) {
            anime({
                targets: bigClock,
                easing: eaElasticDefault,
                scale: enabled ? 1 : zoomedOut,
                translateY: enabled ? 0 : getVerticalShift()
            });
        }
    }

    function animate(forward: boolean) {
        return anime.timeline({
            begin() { 
                if (!forward) secondsBox.update(el => ({...el, visible: true})); 
            },
            duration: 200,
            easing: cbDefault,
            complete() { 
                if (forward) {
                    initialized = true;
                    secondsBox.update(el => ({...el, visible: false})) 
                } else {
                    bigClockUpdate.set($time.unix());
                }
            },
        })
            .add({
                targets: '#big-clock',
                scale: forward ? zoomedOut : 1,
                easing: eaElasticDefault,
                translateY: forward ? getVerticalShift() : 0,
            }, 0)
            .add({
                targets: [$secondsBox.el, '#minutes-divisor'],
                opacity: forward ? 0 : 1,
            }, forward ? 0 : '+=1');
    }

    function compute(timestamp: number) {
        if (timestamp > 0) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: '-50%', y: '-105%'}));
            minutesBox.update(el => ({...el, x: `${-((getWidth($minutesBox.el) / 2) + (divSize / 2))}px`, y: '-5%'}));

            animate(true);
        }
    }

    onDestroy(() => animate(false));
</script>

<div bind:this={middot} class="font-clock text-primary text-giant-1 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4">
    {#if (($time.second() % 2) && $blink)}&middot{:else}&nbsp;{/if}
</div>

<div class="w-full h-full absolute top-0 left-0">

</div>