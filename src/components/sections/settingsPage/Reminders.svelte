<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import Action from '../../elements/settings/Buttons/Action.svelte';
    import NestedBox from '../../elements/settings/NestedBox.svelte';
    import { onDestroy, onMount, tick } from 'svelte';
    import { canBeSummoned } from '../../../stores/rooster';
    import moment, { Moment } from 'moment';
    import { fly } from 'svelte/transition';
    import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';
    import time from '../../../stores/time';
    import { Reminders } from '../../../handlers/Reminder';

    let ready = false;
    let title: HTMLInputElement;
    let minutesFromNow = 10;
    let creationBoxOpened = true;
    let isPersistent = false;

    $: periodicCheck(ready, $time)

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

    async function saveReminder(title: string, at: Moment, data = {}, callback: () => void = null) {
        await Reminders.create(title, at, data);
        callback(); 
    }

    function handleReminderCreationClick() {
        if (title.value === '' || !minutesFromNow) return;

        const timestamp = moment().add(minutesFromNow, 'minutes');
        saveReminder(title.value, timestamp, { type: 'simple' }, () => creationBoxOpened = false);
    }

    async function openCreationBox() {
        creationBoxOpened = true;
        await tick();
        canBeSummoned.set(false);
        title.focus();
    }

    function closeCreationBox() {
        creationBoxOpened = false;
        canBeSummoned.set(true);
    }

    onMount(async () => {
        try {
            await Reminders.initDB();
            ready = true;
        } catch(err) {
            console.error(err);
        }
    }); 

</script>

{#if creationBoxOpened}
    <div 
        transition:fly={{y: 100, duration: 300}}
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

                    <Checkbox checked={isPersistent} on:change={() => isPersistent = !isPersistent}/><span>Persistent</span>
                </div>
            </div>
            <div class="m-auto pt-8">
                <span class="opacity-60">Advenced <i class="lnr lnr-arrow-down font-bold"></i></span>
                <div>

                </div>
            </div>
        </div>
        <div class="flex w-full justify-center mt-4">
            <span class="mx-1"><Action zoomOnFocus label="Create" on:click={handleReminderCreationClick}/></span>
            <span class="mx-1"><Action zoomOnFocus label="Dismiss" custom customClass="border-2 border-red-400 text-red-400" on:click={closeCreationBox} /></span>
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