<script lang="ts">
import time from '../../stores/time';
import { fly, fade, scale } from 'svelte/transition';
import type { Moment } from 'moment';
import { RemindersDB } from '../../handlers/RemindersDB';
import { alarmTime } from '../../stores/storedSettings';

export let isHovered = false;

$: periodicCheck($time);
let incoming: {[key: string]: {isIncoming: boolean, color: string, icon: string, link: boolean}} = {
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
};

async function periodicCheck(time: Moment) {
    if (time && !(time.unix() % 2)) {
        incoming.reminders.isIncoming = (RemindersDB.db && (await RemindersDB.getAllByExpirationDate()).find(r => !r.done)) !== undefined;
        incoming.alarm.isIncoming = ($alarmTime !== undefined);
        incoming = incoming;
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
                        <a on:click|stopPropagation href="#{k}"><i class="inline-block mx-1 {incoming[k].icon}" style="color: {incoming[k].color};"in:fade></i></a>
                    {:else}
                        <span class="mx-1 inline-block" style="color: {incoming[k].color};" in:fade>&middot;</span>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
{/if}