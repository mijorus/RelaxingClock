<script lang="ts">
import { tick } from "svelte";

import { fade, fly } from "svelte/transition";
import { screenSaver } from "../../../stores/globalState";
import { latestNotification, notifications } from "../../../stores/notifications";
import type { CustomNotification } from "../../../types";
import Bubble from "../../elements/Bubble.svelte";
import NotificationComponent from "./CustomNotificationComponent.svelte";
import anime from "animejs";
import { bigClockSSoffset, cbDefault, eaElasticDefault } from "../../../utils/animations";

    let notificationToShow: CustomNotification = null;
    let showPanel = false;
    let nPanel: HTMLElement;

    $: showNotification($latestNotification);

    let timeout;
    function showNotification(n: CustomNotification) {
        if (!n || n.onlyOnSidePanel) return;
        clearTimeout(timeout);

        if (notificationToShow) notificationToShow = null; 
        
        if (!document.hasFocus() && Notification.permission === 'granted') {
            new Notification(n.title, {
                'silent': !n.sound,
                'body': n.content,
            });
        } else {
            notificationToShow = n;
            timeout = setTimeout(() => notificationToShow = null, 8000);
        }
    }

    async function togglePanel() {
        showPanel = !showPanel;
        if (showPanel) {
            await tick();
            nPanel.scrollTop = nPanel.scrollHeight;
        }

        const targets = document.getElementById('big-clock-container');
        anime({
            begin() { targets.classList.add('pointer-events-none') },
            targets,
            duration: 500,
            scale: showPanel ? 0.98 : 1,
            translateY: showPanel ? '+=2.5rem' : ($screenSaver ? 0 : bigClockSSoffset),
            opacity: showPanel ? 0.5 : 1,
            easing: 'easeOutQuad',
            complete() { targets.classList.remove('pointer-events-none') },
        });
    }
</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if $notifications.length}
        <div bind:this={nPanel} class="absolute bottom-0 right-0 -z-1 overflow-y-scroll max-h-screen" transition:fade>
            {#if showPanel}
                <div class="bottom-10 pt-5" transition:fly={{x: 20}}>
                    {#each [...$notifications].reverse() as n}
                        <div class="my-3">
                            <NotificationComponent forceSilent data={n} expire={false} showTimestamp={true} />
                        </div>
                    {/each}
                </div>
            {/if}
            <Bubble classes="text-right text-primary relative cursor-pointer">
                <div class="relative"  class:opacity-50={$screenSaver || !showPanel}>
                    <i class="lnr lnr-alarm text-2xl" on:click={() => togglePanel()}></i>
                </div>
            </Bubble>
        </div>
    {/if}
    {#if notificationToShow}
        <NotificationComponent data={notificationToShow} expire={true} />
    {/if}
</aside>