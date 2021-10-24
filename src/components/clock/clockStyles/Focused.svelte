<script lang="ts">
import Hours from '../Hours.svelte';
import Minutes from '../Minutes.svelte';
import Divisor from '../Divisor.svelte';
import StyleBase from './StyleBase.svelte';
import { screenSaver } from '../../../stores/globalState';
import DateBox from '../DateBox.svelte';
import { clockFormat } from '../../../stores/storedSettings';
import time from '../../../stores/time';
import AmPmBadge from '../AmPmBadge.svelte';

$: hour = parseInt($time.format('HH'));
</script>

<StyleBase styleId={1}>
        <div class="relative">
            <div class="block">
                <Hours /><Divisor /><Minutes /><AmPmBadge />
            </div>
            {#if $screenSaver}
                <DateBox />
            {/if}
        </div>
</StyleBase>