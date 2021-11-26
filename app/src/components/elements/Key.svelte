<script lang="ts">
import { onMount } from "svelte";


    export let key: string;
    
    let size = 4;
    onMount(() => {
        switch (key) {
            case 'space':
                size = 36;
                break;
            
            case 'ctrl':
                size = 8;
                break;
            
        }
    })
</script>

<div class="hidden absolute top-0 pr-8 pr-36"></div>

<div class="inline-block border-2 rounded-xl p-2 pr-{size} m-2 capitalize">
    {key}
</div>