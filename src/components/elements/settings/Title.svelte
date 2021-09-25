<script lang="ts">
    export let title: string;
    export let style = '';
</script>

<h2 class="relative">
    <slot></slot>
    <span class="text-4xl text-primary font-primary font-bold" style={style}>{title}</span>
</h2>

<style>

</style>