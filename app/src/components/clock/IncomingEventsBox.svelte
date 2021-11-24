<script lang="ts">
import time from '../../stores/time';
import { fly, fade, scale } from 'svelte/transition';
import type { Moment } from 'moment';
import { RemindersDB } from '../../handlers/RemindersDB';
import { alarmTime } from '../../stores/storedSettings';
import { locSto } from '../../utils/utils';

export let isHovered = false;
export let withIncomingTrack = true;

$: periodicCheck($time);
let incoming: {[key: string]: {isIncoming: boolean, color: string, icon: string, link: boolean, iconColor?: string}} = {
    alarm: {
        isIncoming: false,
        color: '#ff6b6b',
        icon: 'lnr lnr-clock',
        link: true
    },
    reminders: {
        isIncoming: false,
        color: '#57ceff',
        icon: 'lnr lnr-calendar-full',
        link: true
    },
    pomodoro: {
        isIncoming: false,
        color: 'red',
        iconColor: 'white',
        icon: 'icon-tomato-bw',
        link: true
    },
};

async function periodicCheck(time: Moment) {
    if (time && !(time.unix() % 2)) {
        incoming.reminders.isIncoming = (RemindersDB.db && (await RemindersDB.getAllByExpirationDate()).find(r => !r.done)) !== undefined;
        incoming.alarm.isIncoming = ($alarmTime !== undefined);
        incoming.pomodoro.isIncoming = locSto('pomodoroState') ? true : false;
        incoming.pomodoro.color = locSto('pomodoroState') 
            ? locSto('pomodoroState') === 'focus' ? 'red' : 'green' 
            : 'white';
        incoming = incoming;

        if (withIncomingTrack && sessionStorage.getItem('nextSpotifySongEnd')) {
            const incomingSeconds = 20;
            const timeLeftToNext = (parseInt(sessionStorage.getItem('nextSpotifySongEnd')) - Date.now());
            if (timeLeftToNext > 0 && (timeLeftToNext  < (incomingSeconds * 1000))) {
                console.log('next Song incoming');
            } 
        }
    }
}

</script>

{#if (Object.keys(incoming)).find(k => incoming[k].isIncoming)}
    <div class="my-1 text-md opacity-50 flex justify-center incoming-elements">
        <div class="flex justify-center w-min">
            {#each Object.keys(incoming) as k (k)}
                {#if incoming[k].isIncoming}
                    {#if isHovered && !incoming[k].link}
                        <i class="inline-block mx-1 {incoming[k].icon}" style="color: {incoming[k].color};"in:fade></i>
                    {:else if isHovered && incoming[k].link}
                        <a on:click|stopPropagation href="#{k}"><i class="inline-block mx-1 {incoming[k].icon}" style="color: {incoming[k].iconColor ?? incoming[k].color};"in:fade></i></a>
                    {:else}
                        <span class="mx-1 inline-block" style="color: {incoming[k].color};" in:fade>&middot;</span>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
{/if}