<script lang="ts">
import { onMount } from "svelte";
import { shortcuts } from "../../stores/rooster";
import type { RoosterShortcuts } from "../../types";
import Key from "../elements/Key.svelte";

    let rs: RoosterShortcuts;

    onMount(() => {
        rs = shortcuts.getAll();
        console.log(rs);
    })
</script>

<div class="text-primary mb-2 mt-10 overflow-y-scroll max-h-full">
    <h2 class="font-title text-6xl mb-10">Command box</h2>
    {#if rs}
        <ul>
            {#each Object.keys(rs) as key}
                <li class="mb-6">
                    <h3 class="font-title text-xl mb-3">
                        <span class=" capitalize p-1.5 rounded-xl" style="background-color: {rs[key].background}; color: {rs[key].color}">{key}</span>
                    </h3>
                    {#each Object.keys(rs[key].arguments) as arg}
                        {#await rs[key].examples(arg, '') then exs}
                            {#each exs.group as exs}
                                <div>
                                    <span class="underline">{exs.argument}: </span>{exs.tip}
                                </div>
                            {/each}
                        {/await}
                    {/each}
                </li>
            {/each}
        </ul>
    {/if}
</div>