<script lang="ts">
    import anime from 'animejs';
    import { onDestroy, onMount } from 'svelte';
    import { bigClockUpdate, blink, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import time from '../../../stores/time';
    import { screenSaver, styleChangeLock } from '../../../stores/globalState'
    import { cbDefault, eaElasticDefault } from '../../../utils/animations';
    import { getHeight, getWidth } from '../../../utils/getBoundingClientRect';
    import { cities } from '../../../handlers/citiesBg';
    import { clockTransition } from '../../../handlers/clockTransitions';
    
    let initialized: boolean = false;

    let middot: HTMLElement;
    const zoomedOut: number = 0.7;
    const bgClasses: Array<string> = ['opacity-0', 'bg-bottom', 'bg-no-repeat', ];
    const bigClock: HTMLElement = document.getElementById('big-clock');
    const mainBg: HTMLElement = document.getElementById('main-bg');
    const mainBgAnimProp = {
        targets: mainBg,
        duration: 350,
        easing: cbDefault,
    };

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
        const transition = anime.timeline({
            autoplay: false,
            complete() {
                if (forward) {
                    initialized = true;
                    secondsBox.update(el => ({...el, visible: false}));
                } else {
                    bigClockUpdate.set($time.unix());
                }
            },
        })
            .add({
                targets: bigClock,
                duration: 800,
                scale: forward ? zoomedOut : 1,
                easing: eaElasticDefault,
                translateY: forward ? getVerticalShift() : 0,
            }, 0)
            .add({
                duration: 250,
                targets: [$secondsBox.el, '#minutes-divisor'],
                opacity: forward ? 0 : 1,
                easing: cbDefault,
            }, forward ? 0 : '-=250');

        clockTransition(transition);
    }

    async function compute(timestamp: number) {
        if (timestamp > 0) {
            const divSize: number = getWidth(document.getElementById('minutes-divisor'));

            hoursBox.update(el => ({...el, x: '-50%', y: '-105%', visible: true}));
            minutesBox.update(el => ({...el, x: `${-((getWidth($minutesBox.el) / 2) + (divSize / 2))}px`, y: '-5%', visible: true}));

            if (!initialized) animate(true);
        }
    }

    onMount(() => {
        minutesBox.update(el => ({...el, visible: true}));
        hoursBox.update(el => ({...el, visible: true}));
        secondsBox.update(el => ({...el, visible: false}));
        if (process.env.CITIES_LANDSCAPES_SOURCE) {
            mainBg.classList.add(...bgClasses);
            mainBg.style.backgroundImage = `url(${process.env.CITIES_LANDSCAPES_SOURCE}${cities[0].imageURL})`;
            anime({ ...mainBgAnimProp, opacity: 0.1 });
        }
    });

    onDestroy(() => {
        animate(false);
        if (process.env.CITIES_LANDSCAPES_SOURCE) {
            anime({
                ...mainBgAnimProp,
                opacity: 0,
                complete() {
                    mainBg.classList.remove(...bgClasses);
                    mainBg.style.backgroundImage = null;
                    mainBg.style.opacity = null;
                }
            });
        }
    });
</script>

<div bind:this={middot} class="font-clock text-primary text-giant-1 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4">
    {#if (($time.second() % 2) && $blink)}&middot{:else}&nbsp;{/if}
</div>