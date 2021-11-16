<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from '../../elements/settings/Buttons/Action.svelte';
import NestedBox from '../../elements/settings/NestedBox.svelte';
import { onMount, tick } from 'svelte';
import { canBeSummoned, shortcuts } from '../../../stores/rooster';
import moment, { Moment } from 'moment';
import { fade, fly, slide } from 'svelte/transition';
import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';
import time from '../../../stores/time';
import { RemindersDB } from '../../../handlers/RemindersDB';
import { tips } from '../../../stores/globalState';
import { notifications } from '../../../stores/notifications';
import type { ReminderType, RoosterExample, StoredReminder } from '../../../types';
import { shakeElement } from '../../../utils/utils';
import AnimatedText from '../../elements/AnimatedText.svelte';
import Booleans from '../../elements/settings/Buttons/Booleans.svelte';
import { remindersRepeatedDefault } from '../../../stores/storedSettings';

    type BoxAtType = 'minutes' | 'hour';

    let minutesFromNow: number; 
    let isPersistent: boolean; 
    let title = '';
    let creationBoxType: 'Create' | 'Edit' = 'Create';
    let reminderToEdit: StoredReminder;

    let reminderAtBox: string;
    let boxSelectedAt: BoxAtType = 'minutes';
    let creationBox: HTMLElement;

    let ready = false;
    let creationBoxOpened = false;
    let reminders: Array<StoredReminder> = [];
    let futureReminders: Array<StoredReminder> = [];
    let doneReminders: Array<StoredReminder> = [];

    const color = '#57ceff';

    $: periodicCheck(ready, $time);

    async function periodicCheck(readyState: boolean, time: Moment) {
        if (readyState && (time.unix() % 10 === 0)) {
            await runListCheck();
        
            for (const reminder of futureReminders) {
                if (reminder.at < time.unix() && !reminder.done) {
                    notifications.create({
                        sound: true,
                        title: reminder.title, 
                        content: reminder.type === 'repeated' ? 'Interact to dismiss' : '',
                        icon: 'lnr lnr-calendar-full',
                        limitDisplay: reminder.type ? 'notificationOnly' : null,
                        color
                    });

                    if (reminder.type === 'simple') {
                        RemindersDB.setDone(reminder.id);
                    }

                    else if (reminder.type === 'repeated') {
                        RemindersDB.setDueTime(reminder.id, moment().add(5, 'minutes'));
                    }
                }
            }
        }
    }

    async function runListCheck() {
        if (!ready) return;
        reminders = await RemindersDB.getAllByExpirationDate();
        futureReminders = []; doneReminders = [];
        reminders.forEach(r => r.done ? doneReminders.unshift(r) : futureReminders.push(r));
    }

    async function createReminder(title: string, at: Moment, type: ReminderType, edit = false) {
        edit  
            ? await RemindersDB.updatePending(reminderToEdit.id, { title, type, 'at': at.unix(), done: false })
            : await RemindersDB.create({ title, at: at.unix(), type, done: false });

        runListCheck();
    }
    
    async function saveInput() {
        if (title === '' || !minutesFromNow || reminderAtBox === '') {
            shakeElement(creationBox);
            return;
        }

        const timestamp = boxSelectedAt === 'minutes' ? moment().add(minutesFromNow, 'minutes') : moment(reminderAtBox, 'HH:mm');
        if (!timestamp.isValid()) {
            shakeElement(creationBox);
            return;
        }

        await createReminder(title, timestamp, isPersistent ? 'repeated' : 'simple', (creationBoxType === 'Edit' && reminderToEdit !== undefined))
        closeCreationBox();
    }

    async function openCreationBox(mFromNow = undefined, persistent = false) {
        minutesFromNow = mFromNow || 10; 
        isPersistent = persistent || $remindersRepeatedDefault; 
        creationBoxOpened = true;
        reminderAtBox = moment().add(minutesFromNow, 'minutes').format('HH:mm');
        canBeSummoned.set(false);
        
        await tick();
        document.getElementById('reminder-title-input').focus();
        tips.set([
            {name: 'Create', shortcut: 'Ctrl+Enter'},
            {name: 'Dismiss', shortcut: 'Esc'},
        ]);
    }

    function closeCreationBox() {
        reminderToEdit = undefined;
        creationBoxType = 'Create';
        creationBoxOpened = false;
        title = '';
        canBeSummoned.set(true);
        tips.set(null);
    }

    async function openEditBox(id: number) {
        reminderToEdit = await RemindersDB.get(id);
        title = reminderToEdit.title;
        creationBoxType = 'Edit';
        openCreationBox(moment(reminderToEdit.at, 'X').diff(moment(), 'minutes'), reminderToEdit.type === 'repeated');
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'Enter') { saveInput() }
        else if (event.code === 'Escape') { closeCreationBox() }
    }

    async function handleRoosterShortcut(params: string) {
        const tokens = params.split(/\s(.+)/);
        let title = (tokens[1] ?? tokens[0]).trim(), at: Moment;
        
        if (tokens[0].startsWith('tomorrow@') || tokens[0].startsWith('tm@')) {
            at = moment(tokens[0].replace(/[^@]+/, ''), 'HH:mm');
        }

        else if (tokens[0].match(/^\d{1,2}m/) || tokens[0].match(/^\d{1,2}h/)) {
            const unit = tokens[0].match(/^\d{1,2}m/) ? 'm' : 'h';
            at = moment().add(parseInt(tokens[0].match(/^\d{1,2}/)[0]), unit);
        }

        else if (tokens[0].match(/:/) && moment(tokens[0], 'HH:mm').isValid()) {
            const when = moment(tokens[0], 'HH:mm');
            at = when.isSameOrBefore(moment()) ? when.add(1, 'day') : when;
        }
        
        else { 
            title = params.trim()
            at = moment().add(10, 'm');
        }
        
        let type: ReminderType = $remindersRepeatedDefault ? 'repeated' : 'simple';
        if (params.match(/!$/)) {
           type = $remindersRepeatedDefault ? 'simple' : 'repeated';
           title = title.replace(/!$/, '');
        }
        
        await createReminder(title, at, type);
        notifications.create({ 
            title: 'Reminder set!', 
            content: `${at.fromNow()} "${title}"`,
            icon: `lnr ${type === 'repeated' ? 'lnr-history' :'lnr-calendar-full'}`,
            limitDisplay: 'notificationOnly',
            color,
        });
        
        return true;
    }

    onMount(async () => {
        try {
            await tick();
            
            await RemindersDB.initDB();
            await RemindersDB.dbCleanUp();
            reminders = await RemindersDB.getAllByExpirationDate();
            ready = true;

            shortcuts.set('reminder', {
                background: color,
                arguments: {
                    create: {
                        active: true,
                        quickLaunch: 'r',
                        callback: p => handleRoosterShortcut(p),
                    },
                    dismiss: {
                        active: true,
                        callback: async (p, id: number) => {
                            try {
                                await RemindersDB.setDone(id);
                                await runListCheck();
                                return true;
                            } catch (e) {
                                console.log(e);
                                return false;
                            }
                        },
                    }
                },
                async examples(arg, p) {
                    let tips: RoosterExample[] = [];
                    if (arg.startsWith('d') ) {
                        if (!futureReminders.length) tips.push({ argument: 'dismiss', example: 'No pending reminders' })
                        else futureReminders.forEach(r => tips.push({ argument: '', example: r.title, tip: moment(r.at, 'X').fromNow(), selectable: true, id: r.id }));
                    } else {
                        tips = [ 
                            { argument: 'create', example: '10m Do some yoga', tip: 'Set a reminder in 10 minutes' },
                            { argument: 'create', example: '1h Check for new emails !', tip: 'Use trailing ! for persistent reminders' },
                            { argument: 'dismiss', example: '#', tip: 'Dismiss reminder #'}
                        ]
                    }
                    
                    return {'group': tips, 'namespace': 'Dismiss'};
                }
            });
        } catch(err) {
            // Indexed Db error, valid fore the whole app
            console.error(err);
            notifications.create({
                'sound': true,
                'content': 'Ooops! I could\'t load the application properly. Are you running Firefox with an anonymous tab?',
                'title': 'An error occured',
                'icon': 'fas fa-exclamation-circle'
            })
        }
    });

