<script lang="ts">
import { fly, slide } from "svelte/transition";
    export let animate = true;

    const slideAnimationConfig = {x: 50, duration: 1500};
    const slideOutAnimationConfig = {x: -50, duration: 250};
</script>
    
<div class="md:w-4/5 m-auto" in:fly={animate ? {...slideAnimationConfig} : {}} out:fly={{...slideOutAnimationConfig}}>
    <slot></slot>
</div>