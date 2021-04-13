<script lang="ts">
    import { onMount } from 'svelte';
    import { getClockElements } from '../Clock.svelte';


    function getWidth(el:HTMLElement): number {
        return el.getBoundingClientRect().width
    }

    async function compute() {
        const { hours, min} = await getClockElements();
        const minDiv: HTMLElement = document.getElementById('minutes-divisor');
        
        [hours, min].forEach((el) => el.classList.add('left-1/2', 'top-1/2'));
        document.getElementById('seconds-box').classList.add('opacity-0');
        
        const divSize: number = getWidth(minDiv);

        min.style.transform = `translate(${-(divSize / 2)}px, -50%)`;
        hours.style.transform = `translate(${-(getWidth(hours) + (divSize / 2 ))}px, -50%)`;
    }

    async function load() {
        compute();
    }

    onMount(() => load());
</script>