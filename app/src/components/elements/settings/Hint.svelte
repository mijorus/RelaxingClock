<script>
    export let text;
    export let iconClass = undefined;
</script>
<div class="hidden md:block mb-2 md:mb-0 text-secondary settings-box-element settings-hint" style="line-height: 1; max-height: 1000px">
    {#if iconClass}<i class="{iconClass} text-xs"></i>{/if}
    <span class="text-xs md:text-sm font-primary leading-none settings-hint">{@html text}</span>
</div>

<style>
    .settings-hint {
        transition: color .2s linear, max-height .2s linear ;
    }

    .settings-hint:hover {
        color: white !important;
    }
</style>