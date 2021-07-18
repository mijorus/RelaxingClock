<script lang="ts">
import anime from "animejs";
import { cbDefault } from "../../utils/animations";

    export let text: string;

    let el: HTMLElement;
    let displayedText = '';
    let oldText: string;
    let scrollTl: anime.AnimeTimelineInstance;

    $: {
        if (el && (text !== displayedText)) {
            if (scrollTl) scrollTl = undefined;
            resetScrollPosition();

            anime({
                targets: el,
                duration: 250,
                easing: cbDefault,
                opacity: [1, 0],
                direction: 'alternate',
                loopComplete() { displayedText = text },
                complete() {
                    if (el.scrollWidth - 5 > el.clientWidth) scrollText(el);
                }
            });
        }
    }

    function resetScrollPosition() {
        el.style.transform = 'translateX(0)';
    }

    function scrollText(el: HTMLElement) {
        const duration = 15000;
        scrollTl = anime.timeline({
            targets: el,
            easing: cbDefault,
            loop: true,
            delay: 5000,
        })
            .add({
                translateX: - el.scrollWidth, duration,
                complete() { resetScrollPosition() }
            }, '+=50')
            .add({ translateX: [(el.clientWidth + 10), 0],duration });
    }
</script> 

<span bind:this={el} class="inline-block w-full">
    <span>
        { displayedText }
        <slot></slot>
    </span>
</span>