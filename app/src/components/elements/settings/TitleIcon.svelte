<script lang="ts">
    export let noFill = false;
</script>

<span class="px-1 md:p-0 md:inline-block md:absolute md:-left-10 md:bottom-2/4 md:transform md:-translate-x-2/4 md:translate-y-2/4 text-4xl md:text-5xl rounded-full"
    class:bg-dark={!noFill}>
    <slot></slot>
</span>