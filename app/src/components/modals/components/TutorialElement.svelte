<script lang="ts">
import { fade, fly } from "svelte/transition";
    
    // index must be >= 1
    export let index: number | string;
    export let customClass: string;
</script>

<div class="mt-6 {customClass}" in:fly={{y: -20, duration: 1500, delay: ((typeof index === 'string' ? parseInt(index) : index) * 1000)}}>
    <slot></slot>
</div>