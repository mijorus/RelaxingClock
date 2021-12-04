<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink } from '../../../stores/storedSettings';
import anime from 'animejs';
import { cbDefault } from '../../../utils/animations';

$: {
    if ($blink) {
        anime({
            targets: '.blick-icon',
            opacity: [0.3, 1],
            duration: 400,
            loop: 5,
            direction: 'alternate',
            easing: cbDefault,
        })
    }
}

</script>

<SettingsBox bordered={false} id="blinking-dots">
    <Title title="Blinking dots">
        <TitleIcon>
            <i class="lnr blick-icon lnr-eye text-primary settings-title-icon" class:opacityy-30={!$blink}></i>
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

<style>
    .opacityy-30 {
        opacity: 0.3 !important;
    }
</style>