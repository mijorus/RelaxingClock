<script lang="ts">
import moment from "moment-timezone"
import { fade } from "svelte/transition";
import type { Hourly } from "../../lib/openweathermap/client";
import { getConditionIcon, mainWeatherConditions } from "../../lib/openweathermap/mainConditions";
import type { WeatherCondition } from "../../lib/openweathermap/mainConditions";
import { lastWeatherUpdate, tempUnit, weather } from "../../stores/storedSettings";
import { kTemperatureConverter } from "../../utils/utils";
import type { Tip } from "../../types";
import { modalContent, tips } from "../../stores/globalState";
import Modal from "../elements/Modal.svelte";
import WeatherModal from "../modals/WeatherModal.svelte";

    let data: Hourly[] = [];
    let icon: string;
    let currentLocation: string[];
    let oldWeatherUpdate;
    let isNight = false;
    // modalContent.set(WeatherModal);

    $:  {
        if ( $weather && $lastWeatherUpdate?.hourly && ( $lastWeatherUpdate !== oldWeatherUpdate ) ) {
            console.log('updating weather widget'); 
            
            data = [];
            for (let index = 0; index < 24; index++) data.push(null);
                
            $lastWeatherUpdate.hourly.forEach((el: Hourly) => {
                const momentTZ = moment().tz($lastWeatherUpdate.timezone);
                const date = moment(el.dt, 'X').tz($lastWeatherUpdate.timezone);
                if (date.isSame(momentTZ, 'day') && date.isSameOrAfter(momentTZ)) data[date.hours()] = el;
            });

            const currentWeather: WeatherCondition = $lastWeatherUpdate.current.weather[0];
            const momentSunset = moment($lastWeatherUpdate.current.sunset, 'X');
            const momentSunrise = moment($lastWeatherUpdate.current.sunrise, 'X');
            
            isNight = false;
            icon = getConditionIcon(currentWeather).icon ?? undefined;
            if ((moment().isSameOrAfter(momentSunset) || moment().isBefore(momentSunrise)) && getConditionIcon(currentWeather).icon_night) {
                isNight = true;
                icon = getConditionIcon(currentWeather).icon_night;
            }

            currentLocation = localStorage.getItem('currentLocation') ? localStorage.getItem('currentLocation').split(',') : null;
            oldWeatherUpdate = $lastWeatherUpdate;
        }
    }

    function showWeatherTips() {
        let t: Tip[] = [];
        for (const prop in mainWeatherConditions) {
            t.push({'name': `<span class="w-3 h-3 inline-block rounded-full pr-1" style="background-color: ${mainWeatherConditions[prop].color ?? ''}"></span>`, 'shortcut': prop})
        }

        tips.set(t);
    }
</script>

{#if $weather}
    <div class="relative flex flex-row items-center mt-5 mb-7" transition:fade on:mouseenter={() => { showWeatherTips()}} on:mouseleave={() => tips.set(null)}>
        {#if data.length}
            {#each data as d, i}{#if !d}<span class="w-3 h-1 inline-block overlap bg-secondary" class:rounded-l-xl={i === 0}></span>{/if}{/each}<span class="inline-block w-16 h-1 bg-highlighted relative rounded-xl">{#if icon}<img class="absolute left-1/2 transform -translate-x-2/4 -translate-y-2/4 inline-block w-16 hover:scale-125 transition-transform" src="/media/{icon}" alt=""/>{/if}</span>{#each data as d, i}{#if d}<span class="w-3 h-1 inline-block p-0 overlap" style="background-color: {isNight && mainWeatherConditions[d.weather[0].main].color_night ? mainWeatherConditions[d.weather[0].main].color_night : mainWeatherConditions[d.weather[0].main].color};" class:rounded-r-xl={i === (data.length - 1)}></span>{/if}
            {/each}
        {/if}
    </div>
    {#if currentLocation && $lastWeatherUpdate}
        <p class="text-center text-secondary">{currentLocation[3]}, {currentLocation[2]} &middot; {~~(kTemperatureConverter($lastWeatherUpdate.current.temp, $tempUnit))}°{$tempUnit}</p>
    {/if}
{/if}

<style>
    .overlap {
        margin-left: -1px;
        margin-right: -1px;
    }
</style>