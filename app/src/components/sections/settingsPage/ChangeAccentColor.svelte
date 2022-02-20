<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Action from '../../elements/settings/Buttons/Action.svelte';
import { colorSelector, modalContent } from '../../../stores/globalState';
import IntroTutorialModal from '../../modals/IntroTutorialModal.svelte';
import { customColors } from '../../../utils/utils';
import { accentColor } from '../../../stores/storedSettings';

    function openColorPicker(e) {
        colorSelector.set({show: true, colors: [...customColors, 'white'], x:e.pageX, y: e.pageY, callback: changeAccentColor });
        document.getElementById('change-accent-color').style.filter = 'blur(2px)';
    }

    function changeAccentColor(color: string) {
        accentColor.set(color);
        document.getElementById('change-accent-color').style.filter = null;
    }
</script>

<SettingsBox bordered={false} id="change-accent-color">
    <Title title="Accent color">
        <TitleIcon noFill>
            <img src="/media/color-palette.png" alt="accent color" class="settings-title-icon w-10 md:w-14">
        </TitleIcon>
    </Title>
    <PrimaryBox 
        label={{text: 'Change the accent color'}} 
        description={{text:'Customize Relaxing Clock', iconClass: 'lnr lnr-question-circle'}}
        available={true}
    >
    <div class="flex items-center">
        <span class="inline-block w-2 h-2 mr-6 rounded-full" style="background-color: {$accentColor}"></span>
        <Action label="Open" on:click={openColorPicker}/>
    </div>
    </PrimaryBox>
</SettingsBox>