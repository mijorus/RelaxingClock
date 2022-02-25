<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import { blink, remoteTime, saveEnergy } from '../../../stores/storedSettings';
import { onMount } from 'svelte';
import { shortcuts } from '../../../stores/rooster';
import { fade } from "svelte/transition";
import axios from 'axios';

    interface RemoteTimeResponse {
        unixtime: number, 
        compleated: number
    }
    
    let ping: number;
    $: syncClock($remoteTime);

    async function syncClock(remoteTime: boolean) {
        if (!remoteTime) return;

        try {
            ping = 0;
            await axios.get('/.netlify/functions/remoteTime');
            
            const start = Date.now();
            const timeRes: RemoteTimeResponse = (await axios.get('/.netlify/functions/remoteTime')).data;
            // const timeResTest: RemoteTimeResponse = (await axios.get('https://www.timeapi.io/api/TimeZone/zone', {'params': {timeZone: 'Europe/Amsterdam'}})).data;
            ping = Date.now() - start - timeRes.compleated;
        } catch (err) {
            ping = -1;
            console.error(err);
        }
        
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
            description={{text:`In order to determine your correct time zone, a service provided by ipapi.co will be used.
                Please note that ipapi.co is fully GDPR compliant and stores this data only for a limited amount of time. Read their privacy policy at https://ipapi.co/privacy if you need more information
            `}}
            available={true}
        >
        <div class="flex items-center">
            {#if $remoteTime && (ping > 0)}
                <span class="inline-block text-xs mr-6 rounded-full text-primary" >{ping}ms</span>
            {:else if $remoteTime && (ping < 0)}
                <span class="inline-block text-red-500 mr-6 rounded-full" >
                    <i class="fas fa-exclamation-circle"></i>
                </span>
            {/if}
            <Booleans state={$remoteTime} label={'efficiency mode'} on:change={(e) => remoteTime.set(e.detail)}/>
        </div>
        </PrimaryBox>
    </SettingsBox>