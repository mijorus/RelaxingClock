<script lang="ts">
import { afterUpdate, beforeUpdate } from "svelte";

    import { fly, fade } from "svelte/transition";
    import type { RoosterExamples } from "../../types"; 
    import { capitalize } from "../../utils/utils";
    
    let examplesContainer: HTMLElement;
    let selected = 0;
    export let examples: RoosterExamples = null;
    $: onUpdatedExamples(examples)

    export let wait = false;
    export let command: string;
    
    export function move(d: boolean) {
        if (!examples || !examples.group) return;
        const l = (examples.group.filter(e => e.selectable)).length
        d ? (selected > 0 ? selected-- : selected) : (selected < l - 1 ? selected ++ : selected);
        
        if (examplesContainer && (examplesContainer.clientHeight < examplesContainer.scrollHeight)) {
            const amount = examplesContainer.scrollHeight / examples.group.length;
            examplesContainer.scrollBy({top: d ? -(amount) : (amount), behavior: 'smooth'});
        }
    }

    export function trigger() {
        if (!examples || !(examples.group.filter(e => e.selectable).length)) return null;
        return examples.group[selected].id || selected; 
    }

    function onUpdatedExamples() {
        if (examplesContainer) examplesContainer.scroll(0, 0);
    }
</script>

<div class="text-primary md:w-2/5 font-secondary -mb-8" >
    {#if !wait && examples?.group?.length && command.length && command.endsWith(':')}
        <div out:fly={{ y: 5, duration: 200 }} >
            <h4 class="px-8 text-xl font-bold">{capitalize(examples.namespace || 'examples')}</h4>
                <div bind:this={examplesContainer} class="bg-tertiary rounded-t-lg pb-9 text-lg w-full pt-1 max-h-80 overflow-y-scroll">
                    {#if examples.group}
                        {#each examples.group as example, i}
                            <div class:bg-primary={(i === selected && example.selectable)}
                                class="py-1 {example.image ? 'pl-2 items-center' : 'pl-8'} m-1 rounded-lg pr-8 flex overflow-x-hidden flyup">
                                {#if i === selected && example.selectable}<span class="grow pr-1">&middot;</span>{/if}
                                <!-- svelte-ignore a11y-missing-attribute -->
                                {#if example.image}<img src="{example.image}" class="{!example.size || example.size === 'md' ? 'h-16 w-16' : 'h-10 w-10'} mr-2 rounded-md inline-block">{/if} 
                                {#if example.argument}<span class="underline">{example.argument}</span>{/if} 
                                <div class="inline-block ml-2">
                                    <div class="{example.image ? 'flex flex-col' : 'inline'}">
                                        <span class="font-bold">{example.example}</span>
                                        <span class="text-secondary {example.image ? 'text-sm' : 'text-md'}">{example.tip ?? ''}</span>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>s
        </div>
    {:else if wait}
        <div class="bg-tertiary rounded-t-lg pb-9 text-lg w-full pt-1 text-center">
            <div class="transform scale-50 relative inline-block">
                <div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    {/if}
</div>

<style>
    .flyup {
        animation: flyup .1s linear;
    }
    .grow {
        animation: grow .2s linear;
        display: inline-block;
        position: relative;
    }
    @keyframes grow {
        0% { max-width: 0;}
        100% { max-width: 20px;}
    }
    
    @keyframes flyup {
        0% { transform: translateY(-5%); opacity: 0; }
        100% { transform: translateY(0%); opacity: 1;}
    }
</style>