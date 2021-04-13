

<script lang="ts">
    import { onMount } from 'svelte';
    import { getClockElements } from '../Clock.svelte';


    function getWidth(el:HTMLElement): number {
        return el.getBoundingClientRect().width
    }

    async function compute() {
        const { hours, min, sec } = await getClockElements();
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
        // await windowReady;
        compute();
    }

    onMount(() => load());
</script>