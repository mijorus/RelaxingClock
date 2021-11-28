<script lang="ts">
import { onMount } from "svelte";

    export let key: string;
    
    let size;
    onMount(() => {
        switch (key) {
            case 'space':
                size = 'pr-36';
                break;
            
            case 'ctrl':
                size = 'pr-8';
                break;

            default:
                size = 'px-4';
                break;
        }
    })
</script>

<div class="hidden absolute top-0 px-8 pr-8 pr-36"></div>

<div class="inline-block border-2 rounded-xl p-2 {size} m-2 capitalize">
    {key}
</div>