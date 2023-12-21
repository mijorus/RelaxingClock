<script lang="ts">
import moment from "moment";
import { fade, fly } from "svelte/transition";
import type { CustomNotification } from "../../../types";
import AnimatedText from "../../elements/AnimatedText.svelte";
import Bubble from "../../elements/Bubble.svelte";

export let data: CustomNotification;
export let expire = false;
export let showTimestamp = false;
export let forceSilent = false;
export let inPanel = false;
</script>

<div in:fly="{ expire ? { x: 200, duration: 750 } : {}}" out:fade="{{ duration: 300 }}">
    <Bubble classes="bg-secondary">
        <div class="flex items-center" class:cursor-pointer={data.elementId} on:click|stopPropagation={(e) => { if (data.elementId) window.location.replace('#' + data.elementId) }}>
            <!-- <div class="mr-2">
                <span class="pr-2">
                    <i class="{data.icon ?? 'fas fa-bell'} text-xl" style="color: {data.color};"/>
                </span>
            </div> -->
            <div class="overflow-x-hidden whitespace-nowrap font-ubuntu">
                <h4 class="text-xl font-bold font-title">
                    <AnimatedText text={data.title} fade={false}/>
                </h4>
                <div>
                    {#if data.content}
                        {#if !inPanel}
                            <p class="whitespace-nowrap font-ubuntu text-secondary">
                                <AnimatedText text={data.content} fade={false}/>
                            </p>
                        {:else}
                            <p class="whitespace-normal text-sm text-primary opacity-75 font-ubuntu" style="line-height: 1;">{data.content}</p>
                        {/if}
                    {/if}
                    {#if showTimestamp}
                        <p class="whitespace-nowrap text-secondary text-sm">{moment(data.timestamp, 'X').fromNow()}</p>
                    {/if}
                </div>
            </div>
        </div>
        <!-- svelte-ignore a11y-media-has-caption -->
        {#if data?.sound && !forceSilent} <audio autoplay src="/media/static_media_notification.mp3"/> {/if}
    </Bubble>
</div>