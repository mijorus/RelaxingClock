<script>
    export let text;
    export let iconClass = undefined;
</script>
<div class="text-secondary settings-hint" style="line-height: 1;">
    {#if iconClass}<i class="{iconClass} text-xs"></i>{/if}
    <span class="text-sm font-primary leading-none settings-hint">{@html text}</span>
</div>

<style>
    .settings-hint {
        transition: color .2s linear ;
    }

    .settings-hint:hover {
        color: white !important;
    }
</style>