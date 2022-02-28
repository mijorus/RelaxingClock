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
import IncomingEventsMessages from '../IncomingEventsMessages.svelte';
import { handleMouseEnterCommon, handleMouseLeaveCommon } from './common';

$: hour = parseInt($time.format('HH'));
</script>

<StyleBase styleId={1}>
        <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-2/4">
                <IncomingEventsMessages />
            </div>
            <div class="block">
                <Hours /><Divisor /><Minutes /><AmPmBadge />
            </div>
            {#if $screenSaver}
                <DateBox />
            {/if}
        </div>
</StyleBase>