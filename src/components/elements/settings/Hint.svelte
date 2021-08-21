<script>
    export let text;
    export let iconClass = undefined;
</script>
<div class="text-secondary" style="line-height: 1;">
    {#if iconClass}<i class="{iconClass} text-xs"></i>{/if}
    <span class="text-xs font-primary leading-none">{@html text}</span>
</div>