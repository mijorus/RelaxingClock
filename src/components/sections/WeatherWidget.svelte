<script lang="ts">
import moment from "moment";
import { fade } from "svelte/transition";
import type { Hourly } from "../../lib/openweathermap/client";
import { mainWeatherConditions } from "../../lib/openweathermap/mainConditions";
import { lastWeatherUpdate, weather } from "../../stores/storedSettings";

    let data: Hourly[] = [];
    let icon: string;
    let customLocation: string[];

    $:  {
        if ($lastWeatherUpdate?.hourly) {
            data = [];
            for (let index = 0; index < 24; index++) data.push(null);
                
            $lastWeatherUpdate.hourly.forEach((el: Hourly) => {
                const date = moment(el.dt, 'X');
                if (date.isSame(moment(), 'day')) data[date.hours()] = el;
            });

            icon = mainWeatherConditions[data.find(e => e !== null).weather[0].main]?.icon;
            customLocation = localStorage.getItem('customLocation') ? localStorage.getItem('customLocation').split(',') : null;
        }
    };
</script>

{#if $weather}
    <div class="relative flex flex-row items-center" transition:fade>
        {#if data.length}
            {#each data as d, i}{#if !d}<span class="w-3 h-1 inline-block" style="background-color: rgb(63, 63, 63);" ></span>{/if}{/each}
            {#if icon}<img class="inline-block w-16" src="/media/{icon}" alt=""/>{/if}{#each data as d, i}{#if d}<span class="w-3 h-1 inline-block p-0 m-0" style="background-color: {mainWeatherConditions[d.weather[0].main].color};"></span>{/if}
            {/each}
        {/if}
    </div>
    {#if customLocation}
        <p class="text-center text-secondary">{customLocation[3]}, {customLocation[2]}</p>
    {/if}
{/if}