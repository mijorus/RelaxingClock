<script lang="ts">
import { onMount, tick } from "svelte";
import { fade, fly } from "svelte/transition";
import { screenSaver, tips } from "../../../stores/globalState";
import { latestNotification, notifications } from "../../../stores/notifications";
import type { CustomNotification } from "../../../types";
import Bubble from "../../elements/Bubble.svelte";
import NotificationComponent from "./CustomNotificationComponent.svelte";
import anime from "animejs";
import { bigClockSSoffset, cbDefault, eaElasticDefault } from "../../../utils/animations";
import { shortcuts } from "../../../stores/rooster";

    let notificationToShow: CustomNotification = null;
    let showPanel = false;
    let nPanel: HTMLElement;

    $: showNotification($latestNotification);

    let timeout;
    let lastNArraySize = 0;
    function showNotification(n: CustomNotification) {
        if ($notifications.length > lastNArraySize || !showPanel) {
            if (!n || n.limitDisplay === 'sidePanelOnly') return;
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

        lastNArraySize = $notifications.length;
    }

    async function togglePanel(show: boolean = undefined) {
        if (show === undefined) showPanel = !showPanel;
        else showPanel = show;
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

    onMount(() => {
        if (!process.env.production) {
            shortcuts.set('notifications', {
                'background': 'purple',
                'color': 'white',
                'arguments': {
                    'create': {
                        async callback() {
                            notifications.create({'title': 'test' + Date.now(), 'content': 'lorem ipsum', 'icon': ''});
                            return true;
                        }
                    }
                }
            })
        }
    })
</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if $notifications.length && !$tips}
        <div bind:this={nPanel} class="absolute  bottom-0 right-0 -z-1 overflow-y-scroll max-h-screen" transition:fade>
            {#if showPanel}
                <div class="bottom-10 pt-5" in:fly={{x: 20}}>
                    {#each $notifications as n, i}
                        {#if n.limitDisplay !== 'notificationOnly'}
                            <div class="my-3" out:fly|local={{x: 20}}>
                                <div class="relative old-notification">
                                    <div class="remove absolute top-0 right-0 z-10 opacity-0 cursor-pointer transition-all inline-block" style="transform:translate(0%, -30%)"
                                        on:click={(e) => { const size = notifications.dismiss(i); if (size === 0) togglePanel(false); }} >
                                        <span class="lnr lnr-circle-minus text-xl text-white" ></span>
                                    </div>
                                    <NotificationComponent forceSilent data={n} expire={false} showTimestamp={true} />
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
            <Bubble classes="text-right text-primary relative ">
                <div class="relative transition-opacity n-panel-toggle" class:opacity-50={$screenSaver && !showPanel}>
                    <i class="lnr lnr-alarm text-2xl cursor-pointer rounded-full transition-all p-2 {showPanel ? 'bg-highlighted text-dark' : ''}"  
                        on:click={() => togglePanel()}></i>
                </div>
            </Bubble>
        </div>
    {/if}
    {#if notificationToShow}
        <NotificationComponent data={notificationToShow} expire={true} />
    {/if}
</aside>

<style>
    .n-panel-toggle:hover {
        opacity: 1 !important;
    }

    .old-notification:hover .remove{
        opacity: 100% !important;
    }
</style>