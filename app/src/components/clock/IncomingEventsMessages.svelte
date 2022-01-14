<script context="module" lang="ts">
    let updateDisplayText: CallableFunction;
    let queue: IncomingEventMessage[] = [];
    
    export function createIncomingEvent(incomingEvent: IncomingEventMessage) {
        if (!incomingEvent || !updateDisplayText) return;
        queue = [...queue, incomingEvent];
        updateDisplayText();
    }
</script>

<script lang="ts">
import { fly, slide, fade } from 'svelte/transition';
import { locSto, sleep } from '../../utils/utils';
import type { IncomingEventMessage } from "../../types";
import { onDestroy, onMount } from 'svelte';

let displayMessage: IncomingEventMessage;
let running = false;
onMount(() => {
    updateDisplayText = async function() {
        if (running) return;
        console.log('incoming event received');

        while (queue.length) {
            running = true;
            console.log('incoming event processing');

            displayMessage = queue[0];
            await sleep(10000);

            displayMessage = null;
            await sleep(500);
            
            queue.shift();
        }

        running = false;
    }
})

onDestroy(() => updateDisplayText = undefined)

</script>

{#if displayMessage}
    <div class="my-1 opacity-75 incoming-messages" transition:fly={{ y: 10 }}>
        <div class="text-primary text-base flex flex-row items-center gap-1 justify-center">
            <i class="bump {displayMessage.icon} text-2xl"></i> 
            <span class="max-w-80 flex flex-row justify-center">
                <span class="grow inline-block">{displayMessage.text}</span>
            </span>
        </div>
    </div>
{/if}

<style>
    @keyframes grow {
        0% {
            max-width: 0;
        }

        100% {
            max-width: 21rem;
        }
    }

    @keyframes bump {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.5);
        }

        100% {
            transform: scale(1);
        }
    }

    .grow {
        max-width: 0;
        overflow: hidden;
        animation: grow 1.5s linear 2.25s;
        animation-fill-mode: forwards;
        text-overflow: ellipsis;
        /* animation-delay: 1000s; */
    }

    .bump {
        animation: bump 0.75s ease-out;
        animation-iteration-count: 2;
    }

</style>