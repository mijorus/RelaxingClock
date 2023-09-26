<script lang="ts">
    import Hours from "../Hours.svelte";
    import Minutes from "../Minutes.svelte";
    import Seconds from "../Seconds.svelte";
    import Divisor from "../Divisor.svelte";
    import StyleBase from "./StyleBase.svelte";
    import { screenSaver, tips } from "../../../stores/globalState";
    import DateBox from "../DateBox.svelte";
    import AmPmBadge from "../AmPmBadge.svelte";
    import IncomingEventsMessages from "../IncomingEventsMessages.svelte";
    import { backgroundImage } from "../../../stores/storedSettings";
</script>

<StyleBase styleId={0}>
    <div class="relative" class:light={$backgroundImage?.length}>
        <div class="absolute left-1/2 transform -translate-x-2/4">
            <IncomingEventsMessages />
        </div>
        <div><Hours /><Divisor /><Minutes /><Divisor /><Seconds /><AmPmBadge /></div>
        {#if $screenSaver}
            <DateBox />
        {/if}
    </div>
</StyleBase>

<style>
    .light {
        opacity: .9;
        text-shadow: 0 0 20px var(--secondary);
    }
</style>
