<script lang="ts">
    export let title: string;
    export let style = '';
    export let collapsable = true;

    let collapsed = false;
</script>

<h2 class="relative">
    <slot></slot>
    <span class="flex items-center max-h-96 text-4xl text-primary cursor-pointer font-primary font-bold settings-box-element-title" 
        style={style} on:click|stopPropagation|preventDefault={() => collapsed = !collapsed}>
        {title} {#if collapsable}<i class="ml-6 opacity-70  lnr lnr-chevron-down text-sm transform transition-transform" class:-rotate-90={collapsed} />{/if}
    </span>
</h2>

<style>

</style>