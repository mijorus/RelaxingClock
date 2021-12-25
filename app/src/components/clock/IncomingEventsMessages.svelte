<script lang="ts">
import time from '../../stores/time';
import { fly, slide, fade } from 'svelte/transition';
import type { Moment } from 'moment';
import { RemindersDB } from '../../handlers/RemindersDB';
import { alarmTime } from '../../stores/storedSettings';
import { locSto, sleep } from '../../utils/utils';
import AnimatedText from '../elements/AnimatedText.svelte';
import { spotifyPlayerState } from '../../stores/spotify';

type IncomingEvent = {icon: string, text?: string}

let displayMessage: IncomingEvent;
let incomingEvents: IncomingEvent[] = [];

let incomingSpotifySongId: string;

$: periodicCheck($time);

async function updateDisplayText() {
    if (incomingEvents.length > 0) {
        displayMessage = incomingEvents[0];
        await sleep(10000);
        console.log('Label updated');

        if (displayMessage) {
            incomingEvents.shift();
        }

    } else {
        displayMessage = null;
    }
}

async function periodicCheck(time: Moment) {
    if (time && !(time.unix() % 3)) {
        // Spotify
        if (sessionStorage.getItem('nextSpotifySongEnd')) {
            const nextId = $spotifyPlayerState?.track_window?.next_tracks[0]?.id;
            if (nextId) {
                const incomingSeconds = 25;
                const timeLeftToNext = (parseInt(sessionStorage.getItem('nextSpotifySongEnd')) - Date.now());

                if (timeLeftToNext > 0 && (timeLeftToNext  < (incomingSeconds * 1000)) && (nextId !== incomingSpotifySongId)) {
                    console.log('next Song incoming');
                    incomingEvents.push({icon: 'fab fa-spotify', 'text': 'Next song · '+$spotifyPlayerState.track_window.next_tracks[0].name});
                    incomingSpotifySongId = nextId;
                }
            }
        }


       updateDisplayText();
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