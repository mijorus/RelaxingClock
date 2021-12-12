<script lang="ts">
import { onMount } from "svelte";
import { shortcuts } from "../../stores/rooster";
import type { RoosterShortcuts } from "../../types";
import Key from "../elements/Key.svelte";

    let rs: RoosterShortcuts;

    function commandShouldShowUp(key: string): boolean {
        if (!rs) return false;
        const hasOnlyOneKey: boolean = ((Object.keys(rs[key].arguments)).length === 1);

        return ( !hasOnlyOneKey || (Object.keys(rs[key].arguments)[0]) !== '' )
    }

    onMount(() => {
        rs = shortcuts.getAll();
        console.log(rs);
    })
</script>

<div class="text-primary pt-5 overflow-y-scroll max-h-full flex flex-col gap-2">
    <div>
        <h2 class="font-title text-3xl mb-10 ">Commands and shortcuts</h2>
        {#if rs}
            <ul class="grid grid-cols-1 md:grid-cols-2">
                {#each Object.keys(rs) as key, i}
                    {#if commandShouldShowUp(key)}
                        <li class="mb-6">
                            <div class="flex flex-col items-start gap-1">
                                <h3 class="font-title text-xl">
                                    <span class="capitalize rounded-xl" style="color: {rs[key].background}">{key}:</span>
                                </h3>
                                <div>
                                    {#each Object.keys(rs[key].arguments) as arg, i}
                                        <div class="mt-3">
                                            {#if arg.length && !rs[key].arguments[arg].hideInModal}
                                                <span class="bg-secondary p-1 rounded-md">{arg}</span>
                                                <span class="text-xs">{#if rs[key].arguments[arg].quickLaunch}or <span class="bg-tertiary p-1 rounded-md">[Alt + {rs[key].arguments[arg].quickLaunch}]</span>{/if}</span>
                                                <span class="p-1 rounded-md">{rs[key].arguments[arg].description ?? ''}</span>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style>
    ul {
        /* column-count: 2; */
    }

    @media only screen and (max-width: 768px) {
        ul {
            column-count: 1;
        }
    }
</style>