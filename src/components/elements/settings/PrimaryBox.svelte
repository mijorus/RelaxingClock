<script lang="ts">    
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
</script>

<div>
    <div class="{label.bgClass || 'bg-secondary'} flex flex-row items-center justify-between rounded-xl p-3 md:p-4 m-3 md:m-4">
        <span class="text-primary text-xl font-primary">{label.text}</span>
        <div class="{available ? 'opacity-100' : 'opacity-50 pointer-events-none'}">
            <slot></slot>
        </div>
    </div>
    {#if description}
        <div class="px-3 md:px-4 mx-3 md:mx-4">
            {#if description.iconClass}
                <i class="{description.iconClass} text-xs font-primary"></i>
            {/if}
            <span class="text-secondary text-xs font-primary">{description.text}</span>
        </div>
    {/if}
</div>