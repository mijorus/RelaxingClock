<script lang="ts">
    export let title: string;
</script>

<h2 class="relative">
    <slot></slot>
    <span class="text-4xl text-primary font-primary font-bold">{title}</span>
</h2>

<style>
    i {
        position: absolute;
        bottom: 50%;
        left: -50px;
        transform: translate(-50%,50%);
    }
</style>