<script lang="ts">
    import { slide } from "svelte/transition";
    export let label: string;
    export let available = true;
    export let bordered = true;
    export let expandable = false;

    let expanded = !expandable;
</script>

<div class="w-full md:w-9/12 bg-secondary rounded-xl p-3 md:p-4 m-3 md:m-4 self-end
    {available ? 'opacity-100' : 'opacity-50 pointer-events-none'} 
    {bordered ? 'border-l-4 border-primary' : 'border-none'}"
>
    <div class="text-primary font-primary text-md w-full flex items-center overscroll-x-hidden" style="justify-content: space-between;">
        <span>{label}</span>
        {#if expandable}<i class="fas fa-chevron-{expanded ? 'up' : 'down'} cursor-pointer" on:click={() => expanded = !expanded}></i>{/if}
    </div>
    {#if expanded }
    <div in:slide out:slide><slot></slot></div>
    {/if}
</div>