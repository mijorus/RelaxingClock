<script lang="ts">
import anime from "animejs";
import { cbDefault } from "../../utils/animations";

    let el: HTMLElement;
    export let text: string;
    let displayedText = '';

    $: {
        anime({
            targets: el,
            duration: 250,
            easing: cbDefault,
            opacity: [1, 0],
            direction: 'alternate',
            loopComplete() { displayedText = text }
        });
    }
</script>

<span bind:this={el} style="letter-spacing: 0px;">
    { displayedText }
    <slot></slot>
</span>