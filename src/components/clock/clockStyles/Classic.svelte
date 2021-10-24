<script lang="ts">
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import Seconds from '../Seconds.svelte';
import Divisor from '../Divisor.svelte';
import StyleBase from './StyleBase.svelte';
import { screenSaver } from '../../../stores/globalState';
import DateBox from '../DateBox.svelte';
import AmPmBadge from '../AmPmBadge.svelte';

</script>

<StyleBase styleId={0}>
        <div class="relative">
            <div><Hours /><Divisor /><Minutes /><Divisor /><Seconds /><AmPmBadge /></div>
            {#if $screenSaver}<DateBox />{/if}
        </div>
</StyleBase>