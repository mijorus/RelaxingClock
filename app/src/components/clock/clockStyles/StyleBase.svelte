<script lang="ts">
import { visibleStylesId } from "../../../stores/clockStyle";

    export let styleId;
</script>
<div class="w-screen h-full">
    {#if $visibleStylesId.includes(styleId)}
        <div class="clock-style-base w-full h-full flex justify-center items-center relative">
            <slot></slot>
        </div> 
    {/if}
</div>