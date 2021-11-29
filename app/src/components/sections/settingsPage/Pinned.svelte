<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Pin from '../../icons/Pin.svelte';
import Action from '../../elements/settings/Buttons/Action.svelte';
import { pinnedDBisReady } from '../../../stores/globalState';

    function triggerRooster(e) {
        window.dispatchEvent( new KeyboardEvent('keydown', {key: 'P', altKey: true}));
    }

</script>

<SettingsBox unsupported={!$pinnedDBisReady}>
    <Title title="Pins">
        <TitleIcon noFill>
            <Pin color="red" size="36"/>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Pin a new message'}} 
        description={{text:'Create a new reminder which will always stay on top using the Rooster', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Action label="Create" on:click={triggerRooster} />
    </PrimaryBox>
</SettingsBox>