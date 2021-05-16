<script lang="ts">
    import anime from 'animejs';
    import { onDestroy, onMount } from 'svelte';
    import { bigClockUpdate, blink, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import time from '../../../stores/time';
    import { screenSaver } from '../../../stores/globalState'
    import { cbDefault, eaElasticDefault } from '../../../utils/animations';
    import { getHeight, getWidth } from '../../../utils/getBoundingClientRect';
    import { cities } from '../../../handlers/citiesBg';
    import { clockTransition } from '../../../handlers/clockTransitions';
    import { windowReady } from 'html-ready';
    
    let initialized: boolean = false;

    let middot: HTMLElement;
    const zoomedOut = 0.7;
    
    $: compute($bigClockUpdate);
    $: toggleScreenSaver($screenSaver);

    function getVerticalShift() {
        return (- (getHeight($minutesBox.el) / 2));
    }

    function toggleScreenSaver(enabled: boolean) {
        if (initialized) {
            anime({
                targets: '#big-clock',
                easing: eaElasticDefault,
                scale: enabled ? 1 : zoomedOut,
                translateY: enabled ? 0 : getVerticalShift()
            });
        }
    }

    async function animate(forward: boolean) {
        await windowReady;
        
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
                targets: '#big-clock',
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

    async function setBackground(source?: string) {
        await windowReady;
        
        const mainBg: HTMLElement = document.getElementById('main-bg');
        const bgClasses: Array<string> = ['opacity-0', 'bg-bottom', 'bg-no-repeat'];
        const mainBgAnimProp = { targets: mainBg, duration: 350, easing: cbDefault };

        if (source) {
            mainBg.classList.add(...bgClasses);
            mainBg.style.backgroundImage = `url(${source})`;
            anime({ ...mainBgAnimProp, opacity: 0.1 });
        } else {
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
    }

    onMount(() => {
        [minutesBox, hoursBox].forEach(box => box.update(el => ({...el, visible: true})));
        if (process.env.CITIES_LANDSCAPES_SOURCE) setBackground(`${process.env.CITIES_LANDSCAPES_SOURCE}${cities[0].imageURL}`);        
    });

    onDestroy(() => {
        animate(false);
        if (process.env.CITIES_LANDSCAPES_SOURCE) setBackground(null);
    });
</script>

<div bind:this={middot} class="font-clock text-primary text-giant-1 absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4">
    {#if (($time.second() % 2) && $blink)}&middot{:else}&nbsp;{/if}
</div>