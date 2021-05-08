<script lang="ts">
    export let value: number|string;
</script>

<span id="hours">{#if value === ''}&nbsp;&nbsp;{:else}{value}{/if}</span>