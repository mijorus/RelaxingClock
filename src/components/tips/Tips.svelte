<script lang="ts">
import { fade } from "svelte/transition";
import { tips } from "../../stores/globalState";
</script>

<div class="fixed bottom-0 right-0 m-4 text-primary font-primary">
    {#if $tips}
        <span transition:fade>
            {#each $tips as tip}
            <span>{@html tip.name}</span>:&nbsp;<strong>{@html tip.shortcut}</strong><br>
            {/each}
        </span>
    {/if}
</div>