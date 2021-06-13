<script lang="ts">
    import { createEventDispatcher } from "svelte";


    export let checked = false;
    let hasFocus = false;
    const dispatch = createEventDispatcher();

    function dispatchEvent() {
        dispatch('change', { checked });
    }
</script>

<span on:click={dispatchEvent} class="{hasFocus ? 'in-focus' : ''} inline-block">
    <input type="checkbox" class="w-0 h-0 opacity-0 absolute" bind:checked={checked} on:focus={() => hasFocus = true} on:blur={() => hasFocus = false}>
    <i class="lnr text-primary mr-2 cursor-pointer {checked ? 'lnr-checkmark-circle opacity-100' : 'lnr-circle-minus opacity-50'}"></i>
</span>

<style>
    .in-focus {
        transform: scale(1.3);
        transform-origin: center center;
    }
</style>