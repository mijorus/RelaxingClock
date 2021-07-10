<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import type { RoosterExample, RoosterExamples } from "../../types"; 
    import { capitalize } from "../../utils/utils";
    
    export let examples: RoosterExamples = {};
    export let command: string;
</script>

<div class="text-primary md:w-2/5 font-secondary -mb-8">
    {#if Object.keys(examples).length && command.length && command.endsWith(':')}
        <div out:fly={{ y: 5, duration: 200 }} >
            {#each Object.keys(examples) as e}
                <h4 class="px-8 text-xl font-bold">{capitalize(e)}</h4>
                <div class="bg-tertiary pr-8 rounded-t-lg pb-9 text-lg w-full ">
                    {#each examples[e].group as example}
                        <div class="py-1 {example.image ? 'pl-2' : 'pl-8'} overflow-x-hidden" in:fly={{ y: 5, duration: 200 }} out:fade={{ duration:100 }}>
                            <!-- svelte-ignore a11y-missing-attribute -->
                            {#if example.image}<img src="{example.image}" class="h-12 w-12 rounded-md inline-block">{/if} 
                            {#if example.argument}<span class="underline">{example.argument}</span>{/if} 
                            <span class="font-bold">{example.example}</span> 
                            <span class="text-secondary text-md">{example.tip ? example.tip : ''}</span>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>