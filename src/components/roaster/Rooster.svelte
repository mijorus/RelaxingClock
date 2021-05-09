<script lang="ts">
    import { onMount } from "svelte";


    let inputBox: HTMLElement;

    onMount(() => inputBox.focus());
</script>

<div id="rooster" class="flex md:w-2/5 h-14 rounded-xl mb-4 bg-secondary fixed bottom-0 left-2/4 transform -translate-x-2/4 z-50 items-center">
    <i class="lnr lnr-chevron-right text-primary justify-self-start	inline-block px-3 text-xl"></i>
    <input bind:this={inputBox} type="text" class="inline-block bg-transparent text-primary text-xl font-primary transp-btn">
</div>