<script lang="ts">
    import { blink } from '../../stores/storedSettings';
    import time from '../../stores/time';
</script>

<span id="divisor" class="relative clock-component">{#if ($time.second() % 2) || !$blink}:{:else}&nbsp;{/if}</span>