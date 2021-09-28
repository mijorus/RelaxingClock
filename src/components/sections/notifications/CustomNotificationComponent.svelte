<script lang="ts">
import moment from "moment";

    import { onMount } from "svelte";

    import { fade, fly } from "svelte/transition";
    import type { CustomNotification } from "../../../types";
    import Bubble from "../../elements/Bubble.svelte";

    export let data: CustomNotification;
    export let expire = false;
    export let showTimestamp = false;
</script>

<div in:fly="{ expire ? { x: 200, duration: 750 } : {}}" out:fade="{{ duration: 300 }}">
    <Bubble classes="bg-secondary">
        <div class="flex items-center">
            <div>
                <span class="pr-2">
                    <i class="{data.icon} text-5xl" style="color: {data.color};"/>
                </span>
            </div>
            <div class="overflow-x-hidden">
                <h4 class="text-3xl font-bold">{data.title}</h4>
                <p class="whitespace-nowrap">{data.content}</p>
                {#if showTimestamp}
                    <p class="whitespace-nowrap text-primary opacity-50 text-sm">{moment(data.timestamp, 'X').fromNow()}</p>
                {/if}
            </div>
        </div>
        <!-- svelte-ignore a11y-media-has-caption -->
        {#if data?.sound} <audio autoplay src="/media/static_media_notification.mp3"/> {/if}
    </Bubble>
</div>