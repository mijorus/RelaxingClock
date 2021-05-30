<script lang="ts">
    import Hours from '../Hours.svelte';
    import Minutes from '../Minutes.svelte';
    import Seconds from '../Seconds.svelte';
    // import { bigClockUpdate, hoursBox, minutesBox, secondsBox } from '../../../stores/clockStyle';
    import { getWidth } from '../../../utils/getBoundingClientRect';
    import Divisor from '../Divisor.svelte';
    import StyleBase from './StyleBase.svelte';
    import { visibleStylesId } from '../../../stores/clockStyle';

    // $: compute($bigClockUpdate);
    const styleId = 1;
    // $: beforeStyleLoad($nextStyleId);
    // $: onStyleLoad($activeStyleId);

    // function beforeStyleLoad(id: number) {
    //     console.log('before', id);
    // }

    // function onStyleLoad(id: number) {
    //     console.log(id);
    // }
</script>

<StyleBase>
    {#if $visibleStylesId.includes(styleId)}
        <Hours /><Divisor /><Minutes />
    {/if}
</StyleBase>