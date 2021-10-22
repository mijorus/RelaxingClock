<script lang="ts">
import anime from "animejs";
import { onDestroy, tick } from "svelte";
import { windowFocus } from "../../stores/globalState";
import { saveEnergy } from "../../stores/storedSettings";
import { cbDefault } from "../../utils/animations";
import { getRandomIntInclusive } from "../../utils/utils";

    export let text: string;
    export let fade = true;
    export let paused = false;
    
    let el: HTMLElement;
    let displayedText = '';
    let scrollTl = undefined;
    let fadeTextTl =  undefined;
    let loopCompleted = 0;

    let pauseScrollTimeout;

    $: pauseScroll(paused);
    $: $windowFocus ? pauseScroll(false) : null;

    $: {
        if (el && (text !== displayedText)) {
            el.style.transform = 'translateX(0px)';
            
            if (scrollTl) {
                scrollTl.pause();
                scrollTl = undefined;
            }
            
            if (fadeTextTl) {
                fadeTextTl.pause();
                fadeTextTl = undefined;
            }

            fadeTextTl = anime({
                targets: el,
                duration: fade ? 250 : 0,
                easing: cbDefault,
                opacity: fade ? [1, 0] : 1,
                direction: 'alternate',
                loopComplete() { displayedText = text },
                async complete() {
                    await tick();
                    if (el && el.scrollWidth - 5 > el.clientWidth) scrollText(el);
                }
            });
        }
    }

    function scrollText(textEl: HTMLElement) {
        scrollTl = anime.timeline({
            targets: textEl,
            easing: cbDefault,
            loop: true,
            direction: 'alternate',
            autoplay: true,
            delay: getRandomIntInclusive(5000, 7000),
            loopComplete: function(anim) {
                loopCompleted++;
                if ($saveEnergy && loopCompleted % 2 === 0) pauseScroll(true);
            }
        })
            .add({
                translateX: - (textEl.scrollWidth - textEl.clientWidth), 
                duration: getRandomIntInclusive(13000, 16000),
            }, '+=50');
    }

    function pauseScroll(paused: boolean) {
        if (!scrollTl) return;
        paused ? scrollTl.pause() : scrollTl.play();
    }

    onDestroy(() => {
        if (scrollTl && el) {
            scrollTl.pause();
            scrollTl.remove(el);
        }
    })
</script> 

<span bind:this={el} class="inline-block w-full" style="will-change: transform, opacity;">
    <span>
        { displayedText }
        <slot></slot>
    </span>
</span>