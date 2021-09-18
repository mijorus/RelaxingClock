<script lang="ts">
import moment from "moment";
import { fade } from "svelte/transition";
import type { Hourly } from "../../lib/openweathermap/client";
import { mainWeatherConditions } from "../../lib/openweathermap/mainConditions";
import { lastWeatherUpdate, tempUnit, weather } from "../../stores/storedSettings";
import { kTemperatureConverter } from "../../utils/utils";

    let data: Hourly[] = [];
    let icon: string;
    let currentLocation: string[];
    let oldWeatherUpdate;

    $:  {
        if ( $weather && $lastWeatherUpdate?.hourly && ( $lastWeatherUpdate !== oldWeatherUpdate ) ) {
            console.log('updating weather widget'); data = [];
            for (let index = 0; index < 24; index++) data.push(null);
                
            $lastWeatherUpdate.hourly.sort((a, b) => a.dt - b.dt).forEach((el: Hourly) => {
                const date = moment(el.dt, 'X');
                if (date.isSame(moment(), 'day') && date.isSameOrAfter(moment())) data[date.hours()] = el;
            });

            icon = mainWeatherConditions[$lastWeatherUpdate.current.weather[0].main]?.icon;
            currentLocation = localStorage.getItem('currentLocation') ? localStorage.getItem('currentLocation').split(',') : null;
            oldWeatherUpdate = $lastWeatherUpdate;
        }
    };
</script>

{#if $weather}
    <div class="relative flex flex-row items-center" transition:fade>
        {#if data.length}
            {#each data as d, i}{#if !d}<span class="w-3 h-1 inline-block" style="background-color: rgb(63, 63, 63);" class:rounded-l-xl={i === 0}></span>{/if}{/each}{#if icon}<img class="inline-block w-16" src="/media/{icon}" alt=""/>{/if}{#each data as d, i}{#if d}<span class="w-3 h-1 inline-block p-0 m-0" style="background-color: {mainWeatherConditions[d.weather[0].main].color};" class:rounded-r-xl={i === (data.length - 1)}></span>{/if}
            {/each}
        {/if}
    </div>
    {#if currentLocation && $lastWeatherUpdate}
        <p class="text-center text-secondary">{currentLocation[3]}, {currentLocation[2]} - {~~(kTemperatureConverter($lastWeatherUpdate.current.temp, $tempUnit))}°{$tempUnit}</p>
    {/if}
{/if}

