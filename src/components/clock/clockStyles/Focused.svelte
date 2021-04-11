<script lang="ts">
    import { windowReady } from 'html-ready';
    import { onMount } from 'svelte';


    function getWidth(el:HTMLElement): number {
        return el.getBoundingClientRect().width
    }

    function compute() {
        const hours: HTMLElement = document.getElementById('hours-box');
        const min: HTMLElement = document.getElementById('minutes-box');
        const minDiv: HTMLElement = document.getElementById('minutes-divisor');
        
        [hours, min].forEach((el) => el.classList.add('left-1/2', 'top-1/2'));
        document.getElementById('seconds-box').classList.add('opacity-0');
        
        const divSize: number = getWidth(minDiv);

        min.style.transform = `translate(${-(divSize / 2)}px, -50%)`;
        hours.style.transform = `translate(${-(getWidth(hours) + (divSize / 2 ))}px, -50%)`;
    }

    async function load() {
        await windowReady;
        compute();
    }

    onMount(() => load());
</script>