<script lang="ts">
    type SettingsBtnType = 'boolean' | 'action';
    
    export let type: SettingsBtnType;
    export let state: boolean;
    export let label: string;

    const btnsClass: string = 'text-md settings-btn px-2 py-1 border-primary border-2 rounded-xl font-primary font-bold';
</script>

{#if type === 'boolean'}
    <button class="{btnsClass} {state ? 'bg-highlighted text-secondary':'bg-transparent text-primary'}" 
        data-option="on" 
        alt="{label} on"
    >
        ON
    </button>
    <button class="{btnsClass} {!state ? 'bg-highlighted text-secondary':'bg-transparent text-primary'}" 
        data-option="off" 
        alt="{label} off"
    >
        OFF
    </button>
{:else if type === 'action'}
    <button class="activated transp-btn" alt="{label}">{label}</button>
{/if}

<style>
    .settings-btn {
        cursor: pointer;
        border: none;

        outline: none;
    }
    
    .settings-btn:focus {
        border: none;

        outline: none;
    }
    
    .settings-btn:active {
        border: none;

        outline: none;
    }
</style>