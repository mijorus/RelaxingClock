<script lang="ts">
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import Seconds from '../Seconds.svelte';
import Divisor from '../Divisor.svelte';
import StyleBase from './StyleBase.svelte';
import { visibleStylesId } from '../../../stores/clockStyle';
import { screenSaver } from '../../../stores/globalState';
import DateBox from '../DateBox.svelte';

    const styleId = 0;
</script>

<StyleBase>
    {#if $visibleStylesId.includes(styleId)}
        <div class="relative">
            <div><Hours /><Divisor /><Minutes /><Divisor /><Seconds /></div>
            {#if $screenSaver}<DateBox />{/if}
        </div>
    {/if}
</StyleBase>