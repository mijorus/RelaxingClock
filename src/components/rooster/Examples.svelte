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
                <div class="bg-tertiary px-8 rounded-t-lg pb-9 text-lg w-full ">
                    {#each examples[e] as namespace}
                        <div class="py-2 " in:fly={{ y: 5, duration: 200 }} out:fade={{ duration:100 }}>
                            <span class="underline">{namespace.argument}</span> <span class="font-bold">{namespace.example}</span> 
                            <span class="text-secondary text-md">{namespace.tip ? namespace.tip : ''}</span>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>