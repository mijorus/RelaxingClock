<script lang="ts">
import AnimatedText from "../AnimatedText.svelte";
import Hint from "./Hint.svelte";

    interface SettingsLabel {
        text: string,
        bgClass?: string,
    }
    
    interface SettingsDesc {
        iconClass?: string,
        text: string,
    }
    
    export let label: SettingsLabel;
    export let available: boolean = true;
    export let description: SettingsDesc;
    export let hideLabelOnMobile = false;
</script>

<div class="settings-box-element settings-box-primary max-h-96 {available ? 'opacity-100' : 'opacity-50 pointer-events-none'} ">
    <div class="{label.bgClass || 'bg-secondary'} p-3 m-2 md:p-4 md:m-2 flex flex-row items-center md:justify-between rounded-xl {hideLabelOnMobile ? 'justify-center' : 'justify-between'}">
        <span class="text-primary md:text-xl font-primary whitespace-nowrap not-overflow overflow-x-hidden {hideLabelOnMobile ? 'hidden md:inline-block' : ''}"><AnimatedText text={label.text}/></span>
        <div class="">
            <slot></slot>
        </div>
    </div>
    {#if description}
        <div class="px-3 md:px-4 mx-3 md:mx-4 text-secondary">
            <Hint text={description.text} iconClass={description.iconClass}></Hint>
        </div>
    {/if}
</div>

<style>
    @media (max-width: 640px) { 
        .not-overflow {
            max-width: 70%;
        }
    }
</style>