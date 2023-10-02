<script lang="ts">
    import { onMount } from "svelte";
    import { shortcuts } from "../../stores/rooster";
    import type { RoosterShortcuts } from "../../types";
    import Key from "../elements/Key.svelte";
    import { getAltLabel, isMacintosh } from "../../utils/utils";

    let rs: RoosterShortcuts;

    function commandShouldShowUp(key: string): boolean {
        if (!rs) return false;
        const hasOnlyOneKey: boolean = Object.keys(rs[key].arguments).length === 1;

        return !hasOnlyOneKey || Object.keys(rs[key].arguments)[0] !== "";
    }

    onMount(() => {
        rs = shortcuts.getAll();
        console.log(rs);
    });
</script>

<div class="text-primary pt-5 overflow-y-scroll max-h-full flex flex-col gap-2">
    <div>
        <h2 class="font-title text-3xl mb-10 text-center">Commands and shortcuts</h2>
        {#if rs}
            <ul class="flex flex-col justify-center items-center">
                {#each Object.keys(rs) as key, i}
                    <li class=" w-full md:w-132 mb-6 bg-tertiary p-4 rounded-xl">
                        <div class="flex flex-col items-start gap-1">
                            <h3 class="font-title text-3xl">
                                <span class="capitalize rounded-xl" style="color: {rs[key].background}">{key}</span>
                            </h3>
                            <div class="w-full">
                                {#each Object.keys(rs[key].arguments) as arg, i}
                                    <div class="mt-3 p-5 bg-primary rounded-xl w-full" class:hidden={rs[key].arguments[arg].hideInModal}>
                                        {#if !rs[key].arguments[arg].hideInModal}
                                            {#if arg.length}<span class="bg-secondary p-1 rounded-md">{arg}</span>{/if}
                                            <span class="text-xs">
                                                {#if rs[key].arguments[arg].quickLaunch}{arg.length ? "or" : ""}
                                                    <span class="bg-tertiary p-1 rounded-md"
                                                        >{getAltLabel()} + {rs[key].arguments[arg].quickLaunch.match(/[A-Z]/g) ? "Shift + " : ""} {rs[key].arguments[arg].quickLaunch}</span
                                                    >
                                                {/if}
                                            </span>
                                            <span class="p-1 rounded-md">{rs[key].arguments[arg].description ?? ""}</span>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </li>
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
