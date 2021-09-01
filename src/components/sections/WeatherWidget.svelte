<script lang="ts">
import moment from "moment";

import type { Hourly, OneCallWeatherResponse } from "../../lib/openweathermap/client";
import { mainWeatherConditions } from "../../lib/openweathermap/mainConditions";
import { lastWeatherUpdate } from "../../stores/storedSettings";

    let data: Hourly[] = [];

    $:  {
        if ($lastWeatherUpdate?.hourly) {
            data = [];
            for (let index = 0; index < 24; index++) data.push(null);
                
            $lastWeatherUpdate.hourly.forEach((el: Hourly) => {
                const date = moment(el.dt, 'X');
                if (date.isSame(moment(), 'day')) data[date.hours()] = el;
            });
        }
    };
</script>

<div class="text-primary">
    {#if data.length}
        {#each data as d, i}
            <span class="w-3 h-1 inline-block" style="background-color: {d ?  mainWeatherConditions[d.weather[0].main].color : 'rgb(63, 63, 63)'};"
                class:rounded-r-lg={i === (data.length - 1) || d === null && data[i+1]} class:rounded-l-lg={i === 0 || (!data[i-1] && data[i])} class:mr-2={d === null && data[i+1]}></span>
        {/each}
    {/if}
</div>