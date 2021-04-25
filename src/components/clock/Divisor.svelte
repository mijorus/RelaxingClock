<script lang="ts">
    import { blink } from '../../stores/clockStyle';
    import time from '../../stores/time';
</script>

<span class="relative">{#if ($time.second() % 2) && $blink}:{:else}&nbsp;{/if}</span>