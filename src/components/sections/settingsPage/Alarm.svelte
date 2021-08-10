<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from '../../elements/settings/Buttons/Action.svelte';
import { onMount, tick } from 'svelte';
import moment, { Moment } from 'moment';
import { fly } from 'svelte/transition';
import time from '../../../stores/time';
import { tips } from '../../../stores/globalState';
import { notifications } from '../../../stores/notifications';
import { shakeElement } from '../../../utils/utils';
import { clockFormat } from '../../../stores/storedSettings';
import AnimatedText from '../../elements/AnimatedText.svelte';
import Booleans from '../../elements/settings/Buttons/Booleans.svelte';
import anime  from 'animejs';
import { shortcuts } from '../../../stores/rooster';
import { ring } from '../../../handlers/alarm';

    let hours: string;
    let minutes: string;
    let alarm: Moment; // local object used to set an alarm, valid until saveInput() is called
    let creationBox: HTMLElement;
    let alarmIsSet = false;
    let isAM = moment().hours() < 12;

    $: format = $clockFormat === '24h' ? 'HH:mm' : 'h:mm a';
    $: alarmIsTomorrow = false;
    $: primaryBoxTitle = alarmIsSet 
        ? `${localStorage.getItem('alarmTitle') ? '"'+localStorage.getItem('alarmTitle') + '" r' : 'R'}ings ${alarmIsTomorrow ? 'tomorrow' : ''} at ${alarm.format(format)}` 
        : 'Set an alarm';

    let title: HTMLInputElement;
    let creationBoxOpened = false;
    const minutesPassedCheck = 15;

    $: periodicCheck($time);

    function periodicCheck(time: Moment) {
        if (time.seconds() === 1) {
            const alarmTime = localStorage.getItem('alarmTime');
            if (alarmTime && (parseInt(alarmTime) <= time.unix()) && (time.unix() - parseInt(alarmTime) <= minutesPassedCheck * 60)) {
                console.log('Ring!');
            } else if (alarmTime && (time.unix() - parseInt(alarmTime) > minutesPassedCheck * 60)) {
                localStorage.removeItem('alarmTime');
            }
        }
    }

    function snoozeAlarm() {
        const alarmTime = localStorage.getItem('alarmTime');
        if (alarmTime) localStorage.setItem('alarmTime', (parseInt(alarmTime) + minutesPassedCheck * 60).toString());
    }

    function clearAlarmMemory() {
        ['alarmTime', 'alarmTitle'].forEach(el => {if (localStorage.getItem(el)) localStorage.removeItem(el)});
    }

    function handleAlarmKeyDown(event: KeyboardEvent) {
        if (event.code.match(/enter/i) || event.key.length === 1 && (!event.code.match(/\d/) || (hours.length > 1 && minutes.length > 1))) {
            event.preventDefault();
        }
    }

    function handleAlarmKeyUp() {
        let timeCompensation = $clockFormat === '12h' && parseInt(hours) < moment().hours() ? 12 : 0;
        alarm = moment().hours(parseInt(hours) + timeCompensation).minutes(parseInt(minutes));
        alarmIsTomorrow =  alarm.isBefore(moment());
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'Enter') { saveInput() }
        else if (event.code === 'Escape') { closeCreationBox() }
    }

    async function openCreationBox() {
        alarm = moment().minutes(0).add(2, 'm'); alarmIsTomorrow = false;
        creationBoxOpened = true;
        await tick();
        //@ts-ignore
        document.querySelector('#alarm-h-input').focus();
        tips.set([
            {name: 'Create', shortcut: 'Ctrl+Enter'},
            {name: 'Dismiss', shortcut: 'Esc'},
        ]);
    }

    function saveInput() {
        if (!alarm.isValid() || parseInt(hours) > ($clockFormat === '24h' ? 24 : 12) || parseInt(minutes) > 59) {
            shakeElement(creationBox);
            return;
        }

        clearAlarmMemory();

        if (alarm && alarm.isBefore(moment())) alarm.add(1, 'day');
        localStorage.setItem('alarmTime', alarm.unix().toString());
        if (title.value.length > 0) localStorage.setItem('alarmTitle', title.value);
        notifications.create({ 'content': `Set ${!alarmIsTomorrow ? '' : ' tomorrow'} at ${alarm.format(format)}`, title: 'Alarm created', icon: 'lnr lnr-clock' });

        closeCreationBox();
        alarm = null;
        alarmIsSet = true;
    }

    function closeCreationBox() {
        creationBoxOpened = false;
        tips.set(null);
    }

    function dismissAlarm() {
        alarmIsSet = undefined;
        clearAlarmMemory();
    }

    onMount(() => {
        shortcuts.set('alarm', {
            color: process.env.BACKGROUND_DARK, 
            background: 'red',
            arguments: {
                set: {
                    async callback(p) {
                        return true;
                    }
                }
            }
        })

        ring();
    })
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
                <div class="text-8xl p-2 mt-4 mb-1 text-center font-bold font-clock">
                    <span 
                        id="alarm-h-input" bind:innerHTML={hours} contenteditable class="time-input"
                        on:keydown={handleAlarmKeyDown} on:keyup={handleAlarmKeyUp}>
                            {moment().format(format.split(':')[0])}</span><span class="opacity-70">:</span><span 
                        bind:innerHTML={minutes} contenteditable class="time-input"
                        on:keydown={handleAlarmKeyDown} on:keyup={handleAlarmKeyUp}>
                            {moment().add(2, 'm').format('mm')}
                    </span>
                    <div class="text-sm mt-1">
                        <div class="text-secondary my-1"><AnimatedText text={alarmIsTomorrow ? 'tomorrow' : ''}/></div>
                        {#if $clockFormat === '12h'}<div class="inline-block"><Booleans state={isAM} states={['AM', 'PM']} label=""/></div>{/if}
                    </div>
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
        label={{text: primaryBoxTitle}} 
        description={{text:'Set an alarm that wakes you up with beautiful colors. And don\'t worry if you accidentally close the tab, I\'ll keep that in mind :)', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action 
            custom
            label={alarmIsSet ? 'Dismiss' : "Set"} on:click={alarmIsSet ? dismissAlarm :openCreationBox} 
            customClass={alarmIsSet ? 'bg-red-700 border-red-700 text-primary' : 'text-secondary bg-highlighted border-primary'}  
        ></Action>
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