<script lang="ts">
    import { tips } from "../../stores/globalState";
</script>

<div class="fixed bottom-0 right-0 m-4 text-primary font-primary">
    {#if $tips}
        {#each $tips as tip}
        <span>{tip.name}</span>:&nbsp;<strong>{tip.shortcut}</strong><br>
        {/each}
    {/if}
</div>