<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { presentation } from '../../../stores/storedSettings';
</script>

<SettingsBox bordered={false}>
    <Title title="High contrast">
        <TitleIcon>
            <i class="icon-lightbulb text-primary settings-title-icon transition-opacity" class:opacity-50={!$presentation} style="color: #fcf4ac;"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Keep the colors vibrant'}} 
        description={{text:'Keep the colors bright and vivid when the screen saver is active, super useful if you want <b>Relaxing Clock</b> to shine!', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Booleans state={$presentation} label={'high contrast'} on:change={(e) => presentation.set(e.detail)}/>
    </PrimaryBox>
</SettingsBox>