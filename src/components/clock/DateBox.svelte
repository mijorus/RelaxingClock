<script lang="ts">
import time from '../../stores/time';
import { fly, fade, scale } from 'svelte/transition';
import type { Moment } from 'moment';
import { RemindersDB } from '../../handlers/RemindersDB';
import { alarmTime } from '../../stores/storedSettings';

$: periodicCheck($time);
let isHovered = false;
let incoming: {[key: string]: {isIncoming: boolean, color: string, icon: string}} = {
    alarm: {
        isIncoming: false,
        color: '#ff6b6b',
        icon: 'lnr lnr-clock'
    },
    reminders: {
        isIncoming: false,
        color: '#57ceff',
        icon: 'lnr lnr-calendar-full'
    },
};

async function periodicCheck(time: Moment) {
    if (time && !(time.unix() % 2)) {
        if ((await RemindersDB.getAllByExpirationDate()).find(r => !r.done)) {
            incoming.reminders.isIncoming = true;
        } else {
            incoming.reminders.isIncoming = false;
        }

        incoming.alarm.isIncoming = ($alarmTime !== undefined);
        incoming = incoming;
    }
}

</script>

<div class="absolute text-xl text-center text-bg left-2/4 -mt-14 transform -translate-x-1/2 z-20 datebox" 
    on:mouseenter|stopPropagation={() => isHovered = true}
    on:mouseleave|stopPropagation={() => isHovered = false}
    in:fly={{'y': 40, 'duration': 1000}} 
    out:fade={{'duration': 50}}>
    <div class="mb-1">
        <div class="bg-highlighted rounded-full inline-block px-2 py-1">{$time.format('dddd, D MMMM')}</div>
    </div>
    {#if (Object.keys(incoming)).find(k => incoming[k].isIncoming)}
        <div class="my-1 text-md opacity-50 flex justify-center incoming-elements">
            <div class="flex justify-center w-min">
                {#each Object.keys(incoming) as k (k)}
                    {#if incoming[k].isIncoming}
                        {#if isHovered}
                            <i class="inline-block mx-1 {incoming[k].icon}" style="color: {incoming[k].color};"in:fade></i>
                        {:else}
                            <span class="mx-1 inline-block" style="color: {incoming[k].color};" in:fade>&middot;</span>
                        {/if}
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>