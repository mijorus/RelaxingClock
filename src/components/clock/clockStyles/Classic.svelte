<script lang="ts">
    import Hours from '../Hours.svelte';
    import Minutes from '../Minutes.svelte';
    import Seconds from '../Seconds.svelte';
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import Divisor from '../Divisor.svelte';
    import StyleBase from './StyleBase.svelte';
    import { activeStyleId, nextStyleId, visibleStylesId } from '../../../stores/clockStyle';

    // $: compute($bigClockUpdate);
    const styleId = 0;
    
    // async function compute(timestamp: number) {
    //     if (timestamp) {
    //         const divSize: number = getWidth(document.getElementById('minutes-divisor'));
    //         const centerElSize: number = getWidth($minutesBox.el);

    //         hoursBox.update(el => ({...el, x: `${-(centerElSize + getWidth($hoursBox.el) - divSize)}px`, y: '-50%', visible: true}));
    //         minutesBox.update(el => ({...el, x: `${-(centerElSize - divSize)}px`, y: '-50%', visible: true}));
    //         secondsBox.update(el => ({...el, x: `${(divSize)}px`, y: `-50%`, visible: true}));
    //     }
    // }
</script>

<StyleBase>
    {#if $visibleStylesId.includes(styleId)}
        <Hours /><Divisor /><Minutes /><Divisor /><Seconds />
    {/if}
</StyleBase>