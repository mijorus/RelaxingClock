<script lang="ts">
    export let unsupported = false;
</script>

<div class="flex flex-row justify-end mb-6 md:mb-10 {unsupported ? 'pointer-events-none opacity-40': ''}">
    <div class="w-full flex flex-col relative md:w-11/12">
        <slot></slot>
    </div>
</div>