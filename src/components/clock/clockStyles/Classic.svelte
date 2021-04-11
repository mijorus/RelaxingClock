<script lang="ts">
    import { windowReady } from 'html-ready';
    import { onMount } from 'svelte';


    function getWidth(el:HTMLElement): number {
        return el.getBoundingClientRect().width
    }

    function compute() {
        const hours: HTMLElement = document.getElementById('hours-box');
        const min: HTMLElement = document.getElementById('minutes-box');
        const sec: HTMLElement = document.getElementById('seconds-box');
        const minDiv: HTMLElement = document.getElementById('minutes-divisor');

        
        [hours, min, sec].forEach((el) => {
            el.classList.add('left-1/2', 'top-1/2', 'opacity-1');
            el.classList.remove('opacity-0');
        });

        const divSize: number = getWidth(minDiv);
        const elSize: number = getWidth(min);

        min.style.transform = `translate(${-(elSize - divSize)}px, -50%)`;
        hours.style.transform = `translate(${-(elSize + getWidth(hours) - divSize)}px, -50%)`;
        sec.style.transform = `translate(${(divSize)}px, -50%)`;
    }

    async function load() {
        await windowReady;
        compute();
    }

    onMount(() => load());
</script>