<script lang="ts">
    import { blink } from '../../stores/clockStyle';
    import time from '../../stores/time';

    export let visible: boolean;
</script>

<span class="relative">{#if ($time.second() % 2) && $blink && visible}:{:else}&nbsp;{/if}</span>