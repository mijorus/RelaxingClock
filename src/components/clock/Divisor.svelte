<script lang="ts">
    import time from '../../stores/time';

    export let css: string = 'relative';
</script>

<span class={css}>{#if ($time.second() % 2)}:{:else}&nbsp;{/if}</span>