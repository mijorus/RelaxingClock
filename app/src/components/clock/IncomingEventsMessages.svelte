<script lang="ts">
import { fly, slide, fade } from 'svelte/transition';
import { locSto, sleep } from '../../utils/utils';
import type { IncomingEventMessage } from "../../types";
import { incomingEventsMessages } from '../../stores/notifications';

let displayMessage: IncomingEventMessage;
let queue: IncomingEventMessage[] = [];

$: updateDisplayText(queue);
$: updateQueue($incomingEventsMessages);

function updateQueue(incomingEvent: IncomingEventMessage) {
    queue.push(incomingEvent);
}

async function updateDisplayText(incomingEvents: IncomingEventMessage[]) {
    if (incomingEvents.length > 0) {
        displayMessage = incomingEvents[0];
        await sleep(10000);

        displayMessage = null;
        queue.shift();
    }
}

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
        /* animation-delay: 1000s; */
    }

    .bump {
        animation: bump 0.75s ease-out;
        animation-iteration-count: 2;
    }

</style>