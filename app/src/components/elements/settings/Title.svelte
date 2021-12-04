<script lang="ts">
import { onMount, tick } from "svelte";

    export let title: string;
    export let style = '';
    export let collapsable = true;

    let el: HTMLElement;
    let collapsed = false;

    // onMount(async () => {
    //     await tick();
    //     console.log(el);
        
    // })
</script>

<h2 bind:this={el} class="relative flex justify-center items-center md:block">
    <slot></slot>
    <span class="flex items-center max-h-96 text-3xl md:text-4xl text-primary cursor-pointer font-title font-bold settings-box-element-title whitespace-nowrap overflow-ellipsis" style={style} on:click|stopPropagation|preventDefault={() => collapsed = !collapsed}>
        {title} {#if collapsable}<i class="ml-6 opacity-70  lnr lnr-chevron-down text-sm transform transition-transform settings-box-element-title-arrow" />{/if}
    </span>
</h2>

<style>

</style>