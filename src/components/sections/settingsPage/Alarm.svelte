<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from '../../elements/settings/Buttons/Action.svelte';
import { onMount, tick } from 'svelte';
import { canBeSummoned, shortcuts } from '../../../stores/rooster';
import moment, { Moment } from 'moment';
import { fade, fly } from 'svelte/transition';
import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';
import time from '../../../stores/time';
import { tips } from '../../../stores/globalState';
import { notifications } from '../../../stores/notifications';
import type { ReminderType, RoosterExample, StoredReminder } from '../../../types';
import { shakeElement } from '../../../utils/utils';

    type BoxAtType = 'minutes' | 'hour';

    let hours: HTMLElement;
    let minutes: HTMLElement;
    let creationBox: HTMLElement;

    let ready = false;
    let title: HTMLInputElement;
    let creationBoxOpened = false;
    // const color = '#57ceff';

    $: periodicCheck(ready, $time);

    async function periodicCheck(readyState: boolean, time: Moment) {
        if (time.minute() === 0) {
            // await runListCheck();
        
            // for (const reminder of futureReminders) {
            //     if (reminder.at < time.unix() && !reminder.done) {
            //         notifications.create({ 
            //             title: reminder.title, 
            //             content: reminder.type === 'repeated' ? 'Interact to dismiss' : '',
            //             icon: 'lnr lnr-calendar-full',
            //             color
            //         });

            //         if (reminder.type === 'simple') {
            //             RemindersDB.setDone(reminder.id);
            //         }

            //         else if (reminder.type === 'repeated') {
            //             RemindersDB.setDueTime(reminder.id, time.add(5, 'minutes'));
            //         }
            //     }
            // }
        }
    }

    function handleAlarmKeyDown(event: KeyboardEvent) {
        if (event.key.length === 1 && (!event.code.match(/\d/) || (hours.textContent.length > 1 && minutes.textContent.length > 1))) {
            event.preventDefault();
        }
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'Enter') { saveInput() }
        else if (event.code === 'Escape') { closeCreationBox() }
    }

    async function openCreationBox() {
        creationBoxOpened = true;
        await tick();
        hours.focus();
    }

    function saveInput() {

    }

    function closeCreationBox() {
        creationBoxOpened = false;
    }
</script>

{#if creationBoxOpened}
    <div class="w-full bottom-2 left-0 flex justify-center fixed z-30"
        bind:this={creationBox}
        on:keydown={handleShortcuts}
        transition:fly={{y: 100, duration: 300}}
    >
        <div
            class="py-4 h-auto font-primary bg-secondary text-primary rounded-2xl shadow-box">
            <h2 class="text-4xl font-bold mr-20 text-center w-full">Set the alarm</h2>
            <div class="my-2 flex flex-col justify-center">
                <div class="text-8xl p-2 my-4 text-center time-input font-extrabold font-clock">
                    <span 
                        bind:this={hours} contenteditable class="time-input"
                        on:keydown={handleAlarmKeyDown}>
                            {moment().format('HH')}</span>:<span 
                        bind:this={minutes} contenteditable class="time-input"
                        on:keydown={handleAlarmKeyDown}>
                            {moment().add(2, 'm').format('mm')}
                    </span>
                </div>
                <div class="inline-block m-auto">
                    <div class="my-2">
                        <input type="text" class="bg-white bg-opacity-20 text-primary w-72 rounded-md p-1" bind:this={title} placeholder="Title (optional)">
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-4">
                <span class="mx-1"><Action label="Create" on:click={saveInput}/></span>
                <span class="mx-1"><Action label="Cancel" custom customClass="border-2 border-red-400 text-red-400" on:click={closeCreationBox} /></span>
            </div>
        </div>
    </div>
{/if}

<SettingsBox>
    <Title title="Alarm">
        <TitleIcon>
            <i class="icon-clock-white bg-center settings-icon"><span class="path1"></span><span class="path2"></span></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Set an Alarm'}} 
        description={{text:'Set an alarm', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action label="Set" on:click={openCreationBox}></Action>
    </PrimaryBox>
</SettingsBox>

<style>
    .time-input {
        display: inline-block;
        transition: opacity .1s linear, transform .1s linear;
        opacity: 0.7;
    }

    .time-input:focus {
        transform: scale(1.2);
        opacity: 1;
        border: none;
        outline: none;
    }

    .time-input:focus-visible {
        border: none;
        outline: none;
    }
</style>