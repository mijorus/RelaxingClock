<script lang="ts">
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import Divisor from '../Divisor.svelte';
import StyleBase from './StyleBase.svelte';
import { screenSaver } from '../../../stores/globalState';
import DateBox from '../DateBox.svelte';
</script>

<StyleBase styleId={1}>
        <div class="relative">
            <div class="block"><Hours /><Divisor /><Minutes /></div>
            {#if $screenSaver}
                <DateBox />
            {/if}
        </div>
</StyleBase>