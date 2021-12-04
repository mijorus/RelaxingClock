<script lang="ts">
import moment from "moment";
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
                
            $lastWeatherUpdate.hourly.sort((a, b) => a.dt - b.dt).forEach((el: Hourly) => {
                const date = moment(el.dt, 'X');
                if (date.isSame(moment(), 'day') && date.isSameOrAfter(moment())) data[date.hours()] = el;
            });

            const currentWeather: WeatherCondition = $lastWeatherUpdate.current.weather[0];
            const momentSunset = moment($lastWeatherUpdate.current.sunset, 'X');
            const momentSunrise = moment($lastWeatherUpdate.current.sunrise, 'X');
            
            if ((moment().isSameOrAfter(momentSunset) || moment().isBefore(momentSunrise)) && getConditionIcon(currentWeather).icon_night) {
                isNight = true;
                icon = getConditionIcon(currentWeather).icon_night;
            } else {
                isNight = false;
                icon = getConditionIcon(currentWeather).icon ?? undefined;
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
    <div class="relative flex flex-row items-center" transition:fade on:mouseenter={() => { showWeatherTips()}} on:mouseleave={() => tips.set(null)}>
        {#if data.length}
            {#each data as d, i}{#if !d}<span class="w-3 h-1 inline-block overlap" style="background-color: rgb(63, 63, 63);" class:rounded-l-xl={i === 0}></span>{/if}{/each}{#if icon}<img class="inline-block w-16" src="/media/{icon}" alt=""/>{/if}{#each data as d, i}{#if d}<span class="w-3 h-1 inline-block p-0 overlap" style="background-color: {isNight && mainWeatherConditions[d.weather[0].main].color_night ? mainWeatherConditions[d.weather[0].main].color_night : mainWeatherConditions[d.weather[0].main].color};" class:rounded-r-xl={i === (data.length - 1)}></span>{/if}
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