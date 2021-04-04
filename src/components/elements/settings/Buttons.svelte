<script lang="ts" context="module">
    type SettingsBtnType = 'boolean' | 'action';

    export interface SettingsBtn {
        type: SettingsBtnType,
        state?: boolean,
        label?: string,
    }
</script>

<script lang="ts">
    export let btn: SettingsBtn;
</script>

{#if button.type === 'boolean'}
    <button class="text-md transp-btn {btn.state ? 'bg-highlighted':'bg-transparent'}" data-option="on" alt="{btn.label} on">
        ON
    </button>
    <button class="text-md transp-btn {!btn.state ? 'bg-highlighted':'bg-transparent'}" data-option="off" alt="{btn.label} off">
        OFF
    </button>
{:else if btn.type === 'action'}
    <button class="activated transp-btn" alt="{btn.label}">{btn.label}</button>
{/if}