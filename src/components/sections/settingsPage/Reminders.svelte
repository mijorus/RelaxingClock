<script lang="ts">
    import SettingsBox from '../../elements/SettingsBox.svelte';
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
    import Action from '../../elements/settings/Buttons/Action.svelte';
    import NestedBox from '../../elements/settings/NestedBox.svelte';
    import { onMount, tick } from 'svelte';
    import { canBeSummoned } from '../../../stores/rooster';
    import moment, { duration } from 'moment';
    import { fade, fly, slide } from 'svelte/transition';
import Checkbox from '../../elements/settings/Buttons/Checkbox.svelte';

    let ready = false;

    let title: HTMLInputElement;
    let minutesFromNow = 10;
    let creationBoxOpened = true;
    let isPersistent = false;

    function initDB() {
        const request = window.indexedDB.open('data', 1);

        request.onupgradeneeded = function(event) {
            event.target.result.createObjectStore('reminders', {keyPath: 'createdAt'});
            ready = true;
        }

        request.onsuccess = function() {
            ready = true;
        }
    }

    function saveReminder(title:string, createdAt: number, data = {}) {
        const requestDB = window.indexedDB.open('data', 1);
        requestDB.onsuccess = function(event) {
            const db: IDBDatabase = event.target.result;
            const t = db.transaction('reminders', 'readwrite')
                .objectStore('reminders')
                .add({
                    title,
                    createdAt,
                    ...data
                });
            
            t.onsuccess = function() {
                creationBoxOpened = false;
                console.log('reminder created');
            }
        }
    }

    function handleReminderCreationClick() {
        if (title.value === '' || !minutesFromNow) {
            return;
        }

        saveReminder(title.value, moment().add(minutesFromNow, 'minutes').unix(), {
            type: 'simple',
        })
    }

    function setPersistent() {
        isPersistent = !isPersistent;
    }

    onMount(async () => {
        await tick();
        title.focus();
        canBeSummoned.set(false);

        if (window.indexedDB) initDB();     
    })

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

                    <Checkbox checked={isPersistent} on:change={setPersistent}/><span>Persistent</span>
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
            <span class="mx-1"><Action zoomOnFocus label="Dismiss" custom customClass="border-2 border-red-400 text-red-400" on:click={() => creationBoxOpened = false} /></span>
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
        <Action label="Create" on:click={() => creationBoxOpened = true}></Action>
    </PrimaryBox>
    <NestedBox available={true} label="test"></NestedBox>
</SettingsBox>