</script>

{#if creationBoxOpened}
    <div class="w-full bottom-2 left-0 flex justify-center fixed z-30"
        bind:this={creationBox}
        on:keydown={handleShortcuts}
        transition:fly={{y: 100, duration: 300}}>
        <div
            class="py-4 h-auto font-primary bg-secondary text-primary rounded-2xl shadow-box">
            <h2 class="text-4xl font-bold mr-20 text-center font-title w-full">Create a reminder</h2>
            <div class="my-2 flex flex-col justify-center">
                <div class="inline-block m-auto">
                    <div class="my-2">
                        <h3 class="text-xl font-bold">Title</h3>
                        <input id="reminder-title-input" type="text" class="bg-white bg-opacity-20 text-primary w-72 rounded-md p-1" bind:value={title}>
                    </div>
                    <div class="{boxSelectedAt === 'minutes' ? '' : 'opacity-25'}" on:click={() => boxSelectedAt = 'minutes'}>
                        <span>in</span>
                        <input type="number" class="mx-2 bg-white bg-opacity-20 text-primary w-10 rounded-md px-1" bind:value={minutesFromNow}>
                        <span>minutes</span>
                    </div>
                    <div class="mt-2 {boxSelectedAt === 'hour' ? '' : 'opacity-25'}" on:click={() => boxSelectedAt = 'hour'}>
                        <span>at</span>
                        <input type="text" class="mx-2 bg-white bg-opacity-20 text-primary w-16 rounded-md px-1" bind:value={reminderAtBox}>
                    </div>
                    <div class="my-3">
                        <Checkbox checked={isPersistent} on:change={() => isPersistent = !isPersistent}/><span>Repeat</span>
                        <div class="text-secondary text-sm">every 5 min until dismiss</div>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-4">
                <span class="mx-1"><Action label={creationBoxType} on:click={saveInput}/></span>
                <span class="mx-1"><Action label="Dismiss" custom customClass="border-2 border-red-400 text-red-400" on:click={closeCreationBox} /></span>
            </div>
        </div>
    </div>
{/if}

<SettingsBox unsupported={!ready} id="reminders">
    <Title title="Reminders">
        <TitleIcon>
            <i class="lnr lnr-calendar-full text-primary settings-title-icon" style="color: {color};"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Create a reminder'}} 
        description={{text:'Set and manage reminders', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action label="Create" on:click={() => openCreationBox()}></Action>
    </PrimaryBox>
    <NestedBox label="Create as repeated by default">
        <Booleans label="default persistent" state={$remindersRepeatedDefault} on:change={({detail}) => remindersRepeatedDefault.set(detail)}/>
    </NestedBox>
    <NestedBox label="{futureReminders.length ? '• ' : ''}All your reminders" bordered={false} available={reminders.length > 0} expandable>
        {#if futureReminders.length}
            <div class="text-primary font-primary bg-primary bg-opacity-50 p-2 rounded-xl mt-3">
                {#each futureReminders as r }
                    <div class="my-2 overflow-x-hidden reminder p-2 rounded-md border border-secondary" transition:fly={{y: -10}}>
                        <span class="whitespace-nowrap"><AnimatedText fade={false} text={r.title} /></span>
                        <span class="text-secondary">
                            {moment(r.at, 'X').fromNow()}
                            {#if r.type === 'repeated'}<span class="lnr lnr-sync text-sm"></span>{/if}
                        </span>
                        <span class="float-right">
                            <i class="px-2 md:p-0 lnr lnr-pencil text-secondary cursor-pointer" on:click={() => openEditBox(r.id)}></i>
                            <i class="px-2 md:p-0 lnr lnr-circle-minus text-red-600 cursor-pointer" on:click={async () => { await RemindersDB.setDone(r.id); runListCheck() }}></i>
                        </span>
                    </div>
                {/each}
            </div>
        {/if}
        {#if doneReminders.length}
            <div class="text-primary font-primary bg-primary bg-opacity-50 p-2 rounded-xl mt-3 max-h-96 overflow-y-scroll">
                {#each doneReminders as r }
                    <div class="my-2 overflow-x-hidden reminder p-2 border border-secondary rounded-md done-reminder" transition:fly={{y: -10}}>
                        <span class="whitespace-nowrap"><AnimatedText fade={false} text={r.title} /></span>
                        {#if r.doneAt}<span class="text-secondary">{moment(r.doneAt, 'X').fromNow()}</span>{/if}
                        <span class="float-right cursor-pointer" on:click={async () => { await RemindersDB.remove(r.id); runListCheck() }}>
                            <i class="icon-checkmark text-md r-icon text-green-400 delete-rem-i-check" ></i>
                            <i class="lnr lnr-trash text-md r-icon text-red-600 delete-rem-i-cross hidden"></i>
                        </span>
                    </div>
                {/each}
            </div>
        {/if}
    </NestedBox>
</SettingsBox>

<style>
    .reminder { transition: background .2s linear;}

    .reminder:hover {
        background-color: rgba(255, 255, 255, 0.13);
    }

    .done-reminder:hover .delete-rem-i-check {
        display: none;
    }

    .done-reminder:hover .delete-rem-i-cross {
        display: inline !important;
    }

    .r-icon {
        animation: reveal .2s linear;
    }

    @keyframes reveal {
        0% { opacity: 0; transform: translateX(-20%);}
        100% { opacity: 1; transform: translateX(0%);}
    }
</style>