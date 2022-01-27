<script lang="ts">
import { onMount } from "svelte";
    
    let label = '25 minutes';

    onMount(() => {
        setTimeout(()=> label = '', 4000)
    })
</script>

<!-- <div class="absolute bottom-0 left-2/4 transform -translate-x-1/2 flex flex-row items-center gap-2 text-primary font-primary
    p-2 m-5 bg-tertiary rounded-full text-xl">
    <i class="icon-tomato-bw"></i>
    {#if label}<p>{label}</p>{/if}
</div> -->