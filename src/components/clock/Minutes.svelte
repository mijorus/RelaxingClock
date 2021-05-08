<script lang="ts">
    export let value: number|string;
</script>

<span id="minutes">{#if value === ''}&nbsp;&nbsp;{:else}{value}{/if}</span>