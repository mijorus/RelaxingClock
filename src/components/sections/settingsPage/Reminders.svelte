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
    import { fly } from 'svelte/transition';
    import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';
    import time from '../../../stores/time';
    import { Reminders } from '../../../handlers/Reminder';
    import { tips } from '../../../stores/globalState';

    let ready = false;
    let title: HTMLInputElement;
    let minutesFromNow = 10;
    let creationBoxOpened = false;
    let isPersistent = false;

    $: periodicCheck(ready, $time);

    async function periodicCheck(readyState: boolean, time: Moment) {
        if (readyState && time.format('s') === '59') {
            const reminders = await Reminders.getAllByExpirationDate();

            for (const reminder of reminders) {
                if (reminder.at > time.unix()) {
                    console.log('ring', reminder.title);
                }
            }
        }
    }

    function createReminder(title: string, at: Moment, data = {}) {
        return Reminders.create(title, at, {type: 'simple'});
    }
    
    async function saveInput() {
        if (title.value === '' || !minutesFromNow) return;

        const timestamp = moment().add(minutesFromNow, 'minutes');
        await createReminder(title.value, timestamp, {type: 'simple'});
        creationBoxOpened = false;
    }

    async function openCreationBox() {
        creationBoxOpened = true;
        await tick();
        canBeSummoned.set(false);
        title.focus();
        tips.set([
            {name: 'Create', shortcut: 'Ctrl+Enter'},
            {name: 'Dismiss', shortcut: 'Esc'},
        ]);
    }

    function closeCreationBox() {
        creationBoxOpened = false;
        canBeSummoned.set(true);
        tips.set(null);
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === 'Enter') {
            saveInput();
        }

        else if (event.code === 'Escape') {
            closeCreationBox();
        }
    }

    async function handleRoosterShortcut(params: string) {
        let title: string, at: Moment;
        const tokens = params.split(/\s(.+)/);
        console.log(tokens);
        
        
        if (tokens[0].startsWith('today@')) {
            at = moment(tokens[0].replace(/^today@/, ''), 'HH:mm');
            title = tokens[1];
        }

        else if (tokens[0].match(/^\d{1,2}m/)) {
            at = moment().add(parseInt(tokens[0].match(/^\d{1,2}/)[0]));
            title = tokens[1];
        }

        else {
            return false;
        }

        await createReminder(title, at, {});
        return true;
    }

    onMount(async () => {
        try {
            await Reminders.initDB();
            ready = true;

            shortcuts.set('reminder', {
                background: '#57ceff',
                arguments: {
                    create: {
                        active: true,
                        callback: p => handleRoosterShortcut(p),
                    }
                }
            });
        } catch(err) {
            console.error(err);
        }
    });

</script>

{#if creationBoxOpened}
    <div 
        transition:fly={{y: 100, duration: 300}}
        on:keydown={handleShortcuts}
        class="fixed bottom-2 p-4 h-auto font-primary bg-secondary text-primary transform -translate-x-2/4 left-2/4 rounded-2xl z-50 shadow-box">
        <h2 class="text-4xl font-bold mr-20 text-center w-full">Create a reminder</h2>
        <div class="my-2 flex flex-col justify-center">
            <div class="inline-block m-auto">
                <div class="my-2">
                    <h3 class="text-xl font-bold">Title</h3>
                    <input type="text" class="bg-white bg-opacity-20 text-primary w-72 rounded-md p-1" bind:this={title}>
                </div>
                <div>
                    <span>in</span>
                    <input type="number" class="mx-2 bg-white bg-opacity-20 text-primary w-10 rounded-md px-1" bind:value={minutesFromNow}>
                    <span>minutes</span>
                </div>
                <div class="my-2 ">

                    <Checkbox checked={isPersistent} on:change={() => isPersistent = !isPersistent}/><span>Repeat</span>
                    <div class="text-secondary text-sm">every 5 min until dismiss</div>
                </div>
            </div>
            <div class="m-auto pt-8">
                <span class="opacity-60">Advenced <i class="lnr lnr-arrow-down font-bold"></i></span>
                <div>

                </div>
            </div>
        </div>
        <div class="flex w-full justify-center mt-4">
            <span class="mx-1"><Action label="Create" on:click={saveInput}/></span>
            <span class="mx-1"><Action label="Dismiss" custom customClass="border-2 border-red-400 text-red-400" on:click={closeCreationBox} /></span>
        </div>
    </div>
{/if}

<SettingsBox unsupported={!ready}>
    <Title title="Reminders">
        <TitleIcon>
            <i class="lnr lnr-calendar-full text-primary settings-title-icon" style="color: #57ceff;"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Create a reminder'}} 
        description={{text:'Set and manage reminders', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action label="Create" on:click={openCreationBox}></Action>
    </PrimaryBox>
    <NestedBox available={true} label="test"></NestedBox>
</SettingsBox>