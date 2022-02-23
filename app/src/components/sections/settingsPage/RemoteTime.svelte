<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink, remoteTime, saveEnergy } from '../../../stores/storedSettings';
import { onMount } from 'svelte';
import { shortcuts } from '../../../stores/rooster';
import axios from 'axios';
    
        $: syncClock($remoteTime);

        async function syncClock(remoteTime: boolean) {
            if (!remoteTime) return;

            const timeRes: {[key: string]: string} = (await axios.get('/.netlify/functions/remoteTime')).data;
            console.log(timeRes);
            
        }
    
    </script>
    
    <SettingsBox bordered={false} id="remote-time">
        <Title title="Remote time">
            <TitleIcon>
                <i class="lnr lnr-earth text-blue-300 settings-title-icon"></i>
            </TitleIcon>
        </Title>
        <PrimaryBox 
            label={{text: 'Get time from the internet'}} 
            description={{text:'Syncronize the clock with a remote server'}}
            available={true}
        >
            <Booleans state={$remoteTime} label={'efficiency mode'} on:change={(e) => remoteTime.set(e.detail)}/>
        </PrimaryBox>
    </SettingsBox>