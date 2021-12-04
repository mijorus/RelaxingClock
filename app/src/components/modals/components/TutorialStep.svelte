<script lang="ts">
import { fly } from "svelte/transition";



</script>
    
<div class="flex flex-col justify-center h-full relative tutorial-step tutorial-step-count" >
    <slot></slot>
</div>

<style>
    @keyframes slide-in {
        0% {
            opacity: 0;
            transform: translateX(50px) translateZ(.1px);
        }

        100% {
            opacity: 1;
            transform: translateX(0%) translateZ(.1px);
        }
    }

    .tutorial-step {
        animation: slide-in .5s cubic-bezier(0.33, 1, 0.68, 1);
        animation-fill-mode: forwards;
        will-change: opacity;
    }
</style>