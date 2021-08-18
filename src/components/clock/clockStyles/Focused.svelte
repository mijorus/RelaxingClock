<script lang="ts">
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import Divisor from '../Divisor.svelte';
import StyleBase from './StyleBase.svelte';
import { visibleStylesId } from '../../../stores/clockStyle';
import { screenSaver } from '../../../stores/globalState';
import DateBox from '../DateBox.svelte';

    
    const styleId = 1;
</script>

<StyleBase>
    {#if $visibleStylesId.includes(styleId)}
        <div class="relative">
            <div class="block"><Hours /><Divisor /><Minutes /></div>
            {#if $screenSaver}
                <DateBox />
            {/if}
        </div>
    {/if}
</StyleBase>