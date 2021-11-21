<script lang="ts">
import { slide } from "svelte/transition";
import Hint from "./Hint.svelte";
export let label: string;
export let available = true;
export let bordered = true;
export let expandable = false;
export let expanded = false;
export let description: string = undefined;
</script>

<div class="relative settings-box-element settings-box-nested p-2 md:p-0 w-full flex flex-col max-h-999" >
    <div class="w-full md:w-9/12 bg-secondary rounded-xl p-3 md:p-4 md:m-2 md:self-end transition-opacity
        {available ? 'opacity-100' : 'opacity-50 pointer-events-none'}
        {bordered && !expandable ? 'border-l-4 border-primary' : 'border-none'}"
    >
        <div class="text-primary font-primary text-md w-full flex items-center overscroll-x-hidden" style="justify-content: space-between;">
            <span>{label}</span>
            {#if expandable}
                <i class="fas fa-chevron-{expanded ? 'up' : 'down'} cursor-pointer" on:click on:click={() => expanded = !expanded}></i>
            {:else}
                <slot></slot>
            {/if}
        </div>
    
        {#if expandable && expanded }
            <div in:slide out:slide><slot></slot></div>
        {/if}
    </div>
    {#if description}
        <div class="text-center md:text-left w-full md:w-9/12 md:self-end" transition:slide>
            <Hint text={description}></Hint>
        </div>
    {/if}
</div>

<style>
    .max-h-999 {
        max-height: 999px;
    }
</style>