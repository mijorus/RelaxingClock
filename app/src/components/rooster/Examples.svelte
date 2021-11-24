<script lang="ts">
import { afterUpdate, beforeUpdate } from "svelte";
import { fly, fade } from "svelte/transition";
import type { RoosterExample, RoosterExamples } from "../../types"; 
import { capitalize } from "../../utils/utils";
    
    let examplesContainer: HTMLElement;
    let selected = 0;
    let sortedList: RoosterExample[] = [];
    let oldExamplesList: RoosterExample[] = [];

    export let examples: RoosterExamples = null;
    $: onUpdatedExamples(examples)

    export let wait = false;
    export let command: string;
    
    export function move(d: boolean) {
        if (!examples || !examples.group) return;
        const l = (examples.group.filter(e => e.selectable)).length
        d ? (selected > 0 ? selected-- : selected) : (selected < l - 1 ? selected ++ : selected);
        
        if (examplesContainer && (examplesContainer.clientHeight < examplesContainer.scrollHeight) && (selected < examples.group.length)) {
            const amount = examplesContainer.scrollHeight / examples.group.length;
            examplesContainer.scrollBy({top: d ? -(amount) : (amount), behavior: 'smooth'});
        }
    }

    export function trigger() {
        if (!examples || !(examples.group.filter(e => e.selectable).length)) return null;
        return sortedList[selected].id || selected; 
    }

    function onUpdatedExamples(examples: RoosterExamples) {
        const shoudReload = (!examples?.group 
            || examples.reloadPosition === undefined 
            || (examples.reloadPosition === false && examples.group.length === sortedList.length)
        );

        if (examples?.group) {
            if (shoudReload) selected = 0;
            sortedList = getSortedList();
        }
    }

    function getSortedList(list: RoosterExample[] = examples.group) {
        const hasSortingKey = list[0].sortingKey !== undefined;
        let newList = list.slice().sort((a, b) => {
            return hasSortingKey 
                ? ((b.sortingKey - a.sortingKey > 0) || b.size === 'md') ? 1 : -1
                :  b.size === 'md' ? 1 : -1
        });

        console.log(newList);
        return newList;
    }
</script>

<div class="text-primary  w-11/12 sm:w-4/5 lg:w-2/5 font-secondary -mb-8" >
    {#if !wait && examples?.group?.length && command.length && command.endsWith(':')}
        <div out:fly={{ y: 5, duration: 200 }} >
            <h4 class="px-8 text-xl font-bold">{capitalize(examples.namespace || 'examples')}</h4>
                <div bind:this={examplesContainer} class="bg-tertiary rounded-t-lg pb-9 text-lg w-full pt-1 max-h-80 overflow-y-scroll">
                    {#if examples.group}
                        {#each sortedList as example, i}
                            <div data-id="example-{example.id ?? null}" class:bg-primary={(i === selected && example.selectable)} 
                                class="py-1 {example.image ? 'pl-2 items-center' : 'pl-8'} m-1 rounded-lg pr-8 flex overflow-x-hidden flyup">
                                {#if i === selected && example.selectable}<span class="grow pr-1">&middot;</span>{/if}
                                <!-- svelte-ignore a11y-missing-attribute -->
                                {#if example.image}<img src="{example.image}" class="{!example.size || example.size === 'md' ? 'h-16 w-16' : 'h-10 w-10'} mr-2 rounded-md inline-block">{/if} 
                                {#if example.argument}<span class="underline">{example.argument}</span>{/if} 
                                <div class="inline-block ml-2">
                                    <div class="{example.image ? 'flex flex-col' : 'inline'}">
                                        <span class="example example-title font-bold">{example.example}</span>
                                        <span class="example example-image text-secondary {example.image ? 'text-sm' : 'text-md'}">{example.tip ?? ''}</span>
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

    .example {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>