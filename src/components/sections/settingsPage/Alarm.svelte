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
import { alarmIsRinging, tips } from '../../../stores/globalState';
import { notifications } from '../../../stores/notifications';
import { shakeElement } from '../../../utils/utils';
import { alarmTime, clockFormat } from '../../../stores/storedSettings';
import AnimatedText from '../../elements/AnimatedText.svelte';
import Booleans from '../../elements/settings/Buttons/Booleans.svelte';
import { canBeSummoned, shortcuts } from '../../../stores/rooster';
import { ring, clearAlarmMemory } from '../../../handlers/alarm';

    let hours: string;
    let minutes: string;
    let alarm: Moment; // local object used to set an alarm, valid until saveInput() is called
    let creationBox: HTMLElement;
    let isAM = moment().hours() < 12;

    $: format = $clockFormat === '24h' ? 'HH:mm' : 'h:mm a';
    $: alarmIsTomorrow = false;
    $: primaryBoxTitle = ($alarmTime && moment($alarmTime, 'X').isValid())
        ? `${localStorage.getItem('alarmTitle') ? '"'+localStorage.getItem('alarmTitle') + '" r' : 'R'}ings ${alarmIsTomorrow ? 'tomorrow' : ''} at ${moment($alarmTime, 'X').format(format)}` 
        : 'Set an alarm';

    let title: HTMLInputElement;
    let creationBoxOpened = false;
    const minutesPassedCheck = 15;
    
    $: periodicCheck($time);

    function periodicCheck(time: Moment, force = false) {
        if (force || time.seconds() === 0 && $alarmTime) {
            if (!$alarmIsRinging && (time.unix() >= $alarmTime) && ((time.unix() - $alarmTime) < (minutesPassedCheck * 60))) {
                ring();
            } else if (((moment($alarmTime, 'X').isSameOrBefore(moment().subtract(minutesPassedCheck, 'm'))))) {
                console.log('removing old alarms');
                clearAlarmMemory();
            }
        }
    }

    function handleAlarmKeyDown(event: KeyboardEvent) {
        if (event.code.match(/enter/i) || event.key.length === 1 && (!event.code.match(/\d/) || (hours.length > 1 && minutes.length > 1))) {
            event.preventDefault();
        }
    }

    function timeCompensation() {
        return ($clockFormat === '12h' && (parseInt(hours) < moment().hours()) ? 12 : 0);
    }

    function handleAlarmKeyUp() {
        const a = moment().hours(parseInt(hours) + timeCompensation()).minutes(parseInt(minutes));
        alarmIsTomorrow =  a.isBefore(moment());
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'Enter') { saveInput() }
        else if (event.code === 'Escape') { closeCreationBox() }
    }

    async function openCreationBox() {
        canBeSummoned.set(false);
        alarm = moment().add(2, 'm');
        creationBoxOpened = true;
        
        await tick();
        
        handleAlarmKeyUp();
        document.getElementById('alarm-h-input').focus();
        tips.set([ {name: 'Create', shortcut: 'Ctrl+Enter'}, {name: 'Dismiss', shortcut: 'Esc'}, ]);
    }

    function saveInput() {
        alarm = moment().hours(parseInt(hours) + timeCompensation()).minutes(parseInt(minutes))
        if (!alarm.isValid() || (parseInt(hours) > ($clockFormat === '24h' ? 24 : 12) || parseInt(minutes) > 59)) {
            shakeElement(creationBox);
            return;
        }

        createAlarm(title.value);
        closeCreationBox();
    }

    function createAlarm(alarmTitle?: string) {
        clearAlarmMemory();
        
        if (alarm && alarm.isBefore(moment())) alarm.add(1, 'day');
        alarmTime.set(alarm.seconds(0).unix());
        
        if (alarmTitle && alarmTitle.length > 0) localStorage.setItem('alarmTitle', alarmTitle);
        
        alarmIsTomorrow = !alarm.isSame(moment(), 'day');
        notifications.create({ 'content': `Set ${!alarmIsTomorrow ? '' : ' tomorrow'} at ${alarm.format(format)}`, title: 'Alarm created', icon: 'lnr lnr-clock', 'limitDisplay': 'notificationOnly' });
    }

    function closeCreationBox() {
        canBeSummoned.set(true);
        creationBoxOpened = false;
        tips.set(null);
        alarm = null;
    }

    function dismissAlarm(notify = false) {
        clearAlarmMemory();
        if (notify) notifications.create({ 'content': ``, title: 'Alarm dismissed', icon: 'lnr lnr-clock' });
    }

    function createFromRooster(p: string) {
        p = p.trim();

        const alarmParam = p.split(' ')[0];
        if (alarmParam.endsWith('m') || alarmParam.endsWith('h')) {
            //@ts-ignore
            alarm = moment().add(parseInt(alarmParam), alarmParam.match(/\D$/)[0])
        } else {
            alarm = moment(p.split(' ')[0], format)
        }

        if (!alarm.isValid()) return false;
        // @todo handle 12h format
        createAlarm(p.match(/\s/) ? p.slice(p.match(/\s/).index + 1) : null);
        return true;
    }

    onMount(() => {
        periodicCheck(moment(), true);
    
        shortcuts.set('alarm', {
            color: process.env.BACKGROUND_DARK, 
            background: 'red',
            arguments: {
                '': {
                    async callback(p) {
                        return createFromRooster(p);
                    }
                },
                set: {
                    async callback(p) {
                        return createFromRooster(p);
                    }
                },
                dismiss: {
                    async callback() {
                        if (!$alarmTime) return false;
                        dismissAlarm(true);
                        return true;
                    }
                }
            },
            async examples(a, p) {
                return {
                    'namespace': 'Examples', 
                    'group': [
                        {'argument': 'set', 'example': (a !== 'dismiss' && p.match(' ')) ? '[optional] Title of the alarm' : '[time]', 'tip': 'or just press left arrow'},
                        {'argument': 'set', 'example': '16:20 My power nap'},
                        {'argument': 'set', 'example': '21m Very important meeting', 'tip': 'Amount of minutes (m) or hours (h)'},
                        {'argument': 'dismiss', 'example': '', 'tip': 'Dimiss the alarm'},
                    ]
                };
            }
        })
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
                            {alarm ? alarm.format(format.split(':')[0]) : ''}</span><span class="opacity-70">:</span><span 
                        bind:innerHTML={minutes} contenteditable class="time-input"
                        on:keydown={handleAlarmKeyDown} on:keyup={handleAlarmKeyUp}>
                            {alarm ? alarm.format('mm') : ''}
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

<SettingsBox id="alarm">
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
            label={$alarmTime ? 'Dismiss' : "Set"} on:click={(e) =>{ $alarmTime ? dismissAlarm() : openCreationBox()} } 
            customClass={$alarmTime ? 'bg-red-700 border-red-700 text-primary' : 'text-secondary bg-highlighted border-primary'}  
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