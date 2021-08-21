<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink } from '../../../stores/storedSettings';
import time from '../../../stores/time';

</script>

<SettingsBox>
    <Title title="Blinking dots">
        <TitleIcon>
            <i class="lnr lnr-eye text-primary settings-title-icon transition-opacity" class:opacity-30={$blink && ($time.seconds() % 2)}></i>
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Let the dots pulsing at rhythm'}} 
        description={{text:'You can keep the dots fixed if you find them distracting', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
        <Booleans state={$blink} label={'test'} on:change={(e) => blink.set(e.detail)}/>
    </PrimaryBox>
</SettingsBox>