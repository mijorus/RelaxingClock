<script lang="ts">
import { clockFormat } from "../../stores/storedSettings";
import time from "../../stores/time";
    export let size: string = 'sm';
    $: hour = parseInt($time.format('HH'));
</script>

<span class="text-{size} overflow-visible w-0 {$clockFormat === '24h' ? 'hidden' : 'inline-block'}">{hour >= 12 ? 'PM' : 'AM'}</span>