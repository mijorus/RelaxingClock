<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink, saveEnergy } from '../../../stores/storedSettings';
import { onMount } from 'svelte';
import { shortcuts } from '../../../stores/rooster';

    onMount(() => {
        shortcuts.set('efficiency', {
            'color': 'white',
            'background': 'green',
            'arguments': {
                'enable': {
                    async callback() {
                        saveEnergy.set(true)
                        return true;
                    }
                },
                'disable': {
                    async callback() {
                        saveEnergy.set(false)
                        return true;
                    }
                }
            },
            async examples(a, p) {
                return {
                    'namespace': 'Examples',
                    'group': [
                        {'argument': $saveEnergy ? 'disable' : 'enable', 'example': '', tip: 'Toggle efficiency mode'}, 
                    ]
                }
            }
        })
    })

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