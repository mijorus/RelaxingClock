<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from '../../elements/settings/Buttons/Action.svelte';
import { RemindersDB } from '../../../handlers/RemindersDB';
import { PinnedDB } from '../../../handlers/PinnedDB';

    async function clearData() {
        if (confirm('Are you sure?')) {
            [RemindersDB, PinnedDB].forEach(async idb => { 
                if (idb.db) await idb.removeAll();
            });

            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    }
</script>

<div class="border rounded-xl m-2 border-red-400 pt-1">
    <SettingsBox bordered={false} collapsable={false}>
        <Title title="Danger zone">
            <TitleIcon>
                <i class="lnr lnr-trash text-red-600 settings-title-icon"></i>
            </TitleIcon>
        </Title>    
        <PrimaryBox 
            label={{text: 'Clear data'}} 
            description={{text:'Clear all you data including reminders, pins, your Spotify credentials and setting. This cannot be undone.', iconClass: 'lnr lnr-question-circle'}}
            available={true}
        >
            <Action label="Delete" custom customClass="text-primary bg-red-600 border-2 border-red-600" on:click={() => clearData()}/>
        </PrimaryBox>
    </SettingsBox>
</div>