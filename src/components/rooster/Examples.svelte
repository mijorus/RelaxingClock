<script lang="ts">
    import { fly, fade } from "svelte/transition";
    export let examples = [{argument: 'create', example: '10m Cook some food'},{argument: 'create', example: '10m Cook some food'},{argument: 'create', example: '10m Cook some food'}]
    export let command: string;
    export let argument: string;
</script>

<div class="text-primary md:w-2/5 font-secondary -mb-8">
    {#if examples.length && command.length && command.endsWith(':')}
        <div out:fly={{ y: 5, duration: 200 }} >
            <h4 class="px-8 text-xl font-bold">Examples</h4>
            <div class="bg-tertiary px-8 rounded-t-lg pb-9 text-lg w-full ">
                {#each examples as e}
                    {#if e.argument.startsWith(argument) || !argument.length}
                        <div class="py-2 " in:fly={{ y: 5, duration: 200 }} out:fade={{ duration:100 }}>
                            <span class="underline">{e.argument}</span> <span>{e.example}</span>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>