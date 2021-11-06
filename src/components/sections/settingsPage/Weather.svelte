<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Booleans from "../../elements/settings/Buttons/Booleans.svelte";
import NestedBox from '../../elements/settings/NestedBox.svelte';
import { directGeocode, oneCallWeather } from '../../../lib/openweathermap/client';
import type { Location } from '../../../lib/openweathermap/client';
import Loader from '../../elements/Loader.svelte';
import { fade, slide } from 'svelte/transition';
import { convertCountryCode } from '../../../lib/openweathermap/ccodes';
import { clockFormat, lastWeatherUpdate, tempUnit, weather } from '../../../stores/storedSettings';
import { onMount } from 'svelte';
import { shortcuts } from '../../../stores/rooster';
import moment, { Moment } from 'moment';
import { tips } from '../../../stores/globalState';
import { mainWeatherConditions } from '../../../lib/openweathermap/mainConditions';
import type { Tip } from '../../../types';
import time from '../../../stores/time';
import anime from "animejs";

    let locationSearchQuery = '';
    let owLocations: Location[];
    let searchError = false;
    let isFetchingLocations = false;
    let currentLocation: string;
    const maxOWUpdateAge = 60;
    let nextWeatherUpdate: Moment;

    $: searchLocation(locationSearchQuery);
    $: periodicCheck($time);

    function periodicCheck(time: Moment) {
        if (nextWeatherUpdate && time.isSameOrAfter(nextWeatherUpdate)) {
            autoUpdate(true);
            updateWeatherData();
        }
    }

    function autoUpdate(enable = true) {
        if (enable) {
            console.log('auto update weather in '+maxOWUpdateAge+' minutes');
            nextWeatherUpdate = moment().add(maxOWUpdateAge, 'minutes');
        } else {
            nextWeatherUpdate = null;
        }
    }

    function handleWeatherSwitch(status: boolean) {
        weather.set(status); 
        autoUpdate(status);
        if (!status) {
            lastWeatherUpdate.set(null);
        }
        else  {
            updateWeatherData();
        }
    }

    let slTimeout: NodeJS.Timeout;
    function searchLocation(query: string) {
        if (!query) return;
        clearTimeout(slTimeout);
        owLocations = []; isFetchingLocations = true; searchError = false;
        slTimeout = setTimeout(async () => {
            isFetchingLocations = false;
            owLocations = (await directGeocode(query).catch(e => { console.error(e); searchError = true; return []; }));
            console.log(owLocations);
        }, 1000);
        
    }

    function saveCustomLocation(l: Location) {
        currentLocation = `${l.lat},${l.lon},${l.country},${l.name}`;
        localStorage.setItem('currentLocation', currentLocation);
        updateWeatherData();
        autoUpdate(true);
    }

    async function updateWeatherData() {
        if (currentLocation) {
            console.log('updating weather data');
            const latlong = currentLocation.split(',');
            anime({'targets': '#refresh-weather-btn', rotate: '+=720', duration: 3000, easing: 'linear'});
            
            try {
                const result = await oneCallWeather(parseFloat(latlong[0]), parseFloat(latlong[1]), 'minutely,daily'); 
                lastWeatherUpdate.set(result); 
            } catch (e) {
                console.error(e);
                lastWeatherUpdate.set(undefined); 
            }
        }
    }

    

    onMount(() => {
        if ($weather && localStorage.getItem('currentLocation')) {
            autoUpdate(true);
            currentLocation = localStorage.getItem('currentLocation');
            if ($lastWeatherUpdate?.current?.dt < (~~(Date.now()/1000) - maxOWUpdateAge * 60)) {
                updateWeatherData();
            }
        }

        // shortcuts.set('weather', {
        //     'background': 'rgb(234,108,73)',
        //     'color': '#000',
        //     'arguments': {
        //         'enable': {
        //             async callback() { handleWeatherSwitch(true); return true}
        //         },
        //         'disable': {
        //             async callback() { handleWeatherSwitch(false); return true}
        //         },
        //         'update': {
        //             async callback() { updateWeatherData(); return true}
        //         }
        //     },
        //     async examples() {
        //         return {
        //             'namespace': 'Examples',
        //             'group': [
        //                 {'argument': 'disable', 'tip': 'Disable the weather widget', 'example': ''}, 
        //                 {'argument': 'enable', 'tip': 'The opposite XD', 'example': ''},
        //                 {'argument': 'update', 'tip': 'Refresh the forecasts', 'example': ''}
        //             ]
        //         }
        //     }
        // });
    })
</script>

