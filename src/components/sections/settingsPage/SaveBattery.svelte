<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink, saveEnergy } from '../../../stores/storedSettings';

</script>

<SettingsBox bordered={false}>
    <Title title="Efficiency mode">
        <TitleIcon>
            <i class="lnr lnr-leaf text-green-500 settings-title-icon"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Reduce motion when not in use'}} 
        description={{text:'Reduce motion and animations when the window in not in focus. Can help if your laptop is running on battery or you want to reduce the impact on your GPU', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Booleans state={$saveEnergy} label={'efficiency mode'} on:change={(e) => saveEnergy.set(e.detail)}/>
    </PrimaryBox>
</SettingsBox>