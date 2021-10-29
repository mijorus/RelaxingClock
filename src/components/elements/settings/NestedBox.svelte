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

<div class="settings-box-element settings-box-nested w-full md:w-9/12 bg-secondary rounded-xl p-3 md:p-4 m-3 md:m-4 self-end transition-opacity
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
    <div class="w-full md:w-9/12 self-end" transition:slide>
        <Hint text={description}></Hint>
    </div>
{/if}