<SettingsBox>
    <Title title="Weather">
        <TitleIcon>
            <svg class="w-16" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1550 1160"><g fill="rgb(234,108,73)" style="transform: none;"><g><path d="M330 1101 c-14 -27 -13 -37 6 -55 12 -13 39 -16 128 -16 97 0 115 -3 129 -18 22 -24 21 -38 -3 -62 -18 -18 -33 -20 -185 -20 -146 0 -165 -2 -173 -17 -15 -27 3 -62 35 -68 43 -9 58 -20 61 -44 7 -43 -13 -51 -122 -51 -117 0 -140 -9 -134 -55 3 -26 8 -30 36 -33 32 -3 32 -3 32 -89 0 -47 7 -113 16 -147 45 -177 186 -327 362 -388 97 -33 268 -32 362 3 231 87 380 309 368 549 -3 65 -3 65 82 70 85 5 85 5 88 35 6 53 -6 55 -284 55 -278 0 -288 2 -268 58 7 21 19 28 52 35 33 6 43 13 48 33 9 36 -12 54 -62 54 -69 0 -106 47 -66 83 16 14 44 17 188 17 178 0 194 4 194 45 0 45 -2 45 -452 45 -412 0 -428 -1 -438 -19z"></path><path d="M1052 918 c-37 -37 7 -78 84 -78 69 0 104 25 86 64 -11 25 -16 26 -85 26 -43 0 -78 -5 -85 -12z"></path><path d="M1322 918 c-18 -18 -14 -56 7 -68 28 -14 124 -13 145 3 12 9 17 23 14 42 -3 30 -3 30 -78 33 -50 2 -79 -1 -88 -10z"></path></g></g></svg>
        </TitleIcon>
    </Title>
    <div>
        <PrimaryBox
            label={{text: $weather && !currentLocation ? 'Please set a location below' : 'Enable weather'}}
            description={{text:'Forecast provided by openweathermap.org', iconClass: 'lnr lnr-question-circle'}}
            available={true}
        >
            <div class="flex items-center">
                <span id="refresh-weather-btn" class="fas fa-sync-alt opacity-50 mr-4 hover:opacity-100 cursor-pointer" on:click={() => updateWeatherData()} 
                    class:pointer-events-none={!$weather}></span>
                <Booleans state={$weather} label={'weather'} on:change={(e) => handleWeatherSwitch(e.detail)} />
            </div>
        </PrimaryBox>
    </div>
    <NestedBox bordered label="Temperature unit" available={$weather === true}>
        <Booleans state={$tempUnit === 'C'} label={'weather'} states={['°C', '°F']} dimentions={[10, 10]} on:change={(e) => tempUnit.set(e.detail ? 'C' : 'F') }/>
    </NestedBox>
    <NestedBox expandable available={$weather === true} label="Set location" on:click={() => setTimeout(() => {const el = document.getElementById('search-ow'); if (el) el.focus()}, 500)}
            description={$lastWeatherUpdate?.current?.dt ? `last update: ${moment($lastWeatherUpdate.current.dt, 'X').format($clockFormat === '24h' ? 'HH:mm' : 'hh:mm')}` : ''}>
            <div class="p-2" id="set-location">
            {#if currentLocation && !locationSearchQuery.length}
                <div class="relative bg-tertiary rounded-lg my-2 p-3 cursor-pointer hover:opacity-80 transition-all" transition:slide={{duration: 200, delay: 450}}>
                    <p class="text-md">{currentLocation.split(',')[3]}, {convertCountryCode(currentLocation.split(',')[2])}</p>
                    <p class="text-sm text-secondary">Selected location</p>
                </div>
            {/if}
            <div class="flex flex-row items-center w-2/3 m-auto bg-tertiary mt-1 py-1 px-2 rounded-md">
                <i class="lnr lnr-magnifier mx-2"></i> <input type="text" id="search-ow" class="bg-transparent" bind:value={locationSearchQuery} autocomplete="false" name="hidden">
            </div>
            <div class="my-1">
                { #if isFetchingLocations}
                    <div class="text-center transform scale-50"><Loader /></div>
                {:else if !isFetchingLocations && !searchError && owLocations && locationSearchQuery.length}
                    {#each owLocations as l, i}
                        <div class="relative bg-tertiary rounded-lg my-2 p-3 cursor-pointer hover:opacity-80 transition-all" in:slide={{delay: i * 30}} on:click={() => saveCustomLocation(l)}>
                            <p class="text-md">{l.name}</p>
                            <p class="text-sm text-secondary">{convertCountryCode(l.country)} [{l.country}]{l.state ? `, ${l.state}` : ''}</p>
                            {#if `${l.lat},${l.lon},${l.country},${l.name}` === currentLocation}
                                <div class="absolute right-0 top-1/2 p-2" style="transform: translateY(-50%);"><i class="icon-checkmark text-green-500"></i></div>
                            {/if}
                        </div>
                    {/each}
                {:else if !isFetchingLocations && searchError}
                    <div class="text-center text-red-600">
                        <p><i class="fas fa-exclamation-circle text-xl"></i></p>
                        <p class="text-sm">Ooops something went wrong, please try again later</p>
                    </div>
                {/if}
            </div>
            {#if !owLocations}
                <p class="pt-2 text-center opacity-60 text-sm" out:fade><span class="lnr lnr-question-circle"></span> Search locations on openweathermap</p>
            {/if}
        </div>
    </NestedBox>
</SettingsBox>