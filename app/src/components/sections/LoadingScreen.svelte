<script lang="ts">
import { documentReady, windowReady } from "html-ready";
import { onMount } from "svelte";
import { slide } from "svelte/transition";
import anime from "animejs";

    let isLoading = true;
    let bar = 5;
    let paddingTime = 750;

    onMount(async () => {
        await documentReady;
        bar = 50;
        await windowReady;
        bar = 100;
        
        setTimeout(() =>{
             isLoading = false
             anime({
                 targets: 'main',
                 opacity: [0.3, 1],
                 translateY: [30, 0],
                 duration: 750,
                 easing: 'easeOutQuad',
                 complete() {
                     document.querySelector('main').style.transform = null;
                 }
             });
        }, paddingTime);
    })
</script>

{#if isLoading}
    <div class="flex flex-col items-center justify-center text-primary w-full h-full fixed top-0 bg-tertiary rounded-b-2xl pointer-events-none" style="z-index: 999;" transition:slide>
        <img class="w-6/12 md:w-3/12 lg:w-2/12 mb-10 md:mb-20" src="/media/relaxing-clock-logo-transparent-smile.svg" alt="">
        <div class="w-52 md:w-60 h-1 rounded-full bg-secondary">
            <div class="h-full bg-white bg-opacity-80 rounded-full" style="width: {bar}%; transition: all {paddingTime / 1000}s ease-in-out;"></div>
        </div>
    </div>
{/if}