<script lang="ts">
import { onMount, tick } from "svelte";
import { fade, fly } from "svelte/transition";
import { darkenClock, screenSaver, tips } from "../../../stores/globalState";
import { latestNotification, notifications } from "../../../stores/notifications";
import type { CustomNotification } from "../../../types";
import Bubble from "../../elements/Bubble.svelte";
import NotificationComponent from "./CustomNotificationComponent.svelte";
import anime from "animejs";
import { bigClockSSoffset, cbDefault, eaElasticDefault } from "../../../utils/animations";
import { canBeSummoned, shortcuts } from "../../../stores/rooster";
import {createIncomingEvent} from "../../clock/IncomingEventsMessages.svelte";

    let notificationToShow: CustomNotification = null;
    let notificationsInPanel: CustomNotification[] = [];
    let showPanel = false;
    let nPanel: HTMLElement;

    $: showNotification($latestNotification);
    $: {
        if ($notifications) {
            notificationsInPanel = []; 
            $notifications.forEach(n => {
                if (n.limitDisplay !== 'notificationOnly') notificationsInPanel = [n, ...notificationsInPanel]
            })
        } else if (showPanel && $notifications && !$notifications.length) {
            togglePanel(false);
        }
    }

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
            }

            notificationToShow = n;
            timeout = setTimeout(() => notificationToShow = null, 8000);
        }

        lastNArraySize = $notifications.length;
    }

    async function togglePanel(show: boolean = undefined) {
        showPanel = (show === undefined) ? !showPanel : show;
        if (showPanel) {
            await tick();
            nPanel.scrollTop = nPanel.scrollHeight;
        }

        canBeSummoned.set(!showPanel);
        darkenClock.set(showPanel);
    }

    onMount(() => {
        if (!process.env.production) {
            shortcuts.set('incoming', {
                    'background': 'white',
                    'color': 'black',
                    'arguments': {
                        'create': {
                            async callback() {
                                createIncomingEvent({'icon': 'fas fa-building', 'text': 'test test test test test'})
                                return true;
                            }
                        }
                    },
                })

            shortcuts.set('notifications', {
                'background': 'purple',
                'color': 'white',
                'arguments': {
                    'create': {
                        description: 'Oooops 🤭. This is only for testing purposes, you should not have seen it',
                        async callback() {
                            notifications.create({'title': 'test' + Date.now(), 'content': 'lorem ipsum', 'icon': '', 'elementId': 'reminders'});
                            return true;
                        }
                    }
                },
                async examples() {
                    return {
                        'group': [
                            {'argument': 'Create', 'example': 'create', 'selectable': true, tip: 'create a test notification'},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                            {'argument': 'Test', 'example': 'test', 'selectable': true},
                        ],
                        'namespace': 'Test'
                    }
                }
            })
        }
    })
</script>

<aside class="fixed right-0 bottom-0 z-40 mr-3 mb-5">
    {#if notificationsInPanel.length && !$tips}
        <div bind:this={nPanel} class="absolute  bottom-0 right-0 -z-1 overflow-y-scroll overflow-x-hidden max-h-screen" transition:fade>
            {#if showPanel}
                <div class="bottom-10 pt-5" in:fly={{x: 20}}>
                    {#each notificationsInPanel as n, i (n.id)}
                        {#if n.limitDisplay !== 'notificationOnly'}
                            <div class="my-3" out:fly|local={{x: 20}}>
                                <div class="relative old-notification">
                                    <div class="remove absolute top-0 right-0 z-10 opacity-0 cursor-pointer transition-all inline-block" style="transform:translate(0%, -30%)"
                                        on:click|stopPropagation={(e) => { const size = notifications.dismiss(n.id); if (size === 0) togglePanel(false); }} >
                                        <span class="lnr lnr-circle-minus text-xl text-white" ></span>
                                    </div>
                                    <NotificationComponent forceSilent data={n} expire={false} showTimestamp={true} inPanel={true} />
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