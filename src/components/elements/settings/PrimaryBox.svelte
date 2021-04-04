<script lang="ts">
    import type { SettingsBtn } from "./Buttons.svelte";
    import SettingsButtons from "./Buttons.svelte";

    interface SettingsLabel {
        text: string,
        color?: string,
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
    <div style="{label.color || 'bg-secondary'}">
        <span>{label.text}</span>
        <div class="rounded-md {available ? 'opacity-100' : 'opacity-50 pointer-events-none'}">
            <slot></slot>
        </div>
    </div>
    {#if description}
        {#if description.iconClass}
            <i class="{description.iconClass} text-sm"></i>
        {/if}
        <span class="text-primary text-sm">{description.label}</span>
    {/if}
</div>