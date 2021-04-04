<script lang="ts">
    // import type { SettingsBtn } from "./Buttons.svelte";
    // import SettingsButtons from "./Buttons.svelte";
    
    interface SettingsLabel {
        text: string,
        bgClass?: string,
    }
    
    interface SettingsDesc {
        iconClass?: string,
        label: string,
    }
    
    export let label: SettingsLabel;
    export let available: boolean = true;
    export let description: SettingsDesc;
</script>

<div>
    <div class="{label.bgClass || 'bg-secondary'} rounded-xl p-3 md:p-4 m-3 md:m-4">
        <span class="text-primary text-xl font-primary">{label.text}</span>
        <div class="rounded-md {available ? 'opacity-100' : 'opacity-50 pointer-events-none'}">
            <slot></slot>
        </div>
    </div>
    {#if description}
    <div class="pl-3 md:pl-4 ml-3 md:ml-4">
        {#if description.iconClass}
        <i class="{description.iconClass} text-xs font-primary"></i>
        {/if}
        <span class="text-secondary text-xs font-primary">{description.label}</span>
    </div>
    {/if}
</div>