<script>
    export let text;
    export let iconClass = undefined;
</script>
<div class="text-secondary">
    {#if iconClass}
        <i class="{iconClass} text-xs"></i>
    {/if}
    <span class="text-xs font-primary leading-none">{text}</span>
</div>