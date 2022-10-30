<script lang="ts">
import { fade } from "svelte/transition";
import { tips } from "../../stores/globalState";
</script>

<div class="hidden md:block fixed bottom-0 right-0 m-4 text-primary font-primary">
    {#if $tips}
        <div class="text-right" transition:fade>
            {#each $tips as tip}
            <span><strong>{@html tip.shortcut}</strong>:&nbsp;{@html tip.name}</span><br>
            {/each}
        </div>
    {/if}
</div>