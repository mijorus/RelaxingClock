<script lang="ts">
    import { accentColor } from "../../stores/storedSettings";

    export let value: string;
    export let color = false;
    
    $: textShadow = $accentColor !== "white" ? "2px 2px #fff" : null;

</script>

{#if color}
<span class="clock-component font-semibold" style={`color: ${$accentColor}; text-shadow: ${textShadow}`}>
    { value }
</span>
{:else}
<span class="clock-component font-semibold">{ value }</span>
{/if}