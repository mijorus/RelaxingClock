<script lang="ts">
    export let label: string;
    export let custom = false;
    export let customClass = '';
    export let zoomOnFocus = false;
    let btnsClass: string = 'text-md px-2 py-1 rounded-xl font-primary font-bold relative z-10 settings-btn';
    if (zoomOnFocus) btnsClass += ' zoom-on-focus';
</script>

{#if custom}
    <button class="{btnsClass} {customClass} transition-all boreder-2" alt="{label}" on:click>{label}</button>
{:else}
    <button class="{btnsClass} text-secondary bg-highlighted border-primary border-2 {customClass}" alt="{label}" on:click>{label}</button>
{/if}

<style>
    button {
        transition: .075s ease-out;
    }

    .zoom-on-focus:focus,.zoom-on-focus:hover {
        transform: scale(1.1);
    }
</style>