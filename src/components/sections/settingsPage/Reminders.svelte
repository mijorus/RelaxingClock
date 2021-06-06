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

    let title: HTMLElement;
    let minutesFromNow = 10;

    function initDB() {
        const request = window.indexedDB.open('reminders', 1);

        // request.onupgradeneeded = function(event) {
        //     event.target.re
        // }

        // request.onsuccess = function({target}) {
        //     const db
        // }
    }

    onMount(async () => {
        await tick();
        title.focus();
        canBeSummoned.set(false);

        if (window.indexedDB) {
            initDB();
        }
    })

</script>

<div class="fixed bottom-2 p-4 h-auto font-primary bg-secondary text-primary transform -translate-x-2/4 left-2/4 rounded-2xl z-50 shadow-box">
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
        </div>
        <div class="m-auto pt-8">
            <span class="opacity-60">Advenced <i class="lnr lnr-arrow-down font-bold"></i></span>
            <div>

            </div>
        </div>
    </div>
    <div class="flex w-full justify-center mt-4">
        <span class="mx-1"><Action zoomOnFocus label="Create"/></span>
        <span class="mx-1"><Action zoomOnFocus label="Dismiss" custom customClass="border-2 border-red-400 text-red-400"/></span>
    </div>
</div>

<SettingsBox>
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
        <Action label="Create"></Action>
    </PrimaryBox>
    <NestedBox available={true} label="test"></NestedBox>
</SettingsBox>