<script lang="ts">
import anime from "animejs";
import { tick } from "svelte";
import { cbDefault } from "../../utils/animations";
import { getRandomIntInclusive } from "../../utils/utils";

    export let text: string;

    let el: HTMLElement;
    let displayedText = '';
    let scrollTl: anime.AnimeTimelineInstance;

    $: {
        if (el && (text !== displayedText)) {
            if (scrollTl) scrollTl.pause();
            resetScrollPosition();

            anime({
                targets: el,
                duration: 250,
                easing: cbDefault,
                opacity: [1, 0],
                direction: 'alternate',
                loopComplete() { displayedText = text },
                async complete() {
                    await tick();
                    if (el && el.scrollWidth - 5 > el.clientWidth) scrollText(el);
                }
            });
        }
    }

    function resetScrollPosition() {
        el.style.transform = 'translateX(0px)';
    }

    function scrollText(el: HTMLElement) {
        if (el) {
            scrollTl = anime.timeline({
                targets: el,
                easing: cbDefault,
                loop: true,
                direction: 'alternate',
                autoplay: true,
                delay: getRandomIntInclusive(5000, 7000),
            })
                .add({
                    translateX: - (el.scrollWidth - el.clientWidth), 
                    duration: getRandomIntInclusive(13000, 16000),
                }, '+=50');
        }
    }
</script> 

<span bind:this={el} class="inline-block w-full">
    <span>
        { displayedText }
        <slot></slot>
    </span>
</span>