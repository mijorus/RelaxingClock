<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import type { RoosterExample } from "../../types"; 
    
    export let examples: Array<RoosterExample> = [];
    export let command: string;
    export let argument: string;
</script>

<div class="text-primary md:w-2/5 font-secondary -mb-8">
    {#if examples.length && command.length && command.endsWith(':')}
        <div out:fly={{ y: 5, duration: 200 }} >
            <h4 class="px-8 text-xl font-bold">Examples</h4>
            <div class="bg-tertiary px-8 rounded-t-lg pb-9 text-lg w-full ">
                {#each examples as e}
                <div class="py-2 " in:fly={{ y: 5, duration: 200 }} out:fade={{ duration:100 }}>
                    <span class="underline">{e.argument}</span> <span class="font-bold">{e.example}</span> 
                    <span class="text-secondary text-md">{e.tip ? e.tip : ''}</span>
                </div>
                {/each}
            </div>
        </div>
    {/if}
</div>